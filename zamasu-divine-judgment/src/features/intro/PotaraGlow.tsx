import { AnimatePresence, motion } from 'framer-motion'
import { EASE_DIVINE, EASE_SURGE } from '@/core/motion/easings'

/**
 * Dois brincos Potara vindos do vazio convergem e se fundem num clarão
 * que se abre no halo da entidade.
 */
export function PotaraGlow({ active, merged }: { active: boolean; merged: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2"
          exit={{ opacity: 0, scale: 2.5, transition: { duration: 1.4, ease: EASE_DIVINE } }}
        >
          {[-1, 1].map((side) => (
            <motion.div
              key={side}
              className="absolute left-0 top-0"
              initial={{ x: side * 160, opacity: 0, scale: 0.6 }}
              animate={merged ? { x: 0, opacity: 0, scale: 0.2 } : { x: side * 26, opacity: 1, scale: 1 }}
              transition={{ duration: merged ? 0.5 : 1.5, ease: merged ? EASE_SURGE : EASE_DIVINE }}
            >
              <Earring />
            </motion.div>
          ))}
          <AnimatePresence>
            {merged && (
              <motion.div
                className="absolute left-0 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                style={{ boxShadow: '0 0 60px 30px rgba(46,230,166,.7), 0 0 140px 70px rgba(232,196,106,.45)' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.6, 1], opacity: 1 }}
                transition={{ duration: 0.9, ease: EASE_SURGE }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Earring() {
  return (
    <svg viewBox="-30 -40 60 80" className="h-20 w-14 -translate-x-1/2 -translate-y-1/2" style={{ filter: 'drop-shadow(0 0 12px rgba(46,230,166,.9))' }}>
      <circle cx="0" cy="-18" r="9" fill="none" stroke="#e8c46a" strokeWidth="3" />
      <circle cx="0" cy="12" r="13" fill="#2ee6a6" />
      <circle cx="-4" cy="7" r="4" fill="#d9fff1" opacity=".8" />
      <path d="M0 -9 L0 -1" stroke="#e8c46a" strokeWidth="3" />
    </svg>
  )
}
