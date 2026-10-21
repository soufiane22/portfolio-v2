import { Routes } from '@angular/router';
import { caseStudyGuard, langGuard } from './core/route-guards';
import { DEFAULT_LANG } from './i18n';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: DEFAULT_LANG },
  {
    path: ':lang',
    canActivate: [langGuard],
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: ':lang/work/:slug',
    canActivate: [caseStudyGuard],
    loadComponent: () => import('./pages/case-study/case-study').then((m) => m.CaseStudyPage),
  },
  { path: '**', redirectTo: DEFAULT_LANG },
];
