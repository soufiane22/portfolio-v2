import { RenderMode, ServerRoute } from '@angular/ssr';
import { caseStudies } from './content/case-studies';
import { LANGS } from './i18n';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':lang',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => LANGS.map((lang) => ({ lang })),
  },
  {
    path: ':lang/work/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      LANGS.flatMap((lang) => caseStudies.map((study) => ({ lang, slug: study.slug }))),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
