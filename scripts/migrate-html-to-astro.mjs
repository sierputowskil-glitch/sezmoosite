#!/usr/bin/env node
/**
 * ONE-SHOT MIGRATOR (Fala 1–2) — do not run in CI or day-to-day DX.
 * Kept for archaeology / re-import from a legacy HTML tree if needed.
 *
 * Legacy HTML index pages (+ a few flat .html) → src/pages/*.astro wrapping
 * BaseLayout, preserving URL slugs.
 *
 * Skips vendor, node_modules, public, dist, src.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'pages');

const SKIP_DIRS = new Set([
  'node_modules',
  'vendor',
  'public',
  'dist',
  'src',
  '.git',
  '.astro',
  '.github',
  'functions',
  'scripts',
  'logs',
  'linki',
  'assets',
]);

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walk(full, acc);
    } else if (ent.isFile() && ent.name.endsWith('.html')) {
      acc.push(full);
    }
  }
  return acc;
}

function attr(html, name) {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']*)["']`,
    'i',
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${name}["']`,
    'i',
  );
  const m = html.match(re) || html.match(re2);
  return m ? decodeEntities(m[1]) : '';
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, '\u00a0');
}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1].replace(/\s+/g, ' ').trim()) : 'SEZMOO';
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  return m ? m[1] : '';
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1].trim();
    if (raw) blocks.push(raw);
  }
  return blocks;
}

function extractExtraHead(html) {
  const parts = [];
  // page-specific styles in head
  const styleRe = /<style[\s\S]*?<\/style>/gi;
  let m;
  while ((m = styleRe.exec(html))) {
    if (m[0].includes('YouTube lightbox') || m[0].length > 40) parts.push(m[0]);
  }
  // case-study.css etc.
  const linkRe = /<link[^>]+href=["'][^"']*case-study\.css["'][^>]*>/gi;
  while ((m = linkRe.exec(html))) parts.push(m[0].replace(/\.\.\/+/g, '/').replace(/href=["'](?!\/|https?:)/, 'href="/'));
  return parts.join('\n');
}

function extractPageScripts(html) {
  const scripts = [];
  // scripts after app.js (page-specific), excluding theme switcher (in layout)
  const bodyEnd = html.split(/<\/body>/i)[0] || html;
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(bodyEnd))) {
    const attrs = m[1] || '';
    const body = m[2] || '';
    if (/src=["'][^"']*flowing-background/.test(attrs)) continue;
    if (/src=["'][^"']*app\.js/.test(attrs)) continue;
    if (/gtm\.js|googletagmanager/.test(attrs + body)) continue;
    if (/sezmoo-theme|data-theme-set/.test(body) && body.length < 800) continue;
    if (/type=["']application\/ld\+json["']/.test(attrs)) continue;
    if (!attrs.includes('src=') && !body.trim()) continue;
    // rewrite relative script src
    let tag = m[0];
    tag = rewritePaths(tag);
    scripts.push(tag);
  }
  return scripts.join('\n');
}

function extractMainInner(html) {
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  let inner = mainMatch ? mainMatch[1] : '';
  if (!inner) {
    // fallback: body without chrome
    const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
    inner = bodyMatch ? bodyMatch[1] : html;
  }
  // drop footer (layout provides it)
  inner = inner.replace(/<!--\s*=+\s*FOOTER[\s\S]*?<\/footer>/i, '');
  inner = inner.replace(/<footer\b[\s\S]*?<\/footer>/i, '');
  // drop duplicated nav if somehow inside main
  inner = inner.replace(/<nav class="nav"[\s\S]*?<\/nav>/i, '');
  return inner.trim();
}

function rewritePaths(html) {
  let s = html;
  // assets with relative prefixes
  s = s.replace(/(src|href)=["'](?:\.\.\/)+assets\//g, '$1="/assets/');
  s = s.replace(/(src|href)=["']assets\//g, '$1="/assets/');
  s = s.replace(/(src|href)=["']\.\/assets\//g, '$1="/assets/');
  // form → API (env-aware client still overrides via __SEZMOO__)
  s = s.replace(
    /(action=["'])(?:\.\.\/)*(?:send\.php)(["'])/g,
    '$1/api/contact$2',
  );
  // common relative root links from nested pages → absolute
  // leave hash and absolute alone; convert ../foo/ carefully is hard — keep pretty relative where valid
  return s;
}

function detectLang(relPath, html) {
  if (relPath.startsWith('en/') || relPath === 'en') return 'en';
  const langMeta = html.match(/<html[^>]+lang=["']([^"']+)["']/i);
  if (langMeta && langMeta[1].toLowerCase().startsWith('en')) return 'en';
  return 'pl';
}

function outPathFor(relFile) {
  // index.html at root → src/pages/index.astro
  // blog/index.html → src/pages/blog/index.astro
  // Skip flat *.html when a sibling directory with index.html exists (avoids route collisions).
  const rel = relFile.replace(/\\/g, '/');
  if (rel.endsWith('/index.html') || rel === 'index.html') {
    const dir = rel === 'index.html' ? '' : rel.slice(0, -'/index.html'.length);
    return path.join(OUT, dir, 'index.astro');
  }
  if (rel.endsWith('.html')) {
    const base = rel.slice(0, -'.html'.length);
    const siblingIndex = path.join(ROOT, base, 'index.html');
    if (fs.existsSync(siblingIndex)) return null;
    return path.join(OUT, base, 'index.astro');
  }
  return null;
}

function escBacktick(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function buildAstro({ lang, title, description, canonical, keywords, ogTitle, ogDescription, jsonLdBlocks, extraHead, pageScripts, content, altHref }) {
  const props = [
    `lang="${lang}"`,
    `title=${JSON.stringify(title)}`,
  ];
  if (description) props.push(`description=${JSON.stringify(description)}`);
  if (canonical) props.push(`canonical=${JSON.stringify(canonical)}`);
  if (keywords) props.push(`keywords=${JSON.stringify(keywords)}`);
  if (ogTitle) props.push(`ogTitle=${JSON.stringify(ogTitle)}`);
  if (ogDescription) props.push(`ogDescription=${JSON.stringify(ogDescription)}`);
  if (altHref) props.push(`altHref=${JSON.stringify(altHref)}`);

  const depth = lang === 'en' ? '../'.repeat(
    // rough: en pages need one more level if nested — BaseLayout import is always from file location
    0,
  ) : 0;

  // Compute relative import to BaseLayout from out file — handled by caller via layoutImport
  return { props, jsonLdBlocks, extraHead, pageScripts, content };
}

function layoutImportFor(outFile) {
  const rel = path.relative(path.dirname(outFile), path.join(ROOT, 'src', 'layouts', 'BaseLayout.astro'));
  return './' + rel.replace(/\\/g, '/');
}

function main() {
  const files = walk(ROOT).filter((f) => {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    if (rel === '404.html' || rel.endsWith('/404.html')) return false;
    // skip obvious junk flats that duplicate directories when both exist
    return true;
  });

  let written = 0;
  let skipped = 0;

  for (const file of files) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    const outFile = outPathFor(rel);
    if (!outFile) {
      skipped++;
      continue;
    }

    const html = fs.readFileSync(file, 'utf8');
    const lang = detectLang(rel, html);
    const title = extractTitle(html);
    const description = attr(html, 'description');
    const keywords = attr(html, 'keywords');
    const canonical = extractCanonical(html);
    const ogTitle = attr(html, 'og:title');
    const ogDescription = attr(html, 'og:description');
    const jsonLdBlocks = extractJsonLd(html);
    const extraHead = rewritePaths(extractExtraHead(html));
    const pageScripts = extractPageScripts(html);
    let content = rewritePaths(extractMainInner(html));

    // Prefer absolute root-relative internal links on home
    if (rel === 'index.html' || rel === 'en/index.html') {
      content = content.replace(/href=["'](?!\/|#|https?:|mailto:|tel:)([^"']+)["']/g, (all, href) => {
        if (href.startsWith('assets/')) return all;
        return `href="/${href.replace(/^\.\//, '')}"`;
      });
    }

    // Move inline <script> out of markup so Astro/Vite won't parse them as modules
    const inlineScripts = [];
    content = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (tag) => {
      inlineScripts.push(rewritePaths(tag));
      return '';
    });
    const allPageScripts = [pageScripts, ...inlineScripts].filter(Boolean).join('\n');

    const importPath = layoutImportFor(outFile);
    const propsLines = [
      `  lang="${lang}"`,
      `  title=${JSON.stringify(title)}`,
    ];
    if (description) propsLines.push(`  description=${JSON.stringify(description)}`);
    if (canonical) propsLines.push(`  canonical=${JSON.stringify(canonical)}`);
    if (keywords) propsLines.push(`  keywords=${JSON.stringify(keywords)}`);
    if (ogTitle) propsLines.push(`  ogTitle=${JSON.stringify(ogTitle)}`);
    if (ogDescription) propsLines.push(`  ogDescription=${JSON.stringify(ogDescription)}`);

    if (rel === 'index.html') {
      propsLines.push(`  hreflangPl="https://sezmoo.com/"`);
      propsLines.push(`  hreflangEn="https://sezmoo.com/en/"`);
      propsLines.push(`  altHref="/en/"`);
      propsLines.push(`  brandHref="/#hero"`);
    } else if (rel === 'en/index.html') {
      propsLines.push(`  hreflangPl="https://sezmoo.com/"`);
      propsLines.push(`  hreflangEn="https://sezmoo.com/en/"`);
      propsLines.push(`  altHref="/"`);
      propsLines.push(`  brandHref="/en/#hero"`);
    }

    const extraMerged = [
      extraHead,
      jsonLdBlocks.length > 1
        ? jsonLdBlocks.map((b) => `<script type="application/ld+json">${b}</script>`).join('\n')
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    if (jsonLdBlocks.length === 1) {
      propsLines.push(`  jsonLd={${JSON.stringify(jsonLdBlocks[0])}}`);
    }
    if (extraMerged) {
      propsLines.push(`  extraHead={extraHeadHtml}`);
    }
    if (allPageScripts) {
      propsLines.push(`  pageScripts={pageScriptsHtml}`);
    }

    // Content via set:html — prevents Astro from compiling legacy inline JS/CSS as modules
    const frontmatterBits = [
      `import BaseLayout from '${importPath}';`,
      `const pageHtml = ${JSON.stringify(content)};`,
    ];
    if (extraMerged) frontmatterBits.push(`const extraHeadHtml = ${JSON.stringify(extraMerged)};`);
    if (allPageScripts) frontmatterBits.push(`const pageScriptsHtml = ${JSON.stringify(allPageScripts)};`);

    const astro = `---
${frontmatterBits.join('\n')}
---

<BaseLayout
${propsLines.join('\n')}
>
  <Fragment set:html={pageHtml} />
</BaseLayout>
`;

    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, astro, 'utf8');
    written++;
    console.log('wrote', path.relative(ROOT, outFile));
  }

  console.log(`\nDone. written=${written} skipped=${skipped}`);
}

main();
