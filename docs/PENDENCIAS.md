# Anime TCG — Pendências e Próximos Passos

**Versão analisada:** Alpha v0.3, com as correções do P0 aplicadas na v0.3.1
**Status:** Pré-produção
**Objetivo:** resolver inconsistências do regulamento, validar o balanceamento e preparar a implementação do MVP.

---

## 🔴 P0 — Pendências críticas (resolvidas na v0.3.1, ver `docs/DECISIONS.md`)

### 1. Balanceamento dos ataques gratuitos de Toji ✅

**Problema:** o RULEBOOK diz que ataques sem custo e sem recarga causam 1× ATQ. O Instinto Assassino causava 1,25× ATQ, tinha 30% de crítico e não exigia energia.

- [x] Definir se Instinto Assassino será uma exceção explícita. **Não será.** Passou a causar 1× ATQ com 30% de crítico, e a tabela agora permite 1 efeito menor em habilidades de custo 0.
- [x] Avaliar a inclusão de recarga. **Não é necessária**, porque o dano esperado (4,6) fica próximo ao do Golpe Básico (4,3).
- [x] Manter a identidade de Toji como personagem independente de energia.
- [ ] Testar seu desempenho contra outros SSR e UR. Depende do motor.

**Arquivos:** `docs/RULEBOOK.md`, `docs/CARD_SCHEMA.md`

### 2. Ordem de resolução e condições de vitória ✅

**Problema:** a resolução de Abalo, passivas e efeitos simultâneos podia gerar situações ambíguas.

- [x] Definir exatamente quando a vitória é verificada. Isso acontece na verificação de estado, depois de cada ação, gatilho, compra ou efeito de turno (RULEBOOK §11).
- [x] Determinar se passivas pendentes são resolvidas após HP chegar a zero. **Não são:** a partida termina na hora e os gatilhos pendentes são descartados.
- [x] Especificar a resolução de derrotas simultâneas. Todas as derrotas e o Abalo são aplicados juntos. Se os dois jogadores ficam com HP ≤ 0, é empate.
- [ ] Criar testes para morte, cura, Abalo e Penetração na mesma sequência. Depende do motor.

**Arquivos:** `docs/RULEBOOK.md`, `docs/DECISIONS.md`

### 3. Mulligan e mão inicial ✅

**Problema:** refazer a compra inicial até sair personagem e energia, dando cartas extras ao adversário, podia desequilibrar decks de 20 cartas.

- [x] Testar a frequência de mãos inválidas. Sem garantia, um deck 8/8/4 teria 10% de mãos inválidas, e um deck 6/10/4 ou 10/6/4 teria 15%.
- [x] Avaliar a limitação de compensações por mulligan. **A compensação foi removida.**
- [x] Considerar uma regra simplificada de mão inicial garantida. **Adotada:** 1 personagem + 1 energia + 3 cartas do topo.
- [x] Definir o comportamento após mulligans consecutivos. Existe só 1 mulligan voluntário, no formato londrino.

**Arquivos:** `docs/RULEBOOK.md`

### 4. Economia de energia e custo de invocação ✅

**Problema:** personagens UR exigem três energias para entrar em campo. Com só uma energia baixada por turno, cartas poderosas poderiam demorar muito para agir.

- [x] Simular os cinco primeiros turnos de diferentes decks. Foram 100 mil simulações com deck 8/8/4: o UR é pagável no turno 3 em 81% a 90% das partidas.
- [x] Avaliar se cada jogador deve começar com uma Energia Universal em campo. **Rejeitado:** o UR passaria a sair no turno 2 e os comuns perderiam espaço.
- [ ] Verificar o impacto do enjoo de invocação. Depende de playtest.
- [x] Testar custos de invocação entre 0 e 3. **Mantidos**, com a curva T1 C/R/SR → T2 SSR → T3 UR.
- [x] Garantir que personagens comuns continuem relevantes. São os únicos que custam 0 e podem ser jogados no turno 1.

