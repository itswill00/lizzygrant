// Post-build SPA fallback: Vercel rewrites can be silently ignored when the
// project dashboard overrides routing. Extensionless route copies guarantee
// every sitemap chapter returns 200 via cleanUrls, no rewrite needed.
// All copies share absolute asset URLs (/assets/*, /audio/*), so they boot
// the same bundle and App.jsx client routing takes over from the URL.
import { copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
// Must match renderRoute() in src/App.jsx (+ legacy aliases).
const routes = [
  'eras', 'timeline',
  'vault',
  'tarot',
  'muses',
  'louisiana', 'now',
  'gallery',
  'discography',
  'jeremy',
];

for (const r of routes) {
  copyFileSync(join(dist, 'index.html'), join(dist, `${r}.html`));
}
console.log(`[spa-fallback] wrote ${routes.length} route copies`);
