import { FormChamber } from './FormChamber'
import { OriginChronicle } from './OriginChronicle'
import { PowerCodex } from './PowerCodex'
import { SanctuaryHero } from './SanctuaryHero'
import { SanctuaryOutro } from './SanctuaryOutro'
import { PageFrame } from '@/components/layout/PageFrame'

export default function SanctuaryPage() {
  return (
    <PageFrame>
      <SanctuaryHero />
      <OriginChronicle />
      <FormChamber />
      <PowerCodex />
      <SanctuaryOutro />
    </PageFrame>
  )
}
