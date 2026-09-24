import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import type { ReactNode, Ref } from 'react'
import { Link } from 'react-router'

type Variant = 'primary' | 'ghost'

interface DivineButtonProps {
  children: ReactNode
  variant?: Variant
  to?: string
  onClick?: () => void
  glyph?: string
  className?: string
  disabled?: boolean
  /** React 19: ref como prop. Só vale para a variante botão (sem `to`). */
  ref?: Ref<HTMLButtonElement>
}

const MotionLink = motion.create(Link)

/** Recorte angular dos cantos: lembra placas de interface de jogo, não botões de site. */
const CLIP = 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)'

export function DivineButton({ children, variant = 'primary', to, onClick, glyph, className, disabled, ref }: DivineButtonProps) {
  const classes = clsx(
    'group relative inline-flex items-center justify-center gap-3 whitespace-nowrap px-7 py-4 font-display text-sm font-semibold tracking-[0.22em] uppercase',
    'transition-[color,box-shadow] duration-500 ease-[var(--ease-divine)] disabled:pointer-events-none disabled:opacity-40',
    variant === 'primary'
      ? 'text-void shadow-[0_0_40px_-6px_var(--form-glow)] hover:shadow-[0_0_70px_-4px_var(--form-glow)]'
      : 'text-form-accent hover:text-white',
    className,
  )

  const inner = (
    <>
      {/* Base */}
      <span
        aria-hidden
        className={clsx(
          'absolute inset-0 transition-opacity duration-500',
          variant === 'primary' ? 'bg-[linear-gradient(135deg,var(--form-accent),var(--form-primary)_55%,color-mix(in_oklab,var(--form-primary)_60%,#000))]' : 'bg-white/[0.03] backdrop-blur-sm',
        )}
        style={{ clipPath: CLIP }}
      />
      {variant === 'ghost' && (
        <span aria-hidden className="absolute inset-0 border border-form/50 transition-colors duration-500 group-hover:border-form" style={{ clipPath: CLIP }} />
      )}
      {/* Brilho que atravessa no hover */}
      <span aria-hidden className="absolute inset-0 overflow-hidden" style={{ clipPath: CLIP }}>
        <span className="absolute -inset-y-2 -left-1/2 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent)] transition-transform duration-[900ms] ease-[var(--ease-divine)] group-hover:translate-x-[420%]" />
      </span>
      {glyph && <span className="relative text-base leading-none">{glyph}</span>}
      <span className="relative">{children}</span>
    </>
  )

  const motionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 22 },
  }

  if (to) {
    return (
      <MotionLink to={to} onClick={onClick} className={classes} {...motionProps}>
        {inner}
      </MotionLink>
    )
  }
  return (
    <motion.button ref={ref} type="button" onClick={onClick} disabled={disabled} className={classes} {...motionProps}>
      {inner}
    </motion.button>
  )
}
