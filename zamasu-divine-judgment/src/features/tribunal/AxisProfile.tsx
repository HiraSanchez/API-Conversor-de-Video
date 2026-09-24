import { motion } from 'framer-motion'
import { AXES, AXIS_LABELS } from './engine'
import type { MoralAxis } from './types'
import { EASE_DIVINE } from '@/core/motion/easings'

/** Perfil moral: barras bidirecionais a partir do centro (negativo à esquerda). */
export function AxisProfile({ axes, dominant }: { axes: Record<MoralAxis, number>; dominant: MoralAxis }) {
  const scale = Math.max(4, ...AXES.map((a) => Math.abs(axes[a])))
  return (
    <dl className="grid gap-4">
      {AXES.map((axis, i) => {
        const value = axes[axis]
        const pct = (Math.abs(value) / scale) * 50
        return (
          <div key={axis} className="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-4">
            <dt className={`hud-label ${axis === dominant ? 'text-form' : 'text-white/60'}`}>{AXIS_LABELS[axis]}</dt>
            <dd className="relative h-1.5 bg-white/[0.07]" aria-hidden>
              <span className="absolute inset-y-[-3px] left-1/2 w-px bg-white/30" />
              <motion.span
                className="absolute inset-y-0"
                style={{
                  background: axis === dominant ? 'var(--form-primary)' : 'rgba(255,255,255,.55)',
                  left: value >= 0 ? '50%' : undefined,
                  right: value < 0 ? '50%' : undefined,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, delay: 0.8 + i * 0.12, ease: EASE_DIVINE }}
              />
            </dd>
            <dd className="text-right font-display text-sm text-white/85">{value > 0 ? `+${value}` : value}</dd>
          </div>
        )
      })}
    </dl>
  )
}
