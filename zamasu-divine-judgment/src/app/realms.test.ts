import { describe, expect, it } from 'vitest'
import { realmById, REALMS } from './realms'

describe('Registro de reinos', () => {
  it('ids e rotas são únicos', () => {
    expect(new Set(REALMS.map((r) => r.id)).size).toBe(REALMS.length)
    expect(new Set(REALMS.map((r) => r.path)).size).toBe(REALMS.length)
  })

  it('todas as rotas são absolutas', () => {
    for (const r of REALMS) expect(r.path.startsWith('/')).toBe(true)
  })

  it('reinos abertos pertencem à fase 1 e selados a fases futuras', () => {
    for (const r of REALMS) {
      if (r.status === 'open') expect(r.phase).toBe(1)
      else expect(r.phase).toBeGreaterThan(1)
    }
  })

  it('realmById encontra os reinos usados pelas páginas', () => {
    for (const id of ['arena', 'tribunal', 'timelines', 'archive']) expect(realmById(id).id).toBe(id)
  })
})