**Arquivos:** `docs/RULEBOOK.md`, `docs/DECISIONS.md`

---

## 🟠 P1 — Balanceamento e game design

### 5. Validar os 15 HP do jogador e o Abalo

O dano de Abalo varia conforme a raridade do personagem derrotado.

- [ ] Simular partidas com equipes de diferentes raridades.
- [ ] Verificar se 15 HP são suficientes.
- [ ] Avaliar o impacto de perder múltiplos SSR e UR.
- [ ] Testar combinações de Abalo e Penetração.
- [ ] Estabelecer uma duração-alvo para as partidas.

### 6. Diferenciar as cinco classes

As classes existem conceitualmente, mas algumas ainda precisam de mecânicas exclusivas.

- [ ] Lutador: definir a identidade ofensiva.
- [ ] Tanque: definir proteção, Provocar e resistência.
- [ ] Suporte: definir cura, buffs e utilidade.
- [ ] Controlador: definir condições e manipulação de ações.
- [ ] Invocador: definir mecânicas básicas para o MVP e avançadas para depois.

**Meta:** criar pelo menos dois personagens de teste para cada classe.

### 7. Evitar dependência excessiva da raridade

- [ ] Garantir que cartas comuns tenham utilidade estratégica.
- [ ] Criar passivas e sinergias capazes de compensar atributos inferiores.
- [ ] Avaliar o impacto dos custos de invocação sobre SSR e UR.
- [ ] Impedir que um deck só com cartas de raridade alta seja automaticamente superior.

### 8. Revisar habilidades dos personagens iniciais

**Gojo Satoru**
- [ ] Validar custos e multiplicadores de Azul e Vermelho.
- [ ] Testar Seis Olhos e a redução de custo genérico.
- [ ] Verificar a interação de Vermelho com Penetração.

**Toji Fushiguro**
- [ ] Validar Lança Invertida e Recarga 2.
- [x] Resolver a exceção de Instinto Assassino (ver P0.1).
- [ ] Testar a imunidade da Restrição Celestial.

**Shoko Ieiri**
- [ ] Validar o valor de cura da Técnica Reversa.
- [ ] Testar a passiva Médica de Plantão.
- [ ] Verificar se a cura deixa equipes defensivas resistentes demais.

---

## 🟡 P2 — Implementação técnica

### 9. Criar o catálogo inicial de cartas

- [ ] Criar 20 definições de cartas de teste. *(15 personagens: 3 por universo, os de Naruto, HxH, Bleach e DB como proposta aguardando aprovação; arte pendente, ver `docs/ART_PROMPTS.md`.)*
- [ ] Incluir exemplos das cinco classes.
- [ ] Definir energias, suportes e habilidades.
- [ ] Usar IDs estáveis.
- [ ] Separar artes, textos e atributos.
- [ ] Validar os registros com TypeScript.

### 10. Implementar o motor de combate

- [ ] Criar o estado imutável da partida.
- [ ] Implementar compra, mão, deck e mulligan.
- [ ] Implementar quatro posições de personagens.
- [ ] Implementar invocação e custos.
- [ ] Implementar energias disponíveis e esgotadas.
- [ ] Implementar duas ações por turno.
- [ ] Implementar ataques e multiplicadores.
- [ ] Implementar críticos, Defesa e Escudo.
- [ ] Implementar buffs, debuffs e condições.
- [ ] Implementar Cemitério e Descarte.
- [ ] Implementar Abalo, Penetração e fadiga.
- [ ] Implementar fila de eventos e passivas.
- [ ] Criar testes automatizados com Vitest.

### 11. Desenvolver o primeiro protótipo de batalha

