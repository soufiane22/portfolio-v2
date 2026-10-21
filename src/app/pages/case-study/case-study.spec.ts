import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { Lang } from '../../i18n';
import { CaseStudyPage } from './case-study';

async function render(lang: Lang, slug: string): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(CaseStudyPage);
  fixture.componentRef.setInput('lang', lang);
  fixture.componentRef.setInput('slug', slug);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('CaseStudyPage', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [CaseStudyPage], providers: [provideRouter([])] }));

  it('renders the PREMO case study with its three public repositories', async () => {
    const el = await render('en', 'premo');
    expect(el.querySelector('h1')?.textContent).toContain('Production and workforce tracking system');
    const repos = Array.from(el.querySelectorAll<HTMLAnchorElement>('dl a[href^="https://github.com/"]'));
    expect(repos.map((a) => a.getAttribute('href'))).toEqual([
      'https://github.com/soufiane22/ProductionManagmentBackEnd',
      'https://github.com/soufiane22/ProductionManagmentWeb',
      'https://github.com/soufiane22/ProductionManagmentMobile',
    ]);
    expect(el.textContent).toContain('Spring Boot REST API');
  });

  it('renders in French and keeps the inline code snippet in the key decision', async () => {
    const el = await render('fr', 'premo');
    expect(el.textContent).toContain('Étude de cas 03');
    expect(el.querySelector('code')?.textContent).toBe('ViewModel + LiveData');
  });

  it('renders the Sanford case study with its optional sections, numbered in order', async () => {
    const el = await render('en', 'sanford');
    const labels = Array.from(el.querySelectorAll('main section > h2.font-mono, main section > div > p.font-mono')).map((n) =>
      n.textContent?.trim(),
    );
    expect(labels).toEqual([
      '01 — Problem',
      '02 — Context',
      '03 — Lifecycle',
      '04 — Architecture',
      '05 — Modules',
      '06 — Business rules',
      '07 — Key decision',
      '08 — Problems solved',
      '09 — Patterns',
      '10 — My part',
      '11 — Result',
      '12 — Stack',
    ]);
    expect(el.textContent).toContain('GitHub · private');
    expect(el.textContent).toContain('Next case study');
  });

  it('numbers only the sections a case study has (Matys has no optional ones)', async () => {
    const el = await render('fr', 'matys');
    expect(el.textContent).toContain('05 — Résultat');
    expect(el.textContent).not.toContain('Cycle de vie');
  });

  it('shows the PREMO demo first: a click-to-load video and the tablet screenshots', async () => {
    const fixture = TestBed.createComponent(CaseStudyPage);
    fixture.componentRef.setInput('lang', 'en');
    fixture.componentRef.setInput('slug', 'premo');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.textContent).toContain('01 — Demo');
    // Nothing is loaded from YouTube until the visitor asks for it.
    expect(el.querySelector('iframe')).toBeNull();
    el.querySelector<HTMLButtonElement>('app-video-embed button')?.click();
    await fixture.whenStable();
    expect(el.querySelector('iframe')?.getAttribute('src')).toContain('https://www.youtube-nocookie.com/embed/G7qCM2Ha-Ao');

    const slides = el.querySelectorAll('app-screen-gallery figure[aria-roledescription="slide"]');
    expect(slides).toHaveLength(7);
    expect(el.querySelector('app-screen-gallery [aria-live]')?.textContent).toContain('1 / 7');
  });

  it('moves through the gallery with the next and previous buttons', async () => {
    const fixture = TestBed.createComponent(CaseStudyPage);
    fixture.componentRef.setInput('lang', 'fr');
    fixture.componentRef.setInput('slug', 'premo');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const track = el.querySelector<HTMLElement>('app-screen-gallery [aria-roledescription="carousel"]');
    if (track) track.scrollTo = () => undefined; // jsdom has no scrolling
    const next = el.querySelector<HTMLButtonElement>('app-screen-gallery button[aria-label="Capture suivante"]');
    const prev = el.querySelector<HTMLButtonElement>('app-screen-gallery button[aria-label="Capture précédente"]');
    expect(prev?.disabled).toBe(true); // nothing before the first screen

    next?.click();
    next?.click();
    await fixture.whenStable();
    expect(el.querySelector('app-screen-gallery [aria-live]')?.textContent).toContain('3 / 7');

    for (let i = 0; i < 10; i++) next?.click(); // clamps at the last screen
    await fixture.whenStable();
    expect(el.querySelector('app-screen-gallery [aria-live]')?.textContent).toContain('7 / 7');
  });

  it('shows the private-repository label for Matys', async () => {
    const el = await render('en', 'matys');
    expect(el.querySelector('dl a[href^="https://github.com/"]')).toBeNull();
    expect(el.textContent).toContain('GitHub · private');
  });
});
