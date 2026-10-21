import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, provideRouter, convertToParamMap } from '@angular/router';
import { caseStudyGuard, langGuard } from './route-guards';

function snapshot(params: Record<string, string>): ActivatedRouteSnapshot {
  return { paramMap: convertToParamMap(params) } as ActivatedRouteSnapshot;
}

describe('route guards', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  const run = (guard: typeof langGuard, params: Record<string, string>) =>
    TestBed.runInInjectionContext(() => guard(snapshot(params), {} as never));

  it('accepts supported languages', () => {
    expect(run(langGuard, { lang: 'fr' })).toBe(true);
  });

  it('redirects unknown languages to /en', () => {
    const result = run(langGuard, { lang: 'de' });
    expect(TestBed.inject(Router).serializeUrl(result as never)).toBe('/en');
  });

  it('accepts known case studies and redirects unknown slugs to the work section', () => {
    expect(run(caseStudyGuard, { lang: 'en', slug: 'matys' })).toBe(true);
    const result = run(caseStudyGuard, { lang: 'fr', slug: 'nope' });
    expect(TestBed.inject(Router).serializeUrl(result as never)).toBe('/fr#work');
  });
});
