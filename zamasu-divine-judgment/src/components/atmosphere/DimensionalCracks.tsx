import { motion } from 'framer-motion'
import { EASE_JUDGMENT } from '@/core/motion/easings'

/**
 * Rachaduras na própria tela — a dimensão não suporta a corrupção.
 * Os caminhos são desenhados (pathLength) e pulsam como veias.
 */
const CRACKS = [
  'M-10 120 L120 160 L180 140 L260 210 L330 200 L420 260',
  'M1610 90 L1500 150 L1470 130 L1380 210 L1330 190 L1260 280 L1210 270',
  'M1610 700 L1520 660 L1450 690 L1390 620 L1300 640',
  'M-10 760 L90 700 L150 720 L230 640 L310 660 L360 590',
  'M800 -10 L790 60 L820 110 L780 170',
  'M260 210 L250 300 L290 350',
  'M1380 210 L1400 300 L1360 360',
]

export function DimensionalCracks() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ animation: 'crack-pulse 3.2s ease-in-out infinite alternate' }}
    >
      <defs>
        <filter id="crack-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {CRACKS.map((d, i) => (
        <g key={d} filter="url(#crack-glow)">
          <motion.path
            d={d}
            fill="none"
            style={{ stroke: 'var(--form-primary)' }}
            strokeWidth={i < 4 ? 2.2 : 1.4}
            strokeLinecap="round"
            strokeLinejoin="bevel"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.2 + i * 0.12, ease: EASE_JUDGMENT }}
          />
          <motion.path
            d={d}
            fill="none"
            stroke="#fff"
            strokeWidth={0.6}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.2 + i * 0.12, ease: EASE_JUDGMENT }}
          />
        </g>
      ))}
    </svg>
  )
}
