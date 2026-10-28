import type { Localized } from '../i18n/lang';

export interface Badge {
  readonly value: string;
  readonly label: Localized;
}

export interface Job {
  readonly id: string;
  readonly company: string;
  readonly period: Localized;
  readonly role: Localized;
  /** `null` while the real outcome line is still a TODO. */
  readonly summary: Localized | null;
  /** Optional bullet points under the summary: what was built and what the role covered. */
  readonly highlights?: readonly Localized[];
  readonly badges?: readonly Badge[];
  /** Main technologies, taken from the CV's "Technologies" line for this job. */
  readonly stack?: readonly string[];
  readonly current?: boolean;
}

export const todoSummary: Localized = {
  en: 'One-line outcome to add.',
  fr: 'Résultat en une ligne à ajouter.',
};

// Source: CV (EN + FR versions in public/cv/).
export const experience: readonly Job[] = [
  {
    id: 'matys',
    company: 'Matys by Cegid',
    period: { en: 'Sep 2024 — now', fr: 'Sept. 2024 — aujourd’hui' },
    role: {
      en: 'Software engineer (front-end / Angular) · Hubbix accounting SaaS',
      fr: 'Ingénieur logiciel (front-end / Angular) · SaaS de comptabilité Hubbix',
    },
    summary: {
      en: 'Core accounting and invoicing modules of a SaaS used by 30,000+ users, in Angular 17 within an Nx monorepo: entry screens, invoices (OCR, Factur-X), totals with net, VAT and advance payments, and the onboarding flow to certified e-invoicing platforms.',
      fr: 'Modules cœur de comptabilité et de facturation d’un SaaS utilisé par plus de 30 000 utilisateurs, en Angular 17 dans un monorepo Nx : écrans de saisie, factures (OCR, Factur-X), calcul des totaux (net, TVA, acomptes) et parcours d’onboarding vers les plateformes de facturation électronique agréées.',
    },
    badges: [{ value: '30,000+', label: { en: 'users', fr: 'utilisateurs' } }],
    stack: ['Angular 17', 'Nx', 'Signals', 'NgRx', 'RxJS', 'NG-ZORRO', 'OAuth 2.0 / OIDC', 'Azure DevOps'],
    current: true,
  },
  {
    id: 'sanford',
    company: 'Sanford Federal',
    period: { en: 'Dec 2022 — Aug 2024', fr: 'Déc. 2022 — Août 2024' },
    role: {
      en: 'Full-stack developer (MEAN stack) · ERP / CRM for U.S. government contracting',
      fr: 'Développeur full-stack (stack MEAN) · ERP / CRM pour la sous-traitance du gouvernement américain',
    },
    summary: {
      en: 'Built and scaled a B2B ERP/CRM covering the full federal contract lifecycle, from opportunities and proposals to contracts and finance. Automated approvals, reminders and real-time notifications save 30+ hours of manual work per week.',
      fr: 'Développement et évolution d’un ERP/CRM B2B couvrant tout le cycle de vie des contrats fédéraux, des opportunités et propositions jusqu’aux contrats et à la finance. Les validations, relances et notifications temps réel automatisées font gagner plus de 30 heures de travail manuel par semaine.',
    },
    badges: [
      { value: '200+', label: { en: 'employees', fr: 'employés' } },
      { value: '30+', label: { en: 'modules', fr: 'modules' } },
      { value: '−90%', label: { en: 'Excel work', fr: 'de travail sous Excel' } },
    ],
    stack: ['Angular 13', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Azure Blob Storage', 'QuickBooks API'],
  },
  {
    id: 'sendatrack',
    company: 'Sendatrack',
    period: { en: 'Sep 2022 — Dec 2022', fr: 'Sept. 2022 — Déc. 2022' },
    role: { en: 'Full-stack developer · Internship', fr: 'Développeur full-stack · Stage' },
    summary: {
      en: 'Real-time map features for a B2B fleet management and tracking platform, in Angular 13 and Leaflet, fed by Laravel REST APIs that process and sync vehicle telemetry. Fixed data-synchronisation bugs that improved the platform’s stability.',
      fr: 'Fonctionnalités de cartographie temps réel pour une plateforme B2B de gestion de flotte et de suivi, en Angular 13 et Leaflet, alimentées par des API REST Laravel qui traitent et synchronisent la télémétrie des véhicules. Correction de bugs de synchronisation qui ont amélioré la stabilité de la plateforme.',
    },
    stack: ['Angular 13', 'TypeScript', 'Angular Material', 'Leaflet', 'Bootstrap', 'Laravel'],
  },
  {
    id: 'premo',
    company: 'PREMO Mediterranean',
    period: { en: 'Mar 2022 — Sep 2022', fr: 'Mars 2022 — Sept. 2022' },
    role: {
      en: 'Software engineer, web & mobile · End-of-studies internship',
      fr: 'Ingénieur logiciel web et mobile · Stage de fin d’études',
    },
    summary: {
      en: 'Analysed, designed and deployed a system that replaced paper forms on the shop floor: production team leads declare their shift on a tablet, and managers follow productivity and scrap per manufacturing line on the web.',
      fr: 'Analyse, conception et déploiement d’un système qui a remplacé les formulaires papier en atelier : les chefs d’équipe déclarent leur équipe sur tablette, et les responsables suivent la productivité et le scrap par ligne de production sur le web.',
    },
    highlights: [
      {
        en: 'Android tablet app (Java, MVVM, Retrofit): hours worked, output and scrap per fabrication order (OF); operator presence per line and shift; team groups.',
        fr: 'Application Android sur tablette (Java, MVVM, Retrofit) : heures travaillées, production et scrap par ordre de fabrication (OF) ; présence des opérateurs par ligne et par équipe ; groupes.',
      },
      {
        en: 'Angular + PrimeNG web platform for production managers and supervisors: OF progress, line productivity, presence and working hours, validation of declarations.',
        fr: 'Plateforme web Angular + PrimeNG pour les responsables de production et superviseurs : avancement des OF, productivité des lignes, présence et heures, validation des déclarations.',
      },
      {
        en: 'Spring Boot REST API with Spring Security and JWT: computes productivity, scrap rate and non-value-added hours per line and product, rolled up each month.',
        fr: 'API REST Spring Boot avec Spring Security et JWT : calcule productivité, taux de scrap et heures non à valeur ajoutée par ligne et par produit, cumulés chaque mois.',
      },
      {
        en: 'Requirements analysis and UML design, then deployment on a local server (Windows Server, Ubuntu VM, Apache Tomcat).',
        fr: 'Analyse des besoins et conception UML, puis déploiement sur un serveur local (Windows Server, VM Ubuntu, Apache Tomcat).',
      },
    ],
    badges: [
      { value: 'OF', label: { en: 'hours · output · scrap', fr: 'heures · production · scrap' } },
      { value: '3', label: { en: 'KPIs per line & product', fr: 'KPI par ligne & produit' } },
    ],
    stack: ['Spring Boot', 'Spring Security', 'MongoDB', 'Angular 13', 'PrimeNG', 'Android', 'MVVM', 'Retrofit'],
  },
  {
    id: 'sat',
    company: 'Smart Automation Technologies',
    period: { en: 'Aug 2021 — Jan 2022', fr: 'Août 2021 — Janv. 2022' },
    role: {
      en: 'Full-stack web developer · IDMAJ community portal · Internship',
      fr: 'Développeur web full-stack · Portail communautaire IDMAJ · Stage',
    },
    summary: {
      en: 'A multi-service institutional portal for employment and social services: an Angular 11 SPA with Angular Universal (SSR) and interactive maps, and a Node.js / Express REST API on MongoDB with JWT authentication, file uploads and automated emails.',
      fr: 'Un portail institutionnel multi-services pour l’emploi et les services sociaux : une SPA Angular 11 avec Angular Universal (SSR) et des cartes interactives, et une API REST Node.js / Express sur MongoDB avec authentification JWT, upload de fichiers et envoi automatisé d’e-mails.',
    },
    badges: [{ value: '40+', label: { en: 'business modules', fr: 'modules métier' } }],
    stack: ['Angular 11', 'Angular Universal', 'Leaflet', 'Node.js', 'Express', 'MongoDB', 'JWT'],
  },
];
