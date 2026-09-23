import { CANON_TIMELINE } from './canon'
import { realmById } from '@/app/realms'
import { FORMS } from '@/core/forms/forms'
import { SealedModule } from '@/features/sealed/SealedModule'

const TONE_COLOR = {
  divine: FORMS.divine.palette.primary,
  corrupted: FORMS.corrupted.palette.primary,
  infinite: FORMS.infinite.palette.primary,
  mortal: '#9aa0a6',
} as const

export default function TimelinesPage() {
  return (
    <SealedModule
      realm={realmById('timelines')}
      decree="O tempo é apenas mais uma criação imperfeita. Eu já o apaguei uma vez."
      promises={[
        'Timeline interativa da linha canônica',
        'Pontos de divergência: crie linhas alternativas a partir de qualquer evento',
        'Linhas salvas no Hira’s Archive',
        'Comparação lado a lado entre realidades',
      ]}
      previewLabel={CANON_TIMELINE.name}
      preview={
        <ol className="relative grid gap-8 text-left sm:grid-cols-6 sm:gap-4">
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-gradient-to-r from-transparent via-white/20 to-transparent sm:block" />
          {CANON_TIMELINE.nodes.map((n) => (
            <li key={n.id} className="relative">
              <span
                className="relative block h-3.5 w-3.5 rotate-45 border bg-void"
                style={{ borderColor: TONE_COLOR[n.tone], boxShadow: `0 0 12px ${TONE_COLOR[n.tone]}` }}
              />
              <p className="hud-label mt-4 text-white/35">{n.era}</p>
              <p className="mt-1 font-display text-base text-white">{n.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/50">{n.summary}</p>
            </li>
          ))}
        </ol>
      }
    />
  )
}
