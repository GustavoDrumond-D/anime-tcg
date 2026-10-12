import type { EconomyRules } from '../engine/economy'
import { PITY_UR } from './packs'

// Economia v0.1 aprovada em 2026-10-09 (ver DECISIONS). Ajustável no playtest.
export const START_FRAGMENTS = 1000
export const START_FREE_PACKS = 3

export const ECONOMY: EconomyRules = {
  packPrice: 100,
  pityUR: PITY_UR,
  // Retorno médio de vender um pack inteiro fica abaixo do preço (teste em economy.test.ts),
  // senão comprar e vender viraria fonte infinita de Fragmentos.
  // LR/EX não se vendem (0): vêm de concessão/evento, não de booster.
  sell: { energy: 5, C: 10, R: 20, SR: 40, SSR: 100, UR: 300, LR: 0, EX: 0 },
  keep: { energy: 10, C: 2, R: 2, SR: 2, SSR: 2, UR: 1, LR: 1, EX: 1 },
}
