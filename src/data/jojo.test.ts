import { describe, expect, it } from 'vitest'
import { buyPacks, newProfile, tierOf } from '../engine/economy'
import { openPack, openPackWithPity } from '../engine/packs'
import { seeded } from '../engine/rng'
import { CATALOG, ENERGIES } from './cards'
import { JOJO } from './characters/jojo'
import { ECONOMY } from './economy'
import { PACKS, PITY_UR, SLOTS } from './packs'
import { ENERGY_COLOR, UNIVERSES } from './universes'

describe('expansão JoJo e Steel Ball Run', () => {
  const pack = PACKS.jojo
  it('tem 20 identidades e cobre todas as raridades dos boosters', () => {
    expect(JOJO).toHaveLength(20)
    expect(new Set(JOJO.map((c) => c.identity)).size).toBe(20)
    for (const slot of SLOTS) {
      if (slot.kind !== 'character') continue
      for (const rarity of Object.keys(slot.odds))
        expect(
          JOJO.some((c) => c.rarity === rarity),
          rarity,
        ).toBe(true)
    }
    for (const card of JOJO) {
      expect(card.universe).toBe('jojo')
      expect(card.abilities.length).toBeGreaterThan(0)
      expect(
        card.abilities.every((a) => Object.keys(a.cost.specific).every((k) => k === 'stand')),
      ).toBe(true)
    }
    for (const id of ['johnny', 'gyro', 'diego', 'valentine', 'hot-pants'])
      expect(JOJO.some((c) => c.id === 'jojo-' + id + '-001')).toBe(true)
    expect(
      JOJO.find((c) => c.identity === 'gyro-zeppeli')!.abilities.every(
        (a) => Object.keys(a.cost.specific).length === 0,
      ),
    ).toBe(true)
  })

  it('registra energia, cor e arquivos de todas as cartas e booster', () => {
    const files = Object.keys(import.meta.glob('/public/assets/**/*.webp'))
    expect(UNIVERSES.jojo.energy).toBe('stand')
    expect(ENERGY_COLOR.stand).toMatch(/^#[0-9a-f]{6}$/i)
    const energy = ENERGIES.find((c) => c.energy === 'stand')!
    expect(energy.universe).toBe('jojo')
    expect(files).toContain('/public' + energy.art)
    expect(files).toContain('/public' + UNIVERSES.jojo.pack)
    for (const card of JOJO) {
      expect(card.art).toBeTruthy()
      expect(files).toContain('/public' + card.art)
    }
  })

  it('sorteia 2 energias e 3 personagens, com todas as 20 cartas alcançáveis', () => {
    const rng = seeded(20261012)
    const seen = new Set<string>()
    let stand = 0
    for (let i = 0; i < 3000; i++) {
      const cards = openPack(pack, CATALOG, rng)
      expect(cards).toHaveLength(5)
      for (const card of cards.slice(0, 2)) {
        expect(card.type).toBe('energy')
        if (card.type === 'energy') {
          expect(['stand', 'universal']).toContain(card.energy)
          if (card.energy === 'stand') stand++
        }
      }
      for (const card of cards.slice(2)) {
        expect(card.type).toBe('character')
        expect(card.universe).toBe('jojo')
        seen.add(card.id)
      }
    }
    expect([...seen].sort()).toEqual(JOJO.map((c) => c.id).sort())
    expect(stand / 6000).toBeGreaterThan(0.77)
    expect(stand / 6000).toBeLessThan(0.83)
  })

  it('garante UR JoJo no vigésimo pack', () => {
    const result = openPackWithPity(pack, CATALOG, seeded(1), PITY_UR - 1, PITY_UR)
    expect(result.guaranteed).toBe(true)
    expect(result.sinceUR).toBe(0)
    expect(result.cards[4]).toMatchObject({ type: 'character', universe: 'jojo', rarity: 'UR' })
  })

  it('compra ×5 preservando inventário antigo e garantia de outros universos', () => {
    const profile = {
      ...newProfile(1000, 0),
      inventory: { 'nar-naruto-001': 2 },
      pity: { 'pack-naruto': 9 },
    }
    const before = JSON.stringify(profile)
    const result = buyPacks(profile, pack, 5, CATALOG, seeded(12), ECONOMY)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.profile.fragments).toBe(500)
    expect(result.profile.inventory['nar-naruto-001']).toBe(2)
    expect(result.profile.pity['pack-naruto']).toBe(9)
    expect(result.profile.pity[pack.id]).toBeGreaterThanOrEqual(0)
    expect(result.profile.pity[pack.id]).toBeLessThanOrEqual(5)
    expect(Object.values(result.profile.inventory).reduce((sum, n) => sum + n, 0)).toBe(27)
    expect(JSON.stringify(profile)).toBe(before)
  })

  it('inclui JoJo no Multiverso sem contaminar o booster Naruto', () => {
    const rng = seeded(42)
    const seen = new Set<string>()
    for (let i = 0; i < 5000; i++) {
      for (const card of openPack(PACKS.multiverse, CATALOG, rng)) seen.add(card.id)
      for (const card of openPack(PACKS.naruto, CATALOG, rng))
        expect(card.universe).not.toBe('jojo')
    }
    for (const card of JOJO) expect(seen.has(card.id), card.id).toBe(true)
    expect(seen.has('energy-stand')).toBe(true)
  })

  it('mantém venda média abaixo do custo, inclusive com garantia', () => {
    const count = 5000
    const result = buyPacks(newProfile(count * 100, 0), pack, count, CATALOG, seeded(77), ECONOMY)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const value = result.packs
      .flatMap((p) => p.cards)
      .reduce((sum, c) => sum + ECONOMY.sell[tierOf(c)], 0)
    expect(value / count).toBeLessThan(ECONOMY.packPrice)
  })
})
