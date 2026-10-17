import type { LongformCopy, LongformDef } from '../types';

const pl: LongformCopy = {
  title: 'Kapka Cafe · Logo i branding lokalu · Realizacja SEZMOO',
  description:
    'Case study SEZMOO: logo, maskotka i pełny branding kawiarni Kapka Cafe. Znak z kubkiem, maskotka-kropla, paleta, menu, baner i oznakowanie lokalu.',
  schemaName: 'Kapka Cafe · Logo i branding lokalu',
  hero: {
    frame: true,
    image: '/assets/portfolio/kapka/kapka-baner.jpg',
    alt: 'Maskotka Kapka Cafe, kropla kawy z kubkiem na wynos i kanapką, na tle palonych ziaren',
    hud: ['BRANDING · LOGO', 'IDENTYFIKACJA', 'KAWIARNIA / PL'],
    cat: 'SEZMOO × Kapka Cafe · Branding lokalu',
    titleLead: 'Kapka<br>',
    titleAccent: 'Cafe.',
    sub: 'Kompletna identyfikacja wizualna dla kawiarni <b>Kapka Cafe</b>: od znaku i maskotki, przez paletę i typografię, po materiały, które pracują na ladzie, w witrynie i w social mediach.',
  },
  meta: [
    { k: 'Klient', v: 'Kapka Cafe', small: 'Kawiarnia' },
    { k: 'Branża', v: 'Gastronomia', small: 'Coffee &amp; to-go' },
    { k: 'Format', v: 'Branding', small: 'Od zera' },
    { k: 'Zakres', v: 'Full-service', small: 'Logo · Maskotka · Materiały' },
    { k: 'Rezultat', v: 'Spójny lokal', small: 'Znak · Witryna · Social' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'O projekcie',
      no: 'O PROJEKCIE',
      titleHtml: 'Marka zbudowana<br>wokół jednej <span class="accent">kropli.</span>',
      paras: [
        'Kapka Cafe potrzebowała znaku, który od razu mówi „kawa na wynos” i materiału, który działa w lokalu tak samo dobrze jak w social mediach.',
        'Zbudowaliśmy system wokół jednej idei: kropli. Znak z kubkiem, maskotka, paleta i materiały lokalu trzymają ten sam ton.',
      ],
    },
    {
      type: 'heading',
      padTop0: true,
      no: 'ZNAK',
      titleHtml: 'Logo, które od razu<br>mówi „kawa na wynos”.',
    },
    {
      type: 'gallery',
      aria: 'Logo',
      rows: [
        {
          shots: [
            {
              src: '/assets/portfolio/kapka/kapka-logo.jpg',
              alt: 'Logo Kapka Cafe: brązowy kubek na wynos trzymany przez dłoń obok napisu Kapka Cafe',
              tag: 'Logo · Wersja podstawowa',
              figureClass: 'cs-shot--wide',
              bg: '#f3e9d6',
              parallax: 20,
              imgStyle: 'object-fit:contain',
            },
          ],
        },
      ],
    },
    {
      type: 'steps',
      screen: 'System',
      no: 'SYSTEM IDENTYFIKACJI',
      titleHtml: 'Od znaku<br>po materiały lokalu.',
      items: [
        { no: 'B1, 01', title: 'Znak i logotyp', desc: 'Sygnet z kubkiem na wynos trzymanym przez dłoń oraz miękki, odręczny logotyp „Kapka Cafe”, czytelny na szyldzie, w aplikacji i na kubku.' },
        { no: 'B1, 02', title: 'Maskotka-kropla', desc: 'Uśmiechnięta kropla kawy z kubkiem i kanapką, bohater marki używany w social mediach, na banerach i jako naklejka witrynowa w lokalu.' },
        { no: 'B1, 03', title: 'Paleta i typografia', desc: 'Ciepłe brązy palonej kawy, kremowe tło i miękki, zaokrąglony krój, które budują przyjazny, kawiarniany charakter i trzymają całość w jednym tonie.' },
        { no: 'B1, 04', title: 'Materiały i lokal', desc: 'Menu, baner na Facebooka, szyld, litery przestrzenne na ladzie i naklejki, czyli identyfikacja przeniesiona na realne punkty styku z gościem.' },
      ],
    },
    {
      type: 'gallery',
      aria: 'Elementy identyfikacji',
      rows: [
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/kapka/kapka-maskotka.png', alt: 'Maskotka Kapka Cafe: uśmiechnięta kropla kawy z kubkiem na wynos', tag: 'Maskotka · Kropla', figureClass: 'cs-shot--tall', bg: '#e7dcc6', parallax: 24, imgStyle: 'object-fit:contain' },
            { src: '/assets/portfolio/kapka/kapka-menu.jpg', alt: 'Menu Kapka Cafe z cennikiem kaw, napojów i dodatków', tag: 'Materiały · Menu', figureClass: 'cs-shot--tall', delay: true, parallax: 24 },
          ],
        },
        { shots: [{ src: '/assets/portfolio/kapka/kapka-baner.jpg', alt: 'Baner Kapka Cafe z maskotką-kroplą na tle palonych ziaren kawy', tag: 'Social · Baner FB', figureClass: 'cs-shot--full', parallax: 30 }] },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/kapka/kapka-lokal.jpg', alt: 'Wnętrze Kapka Cafe: lada z przestrzennym logo i naklejka z maskotką na ścianie', tag: 'Lokal · Lada', figureClass: 'cs-shot--tall', parallax: 24 },
            { src: '/assets/portfolio/kapka/kapka-witryna.jpg', alt: 'Witryna i szyld Kapka Cafe od strony ulicy', tag: 'Lokal · Szyld', figureClass: 'cs-shot--tall', delay: true, parallax: 24 },
          ],
        },
      ],
    },
  ],
  quote: {
    text: 'Jedna prosta idea, kropla, dała Kapka Cafe znak, maskotkę i spójny język, który wygląda tak samo dobrze na kubku, w witrynie i w social mediach.',
    by: '– <b>Zespół SEZMOO</b> · Branding &amp; identyfikacja',
  },
  next: {
    href: '/portfolio/',
    aria: 'Wróć do portfolio',
    k: 'Zobacz więcej →',
    title: 'Portfolio',
    cat: 'Wszystkie realizacje SEZMOO',
    image: '/assets/portfolio/kapka/kapka-witryna.jpg',
    alt: 'Witryna Kapka Cafe',
  },
};

