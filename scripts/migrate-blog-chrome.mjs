#!/usr/bin/env node
/**
 * ONE-SHOT MIGRATOR — strip duplicated article chrome from blog MD bodies.
 *
 * Moves header (back/meta/h1/lead) + hero media into frontmatter-driven
 * BlogArticle.astro; keeps `.article__layout` (aside TOC + content + CTA)
 * as the Markdown/HTML body for `render()` + `<Content />`.
 *
 * Usage:
 *   node scripts/migrate-blog-chrome.mjs [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'content', 'blog');
const DRY = process.argv.includes('--dry');

function decodeBasicEntities(s) {
  return s
    .replace(/&nbsp;/gi, '\u00a0')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function extractMatchingDiv(html, className) {
  const openRe = new RegExp(`<div\\s+class="${className}"[^>]*>`, 'i');
  const m = openRe.exec(html);
  if (!m) return null;
  const start = m.index;
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tagRe.exec(html))) {
    if (/^<\//.test(match[0])) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      return html.slice(start, match.index + match[0].length);
    }
  }
  return null;
}

function upsertFrontmatter(fm, key, value) {
  const line = `${key}: ${JSON.stringify(value)}`;
  const re = new RegExp(`^${key}\\s*:.*$`, 'm');
  if (re.test(fm)) return fm.replace(re, line);
  return `${fm.replace(/\s*$/, '')}\n${line}\n`;
}

function migrateFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  if (!raw.startsWith('---')) {
    return { status: 'skip', reason: 'no-frontmatter' };
  }
  const end = raw.indexOf('\n---', 3);
  if (end < 0) return { status: 'skip', reason: 'bad-frontmatter' };
  let fm = raw.slice(4, end + 1);
  const body = raw.slice(end + 4).replace(/^\s*\n/, '');

  // Already migrated: body starts with article__layout (no outer <article>)
  if (/^\s*<div\s+class="article__layout"/.test(body) && !/<article\b/.test(body)) {
    return { status: 'skip', reason: 'already-migrated' };
  }
  if (!/<article\b/.test(body)) {
    return { status: 'skip', reason: 'no-article' };
  }

  const leadMatch = body.match(/<p\s+class="article__lead[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const lead = leadMatch ? decodeBasicEntities(leadMatch[1].trim()) : null;

  const captionMatch = body.match(
    /<div\s+class="article__media[^"]*"[^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>/i,
  );
  const heroCaption = captionMatch
    ? decodeBasicEntities(captionMatch[1].trim())
    : null;

  const layout = extractMatchingDiv(body, 'article__layout');
  if (!layout) {
    return { status: 'error', reason: 'no-article__layout' };
  }

  if (lead) fm = upsertFrontmatter(fm, 'lead', lead);
  if (heroCaption) fm = upsertFrontmatter(fm, 'heroCaption', heroCaption);

  const next = `---\n${fm.replace(/^\n+/, '').replace(/\n+$/, '\n')}---\n\n${layout.trim()}\n`;
  if (!DRY) fs.writeFileSync(filePath, next, 'utf8');
  return { status: 'ok', lead: Boolean(lead), caption: heroCaption };
}

const files = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
  .map((f) => path.join(DIR, f))
  .sort();

let ok = 0;
let skipped = 0;
let errors = 0;
const captions = new Map();

for (const file of files) {
  const name = path.basename(file);
  try {
    const result = migrateFile(file);
    if (result.status === 'ok') {
      ok += 1;
      if (result.caption) {
        captions.set(result.caption, (captions.get(result.caption) || 0) + 1);
      }
      console.log(`OK  ${name}`);
    } else if (result.status === 'skip') {
      skipped += 1;
      console.log(`SKIP ${name} (${result.reason})`);
    } else {
      errors += 1;
      console.error(`ERR ${name} (${result.reason})`);
    }
  } catch (err) {
    errors += 1;
    console.error(`ERR ${name}`, err);
  }
}

console.log(
  `\n${DRY ? '[dry] ' : ''}done: ok=${ok} skipped=${skipped} errors=${errors} / ${files.length}`,
);
console.log('captions:', Object.fromEntries(captions));
if (errors) process.exit(1);
