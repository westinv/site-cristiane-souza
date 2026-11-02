# Handoff: Site portfólio — Cristiane Souza Arquitetura e Interiores

## Overview
Site de portfólio de uma arquiteta (Arq. Cristiane Souza, CAU A-315284-7). Experiência "premium tipo Apple": hero em tela cheia com parallax, frase que acende palavra a palavra no scroll, projetos em destaque empilhados em tela cheia (sticky stack), galeria horizontal guiada pelo scroll, grade de todos os projetos com filtro, página de projeto com galeria e lightbox, Sobre e Contato com formulário. Tem um link "Área restrita" que leva ao sistema interno (fora do escopo deste handoff — linkar para `/login` ou URL do sistema).

## About the Design Files
Os arquivos em `reference/` são **referências de design feitas em HTML** — protótipos que mostram aparência e comportamento, **não código de produção**. A tarefa é **recriar este design** num projeto real. Sem codebase existente, recomenda-se **Next.js (App Router) + TypeScript + Tailwind CSS** (ou CSS Modules), com `next/image` para as fotos, rotas estáticas por projeto (SSG) e deploy na Vercel. Framer Motion é opcional; as animações de scroll podem ser feitas com IntersectionObserver + `requestAnimationFrame` como no protótipo.

Para ver o protótipo: abra `reference/Site Portfolio.dc.html` num servidor local (`npx serve reference`). Toda a lógica está no `<script data-dc-script>` no fim do arquivo (classe `Component`): dados dos projetos (`PROJETOS`, `DESTAQUES`, `DETALHES`), roteamento por hash, animações de scroll (`tick()`), lightbox e formulário.

## Fidelity
**High-fidelity.** Cores, tipografia, espaçamentos, raios e animações são finais. Recriar com fidelidade.

## Rotas sugeridas
- `/` — Home (hero, frase, destaques, todos os projetos, detalhes, sobre, CTA)
- `/projetos/[slug]` — Página do projeto
- `/contato` — Contato
- `/#projetos`, `/#sobre` — âncoras na home (scroll suave, offset 60px do header)
No protótipo isso é feito com hash (`#projeto/<id>`, `#contato`); em produção usar rotas reais.

## Screens / Views

### Header (global, fixo)
- `position: fixed`, topo, z-index 50. Conteúdo max-width 1200px, padding 0 24px, flex space-between.
- **Estado transparente** (sobre o hero da home): fundo `linear-gradient(180deg, rgba(17,21,16,.45), transparent)`, texto `#f7f4ef`, altura 76px. Logo (símbolo) 40px de altura com `filter: brightness(0) invert(1)` (branco).
- **Estado sólido** (após scroll > `100vh − 90px`, ou em qualquer página que não seja a home): fundo `rgba(247,244,239,.8)` + `backdrop-filter: saturate(180%) blur(20px)`, borda inferior `1px rgba(29,35,28,.08)`, texto `#1d231c`, altura 60px, logo 34px em cores originais. Transições .45–.5s `cubic-bezier(.2,.7,.2,1)`.
- Esquerda: símbolo da logo + traço vertical 1px×30px (`rgba(247,244,239,.35)` / sólido `rgba(29,35,28,.18)`) + bloco: "Cristiane Souza" (Cormorant Garamond 500, 22px, line-height 1) e "ARQUITETURA E INTERIORES" (Manrope 600, 9px, letter-spacing .28em; cor `rgba(247,244,239,.75)` / sólido `#bf6a58`).
- Direita (gap clamp(18px,3vw,36px), 13px/500): Projetos · Sobre · Contato. Hover: sublinhado 1px que cresce da esquerda (`scaleX 0→1`, .35s).
- CTA "Área restrita": pill, padding 9px 16px, 12px/600. Transparente: borda `1px rgba(247,244,239,.5)`, hover fundo `#f7f4ef` texto `#1d231c`. Sólido: fundo `#1d231c` texto `#f7f4ef`, hover `#bf6a58`.
- ≤640px: esconder traço + nome (só símbolo); esconder "Sobre".

