# Roadmap — Anime TCG

Os checkboxes marcam só o que foi efetivamente concluído, não o que foi apenas discutido.

## Estado atual — protótipo 0.1 (2026-10-09)
- **Já jogável no navegador:**
  - loja com 6 boosters em carrossel (arrastar ou usar as setas);
  - abertura de 1 pack (cortar arrastando, revelar, Pular) e de 5 packs (rasgo em grupo, raras em destaque, cascata por raridade);
  - Fragmentos com preço dos packs e venda de cartas;
  - Coleção salva no navegador.
- **Catálogo:** 15 personagens (3 por universo) e 6 energias, todos com arte.
- **Testes:** 23 automatizados, rodando em `npm run check`.
- **Próximos passos:**
  1. Criar personagens C e R para universos que ainda não têm. Hoje, nos packs desses universos, as posições sorteadas como C ou R viram energia.
  2. Começar o motor de batalha (M4).

## M0 — Fundação e regras
- [x] Registrar visão inicial do card game
- [x] Documentar classes, universos e conceitos de energia
- [x] Resolver dúvidas do regulamento em `docs/DECISIONS.md` (v0.3; direitos de arte seguem pendentes)
- [x] Definir regras completas de alvo, bloqueio e ataque direto
- [x] Definir efeito de cartas UR/SSR sem power creep excessivo (tabela de raridade, RULEBOOK §10)
- [x] Criar 20 cartas de teste com dados estruturados e imagens (15 personagens + 6 energias, todas com arte)
- [ ] Personagens C e R para universos sem eles (Jujutsu Kaisen e Hunter x Hunter não têm nenhum)

## M1 — Catálogo e UI
- [x] Inicializar app React/TypeScript/Vite (+ Tailwind, Vitest, oxlint, Prettier, CI)
- [ ] Layout desktop-first responsivo
- [x] Componente `Card` (variantes full e compact; preview quando houver uso)
- [x] Design v3 aprovado como protótipo 0.1 (Figma, página "v3 — Estrutura de jogo")
- [ ] Catálogo filtrável por universo, raridade e classe *(hoje só agrupado por universo)*
- [x] Inventário persistido localmente (perfil no `localStorage`)
- [x] Coleção: cartas que você não tem aparecem apagadas, as que tem mostram contador e venda

## M2 — Boosters
- [x] Catálogo de packs: Multiverso + 5 universos (loja em carrossel)
- [x] Sorteio determinístico testável e probabilidades configuráveis (+ garantia de UR)
- [x] Revelação animada de 5 cartas (corte arrastando, sons, partículas, destaque UR/SSR)
- [x] Abrir ×5 em sequência e botão Pular
- [x] Loja em carrossel com arraste
- [x] Inventário recebe cartas abertas; duplicatas contabilizadas
- [x] Moeda fictícia: Fragmentos (saldo inicial, preço dos packs, packs grátis, venda de cartas)
- [ ] Recompensas de batalha (+50 por vitória, +15 por derrota, +100 pela 1ª vitória do dia): dependem do motor

## M3 — Deck builder
- [ ] Editor de deck de 20 cartas
- [ ] Validação de limites, cópias e tipos
- [ ] Decks salvos localmente
- [ ] Filtro de energia por universos do deck

## M4 — Motor PvE
- [ ] Estado imutável da partida e máquina de fases
- [ ] Compra inicial, mão inválida e mulligan
- [ ] Invocação com custo por raridade e 4 posições
- [ ] Energia disponível/esgotada por tipo
- [ ] Golpe Básico, habilidades, recarga, crítico, cura, buffs, debuffs e condições
- [ ] Palavras-chave (Provocar, Defesa, Escudo, Perfurante, Penetração, Ímpeto, Imune)
- [ ] Abalo, verificação de estado e ordem de gatilhos APNAP
- [ ] Cemitério, descarte e fadiga
- [ ] Passivas e fila de eventos com testes
- [ ] IA simples baseada em heurísticas
- [ ] Tela de resultado e recompensas

## M5 — Polimento
- [x] Holografia SSR/UR (brilho que segue o mouse, destaque em tela cheia)
- [ ] Feedback visual de ataque
- [x] Animações de abertura de packs
- [ ] Acessibilidade: foco, contraste, movimento reduzido *(movimento reduzido já é respeitado)*
- [ ] Testes e tratamento de erros
- [ ] Deploy em Vercel

## Depois do MVP
- [ ] Invocações auxiliares avançadas
- [ ] Eventos e packs temáticos
- [ ] Progressão e missões
- [ ] PWA
- [ ] Avaliar contas/sincronização/PvP apenas após MVP


## M6 — Cartas especiais e raridades superiores (proposta de 12/10/2026)

> **Planejado, não implementado.** Detalhes de atributos, efeitos e aquisição em [Cartas especiais](docs/CARTAS_ESPECIAIS.md); registro estruturado em [JSON de propostas](docs/cards-special-proposals.json).

