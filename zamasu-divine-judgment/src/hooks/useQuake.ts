import { useAnimationControls } from 'framer-motion'
import { useEffect } from 'react'
import { divineEvents } from '@/core/events/divineEvents'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/** Tremor de tela em resposta a eventos `quake`. Retorna controles para um motion.div. */
export function useQuake() {
  const controls = useAnimationControls()
  const reduced = usePrefersReducedMotion()

  useEffect(
    () =>
      divineEvents.subscribe((e) => {
        if (e.type !== 'quake' || reduced) return
        const k = 6 * (e.intensity ?? 1)
        void controls.start({
          x: [0, -k, k * 0.8, -k * 0.6, k * 0.4, -k * 0.2, 0],
          y: [0, k * 0.5, -k * 0.4, k * 0.3, -k * 0.2, 0, 0],
          transition: { duration: 0.55, ease: 'easeOut' },
        })
      }),
    [controls, reduced],
  )

  return controls
}
