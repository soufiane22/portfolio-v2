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
