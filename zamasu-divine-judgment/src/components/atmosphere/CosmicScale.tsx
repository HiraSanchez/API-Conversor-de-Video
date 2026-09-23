import { motion } from 'framer-motion'

/**
 * Forma Infinita: anéis orbitais gigantes e um "olho" cósmico.
 * A escala sugere que a entidade é maior que a própria tela.
 */
export function CosmicScale() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {[160, 110, 78, 52].map((size, i) => (
          <div
            key={size}
            className="absolute left-1/2 top-1/2 rounded-full border"
            style={{
              width: `${size}vmax`,
              height: `${size * 0.62}vmax`,
              marginLeft: `-${size / 2}vmax`,
              marginTop: `-${(size * 0.62) / 2}vmax`,
              borderColor: `color-mix(in oklab, var(--form-${i % 2 ? 'secondary' : 'primary'}) ${22 - i * 3}%, transparent)`,
              animation: `slow-spin ${120 - i * 22}s linear infinite ${i % 2 ? 'reverse' : ''}`,
              borderStyle: i === 1 ? 'dashed' : 'solid',
            }}
          />
        ))}
        {/* Núcleo: o olho do universo */}
        <div
          className="absolute left-1/2 top-1/2 h-[46vmax] w-[46vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            background:
              'radial-gradient(circle, color-mix(in oklab, var(--form-accent) 22%, transparent) 0%, color-mix(in oklab, var(--form-primary) 14%, transparent) 30%, transparent 65%)',
            animation: 'breathe 7s ease-in-out infinite',
          }}
        />
      </motion.div>
    </div>
  )
}
