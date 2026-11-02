import type { ImageMetadata } from 'astro';

const arquivos = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/projetos/*.{jpg,jpeg,png}',
  { eager: true },
);

function foto(nome: string): ImageMetadata {
  const img = arquivos[`../assets/projetos/${nome}`];
  if (!img) throw new Error(`Foto não encontrada: src/assets/projetos/${nome}`);
  return img.default;
}

export type Categoria = 'Residencial' | 'Comercial';

export interface Projeto {
  id: string;
  nome: string;
  categoria: Categoria;
  descricao: string;
  fotos: ImageMetadata[];
}

const fotos = (...nomes: string[]) => nomes.map(foto);

export const PROJETOS: Projeto[] = [
  {
    id: 'quarto-cecilia',
    nome: 'Quarto Cecília',
    categoria: 'Residencial',
    descricao: 'Quarto de bebê em tons de rosa, com arco iluminado e papel de parede floral, marcenaria com palhinha e armário de cantos arredondados.',
    fotos: fotos('cecilia-07.jpg', 'cecilia-01.jpg', 'cecilia-03.jpg', 'cecilia-09.jpg', 'cecilia-08.jpg', 'cecilia-04.jpg', 'cecilia-05.jpg', 'cecilia-06.jpg'),
  },
  {
    id: 'area-gourmet',
    nome: 'Área Gourmet',
    categoria: 'Residencial',
    descricao: 'Forro em madeira aparente, churrasqueira em tijolo, bancada em granito preto com ripado iluminado e pendentes de madeira.',
    fotos: fotos('gourmet-03.jpg', 'gourmet-02.jpg', 'gourmet-04.jpg', 'gourmet-05.jpg', 'gourmet-01.jpg'),
  },
  {
    id: 'suite-master',
    nome: 'Suíte Master',
    categoria: 'Residencial',
    descricao: 'Cabeceira estofada sob painel ripado, pendentes pretos, cômoda suspensa em madeira e penteadeira integrada.',
    fotos: fotos('master-05.jpg', 'master-04.jpg', 'master-03.jpg', 'master-02.jpg'),
  },
  {
    id: 'studio-pilates',
    nome: 'Studio de Pilates',
    categoria: 'Comercial',
    descricao: 'Studio com parede de tijolinho e espelhos em arco, divisória ripada, recepção em verde com linha de luz orgânica.',
    fotos: fotos('pilates-04.jpg', 'pilates-02.jpg', 'pilates-03.jpg', 'pilates-05.jpg', 'pilates-06.jpg', 'pilates-07.jpg', 'pilates-08.jpg', 'pilates-09.jpg', 'pilates-10.jpg', 'pilates-11.jpg', 'pilates-12.jpg'),
  },
  {
    id: 'barbearia',
    nome: 'Barbearia',
    categoria: 'Comercial',
    descricao: 'Barbearia com tema de basquete: cimento queimado, teto em laranja, bolas fixadas na parede, camisas emolduradas e iluminação em perfil de LED.',
    fotos: fotos('barbearia-3.jpeg', 'barbearia-1.jpeg', 'barbearia-2.jpeg', 'barbearia-4.jpeg', 'barbearia-5.jpeg', 'barbearia-6.jpeg', 'barbearia-7.jpeg'),
  },
  {
    id: 'suite-2',
    nome: 'Suíte',
    categoria: 'Residencial',
    descricao: 'Painel ripado em madeira na cabeceira, estante aberta, armário com portas espelhadas e luminárias articuladas.',
    fotos: fotos('suite2-01.jpg', 'suite2-06.jpg', 'suite2-07.jpg', 'suite2-02.jpg', 'suite2-03.jpg', 'suite2-05.jpg'),
  },
  {
    id: 'lavanderia',
    nome: 'Lavanderia',
    categoria: 'Residencial',
    descricao: 'Revestimento em filetes, prateleiras com fita de LED, bancada em granilite e armário alto para limpeza.',
    fotos: fotos('lav-01.jpg', 'lav-00.jpg', 'lav-04.jpg', 'lav-02.jpg', 'lav-05.jpg', 'lav-06.jpg', 'lav-07.jpg'),
  },
  {
    id: 'banheiro',
    nome: 'Banheiro',
    categoria: 'Residencial',
    descricao: 'Porcelanato marmorizado, nicho ripado iluminado no box, bancada suspensa em granito e metais pretos.',
    fotos: fotos('gourmet-08.jpg', 'gourmet-06.jpg', 'gourmet-07.jpg'),
  },
  {
    id: 'home-office',
    nome: 'Home office',
    categoria: 'Residencial',
    descricao: 'Bancada contínua em madeira, armários aéreos, estante suspensa sobre painel amadeirado e recanto de leitura.',
    fotos: fotos('office-02.jpg', 'office-05.jpg', 'office-06.jpg', 'office-01.jpg', 'office-04.jpg', 'office-03.jpg'),
  },
  {
    id: 'cantinho-do-acai',
    nome: 'Cantinho do Açaí',
    categoria: 'Comercial',
    descricao: 'Loja de açaí com paredes em roxo e branco em formas orgânicas, balcão em ripado de madeira e bancada alta.',
    fotos: fotos('acai-cantinho.jpeg'),
  },
  {
    id: 'dapraca',
    nome: 'Dapraça',
    categoria: 'Comercial',
    descricao: 'Açaiteria com forro em madeira e iluminação indireta, parede verde e mobiliário em amarelo sobre base neutra.',
    fotos: fotos('acai-dapraca.jpeg'),
  },
];

export const DESTAQUES: Projeto[] = ['quarto-cecilia', 'area-gourmet', 'suite-master', 'studio-pilates', 'barbearia'].map(
  (id) => {
    const p = PROJETOS.find((x) => x.id === id);
    if (!p) throw new Error(`Destaque inexistente: ${id}`);
    return p;
  },
);

export const DETALHES = [
  'cecilia-03.jpg', 'gourmet-01.jpg', 'lav-05.jpg', 'master-03.jpg', 'pilates-02.jpg',
  'suite2-06.jpg', 'gourmet-07.jpg', 'office-04.jpg', 'cecilia-04.jpg', 'pilates-05.jpg',
].map((nome) => {
  const img = foto(nome);
  return { img, nome: PROJETOS.find((p) => p.fotos.includes(img))?.nome ?? '' };
});

export const HERO = { img: foto('gourmet-03.jpg'), posicao: '50% 50%' };

export const contagemFotos = (p: Projeto) =>
  `${p.fotos.length} ${p.fotos.length > 1 ? 'imagens' : 'imagem'}`;
