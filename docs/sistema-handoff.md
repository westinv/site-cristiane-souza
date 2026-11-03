# Handoff: Sistema de gestão — Cristiane Souza Arquitetura

## Overview
Sistema interno (área restrita) para o escritório de arquitetura gerenciar **clientes, projetos (com quadro de tarefas), catálogo de serviços e fornecedores, obras (orçamento × compras) e configurações**. Acessado pelo botão "Área restrita" do site portfólio (ver o handoff do site). Visual idêntico ao portfólio: creme, verde escuro, terracota, Manrope + Cormorant Garamond.

## About the Design Files
Os arquivos em `reference/` são **referências de design em HTML** — protótipos de aparência e comportamento, **não código de produção**. Recriar no stack real. Recomendação (e de preferência no **mesmo projeto Next.js do site**, sob `/app/...`):
- **Next.js (App Router) + TypeScript + Tailwind**
- **Banco + Auth:** Supabase (Postgres + Auth por email/senha) ou Prisma + Postgres + NextAuth
- Ícones: **lucide-react** (stroke-width 2.75 no protótipo)
- Formulários: react-hook-form + zod

Para abrir o protótipo: `npx serve reference` e acesse `Login.dc.html`. Os dados ficam em `localStorage` (chave `traco-data-v1`) via `store.js` — em produção trocar por banco real. Cada tela tem sua lógica no `<script data-dc-script>` no fim do arquivo.

## Fidelity
**High-fidelity.** Cores, tipografia, raios e estados são finais.

## Rotas sugeridas
`/login` · `/app` (Dashboard) · `/app/clientes` · `/app/clientes/[id]` · `/app/projetos` · `/app/projetos/[id]` (quadro) · `/app/catalogo` · `/app/obras` (`?id=`) · `/app/configuracoes`. Proteger `/app/*` por sessão; "Sair" faz logout e volta a `/login`.

## Layout global (Sidebar + Main)
- `.app` flex. **Sidebar** 248px, sticky 100vh, fundo `rgba(247,244,239,.8)` + `backdrop-filter: saturate(180%) blur(20px)`, borda direita `1px rgba(29,35,28,.08)`, padding 26px 16px, gap 24px.
  - Topo: símbolo da logo (`site/logo-mark.png`, 34px alt.) + "Cristiane Souza" (Cormorant Garamond 500, 22px).
  - Perfil: avatar círculo 38px (inicial do responsável) + nome (13px/600) + nome do estúdio (11px, 60%) — vêm de Configurações. Divisórias `rgba(29,35,28,.1)`.
  - Nav (pills, 14px/500, padding 10px 14px, gap 10px com ícone 17px): Dashboard, Clientes, Projetos, Catálogo, Obras, Configurações. Hover `rgba(29,35,28,.06)`; **ativo** fundo `#1d231c` texto `#f7f4ef`.
  - "Sair" no rodapé, cor `#bf6a58`.
- **Main:** padding 44px clamp(20px,4vw,56px), gap 28px. Cabeçalho de página: H1 (Manrope 700, clamp(36px,4.4vw,56px), ls −.045em, lh 1) + subtítulo 14px 70% + ação primária à direita.
- ≤820px: sidebar vira barra horizontal no topo com scroll (esconde perfil e nome), main padding 24px 16px.

## Componentes (ver `theme-portfolio.css`)
- **Botão primário:** pill, `#1d231c`/`#f7f4ef`, 14px/600, padding 10px 18px; hover `#bf6a58`/branco; transição .3s `cubic-bezier(.2,.7,.2,1)`.
- **Secundário:** fundo branco, borda `rgba(29,35,28,.12)`, hover `#efebe4`. **Ícone:** 38×38 circular. **Ghost:** transparente.
- **Card:** branco, radius 24px, padding 22px, sombra `0 1px 2px rgba(29,35,28,.04), 0 8px 24px rgba(29,35,28,.05)`; hover sobe 3px com sombra maior. Título 20px/700 ls −.035em; kicker 11px/600 .22em `#bf6a58`; meta 13px `#7a8276` com ícone 13px.
- **Tag:** pill, 11px/600, uppercase, .08em. Variantes: andamento `#f6e4df`/`#7d3f32`; concluído `#e8ece3`/`#3a4535`; pausado/inativo borda `rgba(29,35,28,.25)` texto `#4a5246`; neutra `#efebe4`.
- **Input/Select:** pill, min-height 44px, fundo `#fbfaf7`, borda `rgba(29,35,28,.14)`, 15px; foco borda `#bf6a58` + ring `0 0 0 4px rgba(191,106,88,.15)`.
- **Segmentado (filtros):** container `rgba(29,35,28,.05)` pill padding 4px; opção 13px/600 padding 8px 16px; selecionada `#1d231c`/`#f7f4ef`.
- **Tabela:** th 11px/600 uppercase .14em `#7a8276`; linhas `rgba(29,35,28,.08)`.
- **Dialog:** backdrop `rgba(17,21,16,.45)` + blur 8px; card branco radius 28px, sombra `0 30px 80px rgba(29,35,28,.12)`, largura 460px; título 26px/700; ações Cancelar (ghost) / Salvar (primário). Fecha ao clicar no fundo. Campos obrigatórios mostram "Preencha: X, Y".

