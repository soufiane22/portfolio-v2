// Production origin, used for absolute URLs in SEO tags (canonical, hreflang, Open Graph).
// No trailing slash: paths are appended as '/en', '/fr/work/…'.
export const SITE_URL = 'https://portfolio-v2-beryl-iota.vercel.app';

/** Social preview image (1200×630) served from public/. */
export const OG_IMAGE = { path: '/og-image.jpg', width: 1200, height: 630 } as const;
