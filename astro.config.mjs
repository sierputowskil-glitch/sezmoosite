// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Env-aware site + base for prod (CF Pages) vs staging (GitHub Pages).
 *
 * PUBLIC_SITE_URL — canonical origin, e.g. https://sezmoo.com
 * PUBLIC_BASE_PATH — URL prefix without trailing slash; "/" or "" for prod root,
 *                    "/sezmoosite" for GH Pages project site.
 */
const site = (process.env.PUBLIC_SITE_URL || 'https://sezmoo.com').replace(/\/$/, '');
const rawBase = process.env.PUBLIC_BASE_PATH ?? '/';
const base = rawBase === '/' || rawBase === '' ? '/' : `/${rawBase.replace(/^\/|\/$/g, '')}/`;

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  output: 'static',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
