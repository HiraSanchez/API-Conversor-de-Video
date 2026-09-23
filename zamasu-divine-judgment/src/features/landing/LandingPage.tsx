import { AnimatePresence, motion } from 'framer-motion'
import { useCallback } from 'react'
import { RealmIndex } from './RealmIndex'
import { DivineFigure } from '@/components/character/DivineFigure'
import { PageFrame } from '@/components/layout/PageFrame'
import { DivineButton } from '@/components/ui/DivineButton'
import { GlitchText } from '@/components/ui/GlitchText'
import { RevealText } from '@/components/ui/RevealText'
import { EASE_DIVINE } from '@/core/motion/easings'
import { EnergyFragments } from '@/features/intro/EnergyFragments'
import { PotaraGlow } from '@/features/intro/PotaraGlow'
import { phaseIndex, useIntroTimeline } from '@/features/intro/useIntroTimeline'
import { useActiveForm } from '@/hooks/useActiveForm'
import { useDepth, usePointerParallax } from '@/hooks/usePointerParallax'
import { useExperienceStore } from '@/store/useExperienceStore'

export function LandingPage() {
  const introDone = useExperienceStore((s) => s.introDone)
  const completeIntro = useExperienceStore((s) => s.completeIntro)
  const replayIntro = useExperienceStore((s) => s.replayIntro)
  const onComplete = useCallback(() => completeIntro(), [completeIntro])
  const { at, skipNow } = useIntroTimeline(introDone, onComplete)
  const form = useActiveForm()

  const { x, y } = usePointerParallax()
  const figX = useDepth(x, 22)
  const figY = useDepth(y, 14)
  const textX = useDepth(x, -10)
  const markX = useDepth(x, 40)
  const markY = useDepth(y, 20)

  const past = (p: Parameters<typeof phaseIndex>[0]) => at >= phaseIndex(p)
  const revealed = past('revelation')
  const corrupted = form.id === 'corrupted'

  return (
    <PageFrame wipe={false}>
      {/* Véu do vazio: cobre o universo até a dimensão se formar */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[3] bg-void"
        initial={false}
        animate={{ opacity: past('dimension') ? 0 : 1 }}
        transition={{ duration: 2.2, ease: EASE_DIVINE }}
      />

      <section className="relative isolate flex min-h-dvh items-center overflow-hidden px-4 pb-24 pt-28 sm:px-10 lg:px-16">
        {/* Marca-d'água tipográfica gigante */}
        <motion.p
          aria-hidden
          style={{ x: markX, y: markY }}
          initial={false}
          animate={{ opacity: past('dimension') ? 1 : 0 }}
          transition={{ duration: 2.5 }}
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[26vw] leading-none font-black whitespace-nowrap text-transparent lg:text-[19vw]"
        >
          <span style={{ WebkitTextStroke: '1px color-mix(in oklab, var(--form-primary) 14%, transparent)' }}>ZAMASU</span>
        </motion.p>

        <EnergyFragments active={past('fragments')} converge={past('potara')} />
        <PotaraGlow active={past('potara') && !past('silhouette')} merged={past('dimension')} />

        {/* Figura */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-center lg:justify-end lg:pr-[6vw]">
          <DivineFigure
            presence={past('silhouette') ? 1 : 0}
            aura={past('aura') ? undefined : past('silhouette') ? 0.25 : 0}
            offsetX={figX}
            offsetY={figY}
            className="h-[78dvh] max-h-[860px] opacity-60 sm:opacity-80 lg:h-[88dvh] lg:opacity-100"
          />
        </div>

        {/* Texto principal */}
        <motion.div style={{ x: textX }} className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-2xl text-center lg:text-left">
            <motion.p
              className="hud-label mb-8 flex items-center justify-center gap-3 text-form lg:justify-start"
              initial={false}
              animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 10 }}
              transition={{ duration: 1, ease: EASE_DIVINE }}
            >
              <span className="hidden h-px w-10 bg-current sm:block" />
              Project Zamasu<span className="hidden sm:inline"> · Divine Judgment</span>
            </motion.p>

            <h1 className="sr-only">Project Zamasu: Divine Judgment</h1>
            <RevealText
              as="p"
              show={revealed}
              text="Quando mortais falham em criar um mundo perfeito…"
              className="font-scripture text-2xl leading-snug text-white/75 italic sm:text-3xl"
            />
            <p className="glow-text mt-3 font-display text-4xl leading-[1.05] font-semibold sm:text-6xl xl:text-7xl">
              <GlitchText active={corrupted && revealed}>
                <RevealText show={revealed} delay={0.7} stagger={0.1} text="um deus decide assumir o controle." wordClassName="text-divine-gradient" />
              </GlitchText>
            </p>

            <motion.div
              className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
              initial={false}
              animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 24 }}
              transition={{ duration: 1.1, ease: EASE_DIVINE, delay: revealed ? 1.5 : 0 }}
              style={{ pointerEvents: revealed ? 'auto' : 'none' }}
            >
              <DivineButton to="/santuario" glyph="✦">
                Entrar no Santuário
              </DivineButton>
              <DivineButton to="/arena" variant="ghost" glyph="⚔">
                Desafiar a Divindade
              </DivineButton>
            </motion.div>
          </div>
        </motion.div>

        {/* HUD inferior */}
        <motion.div
          className="absolute inset-x-4 bottom-6 z-10 flex items-end justify-between gap-6 sm:inset-x-10 lg:inset-x-16"
          initial={false}
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: 1.2, delay: revealed ? 2 : 0 }}
        >
          <div className="hud-label hidden text-white/55 sm:block">
            <span className="text-form">{form.sigil}</span> · {form.name} — {form.epithet}
          </div>
          <div className="hud-label flex items-center gap-2 text-white/55">
            <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              ↓
            </motion.span>
            Os reinos
          </div>
          <button
            onClick={() => {
              window.scrollTo({ top: 0 })
              replayIntro()
            }} className="hud-label text-white/55 transition-colors hover:text-form">
            ↺ Rever abertura
          </button>
        </motion.div>

        {/* Pular abertura */}
        <AnimatePresence>
          {!revealed && (
            <motion.button
              onClick={skipNow}
              className="hud-label fixed bottom-6 right-6 z-50 text-white/55 transition-colors hover:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1 } }}
              exit={{ opacity: 0 }}
            >
              Pular abertura ⟶
            </motion.button>
          )}
        </AnimatePresence>
      </section>

      {revealed && <RealmIndex />}
    </PageFrame>
  )
}
