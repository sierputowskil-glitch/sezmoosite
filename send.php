<?php
/**
 * SEZMOO — obsługa formularza kontaktowego (PL + EN)
 * Hosting: Cyberfolks (Apache + PHP). Zwraca JSON.
 */

declare(strict_types=1);

const MAIL_TO      = 'biuro@sezmoo.com';
const MAIL_FROM    = 'no-reply@sezmoo.com';   // MUSI być skrzynką/aliasem w domenie sezmoo.com
const MAIL_SUBJECT = 'Nowe zapytanie ze strony sezmoo.com';
const RATE_SECONDS = 20;                       // min. odstęp między wysyłkami z jednego IP
const MIN_FILL_SEC = 4;                        // człowiek nie wypełni formularza szybciej
const MAX_FORM_AGE = 7200;                     // 2h — po tym czasie token wygasa
const MAX_LINKS    = 2;                        // spam wagonami wkleja odnośniki
const FORM_SECRET  = 'szm_8adb9e4e342a75780ee772d3e9486154ad85d4f77ad5251556e887b4e97deb45';  // dowolny długi losowy ciąg

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function fail(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail('Method not allowed', 405);
}

// --- honeypot: boty wypełniają ukryte pole ---
if (trim((string)($_POST['bot-field'] ?? '')) !== '') {
    echo json_encode(['ok' => true]); // cicho udajemy sukces
    exit;
}

$now = time();

// --- time trap: podpisany znacznik czasu wygenerowany przy wczytaniu strony ---
$ts  = (string)($_POST['ts'] ?? '');
$sig = (string)($_POST['sig'] ?? '');
if ($ts === '' || $sig === '' || !ctype_digit($ts)) {
    fail('Nieprawidłowe żądanie.');
}
if (!hash_equals(hash_hmac('sha256', $ts, FORM_SECRET), $sig)) {
    fail('Nieprawidłowe żądanie.');           // token podrobiony lub bot pominął stronę
}
$age = $now - (int)$ts;
if ($age < MIN_FILL_SEC) {
    fail('Formularz wysłany zbyt szybko.', 429);
}
if ($age > MAX_FORM_AGE) {
    fail('Formularz wygasł — odśwież stronę.', 419);
}

// --- rate limit po IP (działa też bez ciasteczek) ---
$ipRaw   = (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
$lockDir = sys_get_temp_dir() . '/sezmoo-form';
@mkdir($lockDir, 0700, true);
$lockFile = $lockDir . '/' . hash('sha256', $ipRaw . FORM_SECRET);
if (is_file($lockFile) && ($now - (int)@filemtime($lockFile)) < RATE_SECONDS) {
    fail('Za szybko — odczekaj chwilę.', 429);
}

// --- pobranie i walidacja pól ---
$clean = static function (string $key, int $max = 300): string {
    $v = trim((string)($_POST[$key] ?? ''));
    $v = str_replace(["\r", "\n", "\0"], ' ', $v);   // ochrona przed header injection
    return mb_substr($v, 0, $max);
};

$name    = $clean('name', 120);
$email   = $clean('email', 160);
$phone   = $clean('phone', 40);
$company = $clean('company', 160);
$need    = $clean('need', 80);
$message = mb_substr(trim((string)($_POST['message'] ?? '')), 0, 5000);
$consent = isset($_POST['consent']);
$lang    = ($clean('lang', 4) === 'en') ? 'en' : 'pl';
$origin  = $clean('form-name', 40) === 'abonament' ? 'abonament' : 'kontakt';

if ($name === '' || $message === '') {
    fail('Uzupełnij wymagane pola.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('Nieprawidłowy adres e-mail.');
}
if (!$consent) {
    fail('Wymagana zgoda na przetwarzanie danych.');
}
if (mb_strlen($message) < 10) {
    fail('Wiadomość jest zbyt krótka.');
}

// --- filtr treści: nadmiar linków i klasyczne wzorce spamu ---
if (preg_match_all('~https?://|www\.~i', $name . ' ' . $message) > MAX_LINKS) {
    fail('Wiadomość odrzucona.');
}
if (preg_match('~\[url=|\[/url\]|<a\s+href~i', $name . ' ' . $message)) {
    fail('Wiadomość odrzucona.');
}
if (preg_match('~\b(seo\s+services|backlinks?|crypto\s+invest|viagra|casino|loan\s+offer)\b~i', $message)) {
    fail('Wiadomość odrzucona.');
}
// pole "name" z odnośnikiem to zawsze bot
if (preg_match('~https?://~i', $name)) {
    fail('Wiadomość odrzucona.');
}

// --- treść wiadomości ---
$ip   = $ipRaw;
$when = date('Y-m-d H:i:s');

$companyLine = $company !== '' ? "Firma           : {$company}\n" : '';
$originLine  = $origin === 'abonament' ? "Formularz       : abonament\n" : '';

$body = <<<TXT
Nowe zapytanie z formularza na sezmoo.com
{$originLine}
Imię i nazwisko : {$name}
{$companyLine}E-mail          : {$email}
Telefon         : {$phone}
Obszar          : {$need}
Język formularza: {$lang}

Wiadomość:
{$message}

---
Zgoda RODO: TAK (checkbox zaznaczony)
Data        : {$when}
IP          : {$ip}
TXT;

$headers = [
    'From'                      => sprintf('SEZMOO <%s>', MAIL_FROM),
    'Reply-To'                  => sprintf('%s <%s>', $name, $email),
    'MIME-Version'              => '1.0',
    'Content-Type'              => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => '8bit',
    'X-Mailer'                  => 'sezmoo-form',
];

$headerLines = '';
foreach ($headers as $k => $v) {
    $headerLines .= $k . ': ' . $v . "\r\n";
}

$subject = '=?UTF-8?B?' . base64_encode(MAIL_SUBJECT . ' — ' . $name) . '?=';
$sent = @mail(MAIL_TO, $subject, $body, $headerLines, '-f' . MAIL_FROM);

if (!$sent) {
    fail('Nie udało się wysłać wiadomości.', 500);
}

@touch($lockFile);
echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
