import { describe, expect, it } from 'vitest'
import { CATALOG } from '../data/cards'
import { PACKS, SLOTS } from '../data/packs'
import type { CardDef } from './cards'
import { chanceAtLeastOne, openPack } from './packs'
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
