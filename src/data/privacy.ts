/** Privacy / RODO pages PL + EN. Markup: PrivacyPage.astro */

export type PrivacyLang = 'pl' | 'en';

export interface PrivacyNavItem {
  id: string;
  label: string;
}

export interface PrivacySection {
  id: string;
  titleHtml: string;
  /** Paragraphs and optional list after the first intro paragraph. */
  paras: string[];
  list?: string[];
  afterList?: string[];
}

export interface PrivacyCopy {
  path: string;
  title: string;
  description: string;
  backHref: string;
  backLabel: string;
  meta: string;
  h1: string;
  lead: string;
  navLabel: string;
  nav: PrivacyNavItem[];
  sections: PrivacySection[];
}

const pl: PrivacyCopy = {
  path: '/polityka-prywatnosci/',
  title: 'Polityka prywatności | SEZMOO',
  description: 'Polityka prywatności i klauzula informacyjna RODO agencji SEZMOO (Maciej Tyma Sezmoo).',
  backHref: '/',
  backLabel: '← Wróć do strony',
  meta: 'SEZMOO · RODO / PRIVACY',
  h1: 'Polityka prywatności',
  lead:
    'Klauzula informacyjna dla klientów zgodna z art. 13 ust. 1 i 2 RODO (Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r.). Informujemy, w jaki sposób i w jakim celu przetwarzamy Państwa dane osobowe oraz jakie prawa Państwu przysługują.',
  navLabel: 'Sekcje',
  nav: [
    { id: 'administrator', label: '1 · Administrator' },
    { id: 'specjalista', label: '2 · Ochrona danych' },
    { id: 'cele', label: '3 · Cele i podstawy' },
    { id: 'okres', label: '4 · Okres przechowywania' },
    { id: 'odbiorcy', label: '5 · Odbiorcy danych' },
    { id: 'prawa', label: '6 · Twoje prawa' },
    { id: 'cookies', label: '7 · Pliki cookies' },
  ],
  sections: [
    {
      id: 'administrator',
      titleHtml: '1. Administrator danych osobowych.',
      paras: [
        'Administratorem Pani/Pana danych osobowych jest <strong>Maciej Tyma SEZMOO</strong>, ul. Zeusa 34, 80-299 Gdańsk, NIP 9581568266. Dane kontaktowe: <a href="mailto:biuro@sezmoo.com">biuro@sezmoo.com</a>.',
      ],
    },
    {
      id: 'specjalista',
      titleHtml: '2. Specjalista ds. ochrony danych.',
      paras: [
        'Ze specjalistą ds. ochrony danych w firmie Maciej Tyma SEZMOO należy kontaktować się za pośrednictwem adresu poczty elektronicznej: <a href="mailto:biuro@sezmoo.com">biuro@sezmoo.com</a>.',
      ],
    },
    {
      id: 'cele',
      titleHtml: '3. Cele i podstawy prawne przetwarzania.',
      paras: [
        'Dane pozyskane za pośrednictwem różnych form komunikacji (kontakt bezpośredni, telefoniczny, mailowy, formularz kontaktowy) przetwarzamy:',
      ],
      list: [
        'w celu wykonania umowy lub podjęcia działań przed jej zawarciem, na Pani/Pana żądanie, art. 6 ust. 1 lit. b RODO (m.in. utrzymanie kontaktu i wzajemne rozliczenia);',
        'w celu wypełnienia obowiązku prawnego ciążącego na Administratorze, art. 6 ust. 1 lit. c RODO;',
        'w celu obsługi reklamacji, art. 6 ust. 1 lit. c w związku z lit. b RODO;',
        'w celu udzielenia odpowiedzi na zapytanie przesłane na adres e-mail, art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes);',
        'w celu przygotowania oferty i prowadzenia negocjacji w odpowiedzi na zapytanie ofertowe, art. 6 ust. 1 lit. f RODO;',
        'w celach wynikających z prawnie uzasadnionego interesu Administratora: marketing bezpośredni, cele archiwalne i dowodowe, ustalenie, dochodzenie lub obrona roszczeń, działalność operacyjna, statystyka i raportowanie, badanie satysfakcji klientów, art. 6 ust. 1 lit. f RODO;',
        'w razie wyrażenia dodatkowych zgód, wyłącznie w zakresie i celach wskazanych w treści tych zgód, art. 6 ust. 1 lit. a RODO.',
      ],
    },
    {
      id: 'okres',
      titleHtml: '4. Okres przechowywania danych.',
      paras: ['Dane przechowujemy przez okres niezbędny do realizacji celów przetwarzania, tj. co do zasady:'],
      list: [
        'gdy przetwarzanie jest niezbędne do wykonania umowy, przez okres jej obowiązywania;',
        'gdy przetwarzanie odbywa się na podstawie zgody, do czasu jej cofnięcia;',
        'gdy przetwarzanie wynika z prawnie uzasadnionych interesów Administratora, przez okres ich istnienia lub do czasu wniesienia skutecznego sprzeciwu.',
      ],
      afterList: [
        'Okresy te ulegają przedłużeniu, jeżeli przetwarzanie jest niezbędne do ustalenia, dochodzenia lub obrony roszczeń albo do wywiązania się z obowiązku prawnego wymagającego przetwarzania danych przez okres wskazany w przepisach prawa.',
      ],
    },
    {
      id: 'odbiorcy',
      titleHtml: '5. Odbiorcy danych.',
      paras: [
        'Dane mogą być przekazywane: upoważnionym pracownikom i współpracownikom Administratora, podmiotom świadczącym usługi księgowe, kadrowe i prawne, dostawcom usług IT i systemów informatycznych, podmiotom świadczącym usługę hostingu i utrzymania poczty elektronicznej, operatorowi pocztowemu i kurierom, bankowi w zakresie realizacji płatności, a także innym podmiotom uprawnionym do uzyskania danych na podstawie obowiązującego prawa.',
      ],
    },
    {
      id: 'prawa',
      titleHtml: '6. Prawa związane z przetwarzaniem.',
      paras: [
        'W zakresie i na zasadach wskazanych w RODO przysługują Pani/Panu prawa: dostępu do danych, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych, cofnięcia zgody w dowolnym momencie (bez wpływu na zgodność z prawem przetwarzania sprzed cofnięcia) oraz wniesienia sprzeciwu, w tym w każdej chwili wobec przetwarzania na potrzeby marketingu bezpośredniego.',
        '<strong>Tryb realizacji praw:</strong> aby skorzystać z powyższych praw, prosimy o kontakt na adres podany w punktach 1 i 2.',
        '<strong>Skarga do organu nadzorczego:</strong> przysługuje Pani/Panu prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych, jeżeli uzna Pani/Pan, że dane są przetwarzane niezgodnie z prawem.',
        '<strong>Dobrowolność podania danych:</strong> podanie danych jest dobrowolne, jednak niezbędne do realizacji celów, o których mowa w punkcie 3, w szczególności jest warunkiem zawarcia i realizacji umowy.',
      ],
    },
    {
      id: 'cookies',
      titleHtml: '7. Pliki cookies.',
      paras: [
        'Strona korzysta z plików cookies (ciasteczek) w celu zapewnienia prawidłowego działania serwisu, zapamiętania preferencji oraz, za Pani/Pana zgodą, w celach statystycznych i marketingowych. Cookies niezbędne są wykorzystywane zawsze; pozostałe wyłącznie po wyrażeniu zgody w banerze zgody na cookies.',
        'W każdej chwili może Pani/Pan zmienić ustawienia dotyczące cookies w swojej przeglądarce lub cofnąć zgodę, czyszcząc dane witryny. Ograniczenie stosowania cookies może wpłynąć na niektóre funkcje serwisu.',
      ],
    },
  ],
};

