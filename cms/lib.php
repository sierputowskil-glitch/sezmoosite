<?php
/**
 * SEZMOO CMS — warstwa danych i renderowania.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

/* ── dane ───────────────────────────────────────────────── */

function posts_all(): array {
    if (!is_file(POSTS_FILE)) return [];
    $raw = file_get_contents(POSTS_FILE);
    $data = json_decode((string)$raw, true);
    return is_array($data) ? $data : [];
}

function posts_save(array $posts): bool {
    if (!is_dir(DATA_DIR)) @mkdir(DATA_DIR, 0755, true);
    usort($posts, static fn($a, $b) => strcmp((string)($b['date'] ?? ''), (string)($a['date'] ?? '')));
    $json = json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $tmp  = POSTS_FILE . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false) return false;
    return rename($tmp, POSTS_FILE);
}

/** Opublikowane wpisy, najnowsze pierwsze. */
function posts_published(): array {
    return array_values(array_filter(posts_all(), static fn($p) => !empty($p['published'])));
}

function post_by_slug(string $slug): ?array {
    foreach (posts_all() as $p) {
        if (($p['slug'] ?? '') === $slug) return $p;
    }
    return null;
}

function post_featured(array $posts): ?array {
    foreach ($posts as $p) if (!empty($p['featured'])) return $p;
    return $posts[0] ?? null;
}

/* ── pomocnicze ─────────────────────────────────────────── */

function e(?string $s): string {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function slugify(string $s): string {
    $from = ['ą','ć','ę','ł','ń','ó','ś','ź','ż','Ą','Ć','Ę','Ł','Ń','Ó','Ś','Ź','Ż'];
    $to   = ['a','c','e','l','n','o','s','z','z','a','c','e','l','n','o','s','z','z'];
    $s = str_replace($from, $to, $s);
    $s = strtolower(trim($s));
    $s = preg_replace('~[^a-z0-9]+~', '-', $s) ?? '';
    return trim($s, '-') ?: 'wpis-' . time();
}

/** Pole dwujęzyczne z fallbackiem na PL. */
function tr(array $post, string $field, string $lang): string {
    $v = trim((string)($post[$lang][$field] ?? ''));
    if ($v === '' && $lang !== 'pl') $v = trim((string)($post['pl'][$field] ?? ''));
    return $v;
}

function cat_label(string $key, string $lang): string {
    $c = CATEGORIES[$key] ?? null;
    if (!$c) return strtoupper($key);
    return mb_strtoupper($lang === 'en' ? $c[1] : $c[0]);
}

function fmt_date(string $iso, string $lang): string {
    $t = strtotime($iso);
    if (!$t) return '';
    return $lang === 'en' ? date('d M Y', $t) : date('d.m.Y', $t);
}

/** Meta w stylu „PRODUKCJA · 04 MIN · 12.06.2026”. */
function post_meta(array $p, string $lang, bool $withDate = true): string {
    $bits = [cat_label((string)($p['category'] ?? ''), $lang)];
    $min  = (int)($p['readmin'] ?? 0);
    if ($min > 0) $bits[] = str_pad((string)$min, 2, '0', STR_PAD_LEFT) . ' MIN';
    if ($withDate && !empty($p['date'])) $bits[] = fmt_date((string)$p['date'], $lang);
    return implode(' · ', $bits);
}

/**
 * Treść wpisu: prosty format tekstowy zamieniany na HTML.
 *   ## Nagłówek      -> <h2>
 *   - punkt          -> <ul><li>
 *   > cytat          -> <blockquote>
 *   pusta linia      -> nowy akapit
 * Wszystko jest escapowane, więc redaktor nie wstrzyknie HTML-a.
 */
function render_body(string $text): string {
    $text  = str_replace("\r\n", "\n", $text);
    $out   = '';
    $list  = false;
    $close = static function () use (&$list, &$out) { if ($list) { $out .= "</ul>\n"; $list = false; } };

    foreach (explode("\n\n", $text) as $block) {
        $block = trim($block);
        if ($block === '') continue;
        $lines = explode("\n", $block);

        if (str_starts_with($lines[0], '## ')) {
            $close();
            $out .= '<h2>' . e(substr($lines[0], 3)) . "</h2>\n";
            $rest = trim(implode("\n", array_slice($lines, 1)));
            if ($rest !== '') $out .= '<p>' . nl2br(e($rest)) . "</p>\n";
            continue;
        }
        if (str_starts_with($lines[0], '> ')) {
            $close();
            $q = implode(' ', array_map(static fn($l) => ltrim($l, '> '), $lines));
            $out .= '<blockquote><p>' . e($q) . "</p></blockquote>\n";
            continue;
        }
        if (str_starts_with($lines[0], '- ')) {
            $close();
            $out .= "<ul>\n";
            $list = true;
            foreach ($lines as $l) {
                if (str_starts_with($l, '- ')) $out .= '<li>' . e(substr($l, 2)) . "</li>\n";
            }
            $close();
            continue;
        }
        $close();
        $out .= '<p>' . nl2br(e($block)) . "</p>\n";
    }
    $close();
    return $out;
}

/** Skrót do listy/OG. */
function excerpt(string $text, int $len = 165): string {
    $t = trim(preg_replace('~\s+~u', ' ', strip_tags($text)) ?? '');
    return mb_strlen($t) > $len ? mb_substr($t, 0, $len - 1) . '…' : $t;
}
