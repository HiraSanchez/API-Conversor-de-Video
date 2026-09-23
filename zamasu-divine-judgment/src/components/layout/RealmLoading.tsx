import { Sigil } from '@/components/ui/Sigil'

export function RealmLoading() {
  return (
    <div role="status" className="relative z-10 grid min-h-dvh place-items-center">
      <div className="flex flex-col items-center gap-4">
        <Sigil className="h-12 w-12 animate-[slow-spin_6s_linear_infinite]" />
        <p className="hud-label text-form">Abrindo o reino…</p>
      </div>
    </div>
  )
}
