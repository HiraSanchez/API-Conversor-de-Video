import type { Fighter } from './types'

/**
 * Elenco da Arena. Valores em escala 1–100 são DESIGN DE JOGO para equilíbrio,
 * não uma medição canônica de poder.
 */
export const ZAMASU_BOSS: Fighter = {
  id: 'zamasu',
  name: 'Zamasu Fundido',
  title: 'A Divindade',
  color: '#2ee6a6',
  portrait: null,
  stats: { hp: 100, ki: 90, attack: 84, defense: 70, speed: 78 },
  passive: { name: 'Imortalidade Imperfeita', description: 'Regenera a cada turno, mas cada regeneração acumula Corrupção em si mesmo.' },
  abilities: [
    { id: 'holy-blade', name: 'Lâmina de Luz Divina', kind: 'strike', stance: 'assault', kiCost: 15, cooldown: 0, power: 1.2, description: 'Corte que ignora parte da defesa.', effects: [{ type: 'guardBreak', duration: 2, magnitude: 0.3, target: 'enemy' }] },
    { id: 'divine-wrath', name: 'Cólera Divina', kind: 'beam', stance: 'assault', kiCost: 35, cooldown: 3, power: 2, description: 'Colunas de luz em área.' },
    { id: 'immortal-regen', name: 'Regeneração Imortal', kind: 'buff', stance: 'focus', kiCost: 20, cooldown: 2, power: 0, description: 'Recupera vida ao longo de 3 turnos.', effects: [{ type: 'regen', duration: 3, magnitude: 8, target: 'self' }] },
    { id: 'corruption', name: 'Expansão da Corrupção', kind: 'ultimate', stance: 'focus', kiCost: 60, cooldown: 6, power: 1.5, description: 'Espalha corrupção crescente no oponente.', effects: [{ type: 'corruption', duration: 4, magnitude: 5, target: 'enemy' }] },
  ],
}

