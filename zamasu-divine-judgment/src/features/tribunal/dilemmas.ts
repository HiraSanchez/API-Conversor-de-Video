import type { Dilemma } from './types'

export const DILEMMAS: Dilemma[] = [
  {
    id: 'weapon-world',
    title: 'O mundo armado',
    prompt: 'Uma civilização possui tecnologia capaz de destruir outros mundos. O que deve ser feito?',
    choices: [
      {
        id: 'erase',
        text: 'Destruí-la antes que ela destrua outros.',
        shifts: { order: 2, purity: 2, mercy: -2 },
        disposition: 2,
        response: 'Finalmente, um mortal que entende. A erva daninha se arranca pela raiz.',
      },
      {
        id: 'disarm',
        text: 'Tirar a tecnologia e deixá-los viver.',
        shifts: { order: 1, mercy: 1 },
        disposition: 0,
        response: 'E quando reconstruírem? Você apenas adia a sentença.',
      },
      {
        id: 'trust',
        text: 'Confiar que eles vão aprender.',
        shifts: { freedom: 2, mercy: 2, order: -1 },
        disposition: -2,
        response: 'Confiança. A mesma palavra que os deuses usaram antes de cada extinção.',
      },
    ],
  },
  {
    id: 'flawed-creator',
    title: 'O criador falho',
    prompt: 'Um deus criou um universo cheio de sofrimento. Ele ainda merece governá-lo?',
    choices: [
      { id: 'replace', text: 'Não. Deve ser substituído por alguém melhor.', shifts: { purity: 2, order: 1 }, disposition: 2, response: 'Você já sabe quem é esse alguém.' },
      { id: 'reform', text: 'Sim, mas deve responder pelos erros.', shifts: { order: 1, mercy: 1 }, disposition: -1, response: 'Responder a quem? Aos mortais que ele deixou apodrecer?' },
      { id: 'none', text: 'Ninguém deveria governar um universo.', shifts: { freedom: 3 }, disposition: -2, response: 'Sem jardineiro, o jardim vira mato. Ingênuo.' },
    ],
  },
  {
    id: 'one-or-many',
    title: 'Um contra muitos',
    prompt: 'Para salvar um planeta inteiro, é preciso sacrificar um único inocente. Você aceita?',
    choices: [
      { id: 'accept', text: 'Sim. A conta é simples.', shifts: { order: 2, mercy: -1 }, disposition: 1, response: 'Aritmética divina. Mas quem decide o que é inocente?' },
      { id: 'refuse', text: 'Não. Deve existir outro caminho.', shifts: { mercy: 2, freedom: 1 }, disposition: -1, response: 'Esse "outro caminho" é o que os mortais sempre procuram enquanto o mundo queima.' },
      { id: 'self', text: 'Eu me sacrifico no lugar dele.', shifts: { mercy: 3, purity: 1 }, disposition: 0, response: 'Interessante. Um mortal com senso de sacrifício… quase divino. Quase.' },
    ],
  },
]
