# Project Zamasu: Divine Judgment

> *"Quando mortais falham em criar um mundo perfeito… um deus decide assumir o controle."*

Uma experiência web cinematográfica inspirada em **Zamasu Fundido** (Dragon Ball Super). Não é uma página de fã comum: é um **santuário digital**, uma dimensão criada por uma entidade que se considera a própria definição de perfeição. A proposta mistura abertura de anime, interface de jogo AAA e site premium.

> **Aviso:** projeto de fã, sem fins lucrativos. Dragon Ball Super e seus personagens pertencem a Akira Toriyama, Toyotarou, Shueisha e Toei Animation. **Nenhuma arte oficial está incluída.** A silhueta do personagem é um placeholder vetorial feito em código, pronto para ser trocado por arte própria (veja [Trocando a arte](#trocando-a-arte-do-personagem)).

---

## Sumário

- [O que é a experiência](#o-que-é-a-experiência)
- [Como executar](#como-executar)
- [Comandos disponíveis](#comandos-disponíveis)
- [Testes e validação](#testes-e-validação)
- [Arquitetura](#arquitetura)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Trocando a arte do personagem](#trocando-a-arte-do-personagem)
- [Publicando (deploy)](#publicando-deploy)
- [Desempenho e acessibilidade](#desempenho-e-acessibilidade)
- [Roadmap](#roadmap)
- [Solução de problemas](#solução-de-problemas)

---

## O que é a experiência

### O Portal (página inicial)
Ao abrir o site, uma abertura em **7 fases** acontece:

1. Tela completamente escura.
2. Fragmentos de energia surgem no vazio.
3. Dois brincos **Potara** convergem e se fundem num clarão.
4. A dimensão se forma: estrelas, nebulosas e ruínas de templo dos Kaioshins.
5. A silhueta de Zamasu Fundido se materializa.
6. A aura explode, e o ambiente reage com clarão, onda de choque e tremor.
7. A frase principal e os botões **"Entrar no Santuário"** e **"Desafiar a Divindade"** aparecem.

A abertura roda uma vez por sessão do navegador. Dá para **pular** e depois **rever**.

### Sistema de Formas
Um seletor no topo (I · II · ∞) muda a atmosfera do site **inteiro**: cores, partículas, efeitos e a própria silhueta.

| | Forma Divina | Forma Corrompida | Forma Infinita |
|---|---|---|---|
| Sensação | equilíbrio, superioridade | instabilidade, corrupção | escala cósmica |
| Cores | dourado + esmeralda | roxo + magenta | ciano cósmico + violeta |
| Partículas | sobem devagar, ordenadas | tremem, "saltam" e deixam rastro | giram num vórtice ao redor da entidade |
| Cena | feixes de luz celestial | rachaduras na tela, falhas visuais | anéis orbitais gigantes |
| Silhueta | halo dourado | metade do corpo tomada por veias roxas | o corpo se dissolve no cosmos |

A forma escolhida fica salva: ao voltar ao site, ela continua ativa.

### O Santuário Divino (`/santuario`)
- **Dossiê** do personagem.
- **Crônica da origem** em 4 atos (Zamasu → Goku Black → Projeto Zero Humanos → a Fusão), com uma linha de luz que desce conforme você rola.
- **Câmara de formas**, com a descrição de cada forma.
- **Códex de poderes**: selecione uma habilidade e clique em **Invocar**. Cada poder tem animação própria e faz o site inteiro reagir.
  - *Lâmina de Luz Divina:* um corte diagonal parte o palco ao meio.
  - *Regeneração Imortal:* o núcleo se estilhaça e se refaz.
  - *Cólera Divina:* colunas de luz caem do céu.
  - *Expansão da Corrupção:* veias tomam tudo até o palco virar universo.

### Reinos selados (fases futuras)
**Arena Divina**, **Tribunal Divino**, **Arquivo das Linhas Temporais** e **Hira's Archive** já existem como páginas. Em vez de "em breve", o próprio Zamasu recusa a entrada, e a página mostra uma prévia dos dados que já estão prontos no código (atributos dos lutadores, primeiro dilema, linha temporal canônica).

---

## Como executar

### 1. Pré-requisitos

| Ferramenta | Versão | Como verificar |
|---|---|---|
| [Node.js](https://nodejs.org/) | **22.12 ou superior** (o Vitest exige; o Vite 8 aceita 20.19+) | `node -v` |
| npm | vem junto com o Node | `npm -v` |
| Git | qualquer versão recente | `git --version` |

> Se você usa [nvm](https://github.com/nvm-sh/nvm) ou [nvm-windows](https://github.com/coreybutler/nvm-windows), o arquivo `.nvmrc` já indica a versão: rode `nvm install` e depois `nvm use` (no Windows: `nvm install 22` e `nvm use 22`).

### 2. Baixar o código

```bash
git clone https://github.com/HiraSanchez/API-Conversor-de-Video.git
cd API-Conversor-de-Video/zamasu-divine-judgment
```

> O projeto vive na pasta `zamasu-divine-judgment/`. **Todos os comandos abaixo devem ser rodados dentro dela.**

### 3. Instalar as dependências

```bash
npm install
```

### 4. Rodar em modo de desenvolvimento

```bash
npm run dev
```

Abra **http://localhost:5173** no navegador. Qualquer alteração no código recarrega a página na hora.

Para acessar pelo celular na mesma rede Wi-Fi:

```bash
npm run dev -- --host
```

O terminal vai mostrar um endereço do tipo `http://192.168.x.x:5173`. Abra esse endereço no celular.

### 5. Gerar a versão de produção (opcional)

```bash
npm run build     # checa os tipos e gera a pasta dist/
npm run preview   # serve o dist/ em http://localhost:4173
```

Use o `preview` para ver o site exatamente como vai ficar publicado. Ele é mais rápido e fiel que o modo `dev`.

---

## Comandos disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com recarga automática (porta 5173) |
| `npm run build` | Checagem de tipos (TypeScript) + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção (porta 4173) |
| `npm run lint` | Análise estática do código (oxlint) |
| `npm run test` | Testes unitários (Vitest) |
| `npm run test:watch` | Testes unitários em modo observação |
| `npm run test:e2e` | Testes de ponta a ponta no navegador (Playwright + axe). Gera o build sozinho |
| `npm run check` | Lint + testes unitários + build, em sequência. Rode antes de subir mudanças |

---

## Testes e validação

O projeto tem três camadas de verificação, e todas rodam automaticamente no GitHub Actions (`.github/workflows/zamasu-web.yml`) a cada push ou pull request que mexa nesta pasta.

### Testes unitários: `npm run test`
39 testes cobrindo as regras que o código assume em silêncio:
- **Formas:** toda cor de partícula precisa ser hex de 6 dígitos (o motor concatena transparência em hex; `rgb()` quebraria sem aviso), e os limites de densidade e rastro precisam ser seguros.
- **Motor de partículas:** a intro começa do vazio absoluto, a população cresce aos poucos sem passar do máximo, explosões expiram, reduced motion reduz a densidade e o DPR é limitado.
- **Conteúdo:** todo poder tem efeito visual registrado; ids únicos em lutadores, habilidades, dilemas e linha temporal; nenhuma habilidade custa mais Ki do que o lutador tem.
- **Hira's Archive:** salvar, atualizar sem duplicar, filtrar, remover e sobreviver a dado corrompido no storage.
- **Estado:** ciclo das formas e persistência.

### Testes E2E: `npm run test:e2e`
Rodam num Chromium de verdade, em **desktop (1440px)** e **celular (Pixel 5)**:
- todas as rotas abrem por link direto sem erro de execução, incluindo a 404;
- nenhuma página tem rolagem horizontal no celular;
- a abertura roda até o fim, pode ser pulada, não repete na sessão e pode ser revista;
- a troca de forma altera a atmosfera e persiste após recarregar;
- os quatro poderes podem ser invocados;
- navegação por teclado: setas no códex de poderes, `Esc` fecha o menu;
- com *reduced motion*, as animações CSS são neutralizadas;
- **acessibilidade (axe-core):** nenhuma violação séria ou crítica em nenhum reino.

> **Primeira vez rodando o E2E?** Instale o navegador do Playwright: `npx playwright install chromium`.

---

## Arquitetura

**Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Framer Motion · React Router · Zustand · Vitest · Playwright.

```
┌──────────────────────── Shell (persiste entre páginas) ─────────────────────┐
│ AtmosphereLayer → céu, nebulosas, templo + raios / rachaduras / glitch / cosmos│
│ ParticleField   → um único canvas de partículas, reage à forma e a eventos   │
│ TopBar          → sigilo, seletor de formas, menu dos reinos                 │
│ ScreenFx/quake  → clarões e tremores de tela                                 │
│  ┌──────────── troca de página com transição dimensional ────────────┐       │
│  │ Portal │ Santuário │ Reinos selados (carregados sob demanda)       │       │
│  └────────────────────────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────────────────┘
```

Três ideias sustentam o projeto:

1. **A forma controla a atmosfera inteira.** `src/core/forms/forms.ts` define, para cada forma, paleta, comportamento das partículas, efeitos de cena e textos. As cores viram variáveis CSS (`--form-primary`, etc.) registradas com `@property`, então a troca de forma *interpola* as cores em vez de piscar. Nenhum componente fixa cor de forma no código.
2. **O mundo reage por eventos.** `divineEvents` (`burst`, `shockwave`, `flash`, `quake`) desacopla quem causa de quem mostra. Um poder invocado, uma troca de forma ou, no futuro, um golpe na Arena faz a tela reagir sem conhecer os componentes de atmosfera.
3. **Reinos são plugáveis.** `src/app/realms.ts` registra cada página com status (`open`/`sealed`) e fase do roadmap. Os reinos selados já têm tipos, dados e contratos prontos; falta só a interface interativa.

**Partículas sem biblioteca:** o motor (`src/core/particles/ParticleEngine.ts`) é Canvas 2D puro, com brilhos pré-renderizados e composição aditiva. Assim o comportamento de cada forma fica sob controle total, sem dependência extra.

---

## Estrutura de pastas

```
zamasu-divine-judgment/
├── e2e/                     Testes de ponta a ponta (Playwright + axe)
├── public/assets/           Arte substituível (veja o README da pasta)
└── src/
    ├── app/                 Shell, rotas, registro dos reinos
    ├── core/
    │   ├── forms/           Sistema de Formas (fonte única da atmosfera)
    │   ├── particles/       Motor de partículas + componente React
    │   ├── events/          Barramento de eventos da atmosfera
    │   ├── motion/          Curvas e animações compartilhadas
    │   └── storage/         localStorage/sessionStorage à prova de falha
    ├── components/
    │   ├── atmosphere/      Camadas de cena (fundo, raios, rachaduras, glitch, cosmos)
    │   ├── character/       Silhueta, aura de Ki, figura divina
    │   ├── layout/          Barra superior, transição entre páginas
    │   └── ui/              Botões, títulos, revelação de texto, glitch, sigilo
    ├── features/
    │   ├── intro/           Coreografia da abertura
    │   ├── landing/         O Portal + índice dos reinos
    │   ├── sanctuary/       Dossiê, crônica, câmara de formas, códex de poderes
    │   │   └── powers/      Um efeito visual por habilidade
    │   ├── arena/           [Fase 2] tipos do motor de batalha + elenco
    │   ├── tribunal/        [Fase 3] tipos narrativos + dilemas
    │   ├── timelines/       [Fase 3] grafo temporal + linha canônica
    │   ├── archive/         [Fase 4] modelo de dados + repositório local
    │   └── sealed/          Página-padrão de reino selado e 404
    ├── data/                Personagem, capítulos da origem, poderes
    ├── hooks/               Parallax, forma ativa, tremor, reduced motion
    ├── store/               Estado global (forma, atmosfera, jornada)
    └── styles/              Tailwind, tokens de cor, animações
```

---

## Trocando a arte do personagem

1. Coloque as imagens em `public/assets/zamasu/`: `divine.webp`, `corrupted.webp` e `infinite.webp`.
   - Formato: **WebP ou PNG com fundo transparente**, proporção **4:7** (ex.: 800×1400), personagem centralizado e com os pés na base.
2. Em `src/data/character.ts`, troque os `null` pelos caminhos:

```ts
portraits: {
  divine: '/assets/zamasu/divine.webp',
  corrupted: '/assets/zamasu/corrupted.webp',
  infinite: '/assets/zamasu/infinite.webp',
},
```

Aura, halo, parallax e transições continuam funcionando; só o corpo da silhueta é substituído. Mais detalhes em `public/assets/README.md`.

---

## Publicando (deploy)

O site é uma SPA (aplicação de página única). O comando `npm run build` gera arquivos estáticos em `dist/`, que podem ser hospedados em qualquer serviço de site estático.

| Serviço | Configuração |
|---|---|
| **Vercel** | *Root directory:* `zamasu-divine-judgment` · *Build:* `npm run build` · *Output:* `dist`. Rotas funcionam sem ajuste. |
| **Netlify** | Mesmas opções. Crie `public/_redirects` com a linha `/* /index.html 200` para as rotas funcionarem ao recarregar. |
| **GitHub Pages** | Não suporta esse tipo de rota. Troque `BrowserRouter` por `HashRouter` em `src/app/App.tsx` (as URLs ficam `/#/santuario`) e configure `base` no `vite.config.ts` com o nome do repositório. |

---

## Desempenho e acessibilidade

**O que foi feito:**
- Um único canvas de partículas, com densidade proporcional ao tamanho da tela, DPR limitado a 1.5 e pausa quando a aba fica oculta.
- Brilhos feitos com gradientes em vez de filtros de blur, que eram o maior custo medido. Os filtros que sobraram ficam, na maior parte, em camadas estáticas que o navegador não redesenha a cada quadro. A exceção são os brilhos dos efeitos no palco de poderes, que só custam enquanto estão na tela.
- Páginas carregadas sob demanda; a página inicial vai no pacote principal.
- `prefers-reduced-motion` respeitado: menos partículas e mais lentas, sem tremor de tela, animações CSS neutralizadas.
- Navegação completa por teclado, textos com contraste WCAG AA, conteúdo decorativo escondido de leitores de tela, link "pular para o conteúdo".

**O que foi medido, e o limite dessa medição:** num Chromium headless **sem GPU** (renderização por software, o pior caso possível), a otimização de filtros levou a Forma Divina de ~8 para ~29 fps. As formas Corrompida e Infinita ficaram entre ~14 e ~36 fps nesse ambiente. **Ainda não foi medido em celular real**, onde a GPU muda completamente o resultado. Esse é o próximo teste recomendado, principalmente em aparelhos Android de entrada.

---

## Roadmap

| Fase | Escopo | Situação |
|---|---|---|
| **1** | Portal cinematográfico, Sistema de Formas, Santuário (origem + poderes), arquitetura de expansão, testes e CI | ✅ Concluída |
| **2** | **Arena Divina:** implementar o motor de batalha (puro e testável), interface de combate, IA do Zamasu, efeitos via `divineEvents` | Tipos e elenco prontos |
| **3** | **Tribunal Divino** (dilemas → eixos morais → veredito) e **Linhas Temporais** (timeline interativa + linhas alternativas) | Tipos e dados iniciais prontos |
| **4** | **Hira's Archive:** criar personagem, salvar batalhas e linhas temporais, exportar/importar; trocar o repositório local por um backend | Modelo e repositório local prontos |
| Contínuo | Arte própria, trilha sonora e efeitos sonoros (camada de áudio ligada ao `divineEvents`), teste em dispositivos reais | — |

---

## Solução de problemas

| Problema | Causa provável | Solução |
|---|---|---|
| `npm install` ou `npm run test` reclama da versão do Node | Node abaixo de 22.12 | Atualize o Node (`nvm install 22` e `nvm use 22`) |
| `npm run dev` diz que a porta 5173 está em uso | Outro servidor já está rodando | Feche o outro terminal ou rode `npm run dev -- --port 5174` |
| A página abre, mas as fontes parecem diferentes | Sem acesso ao Google Fonts (rede bloqueada ou offline) | O site funciona com as fontes de fallback; conecte-se à internet para as fontes originais |
| Recarregar `/santuario` dá erro 404 depois de publicar | O host não redireciona as rotas para `index.html` | Veja a seção [Publicando](#publicando-deploy) |
| `npm run test:e2e` diz que o navegador não foi encontrado | Chromium do Playwright não instalado | `npx playwright install chromium` |
| Quero ver a abertura de novo | Ela roda só uma vez por sessão | Clique em **"↺ Rever abertura"** no rodapé do Portal, ou abra o site numa aba anônima |
| Quero voltar à Forma Divina ao abrir | A forma escolhida fica salva no navegador | Clique em **I** no seletor do topo |
