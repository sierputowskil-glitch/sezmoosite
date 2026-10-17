# AGENTS.md — SEZMOO site

Standards for AI agents and humans working in this repository. Prefer this file over guessing; for ops/deploy detail see [README.md](./README.md).

## What this repo is

Static marketing site for **SEZMOO** (Gdańsk creative / production agency):

- **Astro 5**, `output: 'static'`, `trailingSlash: 'always'`, directory URLs
- **Production:** Cloudflare Pages + Pages Function (`functions/api/contact.ts`)
- **Optional preview:** GitHub Pages mirror (no contact API)
- **Languages:** PL (default routes) + EN under `/en/…`
- **Legacy:** pre-Astro HTML on branch `legacy/cyberfolks-html` — do not mix that tree into `main` casually

Phone everywhere: **+48 739 260 450** (`src/lib/site.ts` → `PHONE_DISPLAY` / `PHONE_TEL`). Keep footers, contact, and `assets/js/form.js` / `core.js` in sync when changing it.

## Non-negotiables

1. **Never commit secrets:** `.env`, `.dev.vars`, SMTP/Turnstile secrets. Use `.env.example` / `.dev.vars.example` only.
2. **Edit source assets in `assets/`**, not `public/assets/`. `predev` / `prebuild` run `npm run sync:assets` (real copy, not symlink).
3. **Trailing slashes** on all internal links (`/blog/`, `/uslugi-marketingowe/abonamenty/`). Match `astro.config.mjs`.
4. **Canonicals / OG** must use `pageUrl()` / `PUBLIC_SITE_URL` — never hardcode `localhost` in shipped meta. Prod CI bakes `https://sezmoo.com`.
5. **Do not reintroduce** `/abonament/` or `/en/retainer/` as on-site pages — they 301 to `https://abonament.sezmoo.com/` (separate campaign LP). Service page `/uslugi-marketingowe/abonamenty/` stays here.
6. **One-shot migrators** (`npm run migrate:*`, `unstring:*`, many `scripts/*.mjs`) are historical — not for CI or routine edits. Prefer editing Astro/MD/TS directly.
7. **Node ≥ 22** (`.nvmrc`). After substantive changes: `npm run check` (and `lint` when touching TS/Astro structure).

## Layout (where to change what)

| Path | Role |
| --- | --- |
| `src/pages/` | Routes (`index.astro`, services, case-study shells, `[slug].astro` for blog) |
| `src/pages/en/` | English mirrors |
| `src/content/blog/` | Blog Markdown collection |
| `src/content.config.ts` | Blog Zod schema — update when adding frontmatter fields |
| `src/components/` | Shared UI (`Nav`, `Footer`, `ContactForm`, `BlogArticle`, `ServicePage`, …) |
| `src/layouts/` | `BaseLayout`, `ArticleLayout`, `ServiceLayout`, `CaseStudyLayout`, `PortfolioLayout` |
| `src/data/case-studies.ts` | Case-study PL/EN copy keyed by YouTube / CDN video id |
| `src/data/services/` | Service PL/EN copy + block structure (`types.ts`, `pages/*.ts`) |
| `src/lib/` | `site.ts` (URLs, phone, media CDN), `blog.ts`, `schema.ts` (JSON-LD objects) |
| `assets/` | CSS, JS, images, video posters/manifest — source of truth (`assets/css/portfolio.css`, `case-study.css`) |
| `public/` | `_redirects`, `_headers`, `robots.txt`, `404.html`; assets appear after sync |
| `functions/` | CF Pages Functions only (contact + rate limit) |
| `scripts/` | Asset sync + one-off migrators / optimizers |

## Commands

```bash
nvm use
cp .env.example .env          # if missing
cp .dev.vars.example .dev.vars
npm ci
npm run sync:assets
npm run dev                   # http://localhost:4321
npm run check                 # astro check
npm run lint
npm run build                 # → dist/
npm run dev:functions         # Wrangler over dist/ for /api/contact
```

Contact API locally needs `npm run build` then `npm run dev:functions`, with Turnstile + SMTP in `.dev.vars`.

## Code conventions

### Astro pages

