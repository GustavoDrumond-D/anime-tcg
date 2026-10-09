import type { CharacterDef } from '../../engine/cards'

// Proposta 2026-10-09 — aguardando aprovação. Números = hipóteses de balanceamento.

export const DRAGON_BALL: readonly CharacterDef[] = [
  {
    id: 'db-goku-001',
    type: 'character',
    identity: 'son-goku',
    name: 'Son Goku',
    kanji: '孫悟空',
    universe: 'dragon-ball',
    class: 'fighter',
    rarity: 'UR',
    stats: { attack: 5, hp: 16 },
    abilities: [
      {
        id: 'kamehameha',
        name: 'Kamehameha',
        cost: { specific: { ki: 2 }, generic: 1 },
        multiplier: 2.5,
        cooldown: 0,
        text: '2,5× ATQ.',
      },
      {
        id: 'kaioken',
        name: 'Kaioken',
        cost: { specific: { ki: 1 }, generic: 0 },
        multiplier: 0,
        cooldown: 0,
        target: 'self',
        effects: [
          { type: 'buff_attack', value: 2 },
          { type: 'self_damage', value: 2 },
        ],
        text: '+2 ATQ até o fim do turno. Sofre 2 de dano.',
      },
    ],
    passives: [
      {
        id: 'saiyan-blood',
        name: 'Sangue Saiyajin',
        text: 'Sempre que sobreviver a um ataque, ganha +1 ATQ (máximo +2).',
      },
    ],
  },
  {
    id: 'db-piccolo-001',
    type: 'character',
    identity: 'piccolo',
    name: 'Piccolo',
    kanji: 'ピッコロ',
    universe: 'dragon-ball',
    class: 'tank',
    rarity: 'SSR',
    stats: { attack: 3, hp: 14 },
    keywords: ['provoke', { id: 'defense', value: 1 }],
    abilities: [
      {
        id: 'regeneration',
        name: 'Regeneração',
        cost: { specific: {}, generic: 1 },
        multiplier: 0,
        cooldown: 0,
        target: 'self',
        effects: [{ type: 'heal', value: 4 }],
        text: 'Cura 4 de si mesmo.',
      },
      {
        id: 'makankosappo',
        name: 'Makankōsappō',
        cost: { specific: { ki: 2 }, generic: 1 },
        multiplier: 2.25,
        cooldown: 0,
        keywords: ['piercing'],
        text: '2,25× ATQ. Perfurante.',
      },
    ],
    passives: [
      {
        id: 'demanding-mentor',
        name: 'Mestre Exigente',
        text: 'Aliados de raridade C ou R ganham Defesa 1.',
      },
    ],
  },
  {
    id: 'db-krillin-001',
    type: 'character',
    identity: 'krillin',
    name: 'Kuririn',
    kanji: 'クリリン',
    universe: 'dragon-ball',
    class: 'fighter',
    rarity: 'C',
    stats: { attack: 2, hp: 8 },
    abilities: [
      {
        id: 'kienzan',
        name: 'Kienzan',
        cost: { specific: { ki: 1 }, generic: 1 },
        multiplier: 1.75,
        cooldown: 0,
        keywords: ['piercing'],
        text: '1,75× ATQ. Perfurante.',
      },
    ],
    passives: [],
  },
]
