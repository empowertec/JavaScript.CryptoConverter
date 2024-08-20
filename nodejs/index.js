async function perguntar(pergunta) {
  const readline = require('readline')
  const process = require('process')

  const parametrosDaInterface = {
    input: process.stdin,
    output: process.stdout,
  }

  const interfaceComUsuario = readline.createInterface(parametrosDaInterface)

  return new Promise(function(retornar) {
    interfaceComUsuario.question(
      pergunta,
      function(resposta) {
        retornar(resposta)

        interfaceComUsuario.close()
      }
    )
  })
}

const dadosDeConversao = {
  cotacao: {
    btcParaUsd: undefined,
    usdParaBrl: undefined,
  },
  entrada: {
    valor: undefined,
    moeda: undefined,
  },
  saida: {
    moeda: undefined,
  }
}

async function receberParametrosDoUsuario() {
  dadosDeConversao.entrada.valor = parseFloat(await perguntar(`Qual o valor? `))
  dadosDeConversao.entrada.moeda = await perguntar(`Qual a moeda do valor informado? `)
  dadosDeConversao.saida.moeda = await perguntar(`Qual a moeda para conversão do valor? `)
}

async function carregarDadosDeConversaoDeMoedas() {
  const fs = require('fs')
  const arquivoDosUltimosDadosCarregados = __dirname + '/ultimaCotacaoDasMoedas.json'
  try {
    const url = "https://api2.binance.com/api/v3/ticker/24hr"
    const resposta = await fetch(url)
    const json = await resposta.json()
    fs.writeFileSync(arquivoDosUltimosDadosCarregados, JSON.stringify(json, null, 2))
    return json
  } catch (erro) {
    const ultimosDadosCarregados = fs.readFileSync(arquivoDosUltimosDadosCarregados).toString()
    const json = JSON.parse(ultimosDadosCarregados)
    return json
  }
}

async function receberCotacaoDasMoedas() {
  const moedas = await carregarDadosDeConversaoDeMoedas()

  const btcParaUsd = moedas.find(cotacao => cotacao.symbol === "BTCUSDT")
  dadosDeConversao.cotacao.btcParaUsd = parseFloat(btcParaUsd.lastPrice)

  const usdParaBrl = moedas.find(cotacao => cotacao.symbol === "USDTBRL")
  dadosDeConversao.cotacao.usdParaBrl = parseFloat(usdParaBrl.lastPrice)
}

async function executarPrograma() {
  console.info(`CONVERSOR DE MOEDAS`)
  console.info(`^^^^^^^^^^^^^^^^^^^`)

  await receberParametrosDoUsuario()
  await receberCotacaoDasMoedas()

  console.info(`_______________`)
  console.info(`FIM DO PROGRAMA`)
}

executarPrograma()