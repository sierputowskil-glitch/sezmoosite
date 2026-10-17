/** Homepage PL + EN copy. Markup lives in `src/components/home/HomePage.astro`. */

export type HomeLang = 'pl' | 'en';
export type Html = string;
export type HomeWorkId = 'exlantix' | 'wow' | 'k2' | 'baltic' | 'doraco' | 'soho';
export type HomePillarIcon = 'film' | 'photo' | 'design' | 'social' | 'clock' | 'web';

export interface HomeCta {
  href: string;
  label: Html;
}

export interface HomeWorkCard {
  id: HomeWorkId;
  href: string;
  cats: string;
  alt: string;
  tc: string;
  live: Html;
  client: Html;
  cat: Html;
}

export interface HomePillar {
  href: string;
  delay?: number;
  icon: HomePillarIcon;
  title: Html;
  desc: Html;
  chips: string[];
}

export interface HomeFormatKit {
  hudLeft: Html;
  hudRight: Html;
  masterLabel: Html;
  splitLabel: Html;
  outs: { shape: string; ratio: Html; title: Html; p: Html }[];
  kick: Html;
  title: Html;
  p: Html;
  cta: HomeCta;
}

export interface HomeTeamMember {
  ini: string;
  src: string;
  alt: string;
  no: string;
  name: Html;
  role: Html;
}

export interface HomeProcessClip {
  no: string;
  name: Html;
  desc?: Html;
  dur: Html;
}

export interface HomeClientLogo {
  src: string;
  alt: string;
  k: string;
  kind: 'img' | 'svg';
}

export interface HomeTestimonial {
  q: Html;
  name: Html;
  av?: Html;
  avImg?: string;
}

export interface HomeCopy {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  jsonLdDescription: string;
  path: string;
  altHref: string;
  brandHref: string;
  hero: {
    hudLine1: Html;
    hudLine2: Html;
    eyebrow: Html;
    h1Lines: Html[];
    /** Short line inside `.hero__measure` (EN). */
    subInMeasure?: Html;
    subInMeasureStyle?: string;
    /** Long sub. PL stays inside measure; EN is a sibling — see HomePage. */
    subAfterMeasure?: Html;
    subAfterMeasureStyle?: string;
    subInMeasureLong?: Html;
    subInMeasureLongStyle?: string;
    showreelTitle: string;
    ctaPrimary: HomeCta;
    ctaSecondary: HomeCta;
  };
  work: {
    title: Html;
    titleLine?: boolean;
    index: Html;
    prevAria: string;
    nextAria: string;
    cards: HomeWorkCard[];
    more: HomeCta;
  };
  services: {
    title: Html;
    index: Html;
    formatKit?: HomeFormatKit;
    pillars: HomePillar[];
  };
  studio: {
    index: Html;
    eyebrow: Html;
    videoTitle: string;
    title: Html;
    paras: Html[];
    points: Html[];
  };
  team: {
    title: Html;
    index: Html;
    members: HomeTeamMember[];
  };
  process: {
    title: Html;
    titleLine?: boolean;
    index: Html;
    clips: HomeProcessClip[];
  };
  clients: {
    title: Html;
    index: Html;
    intro?: Html;
    marqueeLabel: string;
  };
  testimonials: {
    title: Html;
    index: Html;
    screenLabel: string;
    items: HomeTestimonial[];
  };
  contact: {
    title: Html;
    index: Html;
    screenLabel: string;
    eyebrow: Html;
    lead: Html;
    emailLabel: Html;
    phoneLabel: Html;
    studioLabel: Html;
    studioValue: Html;
  };
}

/** Cache-busted hero posters (brightness baked in). Preload both with media. */
export const SHOWREEL_POSTER_PRELOAD = '/assets/video/showreel-poster.webp?v=20261017b';
export const SHOWREEL_POSTER_MOBILE_PRELOAD = '/assets/video/showreel-poster-m.webp?v=20261017b';
export const STUDIO_VIDEO_ID = 'b_MB9qpw6jE';

