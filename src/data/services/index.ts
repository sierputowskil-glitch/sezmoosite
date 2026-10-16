export type { ServiceDef, ServiceLang } from './types';
import type { ServiceDef, ServiceLang } from './types';
import { abonamenty } from './pages/abonamenty';
import { fotografia } from './pages/fotografia';
import { produkcjaWideoReels } from './pages/produkcja-wideo-reels';
import { projektowanieGraficzne } from './pages/projektowanie-graficzne';
import { projektowanieUxUi } from './pages/projektowanie-ux-ui';
import { stronyInternetoweILandingPage } from './pages/strony-internetowe-i-landing-page';
import { obslugaSocialMedia } from './pages/obsluga-social-media';
import { organizacjaEventow } from './pages/organizacja-eventow';
import { kampaniePlatne } from './pages/kampanie-platne';
import { produkcjaReklamowa } from './pages/produkcja-reklamowa';
import { identyfikacjaWizualna } from './pages/identyfikacja-wizualna';
import { animacje2dI3d } from './pages/animacje-2d-i-3d';
import { ujeciaZDrona } from './pages/ujecia-z-drona';
import { reklamaZewnetrzna } from './pages/reklama-zewnetrzna';
import { materialyReklamowe } from './pages/materialy-reklamowe';

export const SERVICES: ServiceDef[] = [
  abonamenty,
  fotografia,
  produkcjaWideoReels,
  projektowanieGraficzne,
  projektowanieUxUi,
  stronyInternetoweILandingPage,
  obslugaSocialMedia,
  organizacjaEventow,
  kampaniePlatne,
  produkcjaReklamowa,
  identyfikacjaWizualna,
  animacje2dI3d,
  ujeciaZDrona,
  reklamaZewnetrzna,
  materialyReklamowe,
];

const byPl = new Map(SERVICES.map((s) => [s.plSlug, s]));
const byEn = new Map(SERVICES.map((s) => [s.enSlug, s]));

export function serviceByPlSlug(slug: string): ServiceDef | undefined {
  return byPl.get(slug);
}
export function serviceByEnSlug(slug: string): ServiceDef | undefined {
  return byEn.get(slug);
}
export function serviceCopy(def: ServiceDef, lang: ServiceLang) {
  return lang === 'en' ? def.en : def.pl;
}
export function servicePath(def: ServiceDef, lang: ServiceLang): string {
  return lang === 'en' ? `/en/services/${def.enSlug}/` : `/uslugi-marketingowe/${def.plSlug}/`;
}
export function serviceAltPath(def: ServiceDef, lang: ServiceLang): string {
  return servicePath(def, lang === 'en' ? 'pl' : 'en');
}
