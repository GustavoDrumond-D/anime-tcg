import { useEffect, useState } from 'react'
import { Card } from '../../components/Card'
import { UNIVERSES } from '../../data/universes'
import type { CardDef, CharacterDef, Universe } from '../../engine/cards'
import type { OpenedPack } from '../../engine/economy'
import { Burst, Spotlight, type RareKind } from './RareReveal'
import { sfx } from './sfx'

const RANK = { EX: 7, LR: 6, UR: 5, SSR: 4, SR: 3, R: 2, C: 1 } as const
const rank = (c: CardDef) => (c.type === 'character' ? RANK[c.rarity] : 0)
const rareOf = (c: CardDef): RareKind | null =>
  c.type === 'character' && (c.rarity === 'UR' || c.rarity === 'SSR') ? c.rarity : null

/** Sequência: rasga os packs → destaca cada rara (maior primeiro) → monta a grade do resto. */
type Phase = 'tearing' | 'rares' | 'grid'
const TEAR_MS = 1100
const STEP_MS = 70

export function MultiOpen({
  packUniverse,
  packs,
  before,
  onAgain,
  againLabel,
  onBack,
}: {
  packUniverse: Universe
  packs: OpenedPack[]
  /** Inventário antes da compra, para marcar o que é novo. */
  before: Record<string, number>
  onAgain?: () => void
  againLabel: string
  onBack: () => void
}) {
  const [phase, setPhase] = useState<Phase>('tearing')
  const [rareIdx, setRareIdx] = useState(0)
  const [skipped, setSkipped] = useState(false)

  // Ordena da maior raridade para a menor e marca a primeira cópia nunca vista como NOVA.
  const [all] = useState(() => {
    const seen = new Set<string>()
    return packs
      .flatMap((p) => p.cards.map((card) => ({ card, guaranteed: p.guaranteed })))
      .map((x) => {
        const isNew = !before[x.card.id] && !seen.has(x.card.id)
        seen.add(x.card.id)
        return { ...x, isNew }
      })
      .sort((a, b) => rank(b.card) - rank(a.card))
  })
  const rares = all.filter((x) => rareOf(x.card))
  const count = (r: keyof typeof RANK) =>
    all.filter(({ card }) => card.type === 'character' && card.rarity === r).length

  useEffect(() => {
    sfx.rip()
    const t = setTimeout(() => setPhase(rares.length ? 'rares' : 'grid'), TEAR_MS)
    return () => clearTimeout(t)
  }, [rares.length])

  // Som de cada rara ao entrar em destaque.
  const current = phase === 'rares' ? rares[rareIdx] : undefined
  useEffect(() => {
    if (current) sfx.rare(rareOf(current.card)!)
  }, [current])

  // Cascata da grade: um "deal" a cada poucas cartas.
  useEffect(() => {
    if (phase !== 'grid' || skipped) return
    const ts = all
      .filter((_, i) => i % 3 === 0)
      .map((_, k) => setTimeout(sfx.deal, k * STEP_MS * 3))
    return () => ts.forEach(clearTimeout)
  }, [phase, skipped, all])

  const nextRare = () => (rareIdx + 1 < rares.length ? setRareIdx(rareIdx + 1) : setPhase('grid'))
  const skip = () => {
    setSkipped(true)
    setPhase('grid')
  }

  return (
    <section className="relative flex min-h-[calc(100vh-64px)] flex-col items-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#2a1758,#0b0a1c_55%,#030407)] px-6 py-8">
      {phase !== 'grid' && (
        <button
          onClick={skip}
          className="absolute top-6 right-8 z-[60] rounded-full border border-line bg-ink/70 px-4 py-1.5 font-label text-xs font-bold tracking-[0.15em] text-muted uppercase hover:text-gold-light"
        >
          Pular ⏭
        </button>
      )}

      <p className="font-label text-sm font-bold tracking-[0.3em] text-gold-dim">
        {packs.length} × BOOSTER {UNIVERSES[packUniverse].name.toUpperCase()}
      </p>

      {phase === 'tearing' && (
        <div className="mt-16 flex gap-6" aria-label="Abrindo packs">
          {packs.map((_, i) => (
            <div
              key={i}
              className="relative aspect-[0.578] w-[150px] overflow-hidden rounded-md"
              style={{
                animation: `shake .3s ease-in-out ${i * 60}ms 2, fade-in .3s ease-out reverse ${700 + i * 50}ms both`,
              }}
            >
              <img
                src={UNIVERSES[packUniverse].pack}
                alt=""
                className="absolute top-[-1%] left-[-8.8%] h-[102%] w-[117.6%] max-w-none"
              />
              <div
                className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,.95),transparent_60%)]"
                style={{ animation: `fade-in .25s ease-out ${550 + i * 50}ms both` }}
              />
            </div>
          ))}
        </div>
      )}

      {phase === 'grid' && (
        <>
          <h1 className="font-display text-3xl font-black text-parchment">Resultado</h1>
          <p className="mt-1 font-label text-sm font-bold tracking-[0.15em] uppercase">
            <span className="text-holo">UR {count('UR')}</span> ·{' '}
            <span className="text-gold-metal">SSR {count('SSR')}</span> ·{' '}
            <span className="text-muted">
              SR {count('SR')} · R {count('R')} · C {count('C')}
            </span>
          </p>

          <div className="mt-6 grid w-full max-w-[1100px] grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-4">
            {all.map(({ card, isNew }, i) => {
              const r = rareOf(card)
              return (
                <div
                  key={i}
                  className="relative"
                  style={
                    skipped
                      ? undefined
                      : {
                          animation: `pop-in .45s cubic-bezier(.2,.9,.3,1.2) ${i * STEP_MS}ms both`,
                        }
                  }
                >
                  <Card card={card} className="w-full" />
                  {isNew && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-gold-metal px-2 font-label text-[10px] font-bold tracking-[0.15em] text-[#1a1206]">
                      NOVA
                    </span>
                  )}
                  {r && (
                    <div
                      className="pointer-events-none absolute inset-0 rounded-[10px]"
                      style={{
                        boxShadow:
                          r === 'UR'
                            ? '0 0 26px 6px rgba(125,249,255,.6)'
                            : '0 0 22px 4px rgba(255,210,90,.55)',
                      }}
                    />
                  )}
                  {r && !skipped && <Burst kind={r} />}
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
        </>
      )}

      {current && (
        <Spotlight
          key={rareIdx}
          card={current.card as CharacterDef}
          guaranteed={current.guaranteed && rareOf(current.card) === 'UR'}
          onClose={nextRare}
        />
      )}
    </section>
  )
}
