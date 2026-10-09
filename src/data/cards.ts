import type { CardDef, CharacterDef, EnergyDef } from '../engine/cards'

// Valores da RULEBOOK v0.3.1 §14 — hipóteses de balanceamento.

const gojo = {
  id: 'jjk-gojo-001',
  type: 'character',
  identity: 'gojo-satoru',
  name: 'Gojo Satoru',
  kanji: '五条悟',
  universe: 'jujutsu-kaisen',
  faction: ['gojo'],
  class: 'fighter',
  rarity: 'UR',
  stats: { attack: 4, hp: 16 },
  art: '/assets/cards/jujutsu-kaisen/jjk-gojo-001.webp',
  abilities: [
    {
      id: 'blue',
      name: 'Azul',
      cost: { specific: { cursed: 1 }, generic: 1 },
      multiplier: 1.75,
      cooldown: 0,
      text: '1,75× ATQ.',
    },
    {
      id: 'red',
      name: 'Vermelho',
      cost: { specific: { cursed: 2 }, generic: 1 },
      multiplier: 2.5,
      cooldown: 0,
      keywords: ['trample'],
      text: '2,5× ATQ. Penetração.',
    },
  ],
  passives: [
    {
      id: 'six-eyes',
      name: 'Seis Olhos',
      text: 'A primeira habilidade de cada turno custa 1 genérica a menos.',
    },
  ],
} as const satisfies CharacterDef

const toji = {
  id: 'jjk-toji-001',
  type: 'character',
  identity: 'toji-fushiguro',
  name: 'Toji Fushiguro',
  kanji: '伏黒甚爾',
  universe: 'jujutsu-kaisen',
  faction: ['zenin'],
  class: 'fighter',
  rarity: 'SSR',
  stats: { attack: 4, hp: 14 },
  art: '/assets/cards/jujutsu-kaisen/jjk-toji-001.webp',
  abilities: [
    {
      id: 'inverted-spear',
      name: 'Lança Invertida',
      cost: { specific: {}, generic: 0 },
      multiplier: 2,
      cooldown: 2,
      keywords: ['piercing'],
      text: '2× ATQ. Perfurante. Recarga 2.',
    },
    {
      id: 'assassin-instinct',
      name: 'Instinto Assassino',
      cost: { specific: {}, generic: 0 },
      multiplier: 1,
      cooldown: 0,
      effects: [{ type: 'critical_chance', value: 0.3 }],
      text: '1× ATQ. Chance de crítico 30%.',
    },
  ],
  passives: [
    {
      id: 'heavenly-restriction',
      name: 'Restrição Celestial',
      keywords: ['immune'],
      text: 'Imune a buffs, debuffs e condições.',
    },
  ],
} as const satisfies CharacterDef

const shoko = {
  id: 'jjk-shoko-001',
  type: 'character',
  identity: 'shoko-ieiri',
  name: 'Shoko Ieiri',
  kanji: '家入硝子',
  universe: 'jujutsu-kaisen',
  class: 'support',
  rarity: 'SR',
  stats: { attack: 1, hp: 12 },
  abilities: [
    {
      id: 'reverse-technique',
      name: 'Técnica Reversa',
      cost: { specific: { cursed: 1 }, generic: 0 },
      multiplier: 0,
      cooldown: 0,
      effects: [
        { type: 'heal', value: 5 },
        { type: 'cleanse', value: 1 },
      ],
      text: 'Cura 5 de um aliado e remove 1 condição ou debuff.',
    },
  ],
  passives: [
    {
      id: 'on-call-doctor',
      name: 'Médica de Plantão',
      text: 'No fim do seu turno, se não agiu, cura 1 de cada aliado ferido.',
    },
  ],
} as const satisfies CharacterDef

const energy = (
  e: EnergyDef['energy'],
  name: string,
  universe: EnergyDef['universe'],
): EnergyDef => ({
  id: `energy-${e}`,
  type: 'energy',
  energy: e,
  name,
  universe,
  art: `/assets/energies/${e}.webp`,
})

export const CHARACTERS: readonly CharacterDef[] = [gojo, toji, shoko]

export const ENERGIES: readonly EnergyDef[] = [
  energy('universal', 'Energia Universal', 'multiverse'),
  energy('cursed', 'Energia Amaldiçoada', 'jujutsu-kaisen'),
  energy('chakra', 'Chakra', 'naruto'),
  energy('nen', 'Nen', 'hunter-x-hunter'),
  energy('reiatsu', 'Reiatsu', 'bleach'),
  energy('ki', 'Ki', 'dragon-ball'),
]

export const CATALOG: readonly CardDef[] = [...CHARACTERS, ...ENERGIES]
