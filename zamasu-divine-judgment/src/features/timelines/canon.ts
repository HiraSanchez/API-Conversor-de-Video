import type { Timeline } from './types'

/** Linha canônica resumida. Linhas criadas pelo usuário virão do Hira's Archive. */
export const CANON_TIMELINE: Timeline = {
  id: 'canon',
  name: 'Linha Canônica',
  origin: 'canon',
  nodes: [
    { id: 'u10', era: 'Universo 10', title: 'Universo 10', summary: 'O Mundo Sagrado dos Kaioshins. Gowasu governa; Zamasu aprende — e observa.', tone: 'divine' },
    { id: 'zamasu', era: 'Aprendizado', title: 'Zamasu', summary: 'O aprendiz conclui que os mortais são o defeito da criação.', tone: 'divine' },
    { id: 'black', era: 'Troca de corpos', title: 'Goku Black', summary: 'As Super Esferas do Dragão entregam a Zamasu o corpo de Son Goku.', tone: 'corrupted' },
    { id: 'ruin', era: 'Futuro de Trunks', title: 'Futuro destruído', summary: 'O Projeto Zero Humanos transforma a Terra do futuro em ruína.', tone: 'mortal' },
    { id: 'fusion', era: 'Potara', title: 'Fusão', summary: 'Zamasu e Black se tornam um. A imortalidade imperfeita começa a apodrecer.', tone: 'corrupted' },
    { id: 'final', era: 'Fim da linha', title: 'Batalha final', summary: 'Zamasu se funde ao universo. Zen-Oh do futuro apaga a linha temporal inteira.', tone: 'infinite' },
  ],
}
