import {
  RARITY,
  type CardDef,
  type CharacterDef,
  type EnergyDef,
  type Rarity,
  type Universe,
} from './cards'
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
export function openPack(
  pack: PackDef,
  catalog: readonly CardDef[],
  rng: Rng,
  /** Força a raridade do slot raro (o que tem chance de UR). Usado pela garantia. */
  forceRare?: Rarity,
): CardDef[] {
  const inUniverse = (u: Universe) => pack.universe === 'multiverse' || u === pack.universe
  const chars = catalog.filter(
    (c): c is CharacterDef => c.type === 'character' && inUniverse(c.universe),
  )
  const energies = catalog.filter((c): c is EnergyDef => c.type === 'energy')
  const universal = energies.filter((e) => e.energy === 'universal')
  const local = energies.filter((e) => e.energy !== 'universal' && inUniverse(e.universe))
  const energy = (universalChance: number) =>
    pick(rng, rng() * 100 < universalChance || !local.length ? universal : local)

  const guaranteed = forceRare && guaranteeRarity(pack, catalog, forceRare)
  return pack.slots.map((slot) => {
    if (slot.kind === 'energy') return energy(slot.universalChance)
    const rarity = guaranteed && slot.odds.UR ? guaranteed : weighted(rng, slot.odds)
    const pool = chars.filter((c) => c.rarity === rarity)
    return pool.length ? pick(rng, pool) : energy(0)
  })
}

/**
 * Raridade que a garantia entrega neste pack: `cap` (UR por padrão), ou a maior abaixo dela que o
 * universo tiver no slot raro (Bleach ainda não tem UR → SSR). null se não houver nenhuma.
 */
export function guaranteeRarity(
  pack: PackDef,
  catalog: readonly CardDef[],
  cap: Rarity = 'UR',
): Rarity | null {
  const rare = pack.slots.find((s) => s.kind === 'character' && s.odds.UR)
  if (!rare || rare.kind !== 'character') return null
  const has = (r: Rarity) =>
    catalog.some(
      (c) =>
        c.type === 'character' &&
        c.rarity === r &&
        (pack.universe === 'multiverse' || c.universe === pack.universe),
    )
  const order = Object.keys(RARITY) as Rarity[] // C → EX
  return (
    order
      .slice(0, order.indexOf(cap) + 1)
      .reverse()
      .find((r) => rare.odds[r] && has(r)) ?? null
  )
}

/** O pack pode dar LR (tem chance no slot raro e alguma LR no universo)? Só então há garantia de LR. */
export const hasLR = (pack: PackDef, catalog: readonly CardDef[]) =>
  guaranteeRarity(pack, catalog, 'LR') === 'LR'

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

/**
 * Garantia (pity): se os últimos `pity - 1` packs não deram UR (ou melhor), este pack garante um.
 * `sinceUR` = packs abertos desde o último UR/LR; volta a 0 sempre que sai um.
 * `lr` (opcional): garantia própria de LR, só em packs que podem dar LR. Tem prioridade sobre a de UR.
 */
export function openPackWithPity(
  pack: PackDef,
  catalog: readonly CardDef[],
  rng: Rng,
  sinceUR: number,
  pity: number,
  lr?: { since: number; pity: number },
): {
  cards: CardDef[]
  sinceUR: number
  guaranteed: boolean
  sinceLR: number
  guaranteedLR: boolean
} {
  const trackLR = !!lr && hasLR(pack, catalog)
  const guaranteedLR = trackLR && lr.since >= lr.pity - 1
  const guaranteed = !guaranteedLR && sinceUR >= pity - 1
  const cards = openPack(pack, catalog, rng, guaranteedLR ? 'LR' : guaranteed ? 'UR' : undefined)
  const got = (r: Rarity[]) => cards.some((c) => c.type === 'character' && r.includes(c.rarity))
  return {
    cards,
    // Zera também no pack garantido: se o universo não tem UR, ele entregou a melhor raridade possível.
    sinceUR: got(['UR', 'LR']) || guaranteed ? 0 : sinceUR + 1,
    guaranteed,
    sinceLR: !trackLR ? (lr?.since ?? 0) : got(['LR']) ? 0 : lr.since + 1,
    guaranteedLR,
  }
}

/** Média de packs por UR com garantia: (1 − (1 − p)^pity) / p. */
export const expectedPacksPerUR = (p: number, pity: number) => (1 - (1 - p) ** pity) / p
