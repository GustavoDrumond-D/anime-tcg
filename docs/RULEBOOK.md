# Livro de regras — Alpha v0.3

> Regras fechadas para prototipação: o motor pode ser implementado com base nelas. Os **números** (HP, pesos, multiplicadores, custos) continuam sendo hipóteses de balanceamento até haver playtest. As regras inspiradas em Magic (MTG) ou Pokémon TCG (PTCG) estão marcadas, e as adaptações estão explicadas em [DECISIONS](DECISIONS.md).

## 1. Condição de vitória
- Cada jogador começa com **15 HP**.
- Você vence quando o HP do oponente chega a 0. Se os dois chegarem a 0 na mesma verificação, é empate.
- Fontes de dano ao jogador:
  1. **Abalo** *(adaptação dos Prêmios do PTCG)*: quando um personagem seu é derrotado, você perde HP igual ao **Peso** dele (tabela da seção 10).
  2. **Ataque direto**: só é permitido quando o oponente não tem personagens em campo (seção 7).
  3. **Penetração** *(Atropelar do MTG)*: o dano que excede o HP de um personagem derrotado vai para o jogador dono dele.
  4. **Fadiga**: comprar com o deck vazio causa 1, depois 2, depois 3… de dano ao jogador.

## 2. Deck
- Exatamente **20 cartas**.
- Composição obrigatória: **6 a 10 personagens**, **6 a 10 energias** e **0 a 4 suportes**. A sugestão inicial é 8/8/4.
- Cópias:
  - No máximo **2 cartas da mesma identidade** de personagem (ex.: “Gojo Satoru”), somando todas as versões. Dessas, no máximo **1 pode ser UR**.
  - Até 2 cópias de cada suporte.
  - Energias não têm limite de cópias.
- **Identidade única em campo** *(regra de lendários do MTG)*: você não pode ter duas versões da mesma identidade em campo ao mesmo tempo.

## 3. Preparação da partida
1. Embaralhe o deck. Um sorteio define quem começa.
2. Cada jogador compra 5 cartas.
3. **Mão inválida** *(PTCG)*: uma mão sem personagem ou sem energia é revelada, devolvida e embaralhada, e o jogador compra 5 novas. A cada vez que isso acontece, o oponente pode comprar 1 carta extra. Repete até a mão ser válida.
4. **Mulligan voluntário** *(mulligan londrino do MTG, simplificado)*: uma vez por partida, você pode embaralhar a mão no deck e comprar 5 novas. Depois, coloca 1 carta da mão no fundo do deck.
5. O jogador que começa **não compra** no seu primeiro turno.

## 4. Zonas
- **Deck**: cartas ainda não compradas.
- **Mão**: cartas disponíveis. Não tem limite durante o turno; no encerramento, o máximo é 7.
- **Campo**: até 4 personagens. As posições servem só para organização e não têm efeito de regra.
- **Reserva de energias**: cartas de energia em jogo, cada uma *disponível* ou *esgotada*. É compartilhada entre todos os seus personagens.
- **Cemitério**: personagens derrotados.
- **Descarte**: suportes usados, cartas descartadas da mão e energias removidas por efeitos.
- **Exílio** e **Zona auxiliar**: ficam para depois do MVP.

## 5. Estrutura do turno
1. **Início**: restaure todas as suas energias esgotadas. Reduza em 1 as recargas dos seus personagens. Resolva efeitos de “início de turno” e de condições (seção 9).
2. **Compra**: compre 1 carta.
3. **Principal**: faça o que quiser, em qualquer ordem:
   - baixar **1 energia** por turno *(terreno do MTG)*;
   - **invocar 1 personagem** por turno, pagando o custo de invocação da seção 10;
   - jogar **1 suporte** por turno *(Apoiador do PTCG)*, pagando o custo dele;
   - usar até **2 ações** no total. Cada personagem faz no máximo 1 ação por turno.
