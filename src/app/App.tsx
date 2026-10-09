import type { ReactNode } from 'react'
import { Card } from '../components/Card'
import { CHARACTERS, ENERGIES } from '../data/cards'

// Etapa B: vitrine do catálogo. As telas da v3 (Figma) entram nas próximas etapas.
export function App() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <header>
        <h1 className="font-display text-3xl font-black text-gold-metal">Anime TCG</h1>
        <p className="font-label tracking-[0.2em] text-muted uppercase">Catálogo · protótipo 0.1</p>
      </header>

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
