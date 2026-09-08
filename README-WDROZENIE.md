# SEZMOO — wdrożenie

## 1. Test lokalny (5 minut, nic nie wgrywasz)

Rozpakuj paczkę, wejdź do folderu w terminalu:

    php -S localhost:8000

Otwórz:
- http://localhost:8000/            — strona główna
- http://localhost:8000/blog.php    — blog z CMS
- http://localhost:8000/admin/      — panel, hasło: sezmoo2026

Co NIE zadziała lokalnie: wysyłka maila z formularza (brak serwera pocztowego).
Sam formularz, walidacja i zabezpieczenia antybotowe działają normalnie.

## 1b. Test na GitHubie (Codespaces)

GitHub Pages NIE uruchomi tej strony — nie obsługuje PHP.
Do testów służy GitHub Codespaces, czyli maszyna z PHP w przeglądarce.

1. Wgraj paczkę do repozytorium (razem z katalogiem .devcontainer)
2. Na stronie repo: zielony przycisk Code → zakładka Codespaces
   → Create codespace on main
3. Poczekaj ok. minuty. Serwer startuje sam, podgląd otworzy się w oknie obok.
   Jeśli nie: zakładka PORTS na dole → port 8000 → ikona globusa.
4. Adresy: /  ·  /blog.php  ·  /admin/  (hasło: sezmoo2026)

Uwaga: żeby panel działał, port 8000 musi być ustawiony jako Public
(zakładka PORTS → prawy klik na porcie → Port Visibility → Public).
Wysyłka maila w Codespaces nie zadziała, tak samo jak lokalnie.

Darmowy limit to 60 godzin miesięcznie. Codespace zatrzymaj po teście
(Code → Codespaces → ... → Stop codespace), żeby nie zjadał limitu.

## 2. Test na subdomenie Cyberfolks

1. W panelu utwórz subdomenę, np. test.sezmoo.com
2. Wgraj CAŁĄ zawartość paczki do jej katalogu (nie sam folder)
3. Skasuj plik .htaccess, a .htaccess-TEST przemianuj na .htaccess
   (wersja produkcyjna wymusza przeskok na sezmoo.com i wyrzuci Cię z testu)
4. Nadaj prawa zapisu:
       chmod 755 assets/blog
       chmod 755 cms/data
5. Wejdź na /admin/ i sprawdź dodawanie wpisu ze zdjęciem

Poczta na subdomenie zadziała dopiero po krokach z sekcji 3.

## 3. Produkcja (sezmoo.com)

Kolejność ma znaczenie:

1. W panelu Cyberfolks podepnij domenę i włącz SSL (Let's Encrypt)
2. Załóż skrzynkę lub alias: no-reply@sezmoo.com
3. Włącz SPF i DKIM dla domeny
4. Sprawdź, że PHP to wersja 8.1 lub nowsza
5. Wgraj zawartość paczki do public_html (plik .htaccess, NIE .htaccess-TEST)
6. chmod 755 assets/blog oraz cms/data
7. Wejdź na /admin/haslo.php, wygeneruj własne hasło,
   wklej wynik do cms/config.php jako CMS_PASS_HASH
8. SKASUJ z serwera plik admin/haslo.php
9. Wyślij testowe zgłoszenie z formularza i sprawdź skrzynkę (także spam)

## Co gdzie leży

    cms/config.php      hasło do panelu, adres odbiorcy, kategorie
    cms/data/posts.json wpisy bloga — kopiuj przy backupie
    assets/blog/        zdjęcia wgrane przez panel
    send.php            obsługa formularza kontaktowego
    token.php           token antybotowy (FORM_SECRET musi być taki sam jak w send.php)
    admin/              panel redakcyjny

## Backup

Wystarczy pobrać cms/data/posts.json i katalog assets/blog/.
Reszta strony jest w repozytorium.

## Uwaga przy kolejnych aktualizacjach

NIE nadpisuj na serwerze plików:
- cms/data/posts.json  (treść dodana przez panel)
- assets/blog/         (zdjęcia z panelu)
- cms/config.php       (Twoje hasło)
