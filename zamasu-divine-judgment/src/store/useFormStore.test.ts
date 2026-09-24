// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { useFormStore } from './useFormStore'

describe('useFormStore', () => {
  beforeEach(() => useFormStore.setState({ form: 'divine', shiftCount: 0 }))

  it('cicla divina → corrompida → infinita → divina', () => {
    const { cycleForm } = useFormStore.getState()
    cycleForm()
    expect(useFormStore.getState().form).toBe('corrupted')
    cycleForm()
    expect(useFormStore.getState().form).toBe('infinite')
    cycleForm()
    expect(useFormStore.getState().form).toBe('divine')
  })

  it('ignora troca para a forma atual (sem disparar transição)', () => {
    useFormStore.getState().setForm('divine')
    expect(useFormStore.getState().shiftCount).toBe(0)
    useFormStore.getState().setForm('infinite')
    expect(useFormStore.getState().shiftCount).toBe(1)
  })

  it('persiste apenas a forma no localStorage', () => {
    useFormStore.getState().setForm('corrupted')
    const saved = JSON.parse(localStorage.getItem('zamasu:form') ?? '{}')
    expect(saved.state).toEqual({ form: 'corrupted' })
  })
})
