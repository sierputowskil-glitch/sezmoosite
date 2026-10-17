import type { LongformCopy, LongformDef } from '../types';

const storyPl1 = [
  { src: '/assets/portfolio/primespot/pjur-blue-story-1.jpg', alt: 'PrimeSpot Przystań Jurata – kreacja Instagram Stories 1' },
  { src: '/assets/portfolio/primespot/primespot-przystan-jurata-instagram-stories-01.jpg', alt: 'PrimeSpot Przystań Jurata – kreacja Instagram Stories 2' },
  { src: '/assets/portfolio/primespot/primespot-przystan-jurata-instagram-stories-02.png', alt: 'PrimeSpot Przystań Jurata – kreacja Instagram Stories 3' },
  { src: '/assets/portfolio/primespot/primespot-przystan-jurata-instagram-stories-03.png', alt: 'PrimeSpot Przystań Jurata – kreacja Instagram Stories 4' },
];
const storyPl2 = [
  { src: '/assets/portfolio/primespot/pjur-warm-story-1.jpg', alt: 'PrimeSpot Przystań Jurata – kreacja Instagram Stories 5' },
  { src: '/assets/portfolio/primespot/primespot-przystan-jurata-instagram-stories-04.png', alt: 'PrimeSpot Przystań Jurata – kreacja Instagram Stories 6' },
  { src: '/assets/portfolio/primespot/primespot-przystan-jurata-instagram-stories-05.png', alt: 'PrimeSpot Przystań Jurata – kreacja Instagram Stories 7' },
];
const storyEn1 = [
  { src: storyPl1[0].src, alt: 'PrimeSpot Przystań Jurata – Instagram Stories ad 1' },
  { src: storyPl1[1].src, alt: 'PrimeSpot Przystań Jurata – Instagram Stories ad 2' },
  { src: storyPl1[2].src, alt: 'PrimeSpot Przystań Jurata – Instagram Stories ad 3' },
  { src: storyPl1[3].src, alt: 'PrimeSpot Przystań Jurata – Instagram Stories ad 4' },
];
const storyEn2 = [
  { src: storyPl2[0].src, alt: 'PrimeSpot Przystań Jurata – Instagram Stories ad 5' },
  { src: storyPl2[1].src, alt: 'PrimeSpot Przystań Jurata – Instagram Stories ad 6' },
  { src: storyPl2[2].src, alt: 'PrimeSpot Przystań Jurata – Instagram Stories ad 7' },
];

