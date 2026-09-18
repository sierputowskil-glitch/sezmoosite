<?php
/**
 * Apache ErrorDocument handler — picks PL/EN 404 by original URL.
 * Local: use router.php instead (php -S ignores ErrorDocument).
 */
declare(strict_types=1);

http_response_code(404);
header('Content-Type: text/html; charset=UTF-8');

$orig = $_SERVER['REDIRECT_URL']
    ?? $_SERVER['REDIRECT_URI']
    ?? $_SERVER['REQUEST_URI']
    ?? '';

$path = parse_url($orig, PHP_URL_PATH) ?? $orig;
$en = str_starts_with($path, '/en/') || $path === '/en';

readfile(__DIR__ . ($en ? '/en/404.html' : '/404.html'));
