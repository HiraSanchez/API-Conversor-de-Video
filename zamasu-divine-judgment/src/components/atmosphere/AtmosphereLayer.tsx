import { AnimatePresence, motion } from 'framer-motion'
import { CosmicBackdrop } from './CosmicBackdrop'
import { CosmicScale } from './CosmicScale'
import { DimensionalCracks } from './DimensionalCracks'
import { DivineRays } from './DivineRays'
import { GlitchOverlay } from './GlitchOverlay'
import { useActiveForm } from '@/hooks/useActiveForm'

const layerFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, transition: { duration: 0.9 } },
}

/** Compõe as camadas atmosféricas de acordo com os efeitos da forma ativa. */
export function AtmosphereLayer() {
  const form = useActiveForm()
  const fx = form.effects

  return (
    <>
      <CosmicBackdrop />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[2]">
        <AnimatePresence>
          {fx.rays && (
            <motion.div key="rays" className="absolute inset-0" {...layerFade}>
              <DivineRays />
            </motion.div>
          )}
          {fx.cosmicScale && (
            <motion.div key="cosmic" className="absolute inset-0" {...layerFade}>
              <CosmicScale />
            </motion.div>
          )}
          {fx.cracks && (
            <motion.div key="cracks" className="absolute inset-0" {...layerFade}>
              <DimensionalCracks />
            </motion.div>
          )}
          {fx.glitch && (
            <motion.div key="glitch" className="absolute inset-0" {...layerFade}>
              <GlitchOverlay />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
