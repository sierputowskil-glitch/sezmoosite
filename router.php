<?php
/**
 * Lokalny router dla wbudowanego serwera PHP.
 * `php -S` nie czyta .htaccess — bez routera PHP 8.5 serwuje index.html
 * dla nieistniejących ścieżek (wygląda jak redirect na stronę główną).
 *
 * Start:
 *   php -S localhost:8080 router.php
 */

declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = $uri === null || $uri === '' ? '/' : $uri;
$file = __DIR__ . $path;

// Mirror 301 z redirects.htaccess (php -S ich nie czyta) — mapa w redirects.php
$redirects = require __DIR__ . '/redirects.php';
if (isset($redirects[$path])) {
    header('Location: ' . $redirects[$path], true, 301);
    return true;
}
if (preg_match('#^/(en/|de/)?(category|tag|author)(/|$)#', $path)
    || preg_match('#^/(en/|de/)?(comments/)?feed/?$#', $path)
) {
    header('Location: /blog/', true, 301);
    return true;
}
// Pozostałe /de/* → /en/*
if (preg_match('#^/de(?:/(.*))?$#', $path, $m)) {
    $rest = isset($m[1]) && $m[1] !== '' ? rtrim($m[1], '/') . '/' : '';
    header('Location: /en/' . $rest, true, 301);
    return true;
}

// Istniejący plik (HTML, asset, PHP…) — niech serwuje built-in server
if ($path !== '/' && is_file($file)) {
    return false;
}

// Katalog z index.html (pretty URL: /portfolio/, /uslugi-marketingowe/…)
$dir = is_dir($file) ? rtrim($file, '/') : null;
if ($dir !== null) {
    $index = $dir . '/index.html';
    if (is_file($index)) {
        header('Content-Type: text/html; charset=UTF-8');
        readfile($index);
        return true;
    }
}

// /portfolio → /portfolio/index.html (bez trailing slash)
if ($path !== '/' && !str_ends_with($path, '/')) {
    $index = __DIR__ . $path . '/index.html';
    if (is_file($index)) {
        header('Content-Type: text/html; charset=UTF-8');
        readfile($index);
        return true;
    }
}

http_response_code(404);
header('Content-Type: text/html; charset=UTF-8');
$en = str_starts_with($path, '/en/') || $path === '/en';
readfile(__DIR__ . ($en ? '/en/404.html' : '/404.html'));
return true;
