import type { CharacterDef } from '../../engine/cards'

// Aprovados em 2026-10-09. Números = hipóteses de balanceamento.

export const HUNTER_X_HUNTER: readonly CharacterDef[] = [
  {
    id: 'hxh-gon-001',
    type: 'character',
    identity: 'gon-freecss',
    name: 'Gon Freecss',
    kanji: 'ゴン=フリークス',
    universe: 'hunter-x-hunter',
    class: 'fighter',
    rarity: 'SSR',
    stats: { attack: 4, hp: 14 },
    art: '/assets/cards/hunter-x-hunter/hxh-gon-001.webp',
    abilities: [
      {
        id: 'jajanken-rock',
        name: 'Jajanken: Pedra',
        cost: { specific: { nen: 2 }, generic: 1 },
        multiplier: 2.5,
        cooldown: 0,
        text: '2,5× ATQ.',
      },
      {
        id: 'jajanken-scissors',
        name: 'Jajanken: Tesoura',
        cost: { specific: { nen: 1 }, generic: 0 },
        multiplier: 1.25,
        cooldown: 0,
        keywords: ['piercing'],
        text: '1,25× ATQ. Perfurante.',
      },
    ],
    passives: [
      {
        id: 'wild-instinct',
        name: 'Instinto Selvagem',
        text: '+1 ATQ enquanto estiver com metade do HP ou menos.',
      },
    ],
  },
  {
    id: 'hxh-killua-001',
    type: 'character',
    identity: 'killua-zoldyck',
    name: 'Killua Zoldyck',
    kanji: 'キルア=ゾルディック',
    universe: 'hunter-x-hunter',
    class: 'controller',
    rarity: 'SSR',
    stats: { attack: 4, hp: 12 },
    art: '/assets/cards/hunter-x-hunter/hxh-killua-001.webp',
    keywords: ['haste'],
    abilities: [
      {
        id: 'narukami',
        name: 'Narukami',
        cost: { specific: { nen: 1 }, generic: 0 },
        multiplier: 1,
        cooldown: 2,
        effects: [{ type: 'condition', condition: 'stunned' }],
        text: '1× ATQ. O alvo fica Atordoado. Recarga 2.',
      },
      {
        id: 'shippu-jinrai',
        name: 'Shippū Jinrai',
        cost: { specific: { nen: 1 }, generic: 1 },
        multiplier: 1.75,
        cooldown: 0,
        keywords: ['piercing'],
        text: '1,75× ATQ. Perfurante.',
      },
    ],
    passives: [
      {
        id: 'zoldyck-training',
        name: 'Treinamento Zoldyck',
        text: 'Não pode ficar Envenenado.',
      },
    ],
  },
  {
    id: 'hxh-hisoka-001',
    type: 'character',
    identity: 'hisoka-morow',
    name: 'Hisoka',
    kanji: 'ヒソカ',
    universe: 'hunter-x-hunter',
    class: 'controller',
    rarity: 'UR',
    stats: { attack: 4, hp: 15 },
    art: '/assets/cards/hunter-x-hunter/hxh-hisoka-001.webp',
    abilities: [
      {
        id: 'bungee-gum',
        name: 'Bungee Gum',
        cost: { specific: { nen: 1 }, generic: 0 },
        multiplier: 1.25,
        cooldown: 0,
        effects: [{ type: 'condition', condition: 'sealed' }],
        text: '1,25× ATQ. O alvo fica Selado.',
      },
      {
        id: 'sharp-cards',
        name: 'Cartas Afiadas',
        cost: { specific: { nen: 2 }, generic: 1 },
        multiplier: 2.5,
        cooldown: 0,
        text: '2,5× ATQ.',
      },
    ],
    passives: [
      {
        id: 'thrill-of-battle',
        name: 'Gosto pela Luta',
        text: 'Sempre que um inimigo SSR ou UR entra em campo, ganha +1 ATQ (máximo +2).',
      },
    ],
  },
]
