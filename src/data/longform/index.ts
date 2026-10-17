export type { LongformDef, LongformLang } from './types';
import type { LongformDef, LongformLang } from './types';
import { balticTowersRekrutacja } from './pages/baltic-towers-rekrutacja';
import { doracoHalaTvp } from './pages/doraco-hala-tvp';
import { sohoForm } from './pages/soho-form';
import { kapka } from './pages/kapka';
import { primespot } from './pages/primespot';
import { k2 } from './pages/k2';
import { denza } from './pages/denza';
import { exlantix } from './pages/exlantix';
import { worldOfWarships } from './pages/world-of-warships';

export const LONGFORM: LongformDef[] = [
  balticTowersRekrutacja,
  doracoHalaTvp,
  sohoForm,
  kapka,
  primespot,
  k2,
  denza,
  exlantix,
  worldOfWarships,
];

const byId = new Map(LONGFORM.map((d) => [d.id, d]));

export function longformById(id: string): LongformDef | undefined {
  return byId.get(id);
}

export function longformCopy(def: LongformDef, lang: LongformLang) {
  if (lang === 'en') return def.en;
  return def.pl;
}

export function longformPath(def: LongformDef, lang: LongformLang): string {
  return lang === 'en' ? `/en/realizacja-${def.id}/` : `/realizacja-${def.id}/`;
}

export function longformAltPath(def: LongformDef, lang: LongformLang): string {
  return longformPath(def, lang === 'en' ? 'pl' : 'en');
}
