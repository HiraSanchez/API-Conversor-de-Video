// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { useTribunalStore } from './useTribunalStore'
import { DILEMMAS } from '@/features/tribunal/dilemmas'
import { createSession } from '@/features/tribunal/engine'

const state = () => useTribunalStore.getState()
const answerAll = (index = 0) => DILEMMAS.forEach((d) => state().answer(d.id, d.choices[index].id))

describe('useTribunalStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useTribunalStore.setState({
      stage: 'summons',
      session: createSession(),
      result: null,
      memory: { lastVerdict: null, lastDominantAxis: null, trials: 0, lastAt: null },
    })
  })

  it('só aceita respostas durante o julgamento', () => {
    state().answer(DILEMMAS[0].id, DILEMMAS[0].choices[0].id)
    expect(state().session.answers).toEqual({})
    state().begin()
    state().answer(DILEMMAS[0].id, DILEMMAS[0].choices[0].id)
    expect(Object.keys(state().session.answers)).toHaveLength(1)
  })

  it('não conclui com dilemas pendentes', () => {
    state().begin()
    state().answer(DILEMMAS[0].id, DILEMMAS[0].choices[0].id)
    state().conclude()
    expect(state().stage).toBe('trial')
    expect(state().result).toBeNull()
  })

  it('conclui, gera veredito e grava a memória', () => {
    state().begin()
    answerAll(0)
    state().conclude()
    expect(state().stage).toBe('verdict')
    expect(state().result?.verdict).toBeTruthy()
    expect(state().memory.trials).toBe(1)
    expect(state().memory.lastVerdict).toBe(state().result?.verdict)
    expect(state().memory.lastAt).not.toBeNull()
  })

  it('reset volta à convocação sem apagar a memória; novo julgamento soma', () => {
    state().begin()
    answerAll(0)
    state().conclude()
    state().reset()
    expect(state().stage).toBe('summons')
    expect(state().memory.trials).toBe(1)
    state().begin()
    answerAll(2)
    state().conclude()
    expect(state().memory.trials).toBe(2)
  })

  it('persiste julgamento em andamento e memória no localStorage', () => {
    state().begin()
    state().answer(DILEMMAS[0].id, DILEMMAS[0].choices[1].id)
    const saved = JSON.parse(localStorage.getItem('zamasu:tribunal') ?? '{}')
    expect(saved.state.stage).toBe('trial')
    expect(saved.state.session.answers[DILEMMAS[0].id]).toBe(DILEMMAS[0].choices[1].id)
    expect(saved.state.memory).toBeDefined()
  })
})
