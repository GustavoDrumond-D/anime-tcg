import type { EnergyType, Universe } from '../engine/cards'

export const UNIVERSES: Record<Universe, { name: string; energy: EnergyType; pack: string }> = {
  multiverse: { name: 'Multiverso', energy: 'universal', pack: '/assets/packs/multiverse.webp' },
  'jujutsu-kaisen': {
    name: 'Jujutsu Kaisen',
    energy: 'cursed',
    pack: '/assets/packs/jujutsu-kaisen.webp',
  },
  naruto: { name: 'Naruto', energy: 'chakra', pack: '/assets/packs/naruto.webp' },
  'hunter-x-hunter': {
    name: 'Hunter x Hunter',
    energy: 'nen',
    pack: '/assets/packs/hunter-x-hunter.webp',
  },
  bleach: { name: 'Bleach', energy: 'reiatsu', pack: '/assets/packs/bleach.webp' },
  'dragon-ball': { name: 'Dragon Ball', energy: 'ki', pack: '/assets/packs/dragon-ball.webp' },
}

/** Cor de cada energia na UI (pips de custo, filtros). */
export const ENERGY_COLOR: Record<EnergyType | 'generic', string> = {
  universal: '#E8E3D3',
  cursed: '#8B5CF6',
  chakra: '#3B82F6',
  nen: '#22C55E',
  reiatsu: '#93C5FD',
  ki: '#F59E0B',
  generic: '#A7ADBD',
}