const pl: LongformCopy = {
  title: 'PrimeSpot · Przystań Jurata · Kampania Meta Ads · Realizacja SEZMOO',
  description:
    'Case study SEZMOO: kampania Meta Ads dla inwestycji premium Przystań Jurata w Jastarni. Dwie linie kreatywne i pełen zestaw formatów: feed, 1:1, Stories 9:16 i 4:5.',
  schemaName: 'PrimeSpot · Przystań Jurata · Kampania Meta Ads',
  hero: {
    frame: true,
    image: '/assets/portfolio/primespot/pjur-blue-wide-1.jpg',
    alt: 'Kampania PrimeSpot Przystań Jurata: wieczorna wizualizacja inwestycji z hasłem Lokalizacja, która procentuje',
    hud: ['KAMPANIA · META ADS', 'GRAFIKA · FORMATY', 'NIERUCHOMOŚCI / PL'],
    cat: 'SEZMOO × PrimeSpot · Kampania nieruchomości',
    titleLead: 'Przystań<br>',
    titleAccent: 'Jurata.',
    sub: 'Kampania Meta Ads dla premium inwestycji <b>PrimeSpot</b> w Jastarni: dwie linie kreatywne i komplet formatów reklamowych, w których jedna produkcja pracuje spójnie na feedzie, w Stories i w reklamie.',
  },
  meta: [
    { k: 'Klient', v: 'PrimeSpot', small: 'Deweloper' },
    { k: 'Branża', v: 'Nieruchomości', small: 'Premium nad morzem' },
    { k: 'Format', v: 'Kampania', small: 'Meta Ads' },
    { k: 'Zakres', v: 'Grafika', small: 'KV · formaty · web' },
    { k: 'Rezultat', v: 'Przystań Jurata', small: 'Jastarnia' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'O projekcie',
      no: 'O PROJEKCIE',
      titleHtml: 'Jedna inwestycja,<br>komplet <span class="accent">formatów.</span>',
      paras: [
        'PrimeSpot to marka premium na rynku nieruchomości nadmorskich. Dla inwestycji <strong>Przystań Jurata</strong> w Jastarni przygotowaliśmy kampanię reklamową w mediach społecznościowych, opartą na wizualizacjach architektonicznych i eleganckim, spokojnym języku marki.',
        'Zamiast pojedynczej grafiki zbudowaliśmy pełen zestaw formatów Meta Ads i dwie linie kreatywne, tak aby ta sama produkcja pracowała spójnie na feedzie, w kwadracie, w Stories i w reklamie mobilnej, prowadząc odbiorcę do strony inwestycji.',
      ],
    },
    {
      type: 'stories',
      screen: 'Linie kreatywne',
      no: 'DWIE LINIE KREATYWNE',
      titleHtml: 'Ten sam projekt,<br>dwa nastroje.',
      name: 'primespot',
      spon: 'Sponsorowane',
      cta: 'Dowiedz się więcej',
      prev: 'Poprzednia',
      next: 'Następna',
      captions: ['Linia 1 · Stories', 'Linia 2 · Stories'],
      line1: storyPl1,
      line2: storyPl2,
      afterHtml:
        '<p><strong>Linia wieczorna</strong> gra elegancją i prestiżem: chłodny, granatowy render, delikatny neon marki i hasła „Lokalizacja, która procentuje” oraz „Przystań z widokiem na przyszłość”. <strong>Linia ciepła</strong> to wakacyjny spokój, złoty zachód nad Jastarnią, drewno i zaproszenie „Miejsce nad morzem”. Dwa tony, jedna spójna identyfikacja.</p>',
    },
    {
      type: 'steps',
      screen: 'Formaty',
      no: 'SYSTEM FORMATÓW',
      titleHtml: 'Jedna produkcja,<br>każdy kanał.',
      items: [
        { no: 'F, 01', title: 'Feed 1200 × 628', desc: 'Poziomy format linkowy pod reklamy na feedzie Facebooka i w Google Ads, z czytelnym hasłem i wyraźnym CTA.' },
        { no: 'F, 02', title: 'Kwadrat 1200 × 1200', desc: 'Format 1:1 pod feed Instagrama i Facebooka, z logo marki, hasłem i wizualizacją inwestycji.' },
        { no: 'F, 03', title: 'Stories 1080 × 1920', desc: 'Pionowy format 9:16 pod Stories i Reels, z pełnoekranowym renderem i CTA na dole kadru.' },
        { no: 'F, 04', title: 'Mobile 960 × 1200', desc: 'Format 4:5 maksymalizujący powierzchnię na feedzie mobilnym, gdzie ogląda większość odbiorców.' },
      ],
    },
    {
      type: 'adPosts',
      aria: 'Formaty kampanii',
      name: 'primespot',
      spon: 'Sponsorowane · Meta Ads',
      cta: 'Sprawdź ofertę',
      groups: [
        [{ src: '/assets/portfolio/primespot/pjur-blue-wide-2.jpg', alt: 'PrimeSpot Przystań Jurata: Przystań z widokiem na przyszłość, format feed 1200×628', caption: 'Feed · 1200 × 628', feed: true }],
        [
          { src: '/assets/portfolio/primespot/pjur-blue-square-1.jpg', alt: 'PrimeSpot: Lokalizacja, która procentuje, format 1:1', caption: 'Feed · 1:1' },
          { src: '/assets/portfolio/primespot/pjur-warm-square-1.jpg', alt: 'PrimeSpot: Miejsce nad morzem, zamieszkaj w Jastarni, format 1:1', caption: 'Feed · 1:1' },
        ],
        [{ src: '/assets/portfolio/primespot/pjur-warm-wide-1.jpg', alt: 'PrimeSpot: Miejsce nad morzem, Jastarnia, format feed 1200×628', caption: 'Feed · 1200 × 628', feed: true }],
        [
          { src: '/assets/portfolio/primespot/pjur-blue-45-2.jpg', alt: 'PrimeSpot: Przystań z widokiem na przyszłość, format mobilny 4:5', caption: 'Mobile · 4:5' },
          { src: '/assets/portfolio/primespot/pjur-warm-45-1.jpg', alt: 'PrimeSpot: Miejsce nad morzem, format mobilny 4:5', caption: 'Mobile · 4:5' },
        ],
      ],
    },
  ],
  quote: {
    text: 'Z jednej sesji wizualizacji zbudowaliśmy dwie linie kreatywne i pełen zestaw formatów Meta Ads, tak aby Przystań Jurata wyglądała spójnie wszędzie, od feedu po Stories.',
    by: '– <b>Zespół SEZMOO</b> · Grafika &amp; kampanie',
  },
  next: {
    href: '/portfolio/',
    aria: 'Wróć do portfolio',
    k: 'Zobacz więcej →',
    title: 'Portfolio',
    cat: 'Wszystkie realizacje SEZMOO',
    image: '/assets/portfolio/primespot/pjur-warm-wide-1.jpg',
    alt: 'PrimeSpot Przystań Jurata',
  },
};

