import { motion } from 'framer-motion'

interface JudgmentScaleProps {
  /** Disposição acumulada: positivo = a favor, negativo = contra. */
  disposition: number
  className?: string
}

const MAX_TILT = 16

/**
 * Balança do julgamento: pende para o lado dourado (reconhecimento)
 * ou para o roxo (desprezo) conforme as respostas se acumulam.
 */
export function JudgmentScale({ disposition, className }: JudgmentScaleProps) {
  const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, disposition * 2.2))
  const reading = disposition > 0 ? 'A balança pende a seu favor.' : disposition < 0 ? 'A balança pende contra você.' : 'A balança está em equilíbrio.'

  return (
    <figure className={className}>
      <svg viewBox="0 0 200 120" className="h-auto w-full" aria-hidden>
        {/* Coluna */}
        <path d="M100 30 L100 108 M78 110 L122 110" style={{ stroke: 'var(--form-primary)' }} strokeWidth="2" strokeLinecap="round" opacity=".7" />
        <circle cx="100" cy="28" r="4" style={{ fill: 'var(--form-accent)' }} />
        {/* Travessão + pratos: o grupo inteiro gira no ponto de apoio */}
        <motion.g
          style={{ originX: '100px', originY: '28px', transformBox: 'view-box' }}
          animate={{ rotate: -tilt }}
          transition={{ type: 'spring', stiffness: 60, damping: 9 }}
        >
          <path d="M30 28 L170 28" style={{ stroke: 'var(--form-primary)' }} strokeWidth="2.5" strokeLinecap="round" />
          {/* Prato do reconhecimento (esquerda) */}
          <g>
            <path d="M30 28 L18 62 M30 28 L42 62" stroke="#e8c46a" strokeWidth="1" opacity=".6" />
            <path d="M12 62 Q30 74 48 62 Z" fill="#e8c46a" opacity=".85" />
          </g>
          {/* Prato do desprezo (direita) */}
          <g>
            <path d="M170 28 L158 62 M170 28 L182 62" stroke="#b45cff" strokeWidth="1" opacity=".6" />
            <path d="M152 62 Q170 74 188 62 Z" fill="#b45cff" opacity=".85" />
          </g>
        </motion.g>
      </svg>
      <figcaption className="hud-label mt-2 text-center text-white/60">{reading}</figcaption>
    </figure>
  )
}
