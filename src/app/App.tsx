import { useEffect, useRef, useState } from 'react'
import { Card } from '../components/Card'
import { CATALOG, CHARACTERS, ENERGIES } from '../data/cards'
import { ECONOMY } from '../data/economy'
import { UNIVERSES } from '../data/universes'
import type { CardDef, Rarity, Universe } from '../engine/cards'
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
        {import.meta.env.DEV && <DevTools />}
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
    <MultiOpen
      key={view.key}
      packUniverse={view.universe}
      packs={view.packs}
      before={view.before}
      {...props}
    />
  )
}

const RARITY_ORDER: Rarity[] = ['EX', 'LR', 'UR', 'SSR', 'SR', 'R', 'C']
const rarityRank = (c: CardDef) => (c.type === 'character' ? RARITY_ORDER.indexOf(c.rarity) : 99)

function Collection() {
  const { profile, sellExtras } = useProfile()
  const [confirm, setConfirm] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [zoom, setZoom] = useState<CardDef | null>(null)
  const [universe, setUniverse] = useState<Universe | 'energy' | 'all'>('all')
  const [rarity, setRarity] = useState<Rarity | 'all'>('all')
  const [ownedOnly, setOwnedOnly] = useState(false)
  const extra = extras(profile, CATALOG, ECONOMY)
  const extraValue = extra.reduce((a, e) => a + e.qty * ECONOMY.sell[tierOf(e.card)], 0)
  const has = (c: CardDef) => (profile.inventory[c.id] ?? 0) > 0
  const owned = CATALOG.filter(has).length

  const sellAll = () => {
    const gained = sellExtras()
    setConfirm(false)
    setNotice(`+${fmt(gained)} Fragmentos`)
  }

  const groups = [
    ...Object.entries(UNIVERSES).map(([id, u]) => ({
      id: id as Universe | 'energy',
      name: u.name,
      cards: CHARACTERS.filter((c) => c.universe === id) as CardDef[],
    })),
    { id: 'energy' as const, name: 'Energias', cards: ENERGIES as readonly CardDef[] },
  ].filter((g) => g.cards.length)
  const visible = (c: CardDef) =>
    (rarity === 'all' || (c.type === 'character' && c.rarity === rarity)) && (!ownedOnly || has(c))
  const shown = groups
    .filter((g) => universe === 'all' || g.id === universe)
    .map((g) => ({
      ...g,
      cards: g.cards.filter(visible).sort((x, y) => rarityRank(x) - rarityRank(y)),
    }))
    .filter((g) => g.cards.length)

  const chip = (on: boolean) =>
    `shrink-0 rounded-full border px-3 py-1 font-label text-xs font-bold tracking-[0.1em] uppercase transition-colors ${on ? 'border-gold bg-gold/15 text-gold-light' : 'border-line text-muted hover:border-gold/50 hover:text-parchment'}`

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-8">
      <header className="flex flex-wrap items-end gap-4">
        <div className="flex min-w-60 flex-col gap-2">
          <h1 className="font-display text-3xl font-black text-parchment">Coleção</h1>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-gold-metal"
                style={{ width: `${(owned / CATALOG.length) * 100}%` }}
              />
            </div>
            <span className="font-label text-sm tracking-[0.15em] text-muted uppercase">
              {owned} / {CATALOG.length} cartas
            </span>
          </div>
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
              title="Mantém 2 cópias de cada personagem (1 de UR, LR e EX) e 10 de cada energia"
            >
              Vender repetidas · +◆ {fmt(extraValue)}
            </button>
          ))}
      </header>

      <div className="sticky top-0 z-10 -mx-4 flex flex-col gap-2 border-y border-gold/15 bg-ink/85 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          <button className={chip(universe === 'all')} onClick={() => setUniverse('all')}>
            Todos
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              className={chip(universe === g.id)}
              onClick={() => setUniverse(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          <button className={chip(rarity === 'all')} onClick={() => setRarity('all')}>
            Todas
          </button>
          {RARITY_ORDER.map((r) => (
            <button key={r} className={chip(rarity === r)} onClick={() => setRarity(r)}>
              {r}
            </button>
          ))}
          <span className="flex-1" />
          <label className="flex shrink-0 cursor-pointer items-center gap-2 font-label text-xs font-bold tracking-[0.1em] text-muted uppercase">
            <input
              type="checkbox"
              checked={ownedOnly}
              onChange={(e) => setOwnedOnly(e.target.checked)}
              className="accent-[#d4af37]"
            />
            Só as que tenho
          </label>
        </div>
      </div>

      {shown.map((g) => (
        <section key={g.id} className="flex flex-col gap-4">
          <h2 className="flex items-center gap-3 font-label text-sm font-bold tracking-[0.2em] text-gold-dim uppercase">
            {g.name}
            <span className="text-muted">
              {g.cards.filter(has).length}/{g.cards.length}
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-5">
            {g.cards.map((c) => (
              <Owned key={c.id} card={c} qty={profile.inventory[c.id] ?? 0} onZoom={setZoom} />
            ))}
          </div>
        </section>
      ))}
      {!shown.length && (
        <p className="py-16 text-center font-label tracking-[0.15em] text-muted uppercase">
          Nenhuma carta com esses filtros
        </p>
      )}
      {zoom && <CardZoom card={zoom} onClose={() => setZoom(null)} />}
    </main>
  )
}

