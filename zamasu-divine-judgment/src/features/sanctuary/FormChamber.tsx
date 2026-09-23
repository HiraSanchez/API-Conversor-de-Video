import { AnimatePresence, motion } from 'framer-motion'
import { DivineFigure } from '@/components/character/DivineFigure'
import { FormSwitcher } from '@/components/ui/FormSwitcher'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EASE_DIVINE } from '@/core/motion/easings'
import { useActiveForm } from '@/hooks/useActiveForm'

/** Sistema de Formas: trocar aqui altera o site inteiro (cores, partículas, efeitos). */
export function FormChamber() {
  const form = useActiveForm()

  return (
    <section className="relative px-4 py-32 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="Sistema de formas"
          title="Três estados da perfeição"
          lead="Escolha uma forma. O santuário inteiro obedece — a luz, as partículas, a própria dimensão."
        />

        <FormSwitcher variant="full" className="mt-14 border-y border-white/[0.07]" />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative mx-auto h-[56dvh] max-h-[620px] min-h-[380px]">
            <div
              aria-hidden
              className="absolute inset-x-[-30%] bottom-0 h-24 rounded-[50%] blur-2xl"
              style={{ background: 'radial-gradient(ellipse, var(--form-glow), transparent 70%)' }}
            />
            <DivineFigure className="h-full" />
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={form.id}
              initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
              transition={{ duration: 0.8, ease: EASE_DIVINE }}
            >
              <p className="font-display text-7xl text-form/30">{form.sigil}</p>
              <h3 className="mt-2 font-display text-3xl tracking-wide text-white sm:text-4xl">{form.name}</h3>
              <p className="mt-1 font-scripture text-xl text-form italic">{form.epithet}</p>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">{form.description}</p>
              <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                {form.traits.map((t) => (
                  <li key={t} className="hud-label flex items-center gap-2 text-white/70">
                    <span className="h-1.5 w-1.5 rotate-45 bg-form" /> {t}
                  </li>
                ))}
              </ul>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
