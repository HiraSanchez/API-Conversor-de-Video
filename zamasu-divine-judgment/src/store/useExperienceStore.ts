import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { safeStorage } from '@/core/storage/safeStorage'

/** Estado da jornada do visitante. A intro roda uma vez por sessão do navegador. */
interface ExperienceState {
  introDone: boolean
  completeIntro: () => void
  replayIntro: () => void
}

export const useExperienceStore = create<ExperienceState>()(
  persist(
    (set) => ({
      introDone: false,
      completeIntro: () => set({ introDone: true }),
      replayIntro: () => set({ introDone: false }),
    }),
    { name: 'zamasu:experience', storage: createJSONStorage(() => safeStorage('session')) },
  ),
)
