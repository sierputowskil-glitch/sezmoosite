<?php
/**
 * SEZMOO — panel redakcyjny (logowanie, lista, edycja, upload).
 * Jeden plik, zero zależności. Wejście: /admin/
 */

declare(strict_types=1);

require_once __DIR__ . '/../cms/lib.php';

session_start();

const CSRF_KEY = 'sezmoo_csrf';

if (empty($_SESSION[CSRF_KEY])) {
    $_SESSION[CSRF_KEY] = bin2hex(random_bytes(16));
}
$csrf = $_SESSION[CSRF_KEY];

function csrf_ok(): bool {
    return isset($_POST['csrf'], $_SESSION[CSRF_KEY])
        && hash_equals((string)$_SESSION[CSRF_KEY], (string)$_POST['csrf']);
}

function logged_in(): bool { return !empty($_SESSION['sezmoo_admin']); }

function redirect(string $q = ''): void {
    header('Location: index.php' . ($q !== '' ? '?' . $q : ''));
    exit;
}

/* ── logowanie ──────────────────────────────────────────── */

$loginError = '';

if (($_POST['action'] ?? '') === 'login') {
    if (!csrf_ok()) {
        $loginError = 'Sesja wygasła — spróbuj ponownie.';
    } elseif (hash_equals(CMS_PASS_HASH, hash('sha256', CMS_PEPPER . (string)($_POST['password'] ?? '')))) {
        session_regenerate_id(true);
        $_SESSION['sezmoo_admin'] = true;
        redirect();
    } else {
        $loginError = 'Nieprawidłowe hasło.';
        usleep(600000);
    }
}

if (($_GET['action'] ?? '') === 'logout') {
    session_destroy();
    redirect();
}

/* ── akcje wymagające zalogowania ───────────────────────── */

$notice = '';

if (logged_in() && ($_POST['action'] ?? '') !== '' && $_POST['action'] !== 'login') {
    if (!csrf_ok()) {
        $notice = 'Sesja wygasła — zmiany nie zostały zapisane.';
    } else {
        $action = (string)$_POST['action'];
        $posts  = posts_all();

        if ($action === 'save') {
            $slug = (string)($_POST['slug'] ?? '');
            $orig = (string)($_POST['orig_slug'] ?? '');
            $slug = $slug !== '' ? slugify($slug) : slugify((string)($_POST['pl_title'] ?? ''));

            // upload obrazka
            $image = (string)($_POST['image_current'] ?? '');
            if (!empty($_FILES['image']['tmp_name']) && is_uploaded_file($_FILES['image']['tmp_name'])) {
                $info = @getimagesize($_FILES['image']['tmp_name']);
                $ext  = match ($info[2] ?? 0) {
                    IMAGETYPE_JPEG => 'jpg',
                    IMAGETYPE_PNG  => 'png',
                    IMAGETYPE_WEBP => 'webp',
                    IMAGETYPE_AVIF => 'avif',
                    default        => null,
                };
                if ($ext === null) {
                    $notice = 'Odrzucono plik — dozwolone są tylko JPG, PNG, WEBP i AVIF.';
                } elseif ($_FILES['image']['size'] > 6 * 1024 * 1024) {
                    $notice = 'Odrzucono plik — maksymalny rozmiar to 6 MB.';
                } else {
                    if (!is_dir(UPLOAD_DIR)) @mkdir(UPLOAD_DIR, 0755, true);
                    $name = $slug . '-' . substr(bin2hex(random_bytes(4)), 0, 6) . '.' . $ext;
                    if (move_uploaded_file($_FILES['image']['tmp_name'], UPLOAD_DIR . '/' . $name)) {
                        $image = UPLOAD_URL . '/' . $name;
                    }
                }
            }

            $entry = [
                'slug'      => $slug,
                'published' => !empty($_POST['published']),
                'featured'  => !empty($_POST['featured']),
                'date'      => (string)($_POST['date'] ?? date('Y-m-d')),
                'category'  => (string)($_POST['category'] ?? 'produkcja'),
                'readmin'   => max(0, (int)($_POST['readmin'] ?? 0)),
                'image'     => $image,
                'pl' => [
                    'title' => trim((string)($_POST['pl_title'] ?? '')),
                    'lead'  => trim((string)($_POST['pl_lead'] ?? '')),
                    'body'  => trim((string)($_POST['pl_body'] ?? '')),
                ],
                'en' => [
                    'title' => trim((string)($_POST['en_title'] ?? '')),
                    'lead'  => trim((string)($_POST['en_lead'] ?? '')),
                    'body'  => trim((string)($_POST['en_body'] ?? '')),
                ],
            ];

            // tylko jeden wpis może być wyróżniony
            if ($entry['featured']) {
                foreach ($posts as &$q) { $q['featured'] = false; }
                unset($q);
            }

            $found = false;
            foreach ($posts as $i => $q) {
                if (($q['slug'] ?? '') === $orig) { $posts[$i] = $entry; $found = true; break; }
            }
            if (!$found) $posts[] = $entry;

            posts_save($posts);
            redirect('saved=1');
        }

        if ($action === 'delete') {
            $slug  = (string)($_POST['slug'] ?? '');
            $posts = array_values(array_filter($posts, static fn($q) => ($q['slug'] ?? '') !== $slug));
            posts_save($posts);
            redirect('deleted=1');
        }

        if ($action === 'toggle') {
            $slug = (string)($_POST['slug'] ?? '');
            foreach ($posts as $i => $q) {
                if (($q['slug'] ?? '') === $slug) { $posts[$i]['published'] = empty($q['published']); break; }
            }
            posts_save($posts);
            redirect();
        }
    }
}

