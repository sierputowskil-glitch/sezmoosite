# Jak wgrać tę paczkę (bez ryzyka)

## Najważniejsza zasada
**NADPISZ, NIE ZAMIENIAJ.** Wrzuć zawartość tego folderu na wierzch repo —
pliki o tych samych nazwach się nadpiszą, wszystko inne zostaje nietknięte.

NIE usuwaj wcześniej niczego z repo. W szczególności zostawić:
- `vendor/phpmailer/` — biblioteka wysyłki maili (nie ma jej w tej paczce)
- `send.php`, `router.php`, `redirects.php`, `public-config.php`, `404.php`
- `sitemap.xml`, `robots.txt`, `.gitignore`, `composer.json`
Te pliki się NIE zmieniły, więc ich tu nie ma. Jeśli je skasujesz, formularz padnie.

## Krok po kroku (GitHub Desktop)
1. Rozpakuj zip.
2. Otwórz lokalny folder repo `sezmoosite` (Repository → Show in Finder/Explorer).
3. Skopiuj **zawartość** folderu `_do-podmiany` do folderu repo.
   Na pytanie o nadpisanie plików → **Zamień / Scal** (Merge, nie Replace folderu!).
   - macOS: przy folderach wybieraj „Scal" (Merge), nie „Zamień" (Replace).
     Jeśli nie widzisz „Scal", przytrzymaj Option podczas przeciągania.
   - Windows: „Zamień pliki w miejscu docelowym" — to zachowuje pozostałe pliki.
4. W GitHub Desktop sprawdź listę zmian. Powinno być ~140 zmienionych plików
   i ~70 nowych zdjęć. **Nie może być ani jednego pliku oznaczonego jako usunięty.**
   Jeśli widzisz usunięcia — przerwij (Discard changes) i napisz do mnie.
5. Commit → Push.

## Co się zmieniło
- Poprawki treści: H1 „po realizację", opis fotografii, SEZMOO, inicjały ŁS,
  stanowisko Olgi (Project & Digital Marketing Manager)
- Telefon: 502 260 450 → **739 260 450** na wszystkich stronach + w danych
  strukturalnych JSON-LD
- Nowy favicon (znak ∞ z logo) i nowy obrazek OG 1200×630
- Portfolio PL+EN: 35 → **50 kafli**; Fotografia 1 → 12
- Nowa galeria lightbox dla kafli ze zdjęciami (strzałki, klawiatura, licznik)
- Naprawione ścieżki zdjęć w EN case studies: Kapka Cafe i PrimeSpot
  (wcześniej żadne zdjęcie się nie ładowało)
- Uzupełnione galerie „Wybrane realizacje" na 5 stronach usług PL + 5 EN

## Uwaga: GitHub Pages
Na GitHub Pages formularz kontaktowy **nie zadziała** — `send.php` wymaga PHP.
Ruszy dopiero na Cyberfolks. Struktura URL-i i SEO bez zmian.
