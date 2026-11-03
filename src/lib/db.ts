import type { Tabela, Valores } from './forms';

export type Config = {
  estudio: string;
  cnpj: string;
  email: string;
  telefone: string;
  responsavel: string;
  cau: string;
  cobranca: string;
};
export type Cliente = {
  id: string;
  tipo: string;
  status: string;
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  endereco: string;
  doc: string;
  notas: string;
};
export type Projeto = { id: string; nome: string; cliente_id: string | null; status: string; valor: number };
export type ProjetoResumo = Projeto & { cliente_nome: string | null; total: number; feitas: number };
export type Tarefa = { id: string; projeto_id: string; titulo: string; prazo: string; col: number };
export type Obra = { id: string; nome: string; cliente_id: string | null; status: string; orcado: number };
export type ObraResumo = Obra & { cliente_nome: string | null; gasto: number };
export type Compra = { id: string; obra_id: string; item: string; fornecedor: string; data: string; valor: number };
export type Servico = { id: string; categoria: string; nome: string; descricao: string; preco: string };
export type Fornecedor = { id: string; nome: string; categoria: string; contato: string; cidade: string };

export const SEM_CLIENTE = 'Sem cliente';

const todos = async <T>(st: D1PreparedStatement) => (await st.all<T>()).results;

export async function inserir(db: D1Database, tabela: Tabela, valores: Valores) {
  const id = crypto.randomUUID();
  const cols = ['id', ...Object.keys(valores)];
  await db
    .prepare(`INSERT INTO ${tabela} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`)
    .bind(id, ...Object.values(valores))
    .run();
  return id;
}

export async function atualizar(db: D1Database, tabela: Tabela, id: string, valores: Valores) {
  const sets = Object.keys(valores).map((k) => `${k} = ?`);
  if (!sets.length) return;
  await db
    .prepare(`UPDATE ${tabela} SET ${sets.join(', ')} WHERE id = ?`)
    .bind(...Object.values(valores), id)
    .run();
}

export async function excluir(db: D1Database, tabela: Tabela | 'tarefas', id: string) {
  await db.prepare(`DELETE FROM ${tabela} WHERE id = ?`).bind(id).run();
}

export async function obterConfig(db: D1Database): Promise<Config> {
  const c = await db.prepare('SELECT estudio, cnpj, email, telefone, responsavel, cau, cobranca FROM config WHERE id = 1').first<Config>();
  return c ?? { estudio: '', cnpj: '', email: '', telefone: '', responsavel: '', cau: '', cobranca: 'Por m²' };
}

export async function salvarConfig(db: D1Database, c: Config) {
  await db
    .prepare(
      `INSERT INTO config (id, estudio, cnpj, email, telefone, responsavel, cau, cobranca) VALUES (1, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET estudio = excluded.estudio, cnpj = excluded.cnpj, email = excluded.email,
         telefone = excluded.telefone, responsavel = excluded.responsavel, cau = excluded.cau, cobranca = excluded.cobranca`,
    )
    .bind(c.estudio, c.cnpj, c.email, c.telefone, c.responsavel, c.cau, c.cobranca)
    .run();
}

export const listarClientes = (db: D1Database) =>
  todos<Cliente>(db.prepare('SELECT * FROM clientes ORDER BY nome COLLATE NOCASE'));

export const nomesClientes = (db: D1Database) =>
  todos<{ id: string; nome: string }>(db.prepare('SELECT id, nome FROM clientes ORDER BY nome COLLATE NOCASE'));

export const obterCliente = (db: D1Database, id: string) =>
  db.prepare('SELECT * FROM clientes WHERE id = ?').bind(id).first<Cliente>();

export async function salvarNotas(db: D1Database, id: string, notas: string) {
  const r = await db.prepare('UPDATE clientes SET notas = ? WHERE id = ?').bind(notas.slice(0, 20000), id).run();
  return r.meta.changes > 0;
}