- [ ] Criar dois decks fixos de 20 cartas.
- [ ] Implementar uma arena com quatro posições por jogador.
- [ ] Exibir as energias disponíveis e esgotadas.
- [ ] Exibir mão, deck, Cemitério e Descarte.
- [ ] Criar um adversário com IA baseada em regras.
- [ ] Implementar vitória, derrota e empate.
- [ ] Registrar eventos para depuração.

### 12. Atualizar a documentação técnica

- [ ] Criar uma especificação dos eventos do motor.
- [ ] Documentar a resolução das passivas.
- [ ] Registrar cenários de teste.
- [ ] Atualizar o `CLAUDE.md` quando houver alterações de regras.
- [ ] Manter o `ROADMAP.md` sincronizado com o desenvolvimento.
- [ ] Registrar decisões novas em `docs/DECISIONS.md`.

---

## 🔵 P3 — Visual, coleção e expansão

### 13. Padronizar as artes das cartas

- [ ] Separar as ilustrações das informações das cartas.
- [ ] Corrigir divergências entre atributos antigos e o RULEBOOK v0.3.1.
- [ ] Criar templates dinâmicos por raridade.
- [ ] Integrar os símbolos das cinco classes.
- [ ] Definir tamanhos padronizados para cartas completas e compactas.

### 14. Implementar colecionismo

- [ ] Criar a coleção de personagens.
- [ ] Implementar filtros por universo, classe e raridade.
- [ ] Desenvolver os seis boosters iniciais.
- [x] Definir as probabilidades de raridade (v0.1 + garantia de UR em 40 packs, ver DECISIONS).
- [ ] Implementar moedas fictícias.
- [ ] Registrar cartas repetidas.
- [ ] Salvar o inventário localmente.

### 15. Questões de direitos autorais

- [ ] Definir quais artes poderão ser armazenadas no repositório.
- [ ] Verificar as permissões de distribuição das imagens.
- [ ] Separar recursos de terceiros dos arquivos próprios.
- [ ] Revisar a possibilidade de publicar o jogo.

---

## Ordem recomendada de execução

| Etapa | Entrega | Prioridade |
|---|---|---|
| 1 | ~~Resolver inconsistências do RULEBOOK~~ ✅ v0.3.1 | P0 |
| 2 | Criar 20 cartas de teste | P1 |
| 3 | Implementar o motor de regras com testes | P1 |
| 4 | Criar a batalha PvE funcional | P1 |
| 5 | Fazer testes de balanceamento | P1 |
| 6 | Criar a coleção e o deck builder | P2 |
| 7 | Implementar boosters e inventário | P2 |
| 8 | Adicionar artes, efeitos e animações | P3 |
| 9 | Publicar a versão Alpha | P3 |

---

## Critérios para concluir a Alpha 0.4

A próxima versão estará pronta quando:

- [ ] Dois decks de 20 cartas conseguirem disputar uma partida completa.
- [ ] Todas as ações forem validadas pelo motor.
- [ ] Os custos de energia forem calculados corretamente.
- [ ] Cemitério, Descarte e Abalo funcionarem.
- [ ] O sistema identificar vitória, derrota e empate.
- [ ] Os testes automatizados essenciais passarem.
- [x] Nenhuma inconsistência crítica conhecida permanecer no regulamento.

**Observação:** os valores numéricos da v0.3.1 são hipóteses iniciais de balanceamento e não devem ser considerados definitivos antes dos primeiros playtests.

---

## Instruções para o Claude

1. Leia `README.md`, `docs/DECISIONS.md` e `docs/RULEBOOK.md`.
2. Consulte este documento antes de implementar novas mecânicas.
3. Não altere decisões confirmadas sem aprovação.
4. Resolva prioritariamente os itens P0.
5. Faça alterações incrementais com testes automatizados.
6. Atualize o roadmap ao concluir tarefas.
7. Informe claramente o que foi implementado, o que foi testado e o que continua pendente.

**Próxima tarefa recomendada:** com o P0 resolvido, criar as 20 cartas de teste e o motor de uma partida PvE com decks fixos.
