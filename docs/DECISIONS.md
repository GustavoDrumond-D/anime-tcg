# Decisões, hipóteses e pendências

## Diretrizes confirmadas em conversa
- Jogo de navegador com foco em PvE e colecionismo, inicialmente pessoal e gratuito.
- Sistema híbrido: compra por turno, campo de personagens e energias específicas + genéricas.
- 20 cartas por deck, 4 posições de personagens, 5 cartas iniciais e limite de 7 na mão.
- Cemitério separado do Descarte.
- A arte das cartas fica separada dos textos e dos atributos dinâmicos.
- As regras se baseiam em Magic e Pokémon TCG, adaptadas ao projeto (v0.3).

## Regras fechadas na v0.3 (implementáveis, com números a ajustar em playtest)

| # | Pendência da v0.2 | Decisão | Inspiração e motivo |
|---|---|---|---|
| 1 | Ataque direto e bloqueio | Sem bloqueio. O ataque direto só é permitido com o campo inimigo vazio. O jogador perde HP pelo **Abalo** (Peso da carta derrotada) e por **Penetração** | Prêmios do PTCG e Atropelar do MTG. Na v0.2, com 4 vagas e 1 invocação grátis por turno, o campo quase nunca esvaziava e a partida só terminava por fadiga |
| 2 | Provocar, escudos, Penetração, alcance | Palavras-chave definidas no RULEBOOK §9. **Alcance foi removido**, porque as posições não têm efeito | Palavras-chave do MTG. Menos posições significa motor e IA mais simples |
| 3 | Ataques de 0 energia (Toji) | São permitidos com **Recarga ≥ 2** e dano limitado ao de uma habilidade de 2 energias | Na v0.2 o Toji era melhor que o Gojo em tudo e a energia ficava irrelevante para ele |
| 4 | Energia específica ou genérica nos ataques | As habilidades podem misturar as duas. Recomenda-se custo específico apenas nas habilidades assinatura | Mantém a identidade de cada universo sem travar decks multiverso |
| 5 | Invocar custa ação? | Não custa ação, mas custa **energia genérica conforme a raridade**. Limite de 1 invocação por turno | Custo de mana do MTG. Freia UR/SSR no início da partida e resolve o power creep |
| 6 | Suportes | 1 suporte por turno, sem gastar ação e com o custo de energia da própria carta | Apoiador do PTCG |
| 7 | Energias na mão inicial e mulligan | Energias contam na mão. Uma mão sem personagem ou sem energia é refeita e o oponente compra 1 extra. Há também 1 mulligan voluntário (londrino) | PTCG combinado com MTG |
| 8 | Simultaneidade e reações | Sem reações no MVP. Derrotas são verificadas por estado e acontecem ao mesmo tempo. Gatilhos seguem a ordem APNAP e depois a posição no campo | MTG simplificado, com ordem determinística e testável |
| 9 | Partidas travadas por energia | **Golpe Básico** gratuito para todos, garantia de mão válida e composição com 6 a 10 energias | Um personagem sempre tem o que fazer |
| 10 | Direitos das artes | **Continua pendente**, porque é decisão do dono do projeto | — |

### Outras inconsistências corrigidas
- **Limite de 10 energias em campo**: removido, porque o deck já limita a no máximo 10.
- **Duplicatas**: o limite agora é por identidade (2 por deck, das quais no máximo 1 UR) e vale a regra de identidade única em campo.
- **Escala de dano × HP**: na v0.2, quase todo ataque derrotava um personagem de uma vez (ex.: Gojo causava 10 de dano contra HP 6 a 8). A v0.3 aumentou o HP (8 a 16) e reduziu os multiplicadores, de modo que um personagem cai em cerca de 2 a 3 ações.
- **HP do jogador**: caiu de 20 para 15, porque o Abalo virou a principal fonte de dano.
- **Fases**: Preparação, Suporte e Combate foram fundidas em uma **fase Principal** de ordem livre (MTG). Isso permite jogar um suporte depois de atacar.
- **O primeiro jogador não compra no turno 1** (MTG/PTCG), para compensar a vantagem de começar.

## Correções da v0.3.1 (P0 de `docs/PENDENCIAS.md`)

| # | Pendência | Decisão | Evidência |
|---|---|---|---|
| P0.1 | Instinto Assassino (1,25× grátis) violava o próprio orçamento | Cai para **1× com crítico de 30%**, sem recarga. A tabela agora permite 1 efeito menor em habilidades de custo 0 | Dano esperado de 4,6 contra 4,3 do Golpe Básico: o Toji continua independente de energia sem superar o orçamento |
| P0.2 | Ordem de resolução ambígua | Derrota não é checada durante a resolução dos efeitos. Derrotas e Abalo acontecem juntos. HP do jogador ≤ 0 encerra a partida na hora e descarta os gatilhos pendentes (RULEBOOK §11) | Modelo das ações baseadas em estado do MTG: é determinístico e cabe em testes simples |
| P0.3 | Refazer a mão com compensação desequilibrava | **Mão garantida** (1 personagem + 1 energia + 3 do topo) e 1 mulligan voluntário. A compensação ao oponente foi removida | Sem garantia, um deck 8/8/4 tem 10% de mãos inválidas, e um deck 6/10/4 ou 10/6/4 tem 15% |
| P0.4 | UR demorar a entrar | Custos mantidos (0 a 3) e **sem energia inicial grátis** | Simulação com 100 mil partidas e deck 8/8/4: o UR é pagável no turno 3 em 81% (1º jogador) a 90% (2º jogador) das partidas. Fica a curva T1 C/R/SR → T2 SSR → T3 UR, como no MTG. Com energia inicial o UR sairia no turno 2 (95%) e os comuns perderiam espaço |

