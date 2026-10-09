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
