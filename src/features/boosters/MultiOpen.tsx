import { Card } from '../../components/Card'
import type { CardDef } from '../../engine/cards'
import type { OpenedPack } from '../../engine/economy'
import { Burst } from './RareReveal'

const RANK = { UR: 5, SSR: 4, SR: 3, R: 2, C: 1 } as const
const rank = (c: CardDef) => (c.type === 'character' ? RANK[c.rarity] : 0)

/** Resultado de abrir vários packs: todas as cartas de uma vez, raras primeiro. */
export function MultiOpen({
  packs,
  before,
  onAgain,
  againLabel,
  onBack,
}: {
  packs: OpenedPack[]
  /** Inventário antes da compra, para marcar o que é novo. */
  before: Record<string, number>
  onAgain?: () => void
  againLabel: string
  onBack: () => void
}) {
  const seen = new Set<string>()
  const all = packs
    .flatMap((p) => p.cards)
    .map((card) => {
      const isNew = !before[card.id] && !seen.has(card.id)
      seen.add(card.id)
      return { card, isNew }
    })
    .sort((a, b) => rank(b.card) - rank(a.card))
  const count = (r: keyof typeof RANK) =>
    all.filter(({ card }) => card.type === 'character' && card.rarity === r).length

  return (
    <section className="flex min-h-[calc(100vh-64px)] flex-col items-center bg-[radial-gradient(ellipse_at_center,#2a1758,#0b0a1c_55%,#030407)] px-6 py-8">
      <p className="font-label text-sm font-bold tracking-[0.3em] text-gold-dim">
        {packs.length} PACKS ABERTOS
      </p>
      <h1 className="font-display text-3xl font-black text-parchment">Resultado</h1>
      <p className="mt-1 font-label text-sm font-bold tracking-[0.15em] uppercase">
        <span className="text-holo">UR {count('UR')}</span> ·{' '}
        <span className="text-gold-metal">SSR {count('SSR')}</span> ·{' '}
        <span className="text-muted">
          SR {count('SR')} · R {count('R')} · C {count('C')}
        </span>
      </p>

      <div className="mt-6 grid max-w-[1100px] grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-4">
        {all.map(({ card, isNew }, i) => {
          const r = card.type === 'character' ? card.rarity : null
          return (
            <div
              key={i}
              className="relative"
              style={{ animation: `pop-in .5s cubic-bezier(.2,.9,.3,1.2) ${i * 40}ms both` }}
            >
              <Card card={card} className="w-full" />
              {isNew && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gold-metal px-2 font-label text-[10px] font-bold tracking-[0.15em] text-[#1a1206]">
                  NOVA
                </span>
              )}
              {(r === 'UR' || r === 'SSR') && <Burst kind={r} />}
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={onAgain}
          disabled={!onAgain}
          className="rounded-lg bg-gold-metal px-6 py-3 font-display font-black tracking-wider text-[#1a1206] uppercase shadow-[0_0_24px_rgba(255,210,90,.45)] disabled:opacity-40 disabled:shadow-none"
        >
          {againLabel}
        </button>
        <button
          onClick={onBack}
          className="rounded-lg border border-line px-6 py-3 font-display font-black tracking-wider text-muted uppercase"
        >
          Voltar à loja
        </button>
      </div>
    </section>
  )
}
