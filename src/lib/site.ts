/** Site URL helpers shared by marketing pages. */

export function getSiteUrl(): string {
  const raw =
    (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SITE_URL) ||
    'https://sezmoo.com';
  return String(raw).replace(/\/$/, '');
}

/** Absolute canonical URL for a site-root path (`/foo/` or `foo`). */
export function pageUrl(pathname: string, site = getSiteUrl()): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${site}${path}`;
}

export const PHONE_DISPLAY = '+48 739 260 450';
export const PHONE_TEL = '+48739260450';
