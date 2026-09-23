import { useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useEffect } from 'react'

/**
 * Posição normalizada do ponteiro (-1…1) suavizada por mola.
 * Em touch, usa a inclinação do aparelho quando disponível; senão fica parado.
 */
export function usePointerParallax() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 40, damping: 18, mass: 0.8 })
  const sy = useSpring(y, { stiffness: 40, damping: 18, mass: 0.8 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set((e.clientX / window.innerWidth) * 2 - 1)
      y.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      x.set(Math.max(-1, Math.min(1, e.gamma / 30)))
      y.set(Math.max(-1, Math.min(1, (e.beta - 45) / 30)))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('deviceorientation', onTilt, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onTilt)
    }
  }, [x, y])

  return { x: sx, y: sy }
}

/** Deriva um deslocamento em px para uma camada com a profundidade dada. */
export function useDepth(value: MotionValue<number>, depth: number) {
  return useTransform(value, (v) => v * depth)
}
