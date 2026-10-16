/** Video case studies keyed by YouTube id — PL + EN copy. */

export type CaseStudyLang = 'pl' | 'en';

/** Meta cell: [label, value, small] */
export type CaseStudyKv = [string, string, string];

/** Step: [title, description] */
export type CaseStudyStep = [string, string];

export interface CaseStudyCopy {
  title: string;
  /** Optional accent fragment (PL data); H1 uses last title word when absent. */
  accent?: string;
  client: string;
  cat: string;
  short: boolean;
  kv: CaseStudyKv[];
  lead: string;
  /** May contain trusted HTML (e.g. span.accent). */
  intro: string;
  context: string[];
  steps: CaseStudyStep[];
}

export interface CaseStudy {
  youtubeId: string;
  pl: CaseStudyCopy;
  en: CaseStudyCopy;
}

/** Display / next-nav order (shared across languages). */
export const CASE_STUDY_ORDER: readonly string[] = [
  'WG5ufZMfjQ8',
  '4DTDakWPmfM',
  'Hdnf6zcn3bA',
  'c_5toy1IhIs',
  'X8-hf_cyZxE',
  'O5iF7SxqX1I',
  'jco18tIaCT0',
  'NHEIfdgr9mI',
  'wVy04YYnbRM',
  'iknT-xURZag',
  'tvTuMX3mxG4',
  'lD11UTII6Ko',
  '7HZN5VCTvoo',
  'lOwJMPKMdYA',
  'WszuntCE51c'
] as const;

