import type { CharacterDef } from '../../engine/cards'

// Aprovados em 2026-10-09. Números = hipóteses de balanceamento.

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
    art: '/assets/cards/naruto/nar-naruto-001.webp',
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
    id: 'nar-sasuke-001',
    type: 'character',
    identity: 'sasuke-uchiha',
    name: 'Sasuke Uchiha',
    kanji: 'うちはサスケ',
    universe: 'naruto',
    class: 'fighter',
    rarity: 'SSR',
    stats: { attack: 4, hp: 13 },
    art: '/assets/cards/naruto/nar-sasuke-001.webp',
    abilities: [
      {
        id: 'chidori',
        name: 'Chidori',
        cost: { specific: { chakra: 1 }, generic: 1 },
        multiplier: 1.75,
        cooldown: 0,
        keywords: ['piercing'],
        text: '1,75× ATQ. Perfurante.',
      },
      {
        id: 'great-fireball',
        name: 'Bola de Fogo',
        cost: { specific: { chakra: 2 }, generic: 0 },
        multiplier: 1,
        cooldown: 2,
        effects: [{ type: 'condition', condition: 'poisoned' }],
        text: '1× ATQ. Queimadura: o alvo fica Envenenado. Recarga 2.',
      },
    ],
    passives: [
      {
        id: 'sharingan',
        name: 'Sharingan',
        text: 'O primeiro ataque que receber a cada turno do oponente causa 1 de dano a menos.',
      },
    ],
  },
  {
    id: 'nar-sakura-001',
    type: 'character',
    identity: 'sakura-haruno',
    name: 'Sakura Haruno',
    kanji: '春野サクラ',
    universe: 'naruto',
    class: 'support',
    rarity: 'C',
    stats: { attack: 2, hp: 8 },
    art: '/assets/cards/naruto/nar-sakura-001.webp',
    abilities: [
      {
        id: 'genjutsu-release',
        name: 'Dissipar Genjutsu',
        cost: { specific: { chakra: 1 }, generic: 0 },
        multiplier: 0,
        cooldown: 0,
        target: 'ally',
        effects: [
          { type: 'cleanse', value: 1 },
          { type: 'heal', value: 2 },
        ],
        text: 'Remove 1 condição ou debuff de um aliado e cura 2.',
      },
    ],
    passives: [],
  },
]
