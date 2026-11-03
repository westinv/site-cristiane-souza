import { atualizar, excluir, inserir } from './db';
import { lerForm, type FormDef, type Valores } from './forms';

export type ResultadoCrud = { form: FormDef; acao: 'salvar' | 'excluir'; id: string; novo: boolean } | { erro: string } | null;

export async function processarCrud(db: D1Database, fd: FormData, defs: FormDef[], extras: Valores = {}): Promise<ResultadoCrud> {
  const form = defs.find((d) => d.nome === fd.get('_form'));
  if (!form) return null;
  const acao = fd.get('_acao');
  const id = String(fd.get('id') ?? '');

  if (acao === 'excluir') {
    if (!id) return { erro: 'Item não encontrado.' };
    await excluir(db, form.tabela, id);
    return { form, acao, id, novo: false };
  }
  if (acao === 'salvar') {
    const { valores, erro } = lerForm(form, fd);
    if (erro) return { erro };
    if (id) {
      await atualizar(db, form.tabela, id, valores);
      return { form, acao, id, novo: false };
    }
    return { form, acao, id: await inserir(db, form.tabela, { ...valores, ...extras }), novo: true };
  }
  return { erro: 'Ação inválida.' };
}

export function voltar(url: URL, params: Record<string, string | null> = {}) {
  const u = new URL(url);
  u.searchParams.delete('erro');
  u.searchParams.delete('novo');
  u.searchParams.delete('salvo');
  for (const [k, v] of Object.entries(params)) {
    if (v === null) u.searchParams.delete(k);
    else u.searchParams.set(k, v);
  }
  return u.pathname + u.search;
}

export function destinoCrud(url: URL, r: ResultadoCrud, params: Record<string, string | null> = {}) {
  if (r && 'erro' in r) return voltar(url, { ...params, erro: r.erro });
  return voltar(url, params);
}
