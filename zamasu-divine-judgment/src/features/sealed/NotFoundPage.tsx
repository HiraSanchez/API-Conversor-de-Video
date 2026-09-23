import { PageFrame } from '@/components/layout/PageFrame'
import { DivineButton } from '@/components/ui/DivineButton'

export default function NotFoundPage() {
  return (
    <PageFrame>
      <section className="grid min-h-dvh place-items-center px-4 text-center">
        <div>
          <p className="hud-label text-cosmic">Erro 404 · Realidade inexistente</p>
          <h1 className="text-divine-gradient mt-5 font-display text-5xl sm:text-7xl">Apagado.</h1>
          <p className="mx-auto mt-6 max-w-lg font-scripture text-2xl text-white/65 italic">
            “Esta linha temporal não existe mais. Talvez nunca tenha existido.”
          </p>
          <div className="mt-10 flex justify-center">
            <DivineButton to="/" glyph="◈">
              Retornar ao Portal
            </DivineButton>
          </div>
        </div>
      </section>
    </PageFrame>
  )
}
