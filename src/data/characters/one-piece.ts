import type { CharacterDef } from '../../engine/cards'

// LR/EX — hipóteses de CARTAS_ESPECIAIS, sujeitas a playtest. Custos ainda só genéricos; trocar parte por Ego/Haki é decisão de balanceamento pendente.

const imu = {
  id: 'one-piece-imu-ex-001',
  type: 'character',
  identity: 'imu-sama',
  name: 'Imu-sama',
  kanji: 'イム',
  universe: 'one-piece',
  class: 'summoner',
  rarity: 'EX',
  stats: { attack: 6, hp: 20 },
  art: '/assets/cards/one-piece/one-piece-imu-ex-001.webp',
  abilities: [
    {
      id: 'sovereign-decree',
      name: 'Decreto do Soberano',
      cost: { specific: {}, generic: 2 },
      multiplier: 1.5,
      cooldown: 0,
      text: '1,5× ATQ. Aplica Marca Reversi até o fim do próximo turno do alvo.',
    },
    {
      id: 'empty-throne-judgment',
      name: 'Julgamento do Trono Vazio',
      cost: { specific: {}, generic: 4 },
      multiplier: 2,
      cooldown: 2,
      keywords: ['piercing'],
      text: '2× ATQ. Perfurante. Recarga 2.',
    },
  ],
  passives: [
    {
      // Handler pendente no motor: cópia temporária embaralhada no deck (máx. 2 por partida).
      id: 'reversi-domain',
      name: 'Domínio Reversi',
      text: 'Ao derrotar um inimigo diretamente, embaralha no seu deck uma cópia corrompida dele (½ ATQ e ½ HP, sem habilidades). Máx. 2 por partida.',
    },
  ],
} as const satisfies CharacterDef

// Loki: números/passiva propostos por Claude dentro do teto LR — revisar no playtest.
const loki = {
  id: 'one-piece-loki-lr-001',
  type: 'character',
  identity: 'loki-one-piece',
  name: 'Loki',
  kanji: 'ロキ',
  universe: 'one-piece',
  class: 'tank',
  rarity: 'LR',
  stats: { attack: 5, hp: 18 },
  keywords: ['provoke', { id: 'defense', value: 1 }],
  art: '/assets/cards/one-piece/one-piece-loki-lr-001.webp',
  abilities: [
    {
      id: 'ragnir',
      name: 'Ragnir',
      cost: { specific: {}, generic: 2 },
      multiplier: 2,
      cooldown: 0,
      text: '2× ATQ.',
    },
    {
      id: 'ragnarok-hammer',
      name: 'Martelo do Ragnarok',
      cost: { specific: {}, generic: 3 },
      multiplier: 2.5,
      cooldown: 2,
      effects: [{ type: 'condition', condition: 'stunned' }],
      text: '2,5× ATQ. Atordoa o alvo. Recarga 2.',
    },
    {
      // 3ª habilidade: exclusiva de LR/EX (DECISIONS 12/10/2026).
      id: 'giant-hide',
      name: 'Pele de Gigante',
      cost: { specific: {}, generic: 1 },
      multiplier: 0,
      cooldown: 1,
      target: 'self',
      effects: [{ type: 'shield', value: 3 }],
      text: 'Ganha Escudo 3. Recarga 1.',
    },
  ],
  passives: [
    {
      // Handler pendente no motor (M4).
      id: 'giant-blood',
      name: 'Sangue de Gigante',
      text: 'A primeira vez que Loki sofre dano em cada turno do oponente, ganha +1 ATQ até o fim do seu próximo turno (máx. +2).',
    },
  ],
} as const satisfies CharacterDef

export const ONE_PIECE: readonly CharacterDef[] = [imu, loki]
