/**
 * Sistema de Formas — fonte única de verdade.
 *
 * Cada forma descreve a atmosfera inteira do santuário: paleta (vira CSS vars),
 * comportamento das partículas, efeitos de cena e a narrativa exibida.
 * Nenhum componente deve hardcodar cor de forma: consuma `var(--form-*)`
 * ou o objeto retornado por `useActiveForm()`.
 */

export type FormId = 'divine' | 'corrupted' | 'infinite'

export type ParticleBehavior = 'ascend' | 'unstable' | 'vortex'

export interface ParticleProfile {
  behavior: ParticleBehavior
  /** Partículas por 10.000px² de viewport (é limitado por `max`). */
  density: number
  max: number
  speed: number
  size: [min: number, max: number]
  colors: string[]
  /** 0–1: rastro deixado no canvas (0 = limpa tudo a cada frame). */
  trail: number
  /** Chance por frame de uma partícula sofrer "salto" dimensional. */
  glitch: number
}

export interface FormPalette {
  primary: string
  secondary: string
  accent: string
  glow: string
  /** Cor base do céu da forma (gradiente radial do fundo). */
  sky: string
  skyEdge: string
}

export interface FormEffects {
  rays: boolean
  cracks: boolean
  glitch: boolean
  cosmicScale: boolean
  /** Intensidade da aura ao redor da silhueta (0–1). */
  aura: number
}

export interface FormDefinition {
  id: FormId
  order: number
  name: string
  epithet: string
  sigil: string
  tagline: string
  description: string
  traits: string[]
  palette: FormPalette
  particles: ParticleProfile
  effects: FormEffects
}

export const FORMS: Record<FormId, FormDefinition> = {
  divine: {
    id: 'divine',
    order: 0,
    name: 'Forma Divina',
    epithet: 'O Equilíbrio Absoluto',
    sigil: 'I',
    tagline: 'A justiça em seu estado mais puro — e mais frio.',
    description:
      'A manifestação que Zamasu acredita ser a verdadeira: serena, dourada, imaculada. Cada partícula obedece. Cada luz sabe o seu lugar. Aqui, a perfeição não é uma meta — é a lei.',
    traits: ['Luz dourada', 'Ordem celestial', 'Serenidade implacável'],
    palette: {
      primary: '#e8c46a',
      secondary: '#2ee6a6',
      accent: '#fff6dc',
      glow: 'rgba(232, 196, 106, 0.55)',
      sky: '#1a1408',
      skyEdge: '#050505',
    },
    particles: {
      behavior: 'ascend',
      density: 0.55,
      max: 140,
      speed: 0.35,
      size: [0.6, 2.4],
      colors: ['#fff6dc', '#e8c46a', '#f5dc9a', '#2ee6a6'],
      trail: 0,
      glitch: 0,
    },
    effects: { rays: true, cracks: false, glitch: false, cosmicScale: false, aura: 0.55 },
  },
  corrupted: {
    id: 'corrupted',
    order: 1,
    name: 'Forma Corrompida',
    epithet: 'A Imortalidade Imperfeita',
    sigil: 'II',
    tagline: 'Um corpo imortal que apodrece por dentro.',
    description:
      'A fusão de um imortal com um mortal nunca foi estável. A carne divina se deforma, a energia roxa vaza pelas rachaduras e a própria dimensão começa a falhar. Ele chama isso de evolução.',
    traits: ['Energia roxa', 'Falhas dimensionais', 'Instabilidade crescente'],
    palette: {
      primary: '#b45cff',
      secondary: '#2ee6a6',
      accent: '#ff5ce1',
      glow: 'rgba(180, 92, 255, 0.6)',
      sky: '#150620',
      skyEdge: '#050505',
    },
    particles: {
      behavior: 'unstable',
      density: 0.8,
      max: 190,
      speed: 0.9,
      size: [0.6, 2.8],
      colors: ['#b45cff', '#7a2cff', '#ff5ce1', '#2ee6a6', '#e9d5ff'],
      trail: 0.55,
      glitch: 0.004,
    },
    effects: { rays: false, cracks: true, glitch: true, cosmicScale: false, aura: 0.8 },
  },
  infinite: {
    id: 'infinite',
    order: 2,
    name: 'Forma Infinita',
    epithet: 'O Universo Sou Eu',
    sigil: '∞',
    tagline: 'Não existe mais um corpo. Existe apenas ele.',
    description:
      'Zamasu ultrapassa a própria carne e se funde ao tecido do universo. O céu é o seu rosto, as estrelas orbitam a sua vontade. Não há mais onde se esconder — porque não há mais nada que não seja ele.',
    traits: ['Escala cósmica', 'Onipresença', 'O universo reage'],
    palette: {
      primary: '#7af5d0',
      secondary: '#8b7bff',
      accent: '#ffffff',
      glow: 'rgba(122, 245, 208, 0.5)',
      sky: '#06121a',
      skyEdge: '#030306',
    },
    particles: {
      behavior: 'vortex',
      density: 1.1,
      max: 260,
      speed: 0.55,
      size: [0.4, 2.2],
      colors: ['#ffffff', '#7af5d0', '#8b7bff', '#2ee6a6', '#e8c46a'],
      trail: 0.78,
      glitch: 0,
    },
    effects: { rays: false, cracks: false, glitch: false, cosmicScale: true, aura: 1 },
  },
}

export const FORM_ORDER: FormId[] = (Object.values(FORMS) as FormDefinition[])
  .sort((a, b) => a.order - b.order)
  .map((f) => f.id)

/** Converte a paleta em CSS custom properties aplicadas no `:root`. */
export function formToCssVars(form: FormDefinition): Record<string, string> {
  const { palette } = form
  return {
    '--form-primary': palette.primary,
    '--form-secondary': palette.secondary,
    '--form-accent': palette.accent,
    '--form-glow': palette.glow,
    '--form-sky': palette.sky,
    '--form-sky-edge': palette.skyEdge,
  }
}
