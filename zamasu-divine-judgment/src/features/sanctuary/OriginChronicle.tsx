import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EASE_DIVINE } from '@/core/motion/easings'
import { ORIGIN_CHAPTERS } from '@/data/character'

/** Crônica da origem: uma linha de luz desce enquanto os capítulos se revelam. */
export function OriginChronicle() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })

  return (
    <section className="relative px-4 py-32 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="Crônica da origem"
          title="Como um aprendiz se tornou um deus"
          lead="Quatro atos. Uma única convicção: os mortais são o erro — e ele é a correção."
        />

        <div ref={ref} className="relative mt-24">
          {/* Trilho */}
          <div aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-white/[0.08] sm:left-1/2" />
          <motion.div
            aria-hidden
            className="absolute bottom-0 left-4 top-0 w-px origin-top bg-gradient-to-b from-form-accent via-form to-form-2 shadow-[0_0_12px_var(--form-glow)] sm:left-1/2"
            style={{ scaleY: progress }}
          />

          <ol className="space-y-28 sm:space-y-40">
            {ORIGIN_CHAPTERS.map((c, i) => {
              const right = i % 2 === 1
              return (
                <li key={c.id} className="relative grid gap-8 pl-12 sm:grid-cols-2 sm:gap-24 sm:pl-0">
                  {/* Nó no trilho */}
                  <motion.span
                    aria-hidden
                    className="absolute left-4 top-3 h-3 w-3 -translate-x-1/2 rotate-45 border border-form bg-void sm:left-1/2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-30%' }}
                    transition={{ duration: 0.6, ease: EASE_DIVINE }}
                  />

                  <motion.div
                    className={right ? 'sm:order-2' : 'sm:text-right'}
                    initial={{ opacity: 0, x: right ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-25%' }}
                    transition={{ duration: 1.1, ease: EASE_DIVINE }}
                  >
                    <p className="hud-label text-form">Ato {c.numeral}</p>
                    <h3 className="mt-3 font-display text-3xl text-white sm:text-5xl">{c.title}</h3>
                    <p className="mt-2 font-scripture text-xl text-white/55 italic">{c.subtitle}</p>
                    <p className={`mt-6 max-w-lg text-base leading-relaxed text-white/70 ${right ? '' : 'sm:ml-auto'}`}>{c.body}</p>
                  </motion.div>

                  <motion.blockquote
                    className={`relative flex items-center ${right ? 'sm:order-1 sm:justify-end sm:text-right' : ''}`}
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-25%' }}
                    transition={{ duration: 1.4, delay: 0.3, ease: EASE_DIVINE }}
                  >
                    <span aria-hidden className="pointer-events-none absolute -top-10 font-display text-[9rem] leading-none text-form/[0.08] sm:text-[13rem]">
                      {c.numeral}
                    </span>
                    <p className="relative max-w-md font-scripture text-2xl leading-snug text-form-accent/90 italic sm:text-3xl">“{c.inscription}”</p>
                  </motion.blockquote>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
