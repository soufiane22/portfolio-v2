import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DEFAULT_LANG, LANGS, type Lang } from '../i18n/lang';
import { OG_IMAGE, SITE_URL } from './site';

export interface SeoPage {
  readonly lang: Lang;
  readonly title: string;
  readonly description: string;
  /** Path after the language segment, e.g. '' for home or '/work/matys'. */
  readonly path: string;
  readonly type?: 'website' | 'article';
}

const OG_LOCALE: Record<Lang, string> = { en: 'en_US', fr: 'fr_FR' };

/** Absolute URL of a page in a given language. Exported for unit tests. */
export function pageUrl(lang: Lang, path: string): string {
  return `${SITE_URL}/${lang}${path}`;
}

@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  update({ lang, title, description, path, type = 'website' }: SeoPage): void {
    const url = pageUrl(lang, path);
    this.doc.documentElement.lang = lang;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });

    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:site_name', content: 'Soufiane Aloui El Idrissi' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: SITE_URL + OG_IMAGE.path });
    this.meta.updateTag({ property: 'og:image:width', content: String(OG_IMAGE.width) });
    this.meta.updateTag({ property: 'og:image:height', content: String(OG_IMAGE.height) });
    this.meta.updateTag({ property: 'og:image:alt', content: title });
    this.meta.updateTag({ property: 'og:locale', content: OG_LOCALE[lang] });
    for (const other of LANGS.filter((l) => l !== lang)) {
      this.meta.updateTag({ property: 'og:locale:alternate', content: OG_LOCALE[other] });
    }
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    this.setLink('canonical', url);
    for (const l of LANGS) this.setLink('alternate', pageUrl(l, path), l);
    this.setLink('alternate', pageUrl(DEFAULT_LANG, path), 'x-default');
  }

  /** Creates or updates a <link> in <head>; alternates are keyed by hreflang. */
  private setLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
    let link = this.doc.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', rel);
      if (hreflang) link.setAttribute('hreflang', hreflang);
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
