import type { CardDef, CharacterDef, Cost, Keyword, Rarity } from '../engine/cards'
import { RARITY } from '../engine/cards'
import { ENERGY_COLOR, UNIVERSES } from '../data/universes'

const CLASS_LABEL: Record<CharacterDef['class'], string> = {
  fighter: 'Lutador',
  tank: 'Tanque',
  support: 'Suporte',
  controller: 'Controlador',
  summoner: 'Invocador',
}

// Moldura por raridade: EX/LR com borda animada, UR holográfica, SSR/SR dourada, C/R discreta.
// Classes frame-*/foil-* ficam em index.css (animações).
const FRAME: Record<Rarity, string> = {
  EX: 'frame-ex',
  LR: 'frame-lr',
  UR: 'frame-ur',
  SSR: 'bg-gold-metal shadow-[0_0_24px_rgba(212,175,55,0.35)]',
  SR: 'bg-gold-metal',
  R: 'bg-line',
  C: 'bg-line',
}
const FOIL: Partial<Record<Rarity, string>> = { UR: 'foil-ur', LR: 'foil-lr', EX: 'foil-ex' }
const RARITY_TEXT: Record<Rarity, string> = {
  EX: 'text-ex',
  LR: 'text-lr',
  UR: 'text-holo',
  SSR: 'text-gold-metal',
  SR: 'text-gold-metal',
  R: 'text-muted',
  C: 'text-muted',
}

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
  return (
    <article
      aria-label={`${card.name}, ${card.rarity}, ATQ ${card.stats.attack}, HP ${card.stats.hp}`}
      className={`@container aspect-[3/4] ${full ? 'rounded-2xl p-[3px]' : 'rounded-[10px] p-[2px]'} ${FRAME[card.rarity]} ${className}`}
    >
      <div
        className={`relative flex h-full flex-col overflow-hidden bg-ink ${full ? 'gap-2 rounded-[13px] p-3.5' : 'gap-1 rounded-[8px] p-2'}`}
      >
        <Art card={card} />
        {FOIL[card.rarity] && <div aria-hidden className={`foil ${FOIL[card.rarity]}`} />}
        {full ? <FullBody card={card} /> : <CompactBody card={card} />}
      </div>
    </article>
  )
}

function Art({ card }: { card: CharacterDef }) {
  return (
    <>
      {card.art ? (
        <img
          src={card.art}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        // Placeholder sem arte: cor da energia do universo + nome em japonês. Nunca imagem quebrada.
        <div
          className="absolute inset-0 grid place-items-center"
          style={{
            background: `radial-gradient(circle at 50% 38%, ${ENERGY_COLOR[UNIVERSES[card.universe].energy]}55, #0b0d16 70%)`,
          }}
        >
          <span className="font-kanji text-[clamp(1.5rem,18cqw,4rem)] leading-none text-white/15 [writing-mode:vertical-rl]">
            {card.kanji ?? card.name}
          </span>
          <span className="absolute top-[42%] font-label text-[10px] font-bold tracking-[0.25em] text-white/35 uppercase">
            arte em breve
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,10,.85)_0%,transparent_20%,transparent_40%,rgba(5,6,10,.82)_60%,rgba(5,6,10,.97)_100%)]" />
    </>
  )
}

function CompactBody({ card }: { card: CharacterDef }) {
  return (
    <div className="relative flex h-full flex-col">
      <span className={`font-display text-xs font-black ${RARITY_TEXT[card.rarity]}`}>
        {card.rarity}
      </span>
      <div className="flex-1" />
      <h3 className="font-display text-xs leading-tight font-black text-parchment drop-shadow">
        {card.name}
      </h3>
      <div className="mt-1 flex justify-between">
        <Stat label="ATQ" value={card.stats.attack} tone="atk" small />
        <Stat label="HP" value={card.stats.hp} tone="hp" small />
      </div>
    </div>
  )
}

