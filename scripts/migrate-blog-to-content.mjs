#!/usr/bin/env node
/**
 * Fala 4: extract article `pageHtml` dumps into src/content/blog/*.md
 * and remove the old src/pages/<slug>/index.astro string dumps.
 *
 * Usage:
 *   node scripts/migrate-blog-to-content.mjs [--dry] [--keep-pages]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const KEEP_PAGES = process.argv.includes('--keep-pages');
const OUT_DIR = path.join(ROOT, 'src', 'content', 'blog');
const FEATURED_SLUG = 'przewodnik-po-firmowej-stronie-www';
/** Sample/demo article kept at /artykul/ but not shown on /blog/. */
const UNLISTED_SLUGS = new Set(['artykul']);

const TOPIC_MAP = {
  STRATEGIA: 'strategy',
  PRODUKCJA: 'production',
  SOCIAL: 'social',
};

function extractQuotedConst(src, name) {
  const marker = `const ${name} = "`;
  const idx = src.indexOf(marker);
  if (idx < 0) return null;
  let i = idx + marker.length;
  let out = '';
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') {
      const n = src[i + 1];
      out +=
        n === 'n'
          ? '\n'
          : n === 't'
            ? '\t'
            : n === 'r'
              ? '\r'
              : n === 'u' && src.slice(i + 2, i + 6).match(/[0-9a-fA-F]{4}/)
                ? String.fromCharCode(parseInt(src.slice(i + 2, i + 6), 16))
                : n;
      i += n === 'u' && src.slice(i + 2, i + 6).match(/[0-9a-fA-F]{4}/) ? 6 : 2;
      continue;
    }
    if (c === '"') break;
    out += c;
    i++;
  }
  return out;
}

