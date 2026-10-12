import type { CSSProperties } from 'react'
import type { CardDef, CharacterDef, Cost, Keyword, Rarity } from '../engine/cards'
import { RARITY } from '../engine/cards'
import { ENERGY_COLOR, UNIVERSES } from '../data/universes'

// Moldura ornamentada feita em código: nada de texto/stat na arte (CLAUDE.md §6).
// Tudo mede em cqw (largura da carta), então a mesma moldura serve do grid (140px) ao zoom (380px).

const CLASS_LABEL: Record<CharacterDef['class'], string> = {
  fighter: 'Lutador',
  tank: 'Tanque',
  support: 'Suporte',
  controller: 'Controlador',
  summoner: 'Invocador',
}

/** Ícones de classe (viewBox 24). */
const CLASS_ICON: Record<CharacterDef['class'], string> = {
  fighter:
    'M5 3l8 8-2 2-8-8V3zm14 0v2l-8 8-2-2 8-8h2zM4 17l3 3-2 1-2-2 1-2zm16 0l1 2-2 2-2-1 3-3zM7 14l3 3-3 3-3-3 3-3zm10 0l3 3-3 3-3-3 3-3z',
  tank: 'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3zm0 3L7 7v4c0 3.5 2.2 6.4 5 7.8 2.8-1.4 5-4.3 5-7.8V7l-5-2z',
  support: 'M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3z',
  controller:
    'M12 5c5 0 9 4 10 7-1 3-5 7-10 7S3 15 2 12c1-3 5-7 10-7zm0 3a4 4 0 100 8 4 4 0 000-8zm0 2.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z',
  summoner:
    'M3 4l4 3 5-5 5 5 4-3-1 7H4L3 4zm9 9c4 0 7 2.5 8 4.5-1 2-4 4.5-8 4.5s-7-2.5-8-4.5c1-2 4-4.5 8-4.5zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5z',
}

interface Tier {
  /** Borda: classe animada (index.css) ou gradiente estático. */
  frame: string | { background: string }
  /** Metal dos medalhões e selos (estático). */
  ring: string
  accent: string
  text: string
}
const GOLD = 'linear-gradient(135deg,#fff3c4,#c9962e 30%,#7a5212 50%,#f1d98a 70%,#b8892b)'
const STEEL = 'linear-gradient(135deg,#f1f5f9,#94a3b8 30%,#475569 50%,#cbd5e1 70%,#64748b)'
const TIER: Record<Rarity, Tier> = {
  EX: {
    frame: 'frame-ex',
    ring: 'linear-gradient(135deg,#fff3c4,#d4a017 30%,#7f1d1d 50%,#f1d98a 70%,#b91c1c)',
    accent: '#ff4d4d',
    text: 'text-ex',
  },
  LR: {
    frame: 'frame-lr',
    ring: 'linear-gradient(135deg,#ffd1f4,#ff4fd8 25%,#6d5bff 50%,#3fd0ff 75%,#ffd86b)',
    accent: '#ff7ae0',
    text: 'text-lr',
  },
  UR: {
    frame: 'frame-ur',
    ring: 'linear-gradient(135deg,#7df9ff,#ff6ad5 33%,#ffd86b 66%,#7df9ff)',
    accent: '#7df9ff',
    text: 'text-holo',
  },
  SSR: { frame: { background: GOLD }, ring: GOLD, accent: '#ffd86b', text: 'text-gold-metal' },
  SR: { frame: { background: GOLD }, ring: GOLD, accent: '#f1d98a', text: 'text-gold-metal' },
  R: { frame: { background: STEEL }, ring: STEEL, accent: '#93c5fd', text: 'text-[#cbd5e1]' },
  C: { frame: { background: STEEL }, ring: STEEL, accent: '#9ca3af', text: 'text-[#cbd5e1]' },
}
const FOIL: Partial<Record<Rarity, string>> = { UR: 'foil-ur', LR: 'foil-lr', EX: 'foil-ex' }

const KEYWORD_LABEL: Record<Exclude<Keyword, object>, string> = {
  provoke: 'Provocar',
  haste: 'Ímpeto',
  piercing: 'Perfurante',
  trample: 'Penetração',
  immune: 'Imune',
}
const keywordLabel = (k: Keyword) =>
  typeof k === 'string'
    ? KEYWORD_LABEL[k]
    : `${k.id === 'defense' ? 'Defesa' : 'Escudo'} ${k.value}`

