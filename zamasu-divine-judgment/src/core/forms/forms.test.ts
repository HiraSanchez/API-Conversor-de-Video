import { describe, expect, it } from 'vitest'
import { FORM_ORDER, FORMS, formToCssVars } from './forms'

const HEX6 = /^#[0-9a-f]{6}$/i

describe('Sistema de Formas', () => {
  it('ordena as formas pela propriedade order', () => {
    expect(FORM_ORDER).toEqual(['divine', 'corrupted', 'infinite'])
  })

  it.each(Object.values(FORMS))('$id: id da chave bate com o id interno', (form) => {
    expect(FORMS[form.id]).toBe(form)
  })

  it.each(Object.values(FORMS))('$id: cores de partícula são hex de 6 dígitos', (form) => {
    // O motor concatena alfa em hex (cor + '55'); rgb()/hsl()/hex curto quebrariam o sprite.
    for (const color of form.particles.colors) expect(color).toMatch(HEX6)
  })

  it.each(Object.values(FORMS))('$id: perfil de partículas dentro de limites seguros', (form) => {
    const p = form.particles
    expect(p.colors.length).toBeGreaterThan(0)
    expect(p.max).toBeGreaterThan(0)
    expect(p.max).toBeLessThanOrEqual(400)
    expect(p.trail).toBeGreaterThanOrEqual(0)
    expect(p.trail).toBeLessThan(1)
    expect(p.size[0]).toBeLessThanOrEqual(p.size[1])
    expect(form.effects.aura).toBeGreaterThanOrEqual(0)
    expect(form.effects.aura).toBeLessThanOrEqual(1)
  })

  it('gera todas as CSS vars consumidas pelo tema', () => {
    const vars = formToCssVars(FORMS.corrupted)
    expect(Object.keys(vars).sort()).toEqual(
      ['--form-accent', '--form-glow', '--form-primary', '--form-secondary', '--form-sky', '--form-sky-edge'].sort(),
    )
    expect(vars['--form-primary']).toBe(FORMS.corrupted.palette.primary)
  })
})
