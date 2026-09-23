import { motion } from 'framer-motion'
import { EASE_DIVINE } from '@/core/motion/easings'

interface RevealTextProps {
  text: string
  show: boolean
  delay?: number
  stagger?: number
  className?: string
  /** Aplicada em cada palavra — use para gradientes com background-clip:text. */
  wordClassName?: string
  as?: 'span' | 'p' | 'h1' | 'h2'
}

/** Revela palavra a palavra, saindo do desfoque — como se a frase se materializasse. */
export function RevealText({ text, show, delay = 0, stagger = 0.08, className, wordClassName, as = 'span' }: RevealTextProps) {
  const Tag = motion[as]
  const words = text.split(' ')
  return (
    <Tag className={className}>
      {/* Texto real para leitores de tela; as palavras animadas são só visuais. */}
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${wordClassName ?? ''}`}
            initial={false}
            animate={
              show
                ? { y: '0%', opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }
                : { y: '60%', opacity: 0, filter: 'blur(12px)' }
            }
            transition={{ duration: 1.1, ease: EASE_DIVINE, delay: show ? delay + i * stagger : 0 }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
