import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useProfile } from '../../app/profileContext'
import { ECONOMY } from '../../data/economy'
import { CATALOG } from '../../data/cards'
import { PACKS, PITY_UR } from '../../data/packs'
import { UNIVERSES } from '../../data/universes'
import type { Universe } from '../../engine/cards'
import { packCost } from '../../engine/economy'
import { guaranteeRarity } from '../../engine/packs'
import { energyNameOf } from './packInfo'

const ORDER: Universe[] = [
  'multiverse',
  'jujutsu-kaisen',
  'naruto',
  'hunter-x-hunter',
  'bleach',
  'dragon-ball',
  'blue-lock',
  'one-piece',
]

// Posição, escala e opacidade por distância do centro (0..3). Interpolado durante o arraste.
const X = [0, 270, 445, 560]
const SCALE = [1, 0.67, 0.47, 0.4]
const OPACITY = [1, 0.6, 0.25, 0]
/** Pixels arrastados que equivalem a trocar um pack. */
const SPACING = 270
const lerp = (t: number[], a: number) => {
  const i = Math.min(Math.floor(a), t.length - 2)
  return t[i]! + (t[i + 1]! - t[i]!) * (Math.min(a, t.length - 1) - i)
}

/** A arte do pack tem fundo desfocado em volta; recorta só o pacote (85% × 98% da imagem). */
function PackArt({ src }: { src: string }) {
  return (
    <div className="relative aspect-[0.578] w-full overflow-hidden rounded-md">
      <img
        src={src}
        alt=""
        draggable={false}
        className="absolute top-[-1%] left-[-8.8%] h-[102%] w-[117.6%] max-w-none"
      />
    </div>
  )
}

/** Loja em carrossel (design v3 "D • Boosters"): pack central grande, vizinhos menores. */
export function Store({ onOpen }: { onOpen: (u: Universe, count: number) => void }) {
  const { profile } = useProfile()
  const [index, setIndex] = useState(1)
  const n = ORDER.length
  const go = (d: number) => setIndex((i) => (i + d + n) % n)
  const current = ORDER[index]!
  // Arraste: os packs seguem o ponteiro e, ao soltar, encaixam no mais próximo.
  const [dragDx, setDragDx] = useState<number | null>(null)
  const moved = useRef(false)
  const startDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const x0 = e.clientX
    moved.current = false
    setDragDx(0)
    const move = (ev: globalThis.PointerEvent) => {
      const dx = ev.clientX - x0
      if (Math.abs(dx) > 6) moved.current = true
      setDragDx(dx)
    }
    const up = (ev: globalThis.PointerEvent) => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      const steps = Math.round(-(ev.clientX - x0) / SPACING)
      if (steps) go(steps)
      setDragDx(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }
  const left = Math.max(1, PITY_UR - (profile.pity[PACKS[current].id] ?? 0))
  const guarantee = guaranteeRarity(PACKS[current], CATALOG)

  const canBuy = (count: number) => packCost(profile, count, ECONOMY).fragments <= profile.fragments
  const priceLabel = (count: number) => {
    const c = packCost(profile, count, ECONOMY)
    if (!c.fragments) return c.free === 1 ? 'Grátis' : `${c.free} grátis`
    return `${c.free ? `${c.free} grátis + ` : ''}◆ ${c.fragments.toLocaleString('pt-BR')}`
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section className="relative flex min-h-[calc(100vh-64px)] flex-col items-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_35%,rgba(109,63,209,.35),transparent_55%)] py-8">
      <div
        onPointerDown={startDrag}
        className={`relative h-[540px] w-full max-w-[1200px] touch-pan-y select-none ${dragDx !== null ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {ORDER.map((u, i) => {
          // Distância circular até o pack selecionado (-3..3), contínua durante o arraste.
          let o = i - index
          if (o > n / 2) o -= n
          if (o < -n / 2) o += n
          const f = o + (dragDx ?? 0) / SPACING
          const a = Math.min(Math.abs(f), 3)
          const x = lerp(X, a) * Math.sign(f)
          const scale = lerp(SCALE, a)
          const opacity = lerp(OPACITY, a)
          return (
            <button
              key={u}
              onClick={() => {
                if (moved.current) return // foi arraste, não clique
                if (o === 0) {
                  if (canBuy(1)) onOpen(u, 1)
                } else go(o)
              }}
              aria-label={
                o === 0 ? `Abrir Booster ${UNIVERSES[u].name}` : `Ver Booster ${UNIVERSES[u].name}`
              }
              tabIndex={Math.abs(o) > 1 ? -1 : 0}
              className={`absolute top-2 left-1/2 -ml-[150px] w-[300px] ${dragDx === null ? 'transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(.2,.9,.3,1)]' : ''}`}
              style={{
                transform: `translateX(${x}px) scale(${scale})`,
                transformOrigin: 'center center',
                opacity,
                zIndex: 10 - Math.round(a),
                filter:
                  a < 0.5
                    ? 'drop-shadow(0 0 40px rgba(140,90,255,.55)) drop-shadow(0 24px 30px rgba(0,0,0,.8))'
                    : 'none',
                pointerEvents: a > 2.5 ? 'none' : undefined,
              }}
            >
              <PackArt src={UNIVERSES[u].pack} />
            </button>
          )
        })}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => go(-1)}
          aria-label="Pack anterior"
          className="absolute top-[240px] left-6 z-20 font-display text-5xl text-muted hover:text-gold-light"
        >
          ‹
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => go(1)}
          aria-label="Próximo pack"
          className="absolute top-[240px] right-6 z-20 font-display text-5xl text-[#FFD86B]"
        >
          ›
        </button>
      </div>

      <h1 className="font-display text-3xl font-black text-parchment">
        Booster {UNIVERSES[current].name}
      </h1>
      <p className="mt-1 font-label text-xs font-bold tracking-[0.2em] text-muted uppercase">
        {energyNameOf(current)} · 5 cartas
        {guarantee && (
          <>
            {' '}
            · {guarantee} garantido em até <span className="text-holo">{left}</span> pack
            {left === 1 ? '' : 's'}
          </>
        )}
      </p>
      <div className="mt-5 flex gap-3">
        {[1, 5].map((count) => (
          <button
            key={count}
            onClick={() => onOpen(current, count)}
            disabled={!canBuy(count)}
            className={`flex flex-col items-center rounded-xl px-10 py-2.5 font-display font-black tracking-[0.15em] uppercase disabled:cursor-not-allowed disabled:opacity-40 ${count === 1 ? 'bg-gold-metal text-[#1a1206] shadow-[0_0_30px_rgba(255,210,90,.45)]' : 'border border-gold/60 text-gold-light'}`}
          >
            <span className="text-lg">Abrir{count > 1 ? ` ×${count}` : ''}</span>
            <span className="font-label text-[11px] tracking-[0.2em] opacity-80">
              {priceLabel(count)}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2">
        {ORDER.map((u, i) => (
          <button
            key={u}
            onClick={() => setIndex(i)}
            aria-label={UNIVERSES[u].name}
            className={`rounded-full transition-all ${i === index ? 'size-2.5 bg-gold' : 'size-1.5 bg-line'}`}
          />
        ))}
      </div>
    </section>
  )
}
