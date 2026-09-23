import { motion, type MotionValue } from 'framer-motion'
import { KiAura } from './KiAura'
import { ZamasuSilhouette } from './ZamasuSilhouette'
import { CHARACTER } from '@/data/character'
import { useActiveForm } from '@/hooks/useActiveForm'

interface DivineFigureProps {
  /** 0–1: controla a presença (a intro usa isso para "materializar" a entidade). */
  presence?: number
  /** 0–1: força da aura; por padrão vem da forma ativa. */
  aura?: number
  offsetX?: MotionValue<number>
  offsetY?: MotionValue<number>
  className?: string
}

/** Silhueta + aura, reagindo à forma ativa. Peça central das telas-herói. */
export function DivineFigure({ presence = 1, aura, offsetX, offsetY, className }: DivineFigureProps) {
  const form = useActiveForm()
  const auraLevel = (aura ?? form.effects.aura) * presence
  const infinite = form.id === 'infinite'

  return (
    <motion.div style={{ x: offsetX, y: offsetY }} className={`relative aspect-[4/7] ${className ?? ''}`}>
      <KiAura intensity={auraLevel} className="absolute -inset-[18%]" />
      <motion.div
        className="relative h-full w-full"
        // Máscara só no corpo (não na aura): os pés dissolvem no chão sem recortar o brilho.
        style={{
          maskImage: 'linear-gradient(to bottom, black 72%, transparent 98%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 72%, transparent 98%)',
        }}
        initial={false}
        animate={{
          opacity: presence,
          filter: `blur(${(1 - presence) * 18}px) brightness(${0.4 + presence * 0.6})`,
          // Forma Infinita: o corpo se dissolve e se agiganta no cosmos.
          scale: infinite ? 1.08 : 1,
        }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="h-full w-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ZamasuSilhouette
            form={form.id}
            src={CHARACTER.portraits[form.id]}
            className={`h-full w-full transition-opacity duration-1000 ${infinite ? 'opacity-70 mix-blend-screen' : ''}`}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
