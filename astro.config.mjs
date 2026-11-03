import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

const SITE_URL = 'https://cristianesouza.pages.dev';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  adapter: cloudflare({
    platformProxy: { enabled: true },
    imageService: 'compile',
    routes: { extend: { include: [{ pattern: '/app' }] } },
  }),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/login') && !page.includes('/app') && !page.includes('/sair'),
    }),
  ],
});
