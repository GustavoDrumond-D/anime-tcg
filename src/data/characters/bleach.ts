import type { CharacterDef } from '../../engine/cards'

// Proposta 2026-10-09 — aguardando aprovação. Números = hipóteses de balanceamento.

export const BLEACH: readonly CharacterDef[] = [
  {
    id: 'ble-ichigo-001',
    type: 'character',
    identity: 'ichigo-kurosaki',
    name: 'Ichigo Kurosaki',
    kanji: '黒崎一護',
    universe: 'bleach',
    class: 'fighter',
    rarity: 'SSR',
    stats: { attack: 4, hp: 14 },
    abilities: [
      {
        id: 'getsuga-tensho',
        name: 'Getsuga Tenshō',
        cost: { specific: { reiatsu: 1 }, generic: 1 },
        multiplier: 2,
        cooldown: 0,
        text: '2× ATQ.',
      },
      {
        id: 'bankai',
        name: 'Bankai',
        cost: { specific: { reiatsu: 2 }, generic: 0 },
        multiplier: 0,
        cooldown: 3,
        target: 'self',
        effects: [{ type: 'buff_attack', value: 2 }],
        text: '+2 ATQ até o fim do seu próximo turno. Recarga 3.',
      },
    ],
    passives: [
      {
        id: 'inner-hollow',
        name: 'Hollow Interior',
        text: 'Na primeira vez que ficar com 4 HP ou menos, seu próximo ataque causa +3 de dano.',
      },
    ],
  },
  {
    id: 'ble-rukia-001',
    type: 'character',
    identity: 'rukia-kuchiki',
    name: 'Rukia Kuchiki',
    kanji: '朽木ルキア',
    universe: 'bleach',
    class: 'controller',
    rarity: 'R',
    stats: { attack: 3, hp: 10 },
    abilities: [
      {
        id: 'tsukishiro',
        name: 'Dança da Lua Branca',
        cost: { specific: { reiatsu: 1 }, generic: 1 },
        multiplier: 1.5,
        cooldown: 2,
        effects: [{ type: 'condition', condition: 'stunned' }],
        text: '1,5× ATQ. O alvo fica Atordoado (congelado). Recarga 2.',
      },
    ],
    passives: [],
  },
  {
    id: 'ble-orihime-001',
    type: 'character',
    identity: 'orihime-inoue',
    name: 'Orihime Inoue',
    kanji: '井上織姫',
    universe: 'bleach',
    class: 'support',
    rarity: 'C',
    stats: { attack: 1, hp: 8 },
    abilities: [
      {
        id: 'santen-kesshun',
        name: 'Santen Kesshun',
        cost: { specific: { reiatsu: 1 }, generic: 0 },
        multiplier: 0,
        cooldown: 0,
        target: 'ally',
        effects: [{ type: 'shield', value: 3 }],
        text: 'Um aliado ganha Escudo 3.',
      },
    ],
    passives: [],
  },
]
