import type { CombatStats } from '@/features/arena/types'
import type { Timeline } from '@/features/timelines/types'

/**
 * HIRA'S ARCHIVE — modelo de dados (Fase 4).
 * Tudo que o observador registra é uma `ArchiveEntry` versionada.
 */
interface BaseEntry {
  id: string
  createdAt: string
  updatedAt: string
  schemaVersion: 1
}

export interface CustomCharacterEntry extends BaseEntry {
  kind: 'character'
  name: string
  title: string
  color: string
  stats: CombatStats
  lore: string
}

export interface SavedBattleEntry extends BaseEntry {
  kind: 'battle'
  playerId: string
  opponentId: string
  winner: 'player' | 'opponent'
  turns: number
  log: string[]
}

export interface TimelineEntry extends BaseEntry {
  kind: 'timeline'
  timeline: Timeline
}

export interface CreationEntry extends BaseEntry {
  kind: 'creation'
  title: string
  body: string
  tags: string[]
}

export type ArchiveEntry = CustomCharacterEntry | SavedBattleEntry | TimelineEntry | CreationEntry
export type ArchiveKind = ArchiveEntry['kind']

/**
 * Repositório abstrato: a UI nunca fala com o storage direto.
 * Hoje: localStorage. Amanhã: API/Supabase — basta outra implementação.
 */
export interface ArchiveRepository {
  list<K extends ArchiveKind>(kind?: K): Promise<Extract<ArchiveEntry, { kind: K }>[]>
  get(id: string): Promise<ArchiveEntry | null>
  save(entry: ArchiveEntry): Promise<void>
  remove(id: string): Promise<void>
}
