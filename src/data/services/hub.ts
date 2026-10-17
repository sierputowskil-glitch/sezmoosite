/** Hub chrome for `/uslugi-marketingowe/` and `/en/services/` — cards come from SERVICES. */

import type { Html, ServiceLang } from './types';

export interface ServiceHubCopy {
  title: string;
  description: string;
  schemaName: string;
  kick: Html;
  h1: Html;
  listId: string;
  ctaTitle: Html;
  ctaP: Html;
  ctaHref: string;
  ctaLabel: Html;
  retainer: {
    id: string;
    kick: Html;
    headingHtml: Html;
    leadHtml: Html;
    steps: { title: Html; text: Html }[];
    moreLeadHref: string;
    moreLead: Html;
    moreHref: string;
    more: Html;
  };
}

export const SERVICE_HUB: Record<ServiceLang, ServiceHubCopy> = {
  pl: {
    title: 'Usługi marketingowe · SEZMOO',
    description:
      'Usługi marketingowe SEZMOO: produkcja wideo, social media, kampanie płatne, strony, grafika, fotografia, dron, eventy i materiały reklamowe.',
    schemaName: 'Usługi marketingowe SEZMOO',
    kick: 'Usługi SEZMOO',
    h1: 'Usługi',
    listId: 'lista-uslug',
    ctaTitle: 'Zaplanujmy produkcję.',
    ctaP: 'Napisz, co chcesz pokazać i gdzie materiał ma pracować. Dobierzemy formaty bez przepalania zakresu.',
    ctaHref: '/#kontakt',
    ctaLabel: 'Skontaktuj się',
    retainer: {
      id: 'abonament',
      kick: 'Abonament',
      headingHtml: 'Stała produkcja zamiast<br />pojedynczych <span style="color:#ffd200">zleceń.</span>',
      leadHtml:
        'Miesięczny pakiet godzin produkcyjnych, który dzielisz tak, jak potrzebujesz – raz wideo, raz zdjęcia, raz grafika. Zakres i&nbsp;wycenę ustalamy po&nbsp;briefie.',
      steps: [
        {
          title: 'Stały rytm publikacji',
          text: 'Materiał powstaje regularnie, a&nbsp;nie akcjami raz na&nbsp;kwartał.',
        },
        {
          title: 'Produkcja in-house',
          text: 'Własny sprzęt i&nbsp;zespół, więc terminy są krótsze.',
        },
        {
          title: 'Przewidywalny budżet',
          text: 'Jedna znana kwota miesięcznie zamiast faktury za&nbsp;fakturą.',
        },
      ],
      moreLeadHref: '/uslugi-marketingowe/abonamenty/',
      moreLead: 'Zobacz, jak działa abonament ↗',
      moreHref: '/#kontakt',
      more: 'Zapytaj o&nbsp;wycenę',
    },
  },
  en: {
    title: 'Services | SEZMOO',
    description: 'Video production, social media content, paid campaigns and landing pages by SEZMOO.',
    schemaName: 'SEZMOO services',
    kick: 'SEZMOO services',
    h1: 'Services',
    listId: 'lista-uslug',
    ctaTitle: "Let's plan the production.",
    ctaP: "Tell us what you want to show and where the material has to work. We'll match the formats without overscoping.",
    ctaHref: '/en/#kontakt',
    ctaLabel: 'Get in touch',
    retainer: {
      id: 'retainer',
      kick: 'Retainer',
      headingHtml: 'Steady production instead of<br />one-off <span style="color:#ffd200">jobs.</span>',
      leadHtml:
        'A monthly package of production hours you split as you need – video one month, photography the next, design after that. Scope and pricing are agreed after the brief.',
      steps: [
        {
          title: 'A steady publishing rhythm',
          text: 'Material is made regularly, not in bursts once a quarter.',
        },
        {
          title: 'In-house production',
          text: 'Our own gear and team, so lead times are shorter.',
        },
        {
          title: 'Predictable budget',
          text: 'One known monthly amount instead of invoice after invoice.',
        },
      ],
      moreLeadHref: '/en/services/retainers/',
      moreLead: 'See how the retainer works ↗',
      moreHref: '/en/#kontakt',
      more: 'Ask for a quote',
    },
  },
};

export function serviceHubCopy(lang: ServiceLang): ServiceHubCopy {
  return SERVICE_HUB[lang];
}

export function serviceHubPath(lang: ServiceLang): string {
  return lang === 'en' ? '/en/services/' : '/uslugi-marketingowe/';
}