function FullBody({ card }: { card: CharacterDef }) {
  return (
    <div className="relative flex h-full flex-col gap-2">
      <header className="flex items-start gap-2">
        <div className="flex-1">
          <h3 className="font-display text-[23px] leading-[26px] font-black text-parchment drop-shadow">
            {card.name}
          </h3>
          <p className="font-label text-[11px] font-semibold tracking-[0.1em] text-gold-light/80 uppercase drop-shadow">
            {UNIVERSES[card.universe].name} · {CLASS_LABEL[card.class]}
          </p>
        </div>
        <span
          className={`rounded-md border border-gold/60 bg-ink/85 px-2 py-0.5 font-display text-base font-black ${RARITY_TEXT[card.rarity]}`}
        >
          {card.rarity}
        </span>
      </header>
      {card.kanji && (
        <span
          aria-hidden
          className="absolute top-[70px] left-0.5 font-kanji text-sm leading-[18px] text-gold-light/85 [writing-mode:vertical-rl]"
        >
          {card.kanji}
        </span>
      )}
      <div className="flex-1" />
      {card.keywords && (
        <div className="flex flex-wrap gap-1">
          {card.keywords.map((k) => (
            <span
              key={keywordLabel(k)}
              className="rounded border border-gold/50 bg-ink/80 px-1.5 font-label text-[10px] font-bold tracking-[0.1em] text-gold-light uppercase"
            >
              {keywordLabel(k)}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Stat label="ATQ" value={card.stats.attack} tone="atk" />
        <Stat label="HP" value={card.stats.hp} tone="hp" />
        <div className="flex-1" />
        <span className="flex items-center gap-1 font-label text-[10px] tracking-[0.08em] text-muted">
          INVOCA <Pips cost={{ specific: {}, generic: RARITY[card.rarity].summonCost }} />
        </span>
      </div>
      <section className="flex flex-col gap-2 rounded-[10px] border border-gold/35 bg-[#0a0c13]/70 p-3 backdrop-blur-md">
        {card.abilities.map((a) => (
          <div key={a.id}>
            <div className="flex items-center gap-1.5">
              <Pips cost={a.cost} />
              <span className="font-label text-[15px] font-bold text-parchment">{a.name}</span>
              <span className="flex-1" />
              {a.multiplier > 0 && (
                <span className="font-display text-lg font-black text-[#FFD86B]">
                  {Math.floor(card.stats.attack * a.multiplier)}
                  <span className="ml-0.5 font-label text-[9px] text-gold-dim">DANO</span>
                </span>
              )}
            </div>
            <p className="text-[10.5px] leading-[14px] text-[#b8bccb]">{a.text}</p>
          </div>
        ))}
        {card.passives.map((p) => (
          <div key={p.id} className="border-t border-gold/25 pt-2">
            <p className="font-label text-xs font-bold tracking-[0.04em] text-gold-light/85 uppercase">
              Passiva · {p.name}
            </p>
            <p className="text-[10.5px] leading-[14px] text-[#b8bccb]">{p.text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

function Stat({
  label,
  value,
  tone,
  small,
}: {
  label: string
  value: number
  tone: 'atk' | 'hp'
  small?: boolean
}) {
  const c =
    tone === 'atk'
      ? 'border-atk/70 bg-[#2a0f14]/90 text-atk'
      : 'border-hp/70 bg-[#0c2a22]/90 text-hp'
  return (
    <span
      className={`flex items-center gap-1 rounded-md border ${small ? 'px-1.5' : 'px-2.5 py-0.5'} ${c}`}
    >
      <span className={`font-label font-bold ${small ? 'text-[9px]' : 'text-[11px]'}`}>
        {label}
      </span>
      <span className={`font-display font-black text-white ${small ? 'text-sm' : 'text-xl'}`}>
        {value}
      </span>
    </span>
  )
}

/** Uma bolinha por ponto de energia: específicas na cor do tipo, genéricas em cinza. */
function Pips({ cost }: { cost: Cost }) {
  const dots = [
    ...Object.entries(cost.specific).flatMap(([t, n]) => Array<string>(n ?? 0).fill(t)),
    ...Array<string>(cost.generic).fill('generic'),
  ]
  if (!dots.length) return <span className="font-label text-xs font-bold text-muted">0</span>
  return (
    <span className="flex gap-0.5">
      {dots.map((t, i) => (
        <span
          key={i}
          className="size-2.5 rounded-full border-[1.5px] border-[#0b0d14]"
          style={{ background: ENERGY_COLOR[t as keyof typeof ENERGY_COLOR] }}
        />
      ))}
    </span>
  )
}
