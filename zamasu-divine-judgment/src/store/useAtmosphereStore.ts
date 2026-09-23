import { create } from 'zustand'

/**
 * Estado da "dimensão" compartilhado entre páginas e a camada de atmosfera.
 * A intro, por exemplo, controla `intensity` para o universo nascer do vazio.
 */
interface AtmosphereState {
  /** 0–1: densidade de partículas e presença da aura. */
  intensity: number
  /** Ponto focal (0–1) — onde a entidade "está" na tela. */
  focus: { x: number; y: number }
  setIntensity: (value: number) => void
  setFocus: (x: number, y: number) => void
}

export const useAtmosphereStore = create<AtmosphereState>()((set) => ({
  intensity: 1,
  focus: { x: 0.5, y: 0.45 },
  setIntensity: (intensity) => set({ intensity }),
  setFocus: (x, y) => set({ focus: { x, y } }),
}))
