<?php
/**
 * Mapa 301 dla lokalnego router.php (php -S nie czyta .htaccess / redirects.htaccess).
 * Produkcja: utrzymuj reguły w redirects.htaccess — ten plik jest lustrem exact-match.
 *
 * @return array<string, string>
 */
declare(strict_types=1);

return [
    '/identyfikacja-wizualna' => '/uslugi-marketingowe/identyfikacja-wizualna/',
    '/identyfikacja-wizualna/' => '/uslugi-marketingowe/identyfikacja-wizualna/',
    '/uslugi' => '/uslugi-marketingowe/',
    '/uslugi/' => '/uslugi-marketingowe/',
    '/artykul' => '/blog/',
    '/artykul/' => '/blog/',
    '/o-nas' => '/#team',
    '/o-nas/' => '/#team',
    '/kontakt' => '/#kontakt',
    '/kontakt/' => '/#kontakt',
    '/en/services/branding' => '/en/services/visual-identity/',
    '/en/services/branding/' => '/en/services/visual-identity/',
    '/en/services/digital-graphics' => '/en/services/graphic-design/',
    '/en/services/digital-graphics/' => '/en/services/graphic-design/',
    // DE → EN
    '/de' => '/en/',
    '/de/' => '/en/',
    '/de/uber-uns' => '/en/about-us/',
    '/de/uber-uns/' => '/en/about-us/',
    '/de/datenschutzrichtlinie' => '/en/privacy-policy/',
    '/de/datenschutzrichtlinie/' => '/en/privacy-policy/',
    '/de/portfolio-3' => '/en/portfolio-en/',
    '/de/portfolio-3/' => '/en/portfolio-en/',
    '/de/dienstleistungen' => '/en/services/',
    '/de/dienstleistungen/' => '/en/services/',
    '/de/dienstleistungen/2d-und-3d-animationen' => '/en/services/2d-and-3d-animations/',
    '/de/dienstleistungen/2d-und-3d-animationen/' => '/en/services/2d-and-3d-animations/',
    '/de/dienstleistungen/visuelle-identitat' => '/en/services/visual-identity/',
    '/de/dienstleistungen/visuelle-identitat/' => '/en/services/visual-identity/',
    '/de/dienstleistungen/social-media-betreuung' => '/en/services/social-media-management/',
    '/de/dienstleistungen/social-media-betreuung/' => '/en/services/social-media-management/',
    '/de/dienstleistungen/bezahlte-kampagnen' => '/en/services/paid-campaigns/',
    '/de/dienstleistungen/bezahlte-kampagnen/' => '/en/services/paid-campaigns/',
    '/de/dienstleistungen/werbematerialien' => '/en/services/promotional-items/',
    '/de/dienstleistungen/werbematerialien/' => '/en/services/promotional-items/',
    '/de/dienstleistungen/videoproduktion-reels' => '/en/services/video-production-reels/',
    '/de/dienstleistungen/videoproduktion-reels/' => '/en/services/video-production-reels/',
    '/de/dienstleistungen/fotografie' => '/en/services/photoghraphy/',
    '/de/dienstleistungen/fotografie/' => '/en/services/photoghraphy/',
    '/de/dienstleistungen/digitale-grafik' => '/en/services/graphic-design/',
    '/de/dienstleistungen/digitale-grafik/' => '/en/services/graphic-design/',
    '/de/dienstleistungen/webseiten-und-landing-pages' => '/en/services/websites-and-landing-pages/',
    '/de/dienstleistungen/webseiten-und-landing-pages/' => '/en/services/websites-and-landing-pages/',
    '/de/dienstleistungen/eventorganisation' => '/en/services/event-organization/',
    '/de/dienstleistungen/eventorganisation/' => '/en/services/event-organization/',
];
