/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_BASE_PATH?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
  readonly PUBLIC_CONTACT_API_URL: string;
  /** Origin for large media (hero showreel). Default: https://cdn.sezmoo.com */
  readonly PUBLIC_MEDIA_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __SEZMOO__?: {
    turnstileSiteKey?: string;
    contactApiUrl?: string;
  };
}
