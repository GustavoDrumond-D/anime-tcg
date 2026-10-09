# Arquitetura proposta

## Objetivo
Jogo 2D desktop-first em navegador; sem backend no MVP. Motor de regras independente da UI, testável e determinístico.

## Stack
React, TypeScript, Vite, Tailwind CSS, Motion, Zustand, Dexie (IndexedDB) e Vitest. Phaser somente se a arena precisar de renderização 2D além do DOM/CSS.

## Organização futura
```text
public/assets/cards/<universe>/<card-id>.webp
public/assets/energies/<type>.webp
public/assets/packs/<pack-id>.webp
src/data/cards/
src/data/packs/
src/engine/{state,actions,effects,phases,selectors}/
src/components/{cards,arena,collection,boosters,decks}/
src/features/{collection,pack-opening,deck-builder,battle}/
src/storage/
src/styles/
```

## Princípios
- Não embutir números/regras na imagem da carta; dados estruturados e arte independentes.
- Uma mesma entidade tem renderização completa, compacta e miniatura.
- IDs estáveis para cartas, universos, técnicas, classes e efeitos.
- Motor puro (`applyAction(state, action, rng) -> newState + events`) sem acesso a React ou IndexedDB.
- Registro explícito de eventos para debug/replay.
- Persistir inventário/decks, nunca confiar em URLs das imagens como IDs.
- Carregar imagens sob demanda, WebP/AVIF quando possível; fallback sem imagem.
- Não implementar PvP, autenticação ou monetização na primeira fase.
