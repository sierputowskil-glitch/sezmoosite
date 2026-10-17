import type { LongformCopy, LongformDef } from '../types';

const gallery = {
  aria: { pl: 'FOTOGRAFIA', en: 'PHOTOGRAPHY' },
  rows: [
    {
      shots: [
        {
          src: '/assets/portfolio/baltic-towers-foto/baltic-towers-fotografia-przemyslowa-produkcja-03.jpg',
          alt: { pl: 'Segmenty wież wiatrowych w hali Baltic Towers', en: 'Wind tower segments inside the Baltic Towers hall' },
          tag: { pl: 'Foto · Produkcja', en: 'Photo · Production' },
          ratio: '16/9',
        },
      ],
    },
    {
      split: true,
      shots: [
        {
          src: '/assets/portfolio/baltic-towers-foto/baltic-towers-fotografia-przemyslowa-produkcja-04.jpg',
          alt: { pl: 'Spawanie na produkcji Baltic Towers – zdjęcie do kampanii rekrutacyjnej', en: 'Welding at Baltic Towers – recruitment campaign photo' },
          tag: { pl: 'Foto · Proces', en: 'Photo · Process' },
          ratio: '4/3',
        },
        {
          src: '/assets/portfolio/baltic-towers-foto/baltic-towers-fotografia-przemyslowa-produkcja-05.jpg',
          alt: { pl: 'Wnętrze fabryki Baltic Towers w Gdańsku', en: 'Inside the Baltic Towers factory in Gdańsk' },
          tag: { pl: 'Foto · Fabryka', en: 'Photo · Factory' },
          ratio: '4/3',
          delay: true,
        },
      ],
    },
    {
      split: true,
      shots: [
        {
          src: '/assets/portfolio/baltic-towers-foto/baltic-towers-fotografia-przemyslowa-produkcja-02.jpg',
          alt: { pl: 'Pracownik Baltic Towers przy produkcji – fotografia przemysłowa', en: 'Baltic Towers worker on the production line – industrial photography' },
          tag: { pl: 'Foto · Ludzie', en: 'Photo · People' },
          ratio: '4/3',
        },
        {
          src: '/assets/portfolio/baltic-towers-foto/baltic-towers-fotografia-przemyslowa-produkcja-01.jpg',
          alt: { pl: 'Hala produkcyjna Baltic Towers – produkcja segmentów wież wiatrowych', en: 'Baltic Towers production hall – wind tower segments' },
          tag: { pl: 'Foto · Hala', en: 'Photo · Hall' },
          ratio: '4/3',
          delay: true,
        },
      ],
    },
  ],
} as const;

function shots(lang: 'pl' | 'en') {
  return gallery.rows.map((row) => ({
    split: 'split' in row ? row.split : undefined,
    shots: row.shots.map((s) => ({
      src: s.src,
      alt: s.alt[lang],
      tag: s.tag[lang],
      ratio: s.ratio,
      delay: 'delay' in s ? s.delay : undefined,
    })),
  }));
}

