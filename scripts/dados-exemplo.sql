DELETE FROM compras; DELETE FROM obras; DELETE FROM tarefas; DELETE FROM projetos;
DELETE FROM clientes; DELETE FROM servicos; DELETE FROM fornecedores;

INSERT INTO clientes (id, tipo, status, nome, email, telefone, cidade, endereco, doc) VALUES
 ('c1','Física','Ativo','Fabio Juliano e Debora','fabio.debora@exemplo.com','(35) 99962-1819','Pouso Alegre, MG','Rua das Acácias, 120','123.456.789-00'),
 ('c2','Física','Ativo','Antonia Chagas','antonia.chagas@exemplo.com','(35) 99912-0220','Ipiúna, MG','',''),
 ('c3','Física','Ativo','Victor Westim Vilas Boa Melo','victor.melo@exemplo.com','(35) 99797-9525','Ipiúna, MG','',''),
 ('c4','Jurídica','Ativo','Willian Gustavo Construções','contato@wgconstrucoes.com','(19) 99806-8577','Sorocaba, SP','',''),
 ('c5','Física','Inativo','Welligton Ramos','welligton.ramos@exemplo.com','(35) 99952-5280','Ipiúna, MG','',''),
 ('c6','Física','Ativo','Projeto Modelo','modelo@exemplo.com','(35) 99807-1578','Ipiúna, MG','','');

INSERT INTO projetos (id, nome, cliente_id, status, valor) VALUES
 ('p1','Casa J I D','c1','Pausado',12000),
 ('p2','Cantinho do Açaí','c2','Concluído',4500),
 ('p3','Projeto Mesa','c3','Concluído',1800),
 ('p4','Projeto Home','c4','Em andamento',9000),
 ('p5','Projeto Ramos','c5','Pausado',6000),
 ('p6','Projeto Modelo','c6','Em andamento',12000);

INSERT INTO tarefas (id, projeto_id, titulo, prazo, col) VALUES
 ('t1','p4','Levantamento de medidas','2026-09-02',2),
 ('t2','p4','Estudo preliminar','2026-09-10',2),
 ('t3','p4','Render da sala','2026-09-28',1),
 ('t4','p4','Detalhamento de marcenaria','2026-10-05',0),
 ('t5','p1','Reunião de briefing','',0),
 ('t6','p6','Planta baixa','',1);

INSERT INTO obras (id, nome, cliente_id, status, orcado) VALUES
 ('o1','Casa J I D','c1','Em andamento',85000),
 ('o2','Projeto Home','c4','Em andamento',40000),
 ('o3','Cantinho do Açaí','c2','Concluída',22000);

INSERT INTO compras (id, obra_id, item, fornecedor, data, valor) VALUES
 ('k1','o1','Porcelanato 90x90','Pedras do Sul','2026-09-12',8900),
 ('k2','o1','Armários da cozinha','Marcenaria Pinheiro','2026-09-05',18500),
 ('k3','o1','Spots e perfis LED','Luz & Forma','2026-08-28',5000),
 ('k4','o2','Box de vidro','Vidraçaria Central','2026-09-15',3200),
 ('k5','o2','Painel ripado','Marcenaria Pinheiro','2026-09-02',8000),
 ('k6','o3','Balcão de atendimento','Marcenaria Pinheiro','2026-07-10',14300),
 ('k7','o3','Pendentes','Luz & Forma','2026-07-02',7000);

INSERT INTO servicos (id, categoria, nome, descricao, preco) VALUES
 ('s1','Projeto','Projeto arquitetônico','Planta, cortes, fachadas e memorial.','R$ 45/m²'),
 ('s2','Interiores','Projeto de interiores','Layout, marcenaria e especificação.','R$ 60/m²'),
 ('s3','Consultoria','Consultoria de ambiente','Visita e recomendações por cômodo.','R$ 350'),
 ('s4','Visualização','Render 3D','Imagem realista por ambiente.','R$ 280'),
 ('s5','Obra','Acompanhamento de obra','Visitas semanais e relatório.','R$ 1.200/mês');

INSERT INTO fornecedores (id, nome, categoria, contato, cidade) VALUES
 ('f1','Marcenaria Pinheiro','Marcenaria','(35) 99811-2040','Pouso Alegre, MG'),
 ('f2','Pedras do Sul','Revestimentos','(35) 99730-1188','Ipiúna, MG'),
 ('f3','Luz & Forma','Iluminação','(19) 99655-7012','Sorocaba, SP'),
 ('f4','Vidraçaria Central','Vidros','(35) 99902-3345','Ipiúna, MG');
