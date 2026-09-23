// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { localArchiveRepository as repo } from './localArchiveRepository'
import type { CreationEntry } from './types'

const creation = (id: string, title = 'Fragmento'): CreationEntry => ({
  id,
  kind: 'creation',
  title,
  body: 'Texto',
  tags: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  schemaVersion: 1,
})

describe("Hira's Archive — repositório local", () => {
  beforeEach(() => localStorage.clear())

  it('salva, lista e busca por id', async () => {
    await repo.save(creation('a'))
    expect(await repo.list()).toHaveLength(1)
    expect((await repo.get('a'))?.id).toBe('a')
    expect(await repo.get('inexistente')).toBeNull()
  })

  it('atualiza no lugar em vez de duplicar e renova updatedAt', async () => {
    await repo.save(creation('a', 'v1'))
    await repo.save(creation('a', 'v2'))
    const all = await repo.list('creation')
    expect(all).toHaveLength(1)
    expect(all[0].title).toBe('v2')
    expect(all[0].updatedAt).not.toBe('2026-01-01T00:00:00.000Z')
  })

  it('filtra por tipo e remove', async () => {
    await repo.save(creation('a'))
    await repo.save(creation('b'))
    expect(await repo.list('battle')).toHaveLength(0)
    await repo.remove('a')
    expect((await repo.list()).map((e) => e.id)).toEqual(['b'])
  })

  it('não quebra com dado corrompido no storage', async () => {
    localStorage.setItem('zamasu:hira-archive:v1', '{json inválido')
    expect(await repo.list()).toEqual([])
  })
})
