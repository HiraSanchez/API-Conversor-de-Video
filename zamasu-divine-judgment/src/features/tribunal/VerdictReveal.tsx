import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { AxisProfile } from './AxisProfile'
import { AXIS_LABELS } from './engine'
import { AXIS_READINGS, VERDICTS } from './verdicts'
import { DivineButton } from '@/components/ui/DivineButton'
import { divineEvents } from '@/core/events/divineEvents'
import { EASE_DIVINE } from '@/core/motion/easings'
import { useTribunalStore } from '@/store/useTribunalStore'

export function VerdictReveal() {
  const result = useTribunalStore((s) => s.result)
  const reset = useTribunalStore((s) => s.reset)
  const text = result ? VERDICTS[result.verdict] : null

  // Sentença proclamada: o mundo reage uma vez, depois da pausa dramática.
  useEffect(() => {
    if (!result || !text) return
    const t = window.setTimeout(() => {
      divineEvents.emit({ type: 'flash', color: text.color, intensity: 0.6 })
      divineEvents.emit({ type: 'shockwave', color: text.color })
      divineEvents.emit({ type: 'burst', color: text.color, count: 110 })
      if (result.verdict === 'condemned') divineEvents.emit({ type: 'quake', intensity: 1.2 })
    }, 1300)
    return () => clearTimeout(t)
  }, [result, text])

  if (!result || !text) return null

  return (
    <motion.div initial="hidden" animate="visible" exit={{ opacity: 0 }} className="w-full max-w-2xl">
      <motion.p
        className="hud-label text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        O Tribunal decidiu.
      </motion.p>
      <motion.h2
        className="mt-6 font-display text-6xl leading-none font-black sm:text-8xl"
        style={{ color: text.color, filter: `drop-shadow(0 0 28px ${text.color}88)` }}
        initial={{ opacity: 0, scale: 1.3, letterSpacing: '0.4em' }}
        animate={{ opacity: 1, scale: 1, letterSpacing: '0.02em' }}
        transition={{ duration: 1.4, delay: 1.1, ease: EASE_DIVINE }}
      >
        {text.title}
      </motion.h2>
      <motion.p
        className="mt-8 font-scripture text-2xl leading-snug text-white/90 italic sm:text-3xl"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.1, ease: EASE_DIVINE }}
      >
        “{text.sentence}”
      </motion.p>

      <motion.section
        aria-label="Perfil moral"
        className="mt-12 border-t border-white/[0.07] pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.8 }}
      >
        <p className="hud-label text-form">Eixo dominante · {AXIS_LABELS[result.dominantAxis]}</p>
        <p className="mt-2 text-base leading-relaxed text-white/80">{AXIS_READINGS[result.dominantAxis]}</p>
        <div className="mt-8">
          <AxisProfile axes={result.axes} dominant={result.dominantAxis} />
        </div>
      </motion.section>

      <motion.div
        className="mt-12 flex flex-col gap-4 sm:flex-row"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 3.2, ease: EASE_DIVINE }}
      >
        <DivineButton onClick={reset} glyph="⚖">
          Ser julgado novamente
        </DivineButton>
        <DivineButton to="/santuario" variant="ghost" glyph="✦">
          Voltar ao Santuário
        </DivineButton>
      </motion.div>
    </motion.div>
  )
}
