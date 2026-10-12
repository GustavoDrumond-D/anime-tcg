import type { CharacterDef } from '../../engine/cards'

// LR — hipóteses de CARTAS_ESPECIAIS, sujeitas a playtest. Custos ainda só genéricos; trocar parte por Ego/Haki é decisão de balanceamento pendente.
// A versão "Imperador das Rosas" (mesma identidade) ainda não tem arte; entra depois.

const kaiserImpact = {
  id: 'blue-lock-kaiser-lr-impact-001',
  type: 'character',
  identity: 'michael-kaiser',
  name: 'Michael Kaiser',
  universe: 'blue-lock',
  class: 'fighter',
  rarity: 'LR',
  stats: { attack: 5, hp: 18 },
  art: '/assets/cards/blue-lock/blue-lock-kaiser-lr-impact-001.webp',
  abilities: [
    {
      id: 'kaiser-impact',
      name: 'Kaiser Impact',
      cost: { specific: {}, generic: 2 },
      multiplier: 2,
      cooldown: 0,
      text: '2× ATQ.',
    },
    {
      id: 'kaiser-impact-magnus',
      name: 'Kaiser Impact: Magnus',
      cost: { specific: {}, generic: 4 },
      multiplier: 2.5,
      cooldown: 2,
      keywords: ['trample'],
      text: '2,5× ATQ. Penetração. Recarga 2.',
    },
    {
      // 3ª habilidade: exclusiva de LR/EX (DECISIONS 12/10/2026). Proposta, revisar no playtest.
      id: 'imperial-volley',
      name: 'Voleio Imperial',
      cost: { specific: {}, generic: 1 },
      multiplier: 1.25,
      cooldown: 0,
      effects: [{ type: 'critical_chance', value: 0.3 }],
      text: '1,25× ATQ. Chance de crítico 30%.',
    },
  ],
  passives: [
    {
      id: 'finishing-instinct',
      name: 'Instinto de Finalização',
      text: 'Uma vez por turno, ao derrotar um inimigo com habilidade, restaura 1 energia genérica esgotada.',
    },
  ],
} as const satisfies CharacterDef

export const BLUE_LOCK: readonly CharacterDef[] = [kaiserImpact]