### Home
1. **Hero** — `100vh` (min 560px), fundo `#111510`. Foto de capa `object-fit: cover` (padrão `site/p/gourmet-03.jpg`). Parallax ligado a `p = clamp(scrollY / innerHeight, 0, 1)`: imagem `scale(1.18 − p·0.18)`, opacidade `0.78 − p·0.35`; vinheta radial `rgba(17,21,16,.15)→.65`. Texto centralizado: kicker "ARQUITETURA E INTERIORES" (13px/600, .3em, `#e9cfc6`), H1 "Cristiane Souza" (Cormorant Garamond 500, clamp(56px,11vw,168px), lh .92, ls −.02em, `#f7f4ef`), sub "Espaços pensados para quem vai viver neles." (clamp(18px,2vw,24px)/500, `rgba(247,244,239,.85)`). Bloco de texto: opacidade `1 − p·1.8`, `translateY(−80p px)`. Indicador inferior "Role para ver" + linha 1×36px, opacidade `1 − p·4`.
2. **Frase** — max-width 1100px, padding clamp(120px,18vw,240px) 24px. Texto: "Cada projeto começa pela forma como você vive e trabalha. E termina nos detalhes de marcenaria, luz e acabamento." (Manrope 600, clamp(32px,5.2vw,68px), lh 1.12, ls −.035em). Cada palavra é um `<span>` com opacidade .16; progresso `p = clamp((0.8·vh − rect.top) / (0.9·rect.height))`; palavra i acende (opacidade 1, transição .35s) quando `(i+1)/n ≤ p + .02`.
3. **Título "Projetos."** — clamp(40px,6vw,80px)/700, ls −.045em + sub "Residenciais e comerciais, do conceito ao executivo." (19px, `#5d6559`).
4. **Destaques empilhados** — um `<section>` por projeto destaque (`quarto-cecilia, area-gourmet, suite-master, studio-pilates, barbearia`), cada um `position: sticky; top: 0; height: 100vh`, fundo `#111510`. Foto cover + gradiente `rgba(17,21,16,.1) 30% → .78`. Rodapé do card (max-width 1100px, padding-bottom clamp(48px,8vh,96px)): categoria (13px/600, .24em, `#e9cfc6`), nome (clamp(44px,8vw,112px)/700, ls −.05em, lh .95, `#f7f4ef`), botão pill "Ver projeto" (fundo `#f7f4ef`, texto `#1d231c`, 15px/600, padding 14px 24px; hover `#bf6a58`/branco). **Efeito:** quando o próximo card sobe por cima, o atual recebe `p = clamp(1 − next.top / vh)` → `scale(1 − .1p)`, `brightness(1 − .6p)`, `border-radius: 28p px`.
5. **Todos os projetos** — max-width 1200px, padding clamp(100px,12vw,160px) 24px. Título "Todos os projetos." (clamp(36px,5vw,64px)/700). Filtro segmentado (container `rgba(29,35,28,.05)`, radius 999, padding 5px; botões 14px/600 padding 9px 18px; ativo fundo `#1d231c` texto `#f7f4ef`): Todos / Residencial / Comercial. Grid `repeat(auto-fill, minmax(min(100%,340px),1fr))`, gap 44px 24px. Card: imagem 4:5, radius 24px, hover `scale(1.04)` 1.2s; nome 24px/700 ls −.035em; contagem "N imagens" 13px `#7a8276`; categoria 12px/600 .22em `#bf6a58`.
6. **"Os detalhes fazem o espaço."** — seção `height: 320vh`, fundo `#111510`, conteúdo sticky 100vh. Título "Os detalhes" (Manrope 700) + "fazem o espaço." (Cormorant Garamond italic 500, `#e9a590`). Trilho horizontal de figuras (altura min(58vh,560px), 4:5, radius 22px, gap 20px, legenda 13px `rgba(247,244,239,.6)` com o nome do projeto). `translateX(−p · (scrollWidth − innerWidth))` com `p = clamp(−rect.top / (sectionHeight − vh))`. Imagens: ver `DETALHES` no protótipo.
7. **Sobre** (`#sobre`) — grid 2 colunas `auto-fit minmax(min(100%,380px),1fr)`, gap clamp(40px,7vw,100px). Esquerda: card branco quadrado radius 28px, sombra `0 30px 80px rgba(29,35,28,.08)`, logo completa (`site/logo.png`) contida com padding 14%. Direita: kicker "SOBRE" (`#bf6a58`), H2 "Arq. Cristiane Souza." (clamp(40px,5.4vw,72px)/700), parágrafo (clamp(18px,1.6vw,21px), lh 1.55, `#4a5246`), dados: Registro "CAU A-315284-7" · Atuação "Residencial e comercial".
8. **CTA final** — fundo `#1d231c`, centralizado. "Vamos projetar" + "o seu espaço." (serif italic `#e9a590`). Botões: "Solicitar orçamento" (pill clara) e "Falar no WhatsApp ›" (texto `#e9a590`).

### Página do projeto
- Sub-barra sticky (top 60px, abaixo do header): nome do projeto (19px/700) + "Todos os projetos" + pill "Orçamento" (`#bf6a58`).
- Cabeçalho centralizado: categoria, H1 (clamp(56px,10vw,140px)/700, ls −.055em, lh .92), descrição (clamp(19px,1.8vw,24px), max 720px, `#4a5246`).
- Capa: max-width 1400px, radius 28px, altura min(86vh,900px), cover; clique abre lightbox.
- Galeria: grid `auto-fit minmax(min(100%,420px),1fr)`, gap 20px, radius 22px. A cada 3ª imagem (índice % 3 === 2) ou se só houver 1, ocupa a linha inteira (`grid-column: 1/-1`, max-height 80vh); demais max-height 70vh. Hover `scale(1.025)`. Lazy-load.
- "Próximo projeto": bloco full-bleed 70vh (min 420px) com a capa do próximo a 55% de opacidade, kicker "PRÓXIMO PROJETO" + nome gigante.