export const CASE_STUDIES: Record<string, CaseStudy> = {
  'WG5ufZMfjQ8': {
    youtubeId: 'WG5ufZMfjQ8',
    pl: {
      title: "Trailer RS5",
      accent: "RS5.",
      client: "Audi RS5",
      cat: "Automotive · Trailer",
      short: true,
      kv: [
        ["Klient", "Audi RS5", "Automotive"],
        ["Format", "Short", "Pionowy 9:16"],
        ["Zakres", "Zdjęcia · Montaż", "Produkcja"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Premierowy teaser Audi RS 5, ciemny, atmosferyczny materiał, który buduje napięcie przed pokazem samochodu.",
      intro: "Charakter auta bez zdradzania wszystkiego <span class='accent'>od razu.</span>",
      context: [
        "Premiera Audi RS 5 wymagała materiału, który zbuduje napięcie przed pokazem samochodu i jednocześnie zaprosi odbiorców na indywidualne pokazy premierowe w Audi Gdańsk Stadion. Kluczowe było pokazanie charakteru auta bez zdradzania wszystkiego od razu.",
        "Zamiast klasycznej prezentacji modelu stworzyliśmy ciemny, atmosferyczny teaser oparty na detalach, świetle i stopniowym odsłanianiu samochodu, tak, żeby wzbudzić ciekawość i skierować odbiorców na wydarzenie.",
      ],
      steps: [
        ["Koncept teasera", "Zaprojektowaliśmy narrację prowadzącą od tajemnicy: przykryte auto, fragmenty karoserii, światła, linia nadwozia, aż do czytelnego komunikatu."],
        ["Zdjęcia", "Zarejestrowaliśmy detale, światło i sylwetkę auta pod pionowy kadr 9:16, bez zdradzania całości od razu."],
        ["Montaż", "Ułożyliśmy stopniowe odsłanianie samochodu aż do planszy zapraszającej na premierowe pokazy w Audi Gdańsk Stadion."],
        ["Dostawa", "Powstał krótki pionowy materiał social, który łączy emocję premiery z konkretnym celem: wzbudzić ciekawość wokół modelu RS 5."],
      ],
    },
    en: {
      title: "Trailer RS5",
      client: "Audi RS5",
      cat: "Automotive · Trailer",
      short: true,
      kv: [
        ["Client", "Audi RS5", "Automotive"],
        ["Format", "Short", "Vertical 9:16"],
        ["Scope", "Shooting · Edit", "Production"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "A premiere teaser for the Audi RS 5, a dark, atmospheric piece that builds anticipation before the car reveal.",
      intro: "The car's character, without giving it all away <span class='accent'>at once.</span>",
      context: [
        "The Audi RS 5 launch called for a piece that would build tension ahead of the reveal and invite viewers to private premiere showings at Audi Gdańsk Stadion. The key was to show the car's character without giving everything away at once.",
        "Instead of a classic model presentation, we made a dark, atmospheric teaser built on detail, light and a gradual reveal, designed to spark curiosity and drive viewers to the event.",
      ],
      steps: [
        ["Teaser concept", "We designed a narrative that leads from mystery, a covered car, body fragments, lights, the bodyline, to a clear message."],
        ["Shooting", "We captured detail, light and the car's silhouette in a vertical 9:16 frame, without revealing the whole car up front."],
        ["Edit", "We paced the gradual reveal all the way to the card inviting viewers to the premiere showings at Audi Gdańsk Stadion."],
        ["Delivery", "A short vertical social piece that ties launch emotion to a concrete goal, building curiosity around the RS 5."],
      ],
    },
  },
  '4DTDakWPmfM': {
    youtubeId: '4DTDakWPmfM',
    pl: {
      title: "#TrybWiosna",
      accent: "Wiosna.",
      client: "#TrybWiosna",
      cat: "Kampania · Influencerzy",
      short: true,
      kv: [
        ["Klient", "Grupa Plichta", "Automotive"],
        ["Format", "Kampania", "Konkurs + rolki"],
        ["Zakres", "Strategia · Produkcja", "End-to-end"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Ogólnopolska kampania #TrybWiosna, od pomysłu do startu w 7 dni, z influencerami i konkursem, rolka konkursowa ponad 1 mln wyświetleń.",
      intro: "Od pomysłu do startu w <span class='accent'>7 dni.</span>",
      context: [
        "Kampania #TrybWiosna nie zaczęła się od gotowego briefu, tylko od spotkania, na którym wspólnie z klientem szukaliśmy pomysłu, który wyróżni lokalnego dealera i skutecznie pozyska leady.",
        "Od tego momentu mieliśmy 7 dni na cały proces: strategię, koncepcję kreatywną, współpracę z influencerami, scenariusze, plan zdjęciowy i logistykę, aż po produkcję i montaż pierwszego materiału otwierającego kampanię.",
      ],
      steps: [
        ["Koncepcja w tydzień", "Przygotowaliśmy koncept kreatywny, scenariusze i copywriting, opierając kampanię na konkursie i współpracy z influencerami."],
        ["Plan zdjęciowy", "Zorganizowaliśmy dwudniowy plan zdjęciowy z udziałem twórców internetowych."],
        ["Produkcja równoległa", "Przez bardzo krótki termin produkcja i postprodukcja szły równolegle: jedna część zespołu nagrywała kolejne materiały, druga montowała pierwszą rolkę konkursową."],
        ["Efekt", "Rolka konkursowa przekroczyła 1 mln wyświetleń, a dwa kolejne materiały z influencerami po 200–300 tys. każdy. Kampania realnie wspierała leady salonu."],
      ],
    },
    en: {
      title: "#TrybWiosna",
      client: "#TrybWiosna",
      cat: "Campaign · Influencers",
      short: true,
      kv: [
        ["Client", "Grupa Plichta", "Automotive"],
        ["Format", "Campaign", "Contest + reels"],
        ["Scope", "Strategy · Production", "End-to-end"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "A nationwide #TrybWiosna campaign, from idea to launch in 7 days, with influencers and a contest, the contest reel passed 1M views.",
      intro: "From idea to launch in <span class='accent'>7 days.</span>",
      context: [
        "The #TrybWiosna campaign didn't start from a ready brief, but from a meeting where, together with the client, we searched for an idea that would set the local dealer apart and generate leads effectively.",
        "From that moment we had 7 days for the whole process: strategy, creative concept, influencer collaboration, scripts, the shooting plan and logistics, through to producing and editing the first piece that opened the campaign.",
      ],
      steps: [
        ["A concept in a week", "We prepared the creative concept, scripts and copywriting, building the campaign around a contest and influencer collaboration."],
        ["Shooting plan", "We organised a two-day shoot with online creators."],
        ["Parallel production", "Because of the tight deadline, production and post ran in parallel, one part of the team kept shooting while the other edited the first contest reel."],
        ["Result", "The contest reel passed 1M views and two further influencer pieces reached 200–300k each. The campaign directly supported the dealer's lead generation."],
      ],
    },
  },
  'Hdnf6zcn3bA': {
    youtubeId: 'Hdnf6zcn3bA',
    pl: {
      title: "JAECOO 8 × Modny Tata",
      accent: "Tata.",
      client: "JAECOO 8",
      cat: "Automotive · Lifestyle",
      short: true,
      kv: [
        ["Klient", "JAECOO 8", "Motoryzacja"],
        ["Format", "Reklama", "Lifestyle"],
        ["Zakres", "Koncept · Realizacja", "Produkcja"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Lifestyle'owa reklama JAECOO 8 z Modnym Tatą, auto dla aktywnych, od sportu po spokój w naturze.",
      intro: "Sport, droga i natura w jednym <span class='accent'>dniu.</span>",
      context: [
        "Celem było pokazanie najnowszego modelu JAECOO 8 w naturalnym kontekście życia influencera. Michał Będzmirowski, znany jako Modny Tata, wcześniej testował samochód przez tydzień, film miał domknąć tę komunikację lifestyle'owo, pokazując, jak auto wpisuje się w aktywny dzień.",
        "Zbudowaliśmy historię wokół kontrastu między dynamiką a spokojem: od sportowego rytmu i energii, przez jazdę przez naturę, aż po finał przy hamaku, książce i lesie.",
      ],
      steps: [
        ["Koncept historii", "Oparliśmy narrację na kontraście dynamiki i spokoju, JAECOO 8 jako auto, które pozwala ruszyć dalej i zjechać z codziennej trasy."],
        ["Zdjęcia", "Zarejestrowaliśmy miejski i sportowy charakter dnia oraz outdoorowy kontekst jazdy przez naturę."],
        ["Funkcja V2L na planie", "Szerszym kadrem odsłoniłismy plan zdjęciowy: funkcja V2L w JAECOO 8 zasilała nie tylko dzień Michała, ale i realizację materiału."],
        ["Dostawa", "Powstała lifestyle'owa reklama pokazująca JAECOO 8 jako auto dla osób aktywnych, niezależnych i szukających balansu."],
      ],
    },
    en: {
      title: "JAECOO 8 × Modny Tata",
      client: "JAECOO 8",
      cat: "Automotive · Lifestyle",
      short: true,
      kv: [
        ["Client", "JAECOO 8", "Automotive"],
        ["Format", "Ad", "Lifestyle"],
        ["Scope", "Concept · Production", "Production"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "A JAECOO 8 lifestyle ad with Modny Tata, a car for active people, from sport to calm in nature.",
      intro: "Sport, the road and nature in a single <span class='accent'>day.</span>",
      context: [
        "The goal was to show the latest JAECOO 8 in the natural context of an influencer's life. Michał Będzmirowski, known as Modny Tata, had already tested the car for a week, the film was to close that communication in a lifestyle way, showing how the car fits into an active day.",
        "We built the story around the contrast between energy and calm: from a sporty rhythm and energy, through a drive out into nature, to a finale by a hammock, a book and the forest.",
      ],
      steps: [
        ["Story concept", "We based the narrative on the contrast of energy and calm, the JAECOO 8 as a car that lets you push on and leave the everyday route."],
        ["Shooting", "We captured the urban, sporty character of the day and the outdoor context of driving through nature."],
        ["V2L on set", "A wider frame revealed the set: the JAECOO 8's V2L function powered not only Michał's day, but the production of the material itself."],
        ["Delivery", "A lifestyle ad showing the JAECOO 8 as a car for active, independent people looking for balance."],
      ],
    },
  },
  'c_5toy1IhIs': {
    youtubeId: 'c_5toy1IhIs',
    pl: {
      title: "Żółte RS3",
      accent: "RS3.",
      client: "Audi RS3",
      cat: "Automotive · Trailer",
      short: true,
      kv: [
        ["Klient", "Audi RS3", "Automotive"],
        ["Format", "Short", "Pionowy 9:16"],
        ["Zakres", "Zdjęcia · Montaż", "Produkcja"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Audi RS3 w dynamicznej, pionowej formie pod social, ruch, detal i mocny komunikat handlowy.",
      intro: "Charakter auta pokazany <span class='accent'>szybko.</span>",
      context: [
        "Audi RS3 to samochód, który nie potrzebuje długiego tłumaczenia. W tym projekcie chodziło o pokazanie jego charakteru w sposób szybki, atrakcyjny i dopasowany do social media.",
        "Zamiast klasycznej prezentacji auta stworzyliśmy dynamiczny film oparty na ruchu, detalach i zmianie scenerii, od pierwszego wrażenia i koloru auta, przez emocję jazdy, aż po finałowy komunikat ofertowy.",
      ],
      steps: [
        ["Koncept", "Zaprojektowaliśmy film, który nie jest tylko ładną prezentacją auta, ale pracuje sprzedażowo."],
        ["Zdjęcia", "Pokazaliśmy RS3 w kilku kontekstach: na parkingu, w mieście, w ruchu, w tunelu i na nocnych ujęciach drogowych, szerokie kadry i zbliżenia na detale."],
        ["Montaż", "Poprowadziliśmy narrację od koloru i pierwszego wrażenia, przez emocję jazdy, aż do planszy ofertowej."],
        ["Dostawa", "Powstał pionowy materiał social łączący sportowy charakter RS3 z jasnym komunikatem handlowym."],
      ],
    },
    en: {
      title: "Yellow RS3",
      client: "Audi RS3",
      cat: "Automotive · Trailer",
      short: true,
      kv: [
        ["Client", "Audi RS3", "Automotive"],
        ["Format", "Short", "Vertical 9:16"],
        ["Scope", "Shooting · Edit", "Production"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "The Audi RS3 in a dynamic, vertical form for social, motion, detail and a strong commercial message.",
      intro: "The car's character shown <span class='accent'>fast.</span>",
      context: [
        "The Audi RS3 doesn't need a long explanation. This project was about showing its character in a way that's fast, attractive and built for social media.",
        "Instead of a classic presentation, we made a dynamic film built on motion, detail and changing scenery, from the first impression and the car's colour, through the thrill of driving, to a final offer message.",
      ],
      steps: [
        ["Concept", "We designed a film that isn't just a pretty presentation of the car, but one that works for sales."],
        ["Shooting", "We showed the RS3 across several contexts: a car park, the city, in motion, a tunnel and night road shots, wide frames and close-ups on the details."],
        ["Edit", "We led the narrative from colour and first impression, through the thrill of driving, to the offer card."],
        ["Delivery", "A vertical social piece tying the RS3's sporty character to a clear commercial message."],
      ],
    },
  },
  'X8-hf_cyZxE': {
    youtubeId: 'X8-hf_cyZxE',
    pl: {
      title: "Dolphin z Kamilą",
      accent: "Dolphin.",
      client: "BYD Dolphin",
      cat: "Automotive · Lifestyle",
      short: true,
      kv: [
        ["Klient", "BYD Dolphin", "Automotive"],
        ["Format", "Short", "Pionowy 9:16"],
        ["Zakres", "Koncept · Realizacja", "Produkcja"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "BYD Dolphin w lifestyle'owej odsłonie z Kamilą, elektryk w miejskim rytmie.",
      intro: "Elektryk w miejskim <span class='accent'>rytmie.</span>",
      context: [
        "BYD Dolphin to auto miejskie i codzienne, chcieliśmy pokazać je w naturalnym kontekście, a nie w studyjnej próżni. Stąd lifestyle'owa odsłona z Kamilą jako przewodniczką po aucie.",
        "Wyzwaniem było połączyć lekki, ludzki ton z czytelną prezentacją auta, tak żeby short działał zarówno wizerunkowo, jak i informacyjnie.",
      ],
      steps: [
        ["Koncept", "Zbudowaliśmy prostą narrację, w której bohaterka pokazuje auto w codziennych sytuacjach."],
        ["Zdjęcia", "Nakręciliśmy sceny w mieście, przy naturalnym świetle, pod pionowy format."],
        ["Montaż", "Złożyliśmy dynamiczny, lekki short z rytmem pod social media."],
        ["Dostawa", "Materiał oddaliśmy gotowy do publikacji w kanałach marki."],
      ],
    },
    en: {
      title: "Dolphin with Kamila",
      client: "BYD Dolphin",
      cat: "Automotive · Lifestyle",
      short: true,
      kv: [
        ["Client", "BYD Dolphin", "Automotive"],
        ["Format", "Short", "Vertical 9:16"],
        ["Scope", "Concept · Production", "Production"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "BYD Dolphin in a lifestyle take with Kamila, an EV in the rhythm of the city.",
      intro: "An EV in the rhythm of the <span class='accent'>city.</span>",
      context: [
        "BYD Dolphin is an urban, everyday car, we wanted to show it in a natural context, not in a studio vacuum. Hence the lifestyle take with Kamila as a guide to the car.",
        "The challenge was to blend a light, human tone with a clear presentation of the car, so the short works both as image and as information.",
      ],
      steps: [
        ["Concept", "We built a simple narrative where the host shows the car in everyday situations."],
        ["Shooting", "We filmed scenes in the city, in natural light, for a vertical format."],
        ["Edit", "We assembled a dynamic, light short with a rhythm made for social media."],
        ["Delivery", "We delivered the material ready to publish across the brand's channels."],
      ],
    },
  },
  'O5iF7SxqX1I': {
    youtubeId: 'O5iF7SxqX1I',
    pl: {
      title: "Modny Tata, Padel",
      accent: "Padel.",
      client: "Modny Tata",
      cat: "Automotive · Lifestyle",
      short: true,
      kv: [
        ["Klient", "Modny Tata", "Kampania"],
        ["Format", "Short", "Pionowy 9:16"],
        ["Zakres", "Koncept · Realizacja", "Produkcja"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Kolejna odsłona „Modnego Taty”, tym razem na korcie do padla.",
      intro: "Ten sam bohater, nowa <span class='accent'>scena.</span>",
      context: [
        "Kolejny odcinek serii „Modny Tata” przenosi motoryzacyjny lifestyle na kort do padla, sport, który dobrze oddaje energię i styl bohatera.",
        "Zadaniem było utrzymać spójność serii: ten sam ton, ta sama estetyka kadru, przy nowym, świeżym kontekście.",
      ],
      steps: [
        ["Ciągłość serii", "Zachowaliśmy język wizualny znany z poprzednich odcinków, dodając kontekst padla."],
        ["Zdjęcia", "Zarejestrowaliśmy scenę na korcie i auto w tle, pod pionowy kadr."],
        ["Montaż", "Zmontowaliśmy energetyczny short spójny z resztą cyklu."],
        ["Dostawa", "Odcinek trafił do serii publikowanej na social media."],
      ],
    },
    en: {
      title: "Modny Tata, Padel",
      client: "Modny Tata",
      cat: "Automotive · Lifestyle",
      short: true,
      kv: [
        ["Client", "Modny Tata", "Campaign"],
        ["Format", "Short", "Vertical 9:16"],
        ["Scope", "Concept · Production", "Production"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Another chapter of “Modny Tata”, this time on the padel court.",
      intro: "Same character, a new <span class='accent'>scene.</span>",
      context: [
        "Another episode of the “Modny Tata” series moves the automotive lifestyle onto the padel court, a sport that captures the character's energy and style well.",
        "The task was to keep the series consistent: the same tone, the same frame aesthetic, in a fresh new context.",
      ],
      steps: [
        ["Series continuity", "We kept the visual language of earlier episodes and added the padel context."],
        ["Shooting", "We captured the court scene with the car in the background, in a vertical frame."],
        ["Edit", "We cut an energetic short consistent with the rest of the cycle."],
        ["Delivery", "The episode joined the series published on social media."],
      ],
    },
  },
  'jco18tIaCT0': {
    youtubeId: 'jco18tIaCT0',
    pl: {
      title: "CRT",
      accent: "CRT.",
      client: "CRT",
      cat: "B2B · Film wizerunkowy",
      short: false,
      kv: [
        ["Klient", "CRT", "B2B"],
        ["Format", "Film", "Wizerunkowy"],
        ["Zakres", "Produkcja · Montaż", "End-to-end"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Film wizerunkowy CRT, opowieść o marce i ludziach, którzy za nią stoją.",
      intro: "Marka, którą tworzą <span class='accent'>ludzie.</span>",
      context: [
        "Film wizerunkowy CRT miał opowiedzieć o firmie nie przez sam produkt, ale przez ludzi i sposób, w jaki pracują. To materiał budujący zaufanie w relacjach B2B.",
        "Wyzwaniem było ująć złożoną działalność w klarowną, filmową narrację, tak, żeby widz po chwili rozumiał, kim jest marka i dlaczego warto z nią rozmawiać.",
      ],
      steps: [
        ["Preprodukcja", "Ustaliliśmy strukturę narracji i kluczowe wątki, które film ma opowiedzieć."],
        ["Zdjęcia", "Zarejestrowaliśmy firmę w działaniu, ludzi, przestrzeń i procesy, w spójnej, filmowej estetyce."],
        ["Montaż i dźwięk", "Złożyliśmy opowieść z warstwą lektorską i muzyczną budującą wiarygodny ton."],
        ["Dostawa", "Oddaliśmy film gotowy na stronę, prezentacje i kanały marki."],
      ],
    },
    en: {
      title: "CRT",
      client: "CRT",
      cat: "B2B · Brand film",
      short: false,
      kv: [
        ["Client", "CRT", "B2B"],
        ["Format", "Film", "Brand"],
        ["Scope", "Production · Edit", "End-to-end"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "A CRT brand film, the story of the company and the people behind it.",
      intro: "A brand built by its <span class='accent'>people.</span>",
      context: [
        "The CRT brand film had to tell the company's story through its people and the way they work, not just the product. It's material that builds trust in B2B relationships.",
        "The challenge was to frame a complex business in a clear, cinematic narrative, so the viewer quickly understands who the brand is and why it's worth talking to.",
      ],
      steps: [
        ["Pre-production", "We set the narrative structure and the key threads the film needed to tell."],
        ["Shooting", "We captured the company at work, people, space and process, in a consistent, cinematic style."],
        ["Edit & sound", "We assembled the story with a voiceover and music that build a credible tone."],
        ["Delivery", "We delivered a film ready for the website, decks and the brand's channels."],
      ],
    },
  },
  'NHEIfdgr9mI': {
    youtubeId: 'NHEIfdgr9mI',
    pl: {
      title: "IZIPAK",
      accent: "IZIPAK.",
      client: "IZIPAK",
      cat: "B2B · Produkt",
      short: false,
      kv: [
        ["Klient", "IZIPAK", "B2B"],
        ["Format", "Film", "Produktowy"],
        ["Zakres", "Produkcja · Montaż", "End-to-end"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Produktowy film IZIPAK, pokazujemy rozwiązanie w działaniu, klarownie i konkretnie.",
      intro: "Rozwiązanie pokazane w <span class='accent'>działaniu.</span>",
      context: [
        "Produktowy film IZIPAK miał w prosty sposób pokazać, jak działa rozwiązanie i jaką realną wartość daje odbiorcy. W B2B liczy się konkret, nie ozdobniki.",
        "Zależało nam na czytelności, żeby nawet złożony produkt był zrozumiały po jednym obejrzeniu, bez potrzeby dodatkowego tłumaczenia.",
      ],
      steps: [
        ["Scenariusz", "Rozpisaliśmy film wokół realnego zastosowania produktu, krok po kroku."],
        ["Zdjęcia", "Zarejestrowaliśmy produkt w użyciu, z detalami istotnymi dla odbiorcy."],
        ["Montaż", "Uporządkowaliśmy materiał w klarowną, konkretną narrację."],
        ["Dostawa", "Film trafił do komunikacji sprzedażowej i kanałów marki."],
      ],
    },
    en: {
      title: "IZIPAK",
      client: "IZIPAK",
      cat: "B2B · Product",
      short: false,
      kv: [
        ["Client", "IZIPAK", "B2B"],
        ["Format", "Film", "Product"],
        ["Scope", "Production · Edit", "End-to-end"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "An IZIPAK product film, showing the solution in action, clearly and to the point.",
      intro: "The solution shown in <span class='accent'>action.</span>",
      context: [
        "The IZIPAK product film had to show, simply, how the solution works and the real value it gives the customer. In B2B, specifics matter more than ornament.",
        "We focused on clarity, so that even a complex product is understandable in a single watch, with no extra explanation needed.",
      ],
      steps: [
        ["Script", "We wrote the film around a real use of the product, step by step."],
        ["Shooting", "We captured the product in use, with the details that matter to the customer."],
        ["Edit", "We organised the material into a clear, concrete narrative."],
        ["Delivery", "The film went into sales communication and the brand's channels."],
      ],
    },
  },
  'wVy04YYnbRM': {
    youtubeId: 'wVy04YYnbRM',
    pl: {
      title: "PISF",
      accent: "PISF.",
      client: "PISF",
      cat: "Event · Relacja",
      short: false,
      kv: [
        ["Klient", "PISF", "Event"],
        ["Format", "Relacja", "Wideo"],
        ["Zakres", "Dokumentacja · Montaż", "Event"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Relacja wideo z wydarzenia PISF, dokumentacja atmosfery i najważniejszych momentów.",
      intro: "Wydarzenie, które warto <span class='accent'>zapamiętać.</span>",
      context: [
        "Relacja wideo z wydarzenia PISF miała utrwalić atmosferę i najważniejsze momenty, tak, żeby po fakcie można było wrócić do wydarzenia i pokazać je tym, których nie było.",
        "Praca eventowa to jedno podejście, bez powtórek, wyzwaniem było uchwycić kluczowe sceny w czasie rzeczywistym i złożyć je w spójną opowieść.",
      ],
      steps: [
        ["Plan zdjęć", "Przed wydarzeniem ustaliliśmy, które momenty i przestrzenie są kluczowe do zarejestrowania."],
        ["Dokumentacja", "Zarejestrowaliśmy przebieg wydarzenia, sceny, ludzi i atmosferę, w ruchu."],
        ["Montaż", "Złożyliśmy dynamiczną relację oddającą rytm i charakter wydarzenia."],
        ["Dostawa", "Oddaliśmy materiał gotowy do publikacji i komunikacji po evencie."],
      ],
    },
    en: {
      title: "PISF",
      client: "PISF",
      cat: "Event · Coverage",
      short: false,
      kv: [
        ["Client", "PISF", "Event"],
        ["Format", "Coverage", "Video"],
        ["Scope", "Documentation · Edit", "Event"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Video coverage of the PISF event, documenting the atmosphere and the key moments.",
      intro: "An event worth <span class='accent'>remembering.</span>",
      context: [
        "The video coverage of the PISF event had to capture the atmosphere and the key moments, so you could return to the event afterwards and show it to those who weren't there.",
        "Event work is one take, no retries, the challenge was to catch the key scenes in real time and assemble them into a coherent story.",
      ],
      steps: [
        ["Shot plan", "Before the event we agreed which moments and spaces were key to capture."],
        ["Documentation", "We captured the course of the event, scenes, people and atmosphere, in motion."],
        ["Edit", "We assembled a dynamic recap that reflects the rhythm and character of the event."],
        ["Delivery", "We delivered material ready to publish and to use in post-event communication."],
      ],
    },
  },
  'iknT-xURZag': {
    youtubeId: 'iknT-xURZag',
    pl: {
      title: "Gdańsk Miastem Kultury",
      accent: "Kultury.",
      client: "Gdańsk",
      cat: "Event · Miasto",
      short: false,
      kv: [
        ["Klient", "Miasto Gdańsk", "Event"],
        ["Format", "Relacja", "Wideo"],
        ["Zakres", "Dokumentacja · Montaż", "Event"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Gdańsk Miastem Kultury, filmowa opowieść o mieście i jego kulturalnym pulsie.",
      intro: "Miasto i jego kulturalny <span class='accent'>puls.</span>",
      context: [
        "„Gdańsk Miastem Kultury” to filmowa opowieść o mieście, o jego przestrzeniach, wydarzeniach i ludziach, którzy tworzą kulturalny krajobraz.",
        "Wyzwaniem było ująć wielowątkowy temat w spójny materiał, który oddaje charakter miasta bez popadania w suchą wyliczankę.",
      ],
      steps: [
        ["Koncept narracji", "Zbudowaliśmy opowieść łączącą różne oblicza kulturalnego Gdańska w jeden rytm."],
        ["Zdjęcia", "Zarejestrowaliśmy miasto, wydarzenia i przestrzenie w filmowej estetyce."],
        ["Montaż i dźwięk", "Złożyliśmy materiał z warstwą muzyczną budującą emocjonalny ton."],
        ["Dostawa", "Film trafił do komunikacji miejskiej i kanałów wydarzenia."],
      ],
    },
    en: {
      title: "Gdańsk City of Culture",
      client: "Gdańsk",
      cat: "Event · City",
      short: false,
      kv: [
        ["Client", "City of Gdańsk", "Event"],
        ["Format", "Coverage", "Video"],
        ["Scope", "Documentation · Edit", "Event"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Gdańsk City of Culture, a cinematic story about the city and its cultural pulse.",
      intro: "A city and its cultural <span class='accent'>pulse.</span>",
      context: [
        "“Gdańsk City of Culture” is a cinematic story about the city, its spaces, events and the people who shape its cultural landscape.",
        "The challenge was to frame a multi-threaded subject in a coherent film that captures the city's character without turning into a dry list.",
      ],
      steps: [
        ["Narrative concept", "We built a story tying the different faces of cultural Gdańsk into one rhythm."],
        ["Shooting", "We captured the city, its events and spaces in a cinematic style."],
        ["Edit & sound", "We assembled the material with a music layer that builds an emotional tone."],
        ["Delivery", "The film went into city communication and the event's channels."],
      ],
    },
  },
  'tvTuMX3mxG4': {
    youtubeId: 'tvTuMX3mxG4',
    pl: {
      title: "Baltic Towers",
      accent: "Towers.",
      client: "Baltic Towers",
      cat: "Event · Otwarcie",
      short: false,
      kv: [
        ["Klient", "Baltic Towers", "Event"],
        ["Format", "Relacja", "Wideo"],
        ["Zakres", "Dokumentacja · Montaż", "Event"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Relacja z otwarcia Baltic Towers, nowa inwestycja w filmowej odsłonie.",
      intro: "Nowa inwestycja w filmowej <span class='accent'>odsłonie.</span>",
      context: [
        "Otwarcie Baltic Towers to moment ważny dla inwestycji i marki. Relacja miała utrwalić to wydarzenie i pokazać skalę projektu w atrakcyjnej, filmowej formie.",
        "Łączyliśmy dokumentację eventu z prezentacją samego obiektu, tak, żeby materiał działał zarówno jako relacja, jak i wizytówka inwestycji.",
      ],
      steps: [
        ["Plan zdjęć", "Zaplanowaliśmy rejestrację wydarzenia i ujęcia prezentujące skalę obiektu."],
        ["Dokumentacja", "Zarejestrowaliśmy przebieg otwarcia oraz architekturę i przestrzenie."],
        ["Montaż", "Złożyliśmy relację łączącą emocję wydarzenia z prezentacją inwestycji."],
        ["Dostawa", "Materiał oddaliśmy pod komunikację inwestycji i social media."],
      ],
    },
    en: {
      title: "Baltic Towers",
      client: "Baltic Towers",
      cat: "Event · Opening",
      short: false,
      kv: [
        ["Client", "Baltic Towers", "Event"],
        ["Format", "Coverage", "Video"],
        ["Scope", "Documentation · Edit", "Event"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Coverage of the Baltic Towers opening, a new investment in a cinematic take.",
      intro: "A new investment in a cinematic <span class='accent'>take.</span>",
      context: [
        "The Baltic Towers opening is an important moment for the investment and the brand. The coverage had to capture the event and show the scale of the project in an attractive, cinematic form.",
        "We combined event documentation with a presentation of the building itself, so the material works both as coverage and as a showcase for the investment.",
      ],
      steps: [
        ["Shot plan", "We planned the event coverage and shots presenting the scale of the building."],
        ["Documentation", "We captured the opening as well as the architecture and spaces."],
        ["Edit", "We assembled coverage that blends the emotion of the event with the presentation of the investment."],
        ["Delivery", "We delivered the material for investment communication and social media."],
      ],
    },
  },
  'lD11UTII6Ko': {
    youtubeId: 'lD11UTII6Ko',
    pl: {
      title: "Dzień Mamy z Modną Mamą",
      accent: "Mamą.",
      client: "OMODA JAECOO",
      cat: "Event · Lifestyle",
      short: true,
      kv: [
        ["Klient", "OMODA JAECOO", "Bydgoszcz"],
        ["Format", "Event", "Relacja"],
        ["Zakres", "Organizacja · Relacja", "Event"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Dzień Mamy w salonie OMODA JAECOO Plichta w Bydgoszczy, kobiece spotkanie łączące relaks, lifestyle i motoryzację.",
      intro: "Salon zamieniony w przestrzeń <span class='accent'>spotkania.</span>",
      context: [
        "Z okazji Dnia Mamy zorganizowaliśmy wydarzenie dla kobiet w salonie OMODA JAECOO Plichta w Bydgoszczy. Celem było stworzenie przyjemnego, kobiecego spotkania, które połączy relaks, aktywność, lifestyle i świat nowoczesnej motoryzacji.",
        "W otoczeniu modeli z gamy OMODA JAECOO przygotowaliśmy przestrzeń eventową z atrakcjami: treningiem pilatesu, cateringiem, warsztatami masażu kobido oraz gościem specjalnym, Pauliną Będzmirowską, znaną jako Modna Mama.",
      ],
      steps: [
        ["Organizacja i przestrzeń", "Przygotowaliśmy scenę, ściankę eventową, szatnię z obsługą oraz standy na produkty marek sponsorów."],
        ["Atrakcje", "Zapewniliśmy trening pilatesu, catering, warsztaty kobido i spotkanie z Modną Mamą, w otoczeniu modeli OMODA JAECOO."],
        ["Relacja wideo i social", "Równolegle prowadziliśmy komunikację: relację wideo i publikacje na bieżąco, pokazujące atmosferę, partnerów i obecność marki."],
        ["Efekt", "Salon zamienił się w przestrzeń spotkania, relaksu i doświadczenia marki, a uczestniczki spędziły czas w atmosferze stworzonej na Dzień Mamy."],
      ],
    },
    en: {
      title: "Mother's Day with Modna Mama",
      client: "OMODA JAECOO",
      cat: "Event · Lifestyle",
      short: true,
      kv: [
        ["Client", "OMODA JAECOO", "Bydgoszcz"],
        ["Format", "Event", "Recap"],
        ["Scope", "Organisation · Recap", "Event"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Mother's Day at the OMODA JAECOO Plichta showroom in Bydgoszcz, a women's gathering blending relaxation, lifestyle and automotive.",
      intro: "A showroom turned into a space for <span class='accent'>gathering.</span>",
      context: [
        "For Mother's Day we organised an event for women at the OMODA JAECOO Plichta showroom in Bydgoszcz. The goal was a pleasant, feminine gathering blending relaxation, activity, lifestyle and the world of modern automotive.",
        "Surrounded by models from the OMODA JAECOO range, we built an event space with attractions: a pilates session, catering, kobido massage workshops and a special guest, Paulina Będzmirowska, known as Modna Mama.",
      ],
      steps: [
        ["Organisation & space", "We prepared the stage, event wall, a staffed cloakroom and stands for the sponsor brands' products."],
        ["Attractions", "We provided a pilates session, catering, kobido workshops and a meeting with Modna Mama, among the OMODA JAECOO models."],
        ["Video recap & social", "In parallel we ran the communication: a video recap and live posts showing the atmosphere, partners and the brand's presence."],
        ["Result", "The showroom turned into a space of gathering, relaxation and brand experience, and the guests spent time in an atmosphere created for Mother's Day."],
      ],
    },
  },
  '7HZN5VCTvoo': {
    youtubeId: '7HZN5VCTvoo',
    pl: {
      title: "Animacja Dolphin G",
      accent: "Dolphin G.",
      client: "Dolphin G",
      cat: "Motion · Animacja",
      short: true,
      kv: [
        ["Klient", "BYD Dolphin", "Motion"],
        ["Format", "Animacja", "2D/3D"],
        ["Zakres", "Koncept · Animacja", "Motion design"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Animowany short Dolphin G, motion design w służbie produktu.",
      intro: "Motion design w służbie <span class='accent'>produktu.</span>",
      context: [
        "Animowany short Dolphin G miał pokazać produkt tam, gdzie zdjęcia nie sięgają, w czystej, graficznej formie, w pełni kontrolowanej w postprodukcji.",
        "Motion design dał nam swobodę: mogliśmy podkreślić cechy produktu i zbudować dynamikę bez ograniczeń planu zdjęciowego.",
      ],
      steps: [
        ["Koncept i storyboard", "Rozrysowaliśmy sekwencję animacji i kluczowe ujęcia produktu."],
        ["Animacja 2D/3D", "Zbudowaliśmy ruch i kompozycje w pełni w postprodukcji."],
        ["Grade i dźwięk", "Dopięliśmy kolor i warstwę dźwiękową pod dynamiczny short."],
        ["Dostawa", "Materiał oddaliśmy w formatach pod social i reklamę."],
      ],
    },
    en: {
      title: "Dolphin G Animation",
      client: "Dolphin G",
      cat: "Motion · Animation",
      short: true,
      kv: [
        ["Client", "BYD Dolphin", "Motion"],
        ["Format", "Animation", "2D/3D"],
        ["Scope", "Concept · Animation", "Motion design"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "An animated Dolphin G short, motion design working for the product.",
      intro: "Motion design working for the <span class='accent'>product.</span>",
      context: [
        "The animated Dolphin G short had to show the product where footage can't reach, in a clean, graphic form, fully controlled in post-production.",
        "Motion design gave us freedom: we could highlight the product's features and build dynamics without the constraints of a shoot.",
      ],
      steps: [
        ["Concept & storyboard", "We sketched the animation sequence and the key product shots."],
        ["2D/3D animation", "We built the motion and compositions entirely in post-production."],
        ["Grade & sound", "We finished the colour and sound layer for a dynamic short."],
        ["Delivery", "We delivered the material in formats for social and ads."],
      ],
    },
  },
  'lOwJMPKMdYA': {
    youtubeId: 'lOwJMPKMdYA',
    pl: {
      title: "Baltic BHP",
      accent: "BHP.",
      client: "Baltic BHP",
      cat: "Motion · Animacja 3D",
      short: false,
      kv: [
        ["Klient", "Baltic Towers", "Motion"],
        ["Format", "Animacja", "3D"],
        ["Zakres", "Koncept · Animacja", "Motion design"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Pełnometrażowe szkolenie BHP dla Baltic Towers w animacji 3D, bezpieczeństwo podane nowocześnie i angażująco.",
      intro: "Szkolenie BHP, które faktycznie <span class='accent'>zapamiętasz.</span>",
      context: [
        "Baltic Towers potrzebowało szkolenia BHP dla pracowników, ale w formie, która nie będzie kolejną prezentacją do przeklikania. Przy takiej skali produkcji bezpieczeństwo nie może być nudnym obowiązkiem, materiał miał przyciągać uwagę i pomagać realnie zapamiętać procedury.",
        "Zamiast ściany tekstu, testów wiedzy czy sztucznych scen z aktorami stworzyliśmy pełnometrażowe szkolenie BHP w formie animacji 3D, precyzyjnej, bezpiecznej i bardziej angażującej.",
      ],
      steps: [
        ["Koncept i scenariusz", "Uporządkowaliśmy procedury zakładu w czytelną, angażującą narrację edukacyjną."],
        ["Model i sceny 3D", "Odtworzyliśmy procesy produkcyjne, zagrożenia i ruch na terenie zakładu, sceny trudne do nagrania tradycyjnie."],
        ["Animacja 3D", "Zbudowaliśmy nowoczesną produkcję edukacyjną dopasowaną do realiów dużej firmy przemysłowej."],
        ["Dostawa", "Powstało pełne szkolenie BHP, które przekazuje wiedzę bez nudy, przegadania i sztucznej inscenizacji."],
      ],
    },
    en: {
      title: "Baltic Safety",
      client: "Baltic BHP",
      cat: "Motion · 3D animation",
      short: false,
      kv: [
        ["Client", "Baltic Towers", "Motion"],
        ["Format", "Animation", "3D"],
        ["Scope", "Concept · Animation", "Motion design"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "A full-length safety training for Baltic Towers in 3D animation, safety delivered in a modern, engaging way.",
      intro: "Safety training you'll actually <span class='accent'>remember.</span>",
      context: [
        "Baltic Towers needed safety training for its staff, but in a form that wouldn't be yet another slideshow to click through. At this scale of production, safety can't be a boring obligation, the material had to hold attention and help people genuinely remember the procedures.",
        "Instead of a wall of text, knowledge tests or artificial scenes with actors, we created a full-length safety training as 3D animation, precise, safe and far more engaging.",
      ],
      steps: [
        ["Concept & script", "We organised the plant's procedures into a clear, engaging educational narrative."],
        ["3D model & scenes", "We recreated production processes, hazards and movement across the plant, scenes hard to shoot conventionally."],
        ["3D animation", "We built a modern educational production tailored to the realities of a large industrial company."],
        ["Delivery", "A complete safety training that passes on knowledge without boredom, waffle or artificial staging."],
      ],
    },
  },
  'WszuntCE51c': {
    youtubeId: 'WszuntCE51c',
    pl: {
      title: "Baltic Model Fabryki",
      accent: "3D.",
      client: "Baltic",
      cat: "Motion · Model 3D",
      short: false,
      kv: [
        ["Klient", "Baltic", "Motion"],
        ["Format", "Animacja", "3D"],
        ["Zakres", "Model · Animacja", "Motion design"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "Trójwymiarowy model fabryki Baltic, wizualizacja procesu w pełnym 3D.",
      intro: "Proces pokazany w pełnym <span class='accent'>3D.</span>",
      context: [
        "Trójwymiarowy model fabryki Baltic pozwolił pokazać obiekt i proces tam, gdzie kamera nie wejdzie, w przekroju, w skali, w pełnej kontroli nad kadrem.",
        "Wizualizacja 3D porządkuje złożony proces i czyni go zrozumiałym dla odbiorcy, inwestora, klienta, partnera.",
      ],
      steps: [
        ["Model 3D", "Zbudowaliśmy trójwymiarowy model obiektu na podstawie materiałów klienta."],
        ["Animacja", "Zaprojektowaliśmy kamery i ruch prowadzący widza przez proces."],
        ["Grade i render", "Dopięliśmy oświetlenie, materiały i kolor pod filmowy render."],
        ["Dostawa", "Wizualizację oddaliśmy pod prezentacje i komunikację inwestycji."],
      ],
    },
    en: {
      title: "Baltic Factory Model",
      client: "Baltic",
      cat: "Motion · 3D model",
      short: false,
      kv: [
        ["Client", "Baltic", "Motion"],
        ["Format", "Animation", "3D"],
        ["Scope", "Model · Animation", "Motion design"],
        ["Studio", "SEZMOO", "Gdańsk"],
      ],
      lead: "A three-dimensional model of the Baltic factory, process visualisation in full 3D.",
      intro: "The process shown in full <span class='accent'>3D.</span>",
      context: [
        "The three-dimensional model of the Baltic factory let us show the building and the process where a camera can't go, in cross-section, at scale, in full control of the frame.",
        "3D visualisation organises a complex process and makes it understandable for the audience, investor, client, partner.",
      ],
      steps: [
        ["3D model", "We built a three-dimensional model of the building from the client's materials."],
        ["Animation", "We designed the cameras and motion that guide the viewer through the process."],
        ["Grade & render", "We finished the lighting, materials and colour for a cinematic render."],
        ["Delivery", "We delivered the visualisation for decks and investment communication."],
      ],
    },
  },
};

export function getCaseStudy(id: string): CaseStudy | undefined {
  return CASE_STUDIES[id];
}

export function getCaseStudyCopy(id: string, lang: CaseStudyLang): CaseStudyCopy | undefined {
  return CASE_STUDIES[id]?.[lang];
}

export function getNextCaseStudyId(id: string): string | undefined {
  const idx = CASE_STUDY_ORDER.indexOf(id);
  if (idx < 0) return undefined;
  return CASE_STUDY_ORDER[(idx + 1) % CASE_STUDY_ORDER.length];
}

export function caseStudyPaths(lang: CaseStudyLang): { params: { id: string }; props: { study: CaseStudy; lang: CaseStudyLang } }[] {
  return CASE_STUDY_ORDER.map((id) => ({
    params: { id },
    props: { study: CASE_STUDIES[id], lang },
  }));
}

export function caseStudyHref(id: string, lang: CaseStudyLang): string {
  return lang === 'en' ? `/en/realizacja/${id}/` : `/realizacja/${id}/`;
}

export function posterPath(id: string): string {
  return `/assets/video/yt/posters/${id}.webp`;
}
