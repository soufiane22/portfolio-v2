import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { findCaseStudy } from '../content/case-studies';
import { DEFAULT_LANG, isLang } from '../i18n';

/** Unknown language segments fall back to the default language. */
export const langGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  return isLang(route.paramMap.get('lang')) || router.createUrlTree(['/', DEFAULT_LANG]);
};

/** Unknown case-study slugs go back to the work section. */
export const caseStudyGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const lang = route.paramMap.get('lang');
  if (!isLang(lang)) return router.createUrlTree(['/', DEFAULT_LANG]);
  return findCaseStudy(route.paramMap.get('slug')) ? true : router.createUrlTree(['/', lang], { fragment: 'work' });
};
