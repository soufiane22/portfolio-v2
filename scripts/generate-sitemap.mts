// Writes public/sitemap.xml from the same sources as the prerendered routes
// (src/app/app.routes.server.ts): every language home and every case study.
// Run with Node 22.18+ (TypeScript type stripping): node scripts/generate-sitemap.mts
import { writeFileSync } from 'node:fs';
import { caseStudies } from '../src/app/content/case-studies.ts';
import { SITE_URL } from '../src/app/core/site.ts';
import { DEFAULT_LANG, LANGS } from '../src/app/i18n/lang.ts';

const paths = ['', ...caseStudies.map((study) => `/work/${study.slug}`)];
const url = (lang: string, path: string): string => `${SITE_URL}/${lang}${path}`;

const entries = paths.flatMap((path) =>
  LANGS.map((lang) => {
    const alternates = [
      ...LANGS.map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${url(alt, path)}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(DEFAULT_LANG, path)}"/>`,
    ];
    return ['  <url>', `    <loc>${url(lang, path)}</loc>`, ...alternates, '  </url>'].join('\n');
  }),
);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries,
  '</urlset>',
  '',
].join('\n');

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml: ${entries.length} URLs`);
