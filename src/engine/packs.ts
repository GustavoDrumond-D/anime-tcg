import type { CardDef, CharacterDef, EnergyDef, Rarity, Universe } from './cards'
import { pick, weighted, type Rng } from './rng'

/** Cada posição do pack tem sua própria tabela (estilo "slot raro" dos TCGs). Pesos em %. */
export type PackSlot =
  | { kind: 'energy'; universalChance: number }
  | { kind: 'character'; odds: Partial<Record<Rarity, number>> }

export interface PackDef {
  id: string
  universe: Universe
  slots: PackSlot[]
}

/**
 * Abre um pack. Puro: o mesmo rng gera o mesmo resultado.
 * Se o catálogo ainda não tem personagem da raridade sorteada, a posição vira energia do universo.
 */
export function openPack(pack: PackDef, catalog: readonly CardDef[], rng: Rng): CardDef[] {
  const inUniverse = (u: Universe) => pack.universe === 'multiverse' || u === pack.universe
  const chars = catalog.filter(
    (c): c is CharacterDef => c.type === 'character' && inUniverse(c.universe),
  )
  const energies = catalog.filter((c): c is EnergyDef => c.type === 'energy')
  const universal = energies.filter((e) => e.energy === 'universal')
  const local = energies.filter((e) => e.energy !== 'universal' && inUniverse(e.universe))
  const energy = (universalChance: number) =>
    pick(rng, rng() * 100 < universalChance || !local.length ? universal : local)

  return pack.slots.map((slot) => {
    if (slot.kind === 'energy') return energy(slot.universalChance)
    const rarity = weighted(rng, slot.odds)
    const pool = chars.filter((c) => c.rarity === rarity)
    return pool.length ? pick(rng, pool) : energy(0)
  })
}

/** Chance (0–1) de vir ao menos uma carta de cada raridade no pack, para exibir ao jogador. */
export function chanceAtLeastOne(pack: PackDef, rarity: Rarity): number {
  let none = 1
  for (const s of pack.slots) {
    if (s.kind !== 'character') continue
    const total = Object.values(s.odds).reduce((a, n) => a + (n ?? 0), 0)
    none *= 1 - (s.odds[rarity] ?? 0) / total
  }
  return 1 - none
}
