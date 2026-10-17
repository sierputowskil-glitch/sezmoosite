import type { LongformCopy, LongformDef } from '../types';

const contain = 'position:static;width:46%;height:auto;inset:auto;object-fit:contain';

const pl: LongformCopy = {
  title: 'Soho Form · Logo, księga znaku i strona WWW · Realizacja SEZMOO',
  description: 'Case study SEZMOO: logo, księga znaku i strona internetowa dla Soho Form, producenta mebli tapicerowanych na zamówienie.',
  schemaName: 'Soho Form · Logo, księga znaku i strona WWW',
  hero: {
    device: true,
    frame: true,
    image: '/assets/portfolio/soho-form/soho-hero-laptop.webp',
    alt: 'Strona Soho Form na ekranie laptopa',
    hud: ['BRANDING · WWW', 'UX/UI · LOGO', 'MEBLE / PL'],
    cat: 'SEZMOO × Soho Form · Branding i strona internetowa',
    titleLead: 'Soho<br>',
    titleAccent: 'Form.',
    sub: 'Logo, księga znaku i&nbsp;strona internetowa dla <b>Soho Form</b> –&nbsp;rodzinnego producenta mebli tapicerowanych na&nbsp;zamówienie, który pracuje z&nbsp;architektami, hotelami i&nbsp;restauracjami w&nbsp;całej Europie.',
  },
  meta: [
    { k: 'Klient', v: 'Soho Form', small: 'Meble tapicerowane' },
    { k: 'Branża', v: 'Meble i wnętrza', small: 'B2B · HoReCa' },
    { k: 'Format', v: 'Branding + WWW', small: 'Od zera' },
    { k: 'Zakres', v: 'Full-service', small: 'Logo · Księga · Strona' },
    { k: 'Rezultat', v: 'Spójna marka', small: 'Znak · Online · Oferta' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'O PROJEKCIE',
      no: 'O PROJEKCIE',
      titleHtml: 'Rzemiosło, które<br>wygląda <span class="accent">premium.</span>',
      paras: [
        'Soho Form to&nbsp;rodzinna firma z&nbsp;wieloletnią tradycją. Produkuje sofy, fotele, łóżka i&nbsp;zabudowy stolarskie na&nbsp;zamówienie –&nbsp;dla wnętrz komercyjnych i&nbsp;prywatnych. Jakość mebli była od&nbsp;lat na&nbsp;poziomie marek premium, ale komunikacja jeszcze tego nie&nbsp;pokazywała.',
        'Zaprojektowaliśmy markę od&nbsp;podstaw: znak, księgę znaku z&nbsp;paletą i&nbsp;typografią, a&nbsp;następnie stronę internetową, która prezentuje ofertę i&nbsp;realizacje tak, jak&nbsp;oczekują tego architekci i&nbsp;inwestorzy.',
      ],
    },
    {
      type: 'splitShots',
      screen: 'Logo',
      padTop0: true,
      aria: 'Logo',
      no: 'ZNAK',
      titleHtml: 'Prosty logotyp<br>z charakterem wnętrza.',
      shots: [
        { src: '/assets/portfolio/soho-form/soho-logo-white.svg', alt: 'Logo Soho Form w wersji białej na ciemnym tle', tag: 'Logo · Negatyw', ratio: '16/10', bg: '#1f2b2d', figureClass: 'cs-shot--ad', contain: true, imgStyle: contain },
        { src: '/assets/portfolio/soho-form/soho-logo-black.svg', alt: 'Logo Soho Form w wersji czarnej na jasnym tle', tag: 'Logo · Podstawowe', ratio: '16/10', bg: '#dcdcdc', figureClass: 'cs-shot--ad', contain: true, delay: true, imgStyle: contain },
      ],
    },
    {
      type: 'palette',
      screen: 'KSIĘGA ZNAKU',
      padTop0: true,
      no: 'KSIĘGA ZNAKU',
      titleHtml: 'Paleta z materiałów,<br>z których powstają meble.',
      colors: [
        { name: 'Szarość', hex: '#DCDCDC' },
        { name: 'Czerń', hex: '#000000' },
        { name: 'Szałwia', hex: '#99A28A' },
        { name: 'Oliwka', hex: '#78774C' },
        { name: 'Piasek', hex: '#FFDC94' },
        { name: 'Len', hex: '#E3DBCF' },
      ],
      typeSampleHtml: `<div style="font-family:'Barlow',sans-serif;font-weight:700;font-size:clamp(88px,11vw,180px);line-height:.85;letter-spacing:-.02em">Aa</div>`,
      typeNoteHtml: '<p><strong>Barlow Bold / Regular.</strong> Barlow Bold w&nbsp;nagłówkach i&nbsp;logotypie podkreśla siłę marki, a&nbsp;Barlow Regular w&nbsp;treściach dba o&nbsp;czytelność. Razem tworzą nowoczesny, zrównoważony system komunikacji.</p>',
    },
    {
      type: 'steps',
      screen: 'STRONA INTERNETOWA',
      no: 'STRONA INTERNETOWA',
      titleHtml: 'Od struktury<br>po gotową stronę.',
      items: [
        { no: 'W1, 01', title: 'Architektura i&nbsp;UX', desc: 'Struktura prowadząca od&nbsp;kolekcji, przez ofertę dla&nbsp;hoteli, kawiarni i&nbsp;restauracji, po&nbsp;realizacje i&nbsp;szybki kontakt.' },
        { no: 'W1, 02', title: 'UI design', desc: 'Ciemne, fotograficzne sekcje przeplatane jasnymi blokami oferty –&nbsp;układ, który pozwala mówić przede wszystkim meblom.' },
        { no: 'W1, 03', title: 'Treści i&nbsp;oferta', desc: 'Opisy trzech linii oferty, sekcja „O nas” i&nbsp;blog z&nbsp;poradnikami, które odpowiadają na&nbsp;pytania klientów.' },
        { no: 'W1, 04', title: 'Wdrożenie', desc: 'Responsywna strona z&nbsp;galerią realizacji, formularzem kontaktowym i&nbsp;panelem do&nbsp;samodzielnej edycji treści.' },
      ],
    },
    {
      type: 'gallery',
      aria: 'Strona Soho Form',
      rows: [
        { shots: [{ src: '/assets/portfolio/soho-form/soho-mockup-yellow.webp', alt: 'Strona Soho Form na laptopie i telefonie, żółte tło', tag: 'Strona · Desktop i mobile', ratio: '2000/1125', bg: '#ffd200', figureClass: 'cs-shot--ad', imgStyle: 'object-fit:contain' }] },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/soho-form/soho-imac.webp', alt: 'Strona Soho Form na monitorze – sekcja Realizacje', tag: 'Strona · Realizacje', ratio: '4/3', bg: '#141616', figureClass: 'cs-shot--ad', imgStyle: 'object-fit:contain' },
            { src: '/assets/portfolio/soho-form/soho-mockup.webp', alt: 'Podstrony Soho Form na laptopie i ekranach', tag: 'Strona · Podstrony', ratio: '4/3', bg: '#141616', figureClass: 'cs-shot--ad', delay: true, imgStyle: 'object-fit:contain' },
          ],
        },
      ],
    },
  ],
  quote: {
    text: 'Soho Form dostało markę na&nbsp;miarę swoich mebli –&nbsp;spokojną, pewną siebie i&nbsp;spójną od&nbsp;logo po&nbsp;ostatnią podstronę.',
    by: '– <b>Zespół SEZMOO</b> · Branding &amp; UX/UI',
  },
  next: {
    href: '/portfolio/',
    aria: 'Wróć do portfolio',
    k: 'Zobacz więcej →',
    title: 'Portfolio',
    cat: 'Wszystkie realizacje SEZMOO',
    image: '/assets/portfolio/soho-form/soho-mockup-yellow.webp',
    alt: 'Soho Form',
  },
};

