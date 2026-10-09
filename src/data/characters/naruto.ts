import type { CharacterDef } from '../../engine/cards'

// Proposta 2026-10-09 — aguardando aprovação. Números = hipóteses de balanceamento.

export const NARUTO: readonly CharacterDef[] = [
  {
    id: 'nar-naruto-001',
    type: 'character',
    identity: 'naruto-uzumaki',
    name: 'Naruto Uzumaki',
    kanji: 'うずまきナルト',
    universe: 'naruto',
    class: 'fighter',
    rarity: 'SSR',
    stats: { attack: 4, hp: 14 },
    abilities: [
      {
        id: 'rasengan',
        name: 'Rasengan',
        cost: { specific: { chakra: 1 }, generic: 1 },
        multiplier: 2,
        cooldown: 0,
        text: '2× ATQ.',
      },
      {
        id: 'shadow-clones',
        name: 'Clones das Sombras',
        cost: { specific: {}, generic: 1 },
        multiplier: 0,
        cooldown: 0,
        target: 'self',
        effects: [{ type: 'shield', value: 3 }],
        text: 'Ganha Escudo 3.',
      },
    ],
    passives: [
      {
        id: 'never-give-up',
        name: 'Nunca Desistir',
        text: 'Uma vez por partida, ao ser derrotado, fica com 1 HP.',
      },
    ],
  },
  {
    id: 'nar-gaara-001',
    type: 'character',
    identity: 'gaara',
    name: 'Gaara',
    kanji: '我愛羅',
    universe: 'naruto',
    class: 'tank',
    rarity: 'R',
    stats: { attack: 2, hp: 10 },
    keywords: ['provoke', { id: 'defense', value: 1 }],
    abilities: [
      {
        id: 'sand-coffin',
        name: 'Caixão de Areia',
        cost: { specific: { chakra: 1 }, generic: 0 },
        multiplier: 1.5,
        cooldown: 0,
        text: '1,5× ATQ.',
      },
    ],
    passives: [],
  },
  {
    id: 'nar-hinata-001',
    type: 'character',
    identity: 'hinata-hyuga',
    name: 'Hinata Hyuga',
    kanji: '日向ヒナタ',
    universe: 'naruto',
    class: 'controller',
    rarity: 'C',
    stats: { attack: 2, hp: 8 },
    abilities: [
      {
        id: 'gentle-fist',
        name: 'Punho Gentil',
        cost: { specific: { chakra: 1 }, generic: 0 },
        multiplier: 1,
        cooldown: 0,
        effects: [{ type: 'condition', condition: 'sealed' }],
        text: '1× ATQ. O alvo fica Selado.',
      },
    ],
    passives: [],
  },
]
