import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { useId } from 'react'
import { divineEvents } from '@/core/events/divineEvents'
import { FORM_ORDER, FORMS, type FormId } from '@/core/forms/forms'
import { useFormStore } from '@/store/useFormStore'

interface FormSwitcherProps {
  variant?: 'compact' | 'full'
  className?: string
}

/** Troca a forma da entidade — e com ela, a atmosfera do site inteiro. */
export function FormSwitcher({ variant = 'compact', className }: FormSwitcherProps) {
  const active = useFormStore((s) => s.form)
  const setForm = useFormStore((s) => s.setForm)
  const layoutId = useId()

  const select = (id: FormId) => {
    if (id === active) return
    setForm(id)
    const color = FORMS[id].palette.primary
    divineEvents.emit({ type: 'flash', color, intensity: id === 'infinite' ? 0.7 : 0.45 })
    divineEvents.emit({ type: 'shockwave', color })
    divineEvents.emit({ type: 'burst', color, count: 90 })
    divineEvents.emit({ type: 'quake', intensity: id === 'corrupted' ? 1 : 0.5 })
  }

  if (variant === 'compact') {
    return (
      <div role="radiogroup" aria-label="Forma da divindade" className={clsx('flex items-center gap-1 rounded-full border border-white/10 bg-black/30 p-1 backdrop-blur-md', className)}>
        {FORM_ORDER.map((id) => {
          const f = FORMS[id]
          const on = id === active
          return (
            <button
              key={id}
              role="radio"
              aria-checked={on}
              title={`${f.name} — ${f.epithet}`}
              onClick={() => select(id)}
              className={clsx(
                'relative grid h-8 min-w-8 place-items-center rounded-full px-2 font-display text-xs transition-colors duration-500',
                on ? 'text-void' : 'text-white/55 hover:text-white',
              )}
            >
              {on && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-full bg-form shadow-[0_0_18px_var(--form-glow)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{f.sigil}</span>
              <span className="sr-only">{f.name}</span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div role="radiogroup" aria-label="Forma da divindade" className={clsx('grid gap-3 sm:grid-cols-3', className)}>
      {FORM_ORDER.map((id) => {
        const f = FORMS[id]
        const on = id === active
        return (
          <button
            key={id}
            role="radio"
            aria-checked={on}
            onClick={() => select(id)}
            className={clsx(
              'group relative overflow-hidden px-5 py-5 text-left transition-colors duration-700',
              on ? 'text-white' : 'text-white/50 hover:text-white/85',
            )}
          >
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${f.palette.primary}, transparent)`, opacity: on ? 1 : 0.25 }}
            />
            {on && (
              <motion.span
                layoutId={layoutId}
                aria-hidden
                className="absolute inset-0"
                style={{ background: `radial-gradient(120% 100% at 50% 100%, ${f.palette.glow}, transparent 70%)` }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              />
            )}
            <span className="relative flex items-baseline gap-3">
              <span className="font-display text-2xl" style={{ color: f.palette.primary }}>
                {f.sigil}
              </span>
              <span className="font-display text-sm tracking-[0.2em] uppercase">{f.name}</span>
            </span>
            <span className="relative mt-1 block font-scripture text-base italic opacity-80">{f.epithet}</span>
          </button>
        )
      })}
    </div>
  )
}
