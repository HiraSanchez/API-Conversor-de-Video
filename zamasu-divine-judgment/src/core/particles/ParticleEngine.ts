import type { ParticleBehavior, ParticleProfile } from '@/core/forms/forms'

/**
 * Motor de partículas em Canvas 2D, sem dependências.
 *
 * - Um único canvas em tela cheia, compartilhado por todas as páginas.
 * - Sprites de brilho pré-renderizados por cor + composição aditiva
 *   (evita gradientes por partícula, que custam caro).
 * - Troca de perfil gradual: cada partícula "renasce" com o novo perfil
 *   em momentos diferentes, então a mudança de forma parece orgânica.
 */

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  life: number
  maxLife: number
  phase: number
  /** Coordenadas polares (comportamento vortex). */
  angle: number
  radius: number
  kind: 'ambient' | 'burst'
  /** Frames até renascer com o novo perfil (-1 = sem troca pendente). */
  rebirthIn: number
  streak: number
}

interface Ring {
  x: number
  y: number
  r: number
  maxR: number
  color: string
  life: number
}

const TAU = Math.PI * 2
const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(list: T[]) => list[(Math.random() * list.length) | 0]

export class ParticleEngine {
  private ctx: CanvasRenderingContext2D
  private particles: Particle[] = []
  private rings: Ring[] = []
  private sprites = new Map<string, HTMLCanvasElement>()
  private raf = 0
  private width = 0
  private height = 0
  private dpr = 1
  private profile: ParticleProfile
  private intensity = 1
  private focus = { x: 0.5, y: 0.45 }
  private pointer = { x: -9999, y: -9999 }
  private reducedMotion = false
  private running = false
  private lastTime = 0
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement, profile: ParticleProfile) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) throw new Error('Canvas 2D indisponível')
    this.ctx = ctx
    this.profile = profile
    this.resize()
  }

  /* ───────────────────────── API pública ───────────────────────── */

  start() {
    if (this.running) return
    this.running = true
    this.lastTime = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  destroy() {
    this.stop()
    this.particles = []
    this.rings = []
    this.sprites.clear()
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas.width = Math.round(this.width * this.dpr)
    this.canvas.height = Math.round(this.height * this.dpr)
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
  }

  setProfile(profile: ParticleProfile) {
    if (profile === this.profile) return
    this.profile = profile
    // Renascimento escalonado: ~1.4s para a população inteira migrar.
    for (const p of this.particles) {
      if (p.kind === 'ambient') p.rebirthIn = (Math.random() * 85) | 0
    }
  }

  /** 0 = vazio absoluto, 1 = densidade total do perfil. Usado pela intro. */
  setIntensity(value: number) {
    this.intensity = Math.max(0, Math.min(1, value))
  }

  /** Centro gravitacional (0–1) para o vortex e para explosões sem origem. */
  setFocus(x: number, y: number) {
    this.focus = { x, y }
  }

  setPointer(x: number, y: number) {
    this.pointer = { x, y }
  }

  setReducedMotion(value: boolean) {
    this.reducedMotion = value
  }

  burst(opts: { x?: number; y?: number; color?: string; count?: number } = {}) {
    const x = opts.x ?? this.focus.x * this.width
    const y = opts.y ?? this.focus.y * this.height
    const count = Math.round((opts.count ?? 60) * (this.reducedMotion ? 0.3 : 1))
    for (let i = 0; i < count; i++) {
      const a = Math.random() * TAU
      const v = rand(1.5, 7)
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        size: rand(0.8, 3),
        color: opts.color ?? pick(this.profile.colors),
        alpha: 1,
        life: 0,
        maxLife: rand(40, 110),
        phase: Math.random() * TAU,
        angle: a,
        radius: 0,
        kind: 'burst',
        rebirthIn: -1,
        streak: 0,
      })
    }
  }

  shockwave(opts: { x?: number; y?: number; color?: string } = {}) {
    this.rings.push({
      x: opts.x ?? this.focus.x * this.width,
      y: opts.y ?? this.focus.y * this.height,
      r: 4,
      maxR: Math.hypot(this.width, this.height) * 0.6,
      color: opts.color ?? this.profile.colors[1] ?? '#fff',
      life: 0,
    })
  }

  /* ───────────────────────── Internos ───────────────────────── */

  private targetCount() {
    const { density, max } = this.profile
    const area = (this.width * this.height) / 10000
    const base = Math.min(max, Math.max(40, area * density))
    return Math.round(base * this.intensity * (this.reducedMotion ? 0.4 : 1))
  }

  private sprite(color: string) {
    let s = this.sprites.get(color)
    if (s) return s
    s = document.createElement('canvas')
    const size = 64
    s.width = s.height = size
    const g = s.getContext('2d')!
    const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, '#ffffff')
    grad.addColorStop(0.12, color)
    grad.addColorStop(0.4, color + '55')
    grad.addColorStop(1, color + '00')
    g.fillStyle = grad
    g.fillRect(0, 0, size, size)
    this.sprites.set(color, s)
    return s
  }

  private spawn(p?: Particle): Particle {
    const { behavior, size, colors } = this.profile
    const particle: Particle = p ?? ({} as Particle)
    particle.kind = 'ambient'
    particle.size = rand(size[0], size[1])
    particle.color = pick(colors)
    particle.alpha = 0
    particle.life = 0
    particle.maxLife = rand(260, 620)
    particle.phase = Math.random() * TAU
    particle.rebirthIn = -1
    particle.streak = 0
    particle.vx = 0
    particle.vy = 0
    this.placeFor(behavior, particle)
    return particle
  }

  private placeFor(behavior: ParticleBehavior, p: Particle) {
    const w = this.width
    const h = this.height
    if (behavior === 'vortex') {
      const maxR = Math.hypot(w, h) * 0.55
      p.angle = Math.random() * TAU
      p.radius = rand(maxR * 0.08, maxR)
      p.x = this.focus.x * w + Math.cos(p.angle) * p.radius
      p.y = this.focus.y * h + Math.sin(p.angle) * p.radius * 0.62
    } else {
      p.x = Math.random() * w
      p.y = behavior === 'ascend' ? rand(h * 0.2, h * 1.05) : Math.random() * h
      p.angle = 0
      p.radius = 0
    }
  }

  private tick = (now: number) => {
    if (!this.running) return
    this.raf = requestAnimationFrame(this.tick)
    // Normaliza para 60fps; limita saltos quando a aba volta do background.
    const dt = Math.min((now - this.lastTime) / 16.667, 3)
    this.lastTime = now
    this.update(dt)
    this.draw()
  }

  private update(dt: number) {
    const target = this.targetCount()
    let ambient = 0
    for (const p of this.particles) if (p.kind === 'ambient') ambient++
    // Nasce/morre aos poucos para a densidade nunca "piscar".
    const spawnBudget = Math.min(target - ambient, 4)
    for (let i = 0; i < spawnBudget; i++) this.particles.push(this.spawn())
    let excess = ambient - target

    const { behavior, speed, glitch } = this.profile
    const s = speed * dt * (this.reducedMotion ? 0.25 : 1)
    const cx = this.focus.x * this.width
    const cy = this.focus.y * this.height

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.life += dt

      if (p.kind === 'burst') {
        p.vx *= 0.94
        p.vy *= 0.94
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.alpha = 1 - p.life / p.maxLife
        if (p.life >= p.maxLife) this.particles.splice(i, 1)
        continue
      }

      // Excesso: marca para desaparecer suavemente.
      if (excess > 0 && p.rebirthIn < 0 && p.life > 30) {
        p.maxLife = Math.min(p.maxLife, p.life + 40)
        excess--
      }

      if (p.rebirthIn >= 0) {
        p.rebirthIn -= dt
        if (p.rebirthIn <= 0) {
          // Encerra a vida atual rapidamente; ao morrer renasce no novo perfil.
          p.maxLife = Math.min(p.maxLife, p.life + 24)
          p.rebirthIn = -1
        }
      }

      switch (behavior) {
        case 'ascend': {
          p.vy += (-0.35 - p.size * 0.12 - p.vy) * 0.05
          p.vx = Math.sin(p.life * 0.012 + p.phase) * 0.35
          break
        }
        case 'unstable': {
          p.vx += (Math.random() - 0.5) * 0.5
          p.vy += (Math.random() - 0.5) * 0.5
          p.vx *= 0.92
          p.vy *= 0.92
          if (Math.random() < glitch * dt) {
            p.x += (Math.random() < 0.5 ? -1 : 1) * rand(30, 140)
            p.streak = 10
          }
          break
        }
        case 'vortex': {
          const maxR = Math.hypot(this.width, this.height) * 0.55
          p.angle += ((0.004 + 0.9 / (p.radius + 40)) * s)
          p.radius -= 0.12 * s * (1 + p.radius / maxR)
          if (p.radius < 6) {
            this.spawn(p)
            p.radius = maxR
            continue
          }
          p.x = cx + Math.cos(p.angle) * p.radius
          p.y = cy + Math.sin(p.angle) * p.radius * 0.62
          break
        }
      }

      if (behavior !== 'vortex') {
        // Repulsão sutil do ponteiro: o santuário percebe o intruso.
        const dx = p.x - this.pointer.x
        const dy = p.y - this.pointer.y
        const d2 = dx * dx + dy * dy
        if (d2 < 14400) {
          const f = (1 - d2 / 14400) * 0.6
          const d = Math.sqrt(d2) || 1
          p.vx += (dx / d) * f
          p.vy += (dy / d) * f
        }
        p.x += p.vx * s * 2.2
        p.y += p.vy * s * 2.2
      }

      if (p.streak > 0) p.streak -= dt

      // Fade de nascimento/morte.
      const t = p.life / p.maxLife
      p.alpha = t < 0.12 ? t / 0.12 : t > 0.82 ? Math.max(0, (1 - t) / 0.18) : 1
      p.alpha *= 0.55 + 0.45 * Math.sin(p.life * 0.05 + p.phase)

      const out = p.x < -60 || p.x > this.width + 60 || p.y < -60 || p.y > this.height + 60
      if (p.life >= p.maxLife || out) {
        if (excess > 0) {
          this.particles.splice(i, 1)
          excess--
        } else {
          this.spawn(p)
          if (behavior === 'ascend' && out) p.y = this.height + 20
        }
      }
    }

    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i]
      r.life += dt
      r.r += (r.maxR - r.r) * 0.045 * dt
      if (r.life > 80) this.rings.splice(i, 1)
    }
  }

  private draw() {
    const { ctx } = this
    const { trail } = this.profile

    ctx.globalCompositeOperation = 'source-over'
    if (trail > 0 && !this.reducedMotion) {
      // Apaga parcialmente: preserva rastro sem pintar fundo (canvas é transparente).
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = `rgba(0,0,0,${1 - trail})`
      ctx.fillRect(0, 0, this.width, this.height)
    } else {
      ctx.clearRect(0, 0, this.width, this.height)
    }

    ctx.globalCompositeOperation = 'lighter'
    for (const p of this.particles) {
      if (p.alpha <= 0.01) continue
      const sprite = this.sprite(p.color)
      const d = p.size * 7
      ctx.globalAlpha = p.alpha * (p.kind === 'burst' ? 1 : 0.85)
      if (p.streak > 0) {
        // Rastro horizontal de "falha" dimensional.
        ctx.drawImage(sprite, p.x - d * 3, p.y - d / 6, d * 6, d / 3)
      }
      ctx.drawImage(sprite, p.x - d / 2, p.y - d / 2, d, d)
    }

    for (const r of this.rings) {
      const a = Math.max(0, 1 - r.life / 80)
      ctx.globalAlpha = a * a * 0.5
      ctx.strokeStyle = r.color
      ctx.lineWidth = 0.5 + a * 2
      ctx.beginPath()
      ctx.ellipse(r.x, r.y, r.r, r.r * 0.72, 0, 0, TAU)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }
}