## Telas
1. **Login** — card central 400px: logo + "Cristiane Souza", "Entrar", "Acesse a gestão do seu estúdio", Email, Senha, botão "Entrar" (full width). Erro: "Informe email e senha." Enter envia.
2. **Dashboard** — "Olá, {primeiro nome}". 4 cards-link (grid auto-fit min 180px): clientes ativos, projetos em andamento, obras em andamento, soma do valor dos projetos em andamento (BRL). Card "Tarefas em andamento" (coluna "Fazendo" de todos os projetos → link para o quadro). "Ações rápidas": Novo cliente / Novo projeto / Nova obra (abrem a tela já com o formulário aberto — `?novo=1`).
3. **Clientes** — busca (nome/email/telefone) + filtro Todos/Física/Jurídica. Grid de cards (min 260px): tag tipo, tag status, nome, email, telefone, cidade; ações Ver / Editar / Excluir. Vazio: "Nenhum cliente encontrado." Form: Tipo, Nome*, Email, Telefone, CPF/CNPJ, Endereço, Cidade, Status.
4. **Cliente (detalhe)** — voltar; avatar 64px + nome + tags; Editar/Excluir. Cards Contato (email, telefone, endereço·cidade, CPF/CNPJ) e Anotações (textarea, salva ao digitar). "Projetos e obras" do cliente (links para quadro/obra com progresso ou gasto de orçado).
5. **Projetos** — busca + filtro Todos/Em andamento/Pausado/Concluído. Cards: status, nome, cliente, "Tarefas: x/y concluídas", "Valor: R$". Ações Board / Editar / Excluir (exclui tarefas junto). Form: Nome*, Cliente*, Status, Valor.
6. **Quadro do projeto** — voltar; nome, "cliente · x/y tarefas concluídas", tag status, seletor de projeto. 3 colunas (A fazer / Fazendo / Feito) em fundo `#fff`/surface radius 28px; cards de tarefa (título 14px/600, prazo ou "Sem prazo", ‹ › mover, × excluir); input "Nova tarefa" + botão (Enter adiciona). Sugestão em produção: drag-and-drop (dnd-kit).
7. **Catálogo** — segmentado Serviços/Fornecedores + busca. Serviços: grid de cards (categoria, nome, descrição, preço, editar/excluir). Fornecedores: tabela (nome, categoria, contato, cidade, ações). Botão do topo muda: "Novo serviço"/"Novo fornecedor".
8. **Obras** — layout split `minmax(220px,300px) | 1fr` (empilha no mobile). Esquerda: lista de obras (card-botão com borda 2px `#bf6a58` na selecionada). Direita: cliente (kicker) + nome; Adicionar compra / Editar / Excluir; 3 métricas (Orçado, Gasto em terracota, Saldo em verde) em blocos `#f7f4ef` radius 28px; tabela de compras (Item, Fornecedor, Data dd/mm/aaaa, Valor, remover). Form compra: Item*, Fornecedor (lista do catálogo + "Outro"), Data, Valor*. Form obra: Nome*, Cliente*, Status, Orçamento.
9. **Configurações** — cards Estúdio (nome, CNPJ, email, telefone), Responsável (nome, CAU), Preferências (cobrança padrão: Por m² / Valor fechado / Por hora). "Salvar alterações" mostra "Alterações salvas" por 2,5s. "Restaurar dados de exemplo" (só no protótipo).

## Modelo de dados (de `store.js`)
```ts
Config { estudio, cnpj, email, telefone, responsavel, cau, cobranca: 'Por m²'|'Valor fechado'|'Por hora' }
Cliente { id, tipo: 'Física'|'Jurídica', status: 'Ativo'|'Inativo', nome, email, telefone, cidade, endereco, doc, notas }
Projeto { id, nome, clienteId, status: 'Em andamento'|'Pausado'|'Concluído', valor: number }
Tarefa { id, projetoId, titulo, prazo?, col: 0|1|2 }   // A fazer | Fazendo | Feito
Obra { id, nome, clienteId, status: 'Em andamento'|'Pausada'|'Concluída', orcado: number }
Compra { id, obraId, item, fornecedor, data: 'YYYY-MM-DD', valor: number }
Servico { id, categoria, nome, descricao, preco: string }
Fornecedor { id, nome, categoria, contato, cidade }
```
Regras: excluir projeto remove suas tarefas; excluir obra remove suas compras; gasto = soma das compras; saldo = orçado − gasto. Valores em BRL (`toLocaleString('pt-BR', {style:'currency', currency:'BRL'})`). Dados de exemplo em `store.js` (`seed`).

## Design Tokens
Fundo `#f7f4ef` · Superfície `#ffffff` · Texto `#1d231c` · Terracota `#bf6a58` (hover `#a95a49`, texto escuro `#7d3f32`, tint `#f6e4df`) · Verde `#5d6b55` (texto `#3a4535`, tint `#e8ece3`) · Cinzas `#4a5246`, `#7a8276`, `#efebe4`, `#fbfaf7` · Divisor `rgba(29,35,28,.1)`.
Fontes: **Manrope** 400–700 (tudo) · **Cormorant Garamond** 500 (nome da marca). Raios: 24 cards, 28 dialog/blocos, 999 botões/inputs/tags. Easing `cubic-bezier(.2,.7,.2,1)`.

## Assets
`reference/site/logo-mark.png` (símbolo, transparente) e `logo.png` (completa). Pedir versão SVG à cliente.

## Files
- `reference/*.dc.html` — uma tela por arquivo; `Sidebar.dc.html` e `FormDialog.dc.html` são componentes compartilhados.
- `reference/store.js` — dados de exemplo, CRUD em localStorage, definição dos formulários (`forms`), formatação, e o elemento `<t-icon>` (Lucide via shadow DOM).
- `reference/theme-portfolio.css` — tokens e estilos dos componentes (sobrepõe `_ds/.../styles.css`).
- `reference/support.js`, `reference/_ds/` — runtime do protótipo; não portar.