const TEAM_BASE: Omit<HomeTeamMember, 'role'>[] = [
  { ini: 'MT', src: '/assets/team/maciej-tyma.png', alt: 'Maciej Tyma', no: 'T·01', name: 'Maciej Tyma' },
  { ini: 'HF', src: '/assets/team/hubert-fudala.png', alt: 'Hubert Fudała', no: 'T·02', name: 'Hubert Fudała' },
  { ini: 'RS', src: '/assets/team/radoslaw-schenk.png', alt: 'Radosław Schenk', no: 'T·03', name: 'Radosław Schenk' },
  { ini: 'KM', src: '/assets/team/kamil-mroz.png', alt: 'Kamil Mróz', no: 'T·04', name: 'Kamil Mróz' },
  { ini: 'OU', src: '/assets/team/olga-urbanska.png', alt: 'Olga Urbańska', no: 'T·05', name: 'Olga Urbańska' },
  {
    ini: 'ŁS',
    src: '/assets/team/lukasz-sierputowski.png',
    alt: 'Łukasz Sierputowski',
    no: 'T·06',
    name: 'Łukasz Sierputowski',
  },
  {
    ini: 'PW',
    src: '/assets/team/pawel-wyszomirski.png',
    alt: 'Paweł Wyszomirski',
    no: 'T·07',
    name: 'Paweł Wyszomirski',
  },
  { ini: 'DK', src: '/assets/team/dakar.png', alt: 'Dakar', no: 'T·08', name: 'Dakar' },
];

const TEAM_ROLES: Record<HomeLang, Html[]> = {
  pl: [
    'Founder · Fotograf i&nbsp;producent wideo',
    'Operator kamery i&nbsp;montażysta',
    'Operator kamery i&nbsp;montażysta',
    'Operator kamery i&nbsp;montażysta',
    'Project &amp; Digital Marketing Manager',
    'Grafik, web&nbsp;designer',
    'Reżyser',
    'Ochrona',
  ],
  en: [
    'Founder · Photographer &amp; Video Producer',
    'Camera Operator &amp; Video Editor',
    'Camera Operator &amp; Video Editor',
    'Camera Operator &amp; Video Editor',
    'Project &amp; Digital Marketing Manager',
    'Graphic &amp; Web Designer',
    'Director',
    'Security',
  ],
};

function team(lang: HomeLang): HomeTeamMember[] {
  return TEAM_BASE.map((m, i) => ({ ...m, role: TEAM_ROLES[lang][i] }));
}

export const HOME_CLIENTS: HomeClientLogo[] = [
  { src: '/assets/clients/audi-grupa-plichta.png', alt: 'Audi Grupa Plichta', k: '0.85', kind: 'img' },
  { src: '/assets/clients/byd-plichta.png', alt: 'BYD Plichta', k: '0.62', kind: 'img' },
  { src: '/assets/clients/netto.svg', alt: 'Netto', k: '1.05', kind: 'svg' },
  { src: '/assets/clients/omoda-jaecoo.svg', alt: 'Omoda & Jaecoo', k: '1.20', kind: 'svg' },
  { src: '/assets/clients/cherry.svg', alt: 'Cherry', k: '0.50', kind: 'svg' },
  { src: '/assets/clients/vls.svg', alt: 'VLS', k: '1.27', kind: 'svg' },
  { src: '/assets/clients/doraco.svg', alt: 'Doraco', k: '0.71', kind: 'svg' },
  { src: '/assets/clients/k2.svg', alt: 'K2', k: '1.70', kind: 'svg' },
  { src: '/assets/clients/baltic-towers.svg', alt: 'Baltic Towers', k: '1.70', kind: 'svg' },
  { src: '/assets/clients/q4rail.svg', alt: 'Q4rail', k: '0.92', kind: 'svg' },
  { src: '/assets/clients/crt.svg', alt: 'CRT', k: '1.25', kind: 'svg' },
  { src: '/assets/clients/2track.svg', alt: '2track', k: '1.50', kind: 'svg' },
  { src: '/assets/clients/life-dom-seniora.svg', alt: 'Life Dom Seniora', k: '1.21', kind: 'svg' },
];

