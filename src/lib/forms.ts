export type Opcao = { value: string; label: string };
export type Campo = {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'select';
  required?: boolean;
  options?: Opcao[];
  prefixo?: string;
  placeholder?: string;
};
export type Tabela = 'clientes' | 'projetos' | 'obras' | 'compras' | 'servicos' | 'fornecedores';
export type FormDef = {
  nome: string;
  tabela: Tabela;
  campos: Campo[];
  defaults: Record<string, string>;
};

const opts = (a: readonly string[]): Opcao[] => a.map((x) => ({ value: x, label: x }));

export const TIPOS_CLIENTE = ['Física', 'Jurídica'] as const;
export const STATUS_CLIENTE = ['Ativo', 'Inativo'] as const;
export const STATUS_PROJETO = ['Em andamento', 'Pausado', 'Concluído'] as const;
export const STATUS_OBRA = ['Em andamento', 'Pausada', 'Concluída'] as const;
export const CATEGORIAS_SERVICO = ['Projeto', 'Interiores', 'Consultoria', 'Visualização', 'Obra'] as const;
export const COBRANCAS = ['Por m²', 'Valor fechado', 'Por hora'] as const;

type Nomeado = { id: string; nome: string };
const hoje = () => new Date().toISOString().slice(0, 10);

export const forms = {
  cliente: (): FormDef => ({
    nome: 'cliente',
    tabela: 'clientes',
    campos: [
      { key: 'tipo', label: 'Tipo', type: 'select', options: opts(TIPOS_CLIENTE) },
      { key: 'nome', label: 'Nome', required: true },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'telefone', label: 'Telefone' },
      { key: 'doc', label: 'CPF / CNPJ' },
      { key: 'endereco', label: 'Endereço' },
      { key: 'cidade', label: 'Cidade' },
      { key: 'status', label: 'Status', type: 'select', options: opts(STATUS_CLIENTE) },
    ],
    defaults: { tipo: 'Física', status: 'Ativo' },
  }),
  projeto: (clientes: Nomeado[]): FormDef => ({
    nome: 'projeto',
    tabela: 'projetos',
    campos: [
      { key: 'nome', label: 'Nome do projeto', required: true },
      { key: 'cliente_id', label: 'Cliente', type: 'select', required: true, options: clientes.map((c) => ({ value: c.id, label: c.nome })) },
      { key: 'status', label: 'Status', type: 'select', options: opts(STATUS_PROJETO) },
      { key: 'valor', label: 'Valor', type: 'number', prefixo: 'R$', placeholder: '0,00' },
    ],
    defaults: { status: 'Em andamento', cliente_id: clientes[0]?.id ?? '' },
  }),
  obra: (clientes: Nomeado[]): FormDef => ({
    nome: 'obra',
    tabela: 'obras',
    campos: [
      { key: 'nome', label: 'Nome da obra', required: true },
      { key: 'cliente_id', label: 'Cliente', type: 'select', required: true, options: clientes.map((c) => ({ value: c.id, label: c.nome })) },
      { key: 'status', label: 'Status', type: 'select', options: opts(STATUS_OBRA) },
      { key: 'orcado', label: 'Orçamento', type: 'number', prefixo: 'R$', placeholder: '0,00' },
    ],
    defaults: { status: 'Em andamento', cliente_id: clientes[0]?.id ?? '' },
  }),
  compra: (fornecedores: Nomeado[]): FormDef => ({
    nome: 'compra',
    tabela: 'compras',
    campos: [
      { key: 'item', label: 'Item', required: true },
      { key: 'fornecedor', label: 'Fornecedor', type: 'select', options: opts([...fornecedores.map((f) => f.nome), 'Outro']) },
      { key: 'data', label: 'Data', type: 'date' },
      { key: 'valor', label: 'Valor', type: 'number', required: true, prefixo: 'R$', placeholder: '0,00' },
    ],
    defaults: { fornecedor: fornecedores[0]?.nome ?? 'Outro', data: hoje() },
  }),
  servico: (): FormDef => ({
    nome: 'servico',
    tabela: 'servicos',
    campos: [
      { key: 'categoria', label: 'Categoria', type: 'select', options: opts(CATEGORIAS_SERVICO) },
      { key: 'nome', label: 'Nome', required: true },
      { key: 'descricao', label: 'Descrição' },
      { key: 'preco', label: 'Preço', prefixo: 'R$', placeholder: 'Ex.: 350, 45/m², 1.200/mês' },
    ],
    defaults: { categoria: 'Projeto' },
  }),
  fornecedor: (): FormDef => ({
    nome: 'fornecedor',
    tabela: 'fornecedores',
    campos: [
      { key: 'nome', label: 'Nome', required: true },
      { key: 'categoria', label: 'Categoria' },
      { key: 'contato', label: 'Contato' },
      { key: 'cidade', label: 'Cidade' },
    ],
    defaults: {},
  }),
};

export type Valores = Record<string, string | number>;

export function lerForm(def: FormDef, fd: FormData): { valores: Valores; erro?: string } {
  const valores: Valores = {};
  const faltando: string[] = [];
  for (const c of def.campos) {
    let v = String(fd.get(c.key) ?? '').trim().slice(0, 2000);
    if (c.type === 'select' && c.options && !c.options.some((o) => o.value === v)) {
      v = c.required ? '' : (def.defaults[c.key] ?? c.options[0]?.value ?? '');
    }
    if (c.required && !v) faltando.push(c.label);
    if (c.type === 'number') {
      const n = Number(v.replace(/\s/g, '').replace(',', '.'));
      valores[c.key] = Number.isFinite(n) ? n : 0;
    } else if (c.prefixo) {

      const resto = v.startsWith(c.prefixo) ? v.slice(c.prefixo.length).trim() : v;
      valores[c.key] = resto ? `${c.prefixo} ${resto}` : '';
    } else {
      valores[c.key] = v;
    }
  }
  return faltando.length ? { valores, erro: 'Preencha: ' + faltando.join(', ') } : { valores };
}
