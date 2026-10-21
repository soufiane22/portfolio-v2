import type { Localized } from '../i18n/lang';

export interface Note {
  readonly id: string;
  readonly title: Localized;
  readonly tag: string;
  readonly minutes: number;
  /** TODO: set the article URL once published; until then the note renders as "coming soon". */
  readonly url?: string;
}

export const notes: readonly Note[] = [
  {
    id: 'signals-vs-rxjs',
    title: { en: 'Signals vs RxJS: where each one belongs', fr: 'Signals vs RxJS : où placer chacun' },
    tag: 'Angular',
    minutes: 6,
  },
  {
    id: 'onpush',
    title: {
      en: 'OnPush change detection, without the guesswork',
      fr: 'La détection de changements OnPush, sans deviner',
    },
    tag: 'Angular',
    minutes: 8,
  },
  {
    id: 'nx-workspace',
    title: {
      en: 'Structuring an Nx workspace for a growing team',
      fr: 'Structurer un workspace Nx pour une équipe qui grandit',
    },
    tag: 'Nx',
    minutes: 10,
  },
];
