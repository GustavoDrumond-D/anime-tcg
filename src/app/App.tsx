import { useState, type ReactNode } from 'react'
import { Card } from '../components/Card'
import { CATALOG, CHARACTERS, ENERGIES } from '../data/cards'
import { ECONOMY } from '../data/economy'
import { UNIVERSES } from '../data/universes'
import type { CardDef, Universe } from '../engine/cards'
import { extras, packCost, tierOf, type OpenedPack } from '../engine/economy'
import { MultiOpen } from '../features/boosters/MultiOpen'
import { PackOpening } from '../features/boosters/PackOpening'
import { Store } from '../features/boosters/Store'
import { useProfile } from './profileContext'

// ponytail: troca de tela por estado; vira rota quando houver as 4 abas da v3.
type Screen = 'catalog' | 'pack'

const fmt = (n: number) => n.toLocaleString('pt-BR')

export function App() {
  const [screen, setScreen] = useState<Screen>('pack')
  const { profile } = useProfile()
  return (
    <>
      <nav className="flex h-16 items-center gap-6 border-b border-gold/20 bg-ink/70 px-8">
        <span className="font-display text-xl font-black text-gold-metal">Anime TCG</span>
        {(
          [
            ['pack', 'Boosters'],
            ['catalog', 'Coleção'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setScreen(id)}
            className={`font-label text-sm font-bold tracking-[0.1em] uppercase ${screen === id ? 'border-b-2 border-gold text-[#FFD86B]' : 'text-muted'}`}
          >
            {label}
          </button>
        ))}
        <span className="flex-1" />
        {profile.freePacks > 0 && (
          <span className="font-label text-xs font-bold tracking-[0.15em] text-hp uppercase">
            {profile.freePacks} pack{profile.freePacks > 1 ? 's' : ''} grátis
          </span>
        )}
        <span
          aria-label={`${profile.fragments} Fragmentos`}
          className="flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-1.5"
        >
          <span className="text-holo">◆</span>
          <span className="font-display font-black text-gold-light">{fmt(profile.fragments)}</span>
          <span className="font-label text-[10px] tracking-[0.15em] text-muted uppercase">
            Fragmentos
          </span>
        </span>
      </nav>
      {screen === 'pack' ? <Boosters /> : <Collection />}
    </>
  )
}

type View =
  | { mode: 'store' }
  | {
      mode: 'open'
      universe: Universe
      packs: OpenedPack[]
      before: Record<string, number>
      key: number
    }

function Boosters() {
  const { profile, buy } = useProfile()
  const [view, setView] = useState<View>({ mode: 'store' })
  const purchase = (universe: Universe, count: number) => {
    const before = profile.inventory
    const r = buy(universe, count)
    if (r.ok) setView({ mode: 'open', universe, packs: r.packs, before, key: Date.now() })
  }
  if (view.mode === 'store') return <Store onOpen={purchase} />

  const count = view.packs.length
  const cost = packCost(profile, count, ECONOMY)
  const affordable = cost.fragments <= profile.fragments
  const againLabel = `Abrir ${count > 1 ? `mais ×${count}` : 'outro'} · ${cost.fragments ? `◆ ${fmt(cost.fragments)}` : 'grátis'}`
  const props = {
    onAgain: affordable ? () => purchase(view.universe, count) : undefined,
    againLabel,
    onBack: () => setView({ mode: 'store' }),
  }
  return count === 1 ? (
    <PackOpening key={view.key} packUniverse={view.universe} opened={view.packs[0]!} {...props} />
  ) : (
    <MultiOpen key={view.key} packs={view.packs} before={view.before} {...props} />
  )
}

function Collection() {
  const { profile, sell, sellExtras } = useProfile()
  const [confirm, setConfirm] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const extra = extras(profile, CATALOG, ECONOMY)
  const extraValue = extra.reduce((a, e) => a + e.qty * ECONOMY.sell[tierOf(e.card)], 0)
  const owned = CATALOG.filter((c) => profile.inventory[c.id]).length

  const sellAll = () => {
    const gained = sellExtras()
    setConfirm(false)
    setNotice(`+${fmt(gained)} Fragmentos`)
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <header className="flex flex-wrap items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-parchment">Coleção</h1>
          <p className="font-label text-sm tracking-[0.15em] text-muted uppercase">
            {owned} de {CATALOG.length} cartas
          </p>
        </div>
        <span className="flex-1" />
        {notice && <span className="font-label font-bold text-hp">{notice}</span>}
        {extra.length > 0 &&
          (confirm ? (
            <span className="flex items-center gap-2">
              <span className="text-sm text-muted">
                Vender {extra.reduce((a, e) => a + e.qty, 0)} repetidas?
              </span>
              <button
                onClick={sellAll}
                className="rounded-lg bg-gold-metal px-4 py-2 font-display text-sm font-black text-[#1a1206] uppercase"
              >
                Confirmar +◆ {fmt(extraValue)}
              </button>
              <button
                onClick={() => setConfirm(false)}
                className="px-2 font-label text-sm text-muted uppercase"
              >
                Cancelar
              </button>
            </span>
          ) : (
            <button
              onClick={() => setConfirm(true)}
              className="rounded-lg border border-gold/60 px-4 py-2 font-display text-sm font-black tracking-wider text-gold-light uppercase"
              title="Mantém 2 cópias de cada personagem (1 de UR) e 10 de cada energia"
            >
              Vender repetidas · +◆ {fmt(extraValue)}
            </button>
          ))}
      </header>

      {Object.entries(UNIVERSES).map(([id, u]) => {
        const chars = CHARACTERS.filter((c) => c.universe === id)
        if (!chars.length) return null
        return (
          <Section key={id} title={u.name}>
            {chars.map((c) => (
              <Owned key={c.id} card={c} qty={profile.inventory[c.id] ?? 0} onSell={sell} />
            ))}
          </Section>
        )
      })}
      <Section title="Energias">
        {ENERGIES.map((e) => (
          <Owned key={e.id} card={e} qty={profile.inventory[e.id] ?? 0} onSell={sell} />
        ))}
      </Section>
    </main>
  )
}

/** Carta da coleção: apagada se não tem; com contador e venda unitária se tem. */
function Owned({
  card,
  qty,
  onSell,
}: {
  card: CardDef
  qty: number
  onSell: (card: CardDef, qty: number) => void
}) {
  return (
    <div className="flex w-[150px] flex-col gap-1.5">
      <div className={`relative ${qty ? '' : 'opacity-30 grayscale'}`}>
        <Card card={card} className="w-full" />
        {qty > 0 && (
          <span className="absolute top-1.5 right-1.5 rounded border border-gold/60 bg-ink/90 px-1.5 font-label text-xs font-bold text-gold-light">
            ×{qty}
          </span>
        )}
      </div>
      <button
        onClick={() => onSell(card, 1)}
        disabled={!qty}
        className="rounded border border-line py-1 font-label text-[11px] font-bold tracking-[0.1em] text-muted uppercase hover:border-gold/60 hover:text-gold-light disabled:invisible"
      >
        Vender 1 · +◆ {ECONOMY.sell[tierOf(card)]}
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-label text-sm font-bold tracking-[0.2em] text-gold-dim uppercase">
        {title}
      </h2>
      <div className="flex flex-wrap gap-4">{children}</div>
    </section>
  )
}
