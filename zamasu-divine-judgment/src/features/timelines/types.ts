/**
 * ARQUIVO DAS LINHAS TEMPORAIS — contratos (Fase 3).
 * Linhas alternativas são grafos: cada nó pode apontar para um nó-pai
 * de outra linha, criando o ponto de divergência.
 */
export interface TimelineNode {
  id: string
  era: string
  title: string
  summary: string
  /** Ponto de divergência: id do nó (possivelmente de outra linha) de onde este ramo nasce. */
  divergesFrom?: string
  tone: 'divine' | 'corrupted' | 'infinite' | 'mortal'
}

export interface Timeline {
  id: string
  name: string
  origin: 'canon' | 'custom'
  author?: string
  nodes: TimelineNode[]
}
