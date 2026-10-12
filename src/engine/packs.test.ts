import { describe, expect, it } from 'vitest'
import { CATALOG } from '../data/cards'
import { PACKS, PITY_LR, PITY_UR, SLOTS } from '../data/packs'
import type { CardDef } from './cards'
import {
  chanceAtLeastOne,
  expectedPacksPerUR,
  guaranteeRarity,
  openPack,
  openPackWithPity,
} from './packs'
import { seeded } from './rng'

const jjk = PACKS['jujutsu-kaisen']
const rarity = (c: CardDef) => (c.type === 'character' ? c.rarity : null)

describe('openPack', () => {
  it('é determinístico pelo seed', () => {
    expect(openPack(jjk, CATALOG, seeded(7))).toEqual(openPack(jjk, CATALOG, seeded(7)))
  })

  it('tem 5 cartas e as duas primeiras são energias do universo ou Universal', () => {
    const rng = seeded(1)
    for (let i = 0; i < 500; i++) {
      const p = openPack(jjk, CATALOG, rng)
      expect(p).toHaveLength(5)
      for (const c of p.slice(0, 2)) {
        expect(c.type).toBe('energy')
        if (c.type === 'energy') expect(['cursed', 'universal']).toContain(c.energy)
      }
      for (const c of p) if (c.type === 'character') expect(c.universe).toBe('jujutsu-kaisen')
    }
  })

  it('segue as chances do slot raro (UR ≈ 3%, SSR ≈ 12%) em 20 mil packs', () => {
    const rng = seeded(42)
    const n = 20000
    let ur = 0
    let ssr = 0
    for (let i = 0; i < n; i++) {
      const last = rarity(openPack(jjk, CATALOG, rng)[4]!)
      if (last === 'UR') ur++
      if (last === 'SSR') ssr++
    }
    expect(ur / n).toBeCloseTo(0.03, 2)
    expect(ssr / n).toBeCloseTo(0.12, 2)
  })

  it('sem personagem da raridade sorteada, a posição vira energia', () => {
    const onlyEnergies = CATALOG.filter((c) => c.type === 'energy')
    const p = openPack(jjk, onlyEnergies, seeded(3))
    expect(p.every((c) => c.type === 'energy')).toBe(true)
  })
})

describe('tabela de chances', () => {
  it('cada slot de personagem soma 100%', () => {
    for (const s of SLOTS) {
      if (s.kind === 'character') {
        expect(Object.values(s.odds).reduce((a, n) => a + (n ?? 0), 0)).toBe(100)
      }
    }
  })
  it('chance de ao menos um UR por pack = 3%', () => {
    expect(chanceAtLeastOne(jjk, 'UR')).toBeCloseTo(0.03, 5)
  })
})

describe('garantia de UR (pity)', () => {
  const hasUR = (cs: CardDef[]) => cs.some((c) => rarity(c) === 'UR')

  it('o último pack da garantia sem UR garante um UR', () => {
    const r = openPackWithPity(jjk, CATALOG, seeded(9), PITY_UR - 1, PITY_UR)
    expect(r.guaranteed).toBe(true)
    expect(hasUR(r.cards)).toBe(true)
    expect(r.sinceUR).toBe(0)
  })

  it('nunca passa do limite da garantia sem UR', () => {
    const rng = seeded(123)
    let since = 0
    let maxDry = 0
    for (let i = 0; i < 5000; i++) {
      const r = openPackWithPity(jjk, CATALOG, rng, since, PITY_UR)
      since = r.sinceUR
      maxDry = Math.max(maxDry, since)
    }
    expect(maxDry).toBeLessThanOrEqual(PITY_UR - 1)
  })

  it('o contador zera quando sai UR antes da garantia e soma quando não sai', () => {
    const rng = seeded(5)
    let since = 0
    for (let i = 0; i < 300; i++) {
      const r = openPackWithPity(jjk, CATALOG, rng, since, PITY_UR)
      expect(r.sinceUR).toBe(hasUR(r.cards) ? 0 : since + 1)
      since = r.sinceUR
    }
  })

  it('universo sem UR (Bleach): garantia entrega a melhor raridade e o contador zera', () => {
    const bleach = { ...jjk, id: 'pack-bleach', universe: 'bleach' as const }
    expect(guaranteeRarity(bleach, CATALOG)).toBe('SSR')
    const r = openPackWithPity(bleach, CATALOG, seeded(9), PITY_UR - 1, PITY_UR)
    expect(r.cards.some((c) => rarity(c) === 'SSR')).toBe(true)
    expect(r.sinceUR).toBe(0)
  })

  it('universo sem personagem de booster não tem garantia', () => {
    expect(guaranteeRarity({ ...jjk, universe: 'one-piece' }, CATALOG)).toBeNull()
  })

  it('garantia de LR: no 200º pack sem LR sai LR e o contador zera (UR também)', () => {
    const op = PACKS['one-piece']
    const r = openPackWithPity(op, CATALOG, seeded(4), 3, PITY_UR, {
      since: PITY_LR - 1,
      pity: PITY_LR,
    })
    expect(r.guaranteedLR).toBe(true)
    expect(r.cards.some((c) => c.id === 'one-piece-loki-lr-001')).toBe(true)
    expect(r.sinceLR).toBe(0)
    expect(r.sinceUR).toBe(0)
  })

  it('nunca passa de 200 packs sem LR no booster Blue Lock', () => {
    const rng = seeded(77)
    let lr = 0
    let ur = 0
    let maxDry = 0
    for (let i = 0; i < 3000; i++) {
      const r = openPackWithPity(PACKS['blue-lock'], CATALOG, rng, ur, PITY_UR, {
        since: lr,
        pity: PITY_LR,
      })
      ;({ sinceUR: ur, sinceLR: lr } = r)
      maxDry = Math.max(maxDry, lr)
    }
    expect(maxDry).toBeLessThanOrEqual(PITY_LR - 1)
  })

  it('packs sem LR no universo não contam garantia de LR', () => {
    const r = openPackWithPity(jjk, CATALOG, seeded(1), 0, PITY_UR, { since: 7, pity: PITY_LR })
    expect(r.sinceLR).toBe(7)
    expect(r.guaranteedLR).toBe(false)
  })

  it('LR sai com ≈ 0,5% no slot raro do Multiverso', () => {
    const rng = seeded(2024)
    const n = 40_000
    let lr = 0
    for (let i = 0; i < n; i++)
      if (openPack(PACKS.multiverse, CATALOG, rng).some((c) => rarity(c) === 'LR')) lr++
    expect(lr / n).toBeCloseTo(0.005, 2)
  })

  it('média com garantia de 20 ≈ 15,2 packs por UR', () => {
    expect(expectedPacksPerUR(0.03, PITY_UR)).toBeCloseTo(15.2, 1)
  })
})
