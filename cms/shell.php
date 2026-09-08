<?php
/**
 * SEZMOO — wspólna skorupa strony (nav + footer) dla widoków CMS.
 * $lang   : 'pl' | 'en'
 * $prefix : ścieżka względna do roota, '' dla PL, '../' dla EN
 */

declare(strict_types=1);

require_once __DIR__ . '/lib.php';

function shell_head(array $o): void {
    $lang   = $o['lang'];
    $p      = $o['prefix'];
    $home   = $lang === 'en' ? $p . 'en/index.html' : $p . 'index.html';
    ?>
<!DOCTYPE html>
<html lang="<?= e($lang) ?>">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/assets/favicon.png" sizes="any" />
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
<meta name="theme-color" content="#16130e" />
<meta property="og:type" content="<?= e($o['ogtype'] ?? 'website') ?>" />
<meta property="og:title" content="<?= e($o['title']) ?>" />
<meta property="og:description" content="<?= e($o['desc']) ?>" />
<meta property="og:url" content="<?= e($o['url']) ?>" />
<meta property="og:image" content="<?= e($o['image'] ?? SITE_URL . '/assets/og-image.png') ?>" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="<?= e($o['image'] ?? SITE_URL . '/assets/og-image.png') ?>" />
<script>try{var t=localStorage.getItem('sezmoo-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>
<title><?= e($o['title']) ?></title>
<meta name="description" content="<?= e($o['desc']) ?>" />
<link rel="canonical" href="<?= e($o['url']) ?>" />
<?php if (!empty($o['alt_pl'])): ?>
<link rel="alternate" hreflang="pl" href="<?= e($o['alt_pl']) ?>" />
<link rel="alternate" hreflang="en" href="<?= e($o['alt_en']) ?>" />
<link rel="alternate" hreflang="x-default" href="<?= e($o['alt_pl']) ?>" />
<?php endif; ?>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="<?= e($p) ?>styles.css" />
<?php if (!empty($o['jsonld'])): ?>
<script type="application/ld+json"><?= $o['jsonld'] ?></script>
<?php endif; ?>
</head>
<body><canvas class="flow-bg-canvas" id="flow-bg-canvas" aria-hidden="true"></canvas>

<div class="grain"></div>
<div class="vignette"></div>
<div class="cursor">PLAY</div>
<div class="cursor-dot"></div>
<div class="scrubber"><div class="scrubber__fill"><span class="scrubber__head"></span></div></div>

<nav class="nav">
  <a class="brand" href="<?= e($home) ?>#hero" aria-label="SEZMOO">
    <img class="brand__logo" src="<?= e($p) ?>assets/brand/sezmoo-logo-wy.svg" alt="SEZMOO" />
  </a>
  <div class="nav__menu" id="main-menu">
<?php if ($lang === 'en'): ?>
    <a href="<?= e($p) ?>en/index.html#hero">Home</a>
    <a href="<?= e($p) ?>en/portfolio-en/index.html">Work</a>
    <a href="<?= e($p) ?>en/services/index.html">Services</a>
    <a href="<?= e($p) ?>en/index.html#team">Team</a>
    <a href="<?= e($p) ?>en/index.html#opinie">Reviews</a>
    <a aria-current="page" href="<?= e($p) ?>en/blog.php">Blog</a>
    <a href="<?= e($p) ?>en/index.html#kontakt">Contact</a>
<?php else: ?>
    <a href="<?= e($p) ?>index.html#hero">Home</a>
    <a href="<?= e($p) ?>portfolio/index.html">Portfolio</a>
    <a href="<?= e($p) ?>uslugi-marketingowe/index.html">Usługi</a>
    <a href="<?= e($p) ?>index.html#team">Zespół</a>
    <a href="<?= e($p) ?>index.html#opinie">Opinie</a>
    <a aria-current="page" href="<?= e($p) ?>blog.php">Blog</a>
    <a href="<?= e($p) ?>index.html#kontakt">Kontakt</a>
<?php endif; ?>
  </div>
  <div class="nav__right"><div class="nav__tc"><span class="live">●&nbsp;REC</span><span class="label" data-tc>00:00:12:08</span></div>
  <div class="nav__theme" role="group" aria-label="Motyw / Theme"><button class="nav__theme-opt" data-theme-set="dark" type="button" aria-label="Ciemny motyw / Dark">DARK</button><button class="nav__theme-opt" data-theme-set="light" type="button" aria-label="Jasny motyw / Light">LIGHT</button></div><div class="nav__lang" role="group" aria-label="Język / Language"><?php
    if ($lang === 'en') {
        echo '<a class="nav__lang-opt" href="' . e($p) . 'blog.php">PL</a><a class="nav__lang-opt is-active" href="#" aria-current="page">EN</a>';
    } else {
        echo '<a class="nav__lang-opt is-active" href="#" aria-current="page">PL</a><a class="nav__lang-opt" href="' . e($p) . 'en/blog.php">EN</a>';
    }
  ?></div><button class="nav__burger" type="button" aria-label="<?= $lang === 'en' ? 'Open menu' : 'Otwórz menu' ?>" aria-expanded="false" aria-controls="main-menu">
    <span></span><span></span><span></span>
  </button>
</div></nav>
<?php
}

function shell_foot(array $o): void {
    $lang = $o['lang'];
    $p    = $o['prefix'];
    $en   = $lang === 'en';
    $home = $en ? $p . 'en/index.html' : $p . 'index.html';
    ?>
  <footer class="footer shell">
  <div class="footer__panel">
    <div class="footer__top">
      <a class="footer__brand" href="<?= e($home) ?>#hero" aria-label="SEZMOO">
        <img src="<?= e($p) ?>assets/brand/sezmoo-logo-wy.svg" alt="SEZMOO" />
      </a>
      <div class="footer__statement">
        <span><?= $en ? 'CREATIVE AGENCY · GDAŃSK · TRICITY' : 'AGENCJA KREATYWNA · GDAŃSK · TRÓJMIASTO' ?></span>
        <p><?= $en ? 'Offline and online marketing in one place.' : 'Offline i&nbsp;online marketing w&nbsp;jednym miejscu.' ?></p>
      </div>
    </div>
    <div class="footer__grid">
      <div class="footer__col">
        <span class="footer__label"><?= $en ? 'Contact' : 'Kontakt' ?></span>
        <a href="mailto:biuro@sezmoo.com">biuro@sezmoo.com</a>
        <a href="tel:+48502260450">+48 502 260 450</a>
      </div>
      <div class="footer__col">
        <span class="footer__label">Studio</span>
<?php if ($en): ?>
        <a href="<?= e($p) ?>en/portfolio-en/index.html">Work</a>
        <a href="<?= e($p) ?>en/services/index.html">Services</a>
        <a href="<?= e($p) ?>en/index.html#kontakt">Brief</a>
<?php else: ?>
        <a href="<?= e($p) ?>portfolio/index.html">Realizacje</a>
        <a href="<?= e($p) ?>uslugi-marketingowe/index.html">Usługi</a>
        <a href="<?= e($p) ?>index.html#kontakt">Brief</a>
<?php endif; ?>
      </div>
      <div class="footer__col">
        <span class="footer__label">Social</span>
        <a href="https://www.instagram.com/sezmoo/" target="_blank" rel="noopener">Instagram</a>
        <a href="https://www.facebook.com/sezmooagencja" target="_blank" rel="noopener">Facebook</a>
        <a href="https://www.youtube.com/@sezmooagency" target="_blank" rel="noopener">YouTube</a>
        <a href="https://www.linkedin.com/company/sezmoo/" target="_blank" rel="noopener">LinkedIn</a>
      </div>
      <div class="footer__col">
        <span class="footer__label"><?= $en ? 'Address' : 'Adres' ?></span>
        <p>Zeusa 34<br>80-299 Gdańsk</p>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© <?= date('Y') ?> SEZMOO · <?= $en ? 'ALL RIGHTS RESERVED' : 'WSZELKIE PRAWA ZASTRZEŻONE' ?></span><a class="footer__legal" href="<?= e($p) ?><?= $en ? 'en/privacy-policy/index.html' : 'polityka-prywatnosci/index.html' ?>"><?= $en ? 'Privacy policy' : 'Polityka prywatności' ?></a>
      <a href="#top"><?= $en ? 'Back to top' : 'Do góry' ?></a>
    </div>
  </div>
</footer>
</main>

<script src="<?= e($p) ?>app.js"></script>
<script src="<?= e($p) ?>flowing-background.js"></script>
<script>
/* Theme switcher (dark / light) */
(function () {
  var root = document.documentElement;
  var opts = [].slice.call(document.querySelectorAll('[data-theme-set]'));
  function apply(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('sezmoo-theme', t); } catch (e) {}
    opts.forEach(function (b) {
      var on = b.getAttribute('data-theme-set') === t;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  opts.forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-theme-set')); });
  });
  apply(root.getAttribute('data-theme') || 'dark');
})();
</script>
</body>
</html>
<?php
}
