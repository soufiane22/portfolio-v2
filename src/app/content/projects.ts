import type { Localized } from '../i18n/lang';

export interface Repo {
  readonly href: string;
  /** Link text; defaults to "GitHub" when omitted. */
  readonly label?: string;
}

export interface Project {
  readonly id: string;
  readonly org: Localized;
  readonly period: Localized;
  readonly title: Localized;
  readonly summary: Localized;
  readonly stack: readonly string[];
  readonly decision: Localized;
  /** Public repositories. An empty list means the codebase is private. */
  readonly repos: readonly Repo[];
  /** Slug of the case study page, when one exists. */
  readonly caseStudy?: string;
  readonly inProgress?: boolean;
}

export const projects: readonly Project[] = [
  {
    id: 'matys',
    org: { en: 'Matys by Cegid', fr: 'Matys by Cegid' },
    period: { en: 'Sep 2024 — now', fr: 'Sept. 2024 — aujourd’hui' },
    title: { en: 'Accounting SaaS for 30,000+ users', fr: 'SaaS de comptabilité pour 30 000+ utilisateurs' },
    summary: {
      en: 'E-invoicing screens for the French reform: invoice processing, e-invoice statuses and onboarding to certified platforms. 340+ merged pull requests.',
      fr: 'Écrans de la facture électronique pour la réforme française : traitement des factures, statuts et onboarding vers les plateformes agréées. Plus de 340 pull requests mergées.',
    },
    stack: ['Angular', 'TypeScript', 'RxJS', 'Nx', 'Azure DevOps'],
    decision: {
      en: 'One processing screen per invoice, split into independent sections.',
      fr: 'Un seul écran de traitement par facture, découpé en rubriques indépendantes.',
    },
    repos: [],
    caseStudy: 'matys',
  },
  {
    id: 'sanford',
    org: { en: 'Sanford Federal', fr: 'Sanford Federal' },
    period: { en: 'Dec 2022 — Aug 2024', fr: 'Déc. 2022 — Août 2024' },
    title: { en: 'ERP for government contracting', fr: 'ERP pour la sous-traitance gouvernementale' },
    summary: {
      en: '30+ modules for 200+ employees, from SAM.gov opportunities and proposals to contracts, vendor bills and P&L. Excel work dropped by 90%.',
      fr: 'Plus de 30 modules pour plus de 200 employés, des opportunités SAM.gov et propositions jusqu’aux contrats, factures fournisseurs et P&L. Le travail sous Excel a baissé de 90 %.',
    },
    stack: ['Angular', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'QuickBooks API'],
    decision: {
      en: 'Made the API the security boundary: every route chains role, department, Joi validation and record-level guards — 20+ roles across 13 departments.',
      fr: 'Faire de l’API la frontière de sécurité : chaque route enchaîne contrôles de rôle, de département, validation Joi et accès à l’enregistrement — plus de 20 rôles répartis dans 13 départements.',
    },
    repos: [],
    caseStudy: 'sanford',
  },
  {
    id: 'premo',
    org: { en: 'PREMO Mediterranean', fr: 'PREMO Mediterranean' },
    period: { en: 'Mar 2022 — Sep 2022', fr: 'Mars 2022 — Sept. 2022' },
    title: {
      en: 'Production and workforce tracking system',
      fr: 'Système de gestion et de suivi de la production et des employés',
    },
    summary: {
      en: 'Team leads declare hours, output and scrap per fabrication order and record shift presence per production line on a tablet; the system computes productivity, scrap rate and non-value-added hours per line and product, validated and charted on the web.',
      fr: 'Les chefs d’équipe déclarent sur tablette heures, production et scrap par ordre de fabrication et pointent la présence par ligne de production ; le système calcule productivité, taux de scrap et heures non à valeur ajoutée par ligne et par produit, validés et suivis sur le web.',
    },
    stack: ['Spring Boot', 'MongoDB', 'Angular', 'PrimeNG', 'Android', 'Java', 'MVVM', 'Retrofit'],
    decision: {
      en: 'One Spring Boot REST API serves both the Angular web app and the Android tablet app, with the architecture designed up front in UML.',
      fr: 'Une seule API REST Spring Boot sert à la fois l’application web Angular et l’application Android sur tablette, avec l’architecture conçue en amont en UML.',
    },
    repos: [
      { href: 'https://github.com/soufiane22/ProductionManagmentBackEnd', label: 'GitHub · Backend' },
      { href: 'https://github.com/soufiane22/ProductionManagmentWeb', label: 'GitHub · Web' },
      { href: 'https://github.com/soufiane22/ProductionManagmentMobile', label: 'GitHub · Mobile' },
    ],
    caseStudy: 'premo',
  },
  // TODO: Factoo hidden until the project is finished. Uncomment to show it again.
  /*
  {
    id: 'factoo',
    org: { en: 'Personal project', fr: 'Projet personnel' },
    period: { en: '2025', fr: '2025' },
    title: {
      en: 'Factoo — personal invoicing app (in progress)',
      fr: 'Factoo — application de facturation personnelle (en cours)',
    },
    summary: {
      en: 'Invoices, clients and payment tracking for freelancers, built in the open.',
      fr: 'Factures, clients et suivi des paiements pour freelances, développé en open source.',
    },
    stack: ['Angular', 'Signals', 'Node.js', 'MongoDB'],
    decision: {
      en: 'Signals for UI state, RxJS only at the HTTP boundary, to keep components simple to read.',
      fr: 'Signals pour l’état de l’interface, RxJS uniquement à la frontière HTTP, pour garder des composants simples à lire.',
    },
    // TODO: add the demo URL once Factoo is deployed.
    repos: [{ href: 'https://github.com/soufiane22' }],
    inProgress: true,
  },
  */
];
