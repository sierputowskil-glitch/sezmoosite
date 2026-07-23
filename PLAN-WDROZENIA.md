# SEZMOO — plan wdrożenia na sezmoo.com (deadline: 22 lipca)

Legenda: ✅ zrobione · 🟡 do zrobienia (ja) · 🔴 potrzebuję od Ciebie / decyzji

Kierunek: **Netlify** (statyczny hosting + HTTPS + Netlify Forms). Domena zostaje w cyberfolks — zmieniamy tylko rekordy DNS (MX / poczta bez zmian).

---

## 1. SEO / techniczne
- ✅ meta title + description (PL + EN, wszystkie kluczowe strony)
- ✅ Open Graph + JSON-LD (ProfessionalService + VideoObject w case studies)
- ✅ sitemap.xml + robots.txt (19 URL-i)
- 🟡 hreflang PL↔EN — dorobię
- 🔴 og:image (1200×630) — dać plik lub zgoda na wygenerowanie z logo
- 🔴 favicon (∞) — zgoda na wygenerowanie z logo

## 2. Formularz kontaktowy
- ✅ Wpięty pod **Netlify Forms** (PL + EN): realny POST, honeypot antyspam, komunikat po wysłaniu
- 🔴 **Po deployu na Netlify:** w panelu Netlify → Forms → Notifications ustawić e-mail powiadomień na **biuro@sezmoo.com** (2 min, po Twojej stronie lub razem)
- ℹ️ Zgłoszenia widoczne też w panelu Netlify (kopia bezpieczeństwa)

## 3. Treści
- ✅ Linki social podmienione wszędzie (FB /sezmooagencja, IG /sezmoo, YT /@sezmooagency, LinkedIn /company/sezmoo)
- 🔴 E-mail wyświetlany w kontakcie/stopce to nadal `hello@sezmoo.com` — czy zmienić na `biuro@sezmoo.com`? (formularz i tak idzie na biuro@)
- 🔴 YouTube `origin` — dodam `&origin=https://sezmoo.com` do embedów (mniej „zaloguj się" od YT)

## 4. Domena i hosting (Netlify)
- 🔴 Założyć konto Netlify + połączyć z repo GitHub (auto-deploy) — albo wgrać folder ręcznie
- 🟡 `netlify.toml` / `_redirects` (ładne ścieżki, /en, 404) — dorobię
- 🔴 W cyberfolks: rekordy DNS na Netlify (A + CNAME www), **MX bez zmian** (poczta działa)
- 🔴 Backup obecnej strony WordPress przed przełączeniem

## 5. Przed startem
- 🔴 Redirecty 301 ze starych URL-i WordPress → nowe (mam listę starych ze sezmoo.com — przygotuję mapę)
- 🟡 Strona 404 — dorobię
- 🔴 Google Search Console: dodać domenę + wysłać sitemap (po starcie)
- 🔴 Analytics / cookies — wpinamy? (jeśli tak: ID + baner zgody)
- 🟡 Test końcowy: linki, PL↔EN, formularz, mobile, dark/light

---

## Redirecty 301 — stare URL-e WordPress (do mapy przekierowań)
Stara strona ma m.in.: /o-nas/, /uslugi/, /blog/, /kontakt, /polityka-prywatnosci,
oraz /uslugi-marketingowe/<slug>/ (część slugów pokrywa się z nowymi — dobrze dla SEO).
Nowe skróciliśmy do 5 kategorii — dla usuniętych zrobimy 301 na najbliższą kategorię.

## Blokuje start (must-have 22.07)
1. 🔴 Konto Netlify + deploy + DNS w cyberfolks (MX zostaw)
2. 🔴 Powiadomienia formularza na biuro@sezmoo.com (panel Netlify)
3. 🔴 favicon + og:image (zgoda na generację z logo)
4. 🔴 Decyzja: hello@ czy biuro@ jako wyświetlany e-mail

## Zrobię sam (bez Ciebie)
hreflang · 404.html · netlify.toml/_redirects · YouTube origin · mapa 301 · favicon/og:image z logo (po zgodzie)
