import type { Localized } from '../i18n/lang';
import type { Repo } from './projects';

export interface ArchNode {
  readonly name: Localized;
  readonly detail?: Localized;
  /** Highlighted domain tags (the part the author owned). */
  readonly tags?: readonly string[];
  readonly libs?: readonly string[];
  readonly caption?: Localized;
  readonly owned?: boolean;
}

export interface ArchColumn {
  readonly step: number;
  readonly label: Localized;
  readonly arrow: boolean;
  readonly nodes: readonly ArchNode[];
}

export interface Metric {
  readonly value: string;
  readonly label: Localized;
  readonly accent?: boolean;
  readonly todo?: boolean;
}

export interface TitledText {
  readonly title: Localized;
  readonly body: Localized;
}

export interface ModuleGroup {
  readonly name: Localized;
  readonly items: readonly TitledText[];
}

export interface Challenge {
  readonly problem: Localized;
  readonly solution: Localized;
  readonly tags?: readonly string[];
}

export interface Contribution {
  readonly summary: Localized;
  readonly items: readonly Localized[];
}

export interface MediaImage {
  /** Path under public/, without a leading slash. */
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: Localized;
  readonly caption: Localized;
}

export interface CaseStudyMedia {
  readonly video?: {
    /** 11-character YouTube id; the player loads only when the visitor clicks play. */
    readonly youtubeId: string;
    readonly title: Localized;
    readonly caption: Localized;
    /** Self-hosted poster (path under public/), so nothing loads from YouTube before the click. */
    readonly poster: string;
  };
  readonly gallery?: {
    readonly title: Localized;
    readonly caption: Localized;
    readonly items: readonly MediaImage[];
  };
}

/** Optional sections render only when present; their numbering adapts automatically. */
export interface CaseStudy {
  readonly slug: string;
  readonly number: number;
  readonly org: string;
  readonly title: Localized;
  readonly role: Localized;
  readonly period: Localized;
  readonly team: Localized;
  /** Public repositories. An empty list means the codebase is private. */
  readonly repos: readonly Repo[];
  readonly problem: Localized;
  readonly context: readonly Localized[];
  readonly architecture: {
    readonly columns: readonly ArchColumn[];
    readonly pipeline: { readonly left: Localized; readonly right: Localized };
    readonly caption: Localized;
  };
  readonly decision: {
    readonly headline: Localized;
    readonly before: Localized;
    /** Optional inline code snippet between `before` and `after`. */
    readonly code?: string;
    readonly after?: Localized;
  };
  readonly metrics: readonly Metric[];
  readonly outcome: Localized;
  readonly stack: readonly string[];
  readonly media?: CaseStudyMedia;
  readonly flow?: { readonly heading: Localized; readonly steps: readonly Localized[] };
  readonly modules?: readonly ModuleGroup[];
  readonly rules?: readonly TitledText[];
  readonly challenges?: readonly Challenge[];
  readonly patterns?: readonly TitledText[];
  readonly contribution?: Contribution;
}

