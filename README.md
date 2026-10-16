# SEZMOO site (Astro)

Static marketing site built with **Astro 5**, hosted on **Cloudflare Pages** (production) with a **Pages Function** for the contact form. Optional previews: Cloudflare Pages project `sezmoo-staging` (`*.sezmoo-staging.pages.dev`) and GitHub Pages static mirror (no `/api/contact`).

Legacy CyberFolks HTML/PHP snapshot lives on branch [`legacy/cyberfolks-html`](https://github.com/sierputowskil-glitch/sezmoosite/tree/legacy/cyberfolks-html) (tip = pre-Astro `main`).

## Stack

| Layer | Choice |
| --- | --- |
| Pages | Astro (`src/pages`, static output) |
| Blog | `src/content/blog/` + `src/pages/[slug].astro` |
| Assets | Root `assets/` → synced to `public/assets/` before `dev`/`build` |
| Contact API | `functions/api/contact.ts` (CF Pages Function) |
| Rate limit | Cloudflare KV binding `CONTACT_RATE_LIMIT` (falls back to in-memory if unbound) |
| Sitemap | `@astrojs/sitemap` (generated at build) |
| Node | 22 (see `.nvmrc`) |

## Quick start

```bash
nvm use          # or Node 22+
cp .env.example .env
cp .dev.vars.example .dev.vars   # secrets for wrangler — never commit
npm ci
npm run sync:assets              # also runs via predev / prebuild
npm run dev                      # http://localhost:4321
```

### Contact API locally

```bash
npm run build
npm run dev:functions            # serves dist/ + functions/ via Wrangler
```

Put Turnstile + SMTP secrets in `.dev.vars` (see `.dev.vars.example`).

## npm scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Astro dev server (syncs assets first) |
| `npm run build` | Production static build → `dist/` |
| `npm run check` | `astro check` (types / Astro diagnostics) |
| `npm run lint` | ESLint (Astro + TS) |
| `npm run format` | Prettier write |
| `npm run sync:assets` | Copy `assets/` → `public/assets/` (real files, not symlink) |
| `npm run dev:functions` | Wrangler Pages Dev over `dist/` |
| `migrate:*` / `unstring:*` | **One-shot migrators** — not for CI; see `scripts/*.mjs` headers |

## Environment

**Public (build-time, `.env` / CI):**

- `PUBLIC_SITE_URL` — canonical origin (`https://sezmoo.com` or GH Pages origin). Local `.env` may use `http://localhost:4321`; **prod CI must bake `https://sezmoo.com`** (see `.github/workflows/cf-pages-prod.yml`).
- `PUBLIC_BASE_PATH` — `/` in prod; `/sezmoosite` (repo name) on GH Pages staging
- `PUBLIC_TURNSTILE_SITE_KEY` — real site key in prod CI; on **`astro dev`** the app forces Cloudflare invisible dummy `1x00000000000000000000BB` (always pass)
- `PUBLIC_CONTACT_API_URL` — `/api/contact` on CF; **leave empty on GH Pages staging** (form posts are disabled)
- `PUBLIC_ENABLE_GTM` — set `true` **only in prod CI**; omit locally and on GH Pages staging (no GTM)

Local form API (`.dev.vars`): use Turnstile dummy secret `1x0000000000000000000000000000000AA` with the invisible sitekey above.

**Secrets (`.dev.vars` / CF dashboard — not in git):**

- `TURNSTILE_SECRET_KEY`, `SMTP_PASS`, and optional SMTP_* / `MAIL_TO` (defaults also in `wrangler.toml` `[vars]`)

Verify a prod-like local build:

```bash
PUBLIC_SITE_URL=https://sezmoo.com PUBLIC_BASE_PATH=/ \
  PUBLIC_CONTACT_API_URL=/api/contact \
  PUBLIC_ENABLE_GTM=true \
  PUBLIC_TURNSTILE_SITE_KEY=… \
  npm run check && npm run build
# Then: rg -n 'localhost' dist/ | head   # should be empty for canonicals/og
```

## Hosting

### Production — Cloudflare Pages

Workflow: `.github/workflows/cf-pages-prod.yml` (push to `main` / manual).

- Build with `PUBLIC_BASE_PATH=/`, `PUBLIC_CONTACT_API_URL=/api/contact`
- Deploy `dist/` + `functions/` via Wrangler
- Configure secrets and KV binding in the CF dashboard (or `wrangler.toml`)

### Optional — Cloudflare Pages preview (`sezmoo-staging`)

- No custom domain (detached from `sezmoo.websky.pro`)
- Deploy manually / via Wrangler: `npx wrangler pages deploy dist --project-name=sezmoo-staging --branch=staging`
- Build with `PUBLIC_SITE_URL` set to the deployment `*.pages.dev` URL (or leave unset for local checks), `PUBLIC_BASE_PATH=/`, `PUBLIC_CONTACT_API_URL=/api/contact`

### Optional — GitHub Pages mirror

Workflow: `.github/workflows/gh-pages-staging.yml`.

- On `feat/*`: **build + check only** (deploy skipped — `github-pages` env allows `main` only)
- On `main`: static deploy to GitHub Pages
- `PUBLIC_CONTACT_API_URL` is empty so the form does **not** pretend `/api/contact` works
- Prefer prod / `*.pages.dev` for layout/content; test the form with `npm run dev:functions` or production

## Cutover checklist (DNS / Cloudflare)

Do these in the CF dashboard / DNS host — not automated by this repo:

1. **KV** — create `CONTACT_RATE_LIMIT` (+ preview), paste IDs into `wrangler.toml` (`REPLACE_WITH_KV_*`), bind the same name on the Pages project.
2. **Secrets** — Pages project → Settings → Variables: `TURNSTILE_SECRET_KEY`, `SMTP_PASS` (+ any SMTP_* / `MAIL_TO` overrides).
3. **Turnstile** — allowlist production host `sezmoo.com` (and `www` if used); staging/preview hosts as needed. Site key → `PUBLIC_TURNSTILE_SITE_KEY` in the prod workflow / build env.
4. **DNS** — point apex/`www` to Cloudflare Pages (CNAME / custom domain on the project). Keep TTL low during cutover.
5. **Form smoke test** — after deploy: submit `/#kontakt` with a real Turnstile token; confirm mail delivery and rate-limit headers. Campaign LP form lives on `https://abonament.sezmoo.com/`.
6. **Redirects** — `public/_redirects` ships with the deploy; confirm `/artykul/` → `/blog/`, DE → EN, and `/abonament/` → `https://abonament.sezmoo.com/`.
7. **Canonicals** — spot-check `link rel="canonical"` and `og:url` on home + one article = `https://sezmoo.com/...` (no localhost).

## Cloudflare KV (contact rate limit)

1. Create namespaces:

   ```bash
   npx wrangler kv namespace create CONTACT_RATE_LIMIT
   npx wrangler kv namespace create CONTACT_RATE_LIMIT --preview
   ```

2. Paste the returned IDs into `wrangler.toml` (`id` / `preview_id`) replacing `REPLACE_WITH_KV_*`.

3. In Cloudflare Pages → project → Settings → Bindings, add KV namespace binding name `CONTACT_RATE_LIMIT` to the same namespace (if not applied from `wrangler.toml`).

Until IDs are real, the Function falls back to an in-isolate `Map` (weaker across isolates).

## URL notes

- **Parity target:** ~140 `index.html` paths (legacy `legacy/cyberfolks-html` vs `dist/` after build).
- **`/artykul/`:** production redirect → `/blog/` (legacy). Unlisted sample content may still exist for local preview; CF `_redirects` wins in production.
- **`/abonament/` / `/en/retainer/`:** 301 → `https://abonament.sezmoo.com/` (separate campaign LP repo). Service page `/uslugi-marketingowe/abonamenty/` stays on this site.
- Phone everywhere: **+48 739 260 450** (`src/lib/site.ts`, footers, mobile bar in `assets/js/app.js`).

## DX

- Prettier + `prettier-plugin-astro`
- ESLint flat config + `eslint-plugin-astro`
- `astro check` wired in both CI workflows before build

## Repo layout

```
assets/              # source static assets (CSS, JS, images, video)
public/              # robots, _redirects, _headers, 404; assets copied at build
src/pages/           # Astro routes
src/content/blog/    # article collection (SEO posts)
src/components/      # Footer, ContactForm, …
functions/           # CF Pages Functions (contact API)
scripts/             # sync-public-assets + one-shot migrators
```