export type CardVariant = 'full' | 'compact'

interface Props {
  card: CardDef
  variant?: CardVariant
  className?: string
}

export function Card({ card, variant = 'compact', className = '' }: Props) {
  if (card.type === 'energy') {
    return (
      <img
        src={card.art}
        alt={card.name}
        loading="lazy"
        className={`aspect-[3/4] rounded-lg border border-gold/40 object-cover ${className}`}
      />
    )
  }
  const full = variant === 'full'
  const tier = TIER[card.rarity]
  return (
    <article
      aria-label={`${card.name}, ${card.rarity}, ATQ ${card.stats.attack}, HP ${card.stats.hp}`}
      className={`@container aspect-[3/4] ${className}`}
      style={{ '--accent': tier.accent } as CSSProperties}
    >
      {/* cqw só mede a carta dentro do @container: por isso a moldura é um filho, não o article. */}
      <div
        className={`h-full rounded-[4cqw] p-[1.6cqw] ${typeof tier.frame === 'string' ? tier.frame : ''}`}
        style={typeof tier.frame === 'string' ? undefined : tier.frame}
      >
        <div className="relative flex h-full flex-col overflow-hidden rounded-[3cqw] bg-ink shadow-[inset_0_0_0_0.5cqw_rgba(0,0,0,.7)]">
          <Art card={card} full={full} />
          {FOIL[card.rarity] && <div aria-hidden className={`foil ${FOIL[card.rarity]}`} />}
          <Corners />
          <Header card={card} full={full} />
          <div className="relative flex-1">
            <div className="absolute inset-x-[2cqw] bottom-[1.5cqw] flex items-end justify-between">
              <Medallion label="ATQ" value={card.stats.attack} tone="atk" ring={tier.ring} />
              {full && (
                <div className="mb-[1cqw] flex flex-col items-center gap-[1cqw]">
                  {card.keywords && (
                    <div className="flex flex-wrap justify-center gap-[1cqw]">
                      {card.keywords.map((k) => (
                        <span
                          key={keywordLabel(k)}
                          className="rounded-[1cqw] border border-[var(--accent)]/60 bg-ink/85 px-[1.5cqw] font-label text-[2.6cqw] font-bold tracking-[0.1em] text-parchment uppercase"
                        >
                          {keywordLabel(k)}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="flex items-center gap-[1cqw] rounded-full bg-ink/80 px-[2cqw] py-[0.5cqw] font-label text-[2.6cqw] tracking-[0.1em] text-muted">
                    INVOCA <Pips cost={{ specific: {}, generic: RARITY[card.rarity].summonCost }} />
                  </span>
                </div>
              )}
              <Medallion label="HP" value={card.stats.hp} tone="hp" ring={tier.ring} />
            </div>
          </div>
          {full && <Panels card={card} />}
        </div>
      </div>
    </article>
  )
}

function Art({ card, full }: { card: CharacterDef; full: boolean }) {
  return (
    <>
      {card.art ? (
        <img
          src={card.art}
          alt=""
          loading="lazy"
          className={`absolute inset-x-0 top-0 w-full object-cover ${full ? 'h-[72%]' : 'h-full'}`}
        />
      ) : (
        // Placeholder sem arte: cor da energia do universo + nome em japonês. Nunca imagem quebrada.
        <div
          className="absolute inset-0 grid place-items-center"
          style={{
            background: `radial-gradient(circle at 50% 38%, ${ENERGY_COLOR[UNIVERSES[card.universe].energy]}55, #0b0d16 70%)`,
          }}
        >
          <span className="font-kanji text-[18cqw] leading-none text-white/15 [writing-mode:vertical-rl]">
            {card.kanji ?? card.name}
          </span>
          <span className="absolute top-[42%] font-label text-[3cqw] font-bold tracking-[0.25em] text-white/35 uppercase">
            arte em breve
          </span>
        </div>
      )}
      <div
        className={`absolute inset-0 ${full ? 'bg-[linear-gradient(180deg,rgba(5,6,10,.9)_0%,transparent_18%,transparent_42%,rgba(5,6,10,.85)_62%,#05060a_72%)]' : 'bg-[linear-gradient(180deg,rgba(5,6,10,.9)_0%,transparent_22%,transparent_62%,rgba(5,6,10,.85)_100%)]'}`}
      />
    </>
  )
}

/** Arabesco dourado nos quatro cantos. */
function Corners() {
  const corner = (cls: string) => (
    <svg
      aria-hidden
      viewBox="0 0 40 40"
      className={`pointer-events-none absolute size-[11cqw] text-[var(--accent)] drop-shadow-[0_0_3px_rgba(0,0,0,.9)] ${cls}`}
      fill="none"
      stroke="currentColor"
    >
      <path d="M3 37V12Q3 3 12 3h25" strokeWidth="2.2" />
      <path d="M9 31V15q0-6 6-6h16" strokeWidth="1" opacity=".7" />
      <path d="M3 3l7 0-7 7z" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
  return (
    <>
      {corner('top-[0.6cqw] left-[0.6cqw]')}
      {corner('top-[0.6cqw] right-[0.6cqw] -scale-x-100')}
      {corner('bottom-[0.6cqw] left-[0.6cqw] -scale-y-100')}
      {corner('right-[0.6cqw] bottom-[0.6cqw] -scale-100')}
    </>
  )
}

function Header({ card, full }: { card: CharacterDef; full: boolean }) {
  const tier = TIER[card.rarity]
  const sub = [
    UNIVERSES[card.universe].name,
    ...(card.faction ?? []).map((f) => f[0]!.toUpperCase() + f.slice(1)),
    CLASS_LABEL[card.class],
  ]
  return (
    <header className="relative flex items-start gap-[1.5cqw] px-[3cqw] pt-[3cqw]">
      {/* Medalhão da classe */}
      <div
        title={CLASS_LABEL[card.class]}
        className="grid size-[14cqw] shrink-0 place-items-center rounded-full p-[0.9cqw] shadow-[0_0_2cqw_rgba(0,0,0,.8)]"
        style={{ background: tier.ring }}
      >
        <div className="grid size-full place-items-center rounded-full bg-[radial-gradient(circle,#2a1636,#0b0610)]">
          <svg
            viewBox="0 0 24 24"
            className="size-[60%] fill-[var(--accent)] drop-shadow-[0_0_1.5cqw_var(--accent)]"
          >
            <path d={CLASS_ICON[card.class]} />
          </svg>
        </div>
      </div>
      {/* Faixa do nome */}
      <div className="min-w-0 flex-1 pt-[1cqw] text-center">
        <h3
          className={`line-clamp-2 font-display leading-tight ${full ? 'text-[6.4cqw]' : 'text-[5.6cqw]'} font-black text-gold-metal uppercase drop-shadow-[0_0.4cqw_0.4cqw_rgba(0,0,0,.9)]`}
        >
          {card.name}
        </h3>
        {full && (
          <p className="mx-auto mt-[0.8cqw] w-fit rounded-[1cqw] border border-[var(--accent)]/40 bg-ink/80 px-[2cqw] font-label text-[2.7cqw] font-semibold tracking-[0.08em] text-parchment/90">
            {sub.join('  ◆  ')}
          </p>
        )}
      </div>
      {/* Selo de raridade */}
      <div
        className="grid h-[15cqw] w-[14cqw] shrink-0 place-items-center p-[0.8cqw] [clip-path:polygon(50%_0,100%_18%,100%_75%,50%_100%,0_75%,0_18%)]"
        style={{ background: tier.ring }}
      >
        <div className="grid size-full place-items-center bg-[radial-gradient(circle,#1d0a10,#05060a)] [clip-path:polygon(50%_0,100%_18%,100%_75%,50%_100%,0_75%,0_18%)]">
          <span
            className={`font-display font-black ${tier.text} ${card.rarity.length > 2 ? 'text-[4.6cqw]' : 'text-[6cqw]'}`}
          >
            {card.rarity}
          </span>
        </div>
      </div>
      {card.kanji && full && (
        <span
          aria-hidden
          className="absolute top-[19cqw] left-[4.5cqw] font-kanji text-[3.4cqw] leading-tight whitespace-nowrap text-gold-light/85 [writing-mode:vertical-rl]"
        >
          {card.kanji}
        </span>
      )}
    </header>
  )
}

function Medallion({
  label,
  value,
  tone,
  ring,
}: {
  label: string
  value: number
  tone: 'atk' | 'hp'
  ring: string
}) {
  const inner =
    tone === 'atk'
      ? 'bg-[radial-gradient(circle_at_50%_35%,#7f1d1d,#1a0508_70%)]'
      : 'bg-[radial-gradient(circle_at_50%_35%,#065f46,#03140f_70%)]'
  return (
    <div
      className="size-[17cqw] rounded-full p-[1cqw] shadow-[0_0_2.5cqw_rgba(0,0,0,.9)]"
      style={{ background: ring }}
    >
      <div className={`flex size-full flex-col items-center justify-center rounded-full ${inner}`}>
        <span
          className={`font-label text-[2.6cqw] leading-none font-bold tracking-[0.1em] ${tone === 'atk' ? 'text-atk' : 'text-hp'}`}
        >
          {label}
        </span>
        <span className="font-display text-[7.5cqw] leading-none font-black text-gold-metal">
          {value}
        </span>
      </div>
    </div>
  )
}

function Panels({ card }: { card: CharacterDef }) {
  const panel =
    'relative flex gap-[2cqw] rounded-[2cqw] border border-[var(--accent)]/45 bg-[linear-gradient(90deg,rgba(20,10,24,.95),rgba(8,9,15,.92))] px-[2.5cqw] py-[1.6cqw] shadow-[inset_0_0_3cqw_rgba(0,0,0,.6)]'
  return (
    <section className="relative flex flex-col gap-[1.4cqw] px-[2.5cqw] pb-[3cqw]">
      {card.abilities.map((a) => (
        <div key={a.id} className={panel}>
          <CostGem cost={a.cost} />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-[1cqw]">
              <span className="font-display text-[3.6cqw] font-black text-gold-light">
                {a.name}
              </span>
              <span className="flex-1" />
              {a.multiplier > 0 && (
                <span className="font-display text-[4.4cqw] leading-none font-black text-[#FFD86B]">
                  {Math.floor(card.stats.attack * a.multiplier)}
                  <span className="ml-[0.5cqw] font-label text-[2.2cqw] text-gold-dim">DANO</span>
                </span>
              )}
            </div>
            <p className="text-[2.8cqw] leading-[1.3] text-[#c4c8d6]">{a.text}</p>
          </div>
        </div>
      ))}
      {card.passives.map((p) => (
        <div key={p.id} className={panel}>
          <div
            className="grid size-[8cqw] shrink-0 place-items-center self-center rounded-full p-[0.6cqw]"
            style={{ background: TIER[card.rarity].ring }}
          >
            <div className="grid size-full place-items-center rounded-full bg-[radial-gradient(circle,#3b1d4a,#0b0610)] font-display text-[3.4cqw] font-black text-[var(--accent)]">
              ✦
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[3.2cqw] font-black uppercase">
              <span className="text-[var(--accent)]">Passiva</span>{' '}
              <span className="text-gold-light">— {p.name}</span>
            </p>
            <p className="text-[2.8cqw] leading-[1.3] text-[#c4c8d6]">{p.text}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

/** Custo como gema numerada (total) + pips das energias específicas embaixo. */
function CostGem({ cost }: { cost: Cost }) {
  const specific = Object.entries(cost.specific).filter(([, n]) => n)
  const total = cost.generic + specific.reduce((a, [, n]) => a + (n ?? 0), 0)
  const color = specific[0] ? ENERGY_COLOR[specific[0][0] as keyof typeof ENERGY_COLOR] : '#8b5cf6'
  return (
    <div className="flex shrink-0 flex-col items-center gap-[0.6cqw] self-center">
      <div
        className="grid size-[8cqw] place-items-center rounded-full border-[0.6cqw] border-[#f1d98a] font-display text-[4.4cqw] font-black text-white shadow-[0_0_2cqw_var(--accent)]"
        style={{ background: `radial-gradient(circle at 40% 35%, ${color}, #120a1c 75%)` }}
      >
        {total}
      </div>
      <Pips cost={cost} />
    </div>
  )
}

/** Uma bolinha por ponto de energia: específicas na cor do tipo, genéricas em cinza. */
function Pips({ cost }: { cost: Cost }) {
  const dots = [
    ...Object.entries(cost.specific).flatMap(([t, n]) => Array<string>(n ?? 0).fill(t)),
    ...Array<string>(cost.generic).fill('generic'),
  ]
  if (!dots.length) return <span className="font-label text-[2.6cqw] font-bold text-muted">0</span>
  return (
    <span className="flex gap-[0.4cqw]">
      {dots.map((t, i) => (
        <span
          key={i}
          className="size-[1.8cqw] rounded-full border-[0.3cqw] border-[#0b0d14]"
          style={{ background: ENERGY_COLOR[t as keyof typeof ENERGY_COLOR] }}
        />
      ))}
    </span>
  )
}
