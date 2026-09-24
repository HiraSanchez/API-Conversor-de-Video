import { motion } from 'framer-motion'
import { EASE_JUDGMENT } from '@/core/motion/easings'
import type { EffectProps } from './types'

/** Lâmina de Luz Divina: a lâmina corta o palco e a própria realidade se parte. */
export function BladeEffect({ play }: EffectProps) {
  return (
    <div className="absolute inset-0">
      {/* Realidade (duas metades que se separam no corte) */}
      {play > 0 &&
        [0, 1].map((half) => (
          <motion.div
            key={`${play}-${half}`}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(46,230,166,.10),transparent_60%)]"
            style={{ clipPath: half ? 'polygon(0 100%, 100% 0, 100% 100%)' : 'polygon(0 0, 100% 0, 0 100%)' }}
            initial={{ x: 0, y: 0 }}
            animate={{ x: [0, half ? 10 : -10, 0], y: [0, half ? 10 : -10, 0] }}
            transition={{ duration: 1.4, times: [0, 0.3, 1], delay: 0.35, ease: EASE_JUDGMENT }}
          />
        ))}

      {/* Lâmina em repouso */}
      <motion.div
        key={`blade-${play}`}
        className="absolute left-1/2 top-1/2 h-[62%] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'linear-gradient(to top, transparent, #2ee6a6 20%, #eafff7 50%, #2ee6a6 80%, transparent)',
          boxShadow: '0 0 24px 6px rgba(46,230,166,.55), 0 0 70px 14px rgba(46,230,166,.25)',
        }}
        initial={{ rotate: play ? -70 : 0 }}
        animate={play ? { rotate: [-70, 70, 45], scaleY: [1, 1.35, 1] } : { rotate: [-6, 6, -6] }}
        transition={play ? { duration: 0.7, ease: EASE_JUDGMENT } : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Rasgo diagonal */}
      {play > 0 && (
        <svg key={`slash-${play}`} viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <motion.line
            x1="-5"
            y1="105"
            x2="105"
            y2="-5"
            stroke="#eafff7"
            strokeWidth="0.8"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: [1, 1, 0] }}
            transition={{ duration: 1.2, times: [0, 0.3, 1], delay: 0.25, ease: EASE_JUDGMENT }}
            style={{ filter: 'drop-shadow(0 0 3px #2ee6a6)' }}
          />
        </svg>
      )}
    </div>
  )
}
