import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useDepth, usePointerParallax } from '@/hooks/usePointerParallax'

interface Star {
  x: number
  y: number
  r: number
  o: number
  d: number
}

function makeStars(count: number, seed: number): Star[] {
  // PRNG determinístico: o céu é o mesmo a cada visita — perfeição não varia.
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
  return Array.from({ length: count }, () => ({
    x: rnd() * 100,
    y: rnd() * 100,
    r: rnd() * 1.1 + 0.2,
    o: rnd() * 0.6 + 0.15,
    d: rnd() * 6,
  }))
}

/**
 * Camada mais profunda: céu da forma, nebulosas, estrelas e ruínas de templo.
 * Cada camada tem profundidade própria para o parallax.
 */
export function CosmicBackdrop() {
  const { x, y } = usePointerParallax()
  const farX = useDepth(x, -8)
  const farY = useDepth(y, -6)
  const midX = useDepth(x, -18)
  const midY = useDepth(y, -12)
  const nearX = useDepth(x, -34)
  const nearY = useDepth(y, -20)

  const farStars = useMemo(() => makeStars(140, 7), [])
  const nearStars = useMemo(() => makeStars(46, 91), [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Céu da forma */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 38%, var(--form-sky) 0%, color-mix(in oklab, var(--form-sky) 40%, var(--form-sky-edge)) 45%, var(--form-sky-edge) 100%)',
        }}
      />

      {/* Estrelas distantes */}
      <motion.svg style={{ x: farX, y: farY }} className="absolute -inset-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)]">
        {farStars.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#fff" opacity={s.o}>
            <animate attributeName="opacity" values={`${s.o};${s.o * 0.3};${s.o}`} dur={`${3 + s.d}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </motion.svg>

      {/* Nebulosas */}
      <motion.div style={{ x: midX, y: midY }} className="absolute -inset-20">
        <div
          className="absolute left-[8%] top-[12%] h-[55vmax] w-[55vmax] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--form-secondary) 35%, transparent), transparent 65%)' }}
        />
        <div
          className="absolute right-[2%] top-[30%] h-[60vmax] w-[60vmax] rounded-full opacity-45 blur-3xl"
          style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--form-primary) 30%, transparent), transparent 62%)' }}
        />
        <div
          className="absolute bottom-[-20%] left-[30%] h-[50vmax] w-[70vmax] rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(123, 44, 255, 0.35), transparent 65%)' }}
        />
      </motion.div>

      {/* Ruínas do templo dos Kaioshins */}
      <motion.div style={{ x: midX, y: midY }} className="absolute inset-0">
        <TempleRuins />
      </motion.div>

      {/* Estrelas próximas */}
      <motion.svg style={{ x: nearX, y: nearY }} className="absolute -inset-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)]">
        {nearStars.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r * 1.4} style={{ fill: 'var(--form-accent)' }} opacity={s.o * 0.9} />
        ))}
      </motion.svg>

      {/* Grão + vinheta: tira o aspecto "digital limpo" */}
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)' }}
      />
    </div>
  )
}

/** Colunas e plataformas flutuantes inspiradas no Mundo Sagrado dos Kaioshins. */
function TempleRuins() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full opacity-[0.35]">
      <defs>
        <linearGradient id="pillar" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--form-primary)', stopOpacity: 0.35 }} />
          <stop offset="0.5" stopColor="#0d0d12" stopOpacity="0.9" />
          <stop offset="1" stopColor="#050505" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="rim" x1="0" x2="1">
          <stop offset="0" style={{ stopColor: 'var(--form-primary)', stopOpacity: 0 }} />
          <stop offset="0.5" style={{ stopColor: 'var(--form-primary)', stopOpacity: 0.8 }} />
          <stop offset="1" style={{ stopColor: 'var(--form-primary)', stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/* Colunas esquerdas */}
      {[80, 210, 320].map((x, i) => (
        <g key={`l${x}`} opacity={1 - i * 0.22}>
          <rect x={x} y={360 + i * 40} width={52 - i * 8} height={600} fill="url(#pillar)" />
          <rect x={x - 10} y={350 + i * 40} width={72 - i * 8} height={14} fill="url(#pillar)" />
          <rect x={x - 10} y={350 + i * 40} width={72 - i * 8} height={1.5} fill="url(#rim)" />
        </g>
      ))}
      {/* Coluna quebrada */}
      <path d="M1380 900 L1380 520 L1400 500 L1412 530 L1430 505 L1432 900 Z" fill="url(#pillar)" />
      {/* Colunas direitas */}
      {[1480, 1260].map((x, i) => (
        <g key={`r${x}`} opacity={1 - i * 0.3}>
          <rect x={x} y={380 + i * 50} width={50 - i * 8} height={600} fill="url(#pillar)" />
          <rect x={x - 10} y={370 + i * 50} width={70 - i * 8} height={14} fill="url(#pillar)" />
          <rect x={x - 10} y={370 + i * 50} width={70 - i * 8} height={1.5} fill="url(#rim)" />
        </g>
      ))}
      {/* Plataformas flutuantes */}
      <g>
        <path d="M470 250 L610 250 L585 272 L495 272 Z" fill="#0c0c11" stroke="url(#rim)" strokeWidth="1" />
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 -10; 0 0" dur="9s" repeatCount="indefinite" />
      </g>
      <g>
        <path d="M1050 190 L1150 190 L1134 206 L1066 206 Z" fill="#0c0c11" stroke="url(#rim)" strokeWidth="1" />
        <animateTransform attributeName="transform" type="translate" values="0 0; 0 8; 0 0" dur="11s" repeatCount="indefinite" />
      </g>
      {/* Chão do santuário */}
      <path d="M0 860 L1600 860 L1600 900 L0 900 Z" fill="#050505" />
      <rect x="0" y="858" width="1600" height="1.5" fill="url(#rim)" />
    </svg>
  )
}