const pl: LongformCopy = {
  title: 'Baltic Towers · Kampania rekrutacyjna · Realizacja SEZMOO',
  description:
    'Case study SEZMOO: kampania rekrutacyjna Baltic Towers – film do social mediów i zdjęcia z produkcji wież wiatrowych.',
  schemaName: 'Baltic Towers · Kampania rekrutacyjna',
  hero: {
    image: '/assets/portfolio/baltic-towers-foto/baltic-towers-fotografia-przemyslowa-produkcja-01.jpg',
    alt: 'Hala produkcyjna Baltic Towers – kampania rekrutacyjna',
    hud: ['REKRUTACJA · WIDEO', 'FOTO · SOCIAL', 'PRZEMYSŁ / PL'],
    cat: 'SEZMOO × Baltic Towers · Kampania rekrutacyjna',
    titleLead: 'Baltic<br>',
    titleAccent: 'Towers.',
    sub: 'Kampania rekrutacyjna dla <b>Baltic Towers</b> –&nbsp;producenta wież wiatrowych z&nbsp;Gdańska. Film do&nbsp;social mediów i&nbsp;zdjęcia z&nbsp;hali produkcyjnej, które pokazują pracę taką, jaka jest naprawdę.',
  },
  meta: [
    { k: 'Klient', v: 'Baltic Towers', small: 'Wieże wiatrowe' },
    { k: 'Branża', v: 'Przemysł', small: 'Offshore · Energetyka' },
    { k: 'Format', v: 'Kampania', small: 'Rekrutacja' },
    { k: 'Zakres', v: 'Wideo + foto', small: 'Social media' },
    { k: 'Cel', v: 'Nowi pracownicy', small: 'Produkcja' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'O PROJEKCIE',
      no: 'O PROJEKCIE',
      titleHtml: 'Praca, którą<br>warto <span class="accent">zobaczyć.</span>',
      paras: [
        'Baltic Towers buduje jedną z&nbsp;największych fabryk wież wiatrowych w&nbsp;Polsce i&nbsp;potrzebuje ludzi na&nbsp;produkcję: spawaczy, operatorów, monterów. Ogłoszenie z&nbsp;listą wymagań nie&nbsp;wystarczy, żeby ich przekonać.',
        'Postawiliśmy na&nbsp;prawdziwy obraz: hala, maszyny, skala elementów i&nbsp;ludzie, którzy już tam pracują. Krótki, pionowy film do&nbsp;social mediów i&nbsp;seria zdjęć, które firma wykorzystuje w&nbsp;ogłoszeniach i&nbsp;na&nbsp;stronie kariery.',
      ],
    },
    {
      type: 'steps',
      screen: 'PODEJŚCIE',
      padTop0: true,
      no: 'PODEJŚCIE',
      titleHtml: 'Od hali<br>do&nbsp;<span class="accent">feedu.</span>',
      items: [
        { no: 'W1, 01', title: 'Koncepcja', desc: 'Format pionowy, krótki i&nbsp;dynamiczny –&nbsp;pod Instagram, Facebook i&nbsp;TikTok, gdzie szuka się dziś pracowników.' },
        { no: 'W1, 02', title: 'Zdjęcia na&nbsp;produkcji', desc: 'Nagrania i&nbsp;foto bez zatrzymywania pracy hali –&nbsp;z&nbsp;zachowaniem zasad BHP zakładu.' },
        { no: 'W1, 03', title: 'Montaż', desc: 'Rytm cięć dopasowany do&nbsp;social mediów, napisy i&nbsp;jasny komunikat: dołącz do&nbsp;zespołu.' },
        { no: 'W1, 04', title: 'Foto do&nbsp;ogłoszeń', desc: 'Zdjęcia ludzi i&nbsp;procesu do&nbsp;ogłoszeń, kampanii płatnych i&nbsp;zakładki kariery.' },
      ],
    },
    {
      type: 'film',
      screen: 'FILM REKRUTACYJNY',
      no: 'FILM REKRUTACYJNY',
      titleHtml: 'Krótko, pionowo,<br><span class="accent">konkretnie.</span>',
      lead: 'Film, który w&nbsp;kilkanaście sekund pokazuje skalę fabryki i&nbsp;charakter pracy. Gotowy do&nbsp;publikacji i&nbsp;promowania w&nbsp;kampaniach rekrutacyjnych.',
      videoId: 'eBcPwtZ0eOk',
      poster: '/assets/portfolio/baltic-towers-foto/baltic-towers-fotografia-przemyslowa-produkcja-02.jpg',
      alt: 'Odtwórz film rekrutacyjny Baltic Towers',
      recLabel: 'BALTIC TOWERS, REKRUTACJA',
      short: true,
    },
    {
      type: 'heading',
      screen: 'FOTOGRAFIA',
      padBottom0: true,
      no: 'FOTOGRAFIA',
      titleHtml: 'Ludzie i&nbsp;skala<br>produkcji.',
    },
    { type: 'gallery', aria: gallery.aria.pl, rows: shots('pl') },
  ],
  quote: {
    text: 'Rekrutacja zaczyna się od&nbsp;obrazu. Pokazaliśmy fabrykę tak, żeby ludzie chcieli w&nbsp;niej pracować.',
    by: '– <b>Zespół SEZMOO</b> · Wideo, foto i&nbsp;social media',
  },
  next: {
    href: '/portfolio/',
    aria: 'Wróć do portfolio',
    k: 'Zobacz więcej →',
    title: 'Portfolio',
    cat: 'Wszystkie realizacje SEZMOO',
    image: '/assets/portfolio/baltic-towers-foto/baltic-towers-fotografia-przemyslowa-produkcja-03.jpg',
    alt: '',
  },
};

