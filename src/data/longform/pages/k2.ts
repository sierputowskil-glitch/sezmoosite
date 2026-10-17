import type { LongformCopy, LongformDef } from '../types';

const contain = 'position:static;width:42%;height:auto;inset:auto;object-fit:contain';
const containNew = 'position:static;width:46%;height:auto;inset:auto;object-fit:contain';
const scrollImg = 'position:static;width:100%;height:auto;object-fit:initial';

const pl: LongformCopy = {
  title: 'Hodowla Ryb K2 · Rebranding, strona WWW, foto i dron · Realizacja SEZMOO',
  description:
    'Case study SEZMOO: odświeżenie logo, księga znaku, nowa strona internetowa, zdjęcia, film z drona i szablon prezentacji dla Hodowli Ryb K2 – producenta pstrąga tęczowego.',
  schemaName: 'Hodowla Ryb K2 · Rebranding, strona WWW, foto i dron',
  hero: {
    image: '/assets/portfolio/k2/k2-hodowla-pstraga-zdjecie-z-drona-baseny.webp',
    alt: 'Hodowla pstrąga K2 z lotu ptaka – baseny hodowlane wśród lasów, zdjęcie z drona',
    hud: ['REBRANDING · WWW', 'FOTO · DRON', 'AKWAKULTURA / PL'],
    cat: 'SEZMOO × Hodowla Ryb K2 · Odświeżenie marki',
    titleLead: 'Hodowla<br>',
    titleAccent: 'Ryb K2.',
    sub: 'Odświeżone logo, księga znaku, nowa strona internetowa, zdjęcia, film z&nbsp;drona i&nbsp;szablon prezentacji dla <b>Hodowli Ryb K2</b> –&nbsp;jednego z&nbsp;największych producentów pstrąga tęczowego w&nbsp;Polsce.',
  },
  meta: [
    { k: 'Klient', v: 'Hodowla Ryb K2', small: 'Jacek Juchniewicz' },
    { k: 'Branża', v: 'Akwakultura', small: 'Pstrąg tęczowy' },
    { k: 'Format', v: 'Rebranding', small: 'Odświeżenie wizerunku' },
    { k: 'Zakres', v: 'Full-service', small: 'Logo · WWW · Foto · Dron' },
    { k: 'Online', v: 'hodowlak2.pl ↗', small: 'Strona na żywo', href: 'https://hodowlak2.pl/' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'O PROJEKCIE',
      no: 'O PROJEKCIE',
      titleHtml: 'Lider rynku,<br>który wygląda <span class="accent">jak lider.</span>',
      paras: [
        'K2 od&nbsp;lat jest w&nbsp;ścisłej czołówce producentów pstrąga w&nbsp;Polsce –&nbsp;z&nbsp;własną wylęgarnią, transportem i&nbsp;rodzinną tradycją. Pozycji na&nbsp;rynku nie&nbsp;trzeba było budować. Trzeba było ją&nbsp;pokazać.',
        'Stare logo i&nbsp;strona nie&nbsp;nadążały za&nbsp;skalą firmy. Odświeżyliśmy znak, opisaliśmy go w&nbsp;księdze znaku, zaprojektowaliśmy i&nbsp;wdrożyliśmy nową stronę, a&nbsp;na&nbsp;miejscu zrealizowaliśmy zdjęcia i&nbsp;film z&nbsp;drona. Na&nbsp;koniec –&nbsp;szablon prezentacji do&nbsp;rozmów handlowych.',
      ],
    },
    {
      type: 'splitShots',
      screen: 'Logo',
      aria: 'Logo przed i po',
      no: 'ZNAK · PRZED I&nbsp;PO',
      titleHtml: 'Ta sama ryba,<br>nowy charakter.',
      lead: 'Zachowaliśmy to, co klienci rozpoznają –&nbsp;rybę i&nbsp;nazwę K2. Zmieniliśmy resztę: jedna linia zamiast płaskiej ilustracji, głęboka zieleń zamiast błękitu, typografia, która dobrze wygląda i&nbsp;na&nbsp;ciężarówce, i&nbsp;na&nbsp;etykiecie.',
      padTop0: true,
      shots: [
        { src: '/assets/portfolio/k2/k2-stare-logo-hodowla-ryb.jpg', alt: 'Poprzednie logo Hodowli Ryb K2 – niebieska ryba', tag: 'Przed', figureClass: 'cs-shot--ad', ratio: '16/10', bg: '#ffffff', contain: true, imgStyle: contain },
        { src: '/assets/portfolio/k2/k2-logo-hodowla-ryb-biale.svg', alt: 'Nowe logo Hodowli Ryb K2 w wersji białej na zielonym tle', tag: 'Po · Odświeżony znak', figureClass: 'cs-shot--ad', ratio: '16/10', bg: '#1e3b1f', contain: true, delay: true, imgStyle: containNew },
      ],
    },
    {
      type: 'brandBook',
      screen: 'KSIĘGA ZNAKU',
      no: 'KSIĘGA ZNAKU',
      titleHtml: 'Zasady, które pilnują<br>marki za&nbsp;nas.',
      lead: 'Wersja podstawowa i&nbsp;alternatywna, sygnet, pole ochronne, minimalne rozmiary i&nbsp;paleta –&nbsp;wszystko, czego potrzebuje drukarnia, producent opakowań czy agencja, żeby znak wyglądał zawsze tak samo.',
      padTop0: true,
      spreads: [
        {
          wide: true,
          rotate: '-1.2deg',
          pages: [
            { bg: '#eef0ec', src: '/assets/portfolio/k2/k2-logo-hodowla-ryb-zielone.svg', label: 'Księga znaku' },
            { bg: '#1e3b1f', heading: 'Podstawowa', sub: 'Wersja znaku', label: '01', labelOnDark: true },
          ],
        },
        {
          rotate: '1deg',
          pages: [
            { bg: '#1e3b1f', src: '/assets/portfolio/k2/k2-logo-hodowla-ryb-biale.svg', label: 'Negatyw', labelOnDark: true },
            { bg: '#eef0ec', src: '/assets/portfolio/k2/k2-logo-hodowla-ryb-zielone.svg', label: 'Pozytyw' },
          ],
        },
        {
          rotate: '-0.8deg',
          pages: [
            { bg: '#1e3b1f', heading: 'Alternatywna', sub: 'Wersja znaku', label: '02', labelOnDark: true },
            { bg: '#eef0ec', src: '/assets/portfolio/k2/k2-sygnet-zielony.svg', imgPct: '40%', label: 'Sygnet' },
          ],
        },
      ],
    },
    {
      type: 'palette',
      padTop0: true,
      no: '',
      titleHtml: '',
      colors: [
        { name: 'Zieleń K2', hex: '#1E3B1F' },
        { name: 'Mgła', hex: '#EEF0EC' },
        { name: 'Czerń', hex: '#000000' },
        { name: 'Biel', hex: '#FFFFFF' },
      ],
    },
    {
      type: 'steps',
      screen: 'STRONA INTERNETOWA',
      no: 'STRONA INTERNETOWA',
      titleHtml: 'Nowoczesna strona<br>dla <span class="accent">40 lat tradycji.</span>',
      items: [
        { no: 'W1, 01', title: 'Struktura i&nbsp;UX', desc: 'Prosta ścieżka: historia hodowli, oferta ryb w&nbsp;trzech rozmiarach, jakość i&nbsp;certyfikaty, kontakt dla odbiorców hurtowych.' },
        { no: 'W1, 02', title: 'UI design', desc: 'Duże, naturalne kadry z&nbsp;drona i&nbsp;głęboka zieleń z&nbsp;nowej księgi znaku. Strona wygląda jak miejsce, które opisuje.' },
        { no: 'W1, 03', title: 'Treści i&nbsp;blog', desc: 'Sekcje „O nas”, „Ryby”, „Zaufanie i&nbsp;jakość”, informacje o&nbsp;dofinansowaniu UE oraz blog o&nbsp;hodowli i&nbsp;rybach.' },
        { no: 'W1, 04', title: 'Wdrożenie', desc: 'Responsywna strona na&nbsp;WordPressie z&nbsp;panelem do&nbsp;edycji, formularzem kontaktowym i&nbsp;podstawami SEO.' },
      ],
    },
    {
      type: 'gallery',
      aria: 'Strona Hodowli Ryb K2',
      rows: [
        {
          shots: [
            { src: '/assets/portfolio/k2/k2-strona-www-strona-glowna-hero.webp', alt: 'Strona główna hodowlak2.pl – hero z zdjęciem hodowli z drona', tag: 'Strona · Home', figureClass: 'cs-shot--ad', ratio: '1920/1200', bg: '#1e3b1f' },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/k2/k2-strona-www-strona-glowna-pelna.webp', alt: 'Pełny widok strony głównej Hodowli Ryb K2 – wszystkie sekcje', tag: 'Home · Przewiń ↓', figureClass: 'cs-shot--ad', ratio: '4/3', bg: '#fff', scroll: true, imgStyle: scrollImg },
            { src: '/assets/portfolio/k2/k2-strona-www-oferta-ryby.webp', alt: 'Podstrona Ryby – oferta pstrąga tęczowego na stronie K2', tag: 'Strona · Oferta', figureClass: 'cs-shot--ad', ratio: '4/3', bg: '#fff', delay: true },
          ],
        },
      ],
    },
    {
      type: 'heading',
      screen: 'ZDJĘCIA',
      no: 'FOTOGRAFIA',
      titleHtml: 'Zdjęcia zrobione<br>na&nbsp;miejscu, <span class="accent">o&nbsp;świcie.</span>',
      lead: 'Zamiast zdjęć z&nbsp;banku –&nbsp;prawdziwa hodowla. Kilka dni zdjęciowych w&nbsp;różnych porach roku: baseny, wylęgarnia, ludzie i&nbsp;okolica. Materiał wykorzystany na&nbsp;stronie, w&nbsp;prezentacji i&nbsp;w&nbsp;social mediach.',
    },
    {
      type: 'gallery',
      aria: 'Zdjęcia Hodowli Ryb K2',
      padTop0: true,
      rows: [
        { shots: [{ src: '/assets/portfolio/k2/k2-hodowla-ryb-hodowca-na-lodzi-o-swicie.webp', alt: 'Hodowca ryb K2 na łódce na stawie o świcie – fotografia wizerunkowa', tag: 'Foto · Wizerunek', ratio: '16/9' }] },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/k2/k2-baseny-hodowlane-pstraga.webp', alt: 'Baseny hodowlane pstrąga tęczowego w hodowli K2', tag: 'Foto · Hodowla', ratio: '4/3' },
            { src: '/assets/portfolio/k2/k2-ikra-pstraga-teczowego-wylegarnia.webp', alt: 'Ikra pstrąga tęczowego w wylęgarni K2', tag: 'Foto · Wylęgarnia', ratio: '4/3', delay: true },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/k2/k2-hodowla-ryb-zdjecie-z-drona-dolina.webp', alt: 'Hodowla Ryb K2 w dolinie – zdjęcie z drona', tag: 'Dron · Okolica', ratio: '16/9' },
            { src: '/assets/portfolio/k2/k2-hodowla-ryb-staw-i-budynek-fotografia.webp', alt: 'Staw i budynek Hodowli Ryb K2 – zdjęcie z drona', tag: 'Dron · Staw', ratio: '16/9', delay: true },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/k2/k2-tecza-nad-hodowla-ryb-jesien.webp', alt: 'Tęcza nad Hodowlą Ryb K2 jesienią – baseny pstrąga w dolinie', tag: 'Foto · Jesień', ratio: '4/3' },
            { src: '/assets/portfolio/k2/k2-filet-z-pstraga-teczowego-z-rozmarynem.webp', alt: 'Świeży filet z pstrąga tęczowego K2 z rozmarynem i pieprzem – fotografia produktowa', tag: 'Foto · Produkt', ratio: '4/3', delay: true },
          ],
        },
        { shots: [{ src: '/assets/portfolio/k2/k2-rzeka-o-swicie-okolice-hodowli-pstraga.webp', alt: 'Rzeka o świcie w okolicy Hodowli Ryb K2 – czysta woda, jesienny las', tag: 'Foto · Okolica', ratio: '21/9' }] },
      ],
    },
    {
      type: 'film',
      screen: 'FILM',
      no: 'FILM Z&nbsp;DRONA',
      titleHtml: 'Skala, którą najlepiej<br>widać <span class="accent">z&nbsp;góry.</span>',
      lead: 'Ujęcia z&nbsp;drona pokazują to, czego nie&nbsp;zmieści żaden kadr z&nbsp;ziemi –&nbsp;rozmiar hodowli i&nbsp;to, jak wpisuje się w&nbsp;krajobraz. Film pracuje na&nbsp;stronie, w&nbsp;prezentacjach i&nbsp;na&nbsp;targach.',
      videoId: 'oeoytfRRqy4',
      poster: '/assets/portfolio/k2/k2-hodowla-pstraga-zdjecie-z-drona-baseny.webp',
      alt: 'Odtwórz film z drona Hodowli Ryb K2',
      recLabel: 'HODOWLA RYB K2, DRON',
      extras: ['4K · 25FPS'],
    },
  ],
  quote: {
    text: 'Największy producent pstrąga dostał wizerunek na&nbsp;miarę swojej pozycji –&nbsp;od&nbsp;znaku, przez stronę, po&nbsp;prezentację na&nbsp;spotkania z&nbsp;odbiorcami.',
    by: '– <b>Zespół SEZMOO</b> · Branding, WWW, foto i&nbsp;wideo',
  },
  next: {
    href: '/portfolio/',
    aria: 'Wróć do portfolio',
    k: 'Zobacz więcej →',
    title: 'Portfolio',
    cat: 'Wszystkie realizacje SEZMOO',
    image: '/assets/portfolio/k2/k2-hodowla-ryb-zdjecie-z-drona-dolina.webp',
    alt: 'Hodowla Ryb K2',
  },
};

