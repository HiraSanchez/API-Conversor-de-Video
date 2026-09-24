import type { Dilemma, MoralAxis, TribunalSession, Verdict, VerdictResult } from './types'

/**
 * Regras do Tribunal — funções puras, sem React, fáceis de testar.
 */

export const AXES: MoralAxis[] = ['order', 'mercy', 'purity', 'freedom']

export const AXIS_LABELS: Record<MoralAxis, string> = {
  order: 'Ordem',
  mercy: 'Misericórdia',
  purity: 'Pureza',
  freedom: 'Liberdade',
}

/** Limiares de disposição total (7 dilemas × −2…+2 → −14…+14). */
export const VERDICT_THRESHOLDS = { worthy: 6, tolerated: 1, mortal: -4 } as const

export function createSession(): TribunalSession {
  return { answers: {}, axes: { order: 0, mercy: 0, purity: 0, freedom: 0 }, disposition: 0 }
}

/** Registra uma resposta. Responder de novo o mesmo dilema não soma duas vezes. */
export function applyChoice(session: TribunalSession, dilemma: Dilemma, choiceId: string): TribunalSession {
  if (session.answers[dilemma.id]) return session
  const choice = dilemma.choices.find((c) => c.id === choiceId)
  if (!choice) throw new Error(`Escolha desconhecida: ${dilemma.id}/${choiceId}`)
  const axes = { ...session.axes }
  for (const axis of AXES) axes[axis] += choice.shifts[axis] ?? 0
  return {
    answers: { ...session.answers, [dilemma.id]: choiceId },
    axes,
    disposition: session.disposition + choice.disposition,
  }
}

export function verdictFor(disposition: number): Verdict {
  if (disposition >= VERDICT_THRESHOLDS.worthy) return 'worthy'
  if (disposition >= VERDICT_THRESHOLDS.tolerated) return 'tolerated'
  if (disposition >= VERDICT_THRESHOLDS.mortal) return 'mortal'
  return 'condemned'
}

/** Eixo mais forte; empate resolvido pela ordem de AXES (ordem > misericórdia > pureza > liberdade). */
export function dominantAxis(axes: Record<MoralAxis, number>): MoralAxis {
  return AXES.reduce((best, axis) => (axes[axis] > axes[best] ? axis : best), AXES[0])
}

export function judge(session: TribunalSession): VerdictResult {
  return {
    verdict: verdictFor(session.disposition),
    dominantAxis: dominantAxis(session.axes),
    disposition: session.disposition,
    axes: session.axes,
  }
}

/** Índice do próximo dilema sem resposta (ou `dilemmas.length` se todos foram respondidos). */
export function nextIndex(session: TribunalSession, dilemmas: Dilemma[]): number {
  const i = dilemmas.findIndex((d) => !session.answers[d.id])
  return i === -1 ? dilemmas.length : i
}