const WORK_PL: HomeWorkCard[] = [
  {
    id: 'exlantix',
    href: '/realizacja-exlantix/',
    cats: 'eventy',
    alt: 'Premiera marki EXLANTIX w Gdańsku – event, fotografia i wideo',
    tc: 'TC 00:10:00',
    live: '▶ EVENT',
    client: 'EXLANTIX',
    cat: 'Premiera marki / Event',
  },
  {
    id: 'wow',
    href: '/realizacja-world-of-warships/',
    cats: 'eventy',
    alt: 'World of Warships',
    tc: 'TC 00:23:57',
    live: '▶ EVENT',
    client: 'World of Warships',
    cat: "Captain's Club / Event",
  },
  {
    id: 'k2',
    href: '/realizacja-k2/',
    cats: 'grafika',
    alt: 'Hodowla Ryb K2 – rebranding, strona WWW, zdjęcia i film z drona',
    tc: 'TC 00:14:02',
    live: '▶ CASE',
    client: 'Hodowla Ryb K2',
    cat: 'Rebranding / WWW / Dron',
  },
  {
    id: 'baltic',
    href: '/realizacja-baltic-towers-rekrutacja/',
    cats: 'video',
    alt: 'Baltic Towers – kampania rekrutacyjna, film i zdjęcia z produkcji',
    tc: 'TC 00:09:41',
    live: '▶ CASE',
    client: 'Baltic Towers',
    cat: 'Rekrutacja / Wideo / Foto',
  },
  {
    id: 'doraco',
    href: '/realizacja-doraco-hala-tvp/',
    cats: 'video',
    alt: 'DORACO – hala zdjęciowa TVP, film i zdjęcia z drona',
    tc: 'TC 00:09:41',
    live: '▶ CASE',
    client: 'DORACO × TVP',
    cat: 'Film / Foto / Dron',
  },
  {
    id: 'soho',
    href: '/realizacja-soho-form/',
    cats: 'grafika',
    alt: 'Soho Form – logo, księga znaku i strona internetowa',
    tc: 'TC 00:21:37',
    live: '▶ CASE',
    client: 'Soho Form',
    cat: 'Branding / Strona WWW',
  },
];

const WORK_EN: HomeWorkCard[] = [
  {
    id: 'exlantix',
    href: '/realizacja-exlantix/',
    cats: 'eventy',
    alt: 'EXLANTIX brand launch in Gdańsk – event, photo and video',
    tc: 'TC 00:10:00',
    live: '▶ EVENT',
    client: 'EXLANTIX',
    cat: 'Brand premiere / Event',
  },
  {
    id: 'wow',
    href: '/realizacja-world-of-warships/',
    cats: 'eventy',
    alt: 'World of Warships',
    tc: 'TC 00:23:57',
    live: '▶ EVENT',
    client: 'World of Warships',
    cat: "Captain's Club / Event",
  },
  {
    id: 'k2',
    href: '/en/realizacja-k2/',
    cats: 'grafika',
    alt: 'K2 Fish Farm – rebrand, website, photography and drone film',
    tc: 'TC 00:14:02',
    live: '▶ CASE',
    client: 'Hodowla Ryb K2',
    cat: 'Rebrand / Website / Drone',
  },
  {
    id: 'baltic',
    href: '/en/realizacja-baltic-towers-rekrutacja/',
    cats: 'video',
    alt: 'Baltic Towers – recruitment campaign, film and production photography',
    tc: 'TC 00:09:41',
    live: '▶ CASE',
    client: 'Baltic Towers',
    cat: 'Recruitment / Video / Photo',
  },
  {
    id: 'doraco',
    href: '/en/realizacja-doraco-hala-tvp/',
    cats: 'video',
    alt: 'DORACO – TVP studio hall, film and drone photography',
    tc: 'TC 00:09:41',
    live: '▶ CASE',
    client: 'DORACO × TVP',
    cat: 'Film / Photo / Drone',
  },
  {
    id: 'soho',
    href: '/en/realizacja-soho-form/',
    cats: 'grafika',
    alt: 'Soho Form – logo, brand manual and website',
    tc: 'TC 00:21:37',
    live: '▶ CASE',
    client: 'Soho Form',
    cat: 'Branding / Website',
  },
];

const SUB_LONG_STYLE_PL =
  'font-size:clamp(15px,1.15vw,18px);color:var(--fg-dim);max-width:100%;margin-top:16px;line-height:1.6';
const SUB_LONG_STYLE_EN =
  'font-size:clamp(15px,1.15vw,18px);color:var(--fg-dim);max-width:min(100%,calc(10.2 * clamp(34px,6.2vw,112px)));margin-top:16px;line-height:1.6';

