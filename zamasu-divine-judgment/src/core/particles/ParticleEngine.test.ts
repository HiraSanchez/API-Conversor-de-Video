import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FORMS } from '@/core/forms/forms'
import { ParticleEngine } from './ParticleEngine'

/** Contexto 2D falso: o motor só precisa que os métodos existam. */
function fakeCanvas() {
  const noop = () => {}
  const ctx = new Proxy(
    { createRadialGradient: () => ({ addColorStop: noop }) },
    { get: (target, key) => (key in target ? target[key as keyof typeof target] : noop), set: () => true },
  )
  return { width: 0, height: 0, getContext: () => ctx } as unknown as HTMLCanvasElement
}

// Acesso aos internos só para inspecionar estado nos testes.
type Internals = { particles: { kind: string }[]; rings: unknown[]; update: (dt: number) => void; draw: () => void }
const internals = (e: ParticleEngine) => e as unknown as Internals
const ambient = (e: ParticleEngine) => internals(e).particles.filter((p) => p.kind === 'ambient').length

describe('ParticleEngine', () => {
  beforeEach(() => {
    vi.stubGlobal('window', { innerWidth: 1000, innerHeight: 800, devicePixelRatio: 2 })
    vi.stubGlobal('document', { createElement: () => fakeCanvas() })
  })
  afterEach(() => vi.unstubAllGlobals())

  it('lança erro claro quando não há Canvas 2D', () => {
    const canvas = { getContext: () => null } as unknown as HTMLCanvasElement
    expect(() => new ParticleEngine(canvas, FORMS.divine.particles)).toThrow('Canvas 2D')
  })

  it('limita o devicePixelRatio a 1.5 para poupar GPU', () => {
    const canvas = fakeCanvas()
    new ParticleEngine(canvas, FORMS.divine.particles)
    expect(canvas.width).toBe(1500)
    expect(canvas.height).toBe(1200)
  })

  it('intensidade 0 mantém o vazio absoluto (intro)', () => {
    const engine = new ParticleEngine(fakeCanvas(), FORMS.divine.particles)
    engine.setIntensity(0)
    for (let i = 0; i < 120; i++) internals(engine).update(1)
    expect(ambient(engine)).toBe(0)
  })

  it('popula aos poucos até a densidade alvo, sem estourar o máximo', () => {
    const profile = FORMS.infinite.particles
    const engine = new ParticleEngine(fakeCanvas(), profile)
    internals(engine).update(1)
    expect(ambient(engine)).toBeLessThanOrEqual(4) // nasce gradualmente, não de uma vez
    for (let i = 0; i < 400; i++) internals(engine).update(1)
    const count = ambient(engine)
    expect(count).toBeGreaterThan(40)
    expect(count).toBeLessThanOrEqual(profile.max)
  })

  it('reduz a população quando a intensidade cai', () => {
    const engine = new ParticleEngine(fakeCanvas(), FORMS.corrupted.particles)
    for (let i = 0; i < 400; i++) internals(engine).update(1)
    const full = ambient(engine)
    engine.setIntensity(0.25)
    for (let i = 0; i < 800; i++) internals(engine).update(1)
    expect(ambient(engine)).toBeLessThan(full)
  })

  it('reduced motion diminui a densidade', () => {
    const normal = new ParticleEngine(fakeCanvas(), FORMS.divine.particles)
    const reduced = new ParticleEngine(fakeCanvas(), FORMS.divine.particles)
    reduced.setReducedMotion(true)
    for (let i = 0; i < 400; i++) {
      internals(normal).update(1)
      internals(reduced).update(1)
    }
    expect(ambient(reduced)).toBeLessThan(ambient(normal))
  })

  it('explosões e ondas de choque expiram sozinhas', () => {
    const engine = new ParticleEngine(fakeCanvas(), FORMS.divine.particles)
    engine.setIntensity(0)
    engine.burst({ count: 50 })
    engine.shockwave()
    expect(internals(engine).particles.length).toBe(50)
    expect(internals(engine).rings.length).toBe(1)
    for (let i = 0; i < 200; i++) internals(engine).update(1)
    expect(internals(engine).particles.length).toBe(0)
    expect(internals(engine).rings.length).toBe(0)
  })

  it('troca de perfil e desenho não lançam erro em nenhuma forma', () => {
    const engine = new ParticleEngine(fakeCanvas(), FORMS.divine.particles)
    for (const form of Object.values(FORMS)) {
      engine.setProfile(form.particles)
      engine.burst()
      for (let i = 0; i < 150; i++) {
        internals(engine).update(1)
        internals(engine).draw()
      }
    }
    expect(ambient(engine)).toBeGreaterThan(0)
  })
})
