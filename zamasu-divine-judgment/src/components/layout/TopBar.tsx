import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { REALMS } from '@/app/realms'
import { FormSwitcher } from '@/components/ui/FormSwitcher'
import { Sigil } from '@/components/ui/Sigil'
import { EASE_DIVINE } from '@/core/motion/easings'

export function TopBar({ hidden = false }: { hidden?: boolean }) {
  const { pathname } = useLocation()
  // O menu pertence à rota em que foi aberto: navegar o fecha sem efeito extra.
  const [openAt, setOpenAt] = useState<string | null>(null)
  const open = openAt === pathname
  const setOpen = (value: boolean | ((v: boolean) => boolean)) =>
    setOpenAt((typeof value === 'function' ? value(open) : value) ? pathname : null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenAt(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.header
        initial={false}
        animate={{ opacity: hidden ? 0 : 1, y: hidden ? -20 : 0 }}
        transition={{ duration: 1, ease: EASE_DIVINE }}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 bg-gradient-to-b from-void via-void/80 to-transparent px-4 pb-10 pt-4 sm:px-8"
        style={{ pointerEvents: hidden ? 'none' : 'auto' }}
      >
        <Link to="/" className="group flex items-center gap-3" aria-label="Project Zamasu — início">
          <Sigil className="h-9 w-9 transition-transform duration-700 group-hover:rotate-[30deg]" />
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-sm font-semibold tracking-[0.3em] text-white">ZAMASU</span>
            <span className="hud-label block text-[0.55rem] text-form">Divine Judgment</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <FormSwitcher />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="realm-menu"
            className="group relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-black/30 backdrop-blur-md transition-colors hover:border-form/60"
          >
            <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
            <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 0 : -3 }} className="absolute h-px w-4 bg-white" />
            <motion.span animate={{ rotate: open ? -45 : 0, y: open ? 0 : 3 }} className="absolute h-px w-4 bg-white" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>{open && <RealmMenu onClose={() => setOpen(false)} current={pathname} />}</AnimatePresence>
    </>
  )
}

function RealmMenu({ onClose, current }: { onClose: () => void; current: string }) {
  return (
    <motion.nav
      id="realm-menu"
      aria-label="Reinos do santuário"
      className="fixed inset-0 z-40 flex items-center overflow-y-auto bg-void/85 px-6 py-24 backdrop-blur-xl sm:px-16"
      initial={{ clipPath: 'circle(0% at calc(100% - 3rem) 2.5rem)' }}
      animate={{ clipPath: 'circle(150% at calc(100% - 3rem) 2.5rem)' }}
      exit={{ clipPath: 'circle(0% at calc(100% - 3rem) 2.5rem)' }}
      transition={{ duration: 0.8, ease: EASE_DIVINE }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <ol className="mx-auto w-full max-w-5xl">
        {REALMS.map((realm, i) => {
          const active = realm.path === current
          const sealed = realm.status === 'sealed'
          return (
            <motion.li
              key={realm.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: EASE_DIVINE }}
              className="border-b border-white/[0.06]"
            >
              <Link to={realm.path} className="group flex items-baseline gap-4 py-4 sm:gap-8 sm:py-5">
                <span className="hud-label w-8 shrink-0 text-white/35">{String(i).padStart(2, '0')}</span>
                <span
                  className={`font-display text-2xl transition-colors duration-500 sm:text-4xl ${
                    active ? 'text-form' : sealed ? 'text-white/40 group-hover:text-white/70' : 'text-white group-hover:text-form'
                  }`}
                >
                  <span className="mr-3 text-form/70">{realm.glyph}</span>
                  {realm.label}
                </span>
                <span className="ml-auto hidden text-right md:block">
                  <span className="block font-scripture text-lg text-white/55 italic">{realm.summary}</span>
                  {sealed && <span className="hud-label text-cosmic">Selado · Fase {realm.phase}</span>}
                </span>
              </Link>
            </motion.li>
          )
        })}
      </ol>
    </motion.nav>
  )
}
