export type Lang = 'en' | 'fr';
export const LANGS: readonly Lang[] = ['en', 'fr'];
export const DEFAULT_LANG: Lang = 'en';

export function isLang(value: string | null | undefined): value is Lang {
  return value === 'en' || value === 'fr';
}

/** A user-facing string available in every supported language. */
export type Localized = Readonly<Record<Lang, string>>;
