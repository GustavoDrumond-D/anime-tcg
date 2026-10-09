# Roadmap — Anime TCG

Status: planejado. Checkboxes representam trabalho efetivamente concluído, não apenas discutido.

## M0 — Fundação e regras
- [x] Registrar visão inicial do card game
- [x] Documentar classes, universos e conceitos de energia
- [x] Resolver dúvidas do regulamento em `docs/DECISIONS.md` (v0.3; direitos de arte seguem pendentes)
- [x] Definir regras completas de alvo, bloqueio e ataque direto
- [x] Definir efeito de cartas UR/SSR sem power creep excessivo (tabela de raridade, RULEBOOK §10)
- [ ] Criar 20 cartas de teste com dados estruturados e imagens temporárias

## M1 — Catálogo e UI
- [x] Inicializar app React/TypeScript/Vite (+ Tailwind, Vitest, oxlint, Prettier, CI)
- [ ] Layout desktop-first responsivo
- [x] Componente `Card` (variantes full e compact; preview quando houver uso)
- [x] Design v3 aprovado como protótipo 0.1 (Figma, página "v3 — Estrutura de jogo")
- [ ] Catálogo filtrável por universo, raridade e classe
- [ ] Inventário persistido localmente

## M2 — Boosters
- [x] Catálogo de packs: Multiverso + 5 universos (loja em carrossel)
- [x] Sorteio determinístico testável e probabilidades configuráveis (+ garantia de UR)
- [x] Revelação animada de 5 cartas (corte arrastando, sons, partículas, destaque UR/SSR)
- [ ] Inventário recebe cartas abertas; duplicatas contabilizadas
- [ ] Moeda fictícia e recompensas locais

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
- [ ] Holografia SSR/UR e feedback de ataque
- [ ] Animações de abertura de packs
- [ ] Acessibilidade: foco, contraste, movimento reduzido
- [ ] Testes e tratamento de erros
- [ ] Deploy em Vercel

## Depois do MVP
- [ ] Invocações auxiliares avançadas
- [ ] Eventos e packs temáticos
- [ ] Progressão e missões
- [ ] PWA
- [ ] Avaliar contas/sincronização/PvP apenas após MVP
