import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { profile } from '../../content/profile';
import type { Lang } from '../../i18n';
import { Home } from './home';

async function render(lang: Lang): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(Home);
  fixture.componentRef.setInput('lang', lang);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('Home', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [Home], providers: [provideRouter([])] }));

  it('renders the English hero with a single h1', async () => {
    const el = await render('en');
    expect(el.querySelectorAll('h1')).toHaveLength(1);
    expect(el.querySelector('h1')?.textContent).toContain('Soufiane Aloui El Idrissi');
    expect(el.textContent).toContain('Open to full-stack opportunities');
  });

  it('renders the French hero', async () => {
    const el = await render('fr');
    expect(el.textContent).toContain('Ouvert aux opportunités full-stack');
  });

  it('exposes the language switch with the current language marked', async () => {
    const el = await render('fr');
    const current = el.querySelector('app-lang-switch [aria-current="true"]');
    expect(current?.textContent?.trim().toLowerCase()).toBe('fr');
  });

  it('links the CV download to the PDF of the chosen language', async () => {
    const en = await render('en');
    const fr = await render('fr');
    const main = (el: HTMLElement): string | null => el.querySelector('app-hero a[download]')?.getAttribute('href') ?? null;
    expect(main(en)).toBe(profile.cv.en);
    expect(main(fr)).toBe(profile.cv.fr);
    expect(en.querySelector(`app-hero a[download][href="${profile.cv.fr}"]`)).not.toBeNull();
    expect(profile.cv.en).not.toBe(profile.cv.fr);
  });

  it('toggles the mobile menu with aria-expanded', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.componentRef.setInput('lang', 'en');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const button = el.querySelector<HTMLButtonElement>('button[aria-controls="mobile-nav"]');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    button?.click();
    await fixture.whenStable();
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('#mobile-nav')).not.toBeNull();
  });
});
