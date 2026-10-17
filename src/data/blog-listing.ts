/**
 * PL blog index chrome (`/blog/`). Posts come from the content collection.
 * EN `/en/blog/` redirects here — no EN listing.
 */

export interface BlogListingFilter {
  id: 'all' | 'production' | 'social' | 'strategy';
  label: string;
}

export interface BlogListingSideLink {
  href: string;
  label: string;
  /** Topic filter chip (omit for plain links e.g. contact). */
  filter?: BlogListingFilter['id'];
}

export interface BlogListingCopy {
  path: string;
  title: string;
  description: string;
  schemaName: string;
  screenLabel: string;
  eyebrow: string;
  h1Html: string;
  heroCopyHtml: string;
  featuredBadge: string;
  featuredCta: string;
  moreCta: string;
  filters: BlogListingFilter[];
  sideLabel: string;
  sideLinks: BlogListingSideLink[];
}

export const BLOG_LISTING: BlogListingCopy = {
  path: '/blog/',
  title: 'Blog, produkcja wideo, content i marketing marek | SEZMOO',
  description:
    'Blog SEZMOO: praktyczne notatki o produkcji wideo, contentu na social media i marketingu marek, z planu, montażu i feedu.',
  schemaName: 'Blog SEZMOO',
  screenLabel: 'Blog',
  eyebrow: 'NOTATKI SEZMOO',
  h1Html: 'Notatki z&nbsp;planu, montażu i&nbsp;feedu.',
  heroCopyHtml:
    'Praktyczne wpisy o&nbsp;produkcji wideo, content marketingu, social mediach i&nbsp;stronach, które wspierają sprzedaż.',
  featuredBadge: 'FEATURED',
  featuredCta: 'Czytaj artykuł',
  moreCta: 'Czytaj dalej',
  filters: [
    { id: 'all', label: 'Wszystko' },
    { id: 'production', label: 'Produkcja' },
    { id: 'social', label: 'Social' },
    { id: 'strategy', label: 'Strategia' },
  ],
  sideLabel: 'Tematy',
  sideLinks: [
    { href: '#production', label: 'Produkcja wideo', filter: 'production' },
    { href: '#social', label: 'Social / Reels / LinkedIn', filter: 'social' },
    { href: '#strategy', label: 'Strategia i strony', filter: 'strategy' },
    { href: '/#kontakt', label: 'Zaproponuj temat' },
  ],
};

export function blogListingCopy(): BlogListingCopy {
  return BLOG_LISTING;
}
