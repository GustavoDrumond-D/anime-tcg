import { describe, expect, it } from 'vitest'
import { ENERGY_TYPES, RARITY, maxMultiplier } from '../engine/cards'
import { CATALOG, CHARACTERS, ENERGIES } from './cards'
import { openPack } from '../engine/packs'
import { PACKS, SLOTS } from './packs'

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

  it('LR/EX não saem de booster (concessão/evento)', () => {
    for (const s of SLOTS) {
      if (s.kind === 'character') expect(Object.keys(s.odds)).not.toContain('LR')
      if (s.kind === 'character') expect(Object.keys(s.odds)).not.toContain('EX')
    }
  })

  it('Imu EX e demais LR/EX nunca saem do booster, mesmo no do universo delas', () => {
    let seed = 1
    const rng = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    for (const u of ['one-piece', 'blue-lock', 'multiverse'] as const)
      for (let i = 0; i < 2000; i++)
        for (const c of openPack(PACKS[u], CATALOG, rng, i % 20 === 0 ? 'UR' : undefined))
          expect(c.type === 'character' && ['LR', 'EX'].includes(c.rarity), c.id).toBe(false)
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
