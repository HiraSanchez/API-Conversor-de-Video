import { useEffect, useRef, useState } from 'react'
import { divineEvents } from '@/core/events/divineEvents'
import { useAtmosphereStore } from '@/store/useAtmosphereStore'

/**
 * Coreografia da abertura, em fases:
 * 0 vazio → 1 fragmentos → 2 potara → 3 dimensão → 4 silhueta → 5 aura → 6 revelação
 */
export const INTRO_PHASES = ['void', 'fragments', 'potara', 'dimension', 'silhouette', 'aura', 'revelation'] as const
export type IntroPhase = (typeof INTRO_PHASES)[number]

const SCHEDULE: { phase: IntroPhase; at: number; intensity: number }[] = [
  { phase: 'void', at: 0, intensity: 0 },
  { phase: 'fragments', at: 700, intensity: 0.08 },
  { phase: 'potara', at: 2000, intensity: 0.15 },
  { phase: 'dimension', at: 3700, intensity: 0.45 },
  { phase: 'silhouette', at: 5000, intensity: 0.65 },
  { phase: 'aura', at: 6300, intensity: 1 },
  { phase: 'revelation', at: 7200, intensity: 1 },
]

export const phaseIndex = (p: IntroPhase) => INTRO_PHASES.indexOf(p)

export function useIntroTimeline(skip: boolean, onComplete: () => void) {
  const [phase, setPhase] = useState<IntroPhase>(skip ? 'revelation' : 'void')
  const setIntensity = useAtmosphereStore((s) => s.setIntensity)
  const timers = useRef<number[]>([])
  const completeRef = useRef(onComplete)
  useEffect(() => {
    completeRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (skip) {
      setIntensity(1)
      return
    }
    for (const step of SCHEDULE) {
      timers.current.push(
        window.setTimeout(() => {
          setPhase(step.phase)
          setIntensity(step.intensity)
          if (step.phase === 'aura') {
            divineEvents.emit({ type: 'flash', intensity: 0.55 })
            divineEvents.emit({ type: 'shockwave' })
            divineEvents.emit({ type: 'burst', count: 120 })
            divineEvents.emit({ type: 'quake', intensity: 0.8 })
          }
        }, step.at),
      )
    }
    timers.current.push(window.setTimeout(() => completeRef.current(), 8000))
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
      timers.current = []
    }
  }, [skip, setIntensity])

  const skipNow = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase('revelation')
    setIntensity(1)
    completeRef.current()
  }

  return { phase, at: phaseIndex(phase), skipNow }
}
