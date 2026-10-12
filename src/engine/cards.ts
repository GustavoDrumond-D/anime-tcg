// Modelo de cartas (CARD_SCHEMA) e orçamento por raridade (RULEBOOK §10).
// Puro: sem React, sem DOM.

export const ENERGY_TYPES = [
  'universal',
  'cursed',
  'chakra',
  'nen',
  'reiatsu',
  'ki',
  'ego',
  'haki',
] as const
export type EnergyType = (typeof ENERGY_TYPES)[number]
/** Universal só paga a parcela genérica, por isso não aparece em custo específico. */
export type SpecificEnergy = Exclude<EnergyType, 'universal'>

export interface Cost {
  specific: Partial<Record<SpecificEnergy, number>>
  generic: number
}

export type Universe =
  | 'multiverse'
  | 'jujutsu-kaisen'
  | 'naruto'
  | 'hunter-x-hunter'
  | 'bleach'
  | 'dragon-ball'
  | 'blue-lock'
  | 'one-piece'

export type Rarity = 'C' | 'R' | 'SR' | 'SSR' | 'UR' | 'LR' | 'EX'
export type CardClass = 'fighter' | 'tank' | 'support' | 'controller' | 'summoner'

export type Keyword =
  | 'provoke'
  | 'haste'
  | 'piercing'
  | 'trample'
  | 'immune'
  | { id: 'defense' | 'shield'; value: number }

export type Effect =
  | { type: 'critical_chance'; value: number }
  | { type: 'heal'; value: number }
  | { type: 'cleanse'; value: number }
  | { type: 'condition'; condition: 'stunned' | 'poisoned' | 'sealed' }
  | { type: 'shield'; value: number }
  | { type: 'buff_attack'; value: number }
  | { type: 'self_damage'; value: number }

export interface AbilityDef {
  id: string
  name: string
  cost: Cost
  multiplier: number
  cooldown: number
  /** Padrão: 'enemy'. Cura/escudo miram 'ally'; buffs próprios, 'self'. */
  target?: 'enemy' | 'ally' | 'self'
  keywords?: Keyword[]
  effects?: Effect[]
  /** Texto exibido; o motor usa só os campos estruturados. */
  text: string
}

export interface PassiveDef {
  /** Handler tipado é resolvido pelo id no motor (sem eval). */
  id: string
  name: string
  keywords?: Keyword[]
  text: string
}

export interface CharacterDef {
  id: string
  type: 'character'
  identity: string
  name: string
  kanji?: string
  universe: Universe
  faction?: string[]
  class: CardClass
  rarity: Rarity
  stats: { attack: number; hp: number }
  /** Palavras-chave permanentes do personagem (Provocar, Ímpeto, Defesa…). */
  keywords?: Keyword[]
  /** Arte sem texto. Ausente = fallback visual. */
  art?: string
  abilities: AbilityDef[]
  passives: PassiveDef[]
}

export interface EnergyDef {
  id: string
  type: 'energy'
  energy: EnergyType
  name: string
  universe: Universe
  /** Carta de energia pronta (exceção: pode conter texto, não tem números). */
  art: string
}

export type CardDef = CharacterDef | EnergyDef

/** RULEBOOK §10. attack/hp são tetos do orçamento, não valores obrigatórios. */
export const RARITY: Record<
  Rarity,
  { summonCost: number; weight: number; attack: number; hp: number }
> = {
  C: { summonCost: 0, weight: 2, attack: 2, hp: 8 },
  R: { summonCost: 0, weight: 2, attack: 3, hp: 10 },
  SR: { summonCost: 1, weight: 3, attack: 3, hp: 12 },
  SSR: { summonCost: 2, weight: 3, attack: 4, hp: 14 },
  UR: { summonCost: 3, weight: 4, attack: 5, hp: 16 },
  // Hipóteses de orçamento (CARTAS_ESPECIAIS), sujeitas a playtest.
  LR: { summonCost: 4, weight: 5, attack: 5, hp: 18 },
  EX: { summonCost: 4, weight: 5, attack: 6, hp: 20 },
}

export const totalCost = (c: Cost): number =>
  c.generic + Object.values(c.specific).reduce((a, n) => a + (n ?? 0), 0)

/** Teto de multiplicador pela tabela de referência do RULEBOOK §10. */
export function maxMultiplier(a: Pick<AbilityDef, 'cost' | 'cooldown'>): number {
  const total = totalCost(a.cost)
  if (total === 0) return a.cooldown >= 2 ? 2 : 1
  if (total === 1) return 1.5
  if (total === 2) return 2
  return 2.5
}