/** Carta inteira + cópias, venda e atalho dev. <dialog> nativo: Esc e foco de graça. */
function CardZoom({ card, onClose }: { card: CardDef; onClose: () => void }) {
  const { profile, sell, dev } = useProfile()
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => ref.current?.showModal(), [])
  const qty = profile.inventory[card.id] ?? 0
  const value = ECONOMY.sell[tierOf(card)]
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      aria-label={card.name}
      className="m-auto bg-transparent p-4 backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4 [animation:pop-in_.35s_ease-out]">
        <Card card={card} variant="full" className="w-[min(380px,85vw)]" />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="font-label text-sm font-bold tracking-[0.15em] text-gold-light uppercase">
            {qty ? `${qty} cópia${qty > 1 ? 's' : ''}` : 'Não obtida'}
          </span>
          {qty > 0 && value > 0 && (
            <button
              onClick={() => sell(card, 1)}
              className="rounded border border-line px-3 py-1 font-label text-xs font-bold tracking-[0.1em] text-muted uppercase hover:border-gold/60 hover:text-gold-light"
            >
              Vender 1 · +◆ {value}
            </button>
          )}
          {import.meta.env.DEV && (
            <button
              onClick={() => dev.grantCard(card)}
              title="Visível só em desenvolvimento"
              className="rounded border border-dashed border-atk/60 px-3 py-1 font-label text-xs font-bold tracking-[0.1em] text-atk uppercase hover:bg-atk/10"
            >
              Dev · +1 cópia
            </button>
          )}
        </div>
      </div>
    </dialog>
  )
}

/** Carta da coleção: escurecida se não tem; contador se tem. Clique abre o zoom. */
function Owned({
  card,
  qty,
  onZoom,
}: {
  card: CardDef
  qty: number
  onZoom: (card: CardDef) => void
}) {
  return (
    <button
      onClick={() => onZoom(card)}
      aria-label={`Ver ${card.name}`}
      className="group relative cursor-zoom-in rounded-[10px] transition-transform duration-200 hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-gold"
    >
      <Card
        card={card}
        className={`w-full transition-[filter] ${qty ? '' : 'brightness-[.35] saturate-0 group-hover:brightness-[.6]'}`}
      />
      {qty > 0 ? (
        <span className="absolute -top-2 -right-2 rounded-full border border-gold/70 bg-ink px-2 font-label text-xs font-bold text-gold-light shadow">
          ×{qty}
        </span>
      ) : (
        <span className="absolute inset-x-0 bottom-1/2 text-center font-label text-[10px] font-bold tracking-[0.25em] text-parchment/60 uppercase">
          Não obtida
        </span>
      )}
    </button>
  )
}

/** Atalhos de teste. `import.meta.env.DEV` é falso no build: o Vite remove tudo isto da versão final. */
function DevTools() {
  const { dev } = useProfile()
  const btn =
    'rounded border border-dashed border-atk/60 px-2 py-1 font-label text-[11px] font-bold tracking-[0.1em] text-atk uppercase hover:bg-atk/10'
  return (
    <span className="flex items-center gap-1.5" title="Visível só em desenvolvimento">
      <span className="font-label text-[10px] tracking-[0.15em] text-atk/70 uppercase">Dev</span>
      <button className={btn} onClick={() => dev.grant(1000)}>
        +◆ 1.000
      </button>
      <button className={btn} onClick={() => dev.grant(10000)}>
        +◆ 10.000
      </button>
      <button
        className={btn}
        onClick={dev.reset}
        title="Volta para 1.000 Fragmentos, 3 packs grátis, coleção vazia"
      >
        Resetar perfil
      </button>
    </span>
  )
}
