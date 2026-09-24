import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { FORM_ORDER, type FormId } from '@/core/forms/forms'
import { safeStorage } from '@/core/storage/safeStorage'

interface FormState {
  form: FormId
  /** Incrementa a cada troca — usado para disparar transições pontuais. */
  shiftCount: number
  setForm: (form: FormId) => void
  cycleForm: () => void
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      form: 'divine',
      shiftCount: 0,
      setForm: (form) => {
        if (form === get().form) return
        set((s) => ({ form, shiftCount: s.shiftCount + 1 }))
      },
      cycleForm: () => {
        const next = FORM_ORDER[(FORM_ORDER.indexOf(get().form) + 1) % FORM_ORDER.length]
        get().setForm(next)
      },
    }),
    {
      name: 'zamasu:form',
      storage: createJSONStorage(() => safeStorage('local')),
      partialize: (s) => ({ form: s.form }),
    },
  ),
)
