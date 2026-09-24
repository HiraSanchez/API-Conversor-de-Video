import { motion, type MotionValue } from 'framer-motion'
import { CharacterArt } from './CharacterArt'
import { DivineHalo } from './DivineHalo'
import { KiAura } from './KiAura'
import { maskLayers } from './maskLayers'
import { ZamasuSilhouette } from './ZamasuSilhouette'
import { CHARACTER, type ArtPose } from '@/data/character'
import { useActiveForm } from '@/hooks/useActiveForm'

interface DivineFigureProps {
  /** 0–1: controla a presença (a intro usa isso para "materializar" a entidade). */
  presence?: number
  /** 0–1: força da aura; por padrão vem da forma ativa. */
  aura?: number
  /** Qual arte usar. `judgment` só existe como arte; sem ela, cai na silhueta de corpo inteiro. */
  pose?: ArtPose
  offsetX?: MotionValue<number>
  offsetY?: MotionValue<number>
  className?: string
}

/** Enquadramento de cada pose: proporção, halo e como as bordas se dissolvem na cena. */
const POSES: Record<ArtPose, { aspect: string; halo: boolean; mask: string[] }> = {
  full: {
    aspect: 'aspect-[4/7]',
    halo: true,
    mask: ['linear-gradient(to bottom, black 76%, transparent 98%)'],
  },
  judgment: {
    // A arte é cortada na esquerda (punho), no topo e embaixo: as três bordas somem em degradê.
    aspect: 'aspect-[4/5]',
    halo: false,
    mask: [
      'linear-gradient(to right, transparent 0%, black 14%)',
      'linear-gradient(to bottom, transparent 0%, black 8%, black 70%, transparent 97%)',
    ],
  },
}

/** Personagem + aura, reagindo à forma ativa. Peça central das telas-herói. */
export function DivineFigure({ presence = 1, aura, pose = 'full', offsetX, offsetY, className }: DivineFigureProps) {
  const form = useActiveForm()
  const auraLevel = (aura ?? form.effects.aura) * presence
  const infinite = form.id === 'infinite'
  const src = CHARACTER.art[pose]
  const frame = POSES[src ? pose : 'full']

  return (
    <motion.div style={{ x: offsetX, y: offsetY }} className={`relative ${frame.aspect} ${className ?? ''}`}>
      <KiAura intensity={auraLevel} className="absolute -inset-[18%]" />
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{
          opacity: presence,
          filter: `blur(${(1 - presence) * 18}px) brightness(${0.4 + presence * 0.6})`,
          // Forma Infinita: o corpo se agiganta no cosmos.
          scale: infinite ? 1.06 : 1,
          // Com presença total o filtro é removido: filtro num ancestral de algo que
          // flutua obriga o navegador a refazê-lo a cada quadro.
          transitionEnd: presence >= 1 ? { filter: 'none' } : undefined,
        }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="relative h-full w-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {frame.halo && <DivineHalo />}
          {src ? (
            <CharacterArt src={src} form={form.id} alt={CHARACTER.name} mask={frame.mask} className="h-full w-full" />
          ) : (
            <div className="h-full w-full" style={maskLayers(frame.mask)}>
              <ZamasuSilhouette
                form={form.id}
                className={`h-full w-full transition-opacity duration-1000 ${infinite ? 'opacity-70 mix-blend-screen' : ''}`}
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
