import { ENERGIES } from '../../data/cards'
import { PACKS } from '../../data/packs'
import { UNIVERSES } from '../../data/universes'
import type { Universe } from '../../engine/cards'

/** Contador da garantia, salvo por tipo de pack. Compartilhado com a loja. */
export const pityKey = (u: Universe) => `pity:${PACKS[u].id}`
export const energyNameOf = (u: Universe) =>
  u === 'multiverse'
    ? 'Qualquer universo'
    : (ENERGIES.find((e) => e.energy === UNIVERSES[u].energy)?.name ?? '')
