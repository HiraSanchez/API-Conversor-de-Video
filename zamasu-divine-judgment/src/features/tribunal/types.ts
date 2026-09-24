/**
 * TRIBUNAL DIVINO — contratos narrativos.
 *
 * Cada escolha move o visitante em quatro eixos morais e muda a
 * "disposição" de Zamasu (quanto ele reconhece ou despreza você).
 * O veredito sai do conjunto das respostas, não de uma resposta isolada.
 */
export type MoralAxis = 'order' | 'mercy' | 'purity' | 'freedom'

export interface DilemmaChoice {
  id: string
  text: string
  shifts: Partial<Record<MoralAxis, number>>
  /** -2 (desprezo) … +2 (reconhecimento). */
  disposition: number
  /** Resposta imediata de Zamasu. */
  response: string
}

export interface Dilemma {
  id: string
  title: string
  prompt: string
  choices: DilemmaChoice[]
}

export type Verdict = 'worthy' | 'tolerated' | 'mortal' | 'condemned'

export interface TribunalSession {
  /** dilemmaId → choiceId, na ordem em que foram respondidos. */
  answers: Record<string, string>
  axes: Record<MoralAxis, number>
  disposition: number
}

export interface VerdictResult {
  verdict: Verdict
  dominantAxis: MoralAxis
  disposition: number
  axes: Record<MoralAxis, number>
}

/** O que o Tribunal lembra entre visitas. */
export interface TribunalMemory {
  lastVerdict: Verdict | null
  lastDominantAxis: MoralAxis | null
  trials: number
  lastAt: string | null
}