- Prefer existing layouts: services → `ServiceLayout` + `ServicePage`, articles → `ArticleLayout` + `BlogArticle`, case studies → `CaseStudyLayout` / `CaseStudyPage`.
- Set `lang`, `title`, `description`, `canonical` via `pageUrl('/path/')`. Pass `hreflangPl` / `hreflangEn` when a PL↔EN pair exists.
- Reuse `ContactForm`, `AssetImage` / `OptImage`, `Footer`, `Nav` — do not duplicate chrome.
- **JSON-LD as objects only** — pass `jsonLd` (object or array) into the layout. Build via `src/lib/schema.ts` (`serviceJsonLd`, `faqPageJsonLd`, `blogPostingJsonLd`, `sezmooOrganization`). Never dump `<script type="application/ld+json">` into `extraHead`. Provider data stays SEZMOO, Gdańsk, `biuro@sezmoo.com`, phone from `site.ts`.
- Preserve design system: CSS variables and classes from `assets/css` + layout inline styles; fonts are Archivo Variable + Space Mono (`src/styles/fonts.css`). Do not swap to Inter/system defaults.

### Site JS (`assets/js/`)

Edit source here, not `public/assets/`. Vite-hashed imports from layouts/pages.

| File | Loads | Role |
| --- | --- | --- |
| `app.js` | `BaseLayout` | Barrel: `core.js` + `form.js` |
| `core.js` | via `app.js` | Nav, logo, Lenis, reveal, anchors, sub-hero intro, mobile bar |
| `form.js` | via `app.js` | Contact / retainer Turnstile (`#retainer-form`, `form.cform`) |
| `home.js` | `index.astro` + `en/index.astro` only | Hero video, reel, timeline, pack, team, hover-play |
| `portfolio-page.js` | `PortfolioLayout` | Listing filters / lightbox |
| `cdn-video-map.js` | `BaseLayout` | CDN `data-video` map (home, services, cases) |
| `flowing-background.js` | lazy public URL | Desktop FX — leave as-is |

Do not dump homepage or portfolio logic back into `app.js`. Case-study play stays in `CaseStudyLayout` inline.

### Assets & media

- Site images/CSS/JS: `assets/…` → synced to `/assets/…`.
- Blog heroes: typically `/assets/blog/<slug>.webp` (file under `assets/blog/`).
- **Service LCP / reel images:** store the real source under `assets/work/`, `assets/photo/`, `assets/img/`, or `assets/portfolio/` and render with `AssetImage` / `OptImage`. Do **not** point copy at `/assets/optimized/lcp/` (prebaked srcsets). `src/lib/local-image.ts` globs those folders. Heroes: `fetchpriority="high"` + `loading="eager"`.
- MP4: Hostido CDN via `getMediaBase()` / `mediaUrl()` (`PUBLIC_MEDIA_BASE`, default `https://cdn.sezmoo.com`). Posters may stay on Pages for LCP.
- Video case-study ids and posters: `assets/video/yt/manifest.json` (and related queue) — keep `case-studies.ts` `videoId`s aligned with the manifest / `CASE_STUDY_ORDER`.

### TypeScript / quality

