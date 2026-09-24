import { DILEMMAS } from './dilemmas'
import { realmById } from '@/app/realms'
import { SealedModule } from '@/features/sealed/SealedModule'

export default function TribunalPage() {
  const first = DILEMMAS[0]
  return (
    <SealedModule
      realm={realmById('tribunal')}
      decree="Antes de julgar, eu observo. Cada resposta sua já está sendo pesada."
      promises={[
        `${DILEMMAS.length} dilemas iniciais sobre justiça, poder e sacrifício`,
        'Quatro eixos morais: ordem, misericórdia, pureza e liberdade',
        'Zamasu reage ao conjunto das suas escolhas, não a respostas isoladas',
        'Veredito final: digno, tolerado, mortal — ou condenado',
      ]}
      previewLabel="Primeiro dilema · somente leitura"
      preview={
        <div className="mx-auto max-w-2xl text-left">
          <p className="font-display text-xl leading-snug text-white sm:text-2xl">{first.prompt}</p>
          <ol className="mt-6 space-y-2">
            {first.choices.map((c, i) => (
              <li key={c.id} className="flex gap-4 border-l border-white/10 py-2 pl-4 text-white/55">
                <span className="hud-label text-form/70">{String.fromCharCode(65 + i)}</span>
                {c.text}
              </li>
            ))}
          </ol>
        </div>
      }
    />
  )
}
