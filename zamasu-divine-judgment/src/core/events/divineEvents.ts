/**
 * Barramento de eventos da atmosfera.
 *
 * Qualquer feature (poderes, arena, tribunal) pode fazer o "mundo reagir"
 * sem conhecer os componentes de atmosfera — basta emitir um evento.
 */
export type DivineEvent =
  | { type: 'burst'; x?: number; y?: number; color?: string; count?: number }
  | { type: 'shockwave'; x?: number; y?: number; color?: string }
  | { type: 'flash'; color?: string; intensity?: number }
  | { type: 'quake'; intensity?: number }

type Listener = (event: DivineEvent) => void

const listeners = new Set<Listener>()

export const divineEvents = {
  emit(event: DivineEvent) {
    listeners.forEach((l) => l(event))
  },
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => void listeners.delete(listener)
  },
}
