/** Shared JSON-LD builders for Google rich results / schema.org. */
import { getSiteUrl, PHONE_TEL } from './site';

export type FaqItem = { question: string; answer: string };

export const ORG_SAME_AS = [
  'https://www.instagram.com/sezmoo/',
  'https://www.facebook.com/sezmooagencja',
  'https://www.youtube.com/@sezmooagency',
  'https://www.linkedin.com/company/sezmoo/',
] as const;

/** PNG preferred over SVG for Google logo / Knowledge Panel. */
export function organizationLogoUrl(site = getSiteUrl()): string {
  return `${site}/assets/og-image.png`;
}

export function sezmooOrganization(opts?: {
  site?: string;
  includeAddress?: boolean;
  includeContact?: boolean;
}): Record<string, unknown> {
  const site = opts?.site ?? getSiteUrl();
  const org: Record<string, unknown> = {
    '@type': 'Organization',
    name: 'SEZMOO',
    url: `${site}/`,
    logo: {
      '@type': 'ImageObject',
      url: organizationLogoUrl(site),
    },
    sameAs: [...ORG_SAME_AS],
  };
  if (opts?.includeAddress !== false) {
    org.address = {
      '@type': 'PostalAddress',
      streetAddress: 'Zeusa 34',
      postalCode: '80-299',
      addressLocality: 'Gdańsk',
      addressCountry: 'PL',
    };
  }
  if (opts?.includeContact !== false) {
    org.email = 'biuro@sezmoo.com';
    org.telephone = PHONE_TEL;
  }
  return org;
}

export function faqPageJsonLd(
  items: FaqItem[],
  lang: 'pl' | 'en' = 'pl',
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang === 'pl' ? 'pl-PL' : 'en',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function blogPostingJsonLd(opts: {
  headline: string;
  description?: string;
  canonical: string;
  datePublished: Date | string;
  image?: string;
  lang?: 'pl' | 'en';
}): Record<string, unknown> {
  const site = getSiteUrl();
  const published =
    opts.datePublished instanceof Date
      ? opts.datePublished.toISOString()
      : opts.datePublished;
  const image = opts.image
    ? opts.image.startsWith('http')
      ? opts.image
      : `${site}${opts.image.startsWith('/') ? '' : '/'}${opts.image}`
    : organizationLogoUrl(site);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.headline,
    description: opts.description || undefined,
    url: opts.canonical,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': opts.canonical,
    },
    datePublished: published,
    dateModified: published,
    inLanguage: opts.lang === 'en' ? 'en' : 'pl-PL',
    image: [image],
    author: sezmooOrganization({ site, includeAddress: false }),
    publisher: sezmooOrganization({ site, includeContact: false }),
  };
}

export function creativeWorkJsonLd(opts: {
  name: string;
  description?: string;
  canonical: string;
  image?: string;
  lang?: 'pl' | 'en';
}): Record<string, unknown> {
  const site = getSiteUrl();
  const image = opts.image
    ? opts.image.startsWith('http')
      ? opts.image
      : `${site}${opts.image.startsWith('/') ? '' : '/'}${opts.image}`
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.name,
    description: opts.description || undefined,
    url: opts.canonical,
    inLanguage: opts.lang === 'en' ? 'en' : 'pl-PL',
    ...(image ? { image } : {}),
    creator: sezmooOrganization({ site, includeAddress: false }),
    publisher: sezmooOrganization({ site, includeContact: false }),
  };
}

export function homePageJsonLd(opts: {
  lang: 'pl' | 'en';
  canonical: string;
  description: string;
}): Record<string, unknown> {
  const site = getSiteUrl();
  const logo = organizationLogoUrl(site);
  const orgId = `${site}/#organization`;
  const websiteId = `${site}/#website`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: 'SEZMOO',
        url: opts.lang === 'en' ? `${site}/en/` : `${site}/`,
        inLanguage: opts.lang === 'en' ? 'en' : 'pl-PL',
        publisher: { '@id': orgId },
      },
      {
        '@type': 'ProfessionalService',
        '@id': orgId,
        name: 'SEZMOO',
        description: opts.description,
        url: opts.canonical,
        email: 'biuro@sezmoo.com',
        telephone: PHONE_TEL,
        image: logo,
        logo: {
          '@type': 'ImageObject',
          url: logo,
        },
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Zeusa 34',
          postalCode: '80-299',
          addressLocality: 'Gdańsk',
          addressCountry: 'PL',
        },
        areaServed: {
          '@type': 'Country',
          name: opts.lang === 'en' ? 'Poland' : 'Polska',
        },
        sameAs: [...ORG_SAME_AS],
      },
    ],
  };
}

export function itemListJsonLd(opts: {
  name: string;
  description?: string;
  canonical: string;
  items: { name: string; url: string }[];
  lang?: 'pl' | 'en';
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description || undefined,
    url: opts.canonical,
    inLanguage: opts.lang === 'en' ? 'en' : 'pl-PL',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: opts.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: item.url,
      })),
    },
  };
}

/**
 * Google requires uploadDate for Video rich results. Exact shoot dates are not
 * stored per case — use a shared fallback unless a real ISO date is passed.
 */
export const VIDEO_UPLOAD_DATE_FALLBACK = '2024-06-01';

export function videoObjectJsonLd(opts: {
  name: string;
  description?: string;
  thumbnailUrl: string;
  contentUrl?: string;
  /** ISO 8601 date; defaults to VIDEO_UPLOAD_DATE_FALLBACK. */
  uploadDate?: string;
  lang?: 'pl' | 'en';
}): Record<string, unknown> {
  const site = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: opts.name,
    description: opts.description || undefined,
    thumbnailUrl: opts.thumbnailUrl,
    uploadDate: opts.uploadDate || VIDEO_UPLOAD_DATE_FALLBACK,
    ...(opts.contentUrl ? { contentUrl: opts.contentUrl } : {}),
    inLanguage: opts.lang === 'en' ? 'en' : 'pl-PL',
    publisher: sezmooOrganization({ site, includeAddress: false }),
  };
}
