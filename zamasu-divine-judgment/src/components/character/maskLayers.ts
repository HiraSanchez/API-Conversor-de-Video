import type { CSSProperties } from 'react'

/** Combina camadas de máscara por interseção (padrão do CSS seria união). */
export function maskLayers(layers: string[], sizes?: string[], positions?: string[]): CSSProperties {
  const image = layers.join(', ')
  const size = (sizes ?? layers.map(() => '100% 100%')).join(', ')
  const position = (positions ?? layers.map(() => 'center')).join(', ')
  return {
    maskImage: image,
    WebkitMaskImage: image,
    maskSize: size,
    WebkitMaskSize: size,
    maskPosition: position,
    WebkitMaskPosition: position,
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskComposite: 'intersect',
    WebkitMaskComposite: 'source-in',
  }
}
