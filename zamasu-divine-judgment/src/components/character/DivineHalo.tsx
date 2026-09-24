import { useId } from 'react'

/**
 * Halo divino às costas da entidade, no mesmo sistema de coordenadas (400×700)
 * da silhueta e da arte de corpo inteiro: centro em (50%, 29.3%).
 * Pulsa via transform do próprio <svg> (compositor), sem redesenhar o blur.
 */
export function DivineHalo({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg
      viewBox="0 0 400 700"
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ''}`}
      style={{ transformOrigin: '50% 29.3%', animation: 'breathe 6s ease-in-out infinite' }}
    >
      <defs>
        <radialGradient id={`halo-${uid}`}>
          <stop offset="0.8" style={{ stopColor: 'var(--form-accent)', stopOpacity: 0 }} />
          <stop offset="0.9" style={{ stopColor: 'var(--form-accent)', stopOpacity: 0.9 }} />
          <stop offset="1" style={{ stopColor: 'var(--form-primary)', stopOpacity: 0 }} />
        </radialGradient>
        <filter id={`soft-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <circle cx="200" cy="205" r="128" fill={`url(#halo-${uid})`} />
      <circle cx="200" cy="205" r="118" fill="none" style={{ stroke: 'var(--form-primary)' }} strokeWidth="1.5" opacity="0.8" />
      <circle cx="200" cy="205" r="118" fill="none" style={{ stroke: 'var(--form-accent)' }} strokeWidth="6" opacity="0.35" filter={`url(#soft-${uid})`} />
    </svg>
  )
}
