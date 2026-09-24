import { motion } from 'framer-motion'
import { DivineButton } from '@/components/ui/DivineButton'
import { GlyphDivider } from '@/components/ui/GlyphDivider'
import { revealUp } from '@/core/motion/easings'

export function SanctuaryOutro() {
  return (
    <section className="relative px-4 pb-24 pt-16 sm:px-10 lg:px-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20%' }}
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <GlyphDivider className="w-full" />
        <motion.p variants={revealUp} custom={0} className="mt-16 font-scripture text-2xl leading-snug text-white/70 italic sm:text-3xl">
          Você conheceu a divindade.
        </motion.p>
        <motion.p variants={revealUp} custom={1} className="mt-2 font-display text-3xl font-semibold sm:text-5xl">
          <span className="text-divine-gradient glow-text">Agora, seja julgado por ela.</span>
        </motion.p>
        <motion.div variants={revealUp} custom={2} className="mt-12 flex flex-col gap-4 sm:flex-row">
          <DivineButton to="/tribunal" glyph="⚖">
            Tribunal Divino
          </DivineButton>
          <DivineButton to="/arena" variant="ghost" glyph="⚔">
            Arena Divina
          </DivineButton>
        </motion.div>
      </motion.div>
    </section>
  )
}