- [ ] Validar com playtest a hierarquia UR → LR → EX e os custos/Abalo das novas raridades.
- [ ] Criar as **duas versões LR de Michael Kaiser**: *Imperador das Rosas* (Controlador) e *Kaiser Impact* (Lutador).
- [ ] Criar **Imu-sama EX**, Invocador/Necromante: **Domínio Reversi** converte inimigos derrotados por Imu em cópias temporárias com 50% dos stats, embaralhadas no deck do controlador (proposta atual; limites pendentes).
- [ ] Definir carta **Loki LR** de One Piece após balancear ataques e passivas; preservar arte/moldura e deixar o emblema LR totalmente visível.
- [ ] Criar edições `DEV`, `ALPHA TESTER`, `FIRST EDITION` e `EVENT` com variação estética e poder idêntico entre edições da mesma carta.
- [ ] Planejar concessão antecipada de Imu EX para DEV/TESTER e futura recompensa de **7 dias de login acumulados** para convidados, após um período de exclusividade a definir.
- [ ] Adicionar universos Blue Lock e One Piece **somente quando seus catálogos e regras estiverem validados**; não alterar chances dos boosters existentes por antecipação.

## M7 — Contas privadas, amigos, PvP e Game Master (proposta)

> **Planejado, não implementado.** Especificação completa em [Online, social e Game Master](docs/ONLINE_SOCIAL_GAME_MASTER.md). Destino: jogo privado, gratuito, não comercial, acessível a amigos convidados pelo navegador, inclusive celular.

- [ ] Finalizar motor de regras PvE e deck builder offline antes de implementar o multiplayer.
- [ ] Definir autenticação e persistência sincronizada em backend gerenciado (Supabase é candidato, não decisão definitiva).
- [ ] Criar convites de acesso, perfis e tags visuais `DEV`, `ALPHA TESTER`, `PLAYER`, separadas de permissões RBAC no servidor.
- [ ] Criar lista de amigos, convites e salas privadas com código para partidas online.
- [ ] Adotar backend autoritativo para turnos, RNG, energia, efeitos, vitória, coleção e prêmios; não confiar em cálculos do navegador.
- [ ] Criar aba **Game Master** apenas para `owner` autorizado: conceder qualquer carta/edição (incluindo Imu EX), adicionar/remover Fragmentos, dar boosters, editar roles e criar eventos, com audit log e operações idempotentes.
- [ ] Sincronizar estados e eventos por conexão realtime; proteger mão/deck de cada jogador e permitir reconexão.
- [ ] Desenvolver animações 2D/3D híbridas de boosters, habilidades e Domínio Reversi, sem tornar a experiência dependente de um mundo 3D.
- [ ] Rever direitos de arte e limites de acesso antes de publicar a instância privada; não monetizar nem promover como produto licenciado.

## M6 — Expansão planejada: raridades LR/EX e cartas de evento (proposta 12/10/2026)
- [x] Documentar design de Kaiser LR (Imperador das Rosas e Kaiser Impact), Imu-sama EX e conceito visual Loki LR.
- [ ] Aprovar balanceamento, custos, Abalo e limite de LR/EX por deck.
- [ ] Expandir catálogo/engine para LR, EX, One Piece e Blue Lock sem quebrar testes.
- [ ] Implementar Domínio Reversi: corrupção com metade dos atributos e cópia temporária embaralhada no deck; testar limites e casos de borda.
- [ ] Criar variantes de edição DEV, ALPHA TESTER, FIRST EDITION e EVENT, com origem e arte alternativas.
- [ ] Integrar artes aprovadas sem stats embutidos, preservando moldura e legibilidade.
- [ ] Criar evento de Imu EX para DEV/TESTER e futura recompensa pública após 7 logins acumulados.

## M7 — Contas, PvP entre convidados e Game Master (planejado; após motor PvE)
- [x] Documentar arquitetura prevista, papéis, permissões e modelos de dados.
- [ ] Definir e provisionar backend (Supabase é opção, não decisão final).
- [ ] Implementar login por convite, perfis, RBAC no servidor e tags visuais.
- [ ] Implementar lista de amigos e convites para salas privadas.
- [ ] Migrar inventário/Fragmentos/decks com transações auditáveis e sincronização.
- [ ] Implementar painel DEV: listar jogadores, ajustar Fragmentos, conceder/remover cartas e boosters, gerir eventos e auditar concessões.
- [ ] Implementar servidor autoritativo de partida, eventos filtrados por jogador, anti-cheat, reconexão e testes com dois clientes.
- [ ] Adicionar animações de cards e ataques 2D/3D leves, acessíveis em celular.

**Documentos-base:** [Cartas especiais](docs/CARTAS_ESPECIAIS.md) · [PvP, amigos e GM](docs/ONLINE_SOCIAL_GAME_MASTER.md) · [Propostas JSON](docs/cards-special-proposals.json). Nenhuma caixa acima declara um recurso executável como concluído.
