import type { LongformCopy, LongformDef } from '../types';

const poster = '/assets/portfolio/doraco-tvp/doraco-hala-zdjeciowa-tvp-zdjecia-z-drona-01.jpg';

const pl: LongformCopy = {
  title: 'DORACO · Hala zdjęciowa TVP · Film i foto · Realizacja SEZMOO',
  description: 'Case study SEZMOO: film i zdjęcia z drona z budowy hali zdjęciowej TVP realizowanej przez DORACO.',
  schemaName: 'DORACO · Hala zdjęciowa TVP · Film i foto',
  hero: {
    image: poster,
    alt: 'Hala zdjęciowa TVP zbudowana przez DORACO – zdjęcie z drona',
    hud: ['FILM · FOTO', 'DRON', 'BUDOWNICTWO / PL'],
    cat: 'SEZMOO × DORACO · Hala zdjęciowa TVP',
    titleLead: 'DORACO<br>',
    titleAccent: '× TVP.',
    sub: 'Film i&nbsp;zdjęcia z&nbsp;drona dla <b>DORACO</b> –&nbsp;generalnego wykonawcy hali zdjęciowej Telewizji Polskiej. Dokumentacja inwestycji, która pokazuje skalę i&nbsp;precyzję budowy.',
  },
  meta: [
    { k: 'Klient', v: 'DORACO', small: 'Generalny wykonawca' },
    { k: 'Branża', v: 'Budownictwo', small: 'Kubatura' },
    { k: 'Inwestycja', v: 'Hala zdjęciowa', small: 'Telewizja Polska' },
    { k: 'Zakres', v: 'Film + foto', small: 'Dron · Naziemne' },
    { k: 'Cel', v: 'Prezentacja', small: 'Referencja' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'O PROJEKCIE',
      no: 'O PROJEKCIE',
      titleHtml: 'Budowa, którą<br>trzeba <span class="accent">pokazać.</span>',
      paras: [
        'Hala zdjęciowa dla TVP to obiekt nietypowy: duża kubatura, wymagająca akustyka i&nbsp;technika studyjna. Dla DORACO to&nbsp;mocna referencja –&nbsp;pod warunkiem, że da się ją dobrze pokazać.',
        'Zrealizowaliśmy film i&nbsp;serię zdjęć z&nbsp;drona oraz z&nbsp;ziemi. Materiał pokazuje obiekt w&nbsp;całości i&nbsp;w&nbsp;detalu, a&nbsp;DORACO wykorzystuje go w&nbsp;ofertach, na&nbsp;stronie i&nbsp;w&nbsp;social mediach.',
      ],
    },
    {
      type: 'steps',
      screen: 'PODEJŚCIE',
      padTop0: true,
      no: 'PODEJŚCIE',
      titleHtml: 'Od planu<br>do&nbsp;<span class="accent">montażu.</span>',
      items: [
        { no: 'W1, 01', title: 'Plan zdjęć', desc: 'Ujęcia zaplanowane pod konstrukcję i&nbsp;światło –&nbsp;tak, żeby oddać skalę obiektu i&nbsp;jego otoczenie.' },
        { no: 'W1, 02', title: 'Dron', desc: 'Przeloty nad halą i&nbsp;ujęcia z&nbsp;góry, które pokazują bryłę budynku w&nbsp;całości.' },
        { no: 'W1, 03', title: 'Ujęcia z&nbsp;ziemi', desc: 'Detale konstrukcji, wnętrze i&nbsp;praca ekipy na&nbsp;budowie.' },
        { no: 'W1, 04', title: 'Montaż i&nbsp;foto', desc: 'Film prezentacyjny i&nbsp;wyselekcjonowane zdjęcia gotowe do&nbsp;ofert i&nbsp;publikacji.' },
      ],
    },
    {
      type: 'film',
      screen: 'FILM',
      no: 'FILM',
      titleHtml: 'Hala TVP<br><span class="accent">z&nbsp;bliska i&nbsp;z&nbsp;góry.</span>',
      lead: 'Film prezentacyjny inwestycji łączący ujęcia z&nbsp;drona z&nbsp;materiałem nagranym na&nbsp;budowie.',
      videoId: 'phXKtUNlDuM',
      poster: '/assets/video/yt/posters/phXKtUNlDuM.webp',
      alt: 'Odtwórz film DORACO – hala zdjęciowa TVP',
      recLabel: 'DORACO, HALA TVP',
    },
    { type: 'heading', screen: 'FOTOGRAFIA · DRON', padBottom0: true, no: 'FOTOGRAFIA · DRON', titleHtml: 'Skala obiektu<br>w&nbsp;jednym kadrze.' },
    {
      type: 'gallery',
      aria: 'FOTOGRAFIA · DRON',
      rows: [
        { shots: [{ src: '/assets/portfolio/doraco-tvp/doraco-hala-zdjeciowa-tvp-zdjecia-z-drona-02.jpg', alt: 'Bryła hali zdjęciowej TVP z lotu ptaka', tag: 'Dron · Z góry', ratio: '16/9' }] },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/doraco-tvp/doraco-hala-zdjeciowa-tvp-zdjecia-z-drona-04.jpg', alt: 'Hala zdjęciowa TVP i otoczenie – fotografia z drona', tag: 'Dron · Otoczenie', ratio: '4/3' },
            { src: '/assets/portfolio/doraco-tvp/doraco-hala-zdjeciowa-tvp-zdjecia-z-drona-05.jpg', alt: 'Dach i konstrukcja hali zdjęciowej TVP – DORACO', tag: 'Dron · Detal', ratio: '4/3', delay: true },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/doraco-tvp/doraco-hala-zdjeciowa-tvp-zdjecia-z-drona-03.jpg', alt: 'Budowa hali TVP – zdjęcie z drona, DORACO', tag: 'Dron · Budowa', ratio: '4/3' },
            { src: poster, alt: 'Hala zdjęciowa TVP zbudowana przez DORACO – zdjęcie z drona', tag: 'Dron · Bryła', ratio: '4/3', delay: true },
          ],
        },
      ],
    },
  ],
  quote: {
    text: 'Dobra referencja to taka, którą widać. Pokazaliśmy halę TVP tak, jak zasługuje na&nbsp;to ta inwestycja.',
    by: '– <b>Zespół SEZMOO</b> · Film i&nbsp;fotografia z&nbsp;drona',
  },
  next: {
    href: '/portfolio/',
    aria: 'Wróć do portfolio',
    k: 'Zobacz więcej →',
    title: 'Portfolio',
    cat: 'Wszystkie realizacje SEZMOO',
    image: '/assets/portfolio/doraco-tvp/doraco-hala-zdjeciowa-tvp-zdjecia-z-drona-03.jpg',
    alt: '',
  },
};

