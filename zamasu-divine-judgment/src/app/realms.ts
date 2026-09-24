/**
 * Registro dos "reinos" (rotas) do santuário.
 * Adicionar um novo módulo = uma entrada aqui + um componente lazy em router.tsx.
 */
export type RealmStatus = 'open' | 'sealed'

export interface Realm {
  id: string
  path: string
  label: string
  glyph: string
  status: RealmStatus
  summary: string
  /** Em que fase do roadmap o selo se rompe. */
  phase: number
}

export const REALMS: Realm[] = [
  { id: 'gate', path: '/', label: 'O Portal', glyph: '◈', status: 'open', phase: 1, summary: 'Onde a dimensão nasce.' },
  { id: 'sanctuary', path: '/santuario', label: 'Santuário Divino', glyph: '✦', status: 'open', phase: 1, summary: 'Origem, formas e poderes da divindade.' },
  { id: 'arena', path: '/arena', label: 'Arena Divina', glyph: '⚔', status: 'sealed', phase: 2, summary: 'Batalhas estratégicas contra a divindade.' },
  { id: 'tribunal', path: '/tribunal', label: 'Tribunal Divino', glyph: '⚖', status: 'sealed', phase: 3, summary: 'Dilemas de justiça. Zamasu julga as suas respostas.' },
  { id: 'timelines', path: '/linhas-temporais', label: 'Arquivo das Linhas Temporais', glyph: '⌬', status: 'sealed', phase: 3, summary: 'A história — e as histórias que poderiam ter sido.' },
  { id: 'archive', path: '/arquivo-hira', label: "Hira's Archive", glyph: '◉', status: 'sealed', phase: 4, summary: 'O registro do observador das realidades.' },
]

export const realmById = (id: string) => REALMS.find((r) => r.id === id)!
