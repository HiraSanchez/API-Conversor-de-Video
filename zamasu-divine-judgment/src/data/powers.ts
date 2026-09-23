export type PowerId = 'blade' | 'regeneration' | 'wrath' | 'corruption'

export interface Power {
  id: PowerId
  index: string
  name: string
  classification: string
  range: string
  nature: string
  description: string
  /** Frase exibida quando a habilidade é invocada. */
  invocation: string
  /** Cor dominante do efeito (usada nos eventos da atmosfera). */
  color: string
}

export const POWERS: Power[] = [
  {
    id: 'blade',
    index: '01',
    name: 'Lâmina de Luz Divina',
    classification: 'Ofensiva · Corte',
    range: 'Curto → Dimensional',
    nature: 'Ki condensado',
    description:
      'O ki é comprimido até virar uma lâmina de luz que se estende da mão. Não há guarda ou escudo que a detenha: o corte atravessa matéria, energia e o próprio espaço.',
    invocation: 'Nada escapa ao fio da justiça.',
    color: '#2ee6a6',
  },
  {
    id: 'regeneration',
    index: '02',
    name: 'Regeneração Imortal',
    classification: 'Passiva · Restauração',
    range: 'Próprio corpo',
    nature: 'Imortalidade imperfeita',
    description:
      'Herança do desejo às Super Esferas do Dragão. Feridas se fecham, membros se reconstroem. Após a fusão, porém, cada regeneração deixa a carne mais instável — o preço da perfeição incompleta.',
    invocation: 'Um deus não sangra. Um deus se refaz.',
    color: '#e8c46a',
  },
  {
    id: 'wrath',
    index: '03',
    name: 'Cólera Divina',
    classification: 'Ofensiva · Área',
    range: 'Campo de batalha',
    nature: 'Julgamento celestial',
    description:
      'Colunas de luz descem do céu sobre tudo que foi considerado indigno. Não é um ataque: é uma sentença sendo executada.',
    invocation: 'Contemplem a luz que vocês nunca mereceram.',
    color: '#fff6dc',
  },
  {
    id: 'corruption',
    index: '04',
    name: 'Expansão da Corrupção',
    classification: 'Transcendência · Global',
    range: 'Universal',
    nature: 'Fusão com o cosmos',
    description:
      'A carne instável se espalha além do corpo. Veias roxas tomam o céu, a terra, o tempo. No limite, Zamasu deixa de ser alguém no universo e passa a ser o universo.',
    invocation: 'Se o mundo não se torna perfeito… eu me torno o mundo.',
    color: '#b45cff',
  },
]
