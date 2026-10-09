import { describe, expect, it } from 'vitest'
import { CATALOG } from '../data/cards'
import { ECONOMY } from '../data/economy'
import { PACKS } from '../data/packs'
import type { CardDef } from './cards'
import { buyPacks, extras, newProfile, sellCard, sellExtras, tierOf } from './economy'
import { seeded } from './rng'

const jjk = PACKS['jujutsu-kaisen']
const multi = PACKS.multiverse
const byId = (id: string) => CATALOG.find((c) => c.id === id)!

describe('comprar packs', () => {
  it('usa packs grátis primeiro e depois cobra Fragmentos', () => {
    const p0 = newProfile(1000, 3)
    const r = buyPacks(p0, jjk, 5, CATALOG, seeded(1), ECONOMY)
    if (!r.ok) throw new Error('compra falhou')
    expect(r.profile.freePacks).toBe(0)
    expect(r.profile.fragments).toBe(800) // 3 grátis + 2 × 100
    expect(r.packs).toHaveLength(5)
    const total = Object.values(r.profile.inventory).reduce((a, n) => a + n, 0)
    expect(total).toBe(25)
  })

  it('recusa sem saldo e não altera o perfil', () => {
    const p0 = newProfile(99, 0)
    expect(buyPacks(p0, jjk, 1, CATALOG, seeded(1), ECONOMY)).toEqual({
      ok: false,
      reason: 'insufficient',
    })
  })

  it('a garantia continua contando entre packs da mesma compra', () => {
    const p0 = { ...newProfile(10_000, 0), pity: { [jjk.id]: ECONOMY.pityUR - 3 } }
    const r = buyPacks(p0, jjk, 5, CATALOG, seeded(2), ECONOMY)
    if (!r.ok) throw new Error('compra falhou')
    const urAt = r.packs.findIndex((pk) =>
      pk.cards.some((c) => c.type === 'character' && c.rarity === 'UR'),
    )
    expect(urAt).toBeGreaterThanOrEqual(0)
    expect(urAt).toBeLessThanOrEqual(2) // no máximo o 3º pack
  })
})

describe('vender', () => {
  it('vende cópias pelo valor da raridade', () => {
    const toji = byId('jjk-toji-001')
    const p = { ...newProfile(0, 0), inventory: { [toji.id]: 3 } }
    const after = sellCard(p, toji, 2, ECONOMY)!
    expect(after.fragments).toBe(2 * ECONOMY.sell.SSR)
    expect(after.inventory[toji.id]).toBe(1)
    expect(sellCard(p, toji, 4, ECONOMY)).toBeNull()
  })

  it('"vender repetidas" preserva o que o deck usa (2 por carta, 1 UR, 10 energias)', () => {
    const gojo = byId('jjk-gojo-001')
    const toji = byId('jjk-toji-001')
    const cursed = byId('energy-cursed')
    const p = { ...newProfile(0, 0), inventory: { [gojo.id]: 2, [toji.id]: 5, [cursed.id]: 13 } }
    const { profile, gained } = sellExtras(p, CATALOG, ECONOMY)
    expect(profile.inventory).toMatchObject({ [gojo.id]: 1, [toji.id]: 2, [cursed.id]: 10 })
    expect(gained).toBe(ECONOMY.sell.UR + 3 * ECONOMY.sell.SSR + 3 * ECONOMY.sell.energy)
    expect(extras(profile, CATALOG, ECONOMY)).toEqual([])
  })

  it('vender um pack inteiro rende em média menos que o preço (sem lucro infinito)', () => {
    const rng = seeded(77)
    const n = 5000
    let total = 0
    for (const pack of [jjk, multi]) {
      const r = buyPacks(newProfile(n * 100, 0), pack, n, CATALOG, rng, ECONOMY)
      if (!r.ok) throw new Error('compra falhou')
      total += r.packs
        .flatMap((pk) => pk.cards)
        .reduce((a: number, c: CardDef) => a + ECONOMY.sell[tierOf(c)], 0)
    }
    expect(total / (2 * n)).toBeLessThan(ECONOMY.packPrice)
  })
})
