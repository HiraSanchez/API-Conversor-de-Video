import { motion } from 'framer-motion'

interface KiAuraProps {
  /** 0–1: presença da aura. */
  intensity: number
  className?: string
}

const FLAMES = [
  { x: -34, h: 78, delay: 0, dur: 1.9 },
  { x: -18, h: 92, delay: 0.4, dur: 1.6 },
  { x: 0, h: 100, delay: 0.15, dur: 1.8 },
  { x: 18, h: 90, delay: 0.55, dur: 1.7 },
  { x: 34, h: 76, delay: 0.3, dur: 2 },
]

/**
 * Aura de Ki: núcleo pulsante + labaredas verticais.
 * Tudo em transform/opacity (GPU) para manter 60fps.
 */
export function KiAura({ intensity, className }: KiAuraProps) {
  return (
    <div aria-hidden className={`pointer-events-none ${className ?? ''}`}>
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: intensity, scale: 0.7 + intensity * 0.35 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Núcleo */}
        <div
          className="absolute left-1/2 top-[48%] h-[82%] w-[70%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(ellipse closest-side, var(--form-glow) 0%, color-mix(in oklab, var(--form-secondary) 22%, transparent) 55%, transparent 100%)',
            animation: 'breathe 3.2s ease-in-out infinite',
          }}
        />
        {/* Labaredas */}
        {FLAMES.map((f, i) => (
          <motion.div
            key={i}
            className="absolute bottom-[8%] left-1/2 w-[26%] origin-bottom"
            style={{
              height: `${f.h}%`,
              marginLeft: `calc(${f.x}% - 13%)`,
              // Elipse radial ancorada embaixo: labareda de borda suave sem filtro de blur.
              background: `radial-gradient(ellipse closest-side at 50% 100%, color-mix(in oklab, var(--form-${i % 2 ? 'secondary' : 'primary'}) 55%, transparent), transparent)`,
            }}
            animate={{ scaleY: [0.85, 1.08, 0.9], scaleX: [1, 0.86, 1], opacity: [0.55, 0.9, 0.6] }}
            transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>
    </div>
  )
}
