# Arte do personagem

As artes ficam em `public/assets/zamasu/` e são configuradas em `src/data/character.ts` (`CHARACTER.art`).

| Arquivo | Pose | Uso |
|---|---|---|
| `fused-full.webp` | `full` | Corpo inteiro. Portal e câmara de formas, com o halo animado atrás |
| `fused-judgment.webp` | `judgment` | Retrato apontando para o visitante. Topo do Santuário |

> **Direitos:** estas imagens são arte de Dragon Ball (Toei/Shueisha) com o fundo removido, usadas num projeto de fã. Para publicar o site abertamente, prefira fan art autorizada ou arte encomendada. Com `null` no lugar do caminho, o site usa uma silhueta vetorial própria.

## Como preparar uma arte nova

1. **Remova o fundo.** O que funcionou aqui foi o [rembg](https://github.com/danielgatis/rembg) com o modelo específico para anime:
   ```bash
   pip install "rembg[cpu]" pillow
   rembg i -m isnet-anime entrada.png saida.png
   ```
2. **Pose `full`:** coloque o personagem numa tela transparente de **800×1400**, com o **rosto em (400, 410)**. É o centro do halo desenhado pelo site (50% × 29,3%). Os pés devem terminar antes do fim da imagem.
3. **Exporte em WebP** com transparência (qualidade ~88). As artes atuais têm 64 KB e 49 KB.
4. Atualize os caminhos em `CHARACTER.art`. O teste `toda arte configurada existe em public/` (`npm run test`) acusa caminho errado.

Os tratamentos de cada forma (brilho dourado, corrupção roxa, cosmos) usam a própria imagem como máscara, então funcionam com qualquer arte recortada.
