import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, useEffect } from 'react'
import { useLocation } from 'react-router'
import { AppRoutes } from './router'
import { AtmosphereLayer } from '@/components/atmosphere/AtmosphereLayer'
import { ScreenFx } from '@/components/atmosphere/ScreenFx'
import { RealmLoading } from '@/components/layout/RealmLoading'
import { TopBar } from '@/components/layout/TopBar'
import { formToCssVars } from '@/core/forms/forms'
import { ParticleField } from '@/core/particles/ParticleField'
import { useActiveForm } from '@/hooks/useActiveForm'
import { useQuake } from '@/hooks/useQuake'
import { useExperienceStore } from '@/store/useExperienceStore'

/**
 * Casca persistente: atmosfera, partículas e navegação sobrevivem às trocas
 * de rota — só o conteúdo do reino é substituído.
 */
export function Shell() {
  const form = useActiveForm()
  const location = useLocation()
  const quake = useQuake()
  const introDone = useExperienceStore((s) => s.introDone)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.form = form.id
    for (const [k, v] of Object.entries(formToCssVars(form))) root.style.setProperty(k, v)
  }, [form])

  const onLanding = location.pathname === '/'

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-void focus:px-4 focus:py-2"
      >
        Pular para o conteúdo
      </a>
      <AtmosphereLayer />
      <ParticleField />
      <TopBar hidden={onLanding && !introDone} />

      <motion.div animate={quake}>
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          <Suspense key={location.pathname} fallback={<RealmLoading />}>
            <AppRoutes location={location} />
          </Suspense>
        </AnimatePresence>
      </motion.div>

      <ScreenFx />
    </>
  )
}
