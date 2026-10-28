export interface Dictionary {
  readonly meta: { readonly title: string; readonly description: string };
  readonly skip: string;
  readonly nav: {
    readonly about: string;
    readonly experience: string;
    readonly work: string;
    readonly skills: string;
    readonly notes: string;
    readonly contact: string;
  };
  readonly header: { readonly menu: string; readonly themeToggle: string; readonly language: string };
  readonly a11y: {
    readonly primaryNav: string;
    readonly mobileNav: string;
    readonly home: string;
    readonly stack: string;
    readonly downloadCv: string;
  };
  readonly hero: {
    readonly status: string;
    readonly tagline: string;
    readonly viewWork: string;
    readonly downloadCv: string;
    readonly location: string;
  };
  readonly sections: {
    readonly about: string;
    readonly experience: string;
    readonly work: string;
    readonly skills: string;
    readonly notes: string;
    readonly contact: string;
  };
  readonly headings: {
    readonly experience: string;
    readonly work: string;
    readonly skills: string;
    readonly notes: string;
    readonly contact: string;
  };
  readonly about: { readonly photoAlt: string };
  readonly work: {
    readonly intro: string;
    readonly keyDecision: string;
    readonly details: string;
    readonly privateRepo: string;
    readonly privateTitle: string;
    readonly github: string;
    readonly inProgress: string;
  };
  readonly notes: { readonly soon: string; readonly minutes: string };
  readonly contact: {
    readonly email: string;
    readonly linkedin: string;
    readonly whatsapp: string;
    readonly whatsappMessage: string;
    readonly whatsappLabel: string;
    readonly github: string;
    readonly cv: string;
    readonly english: string;
    readonly french: string;
    readonly name: string;
    readonly emailField: string;
    readonly message: string;
    readonly send: string;
    readonly sending: string;
    readonly sentTitle: string;
    readonly sentBody: string;
    readonly subject: string;
    readonly errorBody: string;
    readonly errorFallback: string;
  };
  readonly footer: { readonly backToTop: string; readonly location: string };
  readonly caseStudy: {
    readonly label: string;
    readonly allWork: string;
    readonly role: string;
    readonly period: string;
    readonly team: string;
    readonly links: string;
    /** Section labels; the "01 —" numbering is added at render time. */
    readonly media: string;
    readonly mediaHeading: string;
    readonly playVideo: string;
    readonly gallery: {
      readonly prev: string;
      readonly next: string;
      readonly goTo: string;
      readonly enlarge: string;
      readonly close: string;
      readonly unavailable: string;
    };
    readonly problem: string;
    readonly context: string;
    readonly flow: string;
    readonly architecture: string;
    readonly modules: string;
    readonly rules: string;
    readonly decision: string;
    readonly challenges: string;
    readonly patterns: string;
    readonly contribution: string;
    readonly result: string;
    readonly stack: string;
    readonly next: string;
    readonly archHeading: string;
    readonly modulesHeading: string;
    readonly rulesHeading: string;
    readonly challengesHeading: string;
    readonly patternsHeading: string;
    readonly contributionHeading: string;
    readonly challengeProblem: string;
    readonly challengeSolution: string;
  };
}
