import type { Transition, Variants } from 'framer-motion'

/** Curvas da identidade: tudo desacelera como se obedecesse a uma vontade superior. */
export const EASE_DIVINE = [0.16, 1, 0.3, 1] as const
export const EASE_JUDGMENT = [0.7, 0, 0.2, 1] as const
export const EASE_SURGE = [0.5, 0, 0, 1] as const

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: EASE_DIVINE, delay: i * 0.12 },
  }),
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({ opacity: 1, transition: { duration: 1.2, ease: EASE_DIVINE, delay: i * 0.1 } }),
}

export const stagger = (staggerChildren = 0.1, delayChildren = 0): Transition => ({
  staggerChildren,
  delayChildren,
})
