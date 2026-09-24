import { AnimatePresence } from 'framer-motion'
import { DilemmaStage } from './DilemmaStage'
import { TribunalSummons } from './TribunalSummons'
import { VerdictReveal } from './VerdictReveal'
import { DivineFigure } from '@/components/character/DivineFigure'
import { PageFrame } from '@/components/layout/PageFrame'
import { useDepth, usePointerParallax } from '@/hooks/usePointerParallax'
import { useTribunalStore } from '@/store/useTribunalStore'

/**
 * Tribunal Divino: convocação → sete dilemas → veredito.
 * O estado vive em useTribunalStore (persistido): recarregar não perde o julgamento.
 */
export default function TribunalPage() {
  const stage = useTribunalStore((s) => s.stage)
  const { x, y } = usePointerParallax()
  const figX = useDepth(x, 14)
  const figY = useDepth(y, 8)

  return (
    <PageFrame>
      <section className="relative flex min-h-dvh items-start overflow-hidden px-4 pb-24 pt-32 sm:px-10 lg:items-center lg:px-16">
        {/* O juiz: sempre presente, apontando para quem é julgado */}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-end lg:pr-[6vw]">
          <DivineFigure
            pose="judgment"
            offsetX={figX}
            offsetY={figY}
            className="h-[55dvh] opacity-20 sm:opacity-30 lg:h-[74dvh] lg:opacity-90"
          />
        </div>

        {stage !== 'summons' && <h1 className="sr-only">Tribunal Divino</h1>}

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <AnimatePresence mode="wait">
            {stage === 'summons' && <TribunalSummons key="summons" />}
            {stage === 'trial' && <DilemmaStage key="trial" />}
            {stage === 'verdict' && <VerdictReveal key="verdict" />}
          </AnimatePresence>
        </div>
      </section>
    </PageFrame>
  )
}
