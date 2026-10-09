import type { PackDef, PackSlot } from '../engine/packs'
import type { Universe } from '../engine/cards'

// Proposta v0.1 de chances (PENDÊNCIAS §14), aguardando aprovação/playtest.
// 5 cartas: 2 energias, 2 personagens comuns e 1 "slot raro".
export const SLOTS: PackSlot[] = [
  { kind: 'energy', universalChance: 20 },
  { kind: 'energy', universalChance: 20 },
  { kind: 'character', odds: { C: 75, R: 25 } },
  { kind: 'character', odds: { C: 75, R: 25 } },
  { kind: 'character', odds: { R: 50, SR: 35, SSR: 12, UR: 3 } },
]

const pack = (universe: Universe): PackDef => ({ id: `pack-${universe}`, universe, slots: SLOTS })

export const PACKS: Record<Universe, PackDef> = {
  multiverse: pack('multiverse'),
  'jujutsu-kaisen': pack('jujutsu-kaisen'),
  naruto: pack('naruto'),
  'hunter-x-hunter': pack('hunter-x-hunter'),
  bleach: pack('bleach'),
  'dragon-ball': pack('dragon-ball'),
}