export const HOME: Record<HomeLang, HomeCopy> = {
  pl: {
    title: 'SEZMOO · produkcja wideo, content i kampanie dla marek | Gdańsk',
    description:
      'SEZMOO to studio wideo i contentu z Gdańska. Kręcimy filmy reklamowe, materiały na social media, animacje 3D/2D i kampanie, które budują widoczność marki, od pomysłu po gotowe formaty.',
    keywords:
      'produkcja wideo Gdańsk, filmy reklamowe, content na social media, produkcja filmowa, animacje 3D, kampanie reklamowe, studio wideo',
    ogTitle: 'SEZMOO · produkcja wideo, content i kampanie dla marek',
    ogDescription:
      'Studio wideo i contentu z Gdańska. Filmy reklamowe, materiały na social media, animacje i kampanie, które budują widoczność marki.',
    jsonLdDescription:
      'Studio wideo i contentu z Gdańska. Produkcja filmów reklamowych, materiałów na social media, animacji 3D/2D i kampanii dla marek.',
    path: '/',
    altHref: '/en/',
    brandHref: '/#hero',
    hero: {
      hudLine1: 'SEZMOO / AGENCJA KREATYWNA',
      hudLine2: '4K · 25FPS · GDAŃSK / PL',
      eyebrow: 'Showreel 2026',
      h1Lines: [
        'Od pomysłu',
        'po <em class="accent" style="font-style:normal">realizację.</em>',
      ],
      subInMeasureLong:
        'Łączymy <b>produkcję filmową i&nbsp;fotografię</b>, <b>content do&nbsp;social media</b> oraz <b>komunikację wizualną offline i&nbsp;online</b>. Jesteśmy z&nbsp;Gdańska, ale&nbsp;realizacje wykonujemy w&nbsp;całym kraju i&nbsp;za&nbsp;granicą.',
      subInMeasureLongStyle: SUB_LONG_STYLE_PL,
      showreelTitle: 'SEZMOO showreel',
      ctaPrimary: { href: '/portfolio/', label: 'Zobacz portfolio' },
      ctaSecondary: { href: '#kontakt', label: 'Porozmawiajmy' },
    },
    work: {
      title: 'Wybrane <span style="color:#ffd200">projekty.</span>',
      titleLine: true,
      index: 'PORTFOLIO',
      prevAria: 'Poprzednie realizacje',
      nextAria: 'Kolejne realizacje',
      cards: WORK_PL,
      more: { href: '/portfolio/', label: 'Zobacz całe portfolio' },
    },
    services: {
      title: 'Nasze <span style="color:#ffd200">usługi.</span>',
      index: 'PRODUKCJA CONTENTU',
      pillars: [
        {
          href: '/uslugi-marketingowe/produkcja-wideo-reels/',
          icon: 'film',
          title: 'Produkcja filmowa<br />i&nbsp;motion design',
          desc: 'Produkcja wideo reklamowego, rolek i&nbsp;animacji 2D. Kręcimy, animujemy i&nbsp;eksportujemy w&nbsp;formatach pod&nbsp;kampanie i&nbsp;social media.',
          chips: ['wideo', 'spoty', 'reels', 'dron', 'motion'],
        },
        {
          href: '/uslugi-marketingowe/fotografia/',
          delay: 1,
          icon: 'photo',
          title: 'Fotografia',
          desc: 'Sesje produktowe, wizerunkowe i&nbsp;eventowe. Od&nbsp;sesji w&nbsp;studio po&nbsp;reportaż z&nbsp;wydarzenia –&nbsp;zdjęcia gotowe do&nbsp;kampanii i&nbsp;social media.',
          chips: ['produkt', 'wizerunek', 'event', 'studio'],
        },
        {
          href: '/uslugi-marketingowe/projektowanie-graficzne/',
          delay: 2,
          icon: 'design',
          title: 'Grafika i&nbsp;branding',
          desc: 'Logotypy, key visuale i&nbsp;grafika do&nbsp;social mediów. Materiały reklamowe, katalogi i&nbsp;projekty WWW –&nbsp;od&nbsp;projektu po&nbsp;realizację.',
          chips: ['logo', 'KV', 'katalogi', 'WWW'],
        },
        {
          href: '/uslugi-marketingowe/obsluga-social-media/',
          delay: 3,
          icon: 'social',
          title: 'Social media',
          desc: 'Strategia contentu, publikacje i&nbsp;prowadzenie profili oraz kampanie płatne –&nbsp;od&nbsp;strategii po&nbsp;codzienną obecność.',
          chips: ['strategia', 'publikacje', 'kampanie'],
        },
        {
          href: '/uslugi-marketingowe/#lista-uslug',
          delay: 4,
          icon: 'clock',
          title: 'Abonament i&nbsp;stała współpraca',
          desc: 'Stały pakiet godzin produkcyjnych w&nbsp;miesiącu –&nbsp;Ty decydujesz, na&nbsp;co je&nbsp;przeznaczyć. Raz wideo, raz sesja foto, raz grafika. Jeden zespół, elastycznie dopasowany do&nbsp;bieżących potrzeb marki.',
          chips: ['godziny', 'elastycznie', 'zespół'],
        },
      ],
    },
    studio: {
      index: 'STUDIO',
      eyebrow: 'Dlaczego SEZMOO',
      videoTitle: 'SEZMOO · zespół',
      title: 'Poznaj <span class="accent">SEZMOO.</span>',
      paras: [
        'Agencja kreatywna SEZMOO –&nbsp;produkcja wideo, social media, branding i&nbsp;reklama.',
        'Jesteśmy z&nbsp;Gdańska, ale&nbsp;realizacje wykonujemy w&nbsp;całym kraju i&nbsp;za&nbsp;granicą.',
        'Film, fotografia, grafika, digital i&nbsp;produkcja offline powstają w&nbsp;jednym zespole. Dzięki temu łatwiej zachować spójność, sprawniej reagować na&nbsp;zmiany i&nbsp;prowadzić projekt od&nbsp;pierwszego pomysłu do&nbsp;gotowego wdrożenia.',
        'Działamy projektowo, przy&nbsp;pojedynczych realizacjach, ale&nbsp;też abonamentowo, gdy&nbsp;marka potrzebuje stałej produkcji.',
      ],
      points: [
        '14 lat na&nbsp;rynku.',
        'Własny sprzęt filmowy i&nbsp;zaplecze produkcyjne.',
        'Stały zespół.',
        'Jesteśmy z&nbsp;Gdańska, ale&nbsp;realizacje wykonujemy w&nbsp;całym kraju i&nbsp;za&nbsp;granicą.',
      ],
    },
    team: { title: 'Zespół.', index: 'ZESPÓŁ', members: team('pl') },
    process: {
      title: 'Tak wygląda współpraca z&nbsp;<span style="color:#ffd200">SEZMOO.</span>',
      titleLine: true,
      index: 'PROCES',
      clips: [
        { no: 'V1 · 01', name: 'Brief', desc: 'Ustalamy cel, zakres i&nbsp;Twoje potrzeby.', dur: '0:00 → 0:12' },
        {
          no: 'V1 · 02',
          name: 'Koncepcja',
          desc: 'Budujemy pomysł i&nbsp;dobieramy odpowiednie rozwiązania.',
          dur: '0:12 → 0:24',
        },
        { no: 'V1 · 03', name: 'Produkcja', desc: 'Realizujemy ustalony zakres projektu.', dur: '0:24 → 0:36' },
        {
          no: 'V1 · 04',
          name: 'Postprodukcja',
          desc: 'Montaż, retusz, animacja lub&nbsp;finalny skład.',
          dur: '0:36 → 0:48',
        },
        {
          no: 'V1 · 05',
          name: 'Wdrożenie',
          desc: 'Przekazujemy gotowe materiały lub&nbsp;zajmujemy się ich publikacją.',
          dur: '0:48 → END',
        },
      ],
    },
    clients: {
      title: '<span style="color:#ffd200">Marki,</span> z&nbsp;którymi pracujemy.',
      index: 'KLIENCI',
      intro:
        'Nie zbieramy „klientów”. Budujemy współpracę. Szukamy rozwiązań, które wspierają rozwój marki: nie tylko dobrze wyglądają, ale też mają sens w komunikacji i w biznesie. Nie zamykamy się na jedną branżę. Różnorodność projektów napędza nas najbardziej i widać ją w portfolio.',
      marqueeLabel: 'Marki, z którymi pracujemy · klienci',
    },
    testimonials: {
      title: 'Co mówią<br />nasi <span style="color:#ffd200">klienci.</span>',
      index: 'OPINIE',
      screenLabel: 'Opinie',
      items: [
        {
          q: 'SEZMOO rozumie obraz i tempo social mediów. Materiały dostaliśmy na czas i dokładnie w stylu, jakiego potrzebowaliśmy.',
          name: 'Audi Grupa Plichta',
          av: 'AP',
        },
        {
          q: 'Profesjonalne podejście od briefu po montaż. Film employer brandingowy realnie pomógł nam w rekrutacji.',
          name: 'Baltic Towers',
          av: 'BT',
        },
        {
          q: 'Kreatywni, szybcy i konkretni. Współpraca, do której chętnie wracamy przy kolejnych projektach.',
          name: '33 indeed',
          avImg: '/assets/clients/33-indeed.avif',
        },
      ],
    },
    contact: {
      title: 'Zacznijmy rozmowę<br />o&nbsp;<span style="color:var(--rec)">Twojej marce.</span>',
      index: 'KONTAKT',
      screenLabel: 'Kontakt',
      eyebrow: 'Gotowy do&nbsp;działania?',
      lead: 'Odezwij się do&nbsp;nas –&nbsp;napisz, czego potrzebujesz. Odpowiadamy w&nbsp;ciągu 24h.',
      emailLabel: 'E-mail',
      phoneLabel: 'Telefon',
      studioLabel: 'Studio',
      studioValue: 'Zeusa 34, 80-299 Gdańsk',
    },
  },
  en: {
    title: 'SEZMOO · video, content & campaigns for brands | Gdańsk',
    description:
      'SEZMOO is a video and content studio from Gdańsk, Poland. We produce commercials, social media content, 2D/3D animation and campaigns that build brand visibility, from concept to ready-to-publish formats.',
    keywords:
      'video production Gdansk, brand films, social media content, film production, 3D animation, advertising campaigns, video studio Poland',
    ogTitle: 'SEZMOO · video, content & campaigns for brands',
    ogDescription:
      'Video and content studio from Gdańsk. Commercials, social media content, animation and campaigns that build brand visibility.',
    jsonLdDescription:
      'Video and content studio from Gdańsk. Commercials, social media content, 2D/3D animation and campaigns for brands.',
    path: '/en/',
    altHref: '/',
    brandHref: '/en/#hero',
    hero: {
      hudLine1: 'SEZMOO / CREATIVE AGENCY',
      hudLine2: '4K · 25FPS · GDAŃSK / PL',
      eyebrow: 'Showreel 2026',
      h1Lines: ['From idea', 'to <em class="accent" style="font-style:normal">delivery.</em>'],
      subInMeasure: 'Films, social media, graphics and physical production for brands that want to be seen.',
      subAfterMeasure:
        'We work end to end – from concept to finished materials ready to use in campaigns and on site. We combine <b>film production and photography</b>, <b>social media content</b> and <b>offline and online visual communication.</b> We are based in Gdańsk, but we deliver projects across the country and abroad.',
      subAfterMeasureStyle: SUB_LONG_STYLE_EN,
      showreelTitle: 'SEZMOO showreel',
      ctaPrimary: { href: '/en/portfolio-en/', label: 'See portfolio' },
      ctaSecondary: { href: '#kontakt', label: 'Let’s talk' },
    },
    work: {
      title: 'Our <span style="color:#ffd200">projects.</span><br />Recent months.',
      index: 'OUR PROJECTS',
      prevAria: 'Previous work',
      nextAria: 'Next work',
      cards: WORK_EN,
      more: { href: '/en/portfolio-en/', label: 'See full portfolio' },
    },
    services: {
      title: 'Our <span style="color:#ffd200">services.</span>',
      index: 'CONTENT SYSTEM',
      formatKit: {
        hudLeft: '<span class="dot"></span>1 shoot',
        hudRight: '4K · 25FPS · Gdańsk',
        masterLabel: 'MASTER · on set',
        splitLabel: 'one shoot → 4 formats',
        outs: [
          { shape: 's-169', ratio: '16:9', title: 'Hero film', p: 'Website, YouTube, decks' },
          { shape: 's-916', ratio: '9:16', title: 'Reels / Shorts', p: 'Reels, TikTok, Shorts' },
          { shape: 's-11', ratio: '1:1', title: 'Social ads', p: 'Paid campaigns' },
          { shape: 's-ban', ratio: 'Billboards / Web', title: 'Campaign creative', p: 'Banners, thumbnails, KV' },
        ],
        kick: 'What you get',
        title: 'We never stop<br />at one film.',
        p: 'From the footage shot on set we build a full publishing kit: spots, reels, graphics, ad formats, thumbnails, landing pages and campaign design. Video is the backbone; the rest makes the content work across every channel.',
        cta: { href: '/en/services/', label: 'Plan production' },
      },
      pillars: [
        {
          href: '/en/services/video-production-reels/',
          icon: 'film',
          title: 'Film production &amp; motion design',
          desc: 'Commercials, reels, event coverage, drone, editing and animation, from shoot to final export.',
          chips: ['video', 'spoty', 'reels', 'event recap', 'motion / 3D'],
        },
        {
          href: '/en/services/social-media-management/',
          delay: 1,
          icon: 'social',
          title: 'Social &amp; campaign content',
          desc: 'Ongoing production of formats for social media, paid campaigns, launches, promotions and sales communication.',
          chips: ['content plan', 'ads', 'launch', 'formaty 9:16 / 1:1'],
        },
        {
          href: '/en/services/graphic-design/',
          delay: 2,
          icon: 'design',
          title: 'Design &amp; brand materials',
          desc: 'Graphics, key visuals, catalogues, banners, billboards, print and offline visual communication.',
          chips: ['KV', 'banery', 'print', 'social assets'],
        },
        {
          href: '/en/services/websites-and-landing-pages/',
          delay: 3,
          icon: 'web',
          title: 'Web &amp; digital support',
          desc: 'Landing pages, campaign sites and digital support that ties the content publishing together.',
          chips: ['landing', 'WWW', 'formularze', 'kampanie digital'],
        },
      ],
    },
    studio: {
      index: 'STUDIO',
      eyebrow: 'Why SEZMOO',
      videoTitle: 'SEZMOO team',
      title: 'One team.<br /><span class="accent">Full brand communication.</span>',
      paras: [
        'SEZMOO is a creative agency with 14 years of marketing experience, based in Gdańsk. We bring every key marketing area together in one place – from photo and video production, through graphic and web design, to online marketing (social media and paid campaigns) and offline marketing with our own production. As a creative team we work project by project, but we also offer a retainer model – for brands that need ongoing production. That lets us run projects end to end: from idea and creative to finished materials rolled out in digital and in the real world.',
      ],
      points: ['We think in channels.', 'We produce efficiently.', 'We deliver the whole campaign.'],
    },
    team: { title: 'Team.', index: 'TEAM', members: team('en') },
    process: {
      title: 'How we edit<br />the <span style="color:#ffd200">collaboration.</span>',
      index: 'PROCESS',
      clips: [
        { no: 'V1 · 01', name: 'Brief', dur: '0:00 → 0:12' },
        { no: 'V1 · 02', name: 'Concept', dur: '0:12 → 0:24' },
        { no: 'V1 · 03', name: 'Production', dur: '0:24 → 0:36' },
        { no: 'V1 · 04', name: 'Post-production', dur: '0:36 → 0:48' },
        { no: 'V1 · 05', name: 'Publishing', dur: '0:48 → END' },
      ],
    },
    clients: {
      title: '<span style="color:#ffd200">Trusted</span> by.',
      index: 'CLIENTS',
      marqueeLabel: 'Trusted by · clients',
    },
    testimonials: {
      title: 'What our<br /><span style="color:#ffd200">clients</span> say.',
      index: 'TESTIMONIALS',
      screenLabel: 'Opinie',
      items: [
        {
          q: 'SEZMOO understands visuals and the pace of social media. We got the assets on time and exactly in the style we needed.',
          name: 'Audi Grupa Plichta',
          av: 'AP',
        },
        {
          q: 'A professional approach from brief to edit. The employer-branding film genuinely helped us with recruitment.',
          name: 'Baltic Towers',
          av: 'BT',
        },
        {
          q: 'Creative, fast and to the point. A partnership we happily return to for new projects.',
          name: '33 indeed',
          avImg: '/assets/clients/33-indeed.avif',
        },
      ],
    },
    contact: {
      title: 'Let’s make it<br />good <span style="color:var(--rec)">content.</span>',
      index: 'CONTACT',
      screenLabel: 'Kontakt',
      eyebrow: "Let's roll",
      lead: 'Got a brand, product or campaign to show? Tell us what you need, we reply within 24h.',
      emailLabel: 'E-mail',
      phoneLabel: 'Phone',
      studioLabel: 'Studio',
      studioValue: 'Zeusa 34, 80-299 Gdańsk',
    },
  },
};

export function homeCopy(lang: HomeLang): HomeCopy {
  return HOME[lang];
}

export function homePath(lang: HomeLang): string {
  return HOME[lang].path;
}
