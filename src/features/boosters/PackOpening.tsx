import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { Card } from '../../components/Card'
import { CATALOG, CHARACTERS } from '../../data/cards'
import type { CardDef } from '../../engine/cards'
import { UNIVERSES } from '../../data/universes'
import { setMuted, sfx } from './sfx'

type Stage = 'sealed' | 'tearing' | 'dealt'

// ponytail: sorteio provisório (1 personagem garantido + 4 aleatórias); probabilidades reais = PENDÊNCIAS §14.
function draw(): CardDef[] {
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]!
  return [...Array.from({ length: 4 }, () => pick(CATALOG)), pick(CHARACTERS)]
}

const rarityOf = (c: CardDef) => (c.type === 'character' ? c.rarity : 'C')
const rareOf = (c: CardDef) => {
  const r = rarityOf(c)
  return r === 'UR' || r === 'SSR' ? r : null
}
const glowOf = (c: CardDef) =>
  ({
    UR: '0 0 34px 8px rgba(125,249,255,.75), 0 0 70px rgba(255,106,213,.5)',
    SSR: '0 0 30px 6px rgba(255,210,90,.75)',
  })[rarityOf(c) as string] ?? 'none'

export function PackOpening() {
  const [stage, setStage] = useState<Stage>('sealed')
  const [cards, setCards] = useState(draw)
  const [flipped, setFlipped] = useState<boolean[]>(Array(5).fill(false))
  const [sound, setSound] = useState(true)
  const universe = UNIVERSES['jujutsu-kaisen']

  const open = () => {
    if (stage !== 'sealed') return
    setStage('tearing')
    sfx.rip()
    setTimeout(() => {
      setStage('dealt')
      cards.forEach((_, i) => setTimeout(sfx.deal, i * 110))
    }, 700)
  }
  const flip = (i: number) => {
    setFlipped((f) => f.map((v, j) => v || j === i))
    sfx.flip()
    const rare = rareOf(cards[i]!)
    if (rare) setTimeout(() => sfx.rare(rare), 350)
  }
  // Revela em cascata, para cada carta ter seu momento.
  const revealAll = () => flipped.forEach((done, i) => !done && setTimeout(() => flip(i), i * 160))
  const toggleSound = () => {
    setMuted(sound)
    setSound(!sound)
  }
  const reset = () => {
    setCards(draw())
    setFlipped(Array(5).fill(false))
    setStage('sealed')
  }
  const allFlipped = flipped.every(Boolean)

  return (
    <section className="relative flex min-h-[calc(100vh-64px)] flex-col items-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#2a1758,#0b0a1c_55%,#030407)] py-10">
      <p className="font-label text-sm font-bold tracking-[0.3em] text-gold-dim">
        BOOSTER {universe.name.toUpperCase()}
      </p>
      <h1 className="font-display text-3xl font-black text-parchment">
        {stage === 'sealed' ? 'Corte o pack' : 'Revele suas cartas'}
      </h1>
      <button
        onClick={toggleSound}
        aria-pressed={sound}
        className="absolute top-6 right-8 rounded-full border border-line px-4 py-1.5 font-label text-xs font-bold tracking-[0.15em] text-muted uppercase"
      >
        Som: {sound ? 'ligado' : 'mudo'}
      </button>

      <div className="relative mt-6 h-[520px] w-full max-w-[1200px]">
        {stage !== 'dealt' && (
          <Pack src={universe.pack} tearing={stage === 'tearing'} onOpen={open} />
        )}

        {cards.map((c, i) => {
          const o = i - 2
          const dealt = stage === 'dealt'
          const style: CSSProperties = {
            transform: dealt
              ? `translate(${o * 225}px, ${Math.abs(o) * 22}px) rotate(${o * 4}deg)`
              : 'translate(0, 40px) scale(0.3)',
            opacity: dealt ? 1 : 0,
            transitionDelay: dealt ? `${i * 110}ms` : '0ms',
          }
          return (
            <div
              key={i}
              style={style}
              className="absolute top-8 left-1/2 -ml-[100px] w-[200px] transition-[transform,opacity] duration-700 ease-[cubic-bezier(.2,.9,.3,1.2)]"
            >
              <FlipCard
                card={c}
                flipped={flipped[i]!}
                onFlip={() => flip(i)}
                label={`Revelar carta ${i + 1}`}
              />
              {flipped[i] && rareOf(c) && <Burst kind={rareOf(c)!} />}
            </div>
          )
        })}
      </div>

      {stage === 'dealt' && (
        <div className="flex gap-3">
          {!allFlipped && (
            <button
              onClick={revealAll}
              className="rounded-lg border border-gold/60 px-6 py-3 font-display font-black tracking-wider text-gold-light uppercase"
            >
              Revelar todas
            </button>
          )}
          {allFlipped && (
            <button
              onClick={reset}
              className="rounded-lg bg-gold-metal px-6 py-3 font-display font-black tracking-wider text-[#1a1206] uppercase shadow-[0_0_24px_rgba(255,210,90,.45)]"
            >
              Abrir outro
            </button>
          )}
        </div>
      )}
    </section>
  )
}