export const caseStudies: readonly CaseStudy[] = [
  {
    // Sources: CV (user count) and a read-only analysis of the private codebase — architecture,
    // CI steps and the feature-flag service from the source, counts and authorship from git
    // history (Sep 2024 — Oct 2026).
    slug: 'matys',
    number: 1,
    org: 'Matys by Cegid',
    title: { en: 'Accounting SaaS for 30,000+ users', fr: 'SaaS de comptabilité pour 30 000+ utilisateurs' },
    role: { en: 'Software engineer (front-end / Angular)', fr: 'Ingénieur logiciel (front-end / Angular)' },
    period: { en: 'Sep 2024 — now', fr: 'Sept. 2024 — aujourd’hui' },
    team: { en: 'Team of 15+ developers', fr: 'Équipe de plus de 15 développeurs' },
    repos: [],
    problem: {
      en: 'The French e-invoicing reform requires companies to receive electronic invoices through certified platforms from September 2026. Accountants have to process those invoices — statuses, credit notes, matching with orders — in the product they already spend their day in, while the rules were still moving during development.',
      fr: 'La réforme de la facturation électronique oblige les entreprises françaises à recevoir leurs factures via des plateformes agréées dès septembre 2026. Les comptables doivent traiter ces factures — statuts, avoirs, rapprochement avec les commandes — dans le produit où ils passent déjà leur journée, alors que les règles bougeaient encore pendant le développement.',
    },
    context: [
      {
        en: 'An accounting SaaS used by more than 30,000 users, built in Angular 17 inside an Nx monorepo that holds two applications: Compta, and Digicompta — the invoice dematerialisation and e-invoicing app.',
        fr: 'Un SaaS de comptabilité utilisé par plus de 30 000 utilisateurs, construit en Angular 17 dans un monorepo Nx qui regroupe deux applications : Compta, et Digicompta — la dématérialisation des factures et la facture électronique.',
      },
      {
        en: 'I work mostly on Digicompta, in a team of 15+ developers. Releases go through Azure DevOps pipelines; authentication uses OAuth 2.0 / OIDC, shared with the other products of the suite.',
        fr: 'Je travaille surtout sur Digicompta, dans une équipe de plus de 15 développeurs. Les livraisons passent par des pipelines Azure DevOps ; l’authentification utilise OAuth 2.0 / OIDC, partagée avec les autres produits de la suite.',
      },
    ],
    architecture: {
      columns: [
        {
          step: 1,
          label: { en: 'client', fr: 'client' },
          arrow: false,
          nodes: [
            {
              name: { en: 'Digicompta app', fr: 'App Digicompta' },
              detail: { en: 'Angular 17 · Signals · NG-ZORRO', fr: 'Angular 17 · Signals · NG-ZORRO' },
              tags: ['Factur-X', 'e-reporting', 'onboarding'],
              libs: ['shell', 'features', 'ui', 'data-access'],
              caption: { en: 'Nx workspace', fr: 'Workspace Nx' },
              owned: true,
            },
            {
              name: { en: 'Compta app', fr: 'App Compta' },
              detail: { en: 'general ledger · VAT · bank', fr: 'grand livre · TVA · banque' },
            },
          ],
        },
        {
          step: 2,
          label: { en: 'edge', fr: 'périmètre' },
          arrow: true,
          nodes: [
            {
              name: { en: 'Identity provider', fr: 'Fournisseur d’identité' },
              detail: { en: 'OAuth 2.0 / OIDC', fr: 'OAuth 2.0 / OIDC' },
            },
            {
              name: { en: 'HTTP interceptors', fr: 'Intercepteurs HTTP' },
              detail: { en: 'tenant & company on every call', fr: 'locataire & dossier sur chaque appel' },
            },
          ],
        },
        {
          step: 3,
          label: { en: 'services', fr: 'services' },
          arrow: true,
          nodes: [
            {
              name: { en: 'Accounting APIs', fr: 'API de comptabilité' },
              detail: { en: 'REST · entries · invoices · statuses', fr: 'REST · écritures · factures · statuts' },
            },
          ],
        },
        {
          step: 4,
          label: { en: 'reform', fr: 'réforme' },
          arrow: true,
          nodes: [
            {
              name: { en: 'Certified platforms', fr: 'Plateformes agréées' },
              detail: { en: 'e-invoices · e-reporting', fr: 'factures électroniques · e-reporting' },
            },
          ],
        },
      ],
      pipeline: {
        left: { en: 'Azure DevOps · CI/CD', fr: 'Azure DevOps · CI/CD' },
        right: {
          en: 'one pipeline per app → lint · Jest tests · production build',
          fr: 'un pipeline par application → lint · tests Jest · build de production',
        },
      },
      caption: {
        en: 'fig. 01 — simplified; amber marks the part I work on.',
        fr: 'fig. 01 — simplifiée ; l’ambre marque la partie sur laquelle je travaille.',
      },
    },
    decision: {
      headline: {
        en: 'One processing screen per invoice, split into independent sections.',
        fr: 'Un seul écran de traitement par facture, découpé en rubriques indépendantes.',
      },
      before: {
        en: 'Each section has its own component and keeps its state in a service like ',
        fr: 'Chaque rubrique a son composant et garde son état dans un service comme ',
      },
      code: 'FactureTvaFormulaireService',
      after: {
        en: '. A new rule of the reform becomes a new section, not a rewrite: discounts, prepayments, original invoice of a credit note, e-invoice statuses.',
        fr: '. Une nouvelle règle de la réforme devient une rubrique, pas une réécriture : escompte, paiements anticipés, facture d’origine d’un avoir, statuts de facture électronique.',
      },
    },
    contribution: {
      summary: {
        en: 'About 630 commits and 340+ merged pull requests since September 2024 — second among 15+ contributors.',
        fr: 'Environ 630 commits et plus de 340 pull requests mergées depuis septembre 2024 — deuxième sur plus de 15 contributeurs.',
      },
      items: [
        {
          en: 'Evolved the accounting processing screen for incoming invoices: detail accounts, input checks, amounts including VAT, and the original invoice of a credit note.',
          fr: 'Fait évoluer l’écran de traitement comptable des factures reçues : comptes de détail, contrôles de saisie, montants TTC et facture d’origine d’un avoir.',
        },
        {
          en: 'Built the purchase-invoice lifecycle screens: e-invoice statuses, their history and how they display.',
          fr: 'Développé les écrans du cycle de vie des factures d’achat : statuts de facture électronique, leur historique et leur affichage.',
        },
        {
          en: 'Worked on the onboarding flow to a certified e-invoicing platform: identity and address checks, and a notice when the delegation was not granted.',
          fr: 'Travaillé sur le parcours d’onboarding vers une plateforme agréée : contrôles d’identité et d’adresse, et un message quand la délégation n’a pas été accordée.',
        },
        {
          en: 'Handled expired sessions by sending the user back through the Cegid login on a 401.',
          fr: 'Géré les sessions expirées en renvoyant l’utilisateur vers la connexion Cegid sur une erreur 401.',
        },
      ],
    },
    metrics: [
      { value: '30,000+', label: { en: 'users', fr: 'utilisateurs' } },
      { value: '340+', label: { en: 'merged pull requests', fr: 'pull requests mergées' }, accent: true },
      { value: '#2', label: { en: 'contributor among 15+ developers', fr: 'contributeur sur 15+ développeurs' } },
    ],
    outcome: {
      en: 'The team shipped 47 production releases since September 2024. The e-invoicing screens I worked on went out batch by batch.',
      fr: 'L’équipe a livré 47 versions en production depuis septembre 2024. Les écrans de facture électronique sur lesquels j’ai travaillé sont partis lot par lot.',
    },
    stack: ['Angular 17', 'TypeScript', 'RxJS', 'Signals', 'Nx', 'NG-ZORRO', 'Jest', 'Factur-X', 'OAuth 2.0 / OIDC', 'Azure DevOps'],
  },
  {
    // Sources: CV (Sanford Federal entry) and a read-only analysis of the private codebase
    // (counts computed from the source, authorship from git history). Internal brand names,
    // people and identifiers are intentionally left out.
    slug: 'sanford',
    number: 2,
    org: 'Sanford Federal',
    title: { en: 'ERP for government contracting', fr: 'ERP pour la sous-traitance gouvernementale' },
    role: { en: 'Full-stack developer (MEAN stack)', fr: 'Développeur full-stack (stack MEAN)' },
    period: { en: 'Dec 2022 — Aug 2024', fr: 'Déc. 2022 — Août 2024' },
    team: { en: 'Team of 10+ developers', fr: 'Équipe de plus de 10 développeurs' },
    repos: [],
    problem: {
      en: 'A U.S. federal contractor tracked much of its work — opportunities, proposals, contracts, vendor bills — in Excel files passed between capture, proposals, operations and finance. The goal was one system where each team works on the same records, with the right access and the deadlines handled for them.',
      fr: 'Un sous-traitant fédéral américain suivait une grande partie de son activité — opportunités, propositions, contrats, factures fournisseurs — dans des fichiers Excel échangés entre capture, propositions, opérations et finance. L’objectif : un seul système où chaque équipe travaille sur les mêmes données, avec les bons accès et des échéances gérées pour elle.',
    },
    context: [
      {
        en: 'An internal B2B ERP/CRM used by 200+ employees across 13 departments, covering the full federal contract lifecycle from opportunity tracking and proposals to contracts and finance.',
        fr: 'Un ERP/CRM B2B interne utilisé par plus de 200 employés répartis dans 13 départements, couvrant tout le cycle de vie des contrats fédéraux, du suivi des opportunités et des propositions jusqu’aux contrats et à la finance.',
      },
      {
        en: 'One repository: an Angular 13 PWA served by an Express API on MongoDB. I worked on it from December 2022 to August 2024 in a team of 10+ developers, mostly on the proposals and contracts workspaces, reporting, access control and validation.',
        fr: 'Un seul dépôt : une PWA Angular 13 servie par une API Express sur MongoDB. J’y ai travaillé de décembre 2022 à août 2024 dans une équipe de plus de 10 développeurs, surtout sur les espaces propositions et contrats, le reporting, le contrôle d’accès et la validation.',
      },
    ],
    flow: {
      heading: { en: 'From opportunity to invoice', fr: 'De l’opportunité à la facture' },
      steps: [
        { en: 'SAM.gov feed', fr: 'Flux SAM.gov' },
        { en: 'Research', fr: 'Recherche' },
        { en: '5Ws qualification', fr: 'Qualification 5W' },
        { en: 'Proposal', fr: 'Proposition' },
        { en: 'QC review', fr: 'Revue QC' },
        { en: 'Submitted → Won', fr: 'Soumise → Gagnée' },
        { en: 'Contract · task orders', fr: 'Contrat · bons de commande' },
        { en: 'Bills & invoices', fr: 'Factures fournisseurs & clients' },
        { en: 'P&L · projections', fr: 'P&L · projections' },
      ],
    },
    architecture: {
      columns: [
        {
          step: 1,
          label: { en: 'client', fr: 'client' },
          arrow: false,
          nodes: [
            {
              name: { en: 'Angular 13 PWA', fr: 'PWA Angular 13' },
              detail: { en: '58 lazy routes · 193 components', fr: '58 routes lazy · 193 composants' },
              tags: ['role guards', 'token interceptor', 'dynamic table'],
              libs: ['Angular Material', 'ApexCharts', 'Highcharts', 'ExcelJS', 'jsPDF'],
              caption: { en: 'state in RxJS services, no store', fr: 'état dans des services RxJS, sans store' },
              owned: true,
            },
          ],
        },
        {
          step: 2,
          label: { en: 'api', fr: 'api' },
          arrow: true,
          nodes: [
            {
              name: { en: 'Express REST API', fr: 'API REST Express' },
              detail: { en: '≈364 endpoints · 41 domain routers', fr: '≈364 endpoints · 41 routeurs métier' },
              tags: ['role & department guards', 'Joi validators'],
              libs: ['JWT cookies', 'email OTP', 'activity audit'],
              owned: true,
            },
            {
              name: { en: 'Real-time & scheduling', fr: 'Temps réel & planification' },
              detail: { en: 'change streams → Socket.IO · Web Push · node-cron', fr: 'change streams → Socket.IO · Web Push · node-cron' },
            },
          ],
        },
        {
          step: 3,
          label: { en: 'data', fr: 'données' },
          arrow: true,
          nodes: [
            {
              name: { en: 'MongoDB · Mongoose', fr: 'MongoDB · Mongoose' },
              detail: { en: '57 models · 281 aggregation pipelines', fr: '57 modèles · 281 pipelines d’agrégation' },
            },
            {
              name: { en: 'Azure Blob Storage', fr: 'Azure Blob Storage' },
              detail: { en: 'attachments · training videos', fr: 'pièces jointes · vidéos de formation' },
            },
          ],
        },
        {
          step: 4,
          label: { en: 'integrations', fr: 'intégrations' },
          arrow: true,
          nodes: [
            {
              name: { en: 'SAM.gov API', fr: 'API SAM.gov' },
              detail: { en: 'federal opportunity feed', fr: 'flux d’opportunités fédérales' },
              owned: true,
            },
            {
              name: { en: 'QuickBooks Online', fr: 'QuickBooks Online' },
              detail: { en: 'bills · invoices · P&L', fr: 'factures · P&L' },
            },
            {
              name: { en: 'Microsoft Graph', fr: 'Microsoft Graph' },
              detail: { en: 'Outlook mail inside contracts', fr: 'emails Outlook dans les contrats' },
            },
          ],
        },
      ],
      pipeline: {
        left: { en: 'One deployable', fr: 'Un seul déploiement' },
        right: {
          en: 'ng build --aot → Angular PWA served by Express · JWT in httpOnly cookies',
          fr: 'ng build --aot → PWA Angular servie par Express · JWT en cookies httpOnly',
        },
      },
      caption: {
        en: 'fig. 01 — simplified; amber marks the parts I built or worked on most.',
        fr: 'fig. 01 — simplifiée ; l’ambre marque les parties que j’ai construites ou le plus travaillées.',
      },
    },
    modules: [
      {
        name: { en: 'Capture & proposals', fr: 'Capture & propositions' },
        items: [
          {
            title: { en: 'SAM.gov opportunities feed', fr: 'Flux d’opportunités SAM.gov' },
            body: {
              en: 'Paged import of federal notices, NAICS/keyword filters, saved presets, duplicate and amendment checks.',
              fr: 'Import paginé des avis fédéraux, filtres NAICS / mots-clés, préférences sauvegardées, détection des doublons et amendements.',
            },
          },
          {
            title: { en: 'Research · 5Ws · Proposals', fr: 'Recherche · 5W · Propositions' },
            body: {
              en: 'Qualify, assign by role level, comment, attach files and track every status change.',
              fr: 'Qualifier, assigner par niveau de rôle, commenter, joindre des fichiers et tracer chaque changement de statut.',
            },
          },
          {
            title: { en: 'Quality control', fr: 'Contrôle qualité' },
            body: {
              en: 'A live QC queue with compliance outcomes before anything is submitted to the government.',
              fr: 'Une file QC en temps réel avec des verdicts de conformité avant toute soumission au gouvernement.',
            },
          },
        ],
      },
      {
        name: { en: 'Contracts & operations', fr: 'Contrats & opérations' },
        items: [
          {
            title: { en: 'Contracts workspace', fr: 'Espace contrats' },
            body: {
              en: 'Contracts, IDIQs, BPAs and task orders with timeline, changelog, option years, staffing and Outlook emails.',
              fr: 'Contrats, IDIQ, BPA et bons de commande avec chronologie, journal des modifications, années d’option, staffing et emails Outlook.',
            },
          },
          {
            title: { en: 'Client relationship & concerns', fr: 'Relation client & réclamations' },
            body: {
              en: 'A 4-2-1 check-in cadence and client concerns handled under SLA with QC and legal review.',
              fr: 'Une cadence de suivi 4-2-1 et des réclamations clients traitées sous SLA avec revue QC et juridique.',
            },
          },
          {
            title: { en: 'Registrations · terminations', fr: 'Enregistrements · résiliations' },
            body: {
              en: 'Business registrations with renewal reminders, and contract terminations by type.',
              fr: 'Enregistrements d’entreprise avec rappels de renouvellement, et résiliations de contrats par type.',
            },
          },
        ],
      },
      {
        name: { en: 'Finance', fr: 'Finance' },
        items: [
          {
            title: { en: 'Accounts payable & batches', fr: 'Fournisseurs & lots de paiement' },
            body: {
              en: 'Vendor bills synced to QuickBooks, multi-level approvals, audit checks and payment batches.',
              fr: 'Factures fournisseurs synchronisées avec QuickBooks, validations à plusieurs niveaux, contrôles d’audit et lots de paiement.',
            },
          },
          {
            title: { en: 'AR, P&L & projections', fr: 'Clients, P&L & projections' },
            body: {
              en: 'Invoices, P&L auditing, unbilled contracts and monthly receivable projections in USD.',
              fr: 'Factures clients, audit P&L, contrats non facturés et projections mensuelles de créances en USD.',
            },
          },
        ],
      },
      {
        name: { en: 'People & reporting', fr: 'Équipe & reporting' },
        items: [
          {
            title: { en: 'Team space · HR · tasks · goals', fr: 'Équipe · RH · tâches · objectifs' },
            body: {
              en: 'Org chart, HR requests with dual approval, tasks, department goals and a training space.',
              fr: 'Organigramme, demandes RH à double validation, tâches, objectifs par département et espace de formation.',
            },
          },
          {
            title: { en: 'Dashboards & reports', fr: 'Tableaux de bord & rapports' },
            body: {
              en: 'Win rate, win/loss, pipelines, awards, operations and finance reports, with Excel and PDF exports.',
              fr: 'Taux de réussite, gagnés/perdus, pipelines, attributions, rapports opérations et finance, avec exports Excel et PDF.',
            },
          },
        ],
      },
    ],
    rules: [
      {
        title: { en: 'Proposal lifecycle', fr: 'Cycle de vie d’une proposition' },
        body: {
          en: 'Research → 5Ws → Proposal → Submitted to QC → Submitted, then Won, Lost (by value, pricing or unknown), Withdrawn or Canceled. Every transition is kept in a status history.',
          fr: 'Recherche → 5W → Proposition → Soumise au QC → Soumise, puis Gagnée, Perdue (valeur, prix ou inconnu), Retirée ou Annulée. Chaque transition est conservée dans un historique de statuts.',
        },
      },
      {
        title: { en: 'Four sign-offs before a bill is paid', fr: 'Quatre validations avant de payer une facture' },
        body: {
          en: 'Initial review → technical review → QC head → executive approval. Each step can approve, reject or revoke, and audit checks add a risk rating and score.',
          fr: 'Revue initiale → revue technique → responsable QC → validation de la direction. Chaque étape peut approuver, rejeter ou révoquer, et les contrôles d’audit ajoutent un niveau de risque et un score.',
        },
      },
      {
        title: { en: 'Client concerns under SLA', fr: 'Réclamations clients sous SLA' },
        body: {
          en: 'Draft → approved response → QC or legal review → close or reopen. Alerts escalate by email and in-app at 72, 48 and 24 hours without a response.',
          fr: 'Brouillon → réponse approuvée → revue QC ou juridique → clôture ou réouverture. Des alertes email et in-app montent en urgence à 72, 48 et 24 heures sans réponse.',
        },
      },
      {
        title: { en: '4-2-1 relationship cadence', fr: 'Cadence relationnelle 4-2-1' },
        body: {
          en: 'Each check-in schedules the next one: every 14 days for a point of contact, every month for a contracting officer.',
          fr: 'Chaque point de suivi planifie le suivant : tous les 14 jours pour un interlocuteur, tous les mois pour un contracting officer.',
        },
      },
      {
        title: { en: 'Edit only what you own', fr: 'Ne modifier que ce dont on a la charge' },
        body: {
          en: 'A proposal can be edited only by its manager, team lead, POD admin, assignee or supervisor; dashboards are scoped to the viewer’s team.',
          fr: 'Une proposition n’est modifiable que par son manager, son team lead, son POD admin, la personne assignée ou le superviseur ; les tableaux de bord sont filtrés sur l’équipe de la personne connectée.',
        },
      },
      {
        title: { en: 'Deadlines nobody has to remember', fr: 'Des échéances que personne n’a à retenir' },
        body: {
          en: 'Registration renewals trigger a reminder 15 days before the due date; a daily report reminder goes out every evening.',
          fr: 'Les renouvellements d’enregistrement déclenchent un rappel 15 jours avant l’échéance ; un rappel de rapport quotidien part chaque soir.',
        },
      },
    ],
    decision: {
      headline: {
        en: 'Treat the API as the real security boundary: every route chains its own role, department, validation and record-level guards.',
        fr: 'Faire de l’API la vraie frontière de sécurité : chaque route enchaîne ses propres contrôles de rôle, de département, de validation et d’accès à l’enregistrement.',
      },
      before: {
        en: 'Hiding buttons by role in Angular is only cosmetic. On the server, each route declares the departments and roles it accepts, a Joi schema, and checks such as ',
        fr: 'Masquer des boutons selon le rôle dans Angular n’est que cosmétique. Côté serveur, chaque route déclare les départements et rôles acceptés, un schéma Joi, et des contrôles comme ',
      },
      code: 'canUpdateProposal',
      after: {
        en: '. Role checks appear on 284 route declarations. I wrote most of the Joi validation layer.',
        fr: '. Les contrôles de rôle figurent sur 284 déclarations de routes. J’ai écrit la majeure partie de la couche de validation Joi.',
      },
    },
    challenges: [
      {
        problem: {
          en: 'Bring federal opportunities into the pipeline without re-typing them.',
          fr: 'Faire entrer les opportunités fédérales dans le pipeline sans les ressaisir.',
        },
        solution: {
          en: 'A SAM.gov feed that pages through new notices, filters by NAICS and keyword, flags duplicates and amendments, and turns an approved notice into a 5Ws or capability-statement record.',
          fr: 'Un flux SAM.gov qui parcourt les nouveaux avis par pages, filtre par NAICS et mots-clés, signale doublons et amendements, et transforme un avis approuvé en fiche 5W ou capability statement.',
        },
        tags: ['SAM.gov API', 'Mongoose'],
      },
      {
        problem: {
          en: 'QC reviewers must see a proposal the moment it is submitted.',
          fr: 'Les relecteurs QC doivent voir une proposition dès qu’elle est soumise.',
        },
        solution: {
          en: 'MongoDB change streams push updates into Socket.IO rooms per user and for the QC team, backed by Web Push and 77 notification types.',
          fr: 'Les change streams MongoDB poussent les mises à jour dans des rooms Socket.IO par utilisateur et pour l’équipe QC, avec Web Push et 77 types de notifications.',
        },
        tags: ['Change streams', 'Socket.IO', 'Web Push'],
      },
      {
        problem: {
          en: 'Scheduled reminders must survive a server restart.',
          fr: 'Les rappels planifiés doivent survivre à un redémarrage du serveur.',
        },
        solution: {
          en: 'Cron jobs are stored in MongoDB; on boot, missed runs are replayed and the jobs re-armed.',
          fr: 'Les tâches cron sont stockées dans MongoDB ; au démarrage, les exécutions manquées sont rejouées et les tâches réarmées.',
        },
        tags: ['node-cron', 'cron-parser'],
      },
      {
        problem: {
          en: 'Leadership needs numbers without exporting to Excel.',
          fr: 'La direction a besoin de chiffres sans passer par Excel.',
        },
        solution: {
          en: 'Role-scoped aggregation pipelines ($facet, $group by month) feed dashboards for win rate, pipelines, P&L and projections, with Excel and PDF exports when a file is needed.',
          fr: 'Des pipelines d’agrégation filtrés par rôle ($facet, $group par mois) alimentent les tableaux de bord de taux de réussite, pipelines, P&L et projections, avec exports Excel et PDF quand un fichier est nécessaire.',
        },
        tags: ['Aggregation', 'ApexCharts', 'ExcelJS', 'jsPDF'],
      },
    ],
    patterns: [
      {
        title: { en: 'Middleware chain per route', fr: 'Chaîne de middlewares par route' },
        body: {
          en: 'Activity name → department guard → role guard → Joi schema → upload → record-level guard → controller.',
          fr: 'Nom d’activité → contrôle de département → contrôle de rôle → schéma Joi → upload → contrôle au niveau de l’enregistrement → contrôleur.',
        },
      },
      {
        title: { en: 'Single-flight token refresh', fr: 'Rafraîchissement de jeton unique' },
        body: {
          en: 'The HTTP interceptor refreshes the JWT once on a 401, queues concurrent requests, and offers a session-extend dialog if the refresh fails.',
          fr: 'L’intercepteur HTTP rafraîchit le JWT une seule fois sur un 401, met en file les requêtes concurrentes et propose de prolonger la session si le rafraîchissement échoue.',
        },
      },
      {
        title: { en: 'Config-driven table', fr: 'Tableau piloté par configuration' },
        body: {
          en: 'One dynamic table component with column config, server-side pagination, sticky header and actions, expandable rows and template slots.',
          fr: 'Un composant de tableau dynamique avec configuration des colonnes, pagination côté serveur, en-tête et actions figés, lignes dépliables et slots de templates.',
        },
      },
      {
        title: { en: 'Audit trail by default', fr: 'Traçabilité par défaut' },
        body: {
          en: 'A middleware records user, device, method, URL, status and duration for every authenticated call.',
          fr: 'Un middleware enregistre utilisateur, appareil, méthode, URL, statut et durée pour chaque appel authentifié.',
        },
      },
      {
        title: { en: 'Two-factor login', fr: 'Connexion à deux facteurs' },
        body: {
          en: 'bcrypt password check, then a short-lived emailed OTP; access and refresh tokens live in httpOnly cookies.',
          fr: 'Vérification du mot de passe avec bcrypt, puis un OTP envoyé par email à durée courte ; jetons d’accès et de rafraîchissement en cookies httpOnly.',
        },
      },
    ],
    contribution: {
      summary: {
        en: '1,388 commits between January 2023 and July 2024 — about a quarter of the project’s history, second among 10+ contributors.',
        fr: '1 388 commits entre janvier 2023 et juillet 2024 — environ un quart de l’historique du projet, deuxième sur plus de 10 contributeurs.',
      },
      items: [
        {
          en: 'Built the SAM.gov opportunities feed end to end: API client, models, saved filters and the Angular module.',
          fr: 'Construit le flux d’opportunités SAM.gov de bout en bout : client d’API, modèles, filtres sauvegardés et module Angular.',
        },
        {
          en: 'Created the registrations module with its renewal reminders, plus tasks, goals and department goals.',
          fr: 'Créé le module d’enregistrements avec ses rappels de renouvellement, ainsi que les tâches, objectifs et objectifs par département.',
        },
        {
          en: 'Added P&L auditing, unbilled contracts, new business, subcontract opportunities, the awards report and team performance scores.',
          fr: 'Ajouté l’audit P&L, les contrats non facturés, le new business, les opportunités de sous-traitance, le rapport d’attributions et les scores de performance des équipes.',
        },
        {
          en: 'Wrote most of the Joi validation layer and much of the role and permission work.',
          fr: 'Écrit la majeure partie de la couche de validation Joi et une grande part du travail sur les rôles et permissions.',
        },
        {
          en: 'Worked most in the proposals and contracts workspaces, the shared table, the dashboard and exports.',
          fr: 'Le plus travaillé dans les espaces propositions et contrats, le tableau partagé, le tableau de bord et les exports.',
        },
      ],
    },
    metrics: [
      { value: '200+', label: { en: 'employees using it', fr: 'employés utilisateurs' } },
      { value: '−90%', label: { en: 'manual Excel work', fr: 'de travail manuel sous Excel' }, accent: true },
      { value: '30+ h', label: { en: 'saved per week by automation', fr: 'économisées par semaine grâce à l’automatisation' } },
      { value: '30+', label: { en: 'business modules', fr: 'modules métier' } },
      { value: '57', label: { en: 'roles across 13 departments', fr: 'rôles répartis dans 13 départements' } },
      { value: '≈364', label: { en: 'API endpoints', fr: 'endpoints d’API' } },
    ],
    outcome: {
      en: 'One platform now carries the contract lifecycle for 200+ employees. Manual Excel work dropped by 90%, and automated approvals, reminders and notifications save more than 30 hours of manual work every week.',
      fr: 'Une seule plateforme porte désormais le cycle de vie des contrats pour plus de 200 employés. Le travail manuel sous Excel a baissé de 90 %, et les validations, rappels et notifications automatisés font gagner plus de 30 heures de travail manuel chaque semaine.',
    },
    stack: [
      'Angular 13',
      'TypeScript',
      'RxJS',
      'Angular Material',
      'Bootstrap 5',
      'ApexCharts',
      'Highcharts',
      'ExcelJS',
      'jsPDF',
      'PWA',
      'Node.js',
      'Express',
      'MongoDB',
      'Mongoose',
      'Joi',
      'JWT',
      'bcrypt',
      'Socket.IO',
      'Web Push',
      'node-cron',
      'Nodemailer',
      'Azure Blob Storage',
      'Microsoft Graph / MSAL',
      'QuickBooks Online API',
      'SAM.gov API',
    ],
  },
  {
    // Sources: CV (PREMO Mediterranean entry) and the three public repositories (models, services,
    // controllers and screens — formulas from notification_heures_serviceImpli.java).
    slug: 'premo',
    number: 3,
    org: 'PREMO Mediterranean',
    title: {
      en: 'Production and workforce tracking system',
      fr: 'Système de gestion et de suivi de la production et des employés',
    },
    role: {
      en: 'Software engineer, web & mobile',
      fr: 'Ingénieur logiciel web et mobile',
    },
    period: { en: 'Mar 2022 — Sep 2022', fr: 'Mars 2022 — Sept. 2022' },
    // TODO(owner): add the team size / who the stakeholders were.
    team: { en: 'End-of-studies internship · team size to add', fr: 'Stage de fin d’études · taille de l’équipe à ajouter' },
    repos: [
      { href: 'https://github.com/soufiane22/ProductionManagmentBackEnd', label: 'GitHub · Backend' },
      { href: 'https://github.com/soufiane22/ProductionManagmentWeb', label: 'GitHub · Web' },
      { href: 'https://github.com/soufiane22/ProductionManagmentMobile', label: 'GitHub · Mobile' },
    ],
    // Sources also include the project pages of the previous portfolio (web + mobile app).
    media: {
      video: {
        youtubeId: 'G7qCM2Ha-Ao',
        title: { en: 'Production management web app — demo', fr: 'Application web de gestion de production — démo' },
        caption: {
          en: 'A walk-through of the web platform used by production managers and supervisors.',
          fr: 'Une visite de la plateforme web utilisée par les responsables de production et les superviseurs.',
        },
        poster: 'projects/premo/web-demo-poster.webp',
      },
      gallery: {
        title: { en: 'Android tablet app', fr: 'Application Android sur tablette' },
        caption: {
          en: 'The screens production team leads use on the shop floor. Employee names are blurred.',
          fr: 'Les écrans utilisés par les chefs d’équipe en atelier. Les noms des employés sont floutés.',
        },
        items: [
          {
            src: 'projects/premo/01-dashboard.webp',
            width: 800,
            height: 1280,
            alt: { en: 'Tablet dashboard with six tiles', fr: 'Tableau de bord de la tablette avec six tuiles' },
            caption: {
              en: 'Team lead dashboard: hours, presence, group and statistics in one tap.',
              fr: 'Tableau de bord du chef d’équipe : heures, présence, groupe et statistiques en un geste.',
            },
          },
          {
            src: 'projects/premo/02-hours-declaration.webp',
            width: 800,
            height: 1280,
            alt: { en: 'Hours declaration form', fr: 'Formulaire de déclaration d’heures' },
            caption: {
              en: 'Hours declaration for an OF: line, product, operators, hours by category, output and scrap.',
              fr: 'Déclaration d’heures pour un OF : ligne, produit, opérateurs, heures par catégorie, production et scrap.',
            },
          },
          {
            src: 'projects/premo/03-hours-list.webp',
            width: 800,
            height: 1280,
            alt: { en: 'List of hours declarations', fr: 'Liste des déclarations d’heures' },
            caption: {
              en: 'The day’s declarations with total hours, output, scrap and validation status.',
              fr: 'Les déclarations du jour avec heures totales, production, scrap et statut de validation.',
            },
          },
          {
            src: 'projects/premo/04-presence-declaration.webp',
            width: 800,
            height: 1280,
            alt: { en: 'Presence declaration table', fr: 'Tableau de déclaration de présence' },
            caption: {
              en: 'Presence declaration: each operator’s line, state, shift and hours.',
              fr: 'Déclaration de présence : ligne, état, équipe et heures de chaque opérateur.',
            },
          },
          {
            src: 'projects/premo/05-presence-history.webp',
            width: 800,
            height: 1280,
            alt: { en: 'Presence history cards', fr: 'Historique des présences' },
            caption: {
              en: 'Presence history by shift: operator count, total hours and validation status.',
              fr: 'Historique des présences par équipe : nombre d’opérateurs, heures totales et statut de validation.',
            },
          },
          {
            src: 'projects/premo/06-group.webp',
            width: 800,
            height: 1280,
            alt: { en: 'Group editing screen', fr: 'Écran d’édition d’un groupe' },
            caption: {
              en: 'Group editing: the operators and production lines of a team.',
              fr: 'Édition d’un groupe : les opérateurs et les lignes de production d’une équipe.',
            },
          },
          {
            src: 'projects/premo/07-statistics.webp',
            width: 800,
            height: 1280,
            alt: { en: 'Statistics screen with a bar chart', fr: 'Écran de statistiques avec un graphique en barres' },
            caption: {
              en: 'Statistics per line and period: output, productivity and scrap ratio per team lead.',
              fr: 'Statistiques par ligne et par période : production, productivité et taux de scrap par chef d’équipe.',
            },
          },
        ],
      },
    },
    problem: {
      en: 'On the shop floor, team leads recorded the hours worked, the output and the scrap of every fabrication order (OF) on paper. Production managers and supervisors had no up-to-date view of each manufacturing line’s productivity, of OF progress or of employee presence — and archived data was hard to find.',
      fr: 'En atelier, les chefs d’équipe notaient sur papier les heures travaillées, la production et le scrap de chaque ordre de fabrication (OF). Les responsables de production et les superviseurs n’avaient pas de vue à jour de la productivité de chaque ligne, de l’avancement des OF ni de la présence des employés — et les données archivées étaient difficiles à retrouver.',
    },
    context: [
      {
        en: 'My end-of-studies internship at PREMO Mediterranean, as a web & mobile software engineer. I analysed the functional and non-functional requirements, designed the system in UML, built the REST API, the web platform and the tablet app, and deployed them.',
        fr: 'Mon stage de fin d’études chez PREMO Mediterranean, en tant qu’ingénieur logiciel web et mobile. J’ai analysé les besoins fonctionnels et non fonctionnels, conçu le système en UML, développé l’API REST, la plateforme web et l’application tablette, puis je les ai déployées.',
      },
      {
        en: 'Two applications share the same data: a web platform for production managers and supervisors, and an Android app installed on tablets for production team leads.',
        fr: 'Deux applications partagent les mêmes données : une plateforme web pour les responsables de production et les superviseurs, et une application Android installée sur tablettes pour les chefs d’équipe de production.',
      },
      {
        en: 'The Android app targets a Samsung Tab E tablet (Android 4.4.4, API 19). The system was deployed on a local server using Windows Server, an Ubuntu virtual machine and Apache Tomcat. All three parts are public on GitHub.',
        fr: 'L’application Android cible une tablette Samsung Tab E (Android 4.4.4, API 19). Le système a été déployé sur un serveur local avec Windows Server, une machine virtuelle Ubuntu et Apache Tomcat. Les trois parties sont publiques sur GitHub.',
      },
    ],
    flow: {
      heading: { en: 'From fabrication order to monthly KPIs', fr: 'De l’ordre de fabrication aux KPI mensuels' },
      steps: [
        { en: 'Fabrication order (OF)', fr: 'Ordre de fabrication (OF)' },
        { en: 'Shift presence', fr: 'Présence de l’équipe' },
        { en: 'Hours, output & scrap per OF', fr: 'Heures, production & scrap par OF' },
        { en: 'Validation', fr: 'Validation' },
        { en: 'Productivity · scrap rate', fr: 'Productivité · taux de scrap' },
        { en: 'Monthly stats per line & product', fr: 'Stats mensuelles par ligne & produit' },
      ],
    },
    architecture: {
      columns: [
        {
          step: 1,
          label: { en: 'clients', fr: 'clients' },
          arrow: false,
          nodes: [
            {
              name: { en: 'Android tablet app', fr: 'Application Android (tablette)' },
              detail: { en: 'Java · MVVM · Retrofit / OkHttp', fr: 'Java · MVVM · Retrofit / OkHttp' },
              libs: ['ViewModel', 'LiveData', 'Navigation', 'Data Binding'],
              caption: {
                en: 'team leads · hours per OF · presence · groups',
                fr: 'chefs d’équipe · heures par OF · présence · groupes',
              },
              owned: true,
            },
            {
              name: { en: 'Angular web platform', fr: 'Plateforme web Angular' },
              detail: { en: 'Angular 13 · PrimeNG · Bootstrap', fr: 'Angular 13 · PrimeNG · Bootstrap' },
              tags: ['validation', 'productivity', 'scrap rate'],
              caption: {
                en: 'controllers & admins · products · lines · users',
                fr: 'contrôleurs & admins · produits · lignes · utilisateurs',
              },
              owned: true,
            },
          ],
        },
        {
          step: 2,
          label: { en: 'api', fr: 'api' },
          arrow: true,
          nodes: [
            {
              name: { en: 'Spring Boot REST API', fr: 'API REST Spring Boot' },
              detail: { en: 'Java 11 · Maven · stateless JWT', fr: 'Java 11 · Maven · JWT sans état' },
              tags: ['KPI calculation', 'monthly roll-up'],
              libs: ['Spring MVC', 'Spring Security', 'Spring Data MongoDB'],
              owned: true,
            },
          ],
        },
        {
          step: 3,
          label: { en: 'data', fr: 'données' },
          arrow: true,
          nodes: [
            {
              name: { en: 'MongoDB', fr: 'MongoDB' },
              detail: {
                en: 'OFs · hours declarations · presence · monthly statistics',
                fr: 'OF · déclarations d’heures · présences · statistiques mensuelles',
              },
            },
          ],
        },
      ],
      pipeline: {
        left: { en: 'Local server deployment', fr: 'Déploiement sur serveur local' },
        right: { en: 'Windows Server · Ubuntu VM · Apache Tomcat', fr: 'Windows Server · VM Ubuntu · Apache Tomcat' },
      },
      caption: {
        en: 'fig. 01 — simplified; amber marks the parts I built.',
        fr: 'fig. 01 — simplifiée ; l’ambre marque les parties que j’ai développées.',
      },
    },
    modules: [
      {
        name: { en: 'Tablet app — production team leads', fr: 'App tablette — chefs d’équipe de production' },
        items: [
          {
            title: { en: 'Hours declaration per OF', fr: 'Déclaration d’heures par OF' },
            body: {
              en: 'Per shift: line, product, OF, number of operators, normal, overtime, stoppage and new-project hours, total output, scrap and a remark.',
              fr: 'Par équipe : ligne, produit, OF, nombre d’opérateurs, heures normales, supplémentaires, d’arrêt et nouveau projet, production totale, scrap et remarque.',
            },
          },
          {
            title: { en: 'Presence & history', fr: 'Présence & historique' },
            body: {
              en: 'Mark each operator present on a line for the shift, with hours, zone and function; browse past declarations.',
              fr: 'Pointer chaque opérateur présent sur une ligne pour l’équipe, avec heures, zone et fonction ; consulter l’historique des déclarations.',
            },
          },
          {
            title: { en: 'Groups & statistics', fr: 'Groupes & statistiques' },
            body: {
              en: 'Manage the team’s lines and operators; see output, productivity and scrap ratio over a date range.',
              fr: 'Gérer les lignes et opérateurs de l’équipe ; voir production, productivité et taux de scrap sur une période.',
            },
          },
        ],
      },
      {
        name: {
          en: 'Web platform — production managers & supervisors',
          fr: 'Plateforme web — responsables de production & superviseurs',
        },
        items: [
          {
            title: { en: 'OF progress & line productivity', fr: 'Avancement des OF & productivité des lignes' },
            body: {
              en: 'Follow each fabrication order and the monthly productivity, scrap rate, output and non-value-added hours per line and product reference.',
              fr: 'Suivre chaque ordre de fabrication et, chaque mois, la productivité, le taux de scrap, la production et les heures non à valeur ajoutée par ligne et par référence produit.',
            },
          },
          {
            title: { en: 'Presence, hours & validation', fr: 'Présence, heures & validation' },
            body: {
              en: 'Check employee presence and working hours, and validate the declarations sent from the tablets.',
              fr: 'Vérifier la présence et les heures des employés, et valider les déclarations envoyées depuis les tablettes.',
            },
          },
          {
            title: { en: 'Groups & master data', fr: 'Groupes & données de référence' },
            body: {
              en: 'Manage groups of employees, products with their cycle time, production lines, users and accounts.',
              fr: 'Gérer les groupes d’employés, les produits avec leur temps de cycle, les lignes de production, les utilisateurs et les comptes.',
            },
          },
        ],
      },
    ],
    rules: [
      {
        title: { en: 'Standard hours', fr: 'Heures standard' },
        body: {
          en: 'Output × the product’s cycle time ÷ 3,600 — the hours the output should have taken.',
          fr: 'Production × temps de cycle du produit ÷ 3 600 — les heures que la production aurait dû prendre.',
        },
      },
      {
        title: { en: 'Productivity', fr: 'Productivité' },
        body: {
          en: 'Standard hours ÷ total hours worked × 100, computed on every declaration.',
          fr: 'Heures standard ÷ heures travaillées × 100, calculée à chaque déclaration.',
        },
      },
      {
        title: { en: 'Scrap rate', fr: 'Taux de scrap' },
        body: {
          en: 'Scrap ÷ output × 100, only when there is output.',
          fr: 'Scrap ÷ production × 100, uniquement s’il y a de la production.',
        },
      },
      {
        title: { en: 'Monthly roll-up', fr: 'Cumul mensuel' },
        body: {
          en: 'Each declaration updates three monthly records — global, per line, per product reference — and stoppage hours accumulate as non-value-added hours (NVAH).',
          fr: 'Chaque déclaration met à jour trois cumuls mensuels — global, par ligne, par référence produit — et les heures d’arrêt s’additionnent en heures non à valeur ajoutée (NVAH).',
        },
      },
      {
        title: { en: 'Validation before it counts', fr: 'Validation avant de compter' },
        body: {
          en: 'Hours declarations and shift presence sheets are created as “not validated” and validated afterwards.',
          fr: 'Les déclarations d’heures et les feuilles de présence sont créées « non validées » puis validées ensuite.',
        },
      },
      {
        title: { en: 'Three roles', fr: 'Trois rôles' },
        body: {
          en: 'Team leader, controller and admin, checked by Spring Security on every route with stateless JWT access and refresh tokens.',
          fr: 'Chef d’équipe, contrôleur et admin, vérifiés par Spring Security sur chaque route avec des jetons JWT d’accès et de rafraîchissement sans état.',
        },
      },
    ],
    decision: {
      headline: {
        en: 'One Spring Boot REST API serves both the Angular web app and the Android tablet app.',
        fr: 'Une seule API REST Spring Boot sert à la fois l’application web Angular et l’application Android sur tablette.',
      },
      before: {
        en: 'Both clients talk to the same backend, designed up front with UML. On the tablet, the app uses MVVM with ',
        fr: 'Les deux clients parlent au même backend, conçu en amont avec UML. Sur la tablette, l’application utilise MVVM avec ',
      },
      code: 'ViewModel + LiveData',
      after: {
        en: ', and Retrofit with OkHttp for the API calls. KPIs are computed once, on the server, when a declaration is saved — so the tablet and the web dashboard always show the same numbers.',
        fr: ', et Retrofit avec OkHttp pour les appels à l’API. Les KPI sont calculés une seule fois, côté serveur, à l’enregistrement d’une déclaration — la tablette et le tableau de bord web affichent donc toujours les mêmes chiffres.',
      },
    },
    challenges: [
      {
        problem: {
          en: 'Team leads must declare a whole shift in a few minutes, on a tablet, next to the line.',
          fr: 'Les chefs d’équipe doivent déclarer une équipe entière en quelques minutes, sur tablette, à côté de la ligne.',
        },
        solution: {
          en: 'One form per OF with line, product and operators picked from lists, and the hours split by category: normal, overtime, stoppage, new project.',
          fr: 'Un formulaire par OF avec ligne, produit et opérateurs choisis dans des listes, et les heures ventilées par catégorie : normales, supplémentaires, arrêt, nouveau projet.',
        },
        tags: ['Android', 'MVVM', 'Retrofit'],
      },
      {
        problem: {
          en: 'Productivity and scrap figures must be comparable across lines and products.',
          fr: 'Les chiffres de productivité et de scrap doivent être comparables entre lignes et produits.',
        },
        solution: {
          en: 'Each product carries its cycle time, so output converts into standard hours; productivity and scrap rate use the same formulas everywhere, rolled up per month, line and product reference.',
          fr: 'Chaque produit porte son temps de cycle, la production se convertit donc en heures standard ; productivité et taux de scrap utilisent les mêmes formules partout, cumulées par mois, ligne et référence produit.',
        },
        tags: ['Spring Boot', 'MongoDB'],
      },
      {
        problem: {
          en: 'Shift presence has to match the people actually on each line.',
          fr: 'La présence d’une équipe doit correspondre aux personnes réellement sur chaque ligne.',
        },
        solution: {
          en: 'Presence sheets per group and shift list every operator with line, zone and hours, total the operators and hours, and keep a history that is validated from the web platform.',
          fr: 'Les feuilles de présence par groupe et par équipe listent chaque opérateur avec ligne, zone et heures, totalisent opérateurs et heures, et gardent un historique validé depuis la plateforme web.',
        },
        tags: ['Presence', 'Validation'],
      },
    ],
    // TODO(owner): add measurable results (users, time saved, scrap reduced…) if you have them.
    metrics: [
      { value: '2', label: { en: 'clients: web + Android tablet', fr: 'clients : web + tablette Android' } },
      { value: '3', label: { en: 'KPIs: productivity, scrap rate, NVAH', fr: 'KPI : productivité, taux de scrap, NVAH' }, accent: true },
      { value: '3', label: { en: 'roles: team leader, controller, admin', fr: 'rôles : chef d’équipe, contrôleur, admin' } },
      { value: '3', label: { en: 'public repositories', fr: 'dépôts publics' } },
    ],
    outcome: {
      en: 'Paper forms gave way to tablets, cutting spending on paper, printers and ink. Production and scrap levels are monitored per line, archived data is one search away, and managers can adjust earlier with validated productivity figures per line and product.',
      fr: 'Les formulaires papier ont laissé place aux tablettes, ce qui a réduit les dépenses en papier, imprimantes et encre. La production et le scrap sont suivis par ligne, les données archivées sont à portée de recherche, et les responsables peuvent réagir plus tôt grâce à des chiffres de productivité validés par ligne et par produit.',
    },
    stack: [
      'Java',
      'Spring Boot',
      'Spring Security',
      'JWT',
      'Spring Data',
      'Maven',
      'MongoDB',
      'Angular 13',
      'TypeScript',
      'PrimeNG',
      'Bootstrap',
      'Android SDK',
      'MVVM',
      'Retrofit',
      'OkHttp',
      'Gradle',
      'UML',
      'Apache Tomcat',
    ],
  },
];

export function findCaseStudy(slug: string | null | undefined): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
