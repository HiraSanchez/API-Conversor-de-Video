import { CHALLENGERS, ZAMASU_BOSS } from './fighters'
import type { CombatStats } from './types'
import { realmById } from '@/app/realms'
import { SealedModule } from '@/features/sealed/SealedModule'

const STAT_LABELS: [keyof CombatStats, string][] = [
  ['hp', 'Vida'],
  ['ki', 'Ki'],
  ['attack', 'Ataque'],
  ['defense', 'Defesa'],
  ['speed', 'Veloc.'],
]

export default function ArenaPage() {
  return (
    <SealedModule
      realm={realmById('arena')}
      decree="Desafiar-me? Nenhum de vocês é digno… ainda. Quando a arena se abrir, eu mesmo escolherei quem cai primeiro."
      promises={[
        'Batalhas por turnos com triângulo de posturas: assalto, guarda e foco',
        'Economia de Ki e recargas: poder sem estratégia é desperdício',
        'Efeitos de status: quebra de guarda, atordoamento, corrupção',
        'IA de Zamasu que aprende com os seus padrões',
      ]}
      previewLabel={`Desafiantes registrados · ${CHALLENGERS.length} contra 1`}
      preview={
        // Região rolável focável: no celular a tabela rola na horizontal e precisa ser alcançável pelo teclado.
        <div className="overflow-x-auto pb-2" tabIndex={0} role="region" aria-label="Atributos dos desafiantes">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="hud-label text-white/55">
                <th className="py-3 pr-4 font-normal">Guerreiro</th>
                {STAT_LABELS.map(([, label]) => (
                  <th key={label} className="px-2 py-3 font-normal">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[ZAMASU_BOSS, ...CHALLENGERS].map((f) => (
                <tr key={f.id} className="border-t border-white/[0.06]">
                  <td className="py-3 pr-4">
                    <span className="font-display tracking-wide text-white" style={{ textShadow: `0 0 16px ${f.color}66` }}>
                      {f.name}
                    </span>
                    <span className="ml-2 font-scripture text-white/55 italic">{f.title}</span>
                  </td>
                  {STAT_LABELS.map(([key]) => (
                    <td key={key} className="px-2 py-3">
                      <span className="block h-1 w-full max-w-16 bg-white/[0.06]">
                        <span className="block h-full" style={{ width: `${f.stats[key]}%`, background: f.color }} />
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    />
  )
}
