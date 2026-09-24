import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { Realm } from '@/app/realms'
import { PageFrame } from '@/components/layout/PageFrame'
import { DivineButton } from '@/components/ui/DivineButton'
import { GlyphDivider } from '@/components/ui/GlyphDivider'
import { EASE_DIVINE, revealUp } from '@/core/motion/easings'

interface SealedModuleProps {
  realm: Realm
  /** Fala de Zamasu ao visitante que tenta entrar. */
  decree: string
  /** O que o reino terá quando o selo for rompido. */
  promises: string[]
  preview?: ReactNode
  previewLabel?: string
}

/**
 * Página-padrão dos reinos ainda não construídos.
 * Em vez de "em breve", o próprio santuário recusa a entrada — e mostra
 * que a arquitetura (dados, tipos) do reino já existe.
 */
export function SealedModule({ realm, decree, promises, preview, previewLabel }: SealedModuleProps) {
  return (
    <PageFrame>
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-32 text-center sm:px-10">
        <SealCircle glyph={realm.glyph} />

        <motion.div initial="hidden" animate="visible" className="relative z-10 flex max-w-3xl flex-col items-center">
          <motion.p variants={revealUp} custom={0} className="hud-label mt-10 flex items-center gap-3 text-cosmic">
            <span className="h-1.5 w-1.5 rotate-45 bg-cosmic" /> Reino selado · Fase {realm.phase}
          </motion.p>
          <motion.h1 variants={revealUp} custom={1} className="mt-5 font-display text-4xl leading-tight font-semibold sm:text-6xl">
            <span className="text-divine-gradient glow-text">{realm.label}</span>
          </motion.h1>
          <motion.p variants={revealUp} custom={2} className="mt-6 font-scripture text-2xl leading-snug text-white/75 italic sm:text-3xl">
            “{decree}”
          </motion.p>
          <motion.p variants={revealUp} custom={3} className="hud-label mt-4 text-white/55">
            — Zamasu Fundido
          </motion.p>

          <motion.ul variants={revealUp} custom={4} className="mt-12 grid w-full gap-x-10 gap-y-3 text-left sm:grid-cols-2">
            {promises.map((p) => (
              <li key={p} className="flex items-start gap-3 border-b border-white/[0.06] pb-3 text-sm text-white/65">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-form" />
                {p}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {preview && (
          <motion.div
            className="relative z-10 mt-20 w-full max-w-5xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: EASE_DIVINE }}
          >
            <GlyphDivider />
            {previewLabel && <p className="hud-label mt-8 text-white/55">{previewLabel}</p>}
            <div className="mt-8">{preview}</div>
          </motion.div>
        )}

        <motion.div
          className="relative z-10 mt-16 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          <DivineButton to="/santuario" glyph="✦">
            Voltar ao Santuário
          </DivineButton>
          <DivineButton to="/" variant="ghost" glyph="◈">
            O Portal
          </DivineButton>
        </motion.div>
      </section>
    </PageFrame>
  )
}

/** Círculo de selo: anéis girando em sentidos opostos com runas. */
function SealCircle({ glyph }: { glyph: string }) {
  const runes = 'ΖΑΜΑΣΥ·ΚΑΙΟΣΗΙΝ·ΙΥΣΤΙΤΙΑ·'
  return (
    <motion.div
      aria-hidden
      className="relative h-56 w-56 sm:h-72 sm:w-72"
      initial={{ scale: 0.6, opacity: 0, rotate: -40 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 1.6, ease: EASE_DIVINE }}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[slow-spin_60s_linear_infinite]">
        <defs>
          <path id="seal-path" d="M100 100 m-82 0 a82 82 0 1 1 164 0 a82 82 0 1 1 -164 0" />
        </defs>
        <circle cx="100" cy="100" r="92" fill="none" style={{ stroke: 'var(--form-primary)' }} strokeOpacity=".5" />
        <circle cx="100" cy="100" r="72" fill="none" style={{ stroke: 'var(--form-primary)' }} strokeOpacity=".3" strokeDasharray="1 4" />
        <text className="font-display" fontSize="9.5" letterSpacing="4" style={{ fill: 'var(--form-primary)' }} fillOpacity=".7">
          <textPath href="#seal-path">{runes.repeat(2)}</textPath>
        </text>
      </svg>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[slow-spin_40s_linear_infinite_reverse]">
        <polygon points="100,34 157,133 43,133" fill="none" stroke="#b45cff" strokeOpacity=".55" />
        <polygon points="100,166 43,67 157,67" fill="none" stroke="#b45cff" strokeOpacity=".55" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="glow-text font-display text-6xl text-form sm:text-7xl">{glyph}</span>
      </div>
      <div className="absolute inset-[15%] -z-10 rounded-full" style={{ background: 'radial-gradient(circle, var(--form-glow), transparent 65%)' }} />
    </motion.div>
  )
}
