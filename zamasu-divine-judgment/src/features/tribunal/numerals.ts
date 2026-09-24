const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

/** 1 → I … 10 → X. Suficiente para o número de dilemas do Tribunal. */
export const roman = (n: number) => ROMAN[n - 1] ?? String(n)