const en: LongformCopy = {
  title: 'Soho Form · Logo, brand manual & website · SEZMOO case study',
  description: 'SEZMOO case study: logo, brand manual and website for Soho Form, a maker of made-to-order upholstered furniture.',
  schemaName: 'Soho Form · Logo, brand manual & website',
  hero: {
    device: true,
    frame: true,
    image: pl.hero.image,
    alt: 'Soho Form website on a laptop screen',
    hud: ['BRANDING · WEB', 'UX/UI · LOGO', 'FURNITURE / PL'],
    cat: 'SEZMOO × Soho Form · Branding and website',
    titleLead: 'Soho<br>',
    titleAccent: 'Form.',
    sub: 'Logo, brand manual and website for <b>Soho Form</b> – a family-run maker of made-to-order upholstered furniture working with architects, hotels and restaurants across Europe.',
  },
  meta: [
    { k: 'Client', v: 'Soho Form', small: 'Upholstered furniture' },
    { k: 'Industry', v: 'Furniture &amp; interiors', small: 'B2B · HoReCa' },
    { k: 'Format', v: 'Branding + web', small: 'From scratch' },
    { k: 'Scope', v: 'Full-service', small: 'Logo · Manual · Website' },
    { k: 'Result', v: 'A consistent brand', small: 'Mark · Online · Offer' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'ABOUT THE PROJECT',
      no: 'ABOUT THE PROJECT',
      titleHtml: 'Craft that<br>looks <span class="accent">premium.</span>',
      paras: [
        'Soho Form is a family company with years of tradition. It makes sofas, armchairs, beds and joinery to order – for commercial and private interiors. Furniture quality had long been at a premium-brand level; communication had not caught up.',
        'We designed the brand from scratch: the mark, a brand manual with palette and type, then a website that presents the offer and projects the way architects and investors expect.',
      ],
    },
    {
      type: 'splitShots',
      screen: 'Logo',
      padTop0: true,
      aria: 'Logo',
      no: 'THE MARK',
      titleHtml: 'A simple logotype<br>with interior character.',
      shots: [
        { src: '/assets/portfolio/soho-form/soho-logo-white.svg', alt: 'Soho Form logo in white on a dark background', tag: 'Logo · Negative', ratio: '16/10', bg: '#1f2b2d', figureClass: 'cs-shot--ad', contain: true, imgStyle: contain },
        { src: '/assets/portfolio/soho-form/soho-logo-black.svg', alt: 'Soho Form logo in black on a light background', tag: 'Logo · Primary', ratio: '16/10', bg: '#dcdcdc', figureClass: 'cs-shot--ad', contain: true, delay: true, imgStyle: contain },
      ],
    },
    {
      type: 'palette',
      screen: 'BRAND MANUAL',
      padTop0: true,
      no: 'BRAND MANUAL',
      titleHtml: 'A palette taken from<br>the materials themselves.',
      colors: [
        { name: 'Grey', hex: '#DCDCDC' },
        { name: 'Black', hex: '#000000' },
        { name: 'Sage', hex: '#99A28A' },
        { name: 'Olive', hex: '#78774C' },
        { name: 'Sand', hex: '#FFDC94' },
        { name: 'Linen', hex: '#E3DBCF' },
      ],
      typeSampleHtml: `<div style="font-family:'Barlow',sans-serif;font-weight:700;font-size:clamp(88px,11vw,180px);line-height:.85;letter-spacing:-.02em">Aa</div>`,
      typeNoteHtml: '<p><strong>Barlow Bold / Regular.</strong> Barlow Bold in headlines and the logotype underlines the brand’s strength; Barlow Regular in body copy keeps it readable. Together they form a modern, balanced system.</p>',
    },
    {
      type: 'steps',
      screen: 'WEBSITE',
      no: 'WEBSITE',
      titleHtml: 'From structure<br>to a finished site.',
      items: [
        { no: 'W1, 01', title: 'IA and UX', desc: 'A structure from collections through the offer for hotels, cafés and restaurants, to case studies and a fast contact path.' },
        { no: 'W1, 02', title: 'UI design', desc: 'Dark photographic sections mixed with light offer blocks – a layout that lets the furniture speak first.' },
        { no: 'W1, 03', title: 'Copy and offer', desc: 'Three offer lines, an About section and a blog of guides that answer client questions.' },
        { no: 'W1, 04', title: 'Build', desc: 'A responsive site with a project gallery, contact form and a panel for editing content.' },
      ],
    },
    {
      type: 'gallery',
      aria: 'Soho Form website',
      rows: [
        { shots: [{ src: '/assets/portfolio/soho-form/soho-mockup-yellow.webp', alt: 'Soho Form website on a laptop and phone, yellow background', tag: 'Site · Desktop and mobile', ratio: '2000/1125', bg: '#ffd200', figureClass: 'cs-shot--ad', imgStyle: 'object-fit:contain' }] },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/soho-form/soho-imac.webp', alt: 'Soho Form website on a monitor – Projects section', tag: 'Site · Projects', ratio: '4/3', bg: '#141616', figureClass: 'cs-shot--ad', imgStyle: 'object-fit:contain' },
            { src: '/assets/portfolio/soho-form/soho-mockup.webp', alt: 'Soho Form inner pages on a laptop and screens', tag: 'Site · Inner pages', ratio: '4/3', bg: '#141616', figureClass: 'cs-shot--ad', delay: true, imgStyle: 'object-fit:contain' },
          ],
        },
      ],
    },
  ],
  quote: {
    text: 'Soho Form got a brand to match its furniture – calm, confident and consistent from the logo to the last inner page.',
    by: '– <b>SEZMOO team</b> · Branding &amp; UX/UI',
  },
  next: {
    href: '/en/portfolio-en/',
    aria: 'Back to portfolio',
    k: 'See more →',
    title: 'Portfolio',
    cat: 'All SEZMOO work',
    image: '/assets/portfolio/soho-form/soho-mockup-yellow.webp',
    alt: 'Soho Form',
  },
};

export const sohoForm: LongformDef = { id: 'soho-form', pl, en };