const en: LongformCopy = {
  title: 'Baltic Towers · Recruitment campaign · SEZMOO case study',
  description:
    'SEZMOO case study: Baltic Towers recruitment campaign – a social media film and photography from wind tower production.',
  schemaName: 'Baltic Towers · Recruitment campaign',
  hero: {
    image: pl.hero.image,
    alt: 'Baltic Towers production hall – recruitment campaign',
    hud: ['RECRUITMENT · VIDEO', 'PHOTO · SOCIAL', 'INDUSTRY / PL'],
    cat: 'SEZMOO × Baltic Towers · Recruitment campaign',
    titleLead: 'Baltic<br>',
    titleAccent: 'Towers.',
    sub: 'A recruitment campaign for <b>Baltic Towers</b>, a wind tower manufacturer in Gdańsk. A social media film and production-floor photography that show the work as it really is.',
  },
  meta: [
    { k: 'Client', v: 'Baltic Towers', small: 'Wind towers' },
    { k: 'Industry', v: 'Manufacturing', small: 'Offshore · Energy' },
    { k: 'Format', v: 'Campaign', small: 'Recruitment' },
    { k: 'Scope', v: 'Video + photo', small: 'Social media' },
    { k: 'Goal', v: 'New hires', small: 'Production' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'PROJECT',
      no: 'PROJECT',
      titleHtml: 'Work worth<br><span class="accent">seeing.</span>',
      paras: [
        'Baltic Towers is building one of the largest wind tower factories in Poland and needs people on the floor: welders, operators, fitters. A job ad with a list of requirements is not enough to win them over.',
        'We went for the real picture: the hall, the machines, the scale of the parts and the people who already work there. A short vertical film for social media and a photo series the company uses in job ads and on its careers page.',
      ],
    },
    {
      type: 'steps',
      screen: 'THE APPROACH',
      padTop0: true,
      no: 'THE APPROACH',
      titleHtml: 'From the factory floor<br>to the <span class="accent">feed.</span>',
      items: [
        { no: 'W1, 01', title: 'Concept', desc: 'Short, vertical and dynamic – made for Instagram, Facebook and TikTok, where people look for jobs today.' },
        { no: 'W1, 02', title: 'Shooting on site', desc: 'Filming and photography without stopping production, following the plant’s safety rules.' },
        { no: 'W1, 03', title: 'Edit', desc: 'Social-first pacing, captions and a clear message: join the team.' },
        { no: 'W1, 04', title: 'Photos for ads', desc: 'Pictures of people and process for job ads, paid campaigns and the careers page.' },
      ],
    },
    {
      type: 'film',
      screen: 'RECRUITMENT FILM',
      no: 'RECRUITMENT FILM',
      titleHtml: 'Short, vertical,<br><span class="accent">to the point.</span>',
      lead: 'A film that shows the scale of the factory and the nature of the job in a few seconds. Ready to publish and promote in recruitment campaigns.',
      videoId: 'eBcPwtZ0eOk',
      poster: pl.blocks.find((b) => b.type === 'film')!.poster,
      alt: 'Play the Baltic Towers recruitment film',
      recLabel: 'BALTIC TOWERS, RECRUITMENT',
      short: true,
    },
    {
      type: 'heading',
      screen: 'PHOTOGRAPHY',
      padBottom0: true,
      no: 'PHOTOGRAPHY',
      titleHtml: 'People and the scale<br>of production.',
    },
    { type: 'gallery', aria: gallery.aria.en, rows: shots('en') },
  ],
  quote: {
    text: 'Recruitment starts with a picture. We showed the factory so that people want to work there.',
    by: '– <b>SEZMOO team</b> · Video, photo and social media',
  },
  next: {
    href: '/en/portfolio-en/',
    aria: 'Back to portfolio',
    k: 'See more →',
    title: 'Portfolio',
    cat: 'All SEZMOO work',
    image: '/assets/portfolio/baltic-towers-foto/baltic-towers-fotografia-przemyslowa-produkcja-03.jpg',
    alt: '',
  },
};

export const balticTowersRekrutacja: LongformDef = {
  id: 'baltic-towers-rekrutacja',
  pl,
  en,
};
