// Economia (Fragmentos), inventário e compra de packs. Puro: sem React, sem armazenamento.
import type { CardDef, Rarity } from './cards'
import { openPackWithPity, type PackDef } from './packs'
import type { Rng } from './rng'

export type Tier = Rarity | 'energy'

export interface EconomyRules {
  packPrice: number
  pityUR: number
  pityLR: number
  /** Fragmentos recebidos por cópia vendida. */
  sell: Record<Tier, number>
  /** Cópias que "Vender repetidas" preserva (limite do deck: 2 por identidade, 1 UR). */
  keep: Record<Tier, number>
}

export interface Profile {
  version: 1
  fragments: number
  freePacks: number
  /** cardId → cópias. */
  inventory: Record<string, number>
  /** packId → packs abertos desde o último UR; `${packId}:LR` → desde a última LR. */
  pity: Record<string, number>
}

export const newProfile = (fragments: number, freePacks: number): Profile => ({
  version: 1,
  fragments,
  freePacks,
  inventory: {},
  pity: {},
})

export const tierOf = (c: CardDef): Tier => (c.type === 'energy' ? 'energy' : c.rarity)

/** Custo de abrir `count` packs: packs grátis são usados primeiro. */
export function packCost(p: Profile, count: number, rules: EconomyRules) {
  const free = Math.min(p.freePacks, count)
  return { free, fragments: (count - free) * rules.packPrice }
}

export type OpenedPack = { cards: CardDef[]; guaranteed: boolean; guaranteedLR: boolean }
export type BuyResult =
  { ok: true; profile: Profile; packs: OpenedPack[] } | { ok: false; reason: 'insufficient' }

/** Compra e abre packs. As cartas entram no inventário na hora: recarregar não rerrola. */
export function buyPacks(
  p: Profile,
  pack: PackDef,
  count: number,
  catalog: readonly CardDef[],
  rng: Rng,
  rules: EconomyRules,
): BuyResult {
  const cost = packCost(p, count, rules)
  if (cost.fragments > p.fragments) return { ok: false, reason: 'insufficient' }
  const lrKey = `${pack.id}:LR`
  let since = p.pity[pack.id] ?? 0
  let sinceLR = p.pity[lrKey] ?? 0
  const inventory = { ...p.inventory }
  const packs: OpenedPack[] = []
  for (let i = 0; i < count; i++) {
    const r = openPackWithPity(pack, catalog, rng, since, rules.pityUR, {
      since: sinceLR,
      pity: rules.pityLR,
    })
    since = r.sinceUR
    sinceLR = r.sinceLR
    for (const c of r.cards) inventory[c.id] = (inventory[c.id] ?? 0) + 1
    packs.push({ cards: r.cards, guaranteed: r.guaranteed, guaranteedLR: r.guaranteedLR })
  }
  return {
    ok: true,
    packs,
    profile: {
      ...p,
      fragments: p.fragments - cost.fragments,
      freePacks: p.freePacks - cost.free,
      inventory,
      pity: { ...p.pity, [pack.id]: since, [lrKey]: sinceLR },
    },
  }
}

/** Vende `qty` cópias. Retorna null se não houver cópias suficientes. */
export function sellCard(
  p: Profile,
  card: CardDef,
  qty: number,
  rules: EconomyRules,
): Profile | null {
  const have = p.inventory[card.id] ?? 0
  if (qty < 1 || qty > have) return null
  return {
    ...p,
    fragments: p.fragments + qty * rules.sell[tierOf(card)],
    inventory: { ...p.inventory, [card.id]: have - qty },
  }
}

/** Cópias acima do que o deck usa. */
export function extras(p: Profile, catalog: readonly CardDef[], rules: EconomyRules) {
  return catalog
    .map((card) => ({ card, qty: (p.inventory[card.id] ?? 0) - rules.keep[tierOf(card)] }))
    .filter((e) => e.qty > 0)
}

export function sellExtras(p: Profile, catalog: readonly CardDef[], rules: EconomyRules) {
  let profile = p
  let gained = 0
  for (const { card, qty } of extras(p, catalog, rules)) {
    profile = sellCard(profile, card, qty, rules)!
    gained += qty * rules.sell[tierOf(card)]
  }
  return { profile, gained }
}
