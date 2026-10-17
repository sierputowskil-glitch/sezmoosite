/** Service pages keyed by public slug — PL + EN copy. Shared structure, language is data. */

export type ServiceLang = 'pl' | 'en';

export type Html = string;

export interface ServiceFact {
  label: Html;
  value: Html;
}

export interface ServiceCta {
  href: string;
  label: Html;
  primary?: boolean;
}

export interface ServiceReelImg {
  kind: 'img';
  /** Public `/assets/…` source (work/photo/img/portfolio). Optimized via AssetImage. */
  src: string;
  alt: string;
  figureStyle?: string;
  imgStyle?: string;
  captionStyle?: string;
  captionBold?: Html;
  caption?: Html;
}

export interface ServiceReelVideo {
  kind: 'video';
  /** Path under the media CDN, e.g. `video/audi-rs5-trailer.mp4`. */
  mediaPath: string;
  label: string;
  captionBold?: Html;
  caption?: Html;
}

export type ServiceReel = ServiceReelImg | ServiceReelVideo;

export interface DetailItem {
  title: Html;
  body: Html;
  tags?: string[];
  open?: boolean;
}

export interface StepItem {
  title: Html;
  text: Html;
}

export interface WorkItem {
  href: string;
  src: string;
  alt: string;
  kicker: Html;
  title: Html;
}

export interface MoreLink {
  href: string;
  label: Html;
  lead?: boolean;
}

export interface VarItem {
  href: string;
  n: string;
  title: Html;
  text: Html;
}

export interface FormatOut {
  shape: string;
  ratio: Html;
  title: Html;
}

export interface RelatedRow {
  href: string;
  no: string;
  title: Html;
  desc: Html;
}

export interface CatalogOffer {
  name: string;
  description?: string;
}

export interface CatalogGroup {
  name: string;
  items?: CatalogOffer[];
  description?: string;
}

export type ServiceBlock =
  | {
      type: 'details';
      id: string;
      split?: boolean;
      kick?: Html;
      headingHtml?: Html;
      leadHtml?: Html;
      items: DetailItem[];
      note?: Html;
    }
  | {
      type: 'steps';
      id: string;
      split?: boolean;
      headingHtml?: Html;
      items: StepItem[];
    }
  | {
      type: 'vars';
      id: string;
      headingHtml?: Html;
      items: VarItem[];
      note?: Html;
    }
  | {
      type: 'work';
      id: string;
      split?: boolean;
      headingHtml?: Html;
      items: WorkItem[];
      more: MoreLink[];
    }
  | {
      type: 'prose';
      id: string;
      split?: boolean;
      kick?: Html;
      headingHtml?: Html;
      paras: Html[];
      more?: MoreLink[];
      tags?: string[];
    }
  | {
      type: 'format';
      id: string;
      leadHtml: Html;
      paras: Html[];
      hudLeft: Html;
      hudRight: Html;
      masterLabel: Html;
      splitLabel: Html;
      outs: FormatOut[];
      copyKick: Html;
      copyTitle: Html;
      copyP: Html;
      copyCtaHref: string;
      copyCta: Html;
    }
  | {
      type: 'faq';
      id: string;
      split?: boolean;
      headingHtml?: Html;
      items: DetailItem[];
    }
  | {
      type: 'form';
      id: string;
      headingHtml?: Html;
      leadHtml?: Html;
      formId: string;
    }
  | {
      type: 'related';
      id: string;
      split?: boolean;
      headingHtml?: Html;
      rows: RelatedRow[];
      ctaTitle: Html;
      ctaP: Html;
      ctaHref: string;
      ctaLabel: Html;
    };

export interface ServiceCopy {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  /** Short hub listing title (`/uslugi-marketingowe/`, `/en/services/`). */
  hubTitle?: Html;
  /** Hub listing blurb (HTML). */
  hubDesc?: Html;
  kick: Html;
  h1Html: Html;
  leads: Html[];
  facts: ServiceFact[];
  ctas?: ServiceCta[];
  reel?: ServiceReel;
  blocks: ServiceBlock[];
  schemaName: string;
  schemaType: string;
  catalogName: string;
  catalog: CatalogGroup[];
  faq?: { question: string; answer: string }[];
}

export interface ServiceDef {
  id: string;
  plSlug: string;
  enSlug: string;
  /** Curated hub list order. Omit to hide from `/uslugi-marketingowe/` / `/en/services/`. */
  hubOrder?: number;
  pl: ServiceCopy;
  en: ServiceCopy;
}
