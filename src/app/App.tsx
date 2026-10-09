import { useState, type ReactNode } from 'react'
import { Card } from '../components/Card'
import { CHARACTERS, ENERGIES } from '../data/cards'
import { PackOpening } from '../features/boosters/PackOpening'

// ponytail: troca de tela por estado; vira rota quando houver as 4 abas da v3.
type Screen = 'catalog' | 'pack'

export function App() {
  const [screen, setScreen] = useState<Screen>('pack')
  return (
    <>
      <nav className="flex h-16 items-center gap-6 border-b border-gold/20 bg-ink/70 px-8">
        <span className="font-display text-xl font-black text-gold-metal">Anime TCG</span>
        {(
          [
            ['pack', 'Abrir pack'],
            ['catalog', 'Catálogo'],
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
      </nav>
      {screen === 'pack' ? <PackOpening /> : <Catalog />}
    </>
  )
}

function Catalog() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <Section title="Personagens">
        <div className="flex flex-wrap gap-8">
          {CHARACTERS.map((c) => (
            <Card key={c.id} card={c} variant="full" className="w-[340px]" />
          ))}
        </div>
      </Section>

      <Section title="Compactas (arena e mão)">
        <div className="flex flex-wrap gap-4">
          {CHARACTERS.map((c) => (
            <Card key={c.id} card={c} className="w-[150px]" />
          ))}
        </div>
      </Section>

      <Section title="Energias">
        <div className="flex flex-wrap gap-4">
          {ENERGIES.map((e) => (
            <Card key={e.id} card={e} className="w-[150px]" />
          ))}
        </div>
      </Section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-label text-sm font-bold tracking-[0.2em] text-gold-dim uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}
