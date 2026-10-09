import { useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { Card } from '../../components/Card'
import { CATALOG, CHARACTERS } from '../../data/cards'
import type { CardDef } from '../../engine/cards'
import { UNIVERSES } from '../../data/universes'

type Stage = 'sealed' | 'tearing' | 'dealt'

// ponytail: sorteio provisório (1 personagem garantido + 4 aleatórias); probabilidades reais = PENDÊNCIAS §14.
function draw(): CardDef[] {
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]!
  return [...Array.from({ length: 4 }, () => pick(CATALOG)), pick(CHARACTERS)]
}

const rarityOf = (c: CardDef) => (c.type === 'character' ? c.rarity : 'C')
const glowOf = (c: CardDef) =>
  ({
    UR: '0 0 34px 8px rgba(125,249,255,.75), 0 0 70px rgba(255,106,213,.5)',
    SSR: '0 0 30px 6px rgba(255,210,90,.75)',
  })[rarityOf(c) as string] ?? 'none'

export function PackOpening() {
  const [stage, setStage] = useState<Stage>('sealed')
  const [cards, setCards] = useState(draw)
  const [flipped, setFlipped] = useState<boolean[]>(Array(5).fill(false))
  const universe = UNIVERSES['jujutsu-kaisen']

  const open = () => {
    if (stage !== 'sealed') return
    setStage('tearing')
    setTimeout(() => setStage('dealt'), 700)
  }
  const flip = (i: number) => setFlipped((f) => f.map((v, j) => v || j === i))
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
        {stage === 'sealed' ? 'Clique para abrir' : 'Revele suas cartas'}
      </h1>

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
            </div>
          )
        })}
      </div>

      {stage === 'dealt' && (
        <div className="flex gap-3">
          {!allFlipped && (
            <button
              onClick={() => setFlipped(Array(5).fill(true))}
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

/** Pacote recortado da arte (a imagem tem fundo desfocado em volta). Ao abrir, a tira de cima voa. */
function Pack({ src, tearing, onOpen }: { src: string; tearing: boolean; onOpen: () => void }) {
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
      onClick={onOpen}
      aria-label="Abrir pack"
      className="absolute top-0 left-1/2 -ml-[150px] h-[519px] w-[300px] cursor-pointer"
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
      <div
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.9),transparent_60%)] transition-opacity duration-300"
        style={{ opacity: tearing ? 1 : 0 }}
      />
    </button>
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
