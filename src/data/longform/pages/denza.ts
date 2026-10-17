import type { LongformCopy, LongformDef } from '../types';

const pl: LongformCopy = {
  title: 'Premiera DENZA Z9 GT w Tokarach · Realizacja SEZMOO',
  description:
    'Case study SEZMOO: plenerowa premiera DENZA Z9 GT na polu golfowym w Tokarach pod Gdańskiem. Scenografia, ekspozycja modeli, oprawa eventu oraz produkcja foto i wideo.',
  schemaName: 'Premiera DENZA Z9 GT w Tokarach',
  hero: {
    frame: true,
    image: '/assets/portfolio/denza/denza-z9-gt-premiera-fotografia-01.jpg',
    alt: 'DENZA Z9 GT w kolorze morskim na białym podeście, pole golfowe w Tokarach',
    hud: ['REC · 4K · 25FPS', '00:00:12:08', 'TOKARY / PL'],
    cat: 'SEZMOO × Grupa Plichta × DENZA · Premiera Z9 GT',
    titleLead: 'DENZA<br>',
    titleAccent: 'Z9 GT.',
    sub: 'Plenerowa premiera flagowego <b>DENZA Z9 GT</b> na polu golfowym w Tokarach pod Gdańskiem. Elektryczny gran turismo w scenerii, która podkreśla jego elegancję.',
  },
  meta: [
    { k: 'Klient', v: 'Grupa Plichta', small: 'DENZA Gdańsk' },
    { k: 'Lokalizacja', v: 'Pole golfowe', small: 'Tokary k. Gdańska' },
    { k: 'Model', v: 'Z9 GT', small: 'Elektryczne GT' },
    { k: 'Format', v: 'Premiera', small: 'Event plenerowy' },
    { k: 'Zakres', v: 'Full-service', small: 'Scenografia · Foto/wideo' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'O projekcie',
      no: 'O PROJEKCIE',
      titleHtml: 'Elegancki debiut<br>w plenerowej <span class="accent">scenerii.</span>',
      paras: [
        'Dla naszego wieloletniego partnera, <strong>Grupy Plichta</strong>, zrealizowaliśmy plenerową premierę flagowego DENZA Z9 GT. Marka premium potrzebowała oprawy, która połączy technologiczny charakter auta z lekką, letnią atmosferą wydarzenia.',
        'Zamiast sali wystawowej postawiliśmy na pole golfowe w Tokarach: zieleń, białe podesty ekspozycyjne, hortensje i elegancki wystrój ogrodowy, na których morskie i srebrne nadwozia Z9 GT wyglądały jak na wybiegu.',
      ],
    },
    {
      type: 'steps',
      screen: 'Realizacja',
      no: 'REALIZACJA',
      titleHtml: 'Od scenografii<br>po materiały na żywo.',
      padTop0: true,
      items: [
        { no: 'V1, 01', title: 'Scenografia i podesty', desc: 'Białe, lakierowane podesty ekspozycyjne, ścianka premierowa Z9 GT, tablice ze specyfikacją i dekoracje kwiatowe wkomponowane w zieleń pola golfowego.' },
        { no: 'V1, 02', title: 'Ekspozycja modeli', desc: 'Prezentacja dwóch wersji kolorystycznych Z9 GT, morskiej i srebrnej, ustawionych tak, by pokazać sylwetkę, detale nadwozia i 21-calowe felgi z pełną czytelnością.' },
        { no: 'V1, 03', title: 'Detale i wnętrze', desc: 'Zdjęcia detali: reflektorów, felg, bordowej i ciemnej tapicerki oraz centralnego ekranu, pokazujące poziom wykończenia auta segmentu premium.' },
        { no: 'V1, 04', title: 'Content production na żywo', desc: 'Pełna obsługa foto i wideo podczas wydarzenia: reportaż, ujęcia produktowe i materiały social gotowe do publikacji tuż po premierze.' },
      ],
    },
    {
      type: 'gallery',
      aria: 'Kadry z realizacji',
      rows: [
        {
          shots: [
            {
              src: '/assets/portfolio/denza/denza-z9-gt-premiera-fotografia-12.jpg',
              alt: 'DENZA Z9 GT w kolorze morskim z otwartymi drzwiami na scenie premierowej z tablicą specyfikacji',
              tag: 'Scena · Premiera',
              figureClass: 'cs-shot--wide',
              parallax: 30,
              tc: '00:01:04:11',
            },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/denza/denza-z9-gt-premiera-fotografia-03.jpg', alt: 'Srebrny DENZA Z9 GT na trawie pola golfowego przed drewnianą wiatą', tag: 'EXT · Srebrny', figureClass: 'cs-shot--tall', parallax: 24, tc: '00:02:18:03' },
            { src: '/assets/portfolio/denza/denza-z9-gt-premiera-fotografia-07.jpg', alt: 'Wnętrze DENZA Z9 GT z bordową tapicerką i centralnym ekranem', tag: 'INT · Bordo', figureClass: 'cs-shot--tall', delay: true, parallax: 24, tc: '00:03:41:22' },
          ],
        },
        {
          shots: [
            { src: '/assets/portfolio/denza/denza-z9-gt-premiera-fotografia-04.jpg', alt: 'Srebrny DENZA Z9 GT z boku na tle wiaty pola golfowego', tag: 'EXT · Sylwetka', figureClass: 'cs-shot--full', parallax: 30, tc: '00:05:09:14' },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/denza/denza-z9-gt-premiera-fotografia-05.jpg', alt: 'Zbliżenie na front morskiego DENZA Z9 GT przy ściance premierowej', tag: 'Detal · Front', figureClass: 'cs-shot--tall', parallax: 24, tc: '00:06:33:09' },
            { src: '/assets/portfolio/denza/denza-z9-gt-premiera-fotografia-11.jpg', alt: 'Zbliżenie na 21-calową felgę srebrnego DENZA Z9 GT', tag: 'Detal · Felga', figureClass: 'cs-shot--tall', delay: true, parallax: 24, tc: '00:07:21:05' },
          ],
        },
        {
          shots: [
            { src: '/assets/portfolio/denza/denza-z9-gt-premiera-fotografia-09.jpg', alt: 'Przygotowanie ekspozycji morskiego DENZA Z9 GT na podeście przy ściance premierowej', tag: 'Behind · Setup', figureClass: 'cs-shot--full', parallax: 30, tc: '00:08:44:20' },
          ],
        },
      ],
    },
  ],
  quote: {
    text: 'Plenerowa sceneria pola golfowego i dopracowana ekspozycja pozwoliły pokazać DENZA Z9 GT dokładnie tak, jak zasługuje marka premium: elegancko, spokojnie i z dbałością o każdy detal.',
    by: '– <b>Zespół SEZMOO</b> · Realizacja full-service',
  },
  next: {
    href: '/realizacja-exlantix/',
    aria: 'Następna realizacja, EXLANTIX',
    k: 'Następna realizacja →',
    title: 'EXLANTIX',
    cat: 'Event · Premiera marki',
    image: '/assets/portfolio/exlantix/exlantix-premiera-marki-gdansk-fotografia-21.jpg',
    alt: 'Premiera marki EXLANTIX w Gdańsku',
  },
};

export const denza: LongformDef = { id: 'denza', pl };