/**
 * Pacote recortado da arte (a imagem tem fundo desfocado em volta).
 * Abre arrastando ao longo da linha de corte (≥ 75% da largura); Enter/Espaço também abrem.
 */
function Pack({ src, tearing, onOpen }: { src: string; tearing: boolean; onOpen: () => void }) {
  const [cut, setCut] = useState<{ from: number; to: number } | null>(null)
  const steps = useRef(0)
  const frac = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
  }
  const down = (e: PointerEvent<HTMLButtonElement>) => {
    if (tearing) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const x = frac(e)
    setCut({ from: x, to: x })
    steps.current = 0
  }
  const move = (e: PointerEvent<HTMLButtonElement>) => {
    if (!cut || tearing) return
    const x = frac(e)
    const next = { from: Math.min(cut.from, x), to: Math.max(cut.to, x) }
    const len = next.to - next.from
    if (Math.floor(len * 10) > steps.current) {
      steps.current = Math.floor(len * 10)
      sfx.snip()
    }
    if (len >= 0.75 && steps.current < 99) {
      steps.current = 99 // abre uma vez só, mesmo com eventos de movimento em sequência
      setCut({ from: 0, to: 1 })
      onOpen()
    } else setCut(next)
  }
  const up = () => {
    if (!tearing) setCut(null)
  }

  const img = (clip: string) => (
    <img
      src={src}
      alt=""
      draggable={false}
      style={{ clipPath: clip }}
      className="absolute top-[-1%] left-[-8.8%] h-[102%] w-[117.6%] max-w-none"
    />
  )
  return (
    <button
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen()}
      aria-label="Abrir pack: arraste ao longo da linha de corte ou pressione Enter"
      className="absolute top-0 left-1/2 -ml-[150px] h-[519px] w-[300px] cursor-crosshair touch-none select-none"
      style={{ animation: tearing ? 'shake .35s ease-in-out 2' : undefined }}
    >
      <div
        className="absolute inset-0 transition-[transform,opacity] duration-500 ease-in"
        style={{
          transform: tearing ? 'translateY(-160px) rotate(-14deg)' : 'none',
          opacity: tearing ? 0 : 1,
        }}
      >
        {img('inset(0 7.5% 86% 7.5%)')}
      </div>
      <div
        className="absolute inset-0 transition-[transform,opacity] delay-300 duration-400"
        style={{
          transform: tearing ? 'translateY(60px) scale(.92)' : 'none',
          opacity: tearing ? 0 : 1,
        }}
      >
        {img('inset(14% 7.5% 0 7.5%)')}
      </div>
      {/* linha de corte: guia tracejada + rastro brilhante do corte */}
      <div
        className="pointer-events-none absolute top-[14%] right-0 left-0 border-t-2 border-dashed border-white/50 transition-opacity"
        style={{ opacity: tearing ? 0 : 1 }}
      />
      {cut && (
        <div
          className="pointer-events-none absolute top-[14%] -mt-[2px] h-[3px] rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,230,160,.9)]"
          style={{ left: `${cut.from * 100}%`, width: `${(cut.to - cut.from) * 100}%` }}
        />
      )}
      {!tearing && !cut && (
        <span className="pointer-events-none absolute top-[calc(14%-30px)] right-2 animate-pulse font-label text-xs font-bold tracking-[0.15em] text-white uppercase drop-shadow">
          ✂ arraste para cortar
        </span>
      )}
      <div
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.9),transparent_60%)] transition-opacity duration-300"
        style={{ opacity: tearing ? 1 : 0 }}
      />
    </button>
  )
}

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
function Burst({ kind }: { kind: 'UR' | 'SSR' }) {
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

function FlipCard({
  card,
  flipped,
  onFlip,
  label,
}: {
  card: CardDef
  flipped: boolean
  onFlip: () => void
  label: string
}) {
  const face = 'absolute inset-0 [backface-visibility:hidden]'
  return (
    <button
      onClick={onFlip}
      disabled={flipped}
      aria-label={flipped ? card.name : label}
      className="block aspect-[3/4] w-full [perspective:1000px]"
    >
      <div
        className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'none' }}
      >
        <div
          className={`${face} rounded-xl`}
          style={{ boxShadow: glowOf(card), animation: 'pulse-glow 1.6s ease-in-out infinite' }}
        >
          <CardBack />
        </div>
        <div className={face} style={{ transform: 'rotateY(180deg)' }}>
          <Holo kind={rarityOf(card)}>
            <Card card={card} className="w-full" />
          </Holo>
        </div>
      </div>
    </button>
  )
}