function parseLayoutProps(src) {
  const m = src.match(/<BaseLayout\b([\s\S]*?)>/);
  if (!m) return {};
  const props = {};
  for (const line of m[1].split('\n')) {
    const t = line.trim().replace(/,$/, '');
    if (!t || t.startsWith('//')) continue;
    const km = t.match(/^(\w+)=(.+)$/);
    if (!km) continue;
    const key = km[1];
    let raw = km[2].trim();
    if (
      (raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'"))
    ) {
      try {
        props[key] = JSON.parse(raw.replace(/^'/, '"').replace(/'$/, '"'));
      } catch {
        props[key] = raw.slice(1, -1);
      }
    } else if (raw.startsWith('{') && raw.endsWith('}')) {
      props[key] = raw.slice(1, -1).trim();
    } else {
      props[key] = raw;
    }
  }
  return props;
}

function pagePathFromFile(file) {
  const rel = path.relative(path.join(ROOT, 'src', 'pages'), file).replace(/\\/g, '/');
  return '/' + rel.replace(/\/index\.astro$/, '/');
}

function resolveHref(href, pagePath) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href;
  }
  if (/^(https?:|\/\/|data:)/i.test(href)) return href;
  if (href.startsWith('/')) return href;
  try {
    const base = `https://sezmoo.com${pagePath}`;
    const u = new URL(href, base);
    return u.pathname + u.search + u.hash;
  } catch {
    return href;
  }
}

function rewriteLinks(html, pagePath) {
  return html.replace(
    /(\s)(href|action|src|data-src|data-gallery)=["']([^"']+)["']/gi,
    (all, ws, attr, val) => {
      if (attr.toLowerCase() === 'data-gallery') {
        const parts = val.split('|').map((p) => {
          if (p.startsWith('yt:') || /^(https?:|\/\/)/i.test(p) || p.startsWith('/')) return p;
          return resolveHref(p, pagePath);
        });
        return `${ws}${attr}="${parts.join('|')}"`;
      }
      return `${ws}${attr}="${resolveHref(val, pagePath)}"`;
    },
  );
}

function yamlEscape(str) {
  if (str == null) return '""';
  const s = String(str);
  if (/[:#{}[\],&*!|>'"%@`]/.test(s) || /^\s|\s$/.test(s) || s.includes('\n')) {
    return JSON.stringify(s);
  }
  return s;
}

function parseMeta(html) {
  const meta = html.match(/blog-post__meta[^>]*>([^<]+)/);
  if (!meta) return { topic: 'strategy', topicLabel: 'STRATEGIA', readingTime: undefined, date: null };
  const parts = meta[1].split('·').map((s) => s.trim());
  const topicLabel = parts[0] || 'STRATEGIA';
  const topic = TOPIC_MAP[topicLabel] || 'strategy';
  let readingTime;
  const minPart = parts.find((p) => /\d+\s*MIN/i.test(p));
  if (minPart) {
    const n = minPart.match(/(\d+)/);
    if (n) readingTime = parseInt(n[1], 10);
  }
  const datePart = parts.find((p) => /^\d{2}\.\d{2}\.\d{4}$/.test(p));
  let date = null;
  if (datePart) {
    const [dd, mm, yyyy] = datePart.split('.').map(Number);
    date = `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  }
  return { topic, topicLabel, readingTime, date };
}

function parseHero(html) {
  const media = html.match(/<div class="article__media"[\s\S]*?<\/div>\s*<span>([^<]*)<\/span>/);
  const img = html.match(/article__media[\s\S]*?<img\s+([^>]+)>/i);
  let heroImage;
  let heroAlt;
  if (img) {
    const src = img[1].match(/src=["']([^"']+)["']/i);
    const alt = img[1].match(/alt=["']([^"']*)["']/i);
    if (src) heroImage = src[1];
    if (alt) heroAlt = alt[1];
  }
  const heroCaption = media ? media[1].trim() : undefined;
  return { heroImage, heroAlt, heroCaption };
}

function buildMarkdown({ slug, props, meta, hero, html, featured, listed }) {
  const title = props.title?.replace(/\s*\|\s*SEZMOO\s*$/i, '').trim() || slug;
  const description = props.description || '';
  const lines = [
    '---',
    `title: ${yamlEscape(title)}`,
    `description: ${yamlEscape(description)}`,
    `date: ${meta.date || '2025-01-01'}`,
    `topic: ${meta.topic}`,
    `topicLabel: ${yamlEscape(meta.topicLabel)}`,
    `lang: ${props.lang === 'en' ? 'en' : 'pl'}`,
    `draft: false`,
    `listed: ${listed === false ? 'false' : 'true'}`,
    `featured: ${featured ? 'true' : 'false'}`,
  ];
  if (meta.readingTime) lines.push(`readingTime: ${meta.readingTime}`);
  if (hero.heroImage) lines.push(`heroImage: ${yamlEscape(hero.heroImage)}`);
  if (hero.heroAlt) lines.push(`heroAlt: ${yamlEscape(hero.heroAlt)}`);
  if (hero.heroCaption) lines.push(`heroCaption: ${yamlEscape(hero.heroCaption)}`);
  if (props.ogTitle) lines.push(`ogTitle: ${yamlEscape(props.ogTitle)}`);
  if (props.ogDescription) lines.push(`ogDescription: ${yamlEscape(props.ogDescription)}`);
  lines.push('---', '', html.trim(), '');
  return lines.join('\n');
}

function isArticlePage(file, html) {
  if (file.includes(`${path.sep}blog${path.sep}`)) return false;
  if (file.includes(`${path.sep}en${path.sep}blog`)) return false;
  return html.includes('article shell') || html.includes('article__');
}

function main() {
  const files = execSync('rg -l "const pageHtml" src/pages --glob "*.astro"', {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((f) => path.join(ROOT, f));

  if (!DRY) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    // remove placeholder
    const keep = path.join(OUT_DIR, '.gitkeep');
    if (fs.existsSync(keep)) fs.unlinkSync(keep);
  }

  let written = 0;
  let removed = 0;
  const skipped = [];

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const htmlRaw = extractQuotedConst(src, 'pageHtml');
    if (!htmlRaw) {
      skipped.push({ file, reason: 'no pageHtml' });
      continue;
    }
    if (!isArticlePage(file, htmlRaw)) {
      skipped.push({ file, reason: 'not article' });
      continue;
    }

    const pagePath = pagePathFromFile(file);
    const slug = pagePath.replace(/^\/|\/$/g, '');
    const props = parseLayoutProps(src);
    const html = rewriteLinks(htmlRaw, pagePath);
    const meta = parseMeta(html);
    const hero = parseHero(html);
    // Prefer absolute paths for hero after rewrite
    if (hero.heroImage && hero.heroImage.startsWith('../')) {
      hero.heroImage = resolveHref(hero.heroImage, pagePath);
    }
    const md = buildMarkdown({
      slug,
      props,
      meta,
      hero,
      html,
      featured: slug === FEATURED_SLUG,
      listed: !UNLISTED_SLUGS.has(slug),
    });

    const outFile = path.join(OUT_DIR, `${slug}.md`);
    if (DRY) {
      console.log(`[dry] write ${path.relative(ROOT, outFile)} (${md.length} bytes)`);
    } else {
      fs.writeFileSync(outFile, md, 'utf8');
    }
    written++;

    if (!KEEP_PAGES) {
      if (DRY) {
        console.log(`[dry] remove ${path.relative(ROOT, file)}`);
      } else {
        fs.unlinkSync(file);
        // remove empty slug dir
        const dir = path.dirname(file);
        try {
          if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
        } catch {
          /* ignore */
        }
      }
      removed++;
    }
  }

  console.log(
    JSON.stringify(
      {
        dry: DRY,
        written,
        removed,
        skipped: skipped.map((s) => ({
          file: path.relative(ROOT, s.file),
          reason: s.reason,
        })),
      },
      null,
      2,
    ),
  );
}

main();
