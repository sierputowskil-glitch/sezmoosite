<?php
/**
 * SEZMOO — pojedynczy wpis bloga.
 * $LANG i $PREFIX ustawia plik wywołujący (artykul.php / en/artykul.php).
 */

declare(strict_types=1);

$LANG   = $LANG   ?? 'pl';
$PREFIX = $PREFIX ?? '';
require_once __DIR__ . '/shell.php';

$en   = $LANG === 'en';
$slug = preg_replace('~[^a-z0-9\-]~', '', (string)($_GET['slug'] ?? '')) ?? '';
$post = $slug !== '' ? post_by_slug($slug) : null;

if (!$post || empty($post['published'])) {
    http_response_code(404);
    header('Location: ' . $PREFIX . ($en ? 'en/blog.php' : 'blog.php'));
    exit;
}

$title = tr($post, 'title', $LANG);
$lead  = tr($post, 'lead', $LANG);
$body  = tr($post, 'body', $LANG);
$url   = SITE_URL . ($en ? '/en/artykul.php?slug=' : '/artykul.php?slug=') . $slug;
$img   = !empty($post['image']) ? SITE_URL . '/' . ltrim((string)$post['image'], '/') : null;

$jsonld = json_encode([
    '@context'      => 'https://schema.org',
    '@type'         => 'BlogPosting',
    'headline'      => $title,
    'description'   => $lead,
    'datePublished' => $post['date'] ?? null,
    'inLanguage'    => $en ? 'en' : 'pl',
    'image'         => $img,
    'author'        => ['@type' => 'Organization', 'name' => 'SEZMOO'],
    'publisher'     => ['@type' => 'Organization', 'name' => 'SEZMOO'],
    'mainEntityOfPage' => $url,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

shell_head([
    'lang'   => $LANG,
    'prefix' => $PREFIX,
    'title'  => $title . ' | SEZMOO',
    'desc'   => $lead !== '' ? excerpt($lead) : excerpt($body),
    'url'    => $url,
    'image'  => $img,
    'ogtype' => 'article',
    'jsonld' => $jsonld,
    'alt_pl' => SITE_URL . '/artykul.php?slug=' . $slug,
    'alt_en' => SITE_URL . '/en/artykul.php?slug=' . $slug,
]);
?>

<main>
  <article class="article shell">
    <header class="article__head">
      <a class="article__back reveal" href="<?= e($PREFIX . ($en ? 'en/blog.php' : 'blog.php')) ?>">← <?= $en ? 'Back to blog' : 'Wróć do bloga' ?></a>
      <span class="blog-post__meta reveal"><?= e(post_meta($post, $LANG)) ?></span>
      <h1 class="article__title reveal"><?= e($title) ?></h1>
<?php if ($lead !== ''): ?>
      <p class="article__lead reveal" data-d="1"><?= e($lead) ?></p>
<?php endif; ?>
    </header>

    <div class="article__media reveal">
<?php if (!empty($post['image'])): ?>
      <img src="<?= e($PREFIX . $post['image']) ?>" alt="<?= e($title) ?>" loading="lazy" decoding="async" />
<?php else: ?>
      <div class="frame-media"></div>
<?php endif; ?>
      <span>SEZMOO / <?= $en ? 'PRODUCTION NOTES' : 'NOTATKI Z PLANU' ?></span>
    </div>

    <div class="article__layout">
      <div class="article__content">
        <?= render_body($body) ?>

        <div class="article__cta reveal">
          <h2><?= $en ? 'Planning a shoot?' : 'Planujesz dzień zdjęciowy?' ?></h2>
          <a href="<?= e($PREFIX) ?><?= $en ? 'en/index.html' : 'index.html' ?>#cta"><?= $en ? 'Let’s talk' : 'Porozmawiajmy' ?></a>
        </div>
      </div>
    </div>
  </article>

<?php shell_foot(['lang' => $LANG, 'prefix' => $PREFIX]); ?>