/* ── widok ──────────────────────────────────────────────── */

$editing = null;
if (logged_in() && isset($_GET['edit'])) {
    $editing = post_by_slug((string)$_GET['edit']) ?? [];
}
$isNew = logged_in() && isset($_GET['new']);
if ($isNew) $editing = [];
?>
<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>SEZMOO · panel</title>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
<style>
  :root{
    --bg:#111211; --panel:#191a19; --line:#2a2b29; --ink:#ece9e3;
    --dim:#8b8a85; --acc:#ffd200; --bad:#ff5d4a;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);
    font:400 15px/1.55 Archivo,system-ui,sans-serif;padding:32px 24px 80px}
  a{color:var(--acc)}
  .wrap{max-width:1080px;margin:0 auto}
  header.top{display:flex;align-items:center;justify-content:space-between;gap:16px;
    padding-bottom:20px;margin-bottom:28px;border-bottom:1px solid var(--line)}
  .mark{font:700 20px/1 Archivo;letter-spacing:-.02em;display:flex;align-items:center;gap:10px}
  .mark i{color:var(--acc);font-style:normal;font-size:24px}
  .mono{font:400 11px/1 "Space Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
  .btn{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);
    background:var(--panel);color:var(--ink);border-radius:2px;padding:10px 16px;
    font:500 13px Archivo;cursor:pointer;text-decoration:none;transition:border-color .15s,color .15s}
  .btn:hover{border-color:var(--acc);color:var(--acc)}
  .btn--go{background:var(--acc);border-color:var(--acc);color:#111}
  .btn--go:hover{color:#111;filter:brightness(1.08)}
  .btn--bad:hover{border-color:var(--bad);color:var(--bad)}
  .note{border:1px solid var(--acc);background:rgba(255,210,0,.07);
    padding:12px 16px;margin-bottom:24px;font-size:14px}
  table{width:100%;border-collapse:collapse}
  th{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);
    font:400 11px/1 "Space Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--dim)}
  td{padding:14px 12px;border-bottom:1px solid var(--line);vertical-align:middle}
  tr:hover td{background:var(--panel)}
  .t-title{font-weight:600}
  .t-slug{color:var(--dim);font:400 12px "Space Mono",monospace;margin-top:3px}
  .pill{display:inline-block;padding:3px 9px;border:1px solid var(--line);border-radius:2px;
    font:400 10px/1.5 "Space Mono",monospace;letter-spacing:.1em;text-transform:uppercase}
  .pill--on{border-color:var(--acc);color:var(--acc)}
  .pill--off{color:var(--dim)}
  .pill--star{border-color:var(--acc);background:var(--acc);color:#111}
  .acts{display:flex;gap:8px;justify-content:flex-end}
  form.edit{display:grid;gap:22px;max-width:820px}
  fieldset{border:1px solid var(--line);padding:20px;margin:0}
  legend{padding:0 8px;font:400 11px/1 "Space Mono",monospace;letter-spacing:.14em;
    text-transform:uppercase;color:var(--acc)}
  label{display:block;margin-bottom:14px}
  label span{display:block;margin-bottom:6px;font-size:13px;color:var(--dim)}
  input[type=text],input[type=date],input[type=number],input[type=password],select,textarea{
    width:100%;background:#0d0e0d;border:1px solid var(--line);color:var(--ink);
    padding:11px 13px;font:400 14px Archivo;border-radius:2px}
  textarea{min-height:200px;resize:vertical;font:400 14px/1.6 Archivo}
  input:focus,select:focus,textarea:focus{outline:none;border-color:var(--acc)}
  .row{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0 18px}
  .checks{display:flex;gap:24px;flex-wrap:wrap}
  .checks label{display:flex;align-items:center;gap:8px;margin:0}
  .checks span{margin:0}
  .hint{font:400 12px/1.5 "Space Mono",monospace;color:var(--dim);margin-top:-6px}
  .thumb{width:120px;border:1px solid var(--line);display:block;margin-bottom:10px}
  .bar{display:flex;gap:12px;align-items:center}
  .login{max-width:340px;margin:14vh auto 0}
  .empty{padding:60px 0;text-align:center;color:var(--dim)}
</style>
</head>
<body>
<div class="wrap">

<?php if (!logged_in()): ?>

  <div class="login">
    <div class="mark" style="margin-bottom:6px"><i>∞</i> SEZMOO</div>
    <p class="mono" style="margin:0 0 24px">Panel redakcyjny</p>
    <?php if ($loginError): ?><div class="note"><?= e($loginError) ?></div><?php endif; ?>
    <form method="POST">
      <input type="hidden" name="csrf" value="<?= e($csrf) ?>" />
      <input type="hidden" name="action" value="login" />
      <label><span>Hasło</span><input type="password" name="password" autofocus required /></label>
      <button class="btn btn--go" type="submit" style="width:100%;justify-content:center">Zaloguj</button>
    </form>
  </div>

<?php elseif ($editing !== null): ?>

  <?php
    $p  = $editing;
    $pl = $p['pl'] ?? [];
    $en = $p['en'] ?? [];
  ?>
  <header class="top">
    <div>
      <div class="mark"><i>∞</i> <?= $isNew ? 'Nowy wpis' : 'Edycja wpisu' ?></div>
      <p class="mono" style="margin:6px 0 0"><?= $isNew ? 'Blog' : e((string)($p['slug'] ?? '')) ?></p>
    </div>
    <a class="btn" href="index.php">← Wróć do listy</a>
  </header>

  <form class="edit" method="POST" enctype="multipart/form-data">
    <input type="hidden" name="csrf" value="<?= e($csrf) ?>" />
    <input type="hidden" name="action" value="save" />
    <input type="hidden" name="orig_slug" value="<?= e((string)($p['slug'] ?? '')) ?>" />
    <input type="hidden" name="image_current" value="<?= e((string)($p['image'] ?? '')) ?>" />

    <fieldset>
      <legend>Ustawienia</legend>
      <div class="row">
        <label><span>Data publikacji</span>
          <input type="date" name="date" value="<?= e((string)($p['date'] ?? date('Y-m-d'))) ?>" required /></label>
        <label><span>Kategoria</span>
          <select name="category">
            <?php foreach (CATEGORIES as $key => $labels): ?>
              <option value="<?= e($key) ?>" <?= ($p['category'] ?? '') === $key ? 'selected' : '' ?>><?= e($labels[0]) ?></option>
            <?php endforeach; ?>
          </select></label>
        <label><span>Czas czytania (min)</span>
          <input type="number" name="readmin" min="0" max="60" value="<?= e((string)($p['readmin'] ?? 4)) ?>" /></label>
      </div>
      <label><span>Adres wpisu (slug)</span>
        <input type="text" name="slug" value="<?= e((string)($p['slug'] ?? '')) ?>" placeholder="zostaw puste, wygeneruję z tytułu" /></label>
      <p class="hint">sezmoo.com/artykul.php?slug=<b>tu-trafia-slug</b></p>
      <div class="checks" style="margin-top:16px">
        <label><input type="checkbox" name="published" value="1" <?= !empty($p['published']) || $isNew ? 'checked' : '' ?> /> <span>Opublikowany</span></label>
        <label><input type="checkbox" name="featured" value="1" <?= !empty($p['featured']) ? 'checked' : '' ?> /> <span>Wyróżniony (duży kafel na górze)</span></label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Zdjęcie</legend>
      <?php if (!empty($p['image'])): ?>
        <img class="thumb" src="<?= e('../' . $p['image']) ?>" alt="" />
      <?php endif; ?>
      <label><span>Wgraj nowe (JPG, PNG, WEBP, AVIF · maks. 6 MB)</span>
        <input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/avif" /></label>
      <p class="hint">Zalecane 1600 × 900 px. Puste pole = zostaje obecne zdjęcie.</p>
    </fieldset>

    <fieldset>
      <legend>Treść PL</legend>
      <label><span>Tytuł</span><input type="text" name="pl_title" value="<?= e((string)($pl['title'] ?? '')) ?>" required /></label>
      <label><span>Zajawka</span><textarea name="pl_lead" style="min-height:80px"><?= e((string)($pl['lead'] ?? '')) ?></textarea></label>
      <label><span>Treść</span><textarea name="pl_body"><?= e((string)($pl['body'] ?? '')) ?></textarea></label>
      <p class="hint">## nagłówek &nbsp;·&nbsp; - punkt listy &nbsp;·&nbsp; &gt; cytat &nbsp;·&nbsp; pusta linia = nowy akapit</p>
    </fieldset>

    <fieldset>
      <legend>Treść EN</legend>
      <label><span>Title</span><input type="text" name="en_title" value="<?= e((string)($en['title'] ?? '')) ?>" /></label>
      <label><span>Lead</span><textarea name="en_lead" style="min-height:80px"><?= e((string)($en['lead'] ?? '')) ?></textarea></label>
      <label><span>Body</span><textarea name="en_body"><?= e((string)($en['body'] ?? '')) ?></textarea></label>
      <p class="hint">Puste pola = wersja EN pokaże treść polską.</p>
    </fieldset>

    <div class="bar">
      <button class="btn btn--go" type="submit">Zapisz wpis</button>
      <a class="btn" href="index.php">Anuluj</a>
    </div>
  </form>

<?php else: ?>

  <?php $posts = posts_all(); ?>
  <header class="top">
    <div>
      <div class="mark"><i>∞</i> SEZMOO</div>
      <p class="mono" style="margin:6px 0 0">Panel redakcyjny · blog</p>
    </div>
    <div class="bar">
      <a class="btn" href="../blog.php" target="_blank" rel="noopener">Podgląd bloga ↗</a>
      <a class="btn btn--go" href="index.php?new=1">+ Nowy wpis</a>
      <a class="btn btn--bad" href="index.php?action=logout">Wyloguj</a>
    </div>
  </header>

  <?php if (isset($_GET['saved'])): ?><div class="note">Wpis zapisany.</div><?php endif; ?>
  <?php if (isset($_GET['deleted'])): ?><div class="note">Wpis usunięty.</div><?php endif; ?>
  <?php if ($notice): ?><div class="note"><?= e($notice) ?></div><?php endif; ?>

  <?php if (!$posts): ?>
    <div class="empty">Brak wpisów. Zacznij od „Nowy wpis”.</div>
  <?php else: ?>
    <table>
      <thead>
        <tr><th>Wpis</th><th>Data</th><th>Kategoria</th><th>Status</th><th></th></tr>
      </thead>
      <tbody>
      <?php foreach ($posts as $p): ?>
        <tr>
          <td>
            <div class="t-title"><?= e((string)($p['pl']['title'] ?? '(bez tytułu)')) ?>
              <?php if (!empty($p['featured'])): ?><span class="pill pill--star">Wyróżniony</span><?php endif; ?>
            </div>
            <div class="t-slug"><?= e((string)($p['slug'] ?? '')) ?></div>
          </td>
          <td class="mono"><?= e(fmt_date((string)($p['date'] ?? ''), 'pl')) ?></td>
          <td class="mono"><?= e(cat_label((string)($p['category'] ?? ''), 'pl')) ?></td>
          <td>
            <form method="POST" style="display:inline">
              <input type="hidden" name="csrf" value="<?= e($csrf) ?>" />
              <input type="hidden" name="action" value="toggle" />
              <input type="hidden" name="slug" value="<?= e((string)($p['slug'] ?? '')) ?>" />
              <button type="submit" class="pill <?= !empty($p['published']) ? 'pill--on' : 'pill--off' ?>"
                style="cursor:pointer;background:none"
                title="Kliknij, aby zmienić"><?= !empty($p['published']) ? 'Opublikowany' : 'Szkic' ?></button>
            </form>
          </td>
          <td>
            <div class="acts">
              <a class="btn" href="index.php?edit=<?= e((string)($p['slug'] ?? '')) ?>">Edytuj</a>
              <form method="POST" onsubmit="return confirm('Usunąć wpis na stałe?')">
                <input type="hidden" name="csrf" value="<?= e($csrf) ?>" />
                <input type="hidden" name="action" value="delete" />
                <input type="hidden" name="slug" value="<?= e((string)($p['slug'] ?? '')) ?>" />
                <button class="btn btn--bad" type="submit">Usuń</button>
              </form>
            </div>
          </td>
        </tr>
      <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>

<?php endif; ?>

</div>
</body>
</html>
