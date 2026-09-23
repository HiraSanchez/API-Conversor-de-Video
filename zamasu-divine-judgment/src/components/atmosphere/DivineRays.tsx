import { motion } from 'framer-motion'

/** Feixes de luz celestial caindo do alto — marca da Forma Divina. */
export function DivineRays() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-[-30%] h-[140%] w-[160vmax] -translate-x-1/2"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 0%, transparent 0deg, transparent 160deg, color-mix(in oklab, var(--form-primary) 22%, transparent) 168deg, transparent 172deg, color-mix(in oklab, var(--form-accent) 16%, transparent) 178deg, transparent 181deg, color-mix(in oklab, var(--form-primary) 20%, transparent) 187deg, transparent 194deg, color-mix(in oklab, var(--form-accent) 12%, transparent) 200deg, transparent 206deg, transparent 360deg)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 85%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 85%)',
        }}
        animate={{ rotate: [-2.5, 2.5, -2.5], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute left-1/2 top-0 h-[45vh] w-[70vw] -translate-x-1/2 blur-3xl"
        style={{ background: 'radial-gradient(ellipse at top, color-mix(in oklab, var(--form-accent) 22%, transparent), transparent 70%)' }}
      />
    </div>
  )
}
