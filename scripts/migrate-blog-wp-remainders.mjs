#!/usr/bin/env node
/**
 * ONE-SHOT — convert remaining WP/HTML blog bodies to Markdown.
 * Tables → GFM tables; figures/galleries → Markdown images; headings → ##/###.
 *
 * Usage: node scripts/migrate-blog-wp-remainders.mjs [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'src', 'content', 'blog');
const DRY = process.argv.includes('--dry');

const FILES = [
  'uslugi-na-abonament.md',
  'aktualne-wymiary-grafik-social-media-2025.md',
  'jak-przygotowac-pliki-do-druku-checklista-dla-klientow-agencji-reklamowej.md',
  'dlaczego-twoja-firma-potrzebuje-spojnego-brandingu.md',
  '10-lat-world-of-warships-gaming-room-i-event-na-10-lecie.md',
];

function decode(s) {
  return s
    .replace(/&nbsp;/gi, '\u00a0')
    .replace(/&#215;/g, '×')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripTags(html) {
  return decode(
    html
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function inlineMd(html) {
  let s = html;
  s = s.replace(/<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, t) => {
    const clean = href.replace(/\?utm_source=chatgpt\.com/gi, '');
    return `[${stripTags(t)}](${clean})`;
  });
  s = s.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, '**$2**');
  s = s.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, '*$2*');
  s = s.replace(/<br\s*\/?>/gi, '  \n');
  s = s.replace(/<[^>]+>/g, '');
  return decode(s).replace(/[ \t]+\n/g, '\n').replace(/[ \t]{2,}/g, ' ').trim();
}

function tableToMd(tableHtml) {
  const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map((rm) =>
    [...rm[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((c) =>
      stripTags(c[1]).replace(/\|/g, '\\|'),
    ),
  );
  if (!rows.length) return '';
  const width = Math.max(...rows.map((r) => r.length));
  const norm = rows.map((r) => {
    while (r.length < width) r.push('');
    return r;
  });
  const header = norm[0];
  const sep = header.map(() => '---');
  const body = norm.slice(1);
  const lines = [
    `| ${header.join(' | ')} |`,
    `| ${sep.join(' | ')} |`,
    ...body.map((r) => `| ${r.join(' | ')} |`),
  ];
  return `\n\n${lines.join('\n')}\n\n`;
}

function figureToMd(figHtml) {
  // gallery: multiple nested figures
  if (/wp-block-gallery/.test(figHtml)) {
    const imgs = [...figHtml.matchAll(/<img[^>]+>/gi)];
    const parts = imgs.map((im) => {
      const tag = im[0];
      const src = (tag.match(/\ssrc="([^"]+)"/i) || [])[1];
      const alt = (tag.match(/\salt="([^"]*)"/i) || [])[1] || '';
      if (!src) return '';
      const cap = figHtml.includes(src)
        ? (() => {
            const around = figHtml.slice(Math.max(0, figHtml.indexOf(src) - 200), figHtml.indexOf(src) + 400);
            const m = around.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
            return m ? stripTags(m[1]) : '';
          })()
        : '';
      return cap ? `![${alt || cap}](${src})\n*${cap}*` : `![${alt}](${src})`;
    });
    return `\n\n${parts.filter(Boolean).join('\n\n')}\n\n`;
  }

  const img = figHtml.match(/<img[^>]+>/i);
  if (!img) {
    // maybe only a table inside figure
    const table = figHtml.match(/<table[\s\S]*?<\/table>/i);
    if (table) return tableToMd(table[0]);
    return '';
  }
  const tag = img[0];
  const src = (tag.match(/\ssrc="([^"]+)"/i) || [])[1];
  const alt = (tag.match(/\salt="([^"]*)"/i) || [])[1] || '';
  if (!src) return '';
  const capM = figHtml.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
  const cap = capM ? stripTags(capM[1]) : '';
  return cap ? `\n\n![${alt || cap}](${src})\n\n*${cap}*\n\n` : `\n\n![${alt}](${src})\n\n`;
}

function htmlToMd(html, { dropLeadMatch } = {}) {
  let s = html.trim();

  // Drop outer section wrapper
  s = s.replace(/^<section\b[^>]*>/i, '').replace(/<\/section>\s*$/i, '');

  // Preserve / convert tables & figures first
  const blocks = [];
  s = s.replace(/<figure\b[\s\S]*?<\/figure>/gi, (block) => {
    const i = blocks.length;
    blocks.push(figureToMd(block));
    return `\n\n%%B${i}%%\n\n`;
  });
  s = s.replace(/<table\b[\s\S]*?<\/table>/gi, (block) => {
    const i = blocks.length;
    blocks.push(tableToMd(block));
    return `\n\n%%B${i}%%\n\n`;
  });

  // File download buttons (zip)
  s = s.replace(
    /<a\b[^>]*href="([^"]+\.zip)"[^>]*>[\s\S]*?<\/a>(?:\s*<a\b[^>]*download[^>]*>[\s\S]*?<\/a>)?/gi,
    (_, href) => `\n\n[Pobierz szablony](${href})\n\n`,
  );

  // Headings — collect for TOC; emit HTML h2/h3 with id for anchors
  const toc = [];
  s = s.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => {
    const title = stripTags(inner);
    if (!title) return '';
    const id = slugify(title);
    const lvl = Number(level);
    // Promote WP h4/h5/h6 under article content to ## / ###
    if (lvl <= 2) {
      toc.push({ id, label: title });
      return `\n\n<h2 id="${id}" class="reveal">${title}</h2>\n\n`;
    }
    if (lvl === 3) {
      toc.push({ id, label: title });
      return `\n\n<h3 id="${id}">${title}</h3>\n\n`;
    }
    // h4+ → ### without necessarily all in TOC (too noisy); still add major ones
    if (lvl === 4) {
      toc.push({ id, label: title });
      return `\n\n<h3 id="${id}">${title}</h3>\n\n`;
    }
    return `\n\n#### ${title}\n\n`;
  });

  // Lists
  s = s.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(
      (m) => `- ${inlineMd(m[1])}`,
    );
    return `\n\n${items.join('\n')}\n\n`;
  });
  s = s.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let n = 0;
    const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => {
      n += 1;
      return `${n}. ${inlineMd(m[1])}`;
    });
    return `\n\n${items.join('\n')}\n\n`;
  });

  // Paragraphs — split on <br><br> into separate paras
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => {
    const chunks = inner.split(/<br\s*\/?>\s*<br\s*\/?>/i);
    return (
      '\n\n' +
      chunks
        .map((c) => inlineMd(c))
        .filter(Boolean)
        .join('\n\n') +
      '\n\n'
    );
  });

  s = s.replace(/<br\s*\/?>/gi, '  \n');
  s = s.replace(/<\/?(div|span|section|header|footer|article|main|a)[^>]*>/gi, '');
  s = s.replace(/<[^>]+>/g, (tag) => (tag.startsWith('<h') || tag.startsWith('</h') ? tag : ''));

  // Restore blocks
  s = s.replace(/%%B(\d+)%%/g, (_, i) => blocks[Number(i)]);

  s = decode(s).replace(/\n{3,}/g, '\n\n').trim() + '\n';

  // Drop lead-duplicate first paragraph
  if (dropLeadMatch) {
    const leadN = stripTags(dropLeadMatch).slice(0, 100);
    const paras = s.split(/\n\n+/);
    // skip leading HTML headings/empty
    let i = 0;
    while (i < paras.length && (/^</.test(paras[i].trim()) || !paras[i].trim())) i += 1;
    if (i < paras.length) {
      const first = stripTags(paras[i]).slice(0, 100);
      if (first && leadN && first === leadN) {
        paras.splice(i, 1);
        s = paras.join('\n\n').trim() + '\n';
      }
    }
  }

  return { md: s, toc };
}

function upsertToc(fm, toc) {
  const tocYaml =
    'toc:\n' +
    toc.map((t) => `  - id: ${JSON.stringify(t.id)}\n    label: ${JSON.stringify(t.label)}`).join('\n');
  if (/^toc:/m.test(fm)) {
    return fm.replace(/^toc:\n(?:[ \t].*\n?)*/m, tocYaml + '\n');
  }
  return fm.replace(/\s*$/, '') + '\n' + tocYaml + '\n';
}

