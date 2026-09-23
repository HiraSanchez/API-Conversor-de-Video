/**
 * Poses de arte do personagem.
 * - `full`: corpo inteiro, 4:7, cabeça alinhada ao halo do site (50%, 29.3%).
 * - `judgment`: retrato dramático em 3/4, sem halo, bordas cortadas pelo enquadramento.
 */
export type ArtPose = 'full' | 'judgment'

/**
 * Dossiê do personagem.
 *
 * `art`: caminho de cada pose em `public/`. Com `null`, a pose cai na silhueta
 * vetorial (útil para publicar sem arte de terceiros). Ver public/assets/README.md.
 */
export const CHARACTER = {
  name: 'Zamasu Fundido',
  alias: 'Merged Zamasu',
  art: {
    full: '/assets/zamasu/fused-full.webp',
    judgment: '/assets/zamasu/fused-judgment.webp',
  } satisfies Record<ArtPose, string | null> as Record<ArtPose, string | null>,
  dossier: [
    { label: 'Origem', value: 'Universo 10' },
    { label: 'Natureza', value: 'Fusão Potara — Zamasu + Goku Black' },
    { label: 'Condição', value: 'Imortalidade imperfeita' },
    { label: 'Ideologia', value: 'Projeto Zero Humanos' },
    { label: 'Registro', value: 'Dragon Ball Super — Arco do Trunks do Futuro' },
    { label: 'Destino', value: 'Apagado com a própria linha temporal' },
  ],
}

export interface OriginChapter {
  id: string
  numeral: string
  title: string
  subtitle: string
  body: string
  /** Frase de impacto exibida em destaque. Texto autoral do santuário, não citação canônica. */
  inscription: string
}

export const ORIGIN_CHAPTERS: OriginChapter[] = [
  {
    id: 'zamasu',
    numeral: 'I',
    title: 'Zamasu',
    subtitle: 'O aprendiz que julgou os deuses',
    body: 'Aprendiz de Kaioshin do Universo 10, discípulo de Gowasu. Observando guerras e crueldades dos mortais, concluiu que eles eram o defeito da criação — e que os próprios deuses eram fracos demais para corrigi-lo.',
    inscription: 'Um jardim não é perfeito enquanto houver ervas daninhas.',
  },
  {
    id: 'black',
    numeral: 'II',
    title: 'Goku Black',
    subtitle: 'O corpo roubado',
    body: 'Usando as Super Esferas do Dragão, Zamasu trocou de corpo com Son Goku. Com a força de um Saiyajin e a mente de um deus, nasceu Goku Black — e com ele, o Super Saiyajin Rosé.',
    inscription: 'Que ironia divina: usar o corpo de um mortal para apagar os mortais.',
  },
  {
    id: 'zero',
    numeral: 'III',
    title: 'Projeto Zero Humanos',
    subtitle: 'A justiça como extermínio',
    body: 'Ao lado do Zamasu imortal da linha do futuro, Black iniciou o plano de eliminar toda a humanidade. A linha temporal de Trunks do Futuro virou ruína — o primeiro altar do novo mundo.',
    inscription: 'Não é destruição. É purificação.',
  },
  {
    id: 'fusion',
    numeral: 'IV',
    title: 'A Fusão',
    subtitle: 'Dois Potara, um deus',
    body: 'Diante da derrota, Zamasu e Black se fundiram com os brincos Potara. Por serem Kaioshins, a fusão é permanente. Mas unir um corpo imortal a um mortal gerou uma imortalidade imperfeita — e a corrupção começou a consumir a carne divina.',
    inscription: 'Dois fragmentos de justiça. Uma única perfeição.',
  },
]
