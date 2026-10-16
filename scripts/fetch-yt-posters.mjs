#!/usr/bin/env node
/**
 * Extract 1080p poster frames from CDN MP4s → assets/video/yt/posters/{id}.webp
 * Falls back to i.ytimg.com maxresdefault / hqdefault when CDN file missing.
 */
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const manifestPath = join(root, 'assets/video/yt/manifest.json');
const outDir = join(root, 'assets/video/yt/posters');
mkdirSync(outDir, { recursive: true });

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
/** Case-study / portfolio IDs without a CDN MP4 — still get a local poster via ytimg. */
const EXTRA_IDS = ['4DTDakWPmfM', 'O5iF7SxqX1I', '7HZN5VCTvoo', 'lOwJMPKMdYA'];
const ids = [...new Set([...Object.keys(manifest), ...EXTRA_IDS])].sort();

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  return r;
}

function frameFromCdn(id, entry, jpgOut) {
  const cdn = entry?.cdn;
  if (!cdn) return false;
  // Try several offsets; keep the largest JPEG (avoids black/fade opens)
  const offsets = ['0.5', '1.5', '3', '5', '8', '12', '20'];
  let best = 0;
  let bestPath = '';
  for (const ss of offsets) {
    const cand = `${jpgOut}.${ss}`;
    const r = run('ffmpeg', [
      '-y',
      '-ss',
      ss,
      '-i',
      cdn,
      '-frames:v',
      '1',
      '-q:v',
      '2',
      cand,
    ]);
    if (r.status !== 0 || !existsSync(cand)) continue;
    const size = readFileSync(cand).length;
    if (size > best) {
      if (bestPath) run('rm', ['-f', bestPath]);
      best = size;
      bestPath = cand;
    } else {
      run('rm', ['-f', cand]);
    }
  }
  if (!bestPath) return false;
  run('mv', [bestPath, jpgOut]);
  return existsSync(jpgOut);
}

function downloadYtThumb(id, jpgOut) {
  const variants = ['maxresdefault', 'hq720', 'sddefault', 'hqdefault'];
  for (const v of variants) {
    const url = `https://i.ytimg.com/vi/${id}/${v}.jpg`;
    const r = run('curl', ['-fsSL', '-o', jpgOut, url]);
    if (r.status !== 0 || !existsSync(jpgOut)) continue;
    // Placeholder maxres is often ~1–2KB grey image
    const size = readFileSync(jpgOut).length;
    if (size < 5000) continue;
    return true;
  }
  return false;
}

function toWebp(jpg, webp) {
  const r = run('cwebp', ['-q', '78', '-m', '6', '-af', '-metadata', 'none', jpg, '-o', webp]);
  return r.status === 0 && existsSync(webp);
}

const report = [];
for (const id of ids) {
  const entry = manifest[id];
  const tmpJpg = join(outDir, `.tmp_${id}.jpg`);
  const webp = join(outDir, `${id}.webp`);
  let ok = false;
  let source = '';

  if (entry && frameFromCdn(id, entry, tmpJpg)) {
    ok = true;
    source = 'cdn-frame';
  } else if (downloadYtThumb(id, tmpJpg)) {
    ok = true;
    source = 'ytimg';
  }

  if (ok && toWebp(tmpJpg, webp)) {
    const bytes = readFileSync(webp).length;
    report.push({ id, source, bytes, webp: `video/yt/posters/${id}.webp` });
    console.log(`✓ ${id} (${source}, ${(bytes / 1024).toFixed(0)} KB)`);
  } else {
    report.push({ id, source: 'fail', bytes: 0 });
    console.error(`✗ ${id}`);
  }
  try {
    spawnSync('rm', ['-f', tmpJpg]);
  } catch (_) {}
}

writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(report, null, 2) + '\n');
const ok = report.filter((r) => r.source !== 'fail').length;
console.log(`\nDone: ${ok}/${report.length} posters → assets/video/yt/posters/`);