4. **Encerramento**: resolva efeitos de “fim de turno”, descarte até ficar com 7 cartas na mão e passe a vez.

Regras desta seção:
- Baixar energia, invocar e jogar suporte **não** gastam ação.
- **Enjoo de invocação** *(MTG)*: um personagem não age no turno em que entra, a menos que tenha a palavra-chave *Ímpeto*.

## 6. Energia
- Tipos: **Universal**, **Amaldiçoada**, **Chakra**, **Nen**, **Reiatsu** e **Ki**.
- Cada carta de energia vale 1 ponto.
- O custo tem uma parte específica e uma genérica. Exemplo: `{ specific: { cursed: 2 }, generic: 1 }` exige 2 Amaldiçoadas e mais 1 energia de qualquer tipo.
- A **Universal** só paga a parte genérica. Energias especializadas pagam a parte específica do seu tipo e também a genérica.
- Energias usadas para pagar ficam **esgotadas** até o início do seu próximo turno.
- Não há limite de energias em campo: o próprio deck já limita a no máximo 10.
- Reduções de custo afetam apenas a parte genérica e nunca deixam o custo abaixo de 0.

## 7. Ações e alvos
Toda ação gasta 1 das 2 ações do turno. Os tipos são:
- **Golpe Básico**: todo personagem tem. Custa 0 energia e causa 1× ATQ em um alvo. Garante que ninguém fica travado sem energia.
- **Habilidade**: usa custo, efeitos e recarga declarados na carta.

Alvos:
- Ataques de alvo único escolhem um personagem inimigo.
- Se o oponente **não tem personagens em campo**, o ataque pode ter o jogador como alvo.
- **Provocar**: enquanto algum inimigo tiver Provocar, seus ataques de alvo único precisam escolher um personagem com Provocar. Efeitos de área e efeitos que não são ataque ignoram Provocar.
- Não existe bloqueio nem reação no MVP. Todo o turno é do jogador ativo, sem respostas do oponente.

## 8. Dano
1. **Dano base**: `floor(ATQ × multiplicador)`. O ATQ usado já inclui buffs e debuffs.
2. **Crítico**: 15% de chance de multiplicar o dano por 1,5, arredondando para baixo. Efeitos podem alterar a chance. O sorteio usa o RNG injetado no motor.
3. **Defesa X**: reduz cada instância de dano em X, com mínimo 0.
4. **Escudo X**: absorve até X de dano antes do HP e diminui pelo valor absorvido. Escudos de fontes diferentes não se somam: fica o maior.
5. Aplique o restante ao HP.

Regras gerais de dano:
- **Perfurante** ignora as etapas 3 e 4.
- Cura nunca ultrapassa o HP máximo.
- Dano a jogador ignora Defesa e Escudo de personagens.

## 9. Palavras-chave e condições
Cada habilidade usa uma palavra-chave desta lista ou um handler com ID próprio. Não é permitido texto livre interpretado pelo motor.

| Palavra-chave | Efeito |
|---|---|
| Provocar | Atrai ataques de alvo único (ver seção 7) |
| Ímpeto | Pode agir no turno em que é invocado |
| Defesa X | Reduz em X cada dano recebido |
| Escudo X | Absorve X de dano e se consome |
| Perfurante | O dano ignora Defesa e Escudo |
| Penetração | O dano excedente ao derrotar vai para o jogador |
| Recarga N | Depois de usada, a habilidade fica indisponível por N turnos do controlador |
| Imune | Não pode receber buffs, debuffs nem condições. Cura e dano funcionam normalmente |

**Condições** *(Condições Especiais do PTCG)*:
- Duram até o fim do próximo turno de quem as recebeu.
- A mesma condição não se acumula: reaplicá-la apenas renova a duração.

| Condição | Efeito |
|---|---|
| Atordoado | Não faz ações |
| Envenenado | Sofre 2 de dano no início do turno do dono |
| Selado | Só pode usar o Golpe Básico |

