import { describe, expect, it } from 'vitest'
import { ORIGIN_CHAPTERS } from './character'
import { POWERS } from './powers'
import { CHALLENGERS, ZAMASU_BOSS } from '@/features/arena/fighters'
import { DILEMMAS } from '@/features/tribunal/dilemmas'
import { CANON_TIMELINE } from '@/features/timelines/canon'
import { POWER_EFFECTS } from '@/features/sanctuary/powers/effects'

const unique = (xs: string[]) => new Set(xs).size === xs.length

describe('Conteúdo do santuário', () => {
  it('capítulos da origem têm ids únicos e textos preenchidos', () => {
    expect(unique(ORIGIN_CHAPTERS.map((c) => c.id))).toBe(true)
    for (const c of ORIGIN_CHAPTERS) expect(c.body.length && c.inscription.length).toBeTruthy()
  })

  it('todo poder tem um efeito visual registrado', () => {
    expect(unique(POWERS.map((p) => p.id))).toBe(true)
    for (const p of POWERS) expect(POWER_EFFECTS[p.id]).toBeTypeOf('function')
  })
})

describe('Arena (dados da fase 2)', () => {
  const fighters = [ZAMASU_BOSS, ...CHALLENGERS]

  it('lutadores e habilidades têm ids únicos', () => {
    expect(unique(fighters.map((f) => f.id))).toBe(true)
    expect(unique(fighters.flatMap((f) => f.abilities.map((a) => a.id)))).toBe(true)
  })

  it('atributos ficam na escala 1–100', () => {
    for (const v of fighters.flatMap((f) => Object.values(f.stats))) {
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(100)
    }
  })

  it('nenhuma habilidade custa mais Ki do que o lutador possui', () => {
    for (const f of fighters) for (const a of f.abilities) expect(a.kiCost).toBeLessThanOrEqual(f.stats.ki)
  })

  it('traz os sete desafiantes pedidos', () => {
    expect(CHALLENGERS.map((f) => f.id).sort()).toEqual(['beerus', 'broly', 'gogeta-blue', 'gohan-beast', 'goku-ui', 'jiren', 'vegeta-be'])
  })
})

describe('Tribunal (dados da fase 3)', () => {
  it('dilemas têm ids únicos e ao menos duas escolhas', () => {
    expect(unique(DILEMMAS.map((d) => d.id))).toBe(true)
    for (const d of DILEMMAS) {
      expect(d.choices.length).toBeGreaterThanOrEqual(2)
      expect(unique(d.choices.map((c) => c.id))).toBe(true)
    }
  })

  it('disposição de cada escolha fica entre -2 e +2', () => {
    for (const c of DILEMMAS.flatMap((d) => d.choices)) {
      expect(c.disposition).toBeGreaterThanOrEqual(-2)
      expect(c.disposition).toBeLessThanOrEqual(2)
    }
  })
})

describe('Linha temporal canônica', () => {
  it('nós únicos e divergências apontam para nós existentes', () => {
    const ids = CANON_TIMELINE.nodes.map((n) => n.id)
    expect(unique(ids)).toBe(true)
    for (const n of CANON_TIMELINE.nodes) if (n.divergesFrom) expect(ids).toContain(n.divergesFrom)
  })
})
