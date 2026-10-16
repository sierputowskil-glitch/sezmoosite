#!/usr/bin/env node
/**
 * @astrojs/sitemap always emits sitemap-index.xml + sitemap-0.xml.
 * For a ~100–200 URL site that's needless — collapse to a single sitemap.xml
 * when there is only one chunk. Multi-chunk builds keep the index.
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
  console.warn('flatten-sitemap: dist/ missing — skip');
  process.exit(0);
}

const chunks = fs
  .readdirSync(dist)
  .filter((f) => /^sitemap-\d+\.xml$/.test(f))
  .sort();

if (chunks.length === 0) {
  console.warn('flatten-sitemap: no sitemap-*.xml — skip');
  process.exit(0);
}

if (chunks.length > 1) {
  console.log(`flatten-sitemap: ${chunks.length} chunks — keep sitemap-index.xml`);
  process.exit(0);
}

const zero = path.join(dist, chunks[0]);
const out = path.join(dist, 'sitemap.xml');
const index = path.join(dist, 'sitemap-index.xml');

fs.copyFileSync(zero, out);
fs.unlinkSync(zero);
if (fs.existsSync(index)) fs.unlinkSync(index);

console.log('flatten-sitemap: wrote dist/sitemap.xml (single file)');
