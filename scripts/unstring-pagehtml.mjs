#!/usr/bin/env node
/**
 * ONE-SHOT MIGRATOR (Fala 3) — do not run in CI or day-to-day DX.
 * Pages are already Astro markup; re-running may clobber hand edits.
 *
 * Converted `const pageHtml` + `<Fragment set:html>` dumps into real Astro markup.
 *
 * Usage (manual only):
 *   node scripts/unstring-pagehtml.mjs [--dry] [glob-or-path...]
 *
 * Default targets: services, portfolio, case studies, retainers, about/privacy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry');
const PHONE_DISPLAY = '+48 739 260 450';
const PHONE_TEL = '+48739260450';
const FORM_PLACEHOLDER = '<!--__CONTACT_FORM__-->';

const DEFAULT_GLOBS = [
  'src/pages/uslugi-marketingowe',
  'src/pages/en/services',
  'src/pages/portfolio',
  'src/pages/portfolio-lista-b',
  'src/pages/en/portfolio-en',
  'src/pages/realizacja',
  'src/pages/realizacja-*',
  'src/pages/en/realizacja',
  'src/pages/en/realizacja-*',
  'src/pages/en/retainer',
  'src/pages/abonament',
  'src/pages/en/about-us',
  'src/pages/polityka-prywatnosci',
  'src/pages/en/privacy-policy',
];

function walkDir(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkDir(full, acc);
    else if (ent.name === 'index.astro') acc.push(full);
  }
  return acc;
}

function expandTargets(args) {
  const raw = args.filter((a) => a !== '--dry');
  const inputs = raw.length ? raw : DEFAULT_GLOBS;
  const files = new Set();
  for (const input of inputs) {
    const abs = path.isAbsolute(input) ? input : path.join(ROOT, input);
    if (abs.includes('*')) {
      const parent = path.dirname(abs);
      const prefix = path.basename(abs).replace(/\*$/, '');
      if (!fs.existsSync(parent)) continue;
      for (const ent of fs.readdirSync(parent, { withFileTypes: true })) {
        if (ent.isDirectory() && ent.name.startsWith(prefix)) {
          walkDir(path.join(parent, ent.name)).forEach((f) => files.add(f));
        }
      }
    } else if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) {
      walkDir(abs).forEach((f) => files.add(f));
    } else if (fs.existsSync(abs) && abs.endsWith('.astro')) {
      files.add(abs);
    }
  }
  return [...files].sort();
}

/** Unescape a JS double-quoted string body starting after the opening quote. */
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

function pagePathFromFile(file) {
  const rel = path.relative(path.join(ROOT, 'src', 'pages'), file).replace(/\\/g, '/');
  if (rel === 'index.astro') return '/';
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
  // Require whitespace before attr name so we never rewrite `this.src=` inside onerror="..."
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
      const next = resolveHref(val, pagePath);
      return `${ws}${attr}="${next}"`;
    },
  );
}

