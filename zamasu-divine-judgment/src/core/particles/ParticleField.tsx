import { useEffect, useRef } from 'react'
import { divineEvents } from '@/core/events/divineEvents'
import { FORMS } from '@/core/forms/forms'
import { ParticleEngine } from '@/core/particles/ParticleEngine'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useAtmosphereStore } from '@/store/useAtmosphereStore'
import { useFormStore } from '@/store/useFormStore'

/** Canvas global de partículas. Montado uma única vez no Shell. */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<ParticleEngine | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let engine: ParticleEngine
    try {
      engine = new ParticleEngine(canvas, FORMS[useFormStore.getState().form].particles)
    } catch {
      return // Sem canvas: a experiência segue sem partículas.
    }
    engineRef.current = engine
    const { intensity, focus } = useAtmosphereStore.getState()
    engine.setIntensity(intensity)
    engine.setFocus(focus.x, focus.y)
    engine.start()

    const unsubForm = useFormStore.subscribe((s) => engine.setProfile(FORMS[s.form].particles))
    const unsubAtmo = useAtmosphereStore.subscribe((s) => {
      engine.setIntensity(s.intensity)
      engine.setFocus(s.focus.x, s.focus.y)
    })
    const unsubEvents = divineEvents.subscribe((e) => {
      if (e.type === 'burst') engine.burst(e)
      if (e.type === 'shockwave') engine.shockwave(e)
    })

    const onResize = () => engine.resize()
    const onPointer = (e: PointerEvent) => engine.setPointer(e.clientX, e.clientY)
    const onLeave = () => engine.setPointer(-9999, -9999)
    const onVisibility = () => (document.hidden ? engine.stop() : engine.start())
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      unsubForm()
      unsubAtmo()
      unsubEvents()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setReducedMotion(reduced)
  }, [reduced])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[1] h-full w-full" />
}
