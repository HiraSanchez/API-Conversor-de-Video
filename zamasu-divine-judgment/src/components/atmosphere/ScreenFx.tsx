import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useState } from 'react'
import { divineEvents } from '@/core/events/divineEvents'

/**
 * Efeitos de tela cheia disparados por eventos (clarão).
 * O tremor é aplicado no Shell via `useQuake`.
 */
export function ScreenFx() {
  const controls = useAnimationControls()
  const [color, setColor] = useState('#ffffff')

  useEffect(
    () =>
      divineEvents.subscribe((e) => {
        if (e.type !== 'flash') return
        setColor(e.color ?? '#ffffff')
        void controls.start({
          opacity: [0, e.intensity ?? 0.6, 0],
          transition: { duration: 0.9, times: [0, 0.08, 1], ease: 'easeOut' },
        })
      }),
    [controls],
  )

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-screen"
      style={{ background: `radial-gradient(circle at 50% 45%, ${color}, transparent 75%)` }}
      initial={{ opacity: 0 }}
      animate={controls}
    />
  )
}
