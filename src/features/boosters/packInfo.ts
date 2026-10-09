import { ENERGIES } from '../../data/cards'
import { UNIVERSES } from '../../data/universes'
import type { Universe } from '../../engine/cards'

export const energyNameOf = (u: Universe) =>
  u === 'multiverse'
    ? 'Qualquer universo'
    : (ENERGIES.find((e) => e.energy === UNIVERSES[u].energy)?.name ?? '')
