import { FORMS } from '@/core/forms/forms'
import { useFormStore } from '@/store/useFormStore'

export function useActiveForm() {
  const id = useFormStore((s) => s.form)
  return FORMS[id]
}
