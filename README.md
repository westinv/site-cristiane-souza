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

## Deploy (Cloudflare Pages, grátis)

No ar em https://cristianesouza.pages.dev

O projeto `cristianesouza` do Cloudflare Pages está ligado a este repositório: cada push na
`main` publica de novo. Configuração de build no painel: preset **Astro**, comando
`npm run build`, saída `dist` (a versão do Node vem do `.nvmrc`).

Domínio próprio: no projeto do Pages, **Custom domains → Set up a custom domain**. Depois,
troque a URL em `SITE_URL` (`astro.config.mjs`) e na linha `Sitemap:` de `public/robots.txt`.

## Pendências de conteúdo

- Logo em vetor (SVG) para substituir `src/assets/logo*.png`.
- Revisar descrições dos projetos e texto do Sobre; confirmar "Dapraça", "Suíte" e "Banheiro".
- Domínio definitivo.

## Fase 2 (planejada)

Área restrita (login de clientes, contratos) e CRUD de clientes. Hoje `/login` é uma página
"em breve". O caminho previsto é ativar SSR com `@astrojs/cloudflare` + D1 (banco) + R2 (PDFs),
no mesmo projeto. O formulário de contato hoje abre o WhatsApp com a mensagem pronta; o envio por
e-mail entra junto com o backend.
