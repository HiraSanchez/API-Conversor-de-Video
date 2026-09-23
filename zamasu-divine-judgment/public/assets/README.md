# Assets substituíveis

A primeira versão usa **placeholders vetoriais** (SVG desenhado em código) para não depender de arte com direitos autorais.

## Retratos do Zamasu Fundido

1. Coloque as imagens em `public/assets/zamasu/`:
   - `divine.webp` — Forma Divina
   - `corrupted.webp` — Forma Corrompida
   - `infinite.webp` — Forma Infinita
2. Formato recomendado: WebP/PNG **com fundo transparente**, proporção **4:7** (ex.: 800×1400), personagem centralizado e com os pés na base.
3. Em `src/data/character.ts`, troque `null` pelo caminho:

```ts
portraits: {
  divine: '/assets/zamasu/divine.webp',
  corrupted: '/assets/zamasu/corrupted.webp',
  infinite: '/assets/zamasu/infinite.webp',
},
```

A aura, o halo, o parallax e as transições continuam funcionando — só o corpo da silhueta é substituído.

## Retratos da Arena

Cada lutador em `src/features/arena/fighters.ts` tem `portrait: null`, pronto para receber o caminho da arte na Fase 2.