const en: LongformCopy = {
  title: 'Kapka Cafe · Logo & brand identity · SEZMOO case study',
  description:
    'SEZMOO case study: logo, mascot and full brand identity for Kapka Cafe. Cup-and-hand mark, coffee-drop mascot, palette, menu, banner and in-store signage.',
  schemaName: 'Kapka Cafe · Logo & brand identity',
  hero: {
    frame: true,
    image: pl.hero.image,
    alt: 'Kapka Cafe mascot, a coffee drop holding a to-go cup and a sandwich, over roasted beans',
    hud: ['BRANDING · LOGO', 'IDENTITY', 'COFFEE SHOP / PL'],
    cat: 'SEZMOO × Kapka Cafe · Coffee shop branding',
    titleLead: 'Kapka<br>',
    titleAccent: 'Cafe.',
    sub: 'A complete visual identity for <b>Kapka Cafe</b>: from the mark and mascot, through palette and type, to materials that work on the counter, in the window and across social media.',
  },
  meta: [
    { k: 'Client', v: 'Kapka Cafe', small: 'Coffee shop' },
    { k: 'Industry', v: 'Hospitality', small: 'Coffee &amp; to-go' },
    { k: 'Format', v: 'Branding', small: 'From scratch' },
    { k: 'Scope', v: 'Full-service', small: 'Logo · Mascot · Materials' },
    { k: 'Result', v: 'One coherent look', small: 'Mark · Window · Social' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'About',
      no: 'ABOUT THE PROJECT',
      titleHtml: 'A brand built<br>around a single <span class="accent">drop.</span>',
      paras: [
        'Kapka Cafe needed a mark that instantly says “coffee to go” and materials that work in the venue as well as they work on social media.',
        'We built the system around one idea: a drop. The cup mark, the mascot, the palette and the in-store kit stay in the same tone.',
      ],
    },
    {
      type: 'heading',
      padTop0: true,
      no: 'THE MARK',
      titleHtml: 'A logo that instantly<br>says “coffee to go”.',
    },
    {
      type: 'gallery',
      aria: 'Logo',
      rows: [
        {
          shots: [
            {
              src: '/assets/portfolio/kapka/kapka-logo.jpg',
              alt: 'Kapka Cafe logo: a brown to-go cup held by a hand next to the Kapka Cafe wordmark',
              tag: 'Logo · Primary',
              figureClass: 'cs-shot--wide',
              bg: '#f3e9d6',
              parallax: 20,
              imgStyle: 'object-fit:contain',
            },
          ],
        },
      ],
    },
    {
      type: 'steps',
      screen: 'System',
      no: 'IDENTITY SYSTEM',
      titleHtml: 'From the mark<br>to the whole venue.',
      items: [
        { no: 'B1, 01', title: 'Mark and wordmark', desc: 'A to-go cup held by a hand plus a soft handwritten “Kapka Cafe” wordmark, readable on a fascia, in an app and on a cup.' },
        { no: 'B1, 02', title: 'Drop mascot', desc: 'A smiling coffee drop with a cup and a sandwich – the brand character for social, banners and a window sticker.' },
        { no: 'B1, 03', title: 'Palette and type', desc: 'Warm roasted-coffee browns, a cream ground and a rounded typeface that keep a friendly café tone.' },
        { no: 'B1, 04', title: 'Materials and venue', desc: 'Menu, Facebook banner, fascia, 3D letters on the counter and stickers – identity at every guest touchpoint.' },
      ],
    },
    {
      type: 'gallery',
      aria: 'Identity pieces',
      rows: [
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/kapka/kapka-maskotka.png', alt: 'Kapka Cafe mascot: a smiling coffee drop with a to-go cup', tag: 'Mascot · Drop', figureClass: 'cs-shot--tall', bg: '#e7dcc6', parallax: 24, imgStyle: 'object-fit:contain' },
            { src: '/assets/portfolio/kapka/kapka-menu.jpg', alt: 'Kapka Cafe menu with coffee, drinks and extras', tag: 'Print · Menu', figureClass: 'cs-shot--tall', delay: true, parallax: 24 },
          ],
        },
        { shots: [{ src: '/assets/portfolio/kapka/kapka-baner.jpg', alt: 'Kapka Cafe banner with the drop mascot over roasted beans', tag: 'Social · FB banner', figureClass: 'cs-shot--full', parallax: 30 }] },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/kapka/kapka-lokal.jpg', alt: 'Kapka Cafe interior: counter with dimensional logo and mascot sticker', tag: 'Venue · Counter', figureClass: 'cs-shot--tall', parallax: 24 },
            { src: '/assets/portfolio/kapka/kapka-witryna.jpg', alt: 'Kapka Cafe window and fascia from the street', tag: 'Venue · Fascia', figureClass: 'cs-shot--tall', delay: true, parallax: 24 },
          ],
        },
      ],
    },
  ],
  quote: {
    text: 'One simple idea – a drop – gave Kapka Cafe a mark, a mascot and a language that looks as good on a cup as it does in the window and on social.',
    by: '– <b>SEZMOO team</b> · Branding &amp; identity',
  },
  next: {
    href: '/en/portfolio-en/',
    aria: 'Back to portfolio',
    k: 'See more →',
    title: 'Portfolio',
    cat: 'All SEZMOO work',
    image: '/assets/portfolio/kapka/kapka-witryna.jpg',
    alt: 'Kapka Cafe window',
  },
};

export const kapka: LongformDef = { id: 'kapka', pl, en };
