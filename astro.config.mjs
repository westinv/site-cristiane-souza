import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE_URL = 'https://site-cristiane-souza.simone-salgados.workers.dev';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/login'),
    }),
  ],
});
