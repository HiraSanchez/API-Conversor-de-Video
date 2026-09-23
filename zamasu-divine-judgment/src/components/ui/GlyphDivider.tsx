export function GlyphDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-4 text-form ${className ?? ''}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current opacity-40" />
      <span className="h-2 w-2 rotate-45 border border-current" />
      <span className="h-1 w-1 rotate-45 bg-current" />
      <span className="h-2 w-2 rotate-45 border border-current" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current opacity-40" />
    </div>
  )
}
