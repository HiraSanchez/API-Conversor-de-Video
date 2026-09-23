# Project Zamasu: Divine Judgment

Uma experiência web cinematográfica inspirada em **Zamasu Fundido** (Dragon Ball Super): um santuário digital criado por uma entidade que se considera a própria definição de perfeição.

> Projeto de fã, sem fins lucrativos. Dragon Ball Super e seus personagens pertencem a Akira Toriyama, Toyotarou, Shueisha e Toei Animation. Nenhuma arte oficial está incluída — a silhueta é um placeholder vetorial substituível (ver `public/assets/README.md`).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # typecheck + build de produção em dist/
npm run lint      # oxlint
```

## Stack

| Biblioteca | Papel |
|---|---|
| React 19 + TypeScript | UI e tipagem de todo o domínio (formas, poderes, arena, tribunal) |
| Vite 8 | Dev server e build (code-splitting por rota) |
| Tailwind CSS 4 | Estilo; tokens da identidade em `@theme`, tokens dinâmicos da forma via CSS vars |
| Framer Motion | Coreografia: intro, revelações, transições de rota, layout animations |
| React Router | Reinos (rotas) com carregamento lazy |
| Zustand | Estado global mínimo (forma ativa, atmosfera, jornada), com persistência |
| clsx | Composição de classes |

**Partículas não usam biblioteca**: o motor em `src/core/particles/ParticleEngine.ts` é Canvas 2D puro (~400 linhas), com sprites pré-renderizados e composição aditiva. Motivo: controle total do comportamento por forma e zero KB extra de dependência.

## Arquitetura

```
┌──────────────────────── Shell (persistente) ────────────────────────┐
│ AtmosphereLayer  → céu, nebulosas, templo, raios/rachaduras/glitch   │
│ ParticleField    → canvas único, reage à forma e a eventos           │
│ TopBar           → sigilo, FormSwitcher, menu dos reinos             │
│ ScreenFx / quake → clarões e tremores                                │
│ ┌──────────── AnimatePresence (troca de reino) ────────────┐         │
│ │ LandingPage | SanctuaryPage | Sealed pages (lazy)        │         │
│ └──────────────────────────────────────────────────────────┘         │
└──────────────────────────────────────────────────────────────────────┘
```

Três ideias sustentam tudo:

1. **A forma é a fonte única da atmosfera.** `src/core/forms/forms.ts` define, para cada forma, paleta, perfil de partículas, efeitos de cena e narrativa. O Shell converte a paleta em CSS vars (`--form-primary` etc., registradas com `@property` para interpolar suavemente). Nenhum componente hardcoda cor de forma.
2. **O mundo reage por eventos.** `divineEvents` (`burst`, `shockwave`, `flash`, `quake`) desacopla quem causa de quem mostra. Um poder invocado, uma troca de forma ou (no futuro) um golpe na Arena fazem o universo reagir sem conhecer os componentes de atmosfera.
3. **Reinos são plugáveis.** `src/app/realms.ts` registra cada rota com status (`open`/`sealed`) e fase do roadmap. Reinos selados já têm tipos, dados e contratos — só falta a UI interativa.

### Estrutura de pastas

```
src/
├── app/                 Shell, rotas, registro de reinos
├── core/
│   ├── forms/           Sistema de Formas (fonte única)
│   ├── particles/       Motor de partículas + componente React
│   ├── events/          Barramento de eventos da atmosfera
│   ├── motion/          Curvas e variants compartilhadas
│   └── storage/         Web Storage à prova de falha
├── components/
│   ├── atmosphere/      Camadas de cena (backdrop, raios, rachaduras, glitch, cosmos)
│   ├── character/       Silhueta, aura de Ki, figura divina
│   ├── layout/          TopBar, transição dimensional, PageFrame
│   └── ui/              Botões, títulos, revelação de texto, glitch, sigilo
├── features/
│   ├── intro/           Coreografia da abertura (fases)
│   ├── landing/         Portal + índice dos reinos
│   ├── sanctuary/       Dossiê, crônica, câmara de formas, códex de poderes
│   │   └── powers/      Um efeito visual por habilidade + registro
│   ├── arena/           [Fase 2] tipos do motor de batalha + elenco
│   ├── tribunal/        [Fase 3] tipos narrativos + dilemas
│   ├── timelines/       [Fase 3] tipos de grafo temporal + linha canônica
│   ├── archive/         [Fase 4] modelo de dados + repositório local
│   └── sealed/          Página-padrão de reino selado, 404
├── data/                Personagem, capítulos da origem, poderes
├── hooks/               Parallax, forma ativa, tremor, reduced motion
├── store/               Zustand: forma, atmosfera, jornada
└── styles/              Tailwind + tokens + keyframes
```

## Experiência (Fase 1)

**Abertura** (`useIntroTimeline`): vazio → fragmentos de energia → dois brincos Potara convergem e se fundem → a dimensão se forma (templo, estrelas) → a silhueta se materializa → a aura explode (clarão + onda de choque + tremor) → a frase e os botões se revelam. Roda uma vez por sessão; pode ser pulada ou revista.

**Sistema de Formas** — a troca altera cores, comportamento das partículas, camadas de cena e a própria silhueta:

| | Divina | Corrompida | Infinita |
|---|---|---|---|
| Paleta | dourado + esmeralda | roxo + magenta | ciano cósmico + violeta |
| Partículas | sobem devagar, ordenadas | instáveis, saltos com rastro | vórtice orbital com rastro |
| Cena | raios celestiais | rachaduras + glitch + scanlines | anéis orbitais, "olho" cósmico |
| Silhueta | halo dourado | metade direita corrompida (veias) | corpo se dissolve no cosmos |

**Santuário**: dossiê, crônica da origem em 4 atos (trilho de luz ligado ao scroll), câmara de formas e códex de poderes. Cada poder tem efeito próprio no palco e dispara reação global ao ser invocado:
- *Lâmina de Luz Divina* — corte diagonal que parte o palco ao meio
- *Regeneração Imortal* — o núcleo se estilhaça e se refaz
- *Cólera Divina* — colunas de luz caem do céu
- *Expansão da Corrupção* — veias tomam tudo até o palco virar cosmos

### Performance e acessibilidade
- Canvas com DPR limitado a 1.5, densidade proporcional à área da tela, pausa quando a aba fica oculta.
- Animações pesadas em `transform`/`opacity`; glitch em CSS puro.
- `prefers-reduced-motion`: partículas reduzidas e lentas, sem tremor, animações CSS neutralizadas.
- Rotas lazy (landing no bundle principal); navegação por teclado nas abas de poderes (setas), menu fecha com Esc, link "pular para o conteúdo".

## Roadmap

| Fase | Escopo | Status |
|---|---|---|
| 1 | Landing cinematográfica, Sistema de Formas, Santuário (origem + poderes), arquitetura de expansão | ✅ esta versão |
| 2 | **Arena Divina**: implementar `BattleEngine` (puro, testável), UI de combate, IA de Zamasu, efeitos via `divineEvents` | tipos + elenco prontos |
| 3 | **Tribunal Divino** (dilemas → eixos morais → veredito) e **Linhas Temporais** (timeline interativa + ramificações) | tipos + dados iniciais prontos |
| 4 | **Hira's Archive**: criar personagem, salvar batalhas/linhas, exportar/importar; trocar `localArchiveRepository` por backend | modelo + repositório local prontos |
| Contínuo | Arte oficial/encomendada, trilha e SFX (camada de áudio via `divineEvents`), testes (Vitest para motor de batalha e tribunal) | — |

## Deploy

É um SPA com `BrowserRouter`: o host precisa redirecionar rotas desconhecidas para `index.html` (Vercel/Netlify fazem isso com uma regra de rewrite). Para GitHub Pages, trocar para `HashRouter` em `src/app/App.tsx` é o caminho mais simples.
