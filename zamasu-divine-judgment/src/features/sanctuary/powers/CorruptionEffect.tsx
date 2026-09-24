import { motion } from 'framer-motion'
import { EASE_JUDGMENT } from '@/core/motion/easings'
import type { EffectProps } from './types'

const VEINS = [
  'M50 50 C 40 42, 30 44, 22 34 S 10 20, 2 18',
  'M50 50 C 60 40, 64 30, 76 24 S 90 12, 98 6',
  'M50 50 C 58 58, 70 60, 78 72 S 90 88, 98 94',
  'M50 50 C 42 60, 30 62, 24 74 S 12 90, 4 98',
  'M50 50 C 50 38, 46 26, 50 14 S 52 4, 50 -2',
  'M50 50 C 52 62, 56 74, 52 86 S 50 96, 50 104',
  'M22 34 C 20 44, 12 48, 4 52',
  'M76 24 C 80 34, 90 36, 100 40',
  'M78 72 C 70 80, 66 90, 64 100',
]

/** Expansão da Corrupção: veias roxas tomam tudo, até o palco virar cosmos. */
export function CorruptionEffect({ play }: EffectProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {play > 0 && (
        <motion.div
          key={`tint-${play}`}
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 50% 50%, rgba(180,92,255,.35), rgba(40,8,70,.5) 60%, transparent)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.2, times: [0, 0.3, 0.75, 1] }}
        />
      )}

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <g style={{ filter: 'drop-shadow(0 0 1.5px #b45cff)' }}>
          {VEINS.map((d, i) => (
            <motion.path
              key={`${play}-${i}`}
              d={d}
              fill="none"
              stroke={i % 3 === 0 ? '#ff5ce1' : '#b45cff'}
              strokeWidth={i < 6 ? 0.9 : 0.5}
              strokeLinecap="round"
              initial={{ pathLength: play ? 0 : 0.18, opacity: play ? 1 : 0.7 }}
              animate={
                play
                  ? { pathLength: [0, 1, 1], opacity: [1, 1, 0] }
                  : { pathLength: [0.14, 0.22, 0.14], opacity: [0.5, 0.9, 0.5] }
              }
              transition={
                play
                  ? { duration: 3, times: [0, 0.45, 1], delay: i * 0.06, ease: EASE_JUDGMENT }
                  : { duration: 2.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }
              }
            />
          ))}
        </g>
      </svg>

      {/* Núcleo */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, #ffe8ff, #b45cff 45%, transparent 70%)' }}
        animate={play ? { scale: [1, 3, 0.8, 1] } : { scale: [1, 1.2, 1], x: ['-50%', '-48%', '-52%', '-50%'] }}
        transition={play ? { duration: 2 } : { duration: 1.6, repeat: Infinity }}
      />

      {/* Estrelas: o palco vira universo */}
      {play > 0 &&
        Array.from({ length: 26 }, (_, i) => (
          <motion.span
            key={`${play}-star-${i}`}
            className="absolute h-[2px] w-[2px] rounded-full bg-white"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 61) % 100}%`, boxShadow: '0 0 6px #7af5d0' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 2, delay: 1.3 + (i % 8) * 0.08 }}
          />
        ))}
    </div>
  )
}
