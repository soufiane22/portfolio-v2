import type { Dictionary } from './dictionary';
import { en } from './en';
import { fr } from './fr';
import type { Lang } from './lang';

export const dictionaries: Readonly<Record<Lang, Dictionary>> = { en, fr };

export { DEFAULT_LANG, LANGS, isLang } from './lang';
export type { Lang, Localized } from './lang';
export type { Dictionary } from './dictionary';
