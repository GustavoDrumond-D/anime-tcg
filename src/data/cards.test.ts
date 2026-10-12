import { describe, expect, it } from 'vitest'
import { ENERGY_TYPES, RARITY, maxMultiplier } from '../engine/cards'
import { CATALOG, CHARACTERS, ENERGIES } from './cards'
import { openPack } from '../engine/packs'
import { PACKS, SLOTS_LR } from './packs'

describe('catálogo', () => {
  it('tem ids únicos', () => {
    const ids = CATALOG.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('tem uma carta para cada tipo de energia', () => {
    expect(ENERGIES.map((e) => e.energy).sort()).toEqual([...ENERGY_TYPES].sort())
  })

  it('respeita o orçamento de raridade (RULEBOOK §10)', () => {
    for (const c of CHARACTERS) {
      const budget = RARITY[c.rarity]
      expect(c.stats.attack, c.id).toBeLessThanOrEqual(budget.attack)
      expect(c.stats.hp, c.id).toBeLessThanOrEqual(budget.hp)
      for (const a of c.abilities) {
        expect(a.multiplier, `${c.id}/${a.id}`).toBeLessThanOrEqual(maxMultiplier(a))
      }
    }
  })

  it('ids de habilidade são únicos dentro da carta', () => {
    for (const c of CHARACTERS) {
      const ids = [...c.abilities.map((a) => a.id), ...c.passives.map((p) => p.id)]
      expect(new Set(ids).size, c.id).toBe(ids.length)
    }
  })

  it('EX (Imu) nunca sai de booster; LR só nos packs com SLOTS_LR', () => {
    for (const pack of Object.values(PACKS))
      for (const s of pack.slots)
        if (s.kind === 'character') {
          expect(s.odds.EX, pack.id).toBeUndefined()
          if (s.odds.LR) expect(pack.slots, pack.id).toBe(SLOTS_LR)
        }
    let seed = 1
    const rng = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    for (const u of ['one-piece', 'blue-lock', 'multiverse'] as const)
      for (let i = 0; i < 2000; i++)
        for (const force of [undefined, 'UR', 'LR'] as const)
          for (const c of openPack(PACKS[u], CATALOG, rng, force))
            expect(c.type === 'character' && c.rarity === 'EX', c.id).toBe(false)
  })

  it('slot raro com LR soma 100%', () => {
    const rare = SLOTS_LR[4]!
    if (rare.kind !== 'character') throw new Error('slot raro')
    expect(Object.values(rare.odds).reduce((a, n) => a + (n ?? 0), 0)).toBe(100)
  })

  it('toda arte referenciada existe em public/', () => {
    const files = Object.keys(import.meta.glob('/public/assets/**/*.webp'))
    for (const c of CATALOG) {
      if (c.art) expect(files, c.art).toContain(`/public${c.art}`)
    }
  })
})

describe('maxMultiplier', () => {
  const free = { specific: {}, generic: 0 }
  it('custo 0 sem recarga = 1×, com recarga ≥ 2 = 2×', () => {
    expect(maxMultiplier({ cost: free, cooldown: 0 })).toBe(1)
    expect(maxMultiplier({ cost: free, cooldown: 2 })).toBe(2)
  })
  it('conta custo específico + genérico', () => {
    expect(maxMultiplier({ cost: { specific: { cursed: 2 }, generic: 1 }, cooldown: 0 })).toBe(2.5)
  })
})
