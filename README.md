# Anime TCG — Multiverse Card Game

> Card game colecionável de navegador, com personagens de diferentes universos de anime, boosters, construção de decks e combate tático por turnos.

**Estado:** Pré-produção / regras v0.3.1 fechadas para protótipo. Protótipo 0.1: projeto configurado, catálogo tipado e carta dinâmica. **O motor de combate ainda não foi implementado.**

## Visão

Misturar o colecionismo e leitura acessível de Pokémon TCG, zonas de Yu-Gi-Oh! e efeitos estratégicos de Magic, sem copiar integralmente nenhuma dessas regras. A identidade dos personagens deve ser refletida em suas classes, técnicas e passivas. Projeto inicialmente pessoal, gratuito e PvE.

## Mecânicas-base da Alpha (v0.3.1)

| Parâmetro | Valor inicial |
|---|---|
| Deck | 20 cartas: 6–10 personagens, 6–10 energias, 0–4 suportes (sugestão 8/8/4) |
| Mão | 5 cartas iniciais com garantia de personagem + energia; compra 1/turno; máximo 7 |
| Campo | 4 personagens por jogador |
| HP do jogador | 15 |
| Turno | 1 energia, 1 invocação (custa energia por raridade), 1 suporte, 2 ações |
| Energia | Reserva compartilhada, disponível/esgotada; custos específico + genérico |
| Vitória | HP adversário a zero, via Abalo (personagem derrotado), Penetração, ataque direto com campo vazio e fadiga |

Regras inspiradas em Magic e Pokémon TCG e adaptadas ao projeto. **Os números são hipóteses de balanceamento.** Veja as [regras](docs/RULEBOOK.md) e as [decisões](docs/DECISIONS.md).

## Classes

- **Lutador:** dano e ofensiva (Gojo, Toji).
- **Tanque:** proteção e interceptação.
- **Suporte:** cura e buffs (Shoko Ieiri).
- **Controlador:** debuffs e condições.
- **Invocador:** unidades auxiliares.

## Energias

Universal (custo genérico), Amaldiçoada (Jujutsu Kaisen), Chakra (Naruto), Nen (Hunter x Hunter), Reiatsu (Bleach) e Ki (Dragon Ball). Energias especializadas também pagam custos genéricos; a Universal não substitui exigências específicas. Energias pagas ficam esgotadas até o próximo turno do controlador.

## Boosters

Seis packs planejados: Multiverso, Jujutsu Kaisen, Naruto, Hunter x Hunter, Bleach e Dragon Ball. Cada pack contém 5 cartas; probabilidades e composição ainda sujeitas a teste. Não há monetização real planejada.

## Tecnologia sugerida

- React + TypeScript + Vite
- Tailwind CSS e Motion para interface e animações
- Zustand para estado de UI, Dexie/IndexedDB para persistência local
- Motor de regras em TypeScript puro, separado dos componentes React
- Vitest para testes determinísticos das regras
- Vercel para publicação estática

## Rodando

```bash
npm install
npm run dev     # app em http://localhost:5173
npm run check   # lint + formatação + tipos + testes + build (o mesmo da CI)
```

## Documentação

- [Roadmap](ROADMAP.md)
- [Livro de regras provisório](docs/RULEBOOK.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Modelo de dados](docs/CARD_SCHEMA.md)
- [Decisões e dúvidas](docs/DECISIONS.md)
- [Instruções ao Claude](CLAUDE.md)

## Início do desenvolvimento

1. Escrever testes para o motor de combate a partir do RULEBOOK v0.3.1.
2. Inicializar Vite + React + TypeScript e o catálogo de cartas.
3. Implementar primeiro o ciclo coleção → booster → deck → PvE.
4. Usar assets locais devidamente autorizados; renderizar estatísticas e textos dinamicamente.

## Direitos autorais

Personagens, nomes, símbolos e demais elementos das franquias pertencem aos respectivos titulares. Este é um projeto de fã, não oficial, sem afiliação com essas franquias. Evitar redistribuir artes protegidas sem autorização e reavaliar licenças antes de publicar assets, especialmente em um repositório público.
