/**
 * ARENA DIVINA — contratos do sistema de batalha (Fase 2).
 *
 * Princípio de design: estratégia > números.
 * 1. Posturas em triângulo (lidas simultaneamente, como em jogos de luta):
 *      assault vence focus · guard vence assault · focus vence guard
 *    Quem vence o triângulo ganha bônus de dano/efeito naquele turno.
 * 2. Economia de Ki: habilidades fortes custam Ki; `focus` recupera Ki.
 * 3. Iniciativa por velocidade, mas ações de postura `guard` sempre resolvem primeiro.
 * 4. Efeitos de status que criam janelas (quebra de guarda, atordoamento, corrupção).
 */

export interface CombatStats {
  /** Vida máxima. */
  hp: number
  /** Ki máximo — recurso das habilidades. */
  ki: number
  attack: number
  defense: number
  speed: number
}

export type Stance = 'assault' | 'guard' | 'focus'

export type StatusType =
  | 'stun' // perde o próximo turno
  | 'guardBreak' // defesa reduzida
  | 'regen' // recupera HP por turno
  | 'corruption' // dano por turno que cresce a cada acúmulo
  | 'instinct' // chance de esquiva automática

export interface StatusEffect {
  type: StatusType
  /** Duração em turnos. */
  duration: number
  magnitude: number
  target: 'self' | 'enemy'
}

export type AbilityKind = 'strike' | 'beam' | 'guard' | 'buff' | 'debuff' | 'ultimate'

export interface Ability {
  id: string
  name: string
  kind: AbilityKind
  /** Postura que a habilidade assume no triângulo. */
  stance: Stance
  kiCost: number
  /** Turnos de recarga após o uso. */
  cooldown: number
  /** Multiplicador sobre `attack` (0 para habilidades sem dano). */
  power: number
  effects?: StatusEffect[]
  description: string
}

export interface Fighter {
  id: string
  name: string
  title: string
  /** Cor de assinatura para efeitos e interface. */
  color: string
  stats: CombatStats
  abilities: Ability[]
  /** Passiva única que define o estilo de jogo. */
  passive: { name: string; description: string }
  /** Arte futura (placeholder até existir). */
  portrait: string | null
}

export type BattleAction =
  | { type: 'ability'; abilityId: string }
  | { type: 'stance'; stance: Stance }
  | { type: 'charge' }

export interface CombatantState {
  fighterId: string
  hp: number
  ki: number
  statuses: StatusEffect[]
  cooldowns: Record<string, number>
}

export interface BattleLogEntry {
  turn: number
  actor: string
  text: string
}

export interface BattleState {
  turn: number
  player: CombatantState
  opponent: CombatantState
  log: BattleLogEntry[]
  winner: 'player' | 'opponent' | null
}

/** Implementação pura (sem React) para ser testável e reaproveitável. */
export interface BattleEngine {
  init(playerId: string, opponentId: string): BattleState
  /** Resolve um turno com as ações dos dois lados e devolve o novo estado. */
  resolveTurn(state: BattleState, player: BattleAction, opponent: BattleAction): BattleState
  /** IA do oponente — Zamasu escolhe com base no histórico do jogador. */
  chooseAction(state: BattleState, side: 'player' | 'opponent'): BattleAction
}
