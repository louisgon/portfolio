import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';

const review = process.env.REVIEW === 'on', index = process.env.SITE_INDEX === 'on';

const squeeze = (css: string) => css.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|url\([^)]*\))/).map((part, i) => (i % 2 ? part : part.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').replace(/:\s+/g, ':'))).join('').trim();
const spaceless: AstroIntegration = {
  name: 'spaceless-css',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      for (const f of await readdir(dir, { recursive: true })) {
        if (!f.endsWith('.html')) {
          continue;
        }
        const path = new URL(f, dir), html = await readFile(path, 'utf8');
        await writeFile(path, html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g, (_, open: string, css: string, close: string) => open + squeeze(css) + close));
      }
      if (!index) {
        await writeFile(new URL('_headers', dir), '/*\n  X-Robots-Tag: noindex\n');
      }
    },
  },
};

export default defineConfig({
  site: 'https://louis.gg',
  base: process.env.BASE ?? '/',
  build: { inlineStylesheets: 'always' },
  integrations: [spaceless],
  vite: {
    define: { __REVIEW__: JSON.stringify(review), __INDEX__: JSON.stringify(index) },
    build: { cssMinify: false },
    resolve: { alias: { '#review': fileURLToPath(new URL(review ? './src/scripts/review.ts' : './src/scripts/no-review.ts', import.meta.url)) } },
  },
});
