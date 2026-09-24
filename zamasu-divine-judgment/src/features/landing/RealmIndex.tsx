import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { REALMS } from '@/app/realms'
import { GlyphDivider } from '@/components/ui/GlyphDivider'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EASE_DIVINE } from '@/core/motion/easings'

/** Índice dos reinos — um mapa do santuário, não uma grade de cards. */
export function RealmIndex() {
  const realms = REALMS.filter((r) => r.id !== 'gate')
  return (
    <section className="relative px-4 py-32 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="Cartografia divina"
          title="Os reinos do santuário"
          lead="Cada reino foi erguido por uma vontade que não admite erro. Alguns ainda estão selados — aguardando visitantes dignos."
        />

        <ol className="mt-20 border-t border-white/[0.07]">
          {realms.map((realm, i) => {
            const sealed = realm.status === 'sealed'
            return (
              <motion.li
                key={realm.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: EASE_DIVINE }}
                className="border-b border-white/[0.07]"
              >
                <Link to={realm.path} className="group relative grid grid-cols-[3rem_1fr] items-center gap-x-4 gap-y-2 py-8 sm:grid-cols-[4rem_1fr_auto] sm:gap-x-8">
                  {/* Luz que varre a linha no hover */}
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-form/10 via-form/[0.03] to-transparent transition-transform duration-700 ease-[var(--ease-divine)] group-hover:scale-x-100"
                  />
                  <span className="relative font-display text-3xl text-form/80 transition-transform duration-700 group-hover:scale-125">{realm.glyph}</span>
                  <span className="relative">
                    <span className={`block font-display text-2xl tracking-wide sm:text-4xl ${sealed ? 'text-white/55' : 'text-white'} transition-colors duration-500 group-hover:text-white`}>
                      {realm.label}
                    </span>
                    <span className="mt-1 block font-scripture text-lg text-white/60 italic">{realm.summary}</span>
                  </span>
                  <span className="relative col-start-2 sm:col-start-auto">
                    {sealed ? (
                      <span className="hud-label inline-flex items-center gap-2 text-cosmic">
                        <span className="h-1.5 w-1.5 rotate-45 bg-cosmic" /> Selado · Fase {realm.phase}
                      </span>
                    ) : (
                      <span className="hud-label inline-flex items-center gap-2 text-emerald">
                        <span className="h-1.5 w-1.5 rotate-45 bg-emerald shadow-[0_0_10px_#2ee6a6]" /> Aberto
                        <span className="transition-transform duration-500 group-hover:translate-x-1">⟶</span>
                      </span>
                    )}
                  </span>
                </Link>
              </motion.li>
            )
          })}
        </ol>

        <GlyphDivider className="mt-32" />
        <footer className="mt-10 flex flex-col items-center gap-2 text-center">
          <p className="font-scripture text-lg text-white/60 italic">“Toda realidade observada é uma realidade registrada.”</p>
          <p className="hud-label text-white/60">
            Project Zamasu: Divine Judgment · Arquivado por <span className="text-gold">Hira</span> · Projeto de fã sem fins lucrativos
          </p>
          <p className="max-w-xl text-xs text-white/60">
            Dragon Ball Super e seus personagens pertencem a Akira Toriyama, Toyotarou, Shueisha e Toei Animation.
          </p>
        </footer>
      </div>
    </section>
  )
}