const en: LongformCopy = {
  title: 'PrimeSpot · Przystań Jurata · Meta Ads campaign · SEZMOO case study',
  description:
    'SEZMOO case study: a Meta Ads campaign for the premium Przystań Jurata development in Jastarnia. Two creative lines and a full format set: feed, 1:1, Stories 9:16 and 4:5.',
  schemaName: 'PrimeSpot · Przystań Jurata · Meta Ads campaign',
  hero: {
    frame: true,
    image: pl.hero.image,
    alt: 'PrimeSpot Przystań Jurata campaign: evening visualisation of the development',
    hud: ['CAMPAIGN · META ADS', 'DESIGN · FORMATS', 'REAL ESTATE / PL'],
    cat: 'SEZMOO × PrimeSpot · Real-estate campaign',
    titleLead: 'Przystań<br>',
    titleAccent: 'Jurata.',
    sub: 'A Meta Ads campaign for the premium <b>PrimeSpot</b> development in Jastarnia: two creative lines and a full set of ad formats, where a single production works consistently across the feed, Stories and paid ads.',
  },
  meta: [
    { k: 'Client', v: 'PrimeSpot', small: 'Developer' },
    { k: 'Industry', v: 'Real estate', small: 'Seaside premium' },
    { k: 'Format', v: 'Campaign', small: 'Meta Ads' },
    { k: 'Scope', v: 'Design', small: 'KV · formats · web' },
    { k: 'Result', v: 'Przystań Jurata', small: 'Jastarnia' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'About',
      no: 'ABOUT THE PROJECT',
      titleHtml: 'One development,<br>every <span class="accent">format.</span>',
      paras: [
        'PrimeSpot is a premium brand on the seaside real-estate market. For the <strong>Przystań Jurata</strong> development in Jastarnia we produced a social-media ad campaign built on architectural visualisations and a calm, elegant brand voice.',
        'Instead of a single graphic we built a full set of Meta Ads formats and two creative lines, so the same production works consistently on the feed, in the square, in Stories and in mobile ads, leading the viewer to the investment page.',
      ],
    },
    {
      type: 'stories',
      screen: 'Creative lines',
      no: 'TWO CREATIVE LINES',
      titleHtml: 'Same project,<br>two moods.',
      name: 'primespot',
      spon: 'Sponsored',
      cta: 'Learn more',
      prev: 'Previous',
      next: 'Next',
      captions: ['Line 1 · Stories', 'Line 2 · Stories'],
      line1: storyEn1,
      line2: storyEn2,
      afterHtml:
        '<p>The <strong>evening line</strong> plays on elegance and prestige: a cool navy render, a subtle brand neon and headlines around location and the future. The <strong>warm line</strong> is holiday calm, a golden sunset over Jastarnia, timber and an invitation to a place by the sea. Two tones, one consistent identity.</p>',
    },
    {
      type: 'steps',
      screen: 'Formats',
      no: 'FORMAT SYSTEM',
      titleHtml: 'One production,<br>every channel.',
      items: [
        { no: 'F, 01', title: 'Feed 1200 × 628', desc: 'Horizontal link format for Facebook feed ads and Google Ads, with a clear headline and a strong CTA.' },
        { no: 'F, 02', title: 'Square 1200 × 1200', desc: 'A 1:1 format for the Instagram and Facebook feed, with the brand logo, headline and the visualisation.' },
        { no: 'F, 03', title: 'Stories 1080 × 1920', desc: 'A vertical 9:16 format for Stories and Reels, with a full-screen render and the CTA at the bottom of the frame.' },
        { no: 'F, 04', title: 'Mobile 960 × 1200', desc: 'A 4:5 format maximising screen space on the mobile feed, where most of the audience watches.' },
      ],
    },
    {
      type: 'adPosts',
      aria: 'Campaign formats',
      name: 'primespot',
      spon: 'Sponsored · Meta Ads',
      cta: 'Learn more',
      groups: [
        [{ src: '/assets/portfolio/primespot/pjur-blue-wide-2.jpg', alt: 'PrimeSpot Przystań Jurata, feed 1200×628', caption: 'Feed · 1200 × 628', feed: true }],
        [
          { src: '/assets/portfolio/primespot/pjur-blue-square-1.jpg', alt: 'PrimeSpot, 1:1 format', caption: 'Feed · 1:1' },
          { src: '/assets/portfolio/primespot/pjur-warm-square-1.jpg', alt: 'PrimeSpot, by the sea, 1:1 format', caption: 'Feed · 1:1' },
        ],
        [{ src: '/assets/portfolio/primespot/pjur-warm-wide-1.jpg', alt: 'PrimeSpot, by the sea, Jastarnia, feed 1200×628', caption: 'Feed · 1200 × 628', feed: true }],
        [
          { src: '/assets/portfolio/primespot/pjur-blue-45-2.jpg', alt: 'PrimeSpot, mobile 4:5 format', caption: 'Mobile · 4:5' },
          { src: '/assets/portfolio/primespot/pjur-warm-45-1.jpg', alt: 'PrimeSpot, by the sea, mobile 4:5 format', caption: 'Mobile · 4:5' },
        ],
      ],
    },
  ],
  quote: {
    text: 'From a single set of visualisations we built two creative lines and a full set of Meta Ads formats, so Przystań Jurata looks consistent everywhere, from the feed to Stories.',
    by: '– <b>SEZMOO team</b> · Design &amp; campaigns',
  },
  next: {
    href: '/en/portfolio-en/',
    aria: 'Back to portfolio',
    k: 'See more →',
    title: 'Portfolio',
    cat: 'All SEZMOO work',
    image: '/assets/portfolio/primespot/pjur-warm-wide-1.jpg',
    alt: 'PrimeSpot Przystań Jurata',
  },
};

export const primespot: LongformDef = { id: 'primespot', pl, en };
