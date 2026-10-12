# Arquitetura

> Os detalhes e o fluxo de trabalho estão em [PROMPT_MESTRE.md](PROMPT_MESTRE.md). Este documento é o resumo técnico.

## Objetivo
Jogo 2D de navegador, desktop-first, sem backend no MVP. O motor de regras é puro, determinístico e independente da UI.

## Stack
- **Agora:** React, TypeScript strict, Vite, Tailwind CSS, Vitest, ESLint, Prettier e GitHub Actions.
- **Quando houver necessidade concreta** (critérios no PROMPT_MESTRE §3):
  - Zustand para estado global da UI;
  - Motion para animações;
  - Dexie/IndexedDB para persistência maior;
  - React Testing Library para testar componentes;
  - Phaser, só se a arena precisar de mais do que DOM e CSS.

## Estrutura (cresce conforme a necessidade)
```text
public/assets/cards/<universe>/<card-id>.webp   # arte de personagem sem texto
public/assets/energies/<type>.webp              # carta de energia pronta
src/engine/      # motor puro; testes *.test.ts ao lado do código
src/data/        # catálogo tipado: cartas, energias, decks fixos
src/features/    # battle/ agora; collection/, deck-builder/, boosters/ depois
src/components/  # UI compartilhada entre features (Card com variantes full/compact/preview)
src/storage/     # localStorage versionado
src/app/         # entrada e layout
```

## Princípios
- Números e regras nunca ficam embutidos na arte dos personagens. As energias são a exceção, porque não têm números.
- **Contrato do motor:** `applyAction(state, action, rng) -> { ok: true, state, events } | { ok: false, error }`.
  - O estado é imutável e serializável em JSON.
  - O RNG tem seed.
  - Não há acesso a React nem a armazenamento.
- **Efeitos:** registro `Record<EffectType, Handler>`, sem `eval`.
- **IDs:** estáveis para cartas, identidades, universos, habilidades e efeitos.
- **Eventos:** registrados em log, para depuração e replay.
- **Persistência:** salva só IDs de inventário e decks, nunca URLs de imagem.
- **Imagens:** carregadas sob demanda, em WebP, com fallback quando não houver imagem.
- **Fora da primeira fase:** PvP, autenticação e monetização.


## Direção futura (registrada em 12/10/2026; fora do MVP)

A arquitetura offline atual **não muda**. Quando PvE e deck builder estiverem testados, avaliar a migração para contas por convite e backend autoritativo, com perfis, papéis `owner`/`tester`/`player`, inventário e carteiras persistentes, amigos, salas e partidas privadas. **Supabase** é uma alternativa a validar, não uma dependência aprovada. O motor TypeScript puro deve ser reutilizado no backend; o cliente envia intenções de ação e só renderiza eventos autorizados, nunca calcula o resultado oficial. Os poderes do Game Master devem ser autorizados no servidor e auditados. A camada visual pode combinar 2D com efeitos 3D, preservando acessibilidade. Ver [Online e Game Master](ONLINE_SOCIAL_GAME_MASTER.md) e [Cartas especiais](CARTAS_ESPECIAIS.md).
