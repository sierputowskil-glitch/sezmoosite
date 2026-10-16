#!/usr/bin/env node
/**
 * ONE-SHOT MIGRATOR — finish blog Astro-first debt.
 *
 * 1. Move TOC aside + CTA into frontmatter (rendered by BlogArticle).
 * 2. Drop lead-duplicate first <p> inside #wstep.
 * 3. Convert section HTML → Markdown (keep tables/figures as raw HTML).
 *
 * Usage:
 *   node scripts/migrate-blog-body.mjs [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'content', 'blog');
const DRY = process.argv.includes('--dry');

const DEFAULT_CTA_TITLE = 'Chcesz podobny efekt dla\u00a0marki?';
const DEFAULT_CTA_HREF = '/#kontakt';
const DEFAULT_CTA_LABEL = 'Porozmawiajmy';

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

function stripTags(html) {
  return decodeBasicEntities(
    html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/p>/gi, ' ')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeText(s) {
  return decodeBasicEntities(s)
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return null;
  const end = raw.indexOf('\n---', 3);
  if (end < 0) return null;
  return {
    fm: raw.slice(4, end + 1),
    body: raw.slice(end + 4).replace(/^\s*\n/, ''),
    end,
  };
}

function getFmString(fm, key) {
  const m = fm.match(new RegExp(`^${key}\\s*:\\s*("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*')`, 'm'));
  if (!m) return null;
  try {
    return JSON.parse(m[1].replace(/^'/, '"').replace(/'$/, '"'));
  } catch {
    // YAML single-quoted / loose — strip quotes manually
    return m[1].slice(1, -1).replace(/\\n/g, '\n');
  }
}

function upsertFm(fm, key, valueYaml) {
  const re = new RegExp(`^${key}\\s*:.*(?:\\n(?:[ \\t].*|\\n))*`, 'm');
  if (re.test(fm)) return fm.replace(re, valueYaml.trimEnd());
  return `${fm.replace(/\s*$/, '')}\n${valueYaml.trimEnd()}\n`;
}

function removeFmKey(fm, key) {
  return fm.replace(new RegExp(`^${key}\\s*:.*(?:\\n(?:[ \\t].*|\\n))*\\n?`, 'm'), '');
}

function yamlQuote(s) {
  return JSON.stringify(s);
}

function extractAsideToc(html) {
  const m = html.match(/<aside\s+class="article__aside[^"]*"[^>]*>([\s\S]*?)<\/aside>/i);
  if (!m) return { toc: [], tocLabel: null, html };
  const inner = m[1];
  const labelM = inner.match(/<span>([\s\S]*?)<\/span>/i);
  const tocLabel = labelM ? decodeBasicEntities(labelM[1].trim()) : null;
  const toc = [];
  const linkRe = /<a\s+href="#([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let lm;
  while ((lm = linkRe.exec(inner))) {
    toc.push({ id: lm[1], label: stripTags(lm[2]) });
  }
  return { toc, tocLabel, html: html.replace(m[0], '') };
}

function extractCta(html) {
  const m = html.match(
    /<div\s+class="article__cta[^"]*"[^>]*>\s*<h2>([\s\S]*?)<\/h2>\s*<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/div>/i,
  );
  if (!m) return { cta: null, html };
  const title = decodeBasicEntities(m[1].trim());
  const href = m[2].trim();
  const label = stripTags(m[3]);
  return {
    cta: { title, href, label },
    html: html.replace(m[0], ''),
  };
}

function extractMatchingDivInner(html, className) {
  const openRe = new RegExp(`<div\\s+class="${className}"[^>]*>`, 'i');
  const open = openRe.exec(html);
  if (!open) return null;
  const start = open.index + open[0].length;
  const tagRe = /<\/?div\b[^>]*>/gi;
  tagRe.lastIndex = start;
  let depth = 1;
  let match;
  while ((match = tagRe.exec(html))) {
    if (/^<\//.test(match[0])) depth -= 1;
    else depth += 1;
    if (depth === 0) return html.slice(start, match.index).trim();
  }
  return html.slice(start).trim();
}

function extractContentInner(html) {
  return (
    extractMatchingDivInner(html, 'article__content') ||
    extractMatchingDivInner(html, 'article__layout') ||
    html.trim()
  );
}

function dropLeadDupInWstep(html, lead) {
  if (!lead) return html;
  const leadNorm = normalizeText(lead);
  return html.replace(
    /(<section\s+id="wstep"[^>]*>)\s*<p>([\s\S]*?)<\/p>/i,
    (full, open, pInner) => {
      const pNorm = normalizeText(stripTags(pInner));
      if (pNorm.slice(0, 100) === leadNorm.slice(0, 100)) {
        return open;
      }
      return full;
    },
  );
}

/** Minimal HTML → Markdown for our blog subset. */
function htmlFragmentToMd(html) {
  let s = html.trim();
  if (!s) return '';

  // Preserve tables / figures as raw HTML blocks
  const preserved = [];
  s = s.replace(/<(figure|table)\b[\s\S]*?<\/\1>/gi, (block) => {
    const i = preserved.length;
    preserved.push(block.trim());
    return `\n\n%%PRESERVE_${i}%%\n\n`;
  });

  // Headings
  s = s.replace(/<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => {
    const text = stripTags(inner);
    return `\n\n${'#'.repeat(Number(level))} ${text}\n\n`;
  });

  // Blockquotes
  s = s.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    const text = stripTags(inner);
    return `\n\n> ${text}\n\n`;
  });

  // Lists
  s = s.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => {
      const item = inlineToMd(m[1].trim());
      return `- ${item}`;
    });
    return `\n\n${items.join('\n')}\n\n`;
  });
  s = s.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let n = 0;
    const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => {
      n += 1;
      return `${n}. ${inlineToMd(m[1].trim())}`;
    });
    return `\n\n${items.join('\n')}\n\n`;
  });

  // Paragraphs
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => `\n\n${inlineToMd(inner)}\n\n`);

  // Line breaks left over
  s = s.replace(/<br\s*\/?>/gi, '  \n');

  // Strip leftover tags (keep text)
  s = s.replace(/<\/?(div|span|section|header|footer|article|main)[^>]*>/gi, '');
  s = s.replace(/<\/?[a-z][^>]*>/gi, (tag) => {
    // keep preserve markers intact
    if (tag.includes('%%PRESERVE_')) return tag;
    return '';
  });

  s = decodeBasicEntities(s);

  // Collapse whitespace
  s = s.replace(/[ \t]+\n/g, '\n');
  s = s.replace(/\n{3,}/g, '\n\n').trim();

  // Restore preserved HTML
  s = s.replace(/%%PRESERVE_(\d+)%%/g, (_, i) => preserved[Number(i)]);

  return s;
}

