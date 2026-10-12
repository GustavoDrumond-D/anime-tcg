import type { PackDef, PackSlot } from '../../engine/packs'
import { CATALOG } from '../../data/cards'
import { PITY_LR } from '../../data/packs'
import { chanceAtLeastOne, expectedPacksPerUR, guaranteeRarity, hasLR } from '../../engine/packs'

const pct = (n: number) => `${Math.round(n * 1000) / 10}%`.replace('.', ',')

function describe(s: PackSlot, energyName: string): [string, string] {
  if (s.kind === 'energy')
    return [
      'Energia',
      `${energyName} ${100 - s.universalChance}% · Universal ${s.universalChance}%`,
    ]
  const odds = Object.entries(s.odds).map(([r, n]) => `${r} ${n}%`)
  return [s.odds.UR ? 'Slot raro' : 'Personagem', odds.join(' · ')]
}

/** Chances do pack geradas a partir dos dados (nunca texto fixo divergente). */
export function OddsPanel({
  pack,
  energyName,
  pity,
  sinceUR,
  sinceLR = 0,
}: {
  pack: PackDef
  energyName: string
  pity: number
  sinceUR: number
  sinceLR?: number
}) {
  // Agrupa posições consecutivas iguais: "1–2", "3–4", "5".
  const rows: { from: number; to: number; slot: PackSlot }[] = []
  pack.slots.forEach((slot, i) => {
    const last = rows[rows.length - 1]
    if (last && JSON.stringify(last.slot) === JSON.stringify(slot)) last.to = i + 1
    else rows.push({ from: i + 1, to: i + 1, slot })
  })
  const guarantee = guaranteeRarity(pack, CATALOG)
  const lr = hasLR(pack, CATALOG)
  const ur = chanceAtLeastOne(pack, 'UR')
  const ssr = chanceAtLeastOne(pack, 'SSR')
  return (
    <aside className="w-[320px] rounded-xl border border-gold/40 bg-ink/90 p-4 text-left backdrop-blur">
      <p className="font-label text-xs font-bold tracking-[0.2em] text-gold-dim">CHANCES · v0.1</p>
      <div className="mt-3 flex gap-3">
        <Big label="UR por pack" value={pct(ur)} cls="text-holo" />
        <Big label="SSR por pack" value={pct(ssr)} cls="text-gold-metal" />
      </div>
      <p className="mt-2 text-xs text-muted">
        Em média: 1 UR a cada {Math.round(expectedPacksPerUR(ur, pity))} packs (com garantia) · 1
        SSR ou melhor a cada {Math.round(1 / (ur + ssr))}.
      </p>
      <p className="mt-2 rounded-md border border-line bg-panel px-3 py-2 text-xs text-parchment">
        <span className="font-label font-bold tracking-wider text-gold-light uppercase">
          Garantia:
        </span>{' '}
        {guarantee ? (
          <>
            no máximo {pity} packs sem {guarantee}
            {guarantee !== 'UR' && ' (este universo ainda não tem UR)'}. Faltam{' '}
            <b>{pity - sinceUR}</b>.
          </>
        ) : (
          'este universo ainda não tem personagens de booster.'
        )}
      </p>
      {lr && (
        <p className="mt-2 rounded-md border border-line bg-panel px-3 py-2 text-xs text-parchment">
          <span className="font-label font-bold tracking-wider text-lr uppercase">
            LR {pct(chanceAtLeastOne(pack, 'LR'))}:
          </span>{' '}
          no máximo {PITY_LR} packs sem LR. Faltam <b>{PITY_LR - sinceLR}</b>.
        </p>
      )}
      <ul className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
        {rows.map(({ from, to, slot }) => {
          const [title, odds] = describe(slot, energyName)
          return (
            <li key={from} className="text-xs">
              <span className="font-label font-bold tracking-wider text-parchment uppercase">
                {from === to ? `Carta ${from}` : `Cartas ${from}–${to}`} · {title}
              </span>
              <span className="block text-muted">{odds}</span>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-[11px] text-muted/70">
        O catálogo ainda não tem personagens C e R: essas posições viram energia por enquanto.
      </p>
    </aside>
  )
}

function Big({ label, value, cls }: { label: string; value: string; cls: string }) {
  return (
    <div className="flex-1 rounded-lg border border-line bg-panel px-3 py-2">
      <p className={`font-display text-2xl font-black ${cls}`}>{value}</p>
      <p className="font-label text-[10px] tracking-[0.15em] text-muted uppercase">{label}</p>
    </div>
  )
}
