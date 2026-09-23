/**
 * TRIBUNAL DIVINO — contratos narrativos (Fase 3).
 *
 * Cada escolha move o visitante em quatro eixos morais. Zamasu reage à
 * direção acumulada, não a respostas isoladas: a mesma frase pode soar
 * como aprovação ou ameaça dependendo de quem você já provou ser.
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
  answers: Record<string, string>
  axes: Record<MoralAxis, number>
  disposition: number
  verdict: Verdict | null
}
