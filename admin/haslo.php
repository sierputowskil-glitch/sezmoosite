<?php
/**
 * SEZMOO — generator hasła do panelu.
 * Wpisz nowe hasło, skopiuj wynik i wklej do cms/config.php jako CMS_PASS_HASH.
 * Po zmianie hasła ten plik możesz skasować z serwera.
 */

declare(strict_types=1);
require_once __DIR__ . '/../cms/config.php';

$out = '';
if (!empty($_POST['p'])) {
    $out = hash('sha256', CMS_PEPPER . (string)$_POST['p']);
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<title>SEZMOO · nowe hasło</title>
<style>
  body{background:#111211;color:#ece9e3;font:400 15px/1.55 system-ui,sans-serif;
    padding:14vh 24px;margin:0}
  .w{max-width:520px;margin:0 auto}
  h1{font-size:20px;margin:0 0 6px}
  p{color:#8b8a85;font-size:14px}
  input,button{width:100%;padding:12px 14px;border-radius:2px;font:400 14px system-ui,sans-serif}
  input{background:#0d0e0d;border:1px solid #2a2b29;color:#ece9e3;margin-bottom:12px}
  button{background:#ffd200;border:0;color:#111;font-weight:600;cursor:pointer}
  code{display:block;word-break:break-all;background:#0d0e0d;border:1px solid #ffd200;
    padding:14px;margin-top:20px;font:400 13px/1.6 ui-monospace,monospace;color:#ffd200}
</style>
</head>
<body>
<div class="w">
  <h1>Nowe hasło do panelu</h1>
  <p>Wpisz hasło, skopiuj wynik i wklej do <b>cms/config.php</b> w miejsce <b>CMS_PASS_HASH</b>.</p>
  <form method="POST">
    <input type="text" name="p" placeholder="nowe hasło" autofocus required />
    <button type="submit">Wygeneruj</button>
  </form>
<?php if ($out): ?>
  <code>const CMS_PASS_HASH = '<?= htmlspecialchars($out) ?>';</code>
<?php endif; ?>
</div>
</body>
</html>
