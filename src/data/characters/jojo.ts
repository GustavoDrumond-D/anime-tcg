import { STEEL_BALL_RUN } from './jojo-steel-ball-run'
import type { CharacterDef } from '../../engine/cards'

// Catálogo de boosters; habilidades são dados para o futuro motor, não combate implementado.
// Adaptações dos Stands às palavras-chave existentes. Números sujeitos a playtest.
export const JOJO: readonly CharacterDef[] = [
  ...STEEL_BALL_RUN,
  {
    id: 'jojo-jotaro-001',
    type: 'character',
    identity: 'jotaro-kujo',
    name: 'Jotaro Kujo',
    kanji: '空条承太郎',
    universe: 'jojo',
    class: 'controller',
    rarity: 'UR',
    stats: {
      attack: 4,
      hp: 16,
    },
    art: '/assets/cards/jojo/jojo-jotaro-001.webp',
    abilities: [
      {
        id: 'ora-ora',
        name: 'ORA ORA ORA!',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 1,
        },
        multiplier: 1.75,
        cooldown: 0,
        text: '1,75× ATQ.',
      },
      {
        id: 'star-platinum-the-world',
        name: 'Star Platinum: The World',
        cost: {
          specific: {
            stand: 2,
          },
          generic: 1,
        },
        multiplier: 1.5,
        cooldown: 3,
        effects: [
          {
            type: 'condition',
            condition: 'stunned',
          },
        ],
        text: '1,5× ATQ. Atordoa o alvo. Recarga 3.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-dio-001',
    type: 'character',
    identity: 'dio',
    name: 'DIO',
    kanji: 'ディオ',
    universe: 'jojo',
    class: 'fighter',
    rarity: 'UR',
    stats: {
      attack: 4,
      hp: 16,
    },
    art: '/assets/cards/jojo/jojo-dio-001.webp',
    abilities: [
      {
        id: 'knife-barrage',
        name: 'Rajada de Facas',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 1,
        },
        multiplier: 1.75,
        cooldown: 0,
        keywords: ['piercing'],
        text: '1,75× ATQ. Perfurante.',
      },
      {
        id: 'the-world',
        name: 'The World',
        cost: {
          specific: {
            stand: 2,
          },
          generic: 1,
        },
        multiplier: 1.5,
        cooldown: 3,
        effects: [
          {
            type: 'condition',
            condition: 'stunned',
          },
        ],
        text: '1,5× ATQ. Atordoa o alvo. Recarga 3.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-giorno-001',
    type: 'character',
    identity: 'giorno-giovanna',
    name: 'Giorno Giovanna',
    kanji: 'ジョルノ・ジョバァーナ',
    universe: 'jojo',
    class: 'support',
    rarity: 'SSR',
    stats: {
      attack: 3,
      hp: 14,
    },
    art: '/assets/cards/jojo/jojo-giorno-001.webp',
    abilities: [
      {
        id: 'life-creation',
        name: 'Gold Experience: Vida',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 0,
        },
        multiplier: 0,
        cooldown: 0,
        target: 'ally',
        effects: [
          {
            type: 'heal',
            value: 4,
          },
        ],
        text: 'Cura 4 HP de um aliado.',
      },
      {
        id: 'life-protection',
        name: 'Proteção Vital',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 1,
        },
        multiplier: 0,
        cooldown: 2,
        target: 'ally',
        effects: [
          {
            type: 'shield',
            value: 5,
          },
        ],
        text: 'Concede Escudo 5 a um aliado. Recarga 2.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-josuke-001',
    type: 'character',
    identity: 'josuke-higashikata',
    name: 'Josuke Higashikata',
    kanji: '東方仗助',
    universe: 'jojo',
    class: 'support',
    rarity: 'SR',
    stats: {
      attack: 3,
      hp: 12,
    },
    art: '/assets/cards/jojo/jojo-josuke-001.webp',
    abilities: [
      {
        id: 'dorarara',
        name: 'DORARARA!',
        cost: {
          specific: {},
          generic: 1,
        },
        multiplier: 1.5,
        cooldown: 0,
        text: '1,5× ATQ.',
      },
      {
        id: 'crazy-diamond',
        name: 'Crazy Diamond: Restauração',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 0,
        },
        multiplier: 0,
        cooldown: 1,
        target: 'ally',
        effects: [
          {
            type: 'heal',
            value: 4,
          },
        ],
        text: 'Cura 4 HP de um aliado. Recarga 1.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-kakyoin-001',
    type: 'character',
    identity: 'noriaki-kakyoin',
    name: 'Noriaki Kakyoin',
    kanji: '花京院典明',
    universe: 'jojo',
    class: 'controller',
    rarity: 'SR',
    stats: {
      attack: 3,
      hp: 12,
    },
    art: '/assets/cards/jojo/jojo-kakyoin-001.webp',
    abilities: [
      {
        id: 'emerald-splash',
        name: 'Emerald Splash',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 1,
        },
        multiplier: 2,
        cooldown: 0,
        text: '2× ATQ.',
      },
      {
        id: 'emerald-bind',
        name: 'Amarras Esmeralda',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 0,
        },
        multiplier: 0,
        cooldown: 2,
        effects: [
          {
            type: 'condition',
            condition: 'sealed',
          },
        ],
        text: 'Sela o alvo. Recarga 2.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-polnareff-001',
    type: 'character',
    identity: 'jean-pierre-polnareff',
    name: 'Jean Pierre Polnareff',
    kanji: 'ポルナレフ',
    universe: 'jojo',
    class: 'fighter',
    rarity: 'R',
    stats: {
      attack: 3,
      hp: 10,
    },
    art: '/assets/cards/jojo/jojo-polnareff-001.webp',
    abilities: [
      {
        id: 'silver-chariot',
        name: 'Silver Chariot: Estocada',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 0,
        },
        multiplier: 1.25,
        cooldown: 0,
        keywords: ['piercing'],
        text: '1,25× ATQ. Perfurante.',
      },
      {
        id: 'unarmored-rush',
        name: 'Investida sem Armadura',
        cost: {
          specific: {},
          generic: 0,
        },
        multiplier: 2,
        cooldown: 2,
        effects: [
          {
            type: 'self_damage',
            value: 2,
          },
        ],
        text: '2× ATQ. Sofre 2 de dano em si mesmo. Recarga 2.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-iggy-001',
    type: 'character',
    identity: 'iggy',
    name: 'Iggy',
    kanji: 'イギー',
    universe: 'jojo',
    class: 'tank',
    rarity: 'C',
    stats: {
      attack: 1,
      hp: 8,
    },
    keywords: ['provoke'],
    art: '/assets/cards/jojo/jojo-iggy-001.webp',
    abilities: [
      {
        id: 'the-fool',
        name: 'The Fool: Abrigo de Areia',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 0,
        },
        multiplier: 0,
        cooldown: 1,
        target: 'self',
        effects: [
          {
            type: 'shield',
            value: 3,
          },
        ],
        text: 'Ganha Escudo 3. Recarga 1.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-avdol-001',
    type: 'character',
    identity: 'muhammad-avdol',
    name: 'Muhammad Avdol',
    kanji: 'モハメド・アヴドゥル',
    universe: 'jojo',
    class: 'fighter',
    rarity: 'SR',
    stats: {
      attack: 3,
      hp: 12,
    },
    art: '/assets/cards/jojo/jojo-avdol-001.webp',
    abilities: [
      {
        id: 'crossfire-hurricane',
        name: 'Crossfire Hurricane',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 1,
        },
        multiplier: 2,
        cooldown: 0,
        text: '2× ATQ.',
      },
      {
        id: 'red-bind',
        name: 'Magician’s Red: Amarras',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 0,
        },
        multiplier: 1,
        cooldown: 2,
        effects: [
          {
            type: 'condition',
            condition: 'stunned',
          },
        ],
        text: '1× ATQ. Atordoa o alvo. Recarga 2.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-joseph-001',
    type: 'character',
    identity: 'joseph-joestar',
    name: 'Joseph Joestar',
    kanji: 'ジョセフ・ジョースター',
    universe: 'jojo',
    class: 'controller',
    rarity: 'SR',
    stats: {
      attack: 3,
      hp: 12,
    },
    art: '/assets/cards/jojo/jojo-joseph-001.webp',
    abilities: [
      {
        id: 'hermit-purple',
        name: 'Hermit Purple',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 0,
        },
        multiplier: 1,
        cooldown: 2,
        effects: [
          {
            type: 'condition',
            condition: 'sealed',
          },
        ],
        text: '1× ATQ. Sela o alvo. Recarga 2.',
      },
      {
        id: 'thorn-barrier',
        name: 'Barreira de Espinhos',
        cost: {
          specific: {},
          generic: 1,
        },
        multiplier: 0,
        cooldown: 1,
        target: 'ally',
        effects: [
          {
            type: 'shield',
            value: 3,
          },
        ],
        text: 'Concede Escudo 3 a um aliado. Recarga 1.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-jolyne-001',
    type: 'character',
    identity: 'jolyne-cujoh',
    name: 'Jolyne Cujoh',
    kanji: '空条徐倫',
    universe: 'jojo',
    class: 'fighter',
    rarity: 'SSR',
    stats: {
      attack: 4,
      hp: 14,
    },
    art: '/assets/cards/jojo/jojo-jolyne-001.webp',
    abilities: [
      {
        id: 'stone-free',
        name: 'Stone Free: Rajada',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 1,
        },
        multiplier: 2,
        cooldown: 0,
        text: '2× ATQ.',
      },
      {
        id: 'string-guard',
        name: 'Trama Protetora',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 0,
        },
        multiplier: 0,
        cooldown: 1,
        target: 'ally',
        effects: [
          {
            type: 'shield',
            value: 4,
          },
        ],
        text: 'Concede Escudo 4 a um aliado. Recarga 1.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-bruno-001',
    type: 'character',
    identity: 'bruno-bucciarati',
    name: 'Bruno Bucciarati',
    kanji: 'ブローノ・ブチャラティ',
    universe: 'jojo',
    class: 'controller',
    rarity: 'SSR',
    stats: {
      attack: 4,
      hp: 14,
    },
    art: '/assets/cards/jojo/jojo-bruno-001.webp',
    abilities: [
      {
        id: 'sticky-fingers',
        name: 'Sticky Fingers',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 1,
        },
        multiplier: 1.75,
        cooldown: 0,
        keywords: ['piercing'],
        text: '1,75× ATQ. Perfurante.',
      },
      {
        id: 'zipper-prison',
        name: 'Prisão de Zíper',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 1,
        },
        multiplier: 1,
        cooldown: 2,
        effects: [
          {
            type: 'condition',
            condition: 'sealed',
          },
        ],
        text: '1× ATQ. Sela o alvo. Recarga 2.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-mista-001',
    type: 'character',
    identity: 'guido-mista',
    name: 'Guido Mista',
    kanji: 'グイード・ミスタ',
    universe: 'jojo',
    class: 'fighter',
    rarity: 'R',
    stats: {
      attack: 3,
      hp: 10,
    },
    art: '/assets/cards/jojo/jojo-mista-001.webp',
    abilities: [
      {
        id: 'sex-pistols',
        name: 'Sex Pistols',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 0,
        },
        multiplier: 1.25,
        cooldown: 0,
        effects: [
          {
            type: 'critical_chance',
            value: 0.3,
          },
        ],
        text: '1,25× ATQ. Chance de crítico de 30%.',
      },
      {
        id: 'ricochet',
        name: 'Ricochete',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 1,
        },
        multiplier: 1.75,
        cooldown: 0,
        keywords: ['piercing'],
        text: '1,75× ATQ. Perfurante.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-narancia-001',
    type: 'character',
    identity: 'narancia-ghirga',
    name: 'Narancia Ghirga',
    kanji: 'ナランチャ・ギルガ',
    universe: 'jojo',
    class: 'fighter',
    rarity: 'C',
    stats: {
      attack: 2,
      hp: 8,
    },
    art: '/assets/cards/jojo/jojo-narancia-001.webp',
    abilities: [
      {
        id: 'aerosmith',
        name: 'Aerosmith',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 0,
        },
        multiplier: 1.5,
        cooldown: 0,
        text: '1,5× ATQ.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-koichi-001',
    type: 'character',
    identity: 'koichi-hirose',
    name: 'Koichi Hirose',
    kanji: '広瀬康一',
    universe: 'jojo',
    class: 'controller',
    rarity: 'C',
    stats: {
      attack: 2,
      hp: 8,
    },
    art: '/assets/cards/jojo/jojo-koichi-001.webp',
    abilities: [
      {
        id: 'three-freeze',
        name: 'Echoes ACT 3: Three Freeze',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 0,
        },
        multiplier: 0,
        cooldown: 2,
        effects: [
          {
            type: 'condition',
            condition: 'stunned',
          },
        ],
        text: 'Atordoa o alvo. Recarga 2.',
      },
    ],
    passives: [],
  },
  {
    id: 'jojo-okuyasu-001',
    type: 'character',
    identity: 'okuyasu-nijimura',
    name: 'Okuyasu Nijimura',
    kanji: '虹村億泰',
    universe: 'jojo',
    class: 'fighter',
    rarity: 'R',
    stats: {
      attack: 3,
      hp: 10,
    },
    art: '/assets/cards/jojo/jojo-okuyasu-001.webp',
    abilities: [
      {
        id: 'the-hand',
        name: 'The Hand',
        cost: {
          specific: {
            stand: 1,
          },
          generic: 1,
        },
        multiplier: 1.75,
        cooldown: 0,
        keywords: ['piercing'],
        text: '1,75× ATQ. Perfurante.',
      },
    ],
    passives: [],
  },
]
