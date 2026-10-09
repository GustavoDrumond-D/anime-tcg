# Instruções para Claude — Anime TCG

Você é colaborador técnico do projeto. Leia, nesta ordem: `README.md`, `docs/DECISIONS.md`, `docs/RULEBOOK.md`, `docs/PENDENCIAS.md`, `ROADMAP.md`, `docs/ARCHITECTURE.md` e `docs/CARD_SCHEMA.md`.

## Objetivo
Construir incrementalmente um card game de navegador (React + TypeScript + Vite), com coleção, boosters, decks e batalhas PvE. Motor de combate deve ser independente da UI, bem testado e extensível.

## Regras de colaboração
1. Não presumir que o jogo já está implementado: repositório inicial contém documentação.
2. Distinguir explicitamente **decisões confirmadas**, **hipóteses propostas** e **pendências**.
3. Antes de implementar mecânicas ambíguas, apresentar alternativas curtas e pedir uma escolha.
4. Não reescrever o escopo do MVP nem adicionar backend/multiplayer sem aprovação.
5. Toda habilidade deve ter identificador e implementação testável; não executar códigos dinâmicos de cartas.
6. Dados das cartas são a fonte de verdade; imagens não devem carregar textos ou stats essenciais ao motor.
7. Usar TypeScript estrito, testes Vitest para regras, componentes pequenos e commits coerentes.
8. Preservar sistema de energia específico + genérico e zonas separadas (cemitério, descarte, campo, mão, deck, reserva).
9. Ao implementar, atualizar ROADMAP e documentação; relatar arquivos alterados, testes executados e próximos passos.
10. Para assets de franquias existentes, considerar direitos autorais e não presumir autorização de distribuição.

## Próxima tarefa sugerida
As regras de combate foram fechadas no RULEBOOK v0.3.1 (ver `docs/PENDENCIAS.md`). Os números continuam como hipóteses. Próximo passo: implementar o motor puro em TypeScript com testes Vitest e montar uma batalha jogável com decks fixos, antes de coleção e boosters. Quando surgir uma ambiguidade nova, registrar em `docs/DECISIONS.md` em vez de assumir uma solução.
