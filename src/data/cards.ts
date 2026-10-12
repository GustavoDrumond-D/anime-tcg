import type { CardDef, CharacterDef, EnergyDef } from '../engine/cards'
import { BLEACH } from './characters/bleach'
import { BLUE_LOCK } from './characters/blue-lock'
import { DRAGON_BALL } from './characters/dragon-ball'
import { HUNTER_X_HUNTER } from './characters/hunter-x-hunter'
import { JUJUTSU_KAISEN } from './characters/jujutsu-kaisen'
import { NARUTO } from './characters/naruto'
import { ONE_PIECE } from './characters/one-piece'

const energy = (
  e: EnergyDef['energy'],
  name: string,
  universe: EnergyDef['universe'],
): EnergyDef => ({
  id: `energy-${e}`,
  type: 'energy',
  energy: e,
  name,
  universe,
  art: `/assets/energies/${e}.webp`,
})

export const CHARACTERS: readonly CharacterDef[] = [
  ...JUJUTSU_KAISEN,
  ...NARUTO,
  ...HUNTER_X_HUNTER,
  ...BLEACH,
  ...DRAGON_BALL,
  ...BLUE_LOCK,
  ...ONE_PIECE,
]

export const ENERGIES: readonly EnergyDef[] = [
  energy('universal', 'Energia Universal', 'multiverse'),
  energy('cursed', 'Energia Amaldiçoada', 'jujutsu-kaisen'),
  energy('chakra', 'Chakra', 'naruto'),
  energy('nen', 'Nen', 'hunter-x-hunter'),
  energy('reiatsu', 'Reiatsu', 'bleach'),
  energy('ki', 'Ki', 'dragon-ball'),
  energy('ego', 'Energia de Ego', 'blue-lock'),
  energy('haki', 'Haki', 'one-piece'),
]

export const CATALOG: readonly CardDef[] = [...CHARACTERS, ...ENERGIES]
