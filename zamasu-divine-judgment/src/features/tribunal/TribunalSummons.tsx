import { motion } from 'framer-motion'
import { OPENING, RETURN_GREETINGS, VERDICTS } from './verdicts'
import { DivineButton } from '@/components/ui/DivineButton'
import { RevealText } from '@/components/ui/RevealText'
import { revealUp } from '@/core/motion/easings'
import { useTribunalStore } from '@/store/useTribunalStore'

/** Convocação: a fala de abertura muda se o Zamasu já julgou você antes. */
export function TribunalSummons() {
  const memory = useTribunalStore((s) => s.memory)
  const begin = useTribunalStore((s) => s.begin)
  const returning = memory.lastVerdict !== null
  const speech = returning ? RETURN_GREETINGS[memory.lastVerdict!] : OPENING

  return (
    <motion.div initial="hidden" animate="visible" exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }} className="max-w-2xl">
      <motion.p variants={revealUp} custom={0} className="hud-label flex items-center gap-3 text-form">
        <span className="h-px w-10 bg-current" /> Reino II · O Tribunal
      </motion.p>
      <motion.h1 variants={revealUp} custom={1} className="mt-6 font-display text-5xl leading-[1.02] font-semibold sm:text-7xl">
        <span className="text-divine-gradient glow-text">Tribunal Divino</span>
      </motion.h1>

      <RevealText
        as="p"
        show
        delay={0.6}
        stagger={0.04}
        text={`“${speech}”`}
        className="mt-10 font-scripture text-2xl leading-snug text-white/85 italic sm:text-3xl"
      />
      <motion.p variants={revealUp} custom={6} className="hud-label mt-4 text-white/55">
        — Zamasu Fundido
      </motion.p>

      {returning && (
        <motion.dl variants={revealUp} custom={7} className="mt-10 grid max-w-md grid-cols-2 border-l border-form/40">
          <div className="py-2 pl-5">
            <dt className="hud-label text-white/55">Julgamentos</dt>
            <dd className="mt-1 font-display text-2xl text-white">{memory.trials}</dd>
          </div>
          <div className="py-2 pl-5">
            <dt className="hud-label text-white/55">Último veredito</dt>
            <dd className="mt-1 font-display text-2xl" style={{ color: VERDICTS[memory.lastVerdict!].color }}>
              {VERDICTS[memory.lastVerdict!].title}
            </dd>
          </div>
        </motion.dl>
      )}

      <motion.div variants={revealUp} custom={8} className="mt-12">
        <DivineButton onClick={begin} glyph="⚖">
          {returning ? 'Ser julgado novamente' : 'Aceitar o julgamento'}
        </DivineButton>
        <p className="mt-4 text-sm text-white/55">Sete dilemas · cerca de 3 minutos · o Zamasu lembrará de você.</p>
      </motion.div>
    </motion.div>
  )
}
