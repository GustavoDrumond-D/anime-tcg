import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Card } from '../../components/Card'
import type { CharacterDef } from '../../engine/cards'

export type RareKind = 'UR' | 'SSR'

/** Gerado uma vez por revelação (fora do render, para manter o componente puro). */
function makeBurst(kind: 'UR' | 'SSR') {
  const colors =
    kind === 'UR'
      ? ['#7DF9FF', '#FF6AD5', '#FFD86B', '#FFFFFF', '#A78BFA']
      : ['#FFD86B', '#F7E7A6', '#FFFFFF']
  const n = kind === 'UR' ? 44 : 26
  return {
    parts: Array.from({ length: n }, (_, i) => ({
      a: (i / n) * 360 + Math.random() * 8,
      d: 110 + Math.random() * (kind === 'UR' ? 170 : 110),
      s: 4 + Math.random() * 6,
      c: colors[i % colors.length]!,
      dl: 0.3 + Math.random() * 0.12,
    })),
    sparkles: Array.from({ length: kind === 'UR' ? 10 : 6 }, () => ({
      x: -10 + Math.random() * 120,
      y: -8 + Math.random() * 116,
      dl: 1 + Math.random() * 2,
      dur: 1.2 + Math.random() * 1.2,
    })),
  }
}

/** Explosão de partículas + anel de luz no momento da revelação, depois brilhos piscando em volta. */
export function Burst({ kind }: { kind: 'UR' | 'SSR' }) {
  const [{ parts, sparkles }] = useState(() => makeBurst(kind))
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <span
        className="absolute top-1/2 left-1/2 -mt-[110px] -ml-[110px] size-[220px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${kind === 'UR' ? 'rgba(125,249,255,.55)' : 'rgba(255,216,107,.55)'}, transparent 65%)`,
          animation: 'ring 1s ease-out .3s both',
        }}
      />
      {parts.map((p, i) => (
        <span
          key={i}
          className="absolute top-1/2 left-1/2 rounded-full"
          style={
            {
              width: p.s,
              height: p.s,
              background: p.c,
              boxShadow: `0 0 8px ${p.c}`,
              '--a': `${p.a}deg`,
              '--d': `${p.d}px`,
              animation: `burst 1.4s cubic-bezier(.15,.7,.35,1) ${p.dl}s both`,
            } as CSSProperties
          }
        />
      ))}
      {sparkles.map((s, i) => (
        <span
          key={`s${i}`}
          className="absolute text-sm"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            color: kind === 'UR' ? '#bff8ff' : '#ffe9a8',
            textShadow: '0 0 6px currentColor',
            animation: `twinkle ${s.dur}s ease-in-out ${s.dl}s infinite both`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  )
}

const RAYS: Record<RareKind, string> = {
  UR: 'repeating-conic-gradient(rgba(125,249,255,.35) 0 5deg, transparent 5deg 15deg, rgba(255,106,213,.35) 15deg 20deg, transparent 20deg 30deg)',
  SSR: 'repeating-conic-gradient(rgba(255,216,107,.35) 0 6deg, transparent 6deg 18deg)',
}

/** Momento em tela cheia ao tirar UR/SSR: raios girando, anúncio da raridade e carta ampliada. */
export function Spotlight({ card, onClose }: { card: CharacterDef; onClose: () => void }) {
  const kind = card.rarity as RareKind
  const ur = kind === 'UR'
  const btn = useRef<HTMLButtonElement>(null)
  useEffect(() => btn.current?.focus(), [])
  return (
    <div
      role="dialog"
      aria-modal
      aria-label={`${ur ? 'Ultra raro' : 'Super raro'}: ${card.name}`}
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      className="fixed inset-0 z-50 grid cursor-pointer place-items-center overflow-hidden bg-black/80 backdrop-blur-sm"
      style={{ animation: 'fade-in .3s both' }}
    >
      <div
        aria-hidden
        className="absolute size-[1400px] rounded-full"
        style={{
          background: RAYS[kind],
          maskImage: 'radial-gradient(circle, black 15%, transparent 60%)',
          animation: 'spin 14s linear infinite',
        }}
      />
      <div className="relative flex flex-col items-center gap-6">
        <p
          className={`font-display text-5xl font-black tracking-[0.2em] ${ur ? 'text-holo' : 'text-gold-metal'}`}
          style={{ animation: 'banner .7s cubic-bezier(.2,.9,.3,1.3) .25s both' }}
        >
          {ur ? 'ULTRA RARO' : 'SUPER RARO'}
        </p>
        <div
          className="relative"
          style={{ animation: 'pop-in .8s cubic-bezier(.2,.9,.3,1.2) both' } as CSSProperties}
        >
          <Card card={card} variant="full" className="w-[340px]" />
          <Burst kind={kind} />
        </div>
        <button
          ref={btn}
          className="animate-pulse font-label text-xs font-bold tracking-[0.3em] text-muted uppercase"
        >
          Clique para continuar
        </button>
      </div>
    </div>
  )
}
