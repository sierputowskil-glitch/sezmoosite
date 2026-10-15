# SEZMOO site (Astro)

Static marketing site built with **Astro 5**, hosted on **Cloudflare Pages** (production) with a **Pages Function** for the contact form. Staging preview uses **GitHub Pages** (static only — no `/api/contact`).

Legacy CyberFolks HTML/PHP snapshot lives on branch [`legacy/cyberfolks-html`](https://github.com/sierputowskil-glitch/sezmoosite/tree/legacy/cyberfolks-html) (tip = pre-Astro `main`).

## Stack

| Layer | Choice |
| --- | --- |
| Pages | Astro (`src/pages`, static output) |
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

## Environment

**Public (build-time, `.env` / CI):**

- `PUBLIC_SITE_URL` — canonical origin (`https://sezmoo.com` or GH Pages origin)
- `PUBLIC_BASE_PATH` — `/` in prod; `/sezmoosite` (repo name) on GH Pages staging
- `PUBLIC_TURNSTILE_SITE_KEY` — Turnstile site key
- `PUBLIC_CONTACT_API_URL` — `/api/contact` on CF; **leave empty on GH Pages staging** (form posts are disabled)

**Secrets (`.dev.vars` / CF dashboard — not in git):**

- `TURNSTILE_SECRET_KEY`, `SMTP_PASS`, and optional SMTP_* / `MAIL_TO` (defaults also in `wrangler.toml` `[vars]`)

## Hosting

### Production — Cloudflare Pages

Workflow: `.github/workflows/cf-pages-prod.yml` (push to `main` / manual).

- Build with `PUBLIC_BASE_PATH=/`, `PUBLIC_CONTACT_API_URL=/api/contact`
- Deploy `dist/` + `functions/` via Wrangler
- Configure secrets and KV binding in the CF dashboard (or `wrangler.toml`)

### Staging — GitHub Pages

Workflow: `.github/workflows/gh-pages-staging.yml`.

- Static site only; **no Pages Functions**
- `PUBLIC_CONTACT_API_URL` is set to empty so the contact form does **not** pretend `/api/contact` works
- Use staging for layout/content checks; test the form with `npm run dev:functions` or production

## Cloudflare KV (contact rate limit)

1. Create namespaces:

   ```bash
   npx wrangler kv namespace create CONTACT_RATE_LIMIT
   npx wrangler kv namespace create CONTACT_RATE_LIMIT --preview
   ```

2. Paste the returned IDs into `wrangler.toml` (`id` / `preview_id`) replacing `REPLACE_WITH_KV_*`.

3. In Cloudflare Pages → project → Settings → Bindings, add KV namespace binding name `CONTACT_RATE_LIMIT` to the same namespace (if not applied from `wrangler.toml`).

Until IDs are real, the Function falls back to an in-isolate `Map` (weaker across isolates).

## DX

- Prettier + `prettier-plugin-astro`
- ESLint flat config + `eslint-plugin-astro`
- `astro check` wired in both CI workflows before build

## Repo layout

```
assets/           # source static assets (CSS, JS, images, video)
public/           # robots, _redirects, _headers, 404; assets copied at build
src/pages/        # Astro routes (migrated HTML)
src/content/blog/ # reserved for future content collections
functions/        # CF Pages Functions (contact API)
```

## Out of scope / next (Fala 2+)

- Full page rewrite from design system
- Blog migration into `src/content` collections
- DNS cutover
