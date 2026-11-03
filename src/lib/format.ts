const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const brl = (n: unknown) => fmtBRL.format(Number(n) || 0);

export function data(s: string | null | undefined) {
  if (!s) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : s;
}

export function dataCurta(s: string | null | undefined) {
  const m = s ? /^\d{4}-(\d{2})-(\d{2})$/.exec(s) : null;
  return m ? `${m[2]}/${m[1]}` : s || '';
}

export function tagStatus(s: string) {
  if (/andamento/i.test(s)) return 'tag-accent';
  if (/conclu/i.test(s)) return 'tag-accent-2';
  return 'tag-outline';
}

export const inicial = (nome: string | null | undefined) => (nome?.trim()[0] ?? '?').toUpperCase();
