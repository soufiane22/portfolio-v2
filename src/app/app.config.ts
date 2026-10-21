import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';
import { routes } from './app.routes';
import { ScrollManager } from './core/scroll-manager';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      // The router still emits Scroll events, but ScrollManager decides how to scroll
      // (it keeps the position when switching language).
      withInMemoryScrolling({ anchorScrolling: 'disabled', scrollPositionRestoration: 'disabled' }),
      // Lets a second click on the same anchor link scroll again.
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withViewTransitions(),
    ),
    provideAppInitializer(() => inject(ScrollManager).init()),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
  ],
};
