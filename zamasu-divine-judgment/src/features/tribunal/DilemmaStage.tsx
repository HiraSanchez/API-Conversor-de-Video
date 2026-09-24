import { clsx } from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { DILEMMAS } from './dilemmas'
import { nextIndex } from './engine'
import { JudgmentScale } from './JudgmentScale'
import { roman } from './numerals'
import type { Dilemma } from './types'
import { DivineButton } from '@/components/ui/DivineButton'
import { divineEvents } from '@/core/events/divineEvents'
import { EASE_DIVINE } from '@/core/motion/easings'
import { useTribunalStore } from '@/store/useTribunalStore'

const LETTERS = ['A', 'B', 'C', 'D']

/** Reação do mundo à resposta: reconhecimento brilha, desprezo treme. */
function react(disposition: number) {
  if (disposition > 0) {
    divineEvents.emit({ type: 'flash', color: '#e8c46a', intensity: 0.35 })
    divineEvents.emit({ type: 'burst', color: '#e8c46a', count: 50 })
  } else if (disposition < 0) {
    divineEvents.emit({ type: 'flash', color: '#b45cff', intensity: 0.3 })
    divineEvents.emit({ type: 'quake', intensity: 0.5 + Math.abs(disposition) * 0.25 })
  } else {
    divineEvents.emit({ type: 'shockwave' })
  }
}

export function DilemmaStage() {
  const session = useTribunalStore((s) => s.session)
  const answer = useTribunalStore((s) => s.answer)
  const conclude = useTribunalStore((s) => s.conclude)
  const reset = useTribunalStore((s) => s.reset)

  // Dilema em tela: fica fixo depois de respondido, até o visitante avançar.
  const [currentIndex, setCurrentIndex] = useState(() => Math.min(nextIndex(session, DILEMMAS), DILEMMAS.length - 1))
  const dilemma = DILEMMAS[currentIndex]
  const chosenId = session.answers[dilemma.id]
  const isLast = currentIndex === DILEMMAS.length - 1

  const choose = (choiceId: string) => {
    if (chosenId) return
    const choice = dilemma.choices.find((c) => c.id === choiceId)!
    answer(dilemma.id, choiceId)
    react(choice.disposition)
  }

  // Só avança se o dilema da vez já foi respondido (lê o estado atual do store,
  // não o da renderização): um Enter duplo rápido não pode pular dilemas.
  const advance = () => {
    const answers = useTribunalStore.getState().session.answers
    if (isLast) conclude()
    else setCurrentIndex((i) => (answers[DILEMMAS[i].id] ? Math.min(i + 1, DILEMMAS.length - 1) : i))
  }

  const answered = Object.keys(session.answers).length

  return (
    <motion.div exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 0.6 }} className="w-full max-w-2xl">
      {/* Progresso + balança */}
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="hud-label whitespace-nowrap text-form">
            Dilema {roman(currentIndex + 1)} de {roman(DILEMMAS.length)}
          </p>
          <ol className="mt-3 flex gap-1.5" aria-label={`${answered} de ${DILEMMAS.length} dilemas respondidos`}>
            {DILEMMAS.map((d, i) => (
              <li
                key={d.id}
                className={clsx(
                  'h-1 w-6 transition-colors duration-500 sm:w-8',
                  session.answers[d.id] ? 'bg-form' : i === currentIndex ? 'bg-white/40' : 'bg-white/10',
                )}
              />
            ))}
          </ol>
        </div>
        <JudgmentScale disposition={session.disposition} className="w-28 shrink-0 sm:w-36" />
      </div>

      <AnimatePresence mode="wait">
        <DilemmaCard key={dilemma.id} dilemma={dilemma} chosenId={chosenId} isLast={isLast} onChoose={choose} onAdvance={advance} />
      </AnimatePresence>

      <div className="mt-6 border-t border-white/[0.07] pt-6">
        <button type="button" onClick={reset} className="hud-label text-white/55 transition-colors hover:text-form">
          Abandonar julgamento
        </button>
      </div>
    </motion.div>
  )
}

