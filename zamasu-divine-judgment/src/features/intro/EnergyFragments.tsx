import { motion } from 'framer-motion'
import { useMemo } from 'react'

/** Primeiros sinais de vida no vazio: fagulhas isoladas que convergem ao centro. */
export function EnergyFragments({ active, converge }: { active: boolean; converge: boolean }) {
  const shards = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2 + (i % 3) * 0.4
        const r = 18 + ((i * 37) % 30)
        return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.7, s: 2 + (i % 4), d: (i % 7) * 0.12 }
      }),
    [],
  )

  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-[46%] h-0 w-0">
      {shards.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.s,
            height: s.s,
            background: i % 3 === 0 ? '#e8c46a' : i % 3 === 1 ? '#2ee6a6' : '#fff6dc',
            boxShadow: `0 0 ${s.s * 4}px ${i % 3 === 1 ? '#2ee6a6' : '#e8c46a'}`,
          }}
          initial={{ opacity: 0, x: `${s.x}vw`, y: `${s.y}vh` }}
          animate={
            !active
              ? { opacity: 0 }
              : converge
                ? { opacity: 0, x: 0, y: 0, transition: { duration: 1.2, ease: [0.5, 0, 0, 1], delay: s.d * 0.5 } }
                : { opacity: [0, 1, 0.4, 1], x: `${s.x * 0.8}vw`, y: `${s.y * 0.8}vh`, transition: { duration: 2.4, delay: s.d } }
          }
        />
      ))}
    </div>
  )
}
