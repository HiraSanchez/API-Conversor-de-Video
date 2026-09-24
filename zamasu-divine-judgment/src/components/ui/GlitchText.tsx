import type { ReactNode } from 'react'

interface GlitchTextProps {
  children: ReactNode
  active: boolean
  className?: string
}

/**
 * Separação cromática + fatias deslocadas quando `active`.
 * As cópias são decorativas (aria-hidden); o texto real fica intacto.
 */
export function GlitchText({ children, active, className }: GlitchTextProps) {
  return (
    <span className={`relative inline-block ${className ?? ''}`}>
      <span className="relative">{children}</span>
      {active && (
        <>
          <span
            aria-hidden
            className="absolute inset-0 text-[#ff5ce1] mix-blend-screen [&_*]:!bg-none [&_*]:!text-[#ff5ce1]"
            style={{ animation: 'glitch-slice 3.1s steps(1) infinite', transform: 'translateX(-2px)' }}
          >
            {children}
          </span>
          <span
            aria-hidden
            className="absolute inset-0 text-[#2ee6a6] mix-blend-screen [&_*]:!bg-none [&_*]:!text-[#2ee6a6]"
            style={{ animation: 'glitch-slice 2.7s steps(1) .4s infinite', transform: 'translateX(2px)' }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  )
}
