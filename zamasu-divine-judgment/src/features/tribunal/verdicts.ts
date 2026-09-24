import type { MoralAxis, Verdict } from './types'

export interface VerdictText {
  title: string
  sentence: string
  /** Cor dominante da revelação (eventos da atmosfera). */
  color: string
}

export const VERDICTS: Record<Verdict, VerdictText> = {
  worthy: {
    title: 'Digno',
    sentence:
      'Você enxerga o que os deuses fracos se recusam a ver. Quando o mundo for purificado, talvez ainda exista um lugar para você nele.',
    color: '#e8c46a',
  },
  tolerated: {
    title: 'Tolerado',
    sentence:
      'Há sementes de clareza em você, sufocadas por hesitação mortal. Por ora, sua existência é permitida.',
    color: '#7af5d0',
  },
  mortal: {
    title: 'Mortal',
    sentence:
      'Previsível. Você escolhe o conforto em vez da justiça, como todos da sua espécie. Não é ódio o que sinto. É tédio.',
    color: '#9aa0a6',
  },
  condemned: {
    title: 'Condenado',
    sentence:
      'Você defende exatamente aquilo que eu vim apagar. Sua sentença já está escrita. Só não decidi quando executá-la.',
    color: '#b45cff',
  },
}

/** Leitura do eixo dominante, na voz de Zamasu. */
export const AXIS_READINGS: Record<MoralAxis, string> = {
  order: 'Você acredita que o mundo precisa de uma mão firme. Nisso, concordamos.',
  mercy: 'Você perdoa demais. A misericórdia é o luxo de quem nunca precisou limpar a sujeira.',
  purity: 'Você deseja um mundo limpo. Resta saber se tem coragem de purificá-lo.',
  freedom: 'Você venera a liberdade — a mesma liberdade que os mortais usam para se destruir.',
}

export const OPENING =
  'Mortal. Você entrou no Tribunal de um deus. Aqui não existem respostas certas, apenas respostas dignas. Sete perguntas. Responda com honestidade. Eu saberei se mentir.'

/** Saudação para quem volta, conforme o último veredito. */
export const RETURN_GREETINGS: Record<Verdict, string> = {
  worthy: 'Você voltou. Um dos poucos mortais cuja existência eu tolero com algo próximo de respeito. Vejamos se ainda merece.',
  tolerated: 'Você de novo, mortal. Ainda está aqui por minha misericórdia. Vejamos se mudou.',
  mortal: 'Você de novo, mortal. Da última vez, provou ser apenas… humano. Tente me surpreender.',
  condemned: 'Você ousa voltar? Da última vez, sua sentença foi escrita. Talvez hoje eu a execute.',
}
