# Site — Cristiane Souza Arquitetura e Interiores

Portfólio feito com [Astro](https://astro.build) a partir do handoff do Claude Design
(spec completa em [docs/design-handoff.md](docs/design-handoff.md)), mais a área restrita: o sistema de
gestão do estúdio (spec em [docs/sistema-handoff.md](docs/sistema-handoff.md)).

## Rodar localmente

Requer Node 22+ (há um `.nvmrc`).

```bash
npm install
npm run db:migrate:local    # cria o banco D1 local (.wrangler/)
npm run db:seed:local       # opcional: dados de exemplo do protótipo
npm run usuario:criar -- voce@exemplo.com "Seu Nome" --local
npm run dev                 # http://localhost:4321  (área restrita em /login)
npm run build               # checa tipos + gera dist/
npm run preview             # build + serve com o runtime do Cloudflare (wrangler)
```

## Onde mexer

| O quê | Arquivo |
| --- | --- |
| Projetos (nome, categoria, descrição, ordem das fotos) | `src/data/projetos.ts` |
| Destaques da home, fotos do trilho "detalhes", capa do hero | `src/data/projetos.ts` (`DESTAQUES`, `DETALHES`, `HERO`) |
| WhatsApp, e-mail, Instagram, CAU, texto do Sobre | `src/data/site.ts` |
| Cores, fontes, raios | `src/styles/global.css` |
| Telas da área restrita | `src/pages/app/`, `src/pages/login.astro` |
| Visual da área restrita | `src/styles/app.css` |
| Campos dos formulários do sistema | `src/lib/forms.ts` |
| Tabelas do banco | `migrations/` (nova alteração = novo arquivo `0002_...sql`) |
| URL do site (sitemap/Open Graph) | `astro.config.mjs` (`SITE_URL`) e `public/robots.txt` |

**Adicionar um projeto:** coloque as fotos em `src/assets/projetos/` (JPG até ~2000px) e acrescente
um item em `PROJETOS`. A página `/projetos/<id>` é criada sozinha; as imagens são convertidas para
WebP responsivo no build.

## Deploy (Cloudflare Pages, grátis)

No ar em https://cristianesouza.pages.dev

O projeto `cristianesouza` do Cloudflare Pages está ligado a este repositório: cada push na
`main` publica de novo. Configuração de build no painel: preset **Astro**, comando
`npm run build`, saída `dist` (a versão do Node vem do `.nvmrc`). O `wrangler.jsonc` define o
binding do banco D1 (`DB`) usado em produção.

Domínio próprio: no projeto do Pages, **Custom domains → Set up a custom domain**. Depois,
troque a URL em `SITE_URL` (`astro.config.mjs`) e na linha `Sitemap:` de `public/robots.txt`.

## Pendências de conteúdo

- Logo em vetor (SVG) para substituir `src/assets/logo*.png`.
- Revisar descrições dos projetos e texto do Sobre; confirmar "Dapraça", "Suíte" e "Banheiro".
- Domínio definitivo.

## Área restrita (sistema de gestão)

Clientes, projetos com quadro de tarefas, catálogo de serviços e fornecedores, obras (orçado ×
compras) e configurações. O portfólio continua estático; só `/login`, `/sair`, `/app/*` e `/api/*`
rodam no servidor (Pages Functions, via `@astrojs/cloudflare`), com os dados no **Cloudflare D1**.

- Login por email e senha. A senha é guardada com hash PBKDF2, a sessão fica num cookie HttpOnly
  de 30 dias e o `src/middleware.ts` protege `/app` e `/api`.
- Não há cadastro público: usuários são criados pelo terminal com `npm run usuario:criar`. Rodar de
  novo com o mesmo email troca a senha.

### Colocar no ar (uma vez)

```bash
npx wrangler login
npx wrangler d1 create cristiane-db        # copie o database_id para o wrangler.jsonc
npm run db:migrate:remote                  # cria as tabelas em produção
npm run usuario:criar -- arq.cristianesouza@gmail.com "Cristiane Souza" --remote
```

Depois é só dar push na `main`. Quando houver uma migração nova em `migrations/`, rode
`npm run db:migrate:remote` antes do push.

O formulário de contato do site continua abrindo o WhatsApp com a mensagem pronta.
