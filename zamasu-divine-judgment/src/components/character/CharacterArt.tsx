import { AnimatePresence, motion } from 'framer-motion'
import { maskLayers } from './maskLayers'
import type { FormId } from '@/core/forms/forms'

interface CharacterArtProps {
  src: string
  form: FormId
  alt: string
  /** Camadas de máscara das bordas (interseção): a arte recortada se dissolve na cena. */
  mask: string[]
  className?: string
}

/** A própria arte vira máscara de outras camadas: efeitos ficam só dentro do personagem. */
const maskedBy = (src: string, mask: string[]) =>
  maskLayers(
    [`url(${src})`, ...mask],
    ['contain', ...mask.map(() => '100% 100%')],
    ['bottom center', ...mask.map(() => 'center')],
  )

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 1.2 } }

/**
 * Arte real do personagem com um tratamento por forma:
 * - Divina: brilho dourado de contorno.
 * - Corrompida: tinta roxa tomando metade do corpo + aberração cromática em falhas.
 * - Infinita: o cosmos aparece "dentro" do corpo, que perde a solidez.
 * Todas as camadas extras são estáticas ou animam só opacity/clip-path.
 */
export function CharacterArt({ src, form, alt, mask, className }: CharacterArtProps) {
  const edge = maskLayers(mask)
  const glow =
    form === 'divine'
      ? 'drop-shadow(0 0 14px rgba(232,196,106,.45))'
      : form === 'corrupted'
        ? 'drop-shadow(0 0 16px rgba(180,92,255,.6))'
        : 'drop-shadow(0 0 22px rgba(122,245,208,.55))'

  return (
    <div className={`relative ${className ?? ''}`}>
      {/* Aberração cromática (só na Corrompida): cópias tingidas e deslocadas, piscando em fatias */}
      <AnimatePresence>
        {form === 'corrupted' && (
          <motion.div key="chroma" aria-hidden className="absolute inset-0" style={edge} {...fade}>
            <img
              src={src}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full object-contain object-bottom mix-blend-screen"
              style={{
                filter: 'brightness(.7) sepia(1) saturate(8) hue-rotate(265deg)',
                transform: 'translateX(-5px)',
                animation: 'glitch-slice 3.4s steps(1) infinite',
              }}
            />
            <img
              src={src}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full object-contain object-bottom mix-blend-screen"
              style={{
                filter: 'brightness(.7) sepia(1) saturate(8) hue-rotate(120deg)',
                transform: 'translateX(5px)',
                animation: 'glitch-slice 2.9s steps(1) .6s infinite',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* A arte */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="relative h-full w-full object-contain object-bottom transition-[filter,opacity] duration-1000"
        style={{ ...edge, filter: glow, opacity: form === 'infinite' ? 0.82 : 1 }}
      />

      {/* Corrupção: roxo avança pela metade direita do corpo (esquerda do observador) */}
      <AnimatePresence>
        {form === 'corrupted' && (
          <motion.div
            key="corruption"
            aria-hidden
            className="absolute inset-0 mix-blend-color"
            style={maskedBy(src, mask)}
            {...fade}
          >
            {/* Só a metade esquerda (do observador) é tingida; a borda pulsa como carne instável. */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(100deg, rgba(150,40,255,.95) 0%, rgba(150,40,255,.8) 36%, rgba(150,40,255,.35) 46%, transparent 52%)',
                animation: 'crack-pulse 2.4s ease-in-out infinite alternate',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Infinita: nebulosa e estrelas visíveis através do corpo */}
      <AnimatePresence>
        {form === 'infinite' && (
          <motion.div
            key="cosmos"
            aria-hidden
            className="absolute inset-0 mix-blend-screen"
            style={{
              ...maskedBy(src, mask),
              background: [
                'radial-gradient(1.5px 1.5px at 20% 30%, #fff, transparent)',
                'radial-gradient(1px 1px at 70% 20%, #fff, transparent)',
                'radial-gradient(1.5px 1.5px at 45% 60%, #fff, transparent)',
                'radial-gradient(1px 1px at 80% 75%, #fff, transparent)',
                'radial-gradient(1px 1px at 30% 85%, #fff, transparent)',
                'radial-gradient(60% 40% at 50% 45%, rgba(139,123,255,.55), transparent 70%)',
                'radial-gradient(50% 35% at 45% 75%, rgba(122,245,208,.45), transparent 70%)',
              ].join(', '),
              backgroundSize: '90px 90px, 70px 70px, 110px 110px, 60px 60px, 80px 80px, 100% 100%, 100% 100%',
            }}
            {...fade}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