## Implementação — protótipo 0.1 (2026-10-09)
- **Design aprovado:** Figma, página "v3 — Estrutura de jogo" (https://www.figma.com/design/S71sihztQneBoWdz6eOgqv/?node-id=15-2). Telas: lobby "Jogar", Arena com playmat, Coleção em fichário, Boosters em carrossel + abertura, Decks com lista em faixas. A navegação tem 4 abas e a Arena abre a partir de "Jogar".
- **Lint:** oxlint, que já vem no template atual do Vite, substitui o ESLint do PROMPT_MESTRE. Cumpre o mesmo papel e roda mais rápido.
- **Fontes:** Cinzel (títulos), Barlow Condensed (rótulos), Inter (texto) e Noto Serif JP (kanji), carregadas via Google Fonts.
- **Assets:** as 14 imagens (2 personagens, 6 energias, 6 packs) foram convertidas para WebP (~3,6 MB) e estão em `public/assets/`, no repositório privado.
- **Orçamento de raridade:** os valores de ATQ e HP da tabela são **tetos**. A Shoko (SR, ATQ 1) fica abaixo do teto, porque é Suporte. Um teste do catálogo valida stats e multiplicadores.

## Chances dos boosters — v0.1 (UR 3% e garantia aprovados em 2026-10-09)
Cada pack tem 5 cartas, e cada posição tem sua própria tabela (o modelo de "slot raro" dos TCGs).

| Posição | Conteúdo |
|---|---|
| Cartas 1 e 2 | Energia: 80% a do universo do pack e 20% Universal |
| Cartas 3 e 4 | Personagem: C 75% · R 25% |
| Carta 5 (slot raro) | R 50% · SR 35% · SSR 12% · UR 3% |

- **Em média:** 1 UR a cada 33 packs e 1 SSR ou melhor a cada 7 packs. Teste com 20 mil packs simulados: `src/engine/packs.test.ts`.
- **Onde ficam:** os dados estão em `src/data/packs.ts` e a lógica pura em `src/engine/packs.ts`, com RNG injetável (`src/engine/rng.ts`).
- **Painel na tela:** o painel "Chances" é gerado a partir desses mesmos dados. Assim, a tela nunca mostra números diferentes dos que o sorteio usa.
- **Catálogo incompleto:** enquanto não houver personagens C e R, essas posições viram energia.
- **Garantia (aprovada):** no máximo **20 packs sem UR**. Começou em 40 e foi reduzida em 2026-10-09.
  - O contador é separado por tipo de pack e zera sempre que sai um UR, mesmo antes da garantia.
  - Fica salvo localmente (`src/storage/local.ts`).
  - O sorteio só acontece no corte, então recarregar a página não consome nem rerrola a garantia.
  - Com a garantia de 20, a média cai para ~15 packs por UR.
- **Em aberto:** garantia também para SSR (ex.: a cada 10 packs) e se as duplicatas viram moeda.

## Economia v0.1 — Fragmentos (aprovada em 2026-10-09)

**Números:**
- **Moeda única:** Fragmentos.
- **Saldo inicial:** 1.000 Fragmentos + 3 packs grátis.
- **Preço do pack:** 100, inclusive o Multiverso. Os packs grátis são usados primeiro.
- **Abrir ×5:** abre cinco packs de uma vez e mostra todas as cartas, com as raras primeiro e a marca "NOVA". A abertura de um pack só tem o botão **Pular**.

**Venda:**
- É manual, carta a carta ou com "Vender repetidas".
- **Valores:** Energia 5 · C 10 · R 20 · SR 40 · SSR 100 · UR 300.
- **Cópias que "Vender repetidas" mantém:** 2 por personagem, 1 de UR e 10 de cada energia.
- **Limite de segurança:** vender um pack inteiro rende em média menos que o preço dele. Isso evita fragmentos infinitos, e um teste em `economy.test.ts` garante a regra.

**Onde fica cada coisa:**
- **Compra:** o sorteio acontece no pagamento (`buyPacks`), e as cartas entram no inventário na hora. Recarregar a página não rerrola nem perde cartas.
- **Perfil** (Fragmentos, inventário e garantia): fica no `localStorage` (`anime-tcg:v1:profile`).

**Recompensas de batalha** (aprovadas, ainda sem implementação porque o motor não existe):
- vitória: +50;
- derrota: +15;
- primeira vitória do dia: +100.

## Considerado e adiado
- **Energia Universal inicial em campo**: acelera demais a partida (ver P0.4). Reavaliar se o playtest mostrar começos lentos.
- **Fraqueza e resistência (PTCG)**: um triângulo entre classes ou universos parece arbitrário entre franquias. Pode ser reavaliado depois do playtest.
- **Bloqueio e combate do MTG**: exige decisões do oponente durante o turno ativo e complica a IA. O Provocar cobre a parte de proteção.
- **Evolução (PTCG)**: pode servir como mecânica de “versão desperta” de um personagem, depois do MVP.
- **Pilha e respostas instantâneas (MTG)**: ficam fora do MVP.

## Hipóteses numéricas a validar em playtest
- HP do jogador 15, Pesos de 2 a 4, crítico de 15% com ×1,5.
- A tabela de raridade e o orçamento de multiplicadores (RULEBOOK §10).
- Custos de invocação de 0 a 3.
- Dano de Envenenado igual a 2.
- Passiva da Shoko (cura em área de 1 por turno).
- O Toji ser Imune a condições pode ser forte demais.

## Alterações importantes
Ao alterar regras, sempre atualizar esta página e `docs/RULEBOOK.md`, registrando os motivos e os testes de balanceamento. Uma ideia anterior não é definitiva só porque foi discutida.
