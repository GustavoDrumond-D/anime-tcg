# Cartas especiais — propostas para a v0.4 (não implementadas)

> Estado: **design em avaliação**. Esta página documenta as ideias discutidas em 12/10/2026; não altera o motor nem a tabela oficial da Alpha v0.3.1. Consulte `RULEBOOK.md` para as regras atualmente implementáveis. Os números abaixo precisam de playtest.

## Hierarquia e acesso

- Raridades atuais: C → R → SR → SSR → UR.
- Raridades **propostas**, acima de UR: **LR (Legendary Rare)** → **EX (Exclusive)**.
- A **EX** fica acima de LR e terá **pouquíssimas identidades** no jogo; Imu-sama é a primeira candidata.
- `rarity` (orçamento de poder) e `edition` (origem/visual: `standard`, `dev`, `alpha-tester`, `first-edition`, `event`) são dimensões distintas.
- Edições DEV/TESTER do mesmo personagem mantêm os **mesmos atributos e efeitos** da edição pública: exclusividade estética e histórica, não poder de combate adicional.
- Hipótese de orçamento: **LR** ATQ máximo 5, HP máximo 18, invocação 4 genéricas, Peso 5; **EX** ATQ máximo 6, HP máximo 20, invocação 4 genéricas, Peso 5. A EX se distingue mais por sua mecânica exclusiva do que por stats.
- Hipótese para decks: até 1 EX **ou** 1 LR por deck (uma carta de raridade suprema no total), preservando as demais limitações; sujeito a teste. A identidade única em campo continua válida.

## Kaiser LR — duas versões alternativas

Ambas têm identidade `michael-kaiser`, universo **Blue Lock** (novo universo, ainda não cadastrado), ATQ **5**, HP **18**, classe e habilidade próprias. Como ainda não há energia de Blue Lock, usam apenas custos genéricos. As duas **não podem coexistir em campo**; um deck respeita o limite total de identidade e de raridade suprema.

### 1. Michael Kaiser — Imperador das Rosas (LR, Controlador)

- **Stats:** ATQ 5 · HP 18 · invocação 4 · Abalo 5.
- **Leitura Imperial:** 2 genéricas, 1,5× ATQ (**7** antes de crítico/defesas); aplica -1 ATQ ao alvo até o fim do próximo turno de seu controlador. **Recarga 1 sugerida** por acumular dano + debuff.
- **Rosa do Imperador:** 3 genéricas, 2× ATQ (**10**); aplica **Selado** conforme a duração padrão do RULEBOOK. **Recarga 2**.
- **Passiva — Metavision:** a primeira habilidade de Kaiser por turno custa 1 genérica a menos **se o alvo já tiver um debuff ou condição negativa**. Nunca reduz custo específico nem abaixo de zero.
- **Perfil:** leitura do oponente, controle e sinergias com condições.

### 2. Michael Kaiser — Kaiser Impact (LR, Lutador)

- **Stats:** ATQ 5 · HP 18 · invocação 4 · Abalo 5.
- **Kaiser Impact:** 2 genéricas, 2× ATQ (**10**); ataque de alvo único normal, sem ignorar Defesa/Escudo.
- **Kaiser Impact: Magnus:** 4 genéricas, 2,5× ATQ (**12**), **Penetração**, **Recarga 2**. Excedente ao derrotar é aplicado ao HP do dono do alvo.
- **Passiva — Instinto de Finalização:** uma vez por turno, quando Kaiser derrota um personagem inimigo com uma habilidade, restaura **1 energia genérica esgotada da reserva**. Não gera ação extra.
- **Perfil:** explosão de dano e finalização; avaliar cuidadosamente a Penetração contra jogador de 15 HP.

Arte da versão **Kaiser Impact** incorporada em `public/assets/cards/blue-lock/blue-lock-kaiser-lr-impact-001.webp` (900×1200, sem texto/stats). A versão **Imperador das Rosas** ainda não tem arte no repositório. Os atributos devem ser renderizados dinamicamente pela UI, não gravados na arte.

## Imu-sama EX — O Soberano do Mundo

