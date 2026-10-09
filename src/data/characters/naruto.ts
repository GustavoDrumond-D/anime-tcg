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
    id: 'nar-sasuke-001',
    type: 'character',
    identity: 'sasuke-uchiha',
    name: 'Sasuke Uchiha',
    kanji: 'うちはサスケ',
    universe: 'naruto',
    class: 'fighter',
    rarity: 'SSR',
    stats: { attack: 4, hp: 13 },
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
    abilities: [
      {
        id: 'medical-ninjutsu',
        name: 'Ninjutsu Médico',
        cost: { specific: { chakra: 1 }, generic: 0 },
        multiplier: 0,
        cooldown: 0,
        target: 'ally',
        effects: [{ type: 'heal', value: 3 }],
        text: 'Cura 3 de um aliado.',
      },
    ],
    passives: [],
  },
]
