import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { revealUp } from '@/core/motion/easings'

interface SectionHeadingProps {
  kicker: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
}

export function SectionHeading({ kicker, title, lead, align = 'left' }: SectionHeadingProps) {
  const center = align === 'center'
  return (
    <motion.header
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-15%' }}
      className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
    >
      <motion.p variants={revealUp} custom={0} className={`hud-label flex items-center gap-3 text-form ${center ? 'justify-center' : ''}`}>
        <span className="h-px w-8 bg-current opacity-60" />
        {kicker}
        {center && <span className="h-px w-8 bg-current opacity-60" />}
      </motion.p>
      <motion.h2 variants={revealUp} custom={1} className="text-divine-gradient mt-5 font-display text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl">
        {title}
      </motion.h2>
      {lead && (
        <motion.p variants={revealUp} custom={2} className="mt-6 font-scripture text-xl leading-relaxed text-white/70 italic sm:text-2xl">
          {lead}
        </motion.p>
      )}
    </motion.header>
  )
}
