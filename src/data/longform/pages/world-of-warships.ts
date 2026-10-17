import type { LongformCopy, LongformDef } from '../types';

const pl: LongformCopy = {
  title: '10 lat World of Warships, Strefa Gracza · Realizacja SEZMOO',
  description:
    "Case study SEZMOO: budowa Strefy Gracza (Captain's Club) w Muzeum Marynarki Wojennej w Gdyni i event otwierający 10-lecie World of Warships.",
  schemaName: '10 lat World of Warships, Strefa Gracza',
  back: { href: '/#work', label: '← Portfolio / Realizacje' },
  hero: {
    frame: true,
    image: '/assets/work/captains-club-ext.avif',
    alt: "Captain's Club, podświetlony kontener World of Warships nocą w Gdyni",
    hud: ['REC · 4K · 25FPS', '00:00:12:08', 'GDYNIA / PL'],
    cat: "SEZMOO × Wargaming × Muzeum MW · Captain's Club",
    titleLead: '10 lat<br>World of ',
    titleAccent: 'Warships.',
    sub: 'Od pustego kontenera do w pełni wyposażonego pokoju gier. Stała Strefa Gracza, <b>Captain\'s Club</b>, w Muzeum Marynarki Wojennej w Gdyni, i event otwierający <span style="white-space:nowrap">10-lecie</span> marki.',
  },
  meta: [
    { k: 'Klient', v: 'World of Warships', small: 'Wargaming' },
    { k: 'Partner', v: 'Muzeum MW', small: 'Gdynia' },
    { k: 'Okazja', v: '10-lecie', small: 'World of Warships' },
    { k: 'Rok', v: '2025', small: 'Strefa Gracza' },
    { k: 'Zakres', v: 'Budowa · Film · Event', small: 'Produkcja end-to-end' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'Wyzwanie',
      no: 'WYZWANIE',
      titleHtml: 'Od pustego kontenera<br>do pełnego <span class="accent">pokoju gier.</span>',
      paras: [
        'Jeden z najbardziej złożonych projektów, jakie realizowaliśmy. <strong>SEZMOO odpowiadało za całość</strong>, od koordynacji budowy, przez materiały wideo przed wydarzeniem i dokumentację foto-wideo, po organizację i przeprowadzenie eventu inauguracyjnego.',
        'Pokój gier, Captain\'s Club, zaprojektowali Jarosław Chodoniuk i Agnieszka Hinca, a samo wydarzenie otwierające trafiło do naszego kalendarza zaledwie <strong>cztery tygodnie</strong> przed oficjalnym otwarciem w Muzeum Marynarki Wojennej w Gdyni.',
      ],
    },
    {
      type: 'steps',
      screen: 'Proces',
      no: 'PROCES',
      titleHtml: 'Od koordynacji budowy<br>po wieczór otwarcia.',
      padTop0: true,
      items: [
        { no: 'V1, 01', title: 'Koordynacja budowy', desc: 'Od pustego kontenera po gotowy pokój gier. Projekt wnętrza: Jarosław Chodoniuk i Agnieszka Hinca, konstrukcja, Jarek.' },
        { no: 'V1, 02', title: 'Materiały zapowiadające', desc: 'Produkcja wideo jeszcze przed wydarzeniem, budowanie zasięgu i napięcia przed otwarciem Strefy Gracza.' },
        { no: 'V1, 03', title: 'Dokumentacja', desc: 'Foto i wideo z budowy oraz wieczoru otwarcia, pełna dokumentacja zarówno procesu, jak i efektu.' },
        { no: 'V1, 04', title: 'Event otwarcia', desc: 'Organizacja i przeprowadzenie wieczoru inauguracyjnego. Na przygotowanie całości mieliśmy cztery tygodnie.' },
        { no: 'V1, 05', title: 'Postprodukcja', desc: 'Montaż i finalne formaty pod kanały marki i partnerów. Część materiału wciąż jest w obróbce.' },
      ],
    },
    {
      type: 'gallery',
      aria: 'Kadry z realizacji',
      rows: [
        {
          shots: [
            { src: '/assets/work/warships-container.avif', alt: 'Kontener World of Warships za dnia przy Bulwarze w Gdyni', tag: 'EXT · Dzień', figureClass: 'cs-shot--wide', parallax: 30, tc: '00:01:04:11' },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/work/captains-club-int.avif', alt: 'Wnętrze Captain\'s Club, stanowiska gamingowe w kontenerze', tag: 'INT · Stanowiska', figureClass: 'cs-shot--tall', parallax: 24, tc: '00:02:18:03' },
            { src: '/assets/work/captains-club-1.avif', alt: 'Neon Captain\'s Club i ekran z rozgrywką World of Warships', tag: 'INT · Detal', figureClass: 'cs-shot--tall', delay: true, parallax: 24, tc: '00:03:41:22' },
          ],
        },
        {
          shots: [
            { src: '/assets/work/captains-club-ext.avif', alt: 'Captain\'s Club nocą, podświetlony kontener w barwach marki', tag: 'EXT · Noc', figureClass: 'cs-shot--full', parallax: 30, tc: '00:05:09:14' },
          ],
        },
      ],
    },
    {
      type: 'film',
      screen: 'Film',
      no: 'FILM',
      titleHtml: 'Zobacz, jak to <span class="accent">żyje</span> w ruchu.',
      lead: 'Materiał z budowy i wieczoru otwarcia Strefy Gracza, naval\'owa opowieść o miejscu, które powstało od zera.',
      videoId: '',
      poster: '/assets/work/captains-club-ext.avif',
      alt: 'Odtwórz film Captain\'s Club',
      recLabel: "CAPTAIN'S CLUB, AFTERMOVIE",
      extras: ['01:48', '4K · 25FPS'],
    },
  ],
  quote: {
    text: 'Od pustego kontenera do w pełni wyposażonego pokoju gier, droga była długa i pełna wyzwań. Efekt jest dokładnie taki, jak sobie wyobrażaliśmy.',
    by: '– <b>Maciej Tyma</b> · SEZMOO Creative Agency',
  },
  next: {
    href: '/#work',
    aria: 'Następna realizacja, Audi RS',
    k: 'Następna realizacja →',
    title: 'Audi RS',
    cat: 'Automotive · Premium film',
    image: '/assets/work/audi-a6-etron.jpg',
    alt: 'Audi RS, premium film',
  },
};

export const worldOfWarships: LongformDef = { id: 'world-of-warships', pl };
