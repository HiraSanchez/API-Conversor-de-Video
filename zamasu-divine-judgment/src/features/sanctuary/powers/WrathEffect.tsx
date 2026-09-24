import { motion } from 'framer-motion'
import { EASE_SURGE } from '@/core/motion/easings'
import type { EffectProps } from './types'

const PILLARS = [
  { x: 18, w: 7, d: 0.1 },
  { x: 36, w: 5, d: 0.35 },
  { x: 50, w: 11, d: 0 },
  { x: 66, w: 6, d: 0.25 },
  { x: 82, w: 8, d: 0.45 },
]

/** Cólera Divina: colunas de julgamento caem do céu sobre o indigno. */
export function WrathEffect({ play }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Olho no céu */}
      <motion.div
        className="absolute left-1/2 top-[8%] h-14 w-14 -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, #fff, #fff6dc 30%, rgba(232,196,106,.2) 60%, transparent 72%)' }}
        animate={play ? { scale: [1, 1.8, 1], opacity: [0.8, 1, 0.8] } : { scale: [1, 1.12, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={play ? { duration: 0.8 } : { duration: 3, repeat: Infinity }}
      />
      {play > 0 &&
        PILLARS.map((p, i) => (
          <div key={`${play}-${i}`}>
            <motion.div
              className="absolute top-0 origin-top"
              style={{
                left: `${p.x}%`,
                width: `${p.w}%`,
                height: '86%',
                marginLeft: `-${p.w / 2}%`,
                background: 'linear-gradient(to bottom, rgba(255,246,220,.1), #fff6dc 40%, #ffffff)',
                boxShadow: '0 0 40px 10px rgba(255,246,220,.35)',
              }}
              initial={{ scaleY: 0, opacity: 1 }}
              animate={{ scaleY: [0, 1, 1], opacity: [1, 1, 0] }}
              transition={{ duration: 1.3, times: [0, 0.2, 1], delay: 0.3 + p.d, ease: EASE_SURGE }}
            />
            <motion.div
              className="absolute bottom-[14%] h-3 rounded-[50%] border border-[#fff6dc]"
              style={{ left: `${p.x}%`, x: '-50%', boxShadow: '0 0 20px #e8c46a' }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: ['0%', '28%'], opacity: [1, 0] }}
              transition={{ duration: 1, delay: 0.5 + p.d, ease: 'easeOut' }}
            />
          </div>
        ))}
      {/* Solo */}
      <div className="absolute inset-x-[8%] bottom-[14%] h-px bg-gradient-to-r from-transparent via-[#e8c46a]/60 to-transparent" />
    </div>
  )
}
