import { motion } from 'framer-motion'
import { DivineFigure } from '@/components/character/DivineFigure'
import { revealUp } from '@/core/motion/easings'
import { CHARACTER } from '@/data/character'
import { useActiveForm } from '@/hooks/useActiveForm'
import { useDepth, usePointerParallax } from '@/hooks/usePointerParallax'

/** Abertura do santuário: o nome, o dossiê e a entidade em pé diante do visitante. */
export function SanctuaryHero() {
  const form = useActiveForm()
  const { x, y } = usePointerParallax()
  const figX = useDepth(x, 18)
  const figY = useDepth(y, 10)

  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden px-4 pb-20 pt-32 sm:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center lg:justify-end lg:pr-[8vw]">
        <DivineFigure offsetX={figX} offsetY={figY} className="h-[70dvh] opacity-40 lg:h-[84dvh] lg:opacity-100" />
      </div>

      <motion.div initial="hidden" animate="visible" className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.p variants={revealUp} custom={0} className="hud-label flex items-center gap-3 text-form">
          <span className="h-px w-10 bg-current" /> Reino I · O Santuário Divino
        </motion.p>
        <motion.h1 variants={revealUp} custom={1} className="mt-6 font-display text-6xl leading-[0.95] font-black sm:text-8xl xl:text-9xl">
          <span className="text-divine-gradient glow-text block">
            Zamasu
            <span className="block text-[0.42em] font-semibold tracking-[0.3em]">Fundido</span>
          </span>
        </motion.h1>
        <motion.p variants={revealUp} custom={2} className="mt-8 max-w-xl font-scripture text-2xl leading-snug text-white/70 italic">
          {form.tagline}
        </motion.p>

        {/* Dossiê: painel HUD, não card */}
        <motion.dl variants={revealUp} custom={3} className="mt-12 grid max-w-2xl grid-cols-1 border-l border-form/40 sm:grid-cols-2">
          {CHARACTER.dossier.map((item) => (
            <div key={item.label} className="border-b border-white/[0.06] py-3 pl-5 pr-4">
              <dt className="hud-label text-white/55">{item.label}</dt>
              <dd className="mt-1 font-display text-sm tracking-wide text-white/90">{item.value}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  )
}
