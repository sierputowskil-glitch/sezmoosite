<?php
/**
 * SEZMOO — lista wpisów bloga. Renderuje cms/data/posts.json.
 * $LANG i $PREFIX ustawia plik wywołujący (blog.php / en/blog.php).
 */

declare(strict_types=1);

$LANG   = $LANG   ?? 'pl';
$PREFIX = $PREFIX ?? '';
require_once __DIR__ . '/shell.php';

$en    = $LANG === 'en';
$posts = posts_published();

// filtr kategorii (?cat=social)
$cat = preg_replace('~[^a-z]~', '', (string)($_GET['cat'] ?? '')) ?? '';
if ($cat !== '' && isset(CATEGORIES[$cat])) {
    $posts = array_values(array_filter($posts, static fn($p) => ($p['category'] ?? '') === $cat));
} else {
    $cat = '';
}

$feat  = $cat === '' ? post_featured($posts) : null;
$rest  = array_values(array_filter($posts, static fn($p) => ($p['slug'] ?? '') !== ($feat['slug'] ?? '')));

$blogUrl = SITE_URL . ($en ? '/en/blog.php' : '/blog.php');
$artBase = $PREFIX . ($en ? 'en/artykul.php' : 'artykul.php');

shell_head([
    'lang'   => $LANG,
    'prefix' => $PREFIX,
    'title'  => $en
        ? 'Blog · video production, content and brand marketing | SEZMOO'
        : 'Blog, produkcja wideo, content i marketing marek | SEZMOO',
    'desc'   => $en
        ? 'SEZMOO blog: practical notes on video production, social content and brand marketing.'
        : 'Blog SEZMOO: praktyczne notatki o produkcji wideo, contentu na social media i marketingu marek, z planu, montażu i feedu.',
    'url'    => $blogUrl,
    'alt_pl' => SITE_URL . '/blog.php',
    'alt_en' => SITE_URL . '/en/blog.php',
]);
?>

<main>
  <section class="blog blog--page shell" id="blog" data-screen-label="Blog">
    <div class="blog-hero">
      <div>
        <span class="eyebrow reveal"><span class="tick"></span><?= $en ? 'SEZMOO NOTES' : 'NOTATKI SEZMOO' ?></span>
        <h1 class="blog-hero__title reveal"><?= $en ? 'Notes from set, edit and feed.' : 'Notatki z&nbsp;planu, montażu i&nbsp;feedu.' ?></h1>
      </div>
      <p class="blog-hero__copy reveal" data-d="1"><?= $en
        ? 'Practical posts about video production, short formats, social media and working with a brand on camera.'
        : 'Praktyczne wpisy o&nbsp;produkcji wideo, krótkich formatach, social mediach i&nbsp;pracy z&nbsp;marką przed kamerą.' ?></p>
    <div class="blog-topics reveal">
      <a href="?" class="<?= $cat === '' ? 'is-active' : '' ?>"><?= $en ? 'All' : 'Wszystko' ?></a>
<?php foreach (CATEGORIES as $key => $labels): ?>
      <a href="?cat=<?= e($key) ?>" class="<?= $cat === $key ? 'is-active' : '' ?>"><?= e($en ? $labels[1] : $labels[0]) ?></a>
<?php endforeach; ?>
    </div>

<?php if (!$posts): ?>
    <p class="blog-hero__copy reveal"><?= $en ? 'Nothing here yet.' : 'Brak wpisów w tej kategorii.' ?></p>
<?php else: ?>

<?php if ($feat): ?>
    <article class="blog-feature reveal">
      <div class="blog-feature__media">
<?php if (!empty($feat['image'])): ?>
        <img src="<?= e($PREFIX . $feat['image']) ?>" alt="<?= e(tr($feat, 'title', $LANG)) ?>" loading="lazy" decoding="async" />
<?php else: ?>
        <div class="frame-media"></div>
<?php endif; ?>
        <span>FEATURED</span>
      </div>
      <div class="blog-feature__body">
        <span class="blog-post__meta"><?= e(post_meta($feat, $LANG)) ?></span>
        <h2><?= e(tr($feat, 'title', $LANG)) ?></h2>
        <p><?= e(tr($feat, 'lead', $LANG)) ?></p>
        <a href="<?= e($artBase) ?>?slug=<?= e((string)$feat['slug']) ?>"><?= $en ? 'Read article' : 'Czytaj artykuł' ?></a>
      </div>
    </article>
<?php endif; ?>

    <div class="blog-layout">
      <div class="blog__list">
<?php foreach ($rest as $i => $p): ?>
        <article class="blog-post reveal"<?= $i % 3 ? ' data-d="' . ($i % 3) . '"' : '' ?>>
          <span class="blog-post__meta"><?= e(post_meta($p, $LANG, false)) ?></span>
          <h3><?= e(tr($p, 'title', $LANG)) ?></h3>
          <p><?= e(tr($p, 'lead', $LANG)) ?></p>
          <a href="<?= e($artBase) ?>?slug=<?= e((string)$p['slug']) ?>"><?= $en ? 'Read more' : 'Czytaj dalej' ?></a>
        </article>
<?php endforeach; ?>
      </div>

      <aside class="blog-side reveal" data-d="1">
        <span class="blog-side__label"><?= $en ? 'Topics' : 'Tematy' ?></span>
<?php foreach (CATEGORIES as $key => $labels): ?>
        <a href="?cat=<?= e($key) ?>"><?= e($en ? $labels[1] : $labels[0]) ?></a>
<?php endforeach; ?>
        <a href="<?= e($PREFIX) ?><?= $en ? 'en/index.html' : 'index.html' ?>#cta"><?= $en ? 'Suggest a topic' : 'Zaproponuj temat' ?></a>
      </aside>
    </div>
<?php endif; ?>
  </section>

<?php shell_foot(['lang' => $LANG, 'prefix' => $PREFIX]); ?>
