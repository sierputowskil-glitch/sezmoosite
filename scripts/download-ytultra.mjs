#!/usr/bin/env node
/**
 * Fetch SEZMOO YouTube videos via ytultra API → prefer 1080p MP4 (+ mux m4a).
 * Names: {ytId}__{slug}.mp4 for easy code mapping.
 *
 * Usage: npm run fetch:yt-videos
 * Queue: assets/video/yt/queue.json
 * After run: upload MP4s to Hostido at cdn.sezmoo.com/video/yt/… then fetch:yt-posters.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '..');
const OUT = join(ROOT, 'assets/video/yt');
const QUEUE = join(OUT, 'queue.json');
const MANIFEST = join(OUT, 'manifest.json');
const API = 'https://api.ytultra.com/ikool/youtube/download';

mkdirSync(OUT, { recursive: true });

const queue = JSON.parse(readFileSync(QUEUE, 'utf8'));
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchFormats(ytUrl) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://www.ytultra.com',
      referer: 'https://www.ytultra.com/',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    body: JSON.stringify({ url: ytUrl }),
  });
  if (!res.ok) throw new Error(`API HTTP ${res.status}`);
  const j = await res.json();
  if (j.code !== '0000') throw new Error(`API ${j.code}: ${j.msg}`);
  return j.data?.medias || [];
}

function pickVideo(medias) {
  const mp4 = medias.filter((m) => m.format && /\[\.mp4\]/i.test(m.format));
  const order = ['1080p', '720p', '480p', '360p', '240p', '144p'];
  for (const q of order) {
    const hit = mp4.find((m) => m.format.includes(q));
    if (hit) return hit;
  }
  return mp4[0] || null;
}

function pickAudio(medias, qualityHint) {
  const audio = medias.filter((m) => m.format && /\[\.m4a\]/i.test(m.format));
  if (!audio.length) return null;
  const q = (qualityHint || '').match(/(\d{3,4}p|4K|2K)/)?.[1];
  if (q) {
    const hit = audio.find((m) => m.format.includes(q));
    if (hit) return hit;
  }
  return audio.find((m) => m.format.includes('1080p')) || audio[0];
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0', referer: 'https://www.youtube.com/' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`download HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  return buf.length;
}

function mux(videoPath, audioPath, outPath) {
  const r = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      videoPath,
      '-i',
      audioPath,
      '-c',
      'copy',
      '-map',
      '0:v:0',
      '-map',
      '1:a:0?',
      '-shortest',
      '-movflags',
      '+faststart',
      outPath,
    ],
    { encoding: 'utf8' },
  );
  if (r.status !== 0) {
    throw new Error(`ffmpeg failed: ${(r.stderr || '').slice(-400)}`);
  }
}

function isProgressive(path) {
  // itag 18 progressive usually has audio; DASH video-only won't
  const r = spawnSync(
    'ffprobe',
    ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=codec_type', '-of', 'csv=p=0', path],
    { encoding: 'utf8' },
  );
  return (r.stdout || '').includes('audio');
}

async function processOne(item) {
  const outPath = join(OUT, item.file);
  if (existsSync(outPath) && manifest[item.id]?.ok) {
    console.log(`SKIP ${item.file}`);
    return manifest[item.id];
  }

  const ytUrl = `https://www.youtube.com/watch?v=${item.id}`;
  console.log(`\n→ ${item.id} ${item.slug}`);
  const medias = await fetchFormats(ytUrl);
  const video = pickVideo(medias);
  if (!video?.url) throw new Error('no video format');
  const audio = pickAudio(medias, video.format);

  const tmpV = join(OUT, `.tmp_${item.id}.mp4`);
  const tmpA = join(OUT, `.tmp_${item.id}.m4a`);

  const vBytes = await download(video.url, tmpV);
  console.log(`  video ${video.format} (${vBytes} B)`);

  let finalNote = video.format;
  if (isProgressive(tmpV) || !audio?.url) {
    // already has audio, or nothing to mux
    spawnSync('ffmpeg', ['-y', '-i', tmpV, '-c', 'copy', '-movflags', '+faststart', outPath], {
      encoding: 'utf8',
    });
    finalNote = `${video.format} (progressive/copy)`;
  } else {
    const aBytes = await download(audio.url, tmpA);
    console.log(`  audio ${audio.format} (${aBytes} B)`);
    mux(tmpV, tmpA, outPath);
    finalNote = `${video.format} + ${audio.format}`;
  }

  // cleanup temps
  for (const p of [tmpV, tmpA]) {
    try {
      if (existsSync(p)) writeFileSync(p, ''); // truncate then unlink via spawn
    } catch {}
  }
  spawnSync('rm', ['-f', tmpV, tmpA]);

  const entry = {
    id: item.id,
    slug: item.slug,
    file: item.file,
    format: finalNote,
    path: `video/yt/${item.file}`,
    /** Expected Hostido URL after upload — same path as `path`. */
    cdn: `https://cdn.sezmoo.com/video/yt/${item.file}`,
    ok: true,
    bytes: existsSync(outPath) ? readFileSync(outPath).length : 0,
  };
  manifest[item.id] = entry;
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`  OK → ${item.file} (${entry.bytes} B)`);
  console.log(`  CDN target → ${entry.cdn} (upload locally downloaded MP4 there)`);
  return entry;
}

/** Homepage clips shipped on Pages (same-origin) — keep map off Hostido for these ids. */
const PAGES_LOCAL_MP4 = {
  b_MB9qpw6jE: '/assets/video/yt/b_MB9qpw6jE__zespol.mp4',
};

/** Replace only `sez.cdnVideoMap = {…}` in assets/js/cdn-video-map.js (keep mount helpers). */
function regenerateCdnVideoMap() {
  const mapPath = join(ROOT, 'assets/js/cdn-video-map.js');
  if (!existsSync(mapPath)) {
    console.warn('cdn-video-map.js missing — skip regen');
    return;
  }
  const lines = Object.keys(manifest)
    .sort()
    .filter((id) => manifest[id]?.ok && (manifest[id]?.cdn || PAGES_LOCAL_MP4[id]))
    .map((id) => {
      const url = PAGES_LOCAL_MP4[id] || manifest[id].cdn;
      return `  ${JSON.stringify(id)}: ${JSON.stringify(url)}`;
    });
  const existing = readFileSync(mapPath, 'utf8');
  const mapMatch = existing.match(/sez\.cdnVideoMap\s*=\s*\{[\s\S]*?\n  \};/);
  if (!mapMatch) {
    console.warn('cdn-video-map.js: could not find sez.cdnVideoMap block — skip regen');
    return;
  }
  const next = existing.replace(mapMatch[0], `sez.cdnVideoMap = {\n${lines.join(',\n')}\n  };`);
  writeFileSync(mapPath, next);
  console.log(`\nUpdated ${mapPath} (${lines.length} entries)`);
}

const results = { ok: 0, fail: 0, errors: [] };
for (const item of queue) {
  try {
    await processOne(item);
    results.ok++;
  } catch (e) {
    results.fail++;
    results.errors.push({ id: item.id, error: String(e.message || e) });
    console.error(`  FAIL ${item.id}: ${e.message || e}`);
    manifest[item.id] = { id: item.id, slug: item.slug, file: item.file, ok: false, error: String(e.message || e) };
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  }
  await sleep(1200);
}

writeFileSync(join(OUT, 'download-report.json'), JSON.stringify(results, null, 2));
regenerateCdnVideoMap();
console.log(`\nDone. ok=${results.ok} fail=${results.fail}`);
if (results.errors.length) console.log(results.errors);
