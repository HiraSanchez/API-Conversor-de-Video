import { motion } from 'framer-motion'
import { EASE_JUDGMENT } from '@/core/motion/easings'

/**
 * Transição entre reinos: uma fenda de luz corta a tela na horizontal.
 * Renderizado dentro de cada página (via PageFrame) para acompanhar o AnimatePresence.
 */
export function DimensionalWipe() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-1/2 z-[70] h-px origin-center"
        style={{ background: 'linear-gradient(90deg, transparent, var(--form-accent), var(--form-primary), var(--form-accent), transparent)', boxShadow: '0 0 30px 6px var(--form-glow)' }}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0], transition: { duration: 0.9, times: [0, 0.5, 1], ease: EASE_JUDGMENT } }}
        exit={{ scaleX: 1, opacity: 1, transition: { duration: 0.35, ease: EASE_JUDGMENT } }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[69] bg-void"
        initial={{ clipPath: 'inset(0% 0 0% 0)' }}
        animate={{ clipPath: 'inset(50% 0 50% 0)', transition: { duration: 0.8, delay: 0.25, ease: EASE_JUDGMENT } }}
        exit={{ clipPath: 'inset(0% 0 0% 0)', transition: { duration: 0.45, ease: EASE_JUDGMENT } }}
      />
    </>
  )
}
