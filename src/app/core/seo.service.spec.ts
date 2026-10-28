import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Seo } from './seo.service';
import { SITE_URL } from './site';

describe('Seo', () => {
  let doc: Document;
  const attr = (selector: string, name: string): string | null => doc.head.querySelector(selector)?.getAttribute(name) ?? null;

  beforeEach(() => {
    doc = TestBed.inject(DOCUMENT);
    TestBed.inject(Seo).update({ lang: 'fr', title: 'Titre', description: 'Résumé', path: '/work/premo', type: 'article' });
  });

  it('sets the page language and the Open Graph tags with absolute URLs', () => {
    expect(doc.documentElement.lang).toBe('fr');
    expect(attr('meta[property="og:title"]', 'content')).toBe('Titre');
    expect(attr('meta[property="og:description"]', 'content')).toBe('Résumé');
    expect(attr('meta[property="og:url"]', 'content')).toBe(`${SITE_URL}/fr/work/premo`);
    expect(attr('meta[property="og:image"]', 'content')).toBe(`${SITE_URL}/og-image.jpg`);
    expect(attr('meta[property="og:locale"]', 'content')).toBe('fr_FR');
  });

  it('adds one canonical and the hreflang alternates, without duplicates on a second update', () => {
    TestBed.inject(Seo).update({ lang: 'en', title: 'Title', description: 'Summary', path: '/work/premo' });
    expect(doc.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(attr('link[rel="canonical"]', 'href')).toBe(`${SITE_URL}/en/work/premo`);
    expect(attr('link[hreflang="en"]', 'href')).toBe(`${SITE_URL}/en/work/premo`);
    expect(attr('link[hreflang="fr"]', 'href')).toBe(`${SITE_URL}/fr/work/premo`);
    expect(attr('link[hreflang="x-default"]', 'href')).toBe(`${SITE_URL}/en/work/premo`);
    expect(doc.head.querySelectorAll('link[rel="alternate"]')).toHaveLength(3);
  });
});
