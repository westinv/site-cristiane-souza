CREATE TABLE usuarios (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  nome TEXT NOT NULL,
  senha_hash TEXT NOT NULL,
  criado_em INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE sessoes (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  expira_em INTEGER NOT NULL
);
CREATE INDEX sessoes_usuario ON sessoes(usuario_id);

CREATE TABLE config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  estudio TEXT NOT NULL DEFAULT '',
  cnpj TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  telefone TEXT NOT NULL DEFAULT '',
  responsavel TEXT NOT NULL DEFAULT '',
  cau TEXT NOT NULL DEFAULT '',
  cobranca TEXT NOT NULL DEFAULT 'Por m²' CHECK (cobranca IN ('Por m²', 'Valor fechado', 'Por hora'))
);
INSERT INTO config (id, estudio, cnpj, email, telefone, responsavel, cau, cobranca)
VALUES (1, 'Cristiane Souza Arquitetura e Interiores', '', 'arq.cristianesouza@gmail.com', '(35) 99807-1578', 'Cristiane Souza', 'A315284-7', 'Por m²');

CREATE TABLE clientes (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL DEFAULT 'Física' CHECK (tipo IN ('Física', 'Jurídica')),
  status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
  nome TEXT NOT NULL,
  email TEXT NOT NULL DEFAULT '',
  telefone TEXT NOT NULL DEFAULT '',
  cidade TEXT NOT NULL DEFAULT '',
  endereco TEXT NOT NULL DEFAULT '',
  doc TEXT NOT NULL DEFAULT '',
  notas TEXT NOT NULL DEFAULT '',
  criado_em INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE projetos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  cliente_id TEXT REFERENCES clientes(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Em andamento' CHECK (status IN ('Em andamento', 'Pausado', 'Concluído')),
  valor REAL NOT NULL DEFAULT 0,
  criado_em INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX projetos_cliente ON projetos(cliente_id);

CREATE TABLE tarefas (
  id TEXT PRIMARY KEY,
  projeto_id TEXT NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  prazo TEXT NOT NULL DEFAULT '',
  col INTEGER NOT NULL DEFAULT 0 CHECK (col IN (0, 1, 2)),
  criado_em INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX tarefas_projeto ON tarefas(projeto_id);

CREATE TABLE obras (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  cliente_id TEXT REFERENCES clientes(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Em andamento' CHECK (status IN ('Em andamento', 'Pausada', 'Concluída')),
  orcado REAL NOT NULL DEFAULT 0,
  criado_em INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX obras_cliente ON obras(cliente_id);

CREATE TABLE compras (
  id TEXT PRIMARY KEY,
  obra_id TEXT NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  fornecedor TEXT NOT NULL DEFAULT '',
  data TEXT NOT NULL DEFAULT '',
  valor REAL NOT NULL DEFAULT 0,
  criado_em INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX compras_obra ON compras(obra_id);

CREATE TABLE servicos (
  id TEXT PRIMARY KEY,
  categoria TEXT NOT NULL DEFAULT 'Projeto',
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  preco TEXT NOT NULL DEFAULT '',
  criado_em INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE fornecedores (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT '',
  contato TEXT NOT NULL DEFAULT '',
  cidade TEXT NOT NULL DEFAULT '',
  criado_em INTEGER NOT NULL DEFAULT (unixepoch())
);
