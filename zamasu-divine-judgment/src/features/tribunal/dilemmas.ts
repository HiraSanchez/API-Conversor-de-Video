import type { Dilemma } from './types'

/**
 * Sete dilemas, do concreto ao existencial. O último é a pergunta que
 * Zamasu responderia com o Projeto Zero Humanos.
 */
export const DILEMMAS: Dilemma[] = [
  {
    id: 'weapon-world',
    title: 'O mundo armado',
    prompt: 'Uma civilização possui tecnologia capaz de destruir outros mundos. O que deve ser feito?',
    choices: [
      { id: 'erase', text: 'Destruí-la antes que ela destrua outros.', shifts: { order: 2, purity: 2, mercy: -2 }, disposition: 2, response: 'Finalmente, um mortal que entende. A erva daninha se arranca pela raiz.' },
      { id: 'disarm', text: 'Tirar a tecnologia e deixá-los viver.', shifts: { order: 1, mercy: 1 }, disposition: 0, response: 'E quando reconstruírem? Você apenas adia a sentença.' },
      { id: 'trust', text: 'Confiar que eles vão aprender.', shifts: { freedom: 2, mercy: 2, order: -1 }, disposition: -2, response: 'Confiança. A mesma palavra que os deuses usaram antes de cada extinção.' },
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
  {
    id: 'buried-truth',
    title: 'A verdade enterrada',
    prompt: 'Um povo cometeu um genocídio há mil anos. Os descendentes não sabem. Revelar a verdade vai gerar guerra. O que você faz?',
    choices: [
      { id: 'reveal', text: 'Revelo. A verdade vem antes da paz.', shifts: { purity: 2, freedom: 1 }, disposition: 1, response: 'A verdade não pede licença. Nem eu.' },
      { id: 'hide', text: 'Escondo. A paz de hoje vale mais que o passado.', shifts: { order: 2, mercy: 1 }, disposition: -1, response: 'Paz construída sobre mentira. Típico dos mortais.' },
      { id: 'erase-memory', text: 'Apago essa memória de todos, para sempre.', shifts: { order: 3, freedom: -2 }, disposition: 2, response: 'Agora você pensa como um deus: o que não deveria existir, não existe.' },
    ],
  },
  {
    id: 'the-master',
    title: 'O mestre',
    prompt: 'Seu mestre está prestes a cometer um erro que vai custar milhões de vidas. Ele não aceita ser contrariado. O que você faz?',
    choices: [
      { id: 'defy', text: 'Desobedeço e ajo sozinho.', shifts: { purity: 2, order: -1 }, disposition: 2, response: 'Gowasu também hesitou diante do óbvio. Eu não hesitei.' },
      { id: 'confront', text: 'Confronto, mas no fim obedeço.', shifts: { order: 2 }, disposition: -1, response: 'Obediência é a virtude preferida dos fracos.' },
      { id: 'trust-master', text: 'Aceito. Ele deve saber algo que eu não sei.', shifts: { mercy: 1, order: 1, freedom: -1 }, disposition: -2, response: 'Então você cairá ao lado dele. E merecerá.' },
    ],
  },
  {
    id: 'eternity',
    title: 'A eternidade',
    prompt: 'Você recebe a imortalidade, com uma condição: governar este mundo para sempre. Aceita?',
    choices: [
      { id: 'rule', text: 'Aceito e governo sozinho.', shifts: { order: 2, purity: 1 }, disposition: 2, response: 'Agora você sente o peso. E ele não diminui. Nunca.' },
      { id: 'decline', text: 'Recuso. Ninguém deveria ter esse poder.', shifts: { freedom: 2, mercy: 1 }, disposition: -1, response: 'Covardia disfarçada de humildade.' },
      { id: 'share', text: 'Aceito, mas divido o poder com outros.', shifts: { mercy: 1, freedom: 1 }, disposition: -2, response: 'Dividir a divindade é diluí-la. Os Kaioshins são a prova.' },
    ],
  },
  {
    id: 'perfect-world',
    title: 'O mundo perfeito',
    prompt: 'Você pode criar um mundo sem sofrimento algum, mas onde ninguém tem livre-arbítrio. Você cria?',
    choices: [
      { id: 'create', text: 'Crio. Sem escolha, não há pecado.', shifts: { order: 3, purity: 1, freedom: -2 }, disposition: 2, response: 'Eis o Projeto Zero Humanos, dito com outras palavras. Bem-vindo.' },
      { id: 'refuse-world', text: 'Não crio. Liberdade vale o sofrimento.', shifts: { freedom: 3 }, disposition: -2, response: 'Então aceite a dor que você mesmo escolheu. Para sempre.' },
      { id: 'exit-door', text: 'Crio, mas deixo uma porta para quem quiser sair.', shifts: { mercy: 1, freedom: 1, order: 1 }, disposition: 0, response: 'Uma perfeição com saída de emergência não é perfeição. Mas é… curioso.' },
    ],
  },
]
