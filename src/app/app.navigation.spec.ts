import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('navigation from a case study', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          routes,
          withComponentInputBinding(),
          withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
          withRouterConfig({ onSameUrlNavigation: 'reload' }),
        ),
      ],
    });
    harness = await RouterTestingHarness.create('/en/work/premo');
  });

  function click(selector: string): void {
    const link = harness.routeNativeElement?.querySelector<HTMLAnchorElement>(selector);
    expect(link, `link ${selector} should exist`).toBeTruthy();
    link?.click();
  }

  it('goes back to the home page when the logo is clicked', async () => {
    click('header a[aria-label]');
    await harness.fixture.whenStable();
    expect(TestBed.inject(Location).path()).toBe('/en');
  });

  it('goes to the work section when "all work" is clicked', async () => {
    click('header a[href="/en#work"]');
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/en#work');
  });
});