interface DilemmaCardProps {
  dilemma: Dilemma
  chosenId: string | undefined
  isLast: boolean
  onChoose: (choiceId: string) => void
  onAdvance: () => void
}

/**
 * Um dilema na tela. É um componente próprio (com `key` por dilema) para que o
 * foco só seja movido quando ESTE card estiver montado: durante a transição o
 * card anterior ainda está saindo, e mirar nele perderia o foco do teclado.
 */
function DilemmaCard({ dilemma, chosenId, isLast, onChoose, onAdvance }: DilemmaCardProps) {
  const chosen = dilemma.choices.find((c) => c.id === chosenId)
  const nextRef = useRef<HTMLButtonElement>(null)
  const firstChoiceRef = useRef<HTMLButtonElement>(null)
  // Enquanto sai de cena, o card fica inerte: nada de clique, foco ou leitor de tela.
  const isPresent = useIsPresent()

  // Ao montar e ao responder: sem resposta → primeira opção; com resposta → avançar.
  useEffect(() => {
    ;(chosenId ? nextRef : firstChoiceRef).current?.focus({ preventScroll: true })
  }, [chosenId])

  // Atalhos 1–3 / A–C (Enter avança pelo botão focado). Vivem no card, e não na
  // página, para que teclas durante a transição entre dilemas sejam ignoradas.
  useEffect(() => {
    if (!isPresent || chosenId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key.toUpperCase()
      const idx = /^[1-9]$/.test(k) ? Number(k) - 1 : LETTERS.indexOf(k)
      if (idx >= 0 && idx < dilemma.choices.length) onChoose(dilemma.choices[idx].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isPresent, chosenId, dilemma, onChoose])

  return (
    <motion.section
      inert={!isPresent}
      aria-labelledby={`dilemma-${dilemma.id}`}
      initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      exit={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: EASE_DIVINE }}
      className="mt-10"
    >
      <h2 id={`dilemma-${dilemma.id}`} className="font-display text-3xl text-white sm:text-4xl">
        {dilemma.title}
      </h2>
      <p className="mt-5 font-scripture text-2xl leading-snug text-white/85 sm:text-[1.7rem]">{dilemma.prompt}</p>

      <div role="group" aria-label="Respostas" className="mt-8 space-y-3">
        {dilemma.choices.map((c, i) => {
          const isChosen = c.id === chosenId
          return (
            <button
              key={c.id}
              ref={i === 0 ? firstChoiceRef : undefined}
              type="button"
              onClick={() => onChoose(c.id)}
              disabled={Boolean(chosenId)}
              aria-pressed={isChosen}
              className={clsx(
                'group relative flex w-full items-start gap-4 border px-5 py-4 text-left transition-all duration-500',
                isChosen
                  ? 'border-form bg-form/10 text-white shadow-[0_0_30px_-8px_var(--form-glow)]'
                  : chosenId
                    ? 'border-white/5 text-white/40'
                    : 'border-white/10 text-white/85 hover:border-form/60 hover:bg-white/[0.03] hover:text-white',
              )}
            >
              <span className={clsx('hud-label mt-1 shrink-0', isChosen ? 'text-form' : 'text-form/70')}>{LETTERS[i]}</span>
              <span className="text-base leading-relaxed sm:text-lg">{c.text}</span>
            </button>
          )
        })}
      </div>

      {/* Resposta do Zamasu */}
      <div aria-live="polite" className="min-h-[9rem]">
        <AnimatePresence>
          {chosen && (
            <motion.div
              key={chosen.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_DIVINE, delay: 0.15 }}
              className="mt-8 border-l-2 pl-5"
              style={{ borderColor: chosen.disposition > 0 ? '#e8c46a' : chosen.disposition < 0 ? '#b45cff' : 'rgba(255,255,255,.3)' }}
            >
              <p className="font-scripture text-xl leading-snug text-white italic sm:text-2xl">“{chosen.response}”</p>
              <p className="hud-label mt-2 text-white/55">— Zamasu</p>
              <DivineButton ref={nextRef} onClick={onAdvance} glyph={isLast ? '⚖' : '⟶'} className="mt-6">
                {isLast ? 'Ouvir o veredito' : 'Próximo dilema'}
              </DivineButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