**Buffs e debuffs**: modificam ATQ ou Defesa. Somam-se entre si e duram o que a carta disser. Se não disser nada, duram até o fim do próximo turno do controlador do efeito.

## 10. Tabela de raridade (orçamento de poder)
Esta tabela controla o power creep. Raridades mais altas são mais fortes, mas custam mais para invocar e valem mais Abalo quando derrotadas.

| Raridade | ATQ | HP | Custo de invocação (genérico) | Peso (Abalo) |
|---|---|---|---|---|
| C | 2 | 8 | 0 | 2 |
| R | 2–3 | 10 | 0 | 2 |
| SR | 3 | 12 | 1 | 3 |
| SSR | 4 | 14 | 2 | 3 |
| UR | 4–5 | 16 | 3 | 4 |

Referência de habilidades (dano típico, antes de efeitos extras):

| Custo total | Multiplicador |
|---|---|
| 0 (sem recarga) | 1× (equivale ao Golpe Básico) |
| 1 | 1,5× |
| 2 | 1,75–2× |
| 3+ | 2,5× |
| 0 com recarga | Até o valor de 2 energias, com Recarga ≥ 2 |

Cada efeito extra (Perfurante, condição, cura) custa cerca de 0,25× do multiplicador ou +1 de recarga.

## 11. Resolução e eventos
O motor é orientado a eventos e resolve cada ação nesta ordem:
1. Validar a ação, os alvos (incluindo Provocar) e os custos.
2. Pagar os custos.
3. Aplicar os efeitos na ordem declarada na carta.
4. **Verificação de estado** *(ações baseadas em estado do MTG)*:
   - Todos os personagens com HP ≤ 0 são derrotados **ao mesmo tempo**.
   - Cada um vai para o Cemitério e aplica o Abalo ao dono.
5. **Gatilhos** *(ordem APNAP do MTG)*:
   - Primeiro resolvem os gatilhos do jogador ativo, depois os do oponente.
   - Dentro de cada jogador, a ordem segue as posições do campo, da 1 à 4.
   - Depois de cada gatilho, repete-se a verificação de estado.
6. **Checagem de vitória**: se os dois jogadores estão com HP ≤ 0, é empate.

Todo evento é registrado em log, para depuração e replay.

## 12. Fadiga e reposição
- Comprar com o deck vazio aplica a fadiga progressiva da seção 1. O deck não é reembaralhado.
- Energias permanecem na reserva mesmo quando os personagens são derrotados.

## 13. Invocações auxiliares (pós-MVP)
Proposta, ainda não implementada:
- Até 2 unidades por jogador.
- Não são cartas do deck.
- Atacam usando ações do controlador.
- Somem se o invocador for derrotado.
- Não vão ao Cemitério e não causam Abalo.

## 14. Cartas de exemplo (v0.3)
- **Gojo Satoru**: UR, Lutador, ATQ 4, HP 16, invocação 3, Peso 4.
  - *Azul*: 1 Amaldiçoada + 1 genérica, 1,75× (7 de dano).
  - *Vermelho*: 2 Amaldiçoadas + 1 genérica, 2,5× (10 de dano), com Penetração.
  - *Seis Olhos* (passiva): a primeira habilidade de cada turno custa 1 genérica a menos.
- **Toji Fushiguro**: SSR, Lutador, ATQ 4, HP 14, invocação 2, Peso 3.
  - *Lança Invertida*: 0 energia, 2× (8 de dano), Perfurante, Recarga 2.
  - *Instinto Assassino*: 0 energia, 1,25× (5 de dano), chance de crítico 30%.
  - *Restrição Celestial* (passiva): Imune.
- **Shoko Ieiri**: SR, Suporte, ATQ 1, HP 12, invocação 1, Peso 3.
  - *Técnica Reversa*: 1 Amaldiçoada. Cura 5 de um aliado e remove 1 condição ou debuff dele.
  - *Médica de Plantão* (passiva): no fim do seu turno, se a Shoko não agiu, cura 1 de cada aliado ferido.