const SQL_PROJETOS = `
  SELECT p.*, c.nome AS cliente_nome,
    (SELECT COUNT(*) FROM tarefas t WHERE t.projeto_id = p.id) AS total,
    (SELECT COUNT(*) FROM tarefas t WHERE t.projeto_id = p.id AND t.col = 2) AS feitas
  FROM projetos p LEFT JOIN clientes c ON c.id = p.cliente_id`;

export const listarProjetos = (db: D1Database) =>
  todos<ProjetoResumo>(db.prepare(`${SQL_PROJETOS} ORDER BY p.criado_em DESC`));

export const projetosDoCliente = (db: D1Database, clienteId: string) =>
  todos<ProjetoResumo>(db.prepare(`${SQL_PROJETOS} WHERE p.cliente_id = ? ORDER BY p.criado_em DESC`).bind(clienteId));

export const tarefasDoProjeto = (db: D1Database, projetoId: string) =>
  todos<Tarefa>(db.prepare('SELECT * FROM tarefas WHERE projeto_id = ? ORDER BY criado_em, rowid').bind(projetoId));

export async function adicionarTarefa(db: D1Database, projetoId: string, titulo: string, prazo: string, col: number) {
  await db
    .prepare('INSERT INTO tarefas (id, projeto_id, titulo, prazo, col) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), projetoId, titulo.slice(0, 300), prazo, col)
    .run();
}

export async function moverTarefa(db: D1Database, id: string, projetoId: string, col: number) {
  const r = await db.prepare('UPDATE tarefas SET col = ? WHERE id = ? AND projeto_id = ?').bind(col, id, projetoId).run();
  return r.meta.changes > 0;
}

export const tarefasFazendo = (db: D1Database) =>
  todos<{ id: string; titulo: string; projeto_id: string; projeto_nome: string }>(
    db.prepare(
      `SELECT t.id, t.titulo, t.projeto_id, p.nome AS projeto_nome
       FROM tarefas t JOIN projetos p ON p.id = t.projeto_id WHERE t.col = 1 ORDER BY t.criado_em`,
    ),
  );

const SQL_OBRAS = `
  SELECT o.*, c.nome AS cliente_nome,
    COALESCE((SELECT SUM(k.valor) FROM compras k WHERE k.obra_id = o.id), 0) AS gasto
  FROM obras o LEFT JOIN clientes c ON c.id = o.cliente_id`;

export const listarObras = (db: D1Database) => todos<ObraResumo>(db.prepare(`${SQL_OBRAS} ORDER BY o.criado_em DESC`));

export const obrasDoCliente = (db: D1Database, clienteId: string) =>
  todos<ObraResumo>(db.prepare(`${SQL_OBRAS} WHERE o.cliente_id = ? ORDER BY o.criado_em DESC`).bind(clienteId));

export const comprasDaObra = (db: D1Database, obraId: string) =>
  todos<Compra>(db.prepare('SELECT * FROM compras WHERE obra_id = ? ORDER BY data DESC, criado_em DESC').bind(obraId));

export const listarServicos = (db: D1Database) =>
  todos<Servico>(db.prepare('SELECT * FROM servicos ORDER BY categoria, nome COLLATE NOCASE'));

export const listarFornecedores = (db: D1Database) =>
  todos<Fornecedor>(db.prepare('SELECT * FROM fornecedores ORDER BY nome COLLATE NOCASE'));

export async function resumoDashboard(db: D1Database) {
  const r = await db
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM clientes WHERE status = 'Ativo') AS clientes,
        (SELECT COUNT(*) FROM projetos WHERE status = 'Em andamento') AS projetos,
        (SELECT COUNT(*) FROM obras WHERE status = 'Em andamento') AS obras,
        (SELECT COALESCE(SUM(valor), 0) FROM projetos WHERE status = 'Em andamento') AS valor`,
    )
    .first<{ clientes: number; projetos: number; obras: number; valor: number }>();
  return r ?? { clientes: 0, projetos: 0, obras: 0, valor: 0 };
}
