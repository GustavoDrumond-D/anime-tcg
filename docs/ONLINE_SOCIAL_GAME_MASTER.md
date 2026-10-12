# Visão de contas, amigos, PvP privado e Game Master

> **Planejamento / não implementado (12/10/2026).** O projeto continua sendo um TCG de navegador, **gratuito, não comercial e de acesso limitado a amigos convidados**. O protótipo atual roda localmente com perfil em `localStorage` e ainda não possui servidor/autenticação/PvP. A prioridade imediata continua sendo um motor de combate PvE sólido.

## Experiência desejada

- Interface predominantemente **2D**, sem necessidade de mundo 3D; animações híbridas 2D/3D opcionais para cartas, boosters e batalhas.
- Jogabilidade completa pelo navegador no computador ou celular.
- Perfis com nome, avatar, selo visual, inventário, Fragmentos e decks; lista de amigos com convite/aceite.
- Salas privadas por código ou convite de amigo, escolha de deck, indicação de “pronto”, partida por turnos, resultados e possibilidade de reconexão.
- Conteúdo não monetizado nem divulgado amplamente; acesso autorizado explicitamente pelo dono do projeto.

## Papéis, tags visuais e permissões de verdade

**Não confundir tag de perfil com autorização.**

| Role interna (RBAC) | Tag sugerida | Quem é | Permissões |
|---|---|---|---|
| `owner` | DEV | Dono do jogo | Tudo que o GM autorizado pode fazer, inclusive distribuir qualquer carta, alterar Fragmentos, liberar/revogar convites, delegar funções e consultar auditoria |
| `game_master` (opcional) | GM | Moderador delegado | Gestão de recompensas/eventos e suporte aos usuários, dentro de escopos concedidos |
| `tester` | ALPHA TESTER | Jogador do teste | Jogar, gerenciar coleção própria, testar builds e, se habilitado, enviar feedback; **sem privilégios de inventário** |
| `player` | PLAYER | Convidado comum | Jogar, abrir packs, montar deck, adicionar amigos, entrar em salas privadas |

A edição visual de uma carta (`dev`, `alpha-tester`) **não concede permissões administrativas**. Um jogador pode exibir o selo “DEV” apenas se uma permissão confiável o autorizar; o cliente jamais decide permissões.

## Painel Game Master — requisitos previstos

O dono pode abrir uma **aba DEV / Game Master** protegida por autenticação e checagem de `owner` **em todas as operações do backend**.

1. **Jogadores:** pesquisar contas por ID/nome, verificar status, papel/tag, suspender acesso, ativar/revogar convites, consultar atividade administrativa.
2. **Carteira:** adicionar ou remover Fragmentos em uma conta, com justificativa, saldo anterior/posterior e confirmação.
3. **Cartas e coleção:** conceder uma carta por `cardId` + `editionId` + quantidade ao próprio dono ou a um usuário/role específica; remover/reverter concessões com registro de auditoria. **Sim, o DEV pode escolher qualquer carta cadastrada**, inclusive Imu EX, sem abrir booster.
4. **Booster/eventos:** conceder packs, criar/ativar evento de login, definir requisitos, datas e recompensas, visualizar distribuição.
5. **Suporte e auditoria:** histórico de concessões e reversões, ID do operador, alvo, motivo, data, `requestId`; nunca editar o banco sem trilha na operação normal.
6. **Ambiente de testes:** ferramenta para dar recursos fictícios no ambiente de desenvolvimento sem afetar contas reais; não confundir com os antigos botões DEV de `npm run dev`.

### Exemplos de operações autorizadas (contratos, não endpoints implementados)

```json
{ "action": "wallet.grant", "targetUserId": "user-123", "amount": 500, "reason": "Teste alpha", "requestId": "unique-op-1" }
```

```json
{ "action": "inventory.grant", "targetUserId": "user-123", "cardId": "one-piece-imu-ex-001", "editionId": "dev", "quantity": 1, "reason": "Recompensa DEV", "requestId": "unique-op-2" }
```

