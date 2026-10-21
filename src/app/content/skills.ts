import type { Localized } from '../i18n/lang';

export interface SkillGroup {
  readonly level: 'daily' | 'solid' | 'working';
  readonly title: Localized;
  readonly hint: Localized;
  readonly items: readonly string[];
}

// The "Learning" row from the design is hidden (showLearning: false) until the owner fills it.
export const skills: readonly SkillGroup[] = [
  {
    level: 'daily',
    title: { en: 'Daily', fr: 'Au quotidien' },
    hint: { en: 'what I write every day', fr: 'ce que j’écris tous les jours' },
    items: ['Angular', 'TypeScript', 'RxJS', 'Nx', 'Signals'],
  },
  {
    level: 'solid',
    title: { en: 'Solid', fr: 'Solide' },
    hint: { en: 'shipped in production', fr: 'livré en production' },
    items: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'OAuth 2.0 / OIDC', 'Azure DevOps'],
  },
  {
    level: 'working',
    title: { en: 'Working knowledge', fr: 'Connaissance pratique' },
    hint: { en: 'used on real projects', fr: 'utilisé sur de vrais projets' },
    items: ['Java Spring Boot', 'Android', 'PostgreSQL', 'Docker'],
  },
];
