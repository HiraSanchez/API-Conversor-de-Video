import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState, type KeyboardEvent } from 'react'
import { POWER_EFFECTS } from './powers/effects'
import { DivineButton } from '@/components/ui/DivineButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { divineEvents } from '@/core/events/divineEvents'
import { EASE_DIVINE } from '@/core/motion/easings'
import { POWERS, type PowerId } from '@/data/powers'

/**
 * Códex de poderes: seleciona uma habilidade, observa o repouso,
 * e invoca — o palco executa o efeito e o mundo inteiro reage.
 */
export function PowerCodex() {
  const [selected, setSelected] = useState<PowerId>('blade')
  const [plays, setPlays] = useState<Record<PowerId, number>>({ blade: 0, regeneration: 0, wrath: 0, corruption: 0 })
  const stageRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  const power = POWERS.find((p) => p.id === selected)!
  const Effect = POWER_EFFECTS[selected]
  const play = plays[selected]

  const invoke = () => {
    setPlays((p) => ({ ...p, [selected]: p[selected] + 1 }))
    const rect = stageRef.current?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : undefined
    const y = rect ? rect.top + rect.height / 2 : undefined
    divineEvents.emit({ type: 'burst', x, y, color: power.color, count: 80 })
    divineEvents.emit({ type: 'shockwave', x, y, color: power.color })
    divineEvents.emit({ type: 'flash', color: power.color, intensity: selected === 'wrath' ? 0.7 : 0.35 })
    divineEvents.emit({ type: 'quake', intensity: selected === 'corruption' || selected === 'wrath' ? 1 : 0.5 })
  }

  // Navegação por setas entre as abas (padrão WAI-ARIA tabs).
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (index + dir + POWERS.length) % POWERS.length
    setSelected(POWERS[next].id)
    tabsRef.current[next]?.focus()
  }

  return (
    <section className="relative px-4 py-32 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="Códex de poderes"
          title="As armas de um deus"
          lead="Selecione uma habilidade. Depois, se tiver coragem, invoque."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          {/* Índice */}
          <div role="tablist" aria-label="Poderes" aria-orientation="vertical" className="border-t border-white/[0.07]">
            {POWERS.map((p, i) => {
              const on = p.id === selected
              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    tabsRef.current[i] = el
                  }}
                  role="tab"
                  id={`power-tab-${p.id}`}
                  aria-selected={on}
                  aria-controls="power-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setSelected(p.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="group relative flex w-full items-baseline gap-5 border-b border-white/[0.07] py-6 text-left"
                >
                  {on && (
                    <motion.span
                      layoutId="power-active"
                      aria-hidden
                      className="absolute inset-y-0 -left-4 right-0 bg-gradient-to-r from-white/[0.05] to-transparent"
                      style={{ boxShadow: `inset 2px 0 0 ${p.color}` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                    />
                  )}
                  <span className="hud-label relative w-6 shrink-0" style={{ color: on ? p.color : undefined }}>
                    {p.index}
                  </span>
                  <span className="relative">
                    <span className={clsx('block font-display text-xl tracking-wide transition-colors duration-500 sm:text-2xl', on ? 'text-white' : 'text-white/45 group-hover:text-white/80')}>
                      {p.name}
                    </span>
                    <span className="hud-label mt-1 block text-white/35">{p.classification}</span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* Palco + descrição */}
          <div id="power-panel" role="tabpanel" aria-labelledby={`power-tab-${selected}`}>
            <div
              ref={stageRef}
              className="relative aspect-[16/11] overflow-hidden border border-white/[0.08] bg-black/40"
              style={{ boxShadow: `inset 0 0 80px -20px ${power.color}55` }}
            >
              {/* Grade do palco */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                  maskImage: 'radial-gradient(circle at center, black, transparent 75%)',
                  WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 75%)',
                }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.5, ease: EASE_DIVINE }}
                >
                  <Effect play={play} />
                </motion.div>
              </AnimatePresence>

              {/* Cantoneiras HUD */}
              {['left-3 top-3 border-l border-t', 'right-3 top-3 border-r border-t', 'left-3 bottom-3 border-l border-b', 'right-3 bottom-3 border-r border-b'].map((c) => (
                <span key={c} aria-hidden className={`absolute h-4 w-4 ${c}`} style={{ borderColor: power.color }} />
              ))}
              <p className="hud-label absolute left-6 top-5 text-white/40">Palco de invocação</p>
              <p className="hud-label absolute right-6 top-5" style={{ color: power.color }}>
                {power.index} / 04
              </p>

              {/* Frase de invocação */}
              <AnimatePresence>
                {play > 0 && (
                  <motion.p
                    key={`${selected}-${play}`}
                    className="absolute inset-x-6 bottom-6 text-center font-scripture text-lg text-white italic sm:text-2xl"
                    style={{ textShadow: `0 0 20px ${power.color}` }}
                    initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                    animate={{ opacity: [0, 1, 1, 0], y: 0, filter: 'blur(0px)' }}
                    transition={{ opacity: { duration: 3.6, times: [0, 0.15, 0.8, 1] }, y: { duration: 0.6 }, filter: { duration: 0.6 } }}
                  >
                    “{power.invocation}”
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6, ease: EASE_DIVINE }}
                className="mt-8"
              >
                <dl className="grid grid-cols-3 border-l border-white/10">
                  {[
                    ['Classe', power.classification],
                    ['Alcance', power.range],
                    ['Natureza', power.nature],
                  ].map(([k, v]) => (
                    <div key={k} className="border-r border-white/10 px-4">
                      <dt className="hud-label text-white/35">{k}</dt>
                      <dd className="mt-1 text-sm text-white/85">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 text-base leading-relaxed text-white/70">{power.description}</p>
                <DivineButton onClick={invoke} glyph="✦" className="mt-8">
                  Invocar
                </DivineButton>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
