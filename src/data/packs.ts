import type { PackDef, PackSlot } from '../engine/packs'
import type { Universe } from '../engine/cards'

// Chances v0.1 (PENDÊNCIAS §14). Demais números seguem como hipótese até o playtest.
// 5 cartas: 2 energias, 2 personagens comuns e 1 "slot raro". UR 3% aprovado em 2026-10-09.
export const SLOTS: PackSlot[] = [
  { kind: 'energy', universalChance: 20 },
  { kind: 'energy', universalChance: 20 },
  { kind: 'character', odds: { C: 75, R: 25 } },
  { kind: 'character', odds: { C: 75, R: 25 } },
  { kind: 'character', odds: { R: 50, SR: 35, SSR: 12, UR: 3 } },
]

/** Universos com LR (e o Multiverso): slot raro com LR 0,5% tirado do R. Aprovado em 2026-10-12. */
export const SLOTS_LR: PackSlot[] = [
  ...SLOTS.slice(0, 4),
  { kind: 'character', odds: { R: 49.5, SR: 35, SSR: 12, UR: 3, LR: 0.5 } },
]

/** Garantia: no máximo 20 packs sem UR (aprovada em 2026-10-09; era 40). */
export const PITY_UR = 20
/** Garantia de LR: no máximo 200 packs sem LR, contada à parte (aprovada em 2026-10-12). */
export const PITY_LR = 200

const pack = (universe: Universe, slots = SLOTS): PackDef => ({
  id: `pack-${universe}`,
  universe,
  slots,
})

export const PACKS: Record<Universe, PackDef> = {
  multiverse: pack('multiverse', SLOTS_LR),
  'jujutsu-kaisen': pack('jujutsu-kaisen'),
  naruto: pack('naruto'),
  'hunter-x-hunter': pack('hunter-x-hunter'),
  bleach: pack('bleach'),
  'dragon-ball': pack('dragon-ball'),
  // EX (Imu) nunca sai de booster. Sem personagens C–UR ainda, essas vagas viram energia (openPack).
  'blue-lock': pack('blue-lock', SLOTS_LR),
  'one-piece': pack('one-piece', SLOTS_LR),
}
