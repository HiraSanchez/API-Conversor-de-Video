/**
 * Falhas de sinal intermitentes: fatias deslocadas e separação cromática.
 * CSS puro (clip-path + keyframes) para não pesar o main thread.
 */
export function GlitchOverlay() {
  return (
    // Sem mix-blend-mode: sobre fundo quase preto o resultado é o mesmo e a composição fica bem mais barata.
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,92,225,0.08), transparent 30%, transparent 70%, rgba(46,230,166,0.08))',
          animation: 'glitch-slice 5.5s steps(1) infinite',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(180,92,255,0.18), transparent)',
          animation: 'glitch-slice 7.3s steps(1) 1.7s infinite',
        }}
      />
      {/* Opacidade no wrapper: a animação `flicker` controla a do filho sem sobrescrever o limite. */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 4px)',
            animation: 'flicker 6s infinite',
          }}
        />
      </div>
    </div>
  )
}
