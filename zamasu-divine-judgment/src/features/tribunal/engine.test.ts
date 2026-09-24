import { describe, expect, it } from 'vitest'
import { DILEMMAS } from './dilemmas'
import { AXES, applyChoice, createSession, dominantAxis, judge, nextIndex, verdictFor } from './engine'
import type { Dilemma, TribunalSession } from './types'
import { AXIS_READINGS, RETURN_GREETINGS, VERDICTS } from './verdicts'

/** Responde todos os dilemas escolhendo, em cada um, a opção indicada pelo seletor. */
function playThrough(pick: (d: Dilemma) => string): TribunalSession {
  return DILEMMAS.reduce((s, d) => applyChoice(s, d, pick(d)), createSession())
}
const best = (d: Dilemma) => [...d.choices].sort((a, b) => b.disposition - a.disposition)[0].id
const worst = (d: Dilemma) => [...d.choices].sort((a, b) => a.disposition - b.disposition)[0].id

describe('Tribunal — dados', () => {
  it('tem 7 dilemas com ids únicos e 3 escolhas cada', () => {
    expect(DILEMMAS).toHaveLength(7)
    expect(new Set(DILEMMAS.map((d) => d.id)).size).toBe(7)
    for (const d of DILEMMAS) {
      expect(d.choices).toHaveLength(3)
      expect(new Set(d.choices.map((c) => c.id)).size).toBe(3)
    }
  })

  it('disposição e deslocamentos ficam em faixas controladas', () => {
    for (const c of DILEMMAS.flatMap((d) => d.choices)) {
      expect(c.disposition).toBeGreaterThanOrEqual(-2)
      expect(c.disposition).toBeLessThanOrEqual(2)
      for (const v of Object.values(c.shifts)) expect(Math.abs(v ?? 0)).toBeLessThanOrEqual(3)
      expect(c.response.length).toBeGreaterThan(0)
    }
  })

  it('todo veredito e todo eixo têm texto', () => {
    for (const v of ['worthy', 'tolerated', 'mortal', 'condemned'] as const) {
      expect(VERDICTS[v].sentence).toBeTruthy()
      expect(RETURN_GREETINGS[v]).toBeTruthy()
    }
    for (const a of AXES) expect(AXIS_READINGS[a]).toBeTruthy()
  })
})

describe('Tribunal — regras', () => {
  it('soma disposição e eixos a cada resposta', () => {
    const d = DILEMMAS[0]
    const s = applyChoice(createSession(), d, 'erase')
    expect(s.disposition).toBe(2)
    expect(s.axes).toEqual({ order: 2, mercy: -2, purity: 2, freedom: 0 })
    expect(s.answers).toEqual({ [d.id]: 'erase' })
  })

  it('não conta o mesmo dilema duas vezes', () => {
    const d = DILEMMAS[0]
    const once = applyChoice(createSession(), d, 'erase')
    const twice = applyChoice(once, d, 'trust')
    expect(twice).toBe(once)
  })

  it('rejeita escolha inexistente', () => {
    expect(() => applyChoice(createSession(), DILEMMAS[0], 'nao-existe')).toThrow()
  })

  it('não altera a sessão original (imutável)', () => {
    const s0 = createSession()
    applyChoice(s0, DILEMMAS[0], 'erase')
    expect(s0.disposition).toBe(0)
    expect(s0.answers).toEqual({})
  })

  it.each([
    [13, 'worthy'],
    [6, 'worthy'],
    [5, 'tolerated'],
    [1, 'tolerated'],
    [0, 'mortal'],
    [-4, 'mortal'],
    [-5, 'condemned'],
    [-12, 'condemned'],
  ] as const)('disposição %i → %s', (disp, verdict) => {
    expect(verdictFor(disp)).toBe(verdict)
  })

  it('os quatro vereditos são alcançáveis com os dilemas reais', () => {
    expect(judge(playThrough(best)).verdict).toBe('worthy')
    expect(judge(playThrough(worst)).verdict).toBe('condemned')
    // Escolha do meio (disposição mediana) em todos.
    const middle = (d: Dilemma) => [...d.choices].sort((a, b) => a.disposition - b.disposition)[1].id
    expect(['mortal', 'tolerated']).toContain(judge(playThrough(middle)).verdict)
    // Mistura: melhores nos 4 primeiros, medianos no resto → cai no meio da escala.
    const mixed = (d: Dilemma) => (DILEMMAS.indexOf(d) < 4 ? best(d) : middle(d))
    expect(judge(playThrough(mixed)).verdict).toBe('tolerated')
  })

  it('eixo dominante desempata pela ordem fixa dos eixos', () => {
    expect(dominantAxis({ order: 1, mercy: 3, purity: 3, freedom: 0 })).toBe('mercy')
    expect(dominantAxis({ order: 0, mercy: 0, purity: 0, freedom: 0 })).toBe('order')
  })

  it('nextIndex aponta o próximo dilema sem resposta', () => {
    let s = createSession()
    expect(nextIndex(s, DILEMMAS)).toBe(0)
    s = applyChoice(s, DILEMMAS[0], DILEMMAS[0].choices[0].id)
    expect(nextIndex(s, DILEMMAS)).toBe(1)
    expect(nextIndex(playThrough(best), DILEMMAS)).toBe(DILEMMAS.length)
  })
})
