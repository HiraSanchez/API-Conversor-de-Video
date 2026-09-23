import { motion } from 'framer-motion'
import { EASE_DIVINE, EASE_SURGE } from '@/core/motion/easings'
import type { EffectProps } from './types'

const SHARDS = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  return {
    // Triângulo do hexágono central (fatia de pizza).
    points: `50,50 ${50 + Math.cos(a) * 14},${50 + Math.sin(a) * 14} ${50 + Math.cos(a + Math.PI / 6) * 14},${50 + Math.sin(a + Math.PI / 6) * 14}`,
    dx: Math.cos(a + Math.PI / 12) * 34,
    dy: Math.sin(a + Math.PI / 12) * 34,
    rot: (i % 2 ? 1 : -1) * (90 + i * 20),
  }
})

/** Regeneração Imortal: o núcleo se estilhaça e se refaz, cada vez mais instável. */
export function RegenerationEffect({ play }: EffectProps) {
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
      <defs>
        <radialGradient id="regen-core">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="0.6" stopColor="#e8c46a" />
          <stop offset="1" stopColor="#8a6a1f" />
        </radialGradient>
      </defs>

      {/* Anéis de cura */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={`${play}-ring-${i}`}
          cx="50"
          cy="50"
          fill="none"
          stroke="#e8c46a"
          strokeWidth="0.4"
          initial={{ r: 16, opacity: 0 }}
          animate={play ? { r: [16, 44], opacity: [0.9, 0] } : { r: [16, 26], opacity: [0.5, 0] }}
          transition={{ duration: play ? 1.4 : 3, delay: play ? 1.2 + i * 0.2 : i, repeat: play ? 0 : Infinity, ease: 'easeOut' }}
        />
      ))}

      <g style={{ filter: 'drop-shadow(0 0 2.5px rgba(232,196,106,.9))' }}>
        {SHARDS.map((s, i) => (
          <motion.polygon
            key={`${play}-${i}`}
            points={s.points}
            fill="url(#regen-core)"
            stroke="#fff6dc"
            strokeWidth="0.2"
            style={{ transformOrigin: '50px 50px', transformBox: 'view-box' }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={
              play
                ? { x: [0, s.dx, s.dx * 0.9, 0], y: [0, s.dy, s.dy * 0.9, 0], rotate: [0, s.rot, s.rot, 0], opacity: [1, 0.8, 0.8, 1] }
                : { scale: [1, 1.04, 1] }
            }
            transition={
              play
                ? { duration: 1.9, times: [0, 0.25, 0.5, 1], ease: [EASE_SURGE, 'linear', EASE_DIVINE] }
                : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }
          />
        ))}
      </g>
    </svg>
  )
}
