/** Longform (non-video-slug) case studies — branding, events, campaigns. */

export type LongformLang = 'pl' | 'en';

export interface LongformMeta {
  k: string;
  v: string;
  small?: string;
  href?: string;
}

export interface LongformShot {
  src: string;
  alt: string;
  tag: string;
  ratio?: string;
  delay?: boolean;
  bg?: string;
  figureClass?: string;
  imgStyle?: string;
  mediaStyle?: string;
  figureStyle?: string;
  contain?: boolean;
  parallax?: number;
  scroll?: boolean;
  tc?: string;
}

export interface LongformStep {
  no: string;
  title: string;
  desc: string;
}

export interface LongformStoryFrame {
  src: string;
  alt: string;
}

export interface LongformAdPost {
  src: string;
  alt: string;
  caption: string;
  feed?: boolean;
}

export type LongformBlock =
  | {
      type: 'intro';
      screen?: string;
      no: string;
      titleHtml: string;
      paras: string[];
    }
  | {
      type: 'heading';
      screen?: string;
      no: string;
      titleHtml: string;
      lead?: string;
      padTop0?: boolean;
      padBottom0?: boolean;
    }
  | {
      type: 'steps';
      screen?: string;
      no: string;
      titleHtml: string;
      lead?: string;
      padTop0?: boolean;
      items: LongformStep[];
    }
  | {
      type: 'film';
      screen?: string;
      no: string;
      titleHtml: string;
      lead?: string;
      videoId: string;
      poster: string;
      alt: string;
      recLabel: string;
      extras?: string[];
      short?: boolean;
      noteHtml?: string;
    }
  | {
      type: 'gallery';
      aria: string;
      padTop0?: boolean;
      rows: { split?: boolean; shots: LongformShot[] }[];
    }
  | {
      type: 'splitShots';
      screen?: string;
      no: string;
      titleHtml: string;
      lead?: string;
      padTop0?: boolean;
      aria?: string;
      shots: LongformShot[];
    }
  | {
      type: 'palette';
      screen?: string;
      no?: string;
      titleHtml?: string;
      padTop0?: boolean;
      colors: { name: string; hex: string }[];
      typeSampleHtml?: string;
      typeNoteHtml?: string;
    }
  | {
      type: 'stories';
      screen?: string;
      no: string;
      titleHtml: string;
      name: string;
      spon: string;
      cta: string;
      prev: string;
      next: string;
      captions: [string, string];
      line1: LongformStoryFrame[];
      line2: LongformStoryFrame[];
      afterHtml?: string;
    }
  | {
      type: 'brandBook';
      screen?: string;
      no: string;
      titleHtml: string;
      lead?: string;
      padTop0?: boolean;
      spreads: {
        rotate: string;
        wide?: boolean;
        pages: {
          bg: string;
          src?: string;
          imgPct?: string;
          label: string;
          labelOnDark?: boolean;
          heading?: string;
          sub?: string;
        }[];
      }[];
    }
  | {
      type: 'adPosts';
      aria: string;
      name: string;
      spon: string;
      cta: string;
      groups: LongformAdPost[][];
    }
  | {
      type: 'html';
      html: string;
    };

export interface LongformCopy {
  title: string;
  description: string;
  schemaName: string;
  hero: {
    device?: boolean;
    frame?: boolean;
    image: string;
    alt: string;
    hud: string[];
    cat: string;
    titleLead: string;
    titleAccent: string;
    sub: string;
  };
  meta: LongformMeta[];
  blocks: LongformBlock[];
  back?: { href: string; label: string };
  quote: { text: string; by: string };
  next: {
    href: string;
    aria: string;
    k: string;
    title: string;
    cat: string;
    image: string;
    alt: string;
  };
}

export interface LongformDef {
  id: string;
  pl: LongformCopy;
  en?: LongformCopy;
}