- **Universo:** One Piece (ainda não cadastrado na enum de universos nem nos boosters).
- **Arte:** `public/assets/cards/one-piece/one-piece-imu-ex-001.webp` (edição standard; variantes DEV/TESTER pendentes).
- **Identidade:** `imu-sama`. **Raridade EX**, classe **Invocador**, arquétipo **Necromante**.
- **Stats propostos:** ATQ **6** · HP **20** · invocação **4** genéricas · Abalo **5**.
- **Decreto do Soberano:** 2 energias genéricas, 1,5× ATQ = **9** de dano; aplica **Marca Reversi** (marcação narrativa/de sinergia, duração até fim do próximo turno do controlador do alvo; handler ainda inexistente).
- **Julgamento do Trono Vazio:** 4 genéricas, 2× ATQ = **12** de dano, **Perfurante**, **Recarga 2**.
- **Passiva EX — Domínio Reversi (mecânica nuclear):** **sempre que Imu derrotar diretamente um inimigo**, gera uma **cópia corrompida** desse personagem que passa a pertencer ao jogador de Imu, com **metade do ATQ e metade do HP base originais**, arredondados para baixo (mínimo 1). O inimigo original segue para o Cemitério do dono; nenhuma carta real muda permanentemente de coleção.
- **Proposta inicial fiel à ideia de deck:** a cópia corrompida temporária é **embaralhada no deck do portador de Imu durante a partida** (deck inicial continua tendo 20 cartas), não enviada diretamente à mão. Ao ser comprada, pode ser invocada usando a invocação normal do turno, respeitando o limite de quatro vagas e o custo provisório de **1 energia genérica**.
- **Limites provisórios de balanceamento:** no máximo **2 corrompidos criados por partida**; cópias mantêm nome/arte e Golpe Básico, mas **não herdam habilidades nem passivas**; Peso provisório 1 quando derrotadas; não desencadeiam novas conversões. A cópia deixa de existir ao fim da partida. Imu precisa ter causado o golpe que derrotou o alvo; derrotas por aliados/veneno não contam.
- **Resolução:** derrotas e Abalo são processados normalmente; se o HP de um jogador chegar a zero, a partida termina antes de criar a cópia. A geração só ocorre como gatilho posterior à checagem de vitória.
- **Ponto em aberto:** deck embaralhado (pedido original) **versus** zona especial “Domínio Reversi” (alternativa discutida). **O protótipo adota deck** até nova decisão do criador; a zona especial permanece alternativa, não regra aprovada.
- **Outros testes necessários:** limite 2 pode ser pouco/alto; se cópias podem sofrer crítico; o que fazer com identidade de personagem já no campo, mão ou deck; cópias derrotadas, Abalo, efeito em partida PvP e possíveis loops.

### Distribuição de Imu — edição exclusiva e recompensa futura

- **DEV:** acesso antecipado à edição Imu EX DEV.
- **ALPHA TESTER:** acesso antecipado à edição Imu EX ALPHA TESTER.
- **Público convidado:** depois de um período sugerido de **30 dias**, habilitar a versão EX normal por **7 dias de login acumulados**, sem exigir consecutividade, concedida **uma única vez por conta**.
- Os três têm **efeito e stats idênticos**; selo, moldura, variante de arte, origem, data e eventual número de série diferenciam as edições.
- Nenhuma EX aparece nas probabilidades atuais dos boosters: distribuição por **concessão administrativa/evento**, com política de obtenção a decidir.
- A validação do login diário, prêmios e contadores deve ser feita **no servidor**, com idempotência e trilha de auditoria, não no `localStorage`.

## Loki — Gigante do Ragnarok (LR, One Piece)

- **Conceito visual:** carta LR de Loki com moldura épica e tema trovão/Ragnarok.
- **Arte:** `public/assets/cards/one-piece/one-piece-loki-lr-001.webp` (id `one-piece-loki-lr-001`).
- **Status dos números/ataques/passivas:** **não aprovados**. Antes de cadastrar em `src/data/`, definir ATQ/HP dentro do teto LR, classe, habilidades, custo, recarga e testes.
- **Atenção à arte:** manter personagem e moldura do protótipo, renderizar logo LR inteiro sem corte e sobrepor textos/stats da versão oficial do jogo.

## Impacto técnico / compatibilidade

1. **Atualizado em 12/10/2026:** `Rarity` inclui LR/EX e `Universe` inclui Blue Lock/One Piece; Kaiser Impact, Imu EX e Loki LR estão em `src/data/characters/`. As passivas especiais ainda não têm handler (não há motor de combate).
2. Introduzir LR/EX exigirá atualizar `Rarity`, `RARITY`, limites de deck, catálogo, renderização e testes existentes.
3. Introduzir Imu exigirá handlers determinísticos para derrota atribuída, geração de cópia temporária, transferência de controlador, inserção em deck e descarte da cópia ao terminar a partida.
4. Regras de invocação auxiliar previstas para depois do MVP **não são equivalentes** aos corrompidos embaralhados em deck.
5. Não alterar as chances atuais de boosters ou o valor das UR sem uma decisão explícita e testes.

## Aceitação mínima antes de marcar as cartas como implementadas

- [ ] Revisar tabela LR/EX, pesos e dano com playtests.
- [ ] Fechar como o Domínio Reversi opera e seus limites.
- [ ] Adaptar tipos de TypeScript, validação do catálogo e testes.
- [ ] Produzir assets locais autorizados sem stats/textos embutidos. (Kaiser Impact, Imu EX e Loki LR prontos; faltam Kaiser Rosas e variantes DEV/TESTER da Imu.)
- [ ] Testar que variantes da mesma identidade não coexistem no campo.
- [ ] Testar cópias corrompidas: metade de stats, sem loops, sem duplicar acervo e desaparecimento ao fim da partida.