function rewritePhones(html) {
  let s = html;
  s = s.replace(
    /(?:\+48[\s-]*)?739[\s-]*260[\s-]*450/g,
    PHONE_DISPLAY,
  );
  s = s.replace(/tel:\+?48?[\s-]*739[\s-]*260[\s-]*450/gi, `tel:${PHONE_TEL}`);
  s = s.replace(/href=["']tel:[^"']*739[^"']*["']/gi, `href="tel:${PHONE_TEL}"`);
  return s;
}

function stripDuplicateCaseCss(extraHead) {
  if (!extraHead) return '';
  return extraHead
    .replace(/<link[^>]+case-study\.css[^>]*>\s*/gi, '')
    .trim();
}

function replaceFormWithPlaceholder(html) {
  if (!/<form\b/i.test(html)) return { html, hasForm: false };
  // Replace outermost form(s) that look like contact forms
  const next = html.replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, (tag) => {
    if (/cform|contact|abonament|retainer|name=["']abonament/i.test(tag)) {
      return FORM_PLACEHOLDER;
    }
    return tag;
  });
  return { html: next, hasForm: next.includes(FORM_PLACEHOLDER) };
}

/** Escape `{` / `}` so Astro does not treat them as expressions (one-pass). */
function escapeAstroBraces(html) {
  // Emit Astro text nodes {'{'} and {'}'}
  return html.replace(/[{}]/g, (c) => (c === '{' ? '{\'{\'}' : '{\'}\'}'));
}


function layoutFor(pagePath) {
  if (/\/realizacja/.test(pagePath)) return 'CaseStudyLayout';
  if (/\/portfolio/.test(pagePath)) return 'PortfolioLayout';
  if (
    /\/uslugi-marketingowe|\/en\/services|\/en\/retainer/.test(pagePath) ||
    pagePath === '/abonament/' ||
    pagePath === '/abonament'
  ) {
    return 'ServiceLayout';
  }
  return 'BaseLayout';
}

function layoutImport(file, layoutName) {
  const rel = path
    .relative(path.dirname(file), path.join(ROOT, 'src', 'layouts', `${layoutName}.astro`))
    .replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

function contactImport(file) {
  const rel = path
    .relative(path.dirname(file), path.join(ROOT, 'src', 'components', 'ContactForm.astro'))
    .replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

function siteImport(file) {
  const rel = path
    .relative(path.dirname(file), path.join(ROOT, 'src', 'lib', 'site'))
    .replace(/\\/g, '/');
  return rel.startsWith('.') ? rel : `./${rel}`;
}

/** Fix leftover ../ paths inside inline JS (pageScripts). */
function rewriteJsRelativePaths(js, pagePath) {
  return js.replace(/(["'`])(\.\.\/[^"'`]+)\1/g, (all, q, rel) => {
    return q + resolveHref(rel, pagePath) + q;
  });
}

/** Pull prop values from existing <BaseLayout ...> opening tag. */
function parseLayoutProps(src) {
  const m = src.match(/<BaseLayout\b([\s\S]*?)>/);
  if (!m) return {};
  const block = m[1];
  const props = {};
  const re =
    /(\w+)=(?:\{JSON\.stringify\(([^)]*)\)\}|\{([^}]*)\}|"([^"]*)"|'([^']*)')/g;
  // Simpler line-based parse for our known shape
  for (const line of block.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('//')) continue;
    const km = t.match(/^(\w+)=(.+)$/);
    if (!km) continue;
    const key = km[1];
    let raw = km[2].replace(/,$/, '').trim();
    if (raw.startsWith('{') && raw.endsWith('}')) {
      props[key] = { kind: 'expr', value: raw.slice(1, -1).trim() };
    } else if (
      (raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'"))
    ) {
      props[key] = { kind: 'str', value: JSON.parse(raw.replace(/^'/, '"').replace(/'$/, '"')) };
    } else {
      props[key] = { kind: 'raw', value: raw };
    }
  }
  return props;
}

function extractAttr(src, name) {
  // Match title="..." or title={"..."} style from BaseLayout block
  const props = parseLayoutProps(src);
  const p = props[name];
  if (!p) return '';
  if (p.kind === 'str') return p.value;
  if (p.kind === 'expr') {
    // jsonLd={...} or pageScripts={pageScriptsHtml}
    try {
      if (p.value.startsWith('"') || p.value.startsWith("'")) return JSON.parse(p.value);
      // Double-encoded JSON string in braces: "{\"@context\"...
      if (p.value.startsWith('"\\') || (p.value.startsWith('"') && p.value.includes('\\"'))) {
        return JSON.parse(p.value);
      }
    } catch {
      /* fall through */
    }
    return p.value;
  }
  return p.value;
}

function detectLang(pagePath, props) {
  if (props.lang?.kind === 'str') return props.lang.value;
  if (pagePath.startsWith('/en/')) return 'en';
  return 'pl';
}

function buildFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  if (!src.includes('const pageHtml') || !src.includes('set:html={pageHtml}')) {
    return { skipped: true, reason: 'not-string-dump' };
  }

  const pagePath = pagePathFromFile(file);
  const props = parseLayoutProps(src);
  const lang = detectLang(pagePath, props);
  const layoutName = layoutFor(pagePath);

  let html = extractQuotedConst(src, 'pageHtml') || '';
  let extraHead = extractQuotedConst(src, 'extraHeadHtml') || '';
  let pageScripts = extractQuotedConst(src, 'pageScriptsHtml') || '';

  html = rewriteLinks(html, pagePath);
  html = rewritePhones(html);
  extraHead = rewriteLinks(extraHead, pagePath);
  pageScripts = rewriteLinks(pageScripts, pagePath);
  pageScripts = rewriteJsRelativePaths(pageScripts, pagePath);
  pageScripts = rewritePhones(pageScripts);

  if (layoutName === 'CaseStudyLayout') {
    extraHead = stripDuplicateCaseCss(extraHead);
  }

  const formResult = replaceFormWithPlaceholder(html);
  html = formResult.html;
  const useContactForm = formResult.hasForm;

  // Escape braces for Astro template (portfolio filter counts etc.)
  let body = escapeAstroBraces(html);

  // Restore ContactForm component (must not be brace-escaped placeholder alone)
  if (useContactForm) {
    body = body.replace(
      FORM_PLACEHOLDER.replace(/[{}]/g, (c) => (c === '{' ? "{'{'}" : "{'}'}")),
      // placeholder has no braces — FORM_PLACEHOLDER is HTML comment
      `<ContactForm lang="${lang}" formId="${lang === 'pl' ? 'abonament-form' : 'retainer-form'}" />`,
    );
    // Also try unescaped in case escape didn't touch it
    body = body.replace(
      FORM_PLACEHOLDER,
      `<ContactForm lang="${lang}" formId="${lang === 'pl' ? 'abonament-form' : 'retainer-form'}" />`,
    );
  }

  const title = extractAttr(src, 'title') || 'SEZMOO';
  const description = extractAttr(src, 'description') || '';
  const keywords = extractAttr(src, 'keywords') || '';
  const ogTitle = extractAttr(src, 'ogTitle') || '';
  const ogDescription = extractAttr(src, 'ogDescription') || '';
  const altHref = extractAttr(src, 'altHref') || '';
  const brandHref = extractAttr(src, 'brandHref') || '';
  const bodyClass = extractAttr(src, 'bodyClass') || '';
  const bodyId = extractAttr(src, 'bodyId') || '';

  // jsonLd: prefer parsing string from original const if embedded in props
  let jsonLdRaw = null;
  const jsonLdProp = props.jsonLd;
  if (jsonLdProp?.kind === 'expr') {
    const v = jsonLdProp.value.trim();
    if (v.startsWith('"') || v.startsWith("'")) {
      try {
        jsonLdRaw = JSON.parse(v);
      } catch {
        jsonLdRaw = null;
      }
    }
  }

  const imports = [
    `import ${layoutName} from '${layoutImport(file, layoutName)}';`,
    `import { pageUrl } from '${siteImport(file)}';`,
  ];
  if (useContactForm) {
    imports.push(`import ContactForm from '${contactImport(file)}';`);
  }

  const fm = [
    ...imports,
    '',
    `const lang = '${lang}' as const;`,
    `const canonical = pageUrl('${pagePath}');`,
  ];

  if (jsonLdRaw) {
    // Store as object when possible
    try {
      const obj = typeof jsonLdRaw === 'string' ? JSON.parse(jsonLdRaw) : jsonLdRaw;
      fm.push(`const jsonLd = ${JSON.stringify(obj, null, 2)};`);
    } catch {
      fm.push(`const jsonLd = ${JSON.stringify(jsonLdRaw)};`);
    }
  }

  if (extraHead) {
    fm.push(`const extraHeadHtml = ${JSON.stringify(extraHead)};`);
  }
  if (pageScripts) {
    fm.push(`const pageScriptsHtml = ${JSON.stringify(pageScripts)};`);
  }

  const propLines = [
    `  lang={lang}`,
    `  title=${JSON.stringify(title)}`,
  ];
  if (description) propLines.push(`  description=${JSON.stringify(description)}`);
  propLines.push(`  canonical={canonical}`);
  if (keywords) propLines.push(`  keywords=${JSON.stringify(keywords)}`);
  if (ogTitle) propLines.push(`  ogTitle=${JSON.stringify(ogTitle)}`);
  if (ogDescription) propLines.push(`  ogDescription=${JSON.stringify(ogDescription)}`);
  if (altHref) propLines.push(`  altHref=${JSON.stringify(altHref)}`);
  if (brandHref) propLines.push(`  brandHref=${JSON.stringify(brandHref)}`);
  if (bodyClass) propLines.push(`  bodyClass=${JSON.stringify(bodyClass)}`);
  if (bodyId) propLines.push(`  bodyId=${JSON.stringify(bodyId)}`);
  if (jsonLdRaw) propLines.push(`  jsonLd={jsonLd}`);
  if (extraHead) propLines.push(`  extraHead={extraHeadHtml}`);
  if (pageScripts) propLines.push(`  pageScripts={pageScriptsHtml}`);

  // Hreflang for paired service pages when altHref present on original — keep if set
  // Optionally derive common pairs later

  const out = `---
${fm.join('\n')}
---

<${layoutName}
${propLines.join('\n')}
>
${body}
</${layoutName}>
`;

  return { skipped: false, out, useContactForm, layoutName };
}

function main() {
  const files = expandTargets(process.argv.slice(2));
  let converted = 0;
  let skipped = 0;
  const report = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    try {
      const result = buildFile(file);
      if (result.skipped) {
        skipped++;
        report.push(`SKIP ${rel} (${result.reason})`);
        continue;
      }
      if (!DRY) fs.writeFileSync(file, result.out, 'utf8');
      converted++;
      report.push(
        `OK   ${rel} → ${result.layoutName}${result.useContactForm ? ' +ContactForm' : ''}`,
      );
    } catch (err) {
      report.push(`FAIL ${rel}: ${err.message}`);
      console.error(err);
    }
  }

  console.log(report.join('\n'));
  console.log(
    `\n${DRY ? '[dry] ' : ''}converted=${converted} skipped=${skipped} total=${files.length}`,
  );
}

main();
