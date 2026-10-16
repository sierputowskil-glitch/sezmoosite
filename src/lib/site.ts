/** Site URL helpers shared by marketing pages. */

export function getSiteUrl(): string {
  const raw =
    (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SITE_URL) ||
    'https://sezmoo.com';
  return String(raw).replace(/\/$/, '');
}

/** Hostido CDN for MP4 (and optional posters). Default: https://cdn.sezmoo.com */
export function getMediaBase(): string {
  const raw =
    (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_MEDIA_BASE) ||
    'https://cdn.sezmoo.com';
  return String(raw).replace(/\/$/, '');
}

/** Absolute URL under the media CDN, e.g. `video/showreel.mp4`. */
export function mediaUrl(path: string, base = getMediaBase()): string {
  const rel = path.replace(/^\//, '');
  return `${base}/${rel}`;
}

/** Absolute canonical URL for a site-root path (`/foo/` or `foo`). */
export function pageUrl(pathname: string, site = getSiteUrl()): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${site}${path}`;
}

export const PHONE_DISPLAY = '+48 739 260 450';
export const PHONE_TEL = '+48739260450';
