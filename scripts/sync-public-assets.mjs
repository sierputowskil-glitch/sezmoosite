#!/usr/bin/env node
/**
 * Copy root `assets/` → `public/assets/` as real files.
 * Symlinks break on some Cloudflare / GitHub Pages deploys; this survives both.
 *
 * All MP4 under assets/video/ live on cdn.sezmoo.com — skip copying into Pages
 * (keeps deploy under the 25 MiB asset limit). Posters still ship with Pages.
 */
import { cpSync, existsSync, lstatSync, rmSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

const src = resolve('assets');
const dest = resolve('public/assets');
const rootIco = resolve('public/favicon.ico');
const srcIco = resolve('assets/favicon.ico');

/** Skip every MP4 under assets/video/ (CDN). */
function skipForCdn(rel) {
  return /^video\/.+\.mp4$/i.test(rel);
}

if (!existsSync(src)) {
  console.error('sync-public-assets: missing ./assets');
  process.exit(1);
}

if (existsSync(dest)) {
  const st = lstatSync(dest);
  if (st.isSymbolicLink()) {
    unlinkSync(dest);
  } else {
    rmSync(dest, { recursive: true, force: true });
  }
}

cpSync(src, dest, {
  recursive: true,
  dereference: true,
  filter: (from) => {
    const rel = from.slice(src.length).replace(/^[/\\]/, '').replace(/\\/g, '/');
    if (!rel) return true;
    return !skipForCdn(rel);
  },
});
// Google / legacy crawlers request /favicon.ico at site root
if (existsSync(srcIco)) {
  cpSync(srcIco, rootIco);
}

console.log('sync-public-assets: copied assets/ → public/assets/ (MP4 → CDN)');
