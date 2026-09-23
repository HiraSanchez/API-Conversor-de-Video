import { realmById } from '@/app/realms'
import { SealedModule } from '@/features/sealed/SealedModule'

const SHELVES = [
  { glyph: '◇', label: 'Personagens', note: 'Crie guerreiros com status e lore próprios' },
  { glyph: '⚔', label: 'Batalhas', note: 'Registros completos das lutas na Arena' },
  { glyph: '⌬', label: 'Linhas temporais', note: 'Realidades alternativas que você escreveu' },
  { glyph: '✎', label: 'Criações', note: 'Textos, ideias e fragmentos livres' },
]

export default function ArchivePage() {
  return (
    <SealedModule
      realm={realmById('archive')}
      decree="Há alguém que observa as realidades sem pertencer a nenhuma delas. Nem mesmo eu consigo apagá-lo."
      promises={[
        'Área de autoria de Hira, o observador das realidades',
        'Criações salvas localmente, prontas para sincronizar com um backend',
        'Exportar e importar o arquivo completo',
        'Conectado à Arena, ao Tribunal e às Linhas Temporais',
      ]}
      previewLabel="Estantes do arquivo"
      preview={
        <ul className="grid gap-px overflow-hidden border border-white/[0.06] bg-white/[0.06] text-left sm:grid-cols-4">
          {SHELVES.map((s) => (
            <li key={s.label} className="bg-void/90 p-6">
              <span className="font-display text-3xl text-gold/80">{s.glyph}</span>
              <p className="mt-4 font-display tracking-wide text-white">{s.label}</p>
              <p className="mt-1 text-xs text-white/45">{s.note}</p>
              <p className="hud-label mt-4 text-white/25">0 registros</p>
            </li>
          ))}
        </ul>
      }
    />
  )
}