export const CHALLENGERS: Fighter[] = [
  {
    id: 'goku-ui',
    name: 'Goku',
    title: 'Instinto Superior',
    color: '#c9d6ff',
    portrait: null,
    stats: { hp: 82, ki: 80, attack: 82, defense: 64, speed: 98 },
    passive: { name: 'Corpo que se move sozinho', description: 'Chance de esquivar automaticamente de ataques em postura assault.' },
    abilities: [
      { id: 'ui-counter', name: 'Contra-ataque Silencioso', kind: 'guard', stance: 'guard', kiCost: 10, cooldown: 1, power: 1.1, description: 'Bloqueia e revida no mesmo movimento.' },
      { id: 'ui-kamehameha', name: 'Kamehameha', kind: 'beam', stance: 'assault', kiCost: 30, cooldown: 2, power: 1.8, description: 'O clássico, em sua forma mais pura.' },
      { id: 'ui-instinct', name: 'Estado de Instinto', kind: 'buff', stance: 'focus', kiCost: 25, cooldown: 4, power: 0, description: 'Aumenta a esquiva por 2 turnos.', effects: [{ type: 'instinct', duration: 2, magnitude: 0.35, target: 'self' }] },
    ],
  },
  {
    id: 'vegeta-be',
    name: 'Vegeta',
    title: 'Blue Evolution',
    color: '#4f7dff',
    portrait: null,
    stats: { hp: 88, ki: 78, attack: 86, defense: 72, speed: 80 },
    passive: { name: 'Orgulho Saiyajin', description: 'Quanto menor a vida, maior o ataque.' },
    abilities: [
      { id: 've-final-flash', name: 'Final Flash', kind: 'beam', stance: 'assault', kiCost: 40, cooldown: 3, power: 2.2, description: 'Disparo devastador que exige preparo.' },
      { id: 've-barrage', name: 'Rajada Galick', kind: 'strike', stance: 'assault', kiCost: 15, cooldown: 0, power: 1.1, description: 'Pressão constante.' },
      { id: 've-pride', name: 'Evolução do Orgulho', kind: 'buff', stance: 'focus', kiCost: 20, cooldown: 3, power: 0, description: 'Recupera Ki e fortalece o próximo ataque.' },
    ],
  },
  {
    id: 'gogeta-blue',
    name: 'Gogeta',
    title: 'Super Saiyajin Blue',
    color: '#39a0ff',
    portrait: null,
    stats: { hp: 90, ki: 92, attack: 94, defense: 76, speed: 88 },
    passive: { name: 'Tempo de Fusão', description: 'Poder máximo, mas a batalha tem limite de turnos para ele.' },
    abilities: [
      { id: 'go-stardust', name: 'Punho Meteoro', kind: 'strike', stance: 'assault', kiCost: 20, cooldown: 1, power: 1.4, description: 'Golpes em sequência que atravessam a guarda.' },
      { id: 'go-kamehameha', name: 'Kamehameha Supremo', kind: 'ultimate', stance: 'assault', kiCost: 55, cooldown: 5, power: 2.6, description: 'Um único disparo para encerrar.' },
    ],
  },
  {
    id: 'broly',
    name: 'Broly',
    title: 'Saiyajin Lendário',
    color: '#7dff5a',
    portrait: null,
    stats: { hp: 100, ki: 70, attack: 96, defense: 80, speed: 62 },
    passive: { name: 'Fúria Crescente', description: 'Ganha ataque a cada turno em combate.' },
    abilities: [
      { id: 'br-eraser', name: 'Gigantic Roar', kind: 'beam', stance: 'assault', kiCost: 30, cooldown: 2, power: 1.9, description: 'Energia bruta, sem refinamento.' },
      { id: 'br-grab', name: 'Investida Lendária', kind: 'strike', stance: 'assault', kiCost: 10, cooldown: 0, power: 1.2, description: 'Pode atordoar.', effects: [{ type: 'stun', duration: 1, magnitude: 0.25, target: 'enemy' }] },
    ],
  },
  {
    id: 'jiren',
    name: 'Jiren',
    title: 'O Guerreiro Supremo',
    color: '#ff5a5a',
    portrait: null,
    stats: { hp: 96, ki: 84, attack: 90, defense: 92, speed: 76 },
    passive: { name: 'Força Absoluta', description: 'Reduz todo dano recebido em postura guard.' },
    abilities: [
      { id: 'ji-glare', name: 'Olhar de Pressão', kind: 'debuff', stance: 'focus', kiCost: 15, cooldown: 2, power: 0.6, description: 'Um impacto invisível que quebra guardas.', effects: [{ type: 'guardBreak', duration: 2, magnitude: 0.4, target: 'enemy' }] },
      { id: 'ji-power-impact', name: 'Impacto de Poder', kind: 'beam', stance: 'assault', kiCost: 35, cooldown: 3, power: 2, description: 'Esfera de energia concentrada.' },
    ],
  },
  {
    id: 'gohan-beast',
    name: 'Gohan',
    title: 'Beast',
    color: '#e8e8ff',
    portrait: null,
    stats: { hp: 86, ki: 88, attack: 92, defense: 68, speed: 86 },
    passive: { name: 'Potencial Desperto', description: 'Fica mais forte quando um aliado (ou ele mesmo) está em perigo.' },
    abilities: [
      { id: 'gh-special-beam', name: 'Makankosappo', kind: 'beam', stance: 'assault', kiCost: 40, cooldown: 3, power: 2.3, description: 'Perfura qualquer defesa.' },
      { id: 'gh-rage', name: 'Fúria Contida', kind: 'buff', stance: 'focus', kiCost: 20, cooldown: 3, power: 0, description: 'Converte dano recebido em ataque.' },
    ],
  },
  {
    id: 'beerus',
    name: 'Bills',
    title: 'Deus da Destruição',
    color: '#b45cff',
    portrait: null,
    stats: { hp: 94, ki: 96, attack: 95, defense: 84, speed: 90 },
    passive: { name: 'Hakai', description: 'Uma vez por batalha, pode tentar apagar o oponente abaixo de 20% de vida.' },
    abilities: [
      { id: 'be-sphere', name: 'Esfera da Destruição', kind: 'beam', stance: 'assault', kiCost: 35, cooldown: 3, power: 2.1, description: 'Um pequeno sol de destruição.' },
      { id: 'be-hakai', name: 'Hakai', kind: 'ultimate', stance: 'focus', kiCost: 80, cooldown: 99, power: 0, description: 'Destruição absoluta — se a condição for cumprida.' },
    ],
  },
]
