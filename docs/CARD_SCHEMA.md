# Esquema de cartas — proposta

Exemplo de registro declarativo, alinhado ao RULEBOOK v0.3.1. Não é uma implementação completa.

```json
{
  "id": "jjk-toji-001",
  "type": "character",
  "identity": "toji-fushiguro",
  "name": "Toji Fushiguro",
  "universe": "jujutsu-kaisen",
  "faction": ["zenin"],
  "class": "fighter",
  "rarity": "SSR",
  "stats": { "attack": 4, "hp": 14 },
  "keywords": [],
  "art": "/assets/cards/jujutsu-kaisen/jjk-toji-001.webp",
  "abilities": [
    { "id": "inverted-spear", "name": "Lança Invertida", "cost": { "specific": {}, "generic": 0 }, "multiplier": 2, "cooldown": 2, "keywords": ["piercing"], "effects": [] },
    { "id": "assassin-instinct", "name": "Instinto Assassino", "cost": { "specific": {}, "generic": 0 }, "multiplier": 1, "cooldown": 0, "effects": [{ "type": "critical_chance", "value": 0.3 }] }
  ],
  "passives": [{ "id": "heavenly-restriction", "keywords": ["immune"] }]
}
```

## Regras do esquema
- **IDs e textos**: os IDs ficam em inglês e os textos aparecem em português.
- **Identidade**: `identity` agrupa as versões de um mesmo personagem. É usada no limite de cópias e na regra de identidade única em campo.
- **Valores derivados**: `summonCost` e `weight` (Peso/Abalo) vêm da raridade, pela tabela do RULEBOOK §10. Não ficam gravados na carta; se uma carta precisar de exceção, ela declara um override explícito.
- **Golpe Básico**: é implícito em todo personagem e não aparece em `abilities`.
- **Palavras-chave**: `provoke`, `haste`, `defense`, `shield`, `piercing`, `trample` (Penetração), `immune`. Palavras com valor usam o formato `{ "id": "shield", "value": 3 }`.
- **Sem código dinâmico**: nunca usar `eval` em habilidades. Cada efeito tem um handler tipado, identificado pelo seu ID.
- **Definição × instância**: separar `CardDefinition` (imutável) de `CardInstance`, que guarda HP atual, buffs, condições, recargas, posição e se já agiu no turno.


## Expansão proposta (12/10/2026; não aplicada aos tipos TypeScript)

- Novas raridades **LR** e **EX** e universos **Blue Lock** e **One Piece** estão propostos em [Cartas especiais](CARTAS_ESPECIAIS.md), mas **não** são aceitos por `src/engine/cards.ts` ainda.
- Na futura `CardDefinition`, separar `rarity` de `editionId` (ex.: `standard`, `dev`, `alpha-tester`, `first-edition`); `CardInstance` guarda o estado do combate e cópias temporárias corrompidas.
- Inventário futuro: identificar a variante visual, quantidade, origem, data de concessão e eventual serial, sem criar versões com mais poder para DEV/TESTER.
- O `Domínio Reversi` exigirá evento tipado de derrota atribuída + cópia com 50% ATQ/HP, regras de posse/controle/deck durante **a partida apenas** e prevenção de recursão.
- Exemplo de payloads de design em [cards-special-proposals.json](cards-special-proposals.json); **não importar diretamente como catálogo executável**.
