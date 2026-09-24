import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { safeStorage } from '@/core/storage/safeStorage'
import { DILEMMAS } from '@/features/tribunal/dilemmas'
import { applyChoice, createSession, judge, nextIndex } from '@/features/tribunal/engine'
import type { TribunalMemory, TribunalSession, VerdictResult } from '@/features/tribunal/types'

type Stage = 'summons' | 'trial' | 'verdict'

interface TribunalState {
  stage: Stage
  session: TribunalSession
  result: VerdictResult | null
  /** Memória entre visitas: o Zamasu "lembra" de você. */
  memory: TribunalMemory
  begin: () => void
  answer: (dilemmaId: string, choiceId: string) => void
  /** Encerra o julgamento se todos os dilemas foram respondidos. */
  conclude: () => void
  /** Volta à convocação mantendo a memória. */
  reset: () => void
}

const emptyMemory: TribunalMemory = { lastVerdict: null, lastDominantAxis: null, trials: 0, lastAt: null }

export const useTribunalStore = create<TribunalState>()(
  persist(
    (set, get) => ({
      stage: 'summons',
      session: createSession(),
      result: null,
      memory: emptyMemory,
      begin: () => set({ stage: 'trial', session: createSession(), result: null }),
      answer: (dilemmaId, choiceId) => {
        const dilemma = DILEMMAS.find((d) => d.id === dilemmaId)
        if (!dilemma || get().stage !== 'trial') return
        set((s) => ({ session: applyChoice(s.session, dilemma, choiceId) }))
      },
      conclude: () => {
        const { session, memory } = get()
        if (nextIndex(session, DILEMMAS) < DILEMMAS.length) return
        const result = judge(session)
        set({
          stage: 'verdict',
          result,
          memory: {
            lastVerdict: result.verdict,
            lastDominantAxis: result.dominantAxis,
            trials: memory.trials + 1,
            lastAt: new Date().toISOString(),
          },
        })
      },
      reset: () => set({ stage: 'summons', session: createSession(), result: null }),
    }),
    {
      name: 'zamasu:tribunal',
      version: 1,
      storage: createJSONStorage(() => safeStorage('local')),
      // Julgamento em andamento sobrevive a um recarregar; a memória, a visitas futuras.
      partialize: (s) => ({ stage: s.stage, session: s.session, result: s.result, memory: s.memory }),
    },
  ),
)