function fixLead(fm, bodyText) {
  // Truncated leads ending with […] — rebuild from first real paragraph if needed
  const m = fm.match(/^lead:\s*("(?:\\.|[^"\\])*")/m);
  if (!m) return fm;
  let lead;
  try {
    lead = JSON.parse(m[1]);
  } catch {
    return fm;
  }
  if (!/\[\u2026\]|\.\.\.$|\[…\]/.test(lead) && lead.length > 40) return fm;
  // take first markdown paragraph as lead
  const paras = bodyText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('<') && !p.startsWith('#') && !p.startsWith('!') && !p.startsWith('|') && !p.startsWith('-') && !p.startsWith('['));
  if (!paras[0]) return fm;
  const newLead = paras[0].replace(/\*\*/g, '').slice(0, 320);
  return fm.replace(/^lead:\s*("(?:\\.|[^"\\])*")/m, `lead: ${JSON.stringify(newLead)}`);
}

for (const file of FILES) {
  const fp = path.join(DIR, file);
  if (!fs.existsSync(fp)) {
    console.error('missing', file);
    continue;
  }
  const raw = fs.readFileSync(fp, 'utf8');
  // Only split on line-exact `---` so GFM table separators (`| --- |`) never match.
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) {
    console.error('bad frontmatter', file);
    continue;
  }
  let fm = fmMatch[1] + '\n';
  let body = fmMatch[2].replace(/^\s*\n/, '');

  if (!/<section|<figure|wp-block/.test(body)) {
    console.log('·', file, 'already clean');
    continue;
  }

  const leadM = fm.match(/^lead:\s*("(?:\\.|[^"\\])*")/m);
  const lead = leadM ? JSON.parse(leadM[1]) : null;

  const { md, toc } = htmlToMd(body, { dropLeadMatch: lead });

  // Prefer meaningful TOC: if only one junk entry, use generated headings
  let finalToc = toc;
  if (toc.length === 0) {
    finalToc = [{ id: 'wstep', label: 'Wstęp' }];
    // prepend anchor
  }

  // For posts that had only "Wstęp" TOC, replace with generated headings
  const oldTocCount = (fm.match(/^\s+- id:/gm) || []).length;
  if (oldTocCount <= 1 && toc.length > 0) {
    finalToc = toc;
  } else if (toc.length > 1) {
    finalToc = toc;
  }

  fm = upsertToc(fm, finalToc);
  fm = fixLead(fm, md);

  let outBody = md;
  // If first heading isn't at top and we have wstep-only content, ensure anchor for first toc id
  if (finalToc[0] && !new RegExp(`id="${finalToc[0].id}"`).test(outBody)) {
    outBody = `<div id="${finalToc[0].id}" class="reveal"></div>\n\n` + outBody;
  }

  const out = `---\n${fm.replace(/^\n+/, '').replace(/\n+$/, '')}\n---\n\n${outBody}`;
  if (!DRY) fs.writeFileSync(fp, out);
  console.log(`✓ ${file} (toc=${finalToc.length}, chars=${outBody.length})`);
}

console.log(DRY ? '\nDry run done' : '\nDone');
