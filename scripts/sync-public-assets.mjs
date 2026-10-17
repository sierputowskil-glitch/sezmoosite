#!/usr/bin/env node
/**
 * Copy media (+ a few public-URL JS vendors) from `assets/` → `public/assets/`.
 * Symlinks break on some Cloudflare / GitHub Pages deploys; this survives both.
 *
 * Synced: images, fonts, video posters / non-MP4 under video/, favicons, OG,
 * plus the short hero showreel MP4s (same-origin autoplay; CDN hotlink/ORB
 * breaks localhost and some browsers). Case-study YT MP4s stay CDN-only.
 * Skipped: CSS & Vite-bundled JS (imported via Astro), other MP4, optimized/lcp,
 * legacy partials.
 *
 * Public-URL vendors that stay synced: flowing-background.js, lenis.min.js.
 */
import { cpSync, existsSync, lstatSync, rmSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

const src = resolve('assets');
const dest = resolve('public/assets');
const rootIco = resolve('public/favicon.ico');
const srcIco = resolve('assets/favicon.ico');

const MEDIA_EXT =
  /\.(avif|webp|jpe?g|png|gif|svg|ico|woff2?|ttf|otf|eot|mp3|wav|webm)$/i;

/** Lazy public-URL scripts (not Vite-bundled). */
const PUBLIC_JS = new Set(['js/flowing-background.js', 'js/lenis.min.js']);

/** Homepage MP4s shipped on Pages (same-origin; CDN Imunify ORB breaks autoplay). */
const PUBLIC_SHOWREEL_MP4 = new Set([
  'video/showreel-16s.mp4',
  'video/showreel-720-16s.mp4',
  'video/yt/b_MB9qpw6jE__zespol.mp4',
]);

/** Top-level dirs / files never copied. */
const SKIP_PREFIXES = ['css/', 'optimized/', 'partials/'];

function skipForCdn(rel) {
  if (PUBLIC_SHOWREEL_MP4.has(rel)) return false;
  return /^video\/.+\.mp4$/i.test(rel);
}

/**
 * @param {string} rel posix path relative to assets/
 * @param {boolean} isDir
 */
function shouldCopy(rel, isDir) {
  if (!rel) return true;
  if (skipForCdn(rel)) return false;
  for (const p of SKIP_PREFIXES) {
    if (rel === p.slice(0, -1) || rel.startsWith(p)) return false;
  }
  // JS: only vendor public URLs (+ allow traversing js/)
  if (rel === 'js' || rel.startsWith('js/')) {
    if (isDir) return true;
    return PUBLIC_JS.has(rel);
  }
  // Video: posters / json / images + whitelisted hero showreel MP4s
  if (rel === 'video' || rel.startsWith('video/')) {
    if (isDir) return true;
    if (PUBLIC_SHOWREEL_MP4.has(rel)) return true;
    return MEDIA_EXT.test(rel) || /\.json$/i.test(rel);
  }
  // Everything else: media files + dirs that may contain them
  if (isDir) return true;
  return MEDIA_EXT.test(rel);
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
    let isDir = false;
    try {
      isDir = lstatSync(from).isDirectory();
    } catch {
      isDir = false;
    }
    return shouldCopy(rel, isDir);
  },
});

// Google / legacy crawlers request /favicon.ico at site root
if (existsSync(srcIco)) {
  cpSync(srcIco, rootIco);
}

console.log(
  'sync-public-assets: media + public JS + hero showreel MP4 → public/assets/ (skip css/bundled js/other MP4/optimized)',
);