const en: LongformCopy = {
  title: 'DORACO · TVP sound stage · Film and photo · SEZMOO case study',
  description: 'SEZMOO case study: film and drone photography of the TVP sound stage built by DORACO.',
  schemaName: 'DORACO · TVP sound stage · Film and photo',
  hero: {
    image: poster,
    alt: 'TVP sound stage built by DORACO – drone photo',
    hud: ['FILM · PHOTO', 'DRONE', 'CONSTRUCTION / PL'],
    cat: 'SEZMOO × DORACO · TVP sound stage',
    titleLead: 'DORACO<br>',
    titleAccent: '× TVP.',
    sub: 'Film and drone photography for <b>DORACO</b>, general contractor of the Polish Television sound stage. Documentation that shows the scale and precision of the build.',
  },
  meta: [
    { k: 'Client', v: 'DORACO', small: 'General contractor' },
    { k: 'Industry', v: 'Construction', small: 'Volume building' },
    { k: 'Project', v: 'Sound stage', small: 'Polish Television' },
    { k: 'Scope', v: 'Film + photo', small: 'Drone · Ground' },
    { k: 'Goal', v: 'Presentation', small: 'Reference' },
  ],
  blocks: [
    {
      type: 'intro',
      screen: 'PROJECT',
      no: 'PROJECT',
      titleHtml: 'A build that<br>deserves to be <span class="accent">seen.</span>',
      paras: [
        'A TVP sound stage is an unusual building: large volume, demanding acoustics and studio tech. For DORACO it is a strong reference – if it can be shown well.',
        'We delivered a film and a series of drone and ground photos. The material shows the building as a whole and in detail; DORACO uses it in pitches, on the website and on social media.',
      ],
    },
    {
      type: 'steps',
      screen: 'THE APPROACH',
      padTop0: true,
      no: 'THE APPROACH',
      titleHtml: 'From plan<br>to <span class="accent">final cut.</span>',
      items: [
        { no: 'W1, 01', title: 'Shot plan', desc: 'Shots planned around structure and light – to capture the scale of the building and its surroundings.' },
        { no: 'W1, 02', title: 'Drone', desc: 'Passes over the hall and overhead frames that show the whole volume.' },
        { no: 'W1, 03', title: 'Ground shots', desc: 'Construction details, interiors and the crew on site.' },
        { no: 'W1, 04', title: 'Edit and stills', desc: 'A presentation film and selected photos ready for pitches and publication.' },
      ],
    },
    {
      type: 'film',
      screen: 'FILM',
      no: 'FILM',
      titleHtml: 'The TVP hall<br><span class="accent">up close and from above.</span>',
      lead: 'A presentation film of the investment, mixing drone shots with material recorded on the build.',
      videoId: 'phXKtUNlDuM',
      poster: '/assets/video/yt/posters/phXKtUNlDuM.webp',
      alt: 'Play the DORACO film – TVP sound stage',
      recLabel: 'DORACO, TVP HALL',
    },
    { type: 'heading', screen: 'PHOTOGRAPHY · DRONE', padBottom0: true, no: 'PHOTOGRAPHY · DRONE', titleHtml: 'The scale of the building<br>in one frame.' },
    {
      type: 'gallery',
      aria: 'PHOTOGRAPHY · DRONE',
      rows: [
        { shots: [{ src: '/assets/portfolio/doraco-tvp/doraco-hala-zdjeciowa-tvp-zdjecia-z-drona-02.jpg', alt: 'The TVP sound stage volume from above', tag: 'Drone · Overhead', ratio: '16/9' }] },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/doraco-tvp/doraco-hala-zdjeciowa-tvp-zdjecia-z-drona-04.jpg', alt: 'TVP sound stage and surroundings – drone photography', tag: 'Drone · Surroundings', ratio: '4/3' },
            { src: '/assets/portfolio/doraco-tvp/doraco-hala-zdjeciowa-tvp-zdjecia-z-drona-05.jpg', alt: 'Roof and structure of the TVP sound stage – DORACO', tag: 'Drone · Detail', ratio: '4/3', delay: true },
          ],
        },
        {
          split: true,
          shots: [
            { src: '/assets/portfolio/doraco-tvp/doraco-hala-zdjeciowa-tvp-zdjecia-z-drona-03.jpg', alt: 'TVP hall construction – drone photo, DORACO', tag: 'Drone · Build', ratio: '4/3' },
            { src: poster, alt: 'TVP sound stage built by DORACO – drone photo', tag: 'Drone · Volume', ratio: '4/3', delay: true },
          ],
        },
      ],
    },
  ],
  quote: {
    text: 'A good reference is one you can see. We showed the TVP hall the way this investment deserves.',
    by: '– <b>SEZMOO team</b> · Film and drone photography',
  },
  next: {
    href: '/en/portfolio-en/',
    aria: 'Back to portfolio',
    k: 'See more →',
    title: 'Portfolio',
    cat: 'All SEZMOO work',
    image: '/assets/portfolio/doraco-tvp/doraco-hala-zdjeciowa-tvp-zdjecia-z-drona-03.jpg',
    alt: '',
  },
};

export const doracoHalaTvp: LongformDef = { id: 'doraco-hala-tvp', pl, en };
