# Anime TCG — Multiverse Card Game

> Card game colecionável de navegador, com personagens de diferentes universos de anime, boosters, construção de decks e combate tático por turnos.

**Estado:** protótipo 0.1. Já funcionam a loja de boosters, a abertura de packs, os Fragmentos e a coleção. **O motor de combate ainda não foi implementado.** Regras de combate: v0.3.1. Veja o andamento no [ROADMAP](ROADMAP.md).

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

- **Lutador:** dano e ofensiva (Gojo, Toji, Naruto, Sasuke, Gon, Ichigo, Goku, Kuririn).
- **Tanque:** proteção e interceptação (Piccolo).
- **Suporte:** cura, escudos e limpeza de condições (Shoko, Sakura, Orihime).
- **Controlador:** debuffs e condições (Kakashi, Killua, Hisoka, Rukia).
- **Invocador:** unidades auxiliares (só depois do MVP).

## Energias

Universal (custo genérico), Amaldiçoada (Jujutsu Kaisen), Chakra (Naruto), Nen (Hunter x Hunter), Reiatsu (Bleach), Ki (Dragon Ball), Ego (Blue Lock), Haki (One Piece) e Stand (JoJo). Energias especializadas também pagam custos genéricos; a Universal não substitui exigências específicas. Energias pagas ficam esgotadas até o próximo turno do controlador.

## Boosters e economia

São nove packs: Multiverso, Jujutsu Kaisen, Naruto, Hunter x Hunter, Bleach, Dragon Ball, Blue Lock, One Piece e JoJo’s Bizarre Adventure.

**Composição de um pack (5 cartas):**
- 2 energias;
- 2 personagens comuns (C ou R);
- 1 posição rara: R 50% · SR 35% · SSR 12% · UR 3%.

**Garantia:** você recebe um UR em no máximo 20 packs. A conta é separada por tipo de pack.

**Economia em Fragmentos ◆:**
- você começa com 1.000 Fragmentos e 3 packs grátis;
- cada pack custa 100;
- dá para vender cartas, e "Vender repetidas" preserva o que o deck usa.

Não há monetização real planejada. Os detalhes estão em [DECISIONS](docs/DECISIONS.md).

## Personagens

A expansão [JoJo e Steel Ball Run](docs/JOJO.md) adiciona 20 personagens colecionáveis, com energia Stand e booster próprio. Habilidades são dados para exibição; combate continua fora do escopo atual.

### Catálogo base

| Universo | Cartas |
|---|---|
| Jujutsu Kaisen | Gojo (UR), Toji (SSR), Shoko (SR) |
| Naruto (fase criança) | Kakashi (UR), Naruto (SSR), Sasuke (SSR), Sakura (C) |
| Hunter x Hunter | Hisoka (UR), Gon (SSR), Killua (SSR) |
| Bleach | Ichigo (SSR), Rukia (R), Orihime (C) |
| Dragon Ball | Goku (UR), Piccolo (SSR), Kuririn (C) |

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

No modo de desenvolvimento (`npm run dev`), a barra do topo tem botões **DEV**: adicionar Fragmentos e resetar o perfil. Eles são removidos automaticamente do build de produção.

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


## Evolução planejada: LR, EX, amigos e painel DEV

Além da Alpha offline, o projeto está planejando **cartas LR** (como duas versões de Michael Kaiser) e uma raridade superior **EX** (Imu-sama, Invocador/Necromante, com a mecânica Domínio Reversi). Também há propostas de edições DEV/ALPHA TESTER, recompensa por logins, lista de amigos, partidas online privadas, contas por convite e painel Game Master com concessão de cartas/Fragmentos e trilha de auditoria.

**Essas funcionalidades ainda não foram implementadas.** A prioridade permanece o motor PvE e o deck builder; números e mecânicas especiais exigem testes e aprovação. Consulte [Cartas especiais](docs/CARTAS_ESPECIAIS.md), [Online e Game Master](docs/ONLINE_SOCIAL_GAME_MASTER.md) e [Roadmap](ROADMAP.md).

**Escopo de distribuição:** jogo de fã, gratuito e não comercial, para convidados e amigos; acesso privado não substitui a necessidade de respeitar os direitos dos titulares das franquias.

## Expansão planejada — LR, EX e multiplayer privado (12/10/2026)

O jogo continua **gratuito, não comercial e de acesso restrito a amigos convidados**. Foram documentadas propostas de raridades **LR** e **EX**, duas versões LR do Michael Kaiser, **Imu-sama EX** com o **Domínio Reversi** (cópias de inimigos derrotados com metade dos atributos) e um protótipo visual LR de Loki. Isso **ainda não faz parte do catálogo implementado** nem dos boosters atuais.

Há também uma visão futura para **contas, tags DEV/ALPHA TESTER/PLAYER, lista de amigos, partidas PvP online privadas, painel Game Master e concessão administrativa de cartas/Fragmentos**. A solução continuará no navegador, com interface 2D e efeitos híbridos 2D/3D quando apropriado. Backend e multiplayer ainda **não foram implementados**.

- [Cartas especiais e raridades LR/EX](docs/CARTAS_ESPECIAIS.md)
- [Propostas de cartas em JSON (não executáveis)](docs/cards-special-proposals.json)
- [Contas, PvP privado e Game Master](docs/ONLINE_SOCIAL_GAME_MASTER.md)
