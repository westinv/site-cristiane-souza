export const SITE = {
  nome: 'Cristiane Souza',
  nomeCompleto: 'Cristiane Souza Arquitetura e Interiores',
  subtitulo: 'Arquitetura e Interiores',
  cau: 'CAU A315284-7',
  descricao:
    'Arquitetura e interiores residenciais e comerciais. Projetos pensados para quem vai viver neles, do conceito ao detalhamento de marcenaria, luz e acabamento.',
  areaRestrita: '/login',
} as const;

export const CONTATO = {
  whatsapp: '5535998071578',
  whatsappExibicao: '(35) 99807-1578',
  email: 'arq.cristianesouza@gmail.com',
  instagram: 'cristianesouza_arquiteta',
} as const;

export const SOBRE = {
  texto:
    'Arquiteta e designer de interiores. Desenvolve projetos residenciais e comerciais, com atenção ao detalhamento de marcenaria e à identidade de cada cliente.',
  atuacao: 'Residencial e comercial',
} as const;

export const FRASE =
  'Cada projeto começa pela forma como você vive e trabalha. E termina nos detalhes de marcenaria, luz e acabamento.';

export const whatsappLink = (texto?: string) =>
  `https://wa.me/${CONTATO.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;

export const instagramLink = `https://instagram.com/${CONTATO.instagram}`;
