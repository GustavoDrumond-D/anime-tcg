import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { Card } from '../../components/Card'
import { useProfile } from '../../app/profileContext'
import { PACKS, PITY_UR } from '../../data/packs'
import { UNIVERSES } from '../../data/universes'
import type { CardDef, CharacterDef, Universe } from '../../engine/cards'
import type { OpenedPack } from '../../engine/economy'
import { OddsPanel } from './OddsPanel'
import { energyNameOf } from './packInfo'
import { Burst, Spotlight, type RareKind } from './RareReveal'
import { setMuted, sfx } from './sfx'

type Stage = 'sealed' | 'tearing' | 'dealt'

const rarityOf = (c: CardDef) => (c.type === 'character' ? c.rarity : 'C')
const rareOf = (c: CardDef): RareKind | null => {
  const r = rarityOf(c)
  // LR usa a revelação de UR (Spotlight diferencia o texto e a cor).
  return r === 'UR' || r === 'LR' ? 'UR' : r === 'SSR' ? 'SSR' : null
}
const glowOf = (c: CardDef) =>
  ({
    LR: '0 0 40px 10px rgba(236,72,153,.75), 0 0 80px rgba(109,91,255,.55)',
    UR: '0 0 34px 8px rgba(125,249,255,.75), 0 0 70px rgba(255,106,213,.5)',
    SSR: '0 0 30px 6px rgba(255,210,90,.75)',
  })[rarityOf(c) as string] ?? 'none'

const CHARGE_MS = 900

/** Abertura animada de um pack já comprado (o sorteio acontece na compra, ver economy.ts). */
export function PackOpening({
  packUniverse,
  opened,
  onAgain,
  againLabel,
  onBack,
}: {
  packUniverse: Universe
  opened: OpenedPack
  /** Ausente quando não há saldo para outro pack. */
  onAgain?: () => void
  againLabel: string
  onBack: () => void
}) {
  const PACK = PACKS[packUniverse]
  const { pity } = useProfile().profile
  const sinceUR = pity[PACK.id] ?? 0
  const sinceLR = pity[`${PACK.id}:LR`] ?? 0
  const { cards, guaranteed, guaranteedLR } = opened
  const [stage, setStage] = useState<Stage>('sealed')
  const [flipped, setFlipped] = useState<boolean[]>(Array(5).fill(false))
  const [charging, setCharging] = useState<boolean[]>(Array(5).fill(false))
  const [spotlight, setSpotlight] = useState<
    { card: CharacterDef; key: number; guaranteed: boolean }[]
  >([])
  const [showOdds, setShowOdds] = useState(false)
  const [sound, setSound] = useState(true)
  const universe = UNIVERSES[PACK.universe]

  const open = () => {
    if (stage !== 'sealed') return
    setShowOdds(false)
    setStage('tearing')
    sfx.rip()
    setTimeout(() => {
      setStage('dealt')
      cards.forEach((_, i) => setTimeout(sfx.deal, i * 110))
    }, 700)
  }
  const reveal = (i: number) => {
    setFlipped((f) => f.map((v, j) => v || j === i))
    sfx.flip()
  }
  // Rara: suspense (treme + som subindo) → vira → momento em tela cheia.
  const flip = (i: number) => {
    const card = cards[i]!
    const rare = rareOf(card)
    if (!rare) return reveal(i)
    setCharging((c) => c.map((v, j) => v || j === i))
    sfx.charge(rare)
    setTimeout(() => {
      setCharging((c) => c.map((v, j) => v && j !== i))
      reveal(i)
      setTimeout(() => {
        sfx.rare(rare)
        setSpotlight((q) => [
          ...q,
          {
            card: card as CharacterDef,
            key: Date.now() + i,
            // A garantia sempre cai na última vaga (slot raro).
            guaranteed: (guaranteed || guaranteedLR) && i === cards.length - 1,
          },
        ])
      }, 450)
    }, CHARGE_MS)
  }
  // Revela em cascata, para cada carta ter seu momento.
  const revealAll = () =>
    flipped.forEach((done, i) => !done && !charging[i] && setTimeout(() => flip(i), i * 160))
  const toggleSound = () => {
    setMuted(sound)
    setSound(!sound)
  }
  // Pular: mostra tudo já revelado, sem suspense nem tela de destaque.
  const skip = () => {
    setShowOdds(false)
    setCharging(Array(5).fill(false))
    setFlipped(Array(5).fill(true))
    setStage('dealt')
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
      {stage === 'sealed' && (
        <button
          onClick={onBack}
          className="absolute top-6 left-8 font-label text-sm font-bold tracking-[0.15em] text-muted uppercase hover:text-gold-light"
        >
          ‹ Loja
        </button>
      )}
      <div className="absolute top-6 right-8 flex gap-2">
        {!allFlipped && (
          <button
            onClick={skip}
            className="rounded-full border border-line px-4 py-1.5 font-label text-xs font-bold tracking-[0.15em] text-muted uppercase hover:text-gold-light"
          >
            Pular ⏭
          </button>
        )}
        {stage === 'sealed' && (
          <button
            onClick={() => setShowOdds(!showOdds)}
            aria-expanded={showOdds}
            className="rounded-full border border-gold/50 px-4 py-1.5 font-label text-xs font-bold tracking-[0.15em] text-gold-light uppercase"
          >
            ⓘ Chances
          </button>
        )}
        <button
          onClick={toggleSound}
          aria-pressed={sound}
          className="rounded-full border border-line px-4 py-1.5 font-label text-xs font-bold tracking-[0.15em] text-muted uppercase"
        >
          Som: {sound ? 'ligado' : 'mudo'}
        </button>
      </div>

      <div className="relative mt-6 h-[520px] w-full max-w-[1200px]">
        {stage !== 'dealt' && (
          <Pack src={universe.pack} tearing={stage === 'tearing'} onOpen={open} />
        )}
        {stage === 'sealed' && showOdds && (
          <div
            className="absolute top-10 left-1/2 ml-[180px]"
            style={{ animation: 'fade-in .25s both' }}
          >
            <OddsPanel
              pack={PACK}
              energyName={energyNameOf(packUniverse)}
              pity={PITY_UR}
              sinceUR={sinceUR}
              sinceLR={sinceLR}
            />
          </div>
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
              <div
                style={
                  charging[i]
                    ? { animation: `charge .12s linear infinite`, filter: 'brightness(1.4)' }
                    : undefined
                }
              >
                <FlipCard
                  card={c}
                  flipped={flipped[i]!}
                  onFlip={() => !charging[i] && flip(i)}
                  label={`Revelar carta ${i + 1}`}
                />
              </div>
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
          {allFlipped && spotlight.length === 0 && (
            <button
              onClick={onAgain}
              disabled={!onAgain}
              className="rounded-lg bg-gold-metal px-6 py-3 font-display font-black tracking-wider text-[#1a1206] uppercase shadow-[0_0_24px_rgba(255,210,90,.45)] disabled:opacity-40 disabled:shadow-none"
            >
              {againLabel}
            </button>
          )}
          {allFlipped && spotlight.length === 0 && (
            <button
              onClick={onBack}
              className="rounded-lg border border-line px-6 py-3 font-display font-black tracking-wider text-muted uppercase"
            >
              Voltar à loja
            </button>
          )}
        </div>
      )}

      {spotlight[0] && (
        <Spotlight
          key={spotlight[0].key}
          card={spotlight[0].card}
          guaranteed={spotlight[0].guaranteed}
          onClose={() => setSpotlight((q) => q.slice(1))}
        />
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
          <Holo kind={rareOf(card) ?? ''}>
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
