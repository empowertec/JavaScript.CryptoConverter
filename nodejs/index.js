const readline = require('readline')
const process = require('process')

const parametrosDaInterface = {
  input: process.stdin,
  output: process.stdout,
}

const interfaceComUsuario = readline.createInterface(parametrosDaInterface)

const dadosDeConversao = {
  entrada: {
    valor: undefined,
    moeda: undefined,
  },
  saida: {
    valor: undefined,
    moeda: undefined,
  }
}

interfaceComUsuario.question(
  `Qual o valor? `,
  function(resposta) {
    dadosDeConversao.entrada.valor = resposta

    interfaceComUsuario.question(
      `Qual a moeda do valor informado? `,
      function(resposta) {
        dadosDeConversao.entrada.moeda = resposta

        interfaceComUsuario.question(
          `Qual a moeda para conversão do valor? `,
          function(resposta) {
            dadosDeConversao.saida.moeda = resposta

            interfaceComUsuario.close()
          }
        )

      }
    )

  }
)