import type { ComponentType } from 'react'
import { BladeEffect } from './BladeEffect'
import { CorruptionEffect } from './CorruptionEffect'
import { RegenerationEffect } from './RegenerationEffect'
import type { EffectProps } from './types'
import { WrathEffect } from './WrathEffect'
import type { PowerId } from '@/data/powers'

/** Mapa poder → efeito visual. Novas habilidades só precisam registrar aqui. */
export const POWER_EFFECTS: Record<PowerId, ComponentType<EffectProps>> = {
  blade: BladeEffect,
  regeneration: RegenerationEffect,
  wrath: WrathEffect,
  corruption: CorruptionEffect,
}