function CardBack() {
  return (
    <div className="grid h-full place-items-center rounded-xl border-[1.5px] border-gold bg-[linear-gradient(135deg,#1a1240,#0a0c18)]">
      <div className="grid size-24 rotate-45 place-items-center border border-gold/60">
        <span className="-rotate-45 font-display text-5xl font-black text-gold-metal">A</span>
      </div>
    </div>
  )
}

/** Brilho que segue o ponteiro + leve inclinação. Só UR (arco-íris) e SSR (dourado). */
function Holo({ kind, children }: { kind: string; children: ReactNode }) {
  if (kind !== 'UR' && kind !== 'SSR') return <>{children}</>
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    el.style.setProperty('--rx', `${(0.5 - y) * 16}deg`)
    el.style.setProperty('--ry', `${(x - 0.5) * 16}deg`)
  }
  const leave = (e: PointerEvent<HTMLDivElement>) => {
    for (const p of ['--rx', '--ry']) e.currentTarget.style.setProperty(p, '0deg')
  }
  const sheen =
    kind === 'UR'
      ? 'repeating-linear-gradient(115deg,#ff6ad5 0%,#7df9ff 7%,#ffd86b 14%,#a78bfa 21%,#ff6ad5 28%)'
      : 'linear-gradient(115deg,transparent 30%,#ffe9a8 45%,#b8892b 55%,transparent 70%)'
  return (
    <div
      onPointerMove={move}
      onPointerLeave={leave}
      className="group relative transition-transform duration-150"
      style={{ transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))' }}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-0 rounded-[10px] opacity-10 mix-blend-color-dodge transition-opacity duration-300 group-hover:opacity-50"
        style={{
          backgroundImage: `radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.65), transparent 38%), ${sheen}`,
          backgroundSize: '100% 100%, 300% 300%',
          backgroundPosition: 'center, var(--mx,50%) var(--my,50%)',
        }}
      />
    </div>
  )
}
