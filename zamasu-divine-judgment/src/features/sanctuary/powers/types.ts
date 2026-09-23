export interface EffectProps {
  /** Contador de invocações; 0 = estado de repouso. Cada incremento reexecuta o efeito. */
  play: number
}