### Lightbox
Overlay fixo `rgba(10,12,10,.96)`. Imagem `contain`, radius 12px. Botões circulares 52px (‹ ›) e fechar 40px, fundo `rgba(247,244,239,.14)`. Contador "i de N". Teclado: ←/→ navega, Esc fecha; clique no fundo fecha.

### Contato
Grid 2 colunas. Esquerda: H1 "Conte sobre" + "o seu projeto." (serif italic `#bf6a58`), lista WhatsApp / Email / Instagram (**placeholders — substituir pelos reais**). Direita: card branco radius 28px com campos (inputs radius 14px, borda `rgba(29,35,28,.16)`, fundo `#fbfaf7`, foco borda `#bf6a58` + ring `0 0 0 4px rgba(191,106,88,.15)`): Nome, Email ou telefone, tipo de projeto (chips: Residencial/Comercial/Interiores/Marcenaria), Mensagem; botão "Enviar mensagem" (pill `#1d231c`, hover `#bf6a58`). Validação: nome e contato obrigatórios ("Preencha nome e contato."). Sucesso: ícone ✓, "Mensagem enviada.", "Obrigada, {nome}. Retorno em breve.", link "Enviar outra mensagem ›". **Em produção:** enviar via API route (Resend/Formspree) ou abrir WhatsApp com texto pré-preenchido.

### Footer
Borda superior `rgba(29,35,28,.1)`, 12px `#6b7367`: "Cristiane Souza Arquitetura e Interiores · CAU A-315284-7" + links.

## Interactions & Behavior
- **Reveal no scroll:** elementos `[data-rv]` começam `opacity:0; translateY(48px)` e entram com `opacity 1, transform none` em 1.1s `cubic-bezier(.2,.7,.2,1)` ao entrar 8% no viewport (IntersectionObserver, threshold .12). Garantir que elementos montados depois (filtro, troca de página) também sejam observados.
- Scroll handlers via `requestAnimationFrame` (passive). Respeitar `prefers-reduced-motion` (desligar parallax/stack/horizontal → layouts estáticos).
- Âncoras com scroll suave e offset de 60px.

## Design Tokens
- Fundo `#f7f4ef` · Texto `#1d231c` · Escuro `#111510` · Verde CTA/rodapé `#1d231c`
- Terracota `#bf6a58` · Rosa claro `#e9cfc6` · Salmão `#e9a590` · Cinzas texto `#4a5246`, `#5d6559`, `#6b7367`, `#7a8276`
- Placeholder imagem `#e6e1d8` · Branco card `#ffffff` · Input `#fbfaf7`
- Fontes (Google Fonts): **Manrope** 400/500/600/700 (UI e títulos sans) · **Cormorant Garamond** 500 + 500 italic (nome e acentos)
- Raios: 12 (lightbox img), 14 (inputs), 22 (galeria), 24 (cards), 28 (blocos grandes), 999 (pills)
- Easing padrão: `cubic-bezier(.2,.7,.2,1)`

## Assets (`reference/site/`)
- `logo.png` — logo completa (extraída do PDF da arquiteta). `logo-mark.png` — só o símbolo, fundo transparente. **Pedir à cliente a logo em vetor (SVG)** para produção.
- `p/*.jpg` — renders dos projetos, já redimensionados (máx 2000px, JPEG 82). Em produção gerar AVIF/WebP via `next/image`.
- `barbearia-*.jpeg`, `acai-*.jpeg` — fotos enviadas por WhatsApp (qualidade menor).
- Dados completos dos 11 projetos (id, nome, categoria, descrição, ordem das fotos) estão no array `PROJETOS` do protótipo — migrar para `data/projetos.ts` ou um CMS (Sanity/Contentful) se a cliente for atualizar sozinha.

## Pendências de conteúdo
- WhatsApp, email e Instagram reais.
- Revisar descrições dos projetos e texto do Sobre (escritos a partir das fotos).
- Confirmar se "Dapraça" é projeto da arquiteta e o nome dos projetos "Suíte" e "Banheiro".
- SEO: title/description por página, Open Graph com a capa de cada projeto.

## Files
- `reference/Site Portfolio.dc.html` — protótipo completo (markup inline + lógica no fim do arquivo)
- `reference/support.js` — runtime do protótipo (necessário só para abrir o HTML; não portar)
- `reference/site/` — todas as imagens