const en: LongformCopy = {
  title: 'K2 Fish Farm · Rebranding, website, photo & drone · SEZMOO case study',
  description:
    'SEZMOO case study: logo refresh, brand guidelines, new website, photography, drone film and a presentation template for K2 Fish Farm, a rainbow trout producer in Poland.',
  schemaName: 'K2 Fish Farm · Rebranding, website, photo & drone',
  hero: {
    image: pl.hero.image,
    alt: 'K2 trout farm from above – fish ponds surrounded by forest, drone photo',
    hud: ['REBRANDING · WEB', 'PHOTO · DRONE', 'AQUACULTURE / PL'],
    cat: 'SEZMOO × K2 Fish Farm · Brand refresh',
    titleLead: 'K2 Fish<br>',
    titleAccent: 'Farm.',
    sub: 'A refreshed logo, brand guidelines, a new website, photography, a drone film and a presentation template for <b>K2 Fish Farm</b>, one of the largest rainbow trout producers in Poland.',
  },
  meta: [
    { k: 'Client', v: 'K2 Fish Farm', small: 'Jacek Juchniewicz' },
    { k: 'Industry', v: 'Aquaculture', small: 'Rainbow trout' },
    { k: 'Format', v: 'Rebranding', small: 'Brand refresh' },
    { k: 'Scope', v: 'Full-service', small: 'Logo · Web · Photo · Drone' },
    { k: 'Online', v: 'hodowlak2.pl ↗', small: 'Live website', href: 'https://hodowlak2.pl/' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'ABOUT',
      no: 'ABOUT THE PROJECT',
      titleHtml: 'A market leader<br>that finally <span class="accent">looks like one.</span>',
      paras: [
        'For years K2 has been among the top trout producers in Poland, with its own hatchery, transport fleet and a family tradition. Its market position didn’t need building. It needed showing.',
        'The old logo and website didn’t match the scale of the business. We refreshed the mark, documented it in brand guidelines, designed and built a new website, and shot photos and a drone film on location. Finally, a presentation template for sales meetings.',
      ],
    },
    {
      type: 'splitShots',
      screen: 'Logo',
      aria: 'Logo before and after',
      no: 'LOGO · BEFORE &amp; AFTER',
      titleHtml: 'Same fish,<br>new character.',
      lead: 'We kept what customers recognise: the fish and the K2 name. Everything else changed: a single line instead of a flat illustration, deep green instead of blue, and type that works on a truck as well as on a label.',
      padTop0: true,
      shots: [
        { src: '/assets/portfolio/k2/k2-stare-logo-hodowla-ryb.jpg', alt: 'Previous K2 Fish Farm logo – blue fish', tag: 'Before', figureClass: 'cs-shot--ad', ratio: '16/10', bg: '#ffffff', contain: true, imgStyle: contain },
        { src: '/assets/portfolio/k2/k2-logo-hodowla-ryb-biale.svg', alt: 'New K2 Fish Farm logo in white on green background', tag: 'After · Refreshed logo', figureClass: 'cs-shot--ad', ratio: '16/10', bg: '#1e3b1f', contain: true, delay: true, imgStyle: containNew },
      ],
    },
    {
      type: 'brandBook',
      screen: 'BRAND GUIDELINES',
      no: 'BRAND GUIDELINES',
      titleHtml: 'Rules that look after<br>the brand for us.',
      lead: 'Primary and alternative versions, symbol, clear space, minimum sizes and palette: everything a printer, packaging supplier or agency needs to keep the logo consistent.',
      padTop0: true,
      spreads: [
        {
          wide: true,
          rotate: '-1.2deg',
          pages: [
            { bg: '#eef0ec', src: '/assets/portfolio/k2/k2-logo-hodowla-ryb-zielone.svg', label: 'Brand guidelines' },
            { bg: '#1e3b1f', heading: 'Primary', sub: 'Logo version', label: '01', labelOnDark: true },
          ],
        },
        {
          rotate: '1deg',
          pages: [
            { bg: '#1e3b1f', src: '/assets/portfolio/k2/k2-logo-hodowla-ryb-biale.svg', label: 'Negative', labelOnDark: true },
            { bg: '#eef0ec', src: '/assets/portfolio/k2/k2-logo-hodowla-ryb-zielone.svg', label: 'Positive' },
          ],
        },
        {
          rotate: '-0.8deg',
          pages: [
            { bg: '#1e3b1f', heading: 'Alternative', sub: 'Logo version', label: '02', labelOnDark: true },
            { bg: '#eef0ec', src: '/assets/portfolio/k2/k2-sygnet-zielony.svg', imgPct: '40%', label: 'Symbol' },
          ],
        },
      ],
    },
    {
      type: 'palette',
      padTop0: true,
      no: '',
      titleHtml: '',
      colors: [
        { name: 'K2 Green', hex: '#1E3B1F' },
        { name: 'Mist', hex: '#EEF0EC' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' },
      ],
    },
    {
      type: 'steps',
      screen: 'WEBSITE',
      no: 'WEBSITE',
      titleHtml: 'A modern website<br>for <span class="accent">40 years of tradition.</span>',
      items: [
        { no: 'W1, 01', title: 'Structure &amp; UX', desc: 'A simple path: the farm’s story, fish offered in three sizes, quality and certificates, contact for wholesale buyers.' },
        { no: 'W1, 02', title: 'UI design', desc: 'Large, natural drone shots and the deep green from the new guidelines. The site looks like the place it describes.' },
        { no: 'W1, 03', title: 'Content &amp; blog', desc: '“About us”, “Fish” and “Trust &amp; quality” sections, EU funding information and a blog about fish farming.' },
        { no: 'W1, 04', title: 'Build', desc: 'A responsive WordPress site with an editing panel, contact form and SEO essentials.' },
      ],
    },
    {
      type: 'gallery',
      aria: 'K2 Fish Farm website',
      rows: [
        {
          shots: [
            { src: '/assets/portfolio/k2/k2-strona-www-strona-glowna-hero.webp', alt: 'hodowlak2.pl homepage – hero with drone photo of the fish farm', tag: 'Website · Home', figureClass: 'cs-shot--ad', ratio: '1920/1200', bg: '#1e3b1f' },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/k2/k2-strona-www-strona-glowna-pelna.webp', alt: 'Full K2 Fish Farm homepage – all sections', tag: 'Home · Scroll ↓', figureClass: 'cs-shot--ad', ratio: '4/3', bg: '#fff', scroll: true, imgStyle: scrollImg },
            { src: '/assets/portfolio/k2/k2-strona-www-oferta-ryby.webp', alt: 'Fish subpage – rainbow trout offer on the K2 website', tag: 'Website · Offer', figureClass: 'cs-shot--ad', ratio: '4/3', bg: '#fff', delay: true },
          ],
        },
      ],
    },
    {
      type: 'heading',
      screen: 'PHOTOS',
      no: 'PHOTOGRAPHY',
      titleHtml: 'Shot on location,<br><span class="accent">at dawn.</span>',
      lead: 'No stock photos, just the real farm. Several shoot days across the seasons: ponds, hatchery, people and surroundings. Used on the website, in the presentation and on social media.',
    },
    {
      type: 'gallery',
      aria: 'K2 Fish Farm photos',
      padTop0: true,
      rows: [
        { shots: [{ src: '/assets/portfolio/k2/k2-hodowla-ryb-hodowca-na-lodzi-o-swicie.webp', alt: 'K2 fish farmer in a rowing boat on the pond at dawn – brand photography', tag: 'Photo · Brand', ratio: '16/9' }] },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/k2/k2-baseny-hodowlane-pstraga.webp', alt: 'Rainbow trout rearing ponds at K2 fish farm', tag: 'Photo · Farm', ratio: '4/3' },
            { src: '/assets/portfolio/k2/k2-ikra-pstraga-teczowego-wylegarnia.webp', alt: 'Rainbow trout eggs in the K2 hatchery', tag: 'Photo · Hatchery', ratio: '4/3', delay: true },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/k2/k2-hodowla-ryb-zdjecie-z-drona-dolina.webp', alt: 'K2 Fish Farm in a forested valley – drone photo', tag: 'Drone · Valley', ratio: '16/9' },
            { src: '/assets/portfolio/k2/k2-hodowla-ryb-staw-i-budynek-fotografia.webp', alt: 'K2 Fish Farm pond and building at golden hour', tag: 'Drone · Pond', ratio: '16/9', delay: true },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/k2/k2-tecza-nad-hodowla-ryb-jesien.webp', alt: 'Rainbow over K2 Fish Farm in autumn – trout ponds in the valley', tag: 'Photo · Autumn', ratio: '4/3' },
            { src: '/assets/portfolio/k2/k2-filet-z-pstraga-teczowego-z-rozmarynem.webp', alt: 'Fresh K2 rainbow trout fillet with rosemary and peppercorns – product photography', tag: 'Photo · Product', ratio: '4/3', delay: true },
          ],
        },
        { shots: [{ src: '/assets/portfolio/k2/k2-rzeka-o-swicie-okolice-hodowli-pstraga.webp', alt: 'River at dawn near K2 Fish Farm – clean water and autumn forest', tag: 'Photo · Surroundings', ratio: '21/9' }] },
      ],
    },
    {
      type: 'film',
      screen: 'FILM',
      no: 'DRONE FILM',
      titleHtml: 'Scale you can only<br>see <span class="accent">from above.</span>',
      lead: 'Drone footage shows what no ground-level shot can: the size of the farm and how it sits in the landscape. The film works on the website, in presentations and at trade fairs.',
      videoId: 'oeoytfRRqy4',
      poster: '/assets/portfolio/k2/k2-hodowla-pstraga-zdjecie-z-drona-baseny.webp',
      alt: 'Play K2 Fish Farm drone film',
      recLabel: 'K2 FISH FARM, DRONE',
      extras: ['4K · 25FPS'],
    },
  ],
  quote: {
    text: 'A leading trout producer now has a brand that matches its position, from the logo and website to the presentation for buyer meetings.',
    by: '– <b>SEZMOO Team</b> · Branding, web, photo &amp; video',
  },
  next: {
    href: '/en/portfolio-en/',
    aria: 'Back to portfolio',
    k: 'See more →',
    title: 'Portfolio',
    cat: 'All SEZMOO work',
    image: '/assets/portfolio/k2/k2-hodowla-ryb-zdjecie-z-drona-dolina.webp',
    alt: 'K2 Fish Farm',
  },
};

export const k2: LongformDef = { id: 'k2', pl, en };