function inlineToMd(html) {
  let s = html;
  s = s.replace(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    return `[${stripTags(text)}](${href})`;
  });
  s = s.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**');
  s = s.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*');
  s = s.replace(/<br\s*\/?>/gi, '  \n');
  s = s.replace(/<[^>]+>/g, '');
  return decodeBasicEntities(s).replace(/\s+/g, ' ').trim();
}

function slugifyHeadingId(existingId, headingText) {
  if (existingId) return existingId;
  return headingText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function sectionsToMarkdown(html) {
  const sections = [];
  const sectionRe = /<section\b([^>]*)>([\s\S]*?)<\/section>/gi;
  let m;
  let lastIndex = 0;
  let matched = false;
  while ((m = sectionRe.exec(html))) {
    matched = true;
    // content before first section (shouldn't happen often)
    if (m.index > lastIndex) {
      const before = html.slice(lastIndex, m.index).trim();
      if (before) sections.push({ id: null, html: before });
    }
    const attrs = m[1];
    const idM = attrs.match(/\bid=["']([^"']+)["']/i);
    sections.push({ id: idM ? idM[1] : null, html: m[2] });
    lastIndex = m.index + m[0].length;
  }
  if (!matched) {
    // No sections — convert whole fragment
    return htmlFragmentToMd(html);
  }
  const after = html.slice(lastIndex).trim();
  if (after) sections.push({ id: null, html: after });

  const parts = [];
  for (const sec of sections) {
    const h2 = sec.html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const restHtml = h2 ? sec.html.replace(h2[0], '') : sec.html;

    if (h2) {
      const title = stripTags(h2[1]);
      const id = slugifyHeadingId(sec.id, title);
      // HTML heading with explicit id — Astro does not parse `{#id}` without a plugin.
      parts.push(`<h2 id="${id}" class="reveal">${title}</h2>`);
      const body = htmlFragmentToMd(restHtml);
      if (body) parts.push(body);
    } else if (sec.id) {
      // Intro / wstep without heading — anchor + markdown body
      parts.push(`<div id="${sec.id}" class="reveal"></div>`);
      const body = htmlFragmentToMd(restHtml);
      if (body) parts.push(body);
    } else {
      const body = htmlFragmentToMd(restHtml);
      if (body) parts.push(body);
    }
  }
  return parts.join('\n\n').trim() + '\n';
}

function shouldKeepAsHtml(html) {
  // Complex WP leftovers — keep section HTML rather than lossy convert
  return /wp-block|class="has-fixed-layout"|<table[\s\S]*<table/i.test(html);
}

function migrateFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(raw);
  if (!parsed) return { status: 'skip', reason: 'no-frontmatter' };

  let { fm, body } = parsed;

  // Already converted to markdown (no article__layout)
  if (!/article__layout|article__aside|article__cta/.test(body)) {
    if (/^##\s+/m.test(body) || /\{#[a-z0-9-]+\}/.test(body)) {
      return { status: 'skip', reason: 'already-md' };
    }
  }

  if (!/article__layout|article__aside/.test(body)) {
    return { status: 'skip', reason: 'no-layout-chrome' };
  }

  const lead = getFmString(fm, 'lead');

  let work = body;
  const { toc, tocLabel, html: afterToc } = extractAsideToc(work);
  work = afterToc;
  const { cta, html: afterCta } = extractCta(work);
  work = afterCta;
  work = extractContentInner(work);
  // In case extractContentInner left wrappers
  work = work
    .replace(/<\/?div\s+class="article__(?:layout|content)"[^>]*>/gi, '')
    .trim();

  work = dropLeadDupInWstep(work, lead);

  let newBody;
  if (shouldKeepAsHtml(work)) {
    // Keep cleaned HTML sections (no aside/cta/layout)
    newBody = work.trim() + '\n';
  } else {
    newBody = sectionsToMarkdown(work);
  }

  // Frontmatter: toc
  if (toc.length) {
    const tocYaml =
      'toc:\n' + toc.map((t) => `  - id: ${yamlQuote(t.id)}\n    label: ${yamlQuote(t.label)}`).join('\n');
    fm = upsertFm(fm, 'toc', tocYaml);
  }
  if (tocLabel && tocLabel !== 'W artykule') {
    fm = upsertFm(fm, 'tocLabel', `tocLabel: ${yamlQuote(tocLabel)}`);
  }

  // CTA overrides only when non-default
  if (cta) {
    const titleNorm = cta.title.replace(/&nbsp;/g, '\u00a0');
    const isDefault =
      normalizeText(titleNorm) === normalizeText(DEFAULT_CTA_TITLE) &&
      cta.href === DEFAULT_CTA_HREF &&
      normalizeText(cta.label) === normalizeText(DEFAULT_CTA_LABEL);
    if (!isDefault) {
      fm = upsertFm(fm, 'ctaTitle', `ctaTitle: ${yamlQuote(titleNorm)}`);
      if (cta.href !== DEFAULT_CTA_HREF) {
        fm = upsertFm(fm, 'ctaHref', `ctaHref: ${yamlQuote(cta.href)}`);
      }
      if (normalizeText(cta.label) !== normalizeText(DEFAULT_CTA_LABEL)) {
        fm = upsertFm(fm, 'ctaLabel', `ctaLabel: ${yamlQuote(cta.label)}`);
      }
    } else {
      fm = removeFmKey(fm, 'ctaTitle');
      fm = removeFmKey(fm, 'ctaHref');
      fm = removeFmKey(fm, 'ctaLabel');
    }
  }

  const out = `---\n${fm.replace(/^\n+/, '').replace(/\n+$/, '')}\n---\n\n${newBody}`;
  if (!DRY) fs.writeFileSync(filePath, out);
  return {
    status: 'ok',
    mode: shouldKeepAsHtml(work) ? 'html-sections' : 'markdown',
    toc: toc.length,
  };
}

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md')).sort();
const summary = { ok: 0, skip: 0, md: 0, html: 0, errors: [] };

for (const file of files) {
  const fp = path.join(DIR, file);
  try {
    const r = migrateFile(fp);
    if (r.status === 'ok') {
      summary.ok += 1;
      if (r.mode === 'markdown') summary.md += 1;
      else summary.html += 1;
      console.log(`✓ ${file} (${r.mode}, toc=${r.toc})`);
    } else {
      summary.skip += 1;
      console.log(`· ${file} skip:${r.reason}`);
    }
  } catch (e) {
    summary.errors.push({ file, error: String(e) });
    console.error(`✗ ${file}`, e);
  }
}

console.log(
  `\nDone${DRY ? ' (dry)' : ''}: ok=${summary.ok} (md=${summary.md}, html=${summary.html}) skip=${summary.skip} errors=${summary.errors.length}`,
);
if (summary.errors.length) process.exit(1);
