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
