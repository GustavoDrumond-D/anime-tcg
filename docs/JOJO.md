# Expansão JoJo — coleção e boosters

Implementada em 12/10/2026. Escopo autorizado: universo, energia, booster e personagens colecionáveis. **Não inclui PvP, PvE, arena, deck builder nem motor de combate.** Habilidades são dados declarativos para exibição; os números continuam hipóteses de balanceamento.

## Catálogo

20 personagens, cada um com arte própria em WebP:
- C: Iggy, Narancia Ghirga, Koichi Hirose.
- R: Jean Pierre Polnareff, Guido Mista, Okuyasu Nijimura, Hot Pants.
- SR: Josuke Higashikata, Noriaki Kakyoin, Muhammad Avdol, Joseph Joestar, Diego Brando.
- SSR: Giorno Giovanna, Jolyne Cujoh, Bruno Bucciarati, Johnny Joestar, Gyro Zeppeli.
- UR: Jotaro Kujo, DIO, Funny Valentine.

Steel Ball Run participa do mesmo universo e booster com Johnny, Gyro, Diego, Valentine e Hot Pants. As técnicas de Spin de Gyro usam apenas custos genéricos. As demais cartas podem exigir Stand. As técnicas são adaptações às palavras-chave já existentes, não uma simulação completa dos poderes canônicos.

## Integração

- Universo: `jojo`, exibido como JoJo’s Bizarre Adventure.
- Energia: `stand`, carta `energy-stand`, magenta na interface.
- Booster: `pack-jojo`, presente no carrossel.
- Mesma economia: 100 Fragmentos, 5 cartas, abertura individual/×5 e garantia de UR em até 20 packs.
- Duas energias: 80% Stand / 20% Universal por posição.
- Duas posições C/R e uma posição R/SR/SSR/UR, com as probabilidades existentes.
- Todas as raridades sorteáveis têm personagens: nenhuma posição de personagem vira energia por falta de raridade.
- Personagens e Stand também entram no pack Multiverso.
- Inventários existentes continuam válidos; a garantia de JoJo é criada sob sua própria chave.
- Filtro da coleção, zoom, venda e persistência reutilizam os fluxos existentes.

## Artes e validação

As artes foram produzidas pela ferramenta integrada de geração de imagens, não são artes oficiais. Prompts em [JOJO_ART_PROMPTS.md](JOJO_ART_PROMPTS.md); as três artes anteriores foram reutilizadas. Arquivos finais em `public/assets/cards/jojo/`, `public/assets/energies/stand.webp` e `public/assets/packs/jojo.webp`.

`src/data/jojo.test.ts` cobre catálogo, assets, composição do booster, alcance das 20 cartas, distribuição de energias, garantia, compra ×5 com perfil antigo, isolamento entre universos e economia. O teste geral de catálogo valida os orçamentos de raridade e multiplicadores.

## Molduras

As 20 cartas usam a moldura ornamentada compartilhada de Card.tsx, integrada da main (463b21d / 44197e7), tanto na coleção quanto no zoom e na abertura. Prata para C/R, dourado para SR/SSR e holografia para UR; nome, classe, kanji, ATQ/HP, custos e técnicas continuam renderizados pelos dados. Sem duplicação de molduras nas imagens.