- ESM (`"type": "module"`). Match existing import style and Prettier (`.prettierrc.json`, `prettier-plugin-astro`).
- Do not expand scope: no drive-by refactors, no unsolicited README/docs unless asked.
- Conventional commits when committing (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`).

## Content conventions

### Blog (`src/content/blog/*.md`)

- **URL:** `/{filename-without-extension}/` via `src/pages/[slug].astro` (not under `/blog/{slug}/`). Listing lives at `/blog/`.
- **Filename = slug** (kebab-case PL SEO slug). Changing the filename changes the public URL — update internal links and redirects if needed.
- **Schema** (`src/content.config.ts`): required `title`, `date`, `topic` ∈ `strategy` | `production` | `social`; optional `description`, `lead`, hero fields, `toc`, CTA overrides, OG overrides, `readingTime`, `lang` (`pl`|`en`, default `pl`).
- **Flags:**
  - `draft: true` — not built
  - `listed: false` — builds at slug URL but omitted from `/blog/` listings (e.g. sample `/artykul/` locally; production `_redirects` sends `/artykul/` → `/blog/`)
- **Body habits:**
  - Section headings as `<h2 id="…" class="reveal">…</h2>` matching `toc[].id`
  - Optional empty `<div id="wstep" class="reveal"></div>` for lead-only “Wstęp”
  - Internal links to services with trailing slash, e.g. `/uslugi-marketingowe/obsluga-social-media/`
  - Tone: practical B2B PL (or EN if `lang: en`), SEZMOO as agency voice — concrete, sales-aware, not fluff
- **Frontmatter checklist for a new post:**
  ```yaml
  title: …
  description: "…"          # meta + social fallback
  date: YYYY-MM-DD
  topic: strategy|production|social
  topicLabel: STRATEGIA|PRODUKCJA|SOCIAL   # optional; defaults from topic
  lang: pl
  draft: false
  listed: true
  featured: false
  readingTime: N
  heroImage: /assets/blog/<slug>.webp
  heroAlt: …
  heroCaption: "SEZMOO / BLOG"
  ogTitle: "… | SEZMOO"
  ogDescription: "…"
  lead: "…"
  toc:
    - id: "…"
      label: "…"
  ```
- After adding a hero file under `assets/blog/`, run sync (or rely on `predev`/`prebuild`).

### Case studies (copy + routes)

- **Data-driven video cases:** copy in `src/data/case-studies.ts` (PL + EN per YouTube `videoId` + public `slug`). URLs: `/realizacja/{slug}/` and `/en/realizacja/{slug}/` via `src/pages/realizacja/[slug]/` (no new Astro file per case). Legacy `/realizacja/{videoId}/` and `?v=` redirect to the slug.
- **Order / next-nav:** `CASE_STUDY_ORDER` (videoIds) in the same file — update when inserting; keep `slug` unique and title-derived.
- **Legacy one-off shells** still exist as `src/pages/realizacja-*/` (and EN mirrors) for non-standard layouts; prefer the `[id]` pipeline for new video cases.
- Player uses `data-video="{ytId}"` → `assets/js/cdn-video-map.js` → MP4 on Hostido CDN (`cdn.sezmoo.com`). Posters stay on Pages: `/assets/video/yt/posters/{id}.webp`.

### New video case study — pipeline

Do **not** ship large MP4s in the Pages deploy (`sync:assets` skips `assets/video/**/*.mp4`). Flow:

1. **YouTube id + slug**  
   Pick the public YT id and a kebab slug (`audi-rs5-trailer`). Filename convention: `{id}__{slug}.mp4`.

2. **Queue** — append to `assets/video/yt/queue.json`:
   ```json
   { "id": "WG5ufZMfjQ8", "slug": "audi-rs5-trailer", "file": "WG5ufZMfjQ8__audi-rs5-trailer.mp4" }
   ```

3. **Download tool + quality**  
   - Tool: **`scripts/download-ytultra.mjs`** (`npm run fetch:yt-videos`) — ytultra API (`api.ytultra.com`), mux with **ffmpeg**.  
   - Quality: prefers **1080p MP4**, then 720p → 480p → …; muxes matching **m4a** when the video stream is DASH-only.  
   - Needs: Node 22+, `ffmpeg` / `ffprobe` on PATH.  
   - Output: local `assets/video/yt/{id}__{slug}.mp4` + updates `assets/video/yt/manifest.json`.  
   - Skips ids already in manifest with `ok: true`.

4. **Upload to CDN (Hostido)**  
   Put the file at:  
   `https://cdn.sezmoo.com/video/yt/{id}__{slug}.mp4`  
   (same path as `manifest.path`). Ensure the manifest entry has:
   ```json
   "cdn": "https://cdn.sezmoo.com/video/yt/{id}__{slug}.mp4"
   ```

5. **Regen client map**  
   `npm run fetch:yt-videos` rewrites the `sez.cdnVideoMap` block in `assets/js/cdn-video-map.js` from manifest entries with `ok` + `cdn` (keeps `mountCdnVideo` helpers).

6. **Poster (LCP / UI)**  
   ```bash
   npm run fetch:yt-posters
   ```
   Needs **ffmpeg** + **cwebp**. Pulls a frame from the CDN MP4 (fallback: `i.ytimg.com` maxres/hq). Writes `assets/video/yt/posters/{id}.webp`.

7. **Site copy** — add `CASE_STUDIES[id]` with `slug` (kebab title), PL + EN, and append id to `CASE_STUDY_ORDER`. Mirror an existing entry (`short: true` for 9:16). Fields: `slug`, `title`, `client`, `cat`, `kv`, `lead`, `intro`, `context[]`, `steps[]`. Add `_redirects` from `/realizacja/{id}/` → `/realizacja/{slug}/` (PL + EN).

8. **Optional portfolio cards** — homepage / `portfolio/` are still hand-authored; add a card with `data-case="1"`, `data-slug`, `href="/realizacja/{slug}/"` and the new poster if the case should appear in listings. (`/portfolio-lista-b/` and hub `/realizacja/` 301 → portfolio.)

9. **Verify** — `npm run check`; open `/realizacja/{slug}/`, confirm poster + play hits CDN (not YouTube embed). Do not commit local MP4s (CDN only); commit queue/manifest/posters/map + `case-studies.ts`.

### Service & marketing pages

Data-driven like video case studies — **do not fork full HTML** per language.

- **Copy + blocks:** `src/data/services/pages/<pl-slug>.ts` (`pl` + `en` on one `ServiceDef`). Register in `src/data/services/index.ts` `SERVICES`.
- **Template:** `src/components/service/ServicePage.astro` + `ServiceBlockBody.astro` (`sd__*` classes). JSON-LD from copy via `serviceJsonLd` / FAQ from `copy.faq` or `type: 'faq'` blocks.
- **Thin routes only:**
  - PL: `src/pages/uslugi-marketingowe/<plSlug>/index.astro` → `serviceByPlSlug('…')` + `<ServicePage def={def} lang="pl" />`
  - EN: `src/pages/en/services/<enSlug>/index.astro` → `serviceByEnSlug('…')` + `lang="en"`
- Keep meta titles brand-suffixed (`| SEZMOO`), descriptions unique, schema catalog/FAQ in sync with visible claims. Preserve `&nbsp;` / typographic HTML in copy strings.
- **Hubs** `/uslugi-marketingowe/` and `/en/services/` are still hand-authored (not `ServicePage`).
- **Legacy aliases (not ServicePage):** `/uslugi-marketingowe/kampanie-reklamowe/` and `/en/services/advertising-campaigns/` 301 in `public/_redirects` to `kampanie-platne` / `paid-campaigns`. Thin Astro pages remain as local/preview `location.replace` fallbacks (canonicals point at the live service).
- Homepage marketing HTML is still page-owned (`index.astro` / `en/index.astro` + `home.js`).
- Portfolio listing CSS: `assets/css/portfolio.css` imported from `PortfolioLayout` (`?url` stylesheet). Case-study CSS: `assets/css/case-study.css` via `CaseStudyLayout`. Do not dump page CSS into `extraHead` (preload links are OK).

### Redirects & SEO

- Legacy paths: `public/_redirects` (Cloudflare). Prefer adding a redirect over leaving soft-404s for old WP/CyberFolks URLs.
- Sitemap: `@astrojs/sitemap` at build — drafts/unlisted behavior follows collection filters in pages.
- GTM: only when `PUBLIC_ENABLE_GTM=true` (prod CI). Do not enable in local defaults.

## Env cheat sheet

| Variable | Where | Notes |
| --- | --- | --- |
| `PUBLIC_SITE_URL` | `.env` / CI | Canonical origin |
| `PUBLIC_BASE_PATH` | `.env` / CI | `/` prod; `/sezmoosite` GH Pages |
| `PUBLIC_CONTACT_API_URL` | `.env` / CI | `/api/contact` on CF; **empty** on GH Pages |
| `PUBLIC_TURNSTILE_SITE_KEY` | `.env` / CI | Dev forces Cloudflare dummy on `astro dev` |
| `PUBLIC_ENABLE_GTM` | CI | `true` only in prod-like deploys |
| `PUBLIC_MEDIA_BASE` | optional | CDN for MP4 |
| Secrets | `.dev.vars` / CF | `TURNSTILE_SECRET_KEY`, `SMTP_*`, `MAIL_TO` |

## Agent workflow (recommended)

1. Read this file + the nearest existing file of the same type (sibling page / post / case study).
2. Make the smallest change that satisfies the request.
3. For content: validate frontmatter against `content.config.ts`; keep TOC ids ↔ heading ids. For services: edit `src/data/services/pages/*.ts`, not duplicated markup in both language trees.
4. For UI: reuse layouts/components; keep PL/EN pairs and hreflang aligned when both exist.
5. Verify with `npm run check` (and `npm run build` if touching routes, redirects, or env-sensitive meta).
6. Do not commit unless the user asks; never push unless asked.

## Out of scope / ask first

- DNS, Cloudflare dashboard KV/secret cutover (documented in README — human ops)
- Rewriting the whole design system or replacing CSS architecture
- Running mass migrators against the live tree without an explicit request
- Changing production GTM/Turnstile keys in CI workflows without confirmation
