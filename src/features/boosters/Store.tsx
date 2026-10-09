import { useEffect, useState } from 'react'
import { PITY_UR } from '../../data/packs'
import { UNIVERSES } from '../../data/universes'
import type { Universe } from '../../engine/cards'
import { load } from '../../storage/local'
import { energyNameOf, pityKey } from './packInfo'

const ORDER: Universe[] = [
  'multiverse',
  'jujutsu-kaisen',
  'naruto',
  'hunter-x-hunter',
  'bleach',
  'dragon-ball',
]

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
export function Store({ onOpen }: { onOpen: (u: Universe) => void }) {
  const [index, setIndex] = useState(1)
  const n = ORDER.length
  const go = (d: number) => setIndex((i) => (i + d + n) % n)
  const current = ORDER[index]!
  const left = PITY_UR - load(pityKey(current), 0)

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
      <div className="relative h-[540px] w-full max-w-[1200px]">
        {ORDER.map((u, i) => {
          // Distância circular até o pack selecionado (-3..3).
          let o = i - index
          if (o > n / 2) o -= n
          if (o < -n / 2) o += n
          const a = Math.abs(o)
          const x = [0, 270, 445, 560][a]! * Math.sign(o)
          const scale = [1, 0.67, 0.47, 0.4][a]!
          return (
            <button
              key={u}
              onClick={() => (o === 0 ? onOpen(u) : go(o))}
              aria-label={
                o === 0 ? `Abrir Booster ${UNIVERSES[u].name}` : `Ver Booster ${UNIVERSES[u].name}`
              }
              tabIndex={a > 1 ? -1 : 0}
              className="absolute top-2 left-1/2 -ml-[150px] w-[300px] transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(.2,.9,.3,1)]"
              style={{
                transform: `translateX(${x}px) scale(${scale})`,
                transformOrigin: 'center center',
                opacity: a > 2 ? 0 : [1, 0.6, 0.25][a],
                zIndex: 10 - a,
                filter:
                  a === 0
                    ? 'drop-shadow(0 0 40px rgba(140,90,255,.55)) drop-shadow(0 24px 30px rgba(0,0,0,.8))'
                    : 'none',
                pointerEvents: a > 2 ? 'none' : undefined,
              }}
            >
              <PackArt src={UNIVERSES[u].pack} />
            </button>
          )
        })}
        <button
          onClick={() => go(-1)}
          aria-label="Pack anterior"
          className="absolute top-[240px] left-6 z-20 font-display text-5xl text-muted hover:text-gold-light"
        >
          ‹
        </button>
        <button
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
        {energyNameOf(current)} · 5 cartas · UR garantido em até{' '}
        <span className="text-holo">{left}</span> pack{left === 1 ? '' : 's'}
      </p>
      <button
        onClick={() => onOpen(current)}
        className="mt-5 rounded-xl bg-gold-metal px-12 py-3 font-display text-lg font-black tracking-[0.15em] text-[#1a1206] uppercase shadow-[0_0_30px_rgba(255,210,90,.45)]"
      >
        Abrir
      </button>
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
