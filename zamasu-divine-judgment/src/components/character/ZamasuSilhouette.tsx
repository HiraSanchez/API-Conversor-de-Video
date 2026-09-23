import { AnimatePresence, motion } from 'framer-motion'
import { useId } from 'react'
import type { FormId } from '@/core/forms/forms'

interface ZamasuSilhouetteProps {
  form: FormId
  /**
   * Arte oficial/encomendada para substituir o placeholder.
   * Recomendado: PNG/WebP com fundo transparente, proporção 4:7.
   */
  src?: string | null
  className?: string
}

/**
 * Silhueta estilizada do Zamasu Fundido (placeholder vetorial).
 *
 * Elementos de leitura imediata do personagem: moicano, orelhas pontudas de
 * Shinjin, brincos Potara, gola do traje de Kaioshin e o halo às costas.
 * Na Forma Corrompida, a metade direita do corpo ganha veias roxas.
 */
export function ZamasuSilhouette({ form, src, className }: ZamasuSilhouetteProps) {
  const uid = useId().replace(/:/g, '')
  const rim = `rim-${uid}`
  const body = `body-${uid}`
  const halo = `halo-${uid}`
  const soft = `soft-${uid}`

  if (src) {
    return <img src={src} alt="Zamasu Fundido" className={className} draggable={false} />
  }

  return (
    <svg viewBox="0 0 400 700" className={className} role="img" aria-label="Silhueta de Zamasu Fundido">
      <defs>
        <linearGradient id={body} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#15151c" />
          <stop offset="0.6" stopColor="#0a0a0e" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id={rim} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--form-primary)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--form-accent)', stopOpacity: 0.3 }} />
          <stop offset="1" style={{ stopColor: 'var(--form-secondary)' }} />
        </linearGradient>
        <radialGradient id={halo}>
          <stop offset="0.8" style={{ stopColor: 'var(--form-accent)', stopOpacity: 0 }} />
          <stop offset="0.9" style={{ stopColor: 'var(--form-accent)', stopOpacity: 0.9 }} />
          <stop offset="1" style={{ stopColor: 'var(--form-primary)', stopOpacity: 0 }} />
        </radialGradient>
        <filter id={soft} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Halo divino às costas */}
      <g style={{ transformOrigin: '200px 205px', animation: 'breathe 6s ease-in-out infinite' }}>
        <circle cx="200" cy="205" r="128" fill={`url(#${halo})`} />
        <circle cx="200" cy="205" r="118" fill="none" style={{ stroke: 'var(--form-primary)' }} strokeWidth="1.5" opacity="0.8" />
        <circle cx="200" cy="205" r="118" fill="none" style={{ stroke: 'var(--form-accent)' }} strokeWidth="6" opacity="0.35" filter={`url(#${soft})`} />
      </g>

      {/* Contorno luminoso (rim light) — desenhado atrás e desfocado */}
      <g filter={`url(#${soft})`} opacity="0.9">
        <Figure fill="none" stroke={`url(#${rim})`} strokeWidth={5} />
      </g>

      {/* Corpo */}
      <Figure fill={`url(#${body})`} stroke={`url(#${rim})`} strokeWidth={1.2} />

      {/* Detalhes do traje */}
      <g fill="none" style={{ stroke: 'var(--form-primary)' }} strokeWidth="1" opacity="0.55">
        <path d="M168 214 L200 262 L232 214" />
        <path d="M146 352 C 176 364, 224 364, 254 352" />
        <path d="M150 366 C 178 376, 222 376, 250 366" opacity="0.6" />
        <path d="M200 262 L200 352" opacity="0.5" />
        <path d="M200 376 L 186 690" opacity="0.35" />
      </g>

      {/* Brincos Potara */}
      <g>
        <circle cx="166" cy="166" r="6" style={{ fill: 'var(--form-secondary)' }} />
        <circle cx="234" cy="166" r="6" style={{ fill: 'var(--form-secondary)' }} />
        <circle cx="166" cy="166" r="12" style={{ fill: 'var(--form-secondary)' }} opacity="0.35" filter={`url(#${soft})`} />
        <circle cx="234" cy="166" r="12" style={{ fill: 'var(--form-secondary)' }} opacity="0.35" filter={`url(#${soft})`} />
      </g>

      {/* Olhos */}
      <g>
        <path d="M186 146 L196 148" strokeWidth="2.4" strokeLinecap="round" style={{ stroke: 'var(--form-accent)' }} />
        <path d="M204 148 L214 146" strokeWidth="2.4" strokeLinecap="round" style={{ stroke: 'var(--form-accent)' }} />
        <path d="M184 146 L216 146" strokeWidth="7" strokeLinecap="round" style={{ stroke: 'var(--form-primary)' }} opacity="0.35" filter={`url(#${soft})`} />
      </g>

      {/* Corrupção: metade direita do corpo (esquerda do observador) */}
      <AnimatePresence>
        {form === 'corrupted' && (
          <motion.g
            key="corruption"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <g fill="#2a0b45" opacity="0.85">
              <path d="M200 196 C 170 200, 132 208, 118 232 L 124 296 L 146 352 C 160 330, 176 300, 184 270 C 192 240, 198 220, 200 196 Z" />
              <path d="M118 230 C 98 254, 90 300, 88 342 L 80 424 L 100 430 L 110 350 C 114 314, 120 286, 130 262 Z" />
            </g>
            <g fill="none" stroke="#c77dff" strokeWidth="1.6" strokeLinecap="round">
              {[
                'M196 210 C 180 240, 160 256, 142 300 C 136 316, 132 326, 130 336',
                'M170 240 C 150 250, 138 262, 126 262',
                'M112 262 C 104 290, 100 312, 98 336',
                'M190 170 C 180 176, 176 186, 178 196',
                'M110 350 C 100 380, 96 400, 92 420',
              ].map((d, i) => (
                <motion.path
                  key={d}
                  d={d}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1, opacity: [0.6, 1, 0.6] }}
                  transition={{
                    pathLength: { duration: 1.4, delay: i * 0.1 },
                    opacity: { duration: 2, repeat: Infinity, delay: i * 0.2 },
                  }}
                />
              ))}
            </g>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

