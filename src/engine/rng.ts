/** Fonte de aleatoriedade injetável: `Math.random` em produção, `seeded` em testes/replays. */
export type Rng = () => number

/** mulberry32: pequeno, rápido e determinístico por seed. */
export function seeded(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const pick = <T>(rng: Rng, xs: readonly T[]): T => xs[Math.floor(rng() * xs.length)]!

/** Sorteia uma chave proporcional ao peso (os pesos não precisam somar 100). */
export function weighted<K extends string>(rng: Rng, table: Partial<Record<K, number>>): K {
  const entries = Object.entries(table) as [K, number][]
  let r = rng() * entries.reduce((s, [, w]) => s + w, 0)
  for (const [k, w] of entries) if ((r -= w) < 0) return k
  return entries[entries.length - 1]![0]
}
