import type { LongformCopy, LongformDef } from '../types';

const pl: LongformCopy = {
  title: 'Premiera marki EXLANTIX w Gdańsku · Realizacja SEZMOO',
  description:
    'Case study SEZMOO: premiera marki EXLANTIX w Polskiej Filharmonii Bałtyckiej w Gdańsku. Koncepcja, scenografia zewnętrzna, technika sceniczna, reżyseria światła oraz produkcja foto i wideo.',
  schemaName: 'Premiera marki EXLANTIX w Gdańsku',
  hero: {
    frame: true,
    image: '/assets/portfolio/exlantix/exlantix-premiera-marki-gdansk-fotografia-21.jpg',
    alt: 'EXLANTIX ES na podeście, nocna scena przed Filharmonią Bałtycką w Gdańsku',
    hud: ['REC · 4K · 25FPS', '00:00:12:08', 'GDAŃSK / PL'],
    cat: 'SEZMOO × Grupa Plichta × EXLANTIX · Premiera marki',
    titleLead: 'Premiera marki<br>',
    titleAccent: 'EXLANTIX.',
    sub: 'Premiera chińskich samochodów elektrycznych premium w <b>Polskiej Filharmonii Bałtyckiej</b> na gdańskiej Ołowiance. Auta stały w otwartej przestrzeni nabrzeża, więc mogli je oglądać także przechodnie.',
  },
  meta: [
    { k: 'Klient', v: 'Grupa Plichta', small: 'EXLANTIX Polska' },
    { k: 'Lokalizacja', v: 'Filharmonia Bałtycka', small: 'Ołowianka, Gdańsk' },
    { k: 'Modele', v: 'ES · ET', small: 'Limuzyna i SUV EV' },
    { k: 'Format', v: 'Premiera', small: 'Gala dla mediów i biznesu' },
    { k: 'Zakres', v: 'Full-service', small: 'Event · Technika · Foto/wideo' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'O projekcie',
      no: 'O PROJEKCIE',
      titleHtml: 'Nowa marka premium,<br>oprawa na <span class="accent">jej poziomie.</span>',
      paras: [
        'Wprowadzenie zupełnie nowej marki motoryzacyjnej segmentu premium na polski rynek wymaga oprawy, która od pierwszych sekund definiuje jej status. Dla naszego wieloletniego partnera, <strong>Grupy Plichta</strong>, zrealizowaliśmy oficjalną premierę elektrycznych samochodów EXLANTIX.',
        'Wyzwaniem było stworzenie spójnego wizerunkowo wydarzenia dla mediów i gości biznesowych, które połączy surową, ceglaną architekturę gdańskiej Ołowianki z ultra-nowoczesną tożsamością marki. Auta wyeksponowaliśmy w otwartej strefie nabrzeża, więc premiera przyciągała też uwagę przechodniów.',
      ],
    },
    {
      type: 'steps',
      screen: 'Realizacja',
      no: 'WYZWANIA I REALIZACJA',
      titleHtml: 'Od podestów pod auta<br>po galę we wnętrzach.',
      padTop0: true,
      items: [
        { no: 'V1, 01', title: 'Strefa ekspozycyjna i scena pod auta', desc: 'Zaprojektowaliśmy i wybudowaliśmy od zera wzmocnione podesty oraz zewnętrzną scenę ekspozycyjną przed Filharmonią. Konstrukcja bezpiecznie i stabilnie eksponowała dwa flagowe, ciężkie modele elektryczne: limuzynę ES i SUV-a ET.' },
        { no: 'V1, 02', title: 'Reżyseria światła po zmroku', desc: 'Dedykowana architektura oświetleniowa dla całej strefy zewnętrznej. Po zmroku precyzyjnie wyreżyserowane, dynamiczne światło eksponowało linie nadwozia, tworząc efekt widoczny z drugiego brzegu Motławy.' },
        { no: 'V1, 03', title: 'Gala i multimedia we wnętrzach', desc: 'Pełna metamorfoza i zabezpieczenie technologiczne wnętrz: wielkoformatowe ekrany LED, nagłośnienie konferencyjne oraz oprawa multimedialna prezentacji produktowych prowadzonych przez dyrekcję marki, zakończona uroczystą kolacją.' },
        { no: 'V1, 04', title: 'Content production na żywo', desc: 'Równolegle prowadziliśmy pełną obsługę foto i wideo w formule „on the go”: dynamiczne rolki, setki operatorskie i reportaż, które natychmiast trafiały do sieci, budując zasięg wydarzenia w social media i portalach branżowych.' },
      ],
    },
    {
      type: 'gallery',
      aria: 'Kadry z realizacji',
      rows: [
        {
          shots: [
            { src: '/assets/portfolio/exlantix/exlantix-premiera-marki-gdansk-fotografia-26.jpg', alt: 'Odsłonięcie czerwonego EXLANTIX ES na scenie o zmroku', tag: 'EXT · Odsłonięcie', figureClass: 'cs-shot--wide', parallax: 30, tc: '00:01:04:11' },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/exlantix/exlantix-premiera-marki-gdansk-fotografia-25.jpg', alt: 'EXLANTIX ET nocą na tle podświetlonego koła widokowego w Gdańsku', tag: 'EXT · Noc', figureClass: 'cs-shot--tall', parallax: 24, tc: '00:02:18:03' },
            { src: '/assets/portfolio/exlantix/exlantix-premiera-marki-gdansk-fotografia-24.jpg', alt: 'Prezentacja EXLANTIX ES z hostessami na scenie premierowej', tag: 'Scena · Prezentacja', figureClass: 'cs-shot--tall', delay: true, parallax: 24, tc: '00:03:41:22' },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/exlantix/exlantix-premiera-marki-gdansk-fotografia-18.jpg', alt: 'Prezentacja na scenie podczas gali EXLANTIX, ekran LED i publiczność', tag: 'INT · Gala', figureClass: 'cs-shot--tall', parallax: 24, tc: '00:04:52:07' },
            { src: '/assets/portfolio/exlantix/exlantix-premiera-marki-gdansk-fotografia-04.jpg', alt: 'Uroczysta kolacja podczas premiery, obsługa cateringowa przy stołach', tag: 'INT · Kolacja', figureClass: 'cs-shot--tall', delay: true, parallax: 24, tc: '00:05:33:18' },
          ],
        },
        {
          shots: [
            { src: '/assets/portfolio/exlantix/exlantix-premiera-marki-gdansk-fotografia-21.jpg', alt: 'Czerwony EXLANTIX ES na podeście nocą, oświetlenie sceniczne', tag: 'EXT · Ekspozycja', figureClass: 'cs-shot--full', parallax: 30, tc: '00:06:09:14' },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/exlantix/exlantix-premiera-marki-gdansk-fotografia-07.jpg', alt: 'Wnętrze EXLANTIX, jasna skóra i centralny ekran', tag: 'INT · Detal', figureClass: 'cs-shot--tall', parallax: 24, tc: '00:07:21:05' },
            { src: '/assets/portfolio/exlantix/exlantix-premiera-marki-gdansk-fotografia-11.jpg', alt: 'Zielony EXLANTIX ES na tle napisu GDAŃSK o zachodzie słońca', tag: 'EXT · Miasto', figureClass: 'cs-shot--tall', delay: true, parallax: 24, tc: '00:08:44:20' },
          ],
        },
        {
          shots: [
            { src: '/assets/portfolio/exlantix/exlantix-premiera-marki-gdansk-fotografia-02.jpg', alt: 'Wejście do Polskiej Filharmonii Bałtyckiej z flagami EXLANTIX i Plichta', tag: 'EXT · Wejście', figureClass: 'cs-shot--full', parallax: 30, tc: '00:09:58:02' },
          ],
        },
      ],
    },
    {
      type: 'film',
      screen: 'Film',
      no: 'FILM',
      titleHtml: 'Zobacz, jak <span class="accent">żyła</span> premiera.',
      lead: 'Aftermovie i premierowa rolka z wieczoru na Ołowiance, złożone z materiału realizowanego na żywo podczas wydarzenia.',
      videoId: 'oWiVSRYtLoU',
      poster: '/assets/portfolio/exlantix/exlantix-premiera-marki-gdansk-fotografia-21.jpg',
      alt: 'Odtwórz aftermovie z premiery EXLANTIX',
      recLabel: 'EXLANTIX, AFTERMOVIE',
      extras: ['SHORT', '4K · 25FPS'],
      noteHtml:
        'Zobacz też: <a href="https://www.youtube.com/shorts/tgcCHgkOM4I" target="_blank" rel="noopener" style="color:var(--rec)">premierowa rolka na YouTube →</a>',
    },
  ],
  quote: {
    text: 'Połączenie perfekcyjnej logistyki plenerowej, widowiskowej inżynierii świetlnej i eleganckiej oprawy wewnątrz filharmonii dało spójne, dopracowane w każdym detalu doświadczenie wizerunkowe, które przypieczętowało rynkowy debiut EXLANTIX.',
    by: '– <b>Zespół SEZMOO</b> · Realizacja full-service',
  },
  next: {
    href: '/realizacja-world-of-warships/',
    aria: 'Następna realizacja, World of Warships',
    k: 'Następna realizacja →',
    title: 'World of Warships',
    cat: 'Event · Strefa Gracza',
    image: '/assets/work/captains-club-ext.avif',
    alt: "World of Warships, Captain's Club",
  },
};

export const exlantix: LongformDef = { id: 'exlantix', pl };
