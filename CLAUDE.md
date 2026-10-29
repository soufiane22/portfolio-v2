# Portfolio v2: Soufiane Aloui El Idrissi
## Goal
Personal portfolio for recruiters and engineering managers. Prove my level with real work. No freelance/agency vibe.
## Stack
Angular (latest stable, currently 22), standalone components, signals-first, OnPush, Tailwind CSS, SSR with prerendering, static output deployed on Vercel.
## Rules
- Never invent facts, metrics, projects or technologies. Content comes only from src/app/content/*. Unknown means a TODO placeholder.
- Do not mention Kotlin, Kubernetes, microservices or any skill not in the content files.
- Strict TypeScript, no `any`. Small components. Accessible (WCAG AA), respect prefers-reduced-motion.
- Performance: Lighthouse mobile >= 90. No heavy images. Lazy-load below-the-fold content with @defer.
- i18n: /en and /fr routes, dictionaries in src/app/i18n.
- Small, frequent Conventional Commits. Run lint, build and tests before each commit.
## Out of scope for v1
AI assistant and WebGL/3D (placeholders only).

## Commands
- `npm start`: dev server (`ng serve`)
- `npm run build`: production build, prerendered static output in `dist/portfolio-v2` (`outputMode: static`)
- `npm run lint`: `ng lint` (angular-eslint)
- `npm test`: `ng test` (Angular unit-test builder with Vitest + jsdom). Single file: `npx ng test --include src/app/core/whatsapp.spec.ts`
- Prettier: 100 cols, single quotes (HTML uses the `angular` parser)

## Architecture (`src/app`)
- `content/`: single source of truth for all text and facts (`profile`, `about`, `experience`, `projects`, `skills`, `notes`, `case-studies`). Every user-facing string is a `Localized` (`{ en, fr }`).
- `i18n/`: `Lang` (`'en' | 'fr'`), `LANGS`, `DEFAULT_LANG` (`en`), `isLang`; `dictionary.ts` is the typed `Dictionary` interface that `en.ts` and `fr.ts` implement (UI strings only: nav, labels, a11y, meta). Access via `dictionaries[lang]`.
- `pages/`: route components. `home` (all sections) and `case-study` (`/:lang/work/:slug`). Both get `lang` through `input.required<Lang>()` (router `withComponentInputBinding`) and derive `dict = computed(...)`.
- `components/`: small standalone OnPush components (hero, sections, header, footer, lang/theme toggles, project-card, screen-gallery, video-embed, architecture-figure, terrain-canvas, profile-photo).
- `core/`: `route-guards` (`langGuard`, `caseStudyGuard` redirect unknown lang/slug), `seo.service` (title, description, canonical, hreflang, Open Graph), `site.ts` (`SITE_URL`, `OG_IMAGE`), `theme.service` (dark/light, signal + localStorage), `scroll-manager` + `anchor-scroll` (keeps position when switching language, handles anchors inside `@defer` blocks), `contact-form` (Web3Forms, honeypot), `whatsapp`.
- `shared/reveal.directive.ts`: `appReveal` fade-in, browser-only, honours reduced motion.

## Routing and rendering
- Routes (`app.routes.ts`): `''` redirects to `/en`; `:lang` (Home); `:lang/work/:slug` (CaseStudyPage); `**` redirects to the default lang. Pages are lazy-loaded.
- `app.routes.server.ts` prerenders every route: `getPrerenderParams` is built from `LANGS` and `caseStudies`. Adding a language or case study is automatically prerendered.
- `app.config.ts`: client hydration with event replay and incremental hydration. Below-the-fold sections in `home.html` use `@defer (hydrate on viewport)`. View transitions enabled; Angular's own scrolling is disabled in favour of `ScrollManager`.

## Styling
- Tailwind v4 via `@tailwindcss/postcss` (`.postcssrc.json`), `src/styles.css` imports it.
- Design tokens are CSS variables (`--bg`, `--fg`, `--accent`, `--line`...) in `src/styles.css`; dark is default, `[data-theme='light']` overrides them. Use the tokens, not hard-coded colours.
- Fonts: Bricolage Grotesque (variable) and IBM Plex Mono via `@fontsource`.
- `design/*.html` are static design references, not part of the app.

## Assets
- `public/`: favicon, `og-image.jpg` (1200x630), profile photo, `cv/` PDFs (EN and FR), `projects/` screenshots.

## Tests
- Specs sit next to the code (`*.spec.ts`). `content/content.spec.ts` guards the content rules: no banned terms (Kotlin, Kubernetes, microservices) and every `Localized` string filled in both languages. Keep it passing when editing content.

## Conventions
- Adding content: edit `src/app/content/*` with both `en` and `fr`; UI strings: add the key to `Dictionary`, then to `en.ts` and `fr.ts`.
- Adding a case study: add it to `content/case-studies.ts` and reference its `slug` from the project's `caseStudy` field.
