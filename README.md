# Site — Cristiane Souza Arquitetura e Interiores

Portfólio estático feito com [Astro](https://astro.build) a partir do handoff do Claude Design
(spec completa em [docs/design-handoff.md](docs/design-handoff.md)).

## Rodar localmente

Requer Node 20.3+ (há um `.nvmrc`).

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # checa tipos + gera dist/
npm run preview   # serve o dist/ gerado
```

## Onde mexer

| O quê | Arquivo |
| --- | --- |
| Projetos (nome, categoria, descrição, ordem das fotos) | `src/data/projetos.ts` |
| Destaques da home, fotos do trilho "detalhes", capa do hero | `src/data/projetos.ts` (`DESTAQUES`, `DETALHES`, `HERO`) |
| WhatsApp, e-mail, Instagram, CAU, texto do Sobre | `src/data/site.ts` |
| Cores, fontes, raios | `src/styles/global.css` |
| URL do site (sitemap/Open Graph) | `astro.config.mjs` (`SITE_URL`) e `public/robots.txt` |

**Adicionar um projeto:** coloque as fotos em `src/assets/projetos/` (JPG até ~2000px) e acrescente
um item em `PROJETOS`. A página `/projetos/<id>` é criada sozinha; as imagens são convertidas para
WebP responsivo no build.

## Deploy (Cloudflare Workers, grátis)

No ar em https://site-cristiane-souza.simone-salgados.workers.dev

O Worker `site-cristiane-souza` está ligado a este repositório: cada push na `main` publica de novo.
A Cloudflare roda `npx wrangler deploy`, que pelo `wrangler.jsonc` executa `npm run build` e
publica a pasta `dist` como assets estáticos (com a `404.html` como página de erro).

Domínio próprio: no Worker, aba **Domains → Add custom domain**. Depois, troque a URL em
`SITE_URL` (`astro.config.mjs`) e na linha `Sitemap:` de `public/robots.txt`.

## Pendências de conteúdo

- WhatsApp, e-mail e Instagram reais (`src/data/site.ts`) — hoje são placeholders.
- Logo em vetor (SVG) para substituir `src/assets/logo*.png`.
- Revisar descrições dos projetos e texto do Sobre; confirmar "Dapraça", "Suíte" e "Banheiro".
- Domínio definitivo.

## Fase 2 (planejada)

Área restrita (login de clientes, contratos) e CRUD de clientes. Hoje `/login` é uma página
"em breve". O caminho previsto é ativar SSR com `@astrojs/cloudflare` + D1 (banco) + R2 (PDFs),
no mesmo projeto. O formulário de contato hoje abre o WhatsApp com a mensagem pronta; o envio por
e-mail entra junto com o backend.
