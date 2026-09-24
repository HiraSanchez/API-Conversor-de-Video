import { lazy } from 'react'
import { Route, Routes, type Location } from 'react-router'
import { LandingPage } from '@/features/landing/LandingPage'

// Landing é crítica (primeira pintura); o resto é carregado sob demanda.
const SanctuaryPage = lazy(() => import('@/features/sanctuary/SanctuaryPage'))
const ArenaPage = lazy(() => import('@/features/arena/ArenaPage'))
const TribunalPage = lazy(() => import('@/features/tribunal/TribunalPage'))
const TimelinesPage = lazy(() => import('@/features/timelines/TimelinesPage'))
const ArchivePage = lazy(() => import('@/features/archive/ArchivePage'))
const NotFoundPage = lazy(() => import('@/features/sealed/NotFoundPage'))

export function AppRoutes({ location }: { location: Location }) {
  return (
    <Routes location={location}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/santuario" element={<SanctuaryPage />} />
      <Route path="/arena" element={<ArenaPage />} />
      <Route path="/tribunal" element={<TribunalPage />} />
      <Route path="/linhas-temporais" element={<TimelinesPage />} />
      <Route path="/arquivo-hira" element={<ArchivePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
