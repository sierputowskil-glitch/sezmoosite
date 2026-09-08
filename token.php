<?php
/**
 * SEZMOO — wydaje podpisany znacznik czasu dla formularza kontaktowego.
 * Strony są statyczne, więc token pobiera JS przy wczytaniu sekcji kontaktu.
 * FORM_SECRET musi być IDENTYCZNY jak w send.php.
 */

declare(strict_types=1);

const FORM_SECRET = 'szm_8adb9e4e342a75780ee772d3e9486154ad85d4f77ad5251556e887b4e97deb45';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$ts = (string)time();

echo json_encode([
    'ts'  => $ts,
    'sig' => hash_hmac('sha256', $ts, FORM_SECRET),
]);