**Regras de segurança:** autorização no servidor em cada chamada, validação do catálogo, transação atômica para saldo/inventário, `requestId` idempotente (evita duplicatas), taxa limite, controle de acesso linha a linha e logs. Não armazenar uma `role` editável em `localStorage` como fonte da verdade. Apenas o backend pode definir `owner` ou `game_master`.

## Esboço de entidades persistidas

- `users` / `profiles`: id, handle, avatar, display_tag, role, invited_by, created_at, status.
- `friendships`: requester_id, addressee_id, status (pending/accepted/blocked), created_at.
- `inventory`: user_id, card_id, edition_id, quantity, acquired_at, source_event_id.
- `wallets` + `wallet_transactions`: saldos e lançamentos auditáveis.
- `decks` / `deck_entries`: dados individuais e validação antes da sala começar.
- `game_rooms`: id/código não previsível, host_id, guest_id, status, expires_at.
- `matches` + `match_actions` / `match_events`: estado canônico, versão sequencial, turnos, ações validadas e log de replay.
- `reward_events`, `daily_logins` e `reward_claims`: progresso diário, janela de evento e concessão de prêmios uma única vez.
- `audit_logs`: operador, operação, alvo, motivo, timestamp, resultado, `request_id`.

Proposta de backend gerenciado: **Supabase (Auth + Postgres + RLS + Realtime + funções de servidor)** e front hospedado estaticamente. **Tecnologia e custos ainda não aprovados.** Os planos gratuitos podem mudar ou ter limites; validar antes do deploy. Opção alternativa: API TypeScript própria + Postgres. Não inserir chaves `service_role` ou credenciais no cliente.

## Contrato de uma partida online

```text
Jogador A --> envia intenção de ação (carta/alvo/turno/versão)
          --> Backend autentica, autoriza e aplica motor TypeScript puro
          --> persiste estado e emite eventos com versão monotônica
          --> Jogador A e B recebem eventos válidos, cada um com visão permitida
          --> ambos executam animações localmente; servidor define o resultado
```

- **Servidor autoritativo:** não aceitar dano, vitória, Fragmentos, RNG, compra ou entrega de carta calculados pelo cliente.
- **Visibilidade:** mão e ordem do deck são dados secretos, inclusive no transporte/Realtime; cada jogador recebe apenas sua visão. Não publicar snapshot completo aos dois usuários.
- **RNG:** gerado/validado no backend e registrado de forma auditável.
- **Recuperação:** reconectar solicita snapshot autorizado + eventos desde `lastSeenVersion`. A animação é local; estado de partida é canônico.
- **Concorrência:** usar versão do estado e idempotência para evitar duas ações no mesmo turno e duplo prêmio.
- **Acesso privado:** convites autorizados e contas aprovadas, não depender só de “URL secreta”.

## Cronograma proposto

1. Finalizar motor de regras e deck builder **offline** com testes.
2. Modelar contas e sincronização de coleção (migrar perfil local somente com consentimento e validação).
3. Criar login por convite, papéis, lista de amigos e painel DEV restrito.
4. Criar salas privadas, partida autoritativa, reconexão e anti-cheat básico.
5. Publicar versão privada e adicionar evento de Imu EX (acesso inicial DEV/ALPHA TESTER, depois 7 logins acumulados).
6. Incrementar animações 2D/3D com versões adaptadas para celulares e `prefers-reduced-motion`.

## Decisões pendentes

- Backend (Supabase ou outro) e custo operacional, após avaliar limites de uso.
- Prazo de acesso antecipado do Imu EX (30 dias sugeridos, ainda não fechado).
- Se os 7 logins são diários em calendário UTC ou no fuso da comunidade; definição de perda/duplicação de dia.
- Como agir quando um amigo sai no meio do duelo (tempo limite/derrota/pausa).
- Permissão de moderadores delegados, limites diários de concessão e reversão.
- Direitos sobre imagens/personagens: projeto privado e sem monetização **não equivalem automaticamente a licença de uso ou redistribuição**.
