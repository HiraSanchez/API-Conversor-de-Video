/** Marca do projeto: anel dourado (divindade) + Z esmeralda (Zamasu) + ponto roxo (corrupção). */
export function Sigil({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="21" fill="none" stroke="#e8c46a" strokeWidth="2" opacity=".85" />
      <circle cx="32" cy="32" r="27" fill="none" style={{ stroke: 'var(--form-primary)' }} strokeWidth=".75" opacity=".5" strokeDasharray="2 5" />
      <path d="M21 22h22L23 42h20" fill="none" style={{ stroke: 'var(--form-secondary)' }} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="8" r="2.6" fill="#b45cff" />
    </svg>
  )
}
