<?php
/**
 * SEZMOO CMS — konfiguracja
 * Jedyny plik, który zwykle trzeba edytować ręcznie.
 */

declare(strict_types=1);

/* Hasło do panelu /admin.
   Domyślne: sezmoo2026  — ZMIEŃ JE: otwórz /admin/haslo.php, wpisz nowe,
   skopiuj wynik i wklej poniżej jako CMS_PASS_HASH. */
const CMS_PEPPER    = 'szm_4b95f5efb518804373b874a155e1d9b6';
const CMS_PASS_HASH = '02d3687aaad652cca67f7ec8c5af697795f2f2a525d2a70b0f088e5db5f1e059';

const CMS_ROOT     = __DIR__;
const SITE_ROOT    = __DIR__ . '/..';
const DATA_DIR     = __DIR__ . '/data';
const POSTS_FILE   = DATA_DIR . '/posts.json';
const UPLOAD_DIR   = SITE_ROOT . '/assets/blog';
const UPLOAD_URL   = 'assets/blog';

const SITE_URL     = 'https://sezmoo.com';
const PER_PAGE     = 12;

// Kategorie (klucz => [PL, EN])
const CATEGORIES = [
    'produkcja'  => ['Produkcja',    'Production'],
    'social'     => ['Social',       'Social'],
    'post'       => ['Postprodukcja','Post'],
    'strategia'  => ['Strategia',    'Strategy'],
    'event'      => ['Event',        'Event'],
];