const en: PrivacyCopy = {
  path: '/en/privacy-policy/',
  title: 'Privacy policy | SEZMOO',
  description: 'Privacy policy and GDPR information notice for SEZMOO (Maciej Tyma Sezmoo).',
  backHref: '/en/',
  backLabel: '← Back to site',
  meta: 'SEZMOO · GDPR / PRIVACY',
  h1: 'Privacy policy',
  lead:
    'Information notice for clients under Art. 13(1) and (2) GDPR (Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016). It explains how and why we process your personal data and what rights you have.',
  navLabel: 'Sections',
  nav: [
    { id: 'controller', label: '1 · Controller' },
    { id: 'officer', label: '2 · Data protection' },
    { id: 'purposes', label: '3 · Purposes &amp; basis' },
    { id: 'retention', label: '4 · Retention' },
    { id: 'recipients', label: '5 · Recipients' },
    { id: 'rights', label: '6 · Your rights' },
    { id: 'cookies', label: '7 · Cookies' },
  ],
  sections: [
    {
      id: 'controller',
      titleHtml: '1. Data controller.',
      paras: [
        'The controller of your personal data is <strong>Maciej Tyma SEZMOO</strong>, ul. Zeusa 34, 80-299 Gdańsk, Poland, VAT (NIP) 9581568266. Contact: <a href="mailto:biuro@sezmoo.com">biuro@sezmoo.com</a>.',
      ],
    },
    {
      id: 'officer',
      titleHtml: '2. Data protection.',
      paras: [
        'For matters concerning data protection at Maciej Tyma SEZMOO, please contact us by e-mail: <a href="mailto:biuro@sezmoo.com">biuro@sezmoo.com</a>.',
      ],
    },
    {
      id: 'purposes',
      titleHtml: '3. Purposes and legal basis.',
      paras: [
        'Data obtained through various forms of communication (direct contact, phone, e-mail, contact form) is processed:',
      ],
      list: [
        'to perform a contract or take steps prior to entering into it, at your request, Art. 6(1)(b) GDPR (including keeping in touch and mutual settlements);',
        'to comply with a legal obligation of the controller, Art. 6(1)(c) GDPR;',
        'to handle complaints, Art. 6(1)(c) in connection with (b) GDPR;',
        'to reply to an enquiry sent to our e-mail address, Art. 6(1)(f) GDPR (legitimate interest);',
        'to prepare an offer and conduct negotiations in response to your request, Art. 6(1)(f) GDPR;',
        "for purposes arising from the controller's legitimate interest: direct marketing, archival and evidential purposes, establishing, pursuing or defending claims, operational activity, statistics and reporting, and customer-satisfaction surveys, Art. 6(1)(f) GDPR;",
        'where you give additional consent, only within the scope and for the purposes stated in that consent, Art. 6(1)(a) GDPR.',
      ],
    },
    {
      id: 'retention',
      titleHtml: '4. Data retention.',
      paras: [
        'We store data for as long as necessary to achieve the processing purposes, i.e. as a rule:',
      ],
      list: [
        'where processing is necessary to perform a contract, for the term of the contract;',
        'where processing is based on your consent, until that consent is withdrawn;',
        "where processing arises from the controller's legitimate interests, for as long as those interests exist or until an effective objection is raised.",
      ],
      afterList: [
        'These periods are extended where processing is necessary to establish, pursue or defend claims, or to comply with a legal obligation requiring processing for a period set out in the law applicable to the controller.',
      ],
    },
    {
      id: 'recipients',
      titleHtml: '5. Recipients of data.',
      paras: [
        'Data may be shared with: authorised employees and associates of the controller, providers of accounting, HR and legal services, IT and software providers, hosting and e-mail providers, postal operators and couriers, the bank for payment processing, and other entities entitled to obtain data under applicable law.',
      ],
    },
    {
      id: 'rights',
      titleHtml: '6. Your rights.',
      paras: [
        'To the extent and on the terms set out in the GDPR, you have the right to: access your data, rectify it, erase it, restrict processing, data portability, withdraw consent at any time (without affecting the lawfulness of processing before withdrawal), and object at any time, including to processing for direct-marketing purposes.',
        '<strong>Exercising your rights:</strong> to use the above rights, please contact us using the details in sections 1 and 2.',
        '<strong>Complaint to the supervisory authority:</strong> you have the right to lodge a complaint with the President of the Personal Data Protection Office (UODO) if you believe your data is processed unlawfully.',
        '<strong>Providing data:</strong> providing your data is voluntary but necessary to achieve the purposes in section 3, in particular it is a condition of concluding and performing a contract.',
      ],
    },
    {
      id: 'cookies',
      titleHtml: '7. Cookies.',
      paras: [
        'This website uses cookies to ensure it works correctly, to remember preferences and, with your consent, for statistics and marketing. Necessary cookies are always used; the rest only after you accept them in the cookie consent banner.',
        'You can change your cookie settings in your browser at any time or withdraw consent by clearing site data. Restricting cookies may affect some features of the site.',
      ],
    },
  ],
};

export const PRIVACY = { pl, en } as const;

export function privacyCopy(lang: PrivacyLang): PrivacyCopy {
  return PRIVACY[lang];
}
