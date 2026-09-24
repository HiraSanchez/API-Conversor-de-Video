import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { DimensionalWipe } from './DimensionalWipe'

interface PageFrameProps {
  children: ReactNode
  /** A landing controla a própria entrada (intro), então dispensa a fenda. */
  wipe?: boolean
  className?: string
}

export function PageFrame({ children, wipe = true, className }: PageFrameProps) {
  return (
    <motion.main
      id="conteudo"
      className={`relative z-10 min-h-dvh ${className ?? ''}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 1, transition: { duration: 0.45 } }}
    >
      {wipe && <DimensionalWipe />}
      {children}
    </motion.main>
  )
}
