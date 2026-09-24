import type { ArchiveEntry, ArchiveKind, ArchiveRepository } from './types'
import { safeStorage } from '@/core/storage/safeStorage'

const KEY = 'zamasu:hira-archive:v1'

function readAll(): ArchiveEntry[] {
  try {
    const raw = safeStorage('local').getItem(KEY)
    return raw ? (JSON.parse(raw) as ArchiveEntry[]) : []
  } catch {
    return []
  }
}

function writeAll(entries: ArchiveEntry[]) {
  safeStorage('local').setItem(KEY, JSON.stringify(entries))
}

/** Implementação local do arquivo. Suficiente até existir backend. */
export const localArchiveRepository: ArchiveRepository = {
  async list<K extends ArchiveKind>(kind?: K) {
    const all = readAll()
    return (kind ? all.filter((e) => e.kind === kind) : all) as Extract<ArchiveEntry, { kind: K }>[]
  },
  async get(id) {
    return readAll().find((e) => e.id === id) ?? null
  },
  async save(entry) {
    const all = readAll()
    const i = all.findIndex((e) => e.id === entry.id)
    const next = { ...entry, updatedAt: new Date().toISOString() }
    if (i >= 0) all[i] = next
    else all.push(next)
    writeAll(all)
  },
  async remove(id) {
    writeAll(readAll().filter((e) => e.id !== id))
  },
}