interface FigureProps {
  fill: string
  stroke: string
  strokeWidth: number
}

/** Geometria base da silhueta, reutilizada para corpo e rim light. */
function Figure({ fill, stroke, strokeWidth }: FigureProps) {
  return (
    <g fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round">
      {/* Moicano */}
      <path d="M186 124 L176 84 L190 98 L192 50 L202 88 L214 56 L214 96 L226 80 L216 124 Z" />
      {/* Cabeça */}
      <path d="M176 140 C 176 112, 224 112, 224 140 L 222 166 C 218 184, 206 190, 200 190 C 194 190, 182 184, 178 166 Z" />
      {/* Orelhas pontudas (Shinjin) */}
      <path d="M177 146 L158 128 L170 160 Z" />
      <path d="M223 146 L242 128 L230 160 Z" />
      {/* Pescoço */}
      <path d="M190 184 L210 184 L212 200 L188 200 Z" />
      {/* Torso + manto */}
      <path d="M200 196 C 162 198, 128 206, 116 232 L 124 296 L 146 352 L 150 420 L 124 560 L 92 690 L 308 690 L 276 560 L 250 420 L 254 352 L 276 296 L 284 232 C 272 206, 238 198, 200 196 Z" />
      {/* Braços */}
      <path d="M118 230 C 98 254, 90 300, 88 342 L 80 424 L 100 430 L 110 350 C 114 314, 120 286, 130 262 Z" />
      <path d="M282 230 C 302 254, 310 300, 312 342 L 320 424 L 300 430 L 290 350 C 286 314, 280 286, 270 262 Z" />
      {/* Ombreiras */}
      <path d="M116 232 C 120 214, 140 204, 160 204 L 150 236 C 136 236, 124 240, 116 250 Z" />
      <path d="M284 232 C 280 214, 260 204, 240 204 L 250 236 C 264 236, 276 240, 284 250 Z" />
      {/* Gola alta do traje de Kaioshin */}
      <path d="M160 204 C 170 190, 230 190, 240 204 L 232 222 C 220 212, 180 212, 168 222 Z" />
    </g>
  )
}
