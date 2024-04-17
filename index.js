const adicionarProdutoNaLista = (produto) => {
    const produtos = document.getElementById("produtos") // UL
    const listaProdutos = Array.from(produtos.children)

    let produtoExiste = false
    listaProdutos.forEach(prod => {
        if (prod.innerText.toUpperCase() == produto.toUpperCase()) {
            produtoExiste = true
        }
    })

    if (!produtoExiste) {
        const li = criarElementoComConteudo("li", produto)
        produtos.appendChild(li)
    }
}

const formatarData = (data) => {
    const date = new Date(data.replace("-", "/"))

    // getDate - 1 a 31
    const dia = new String(date.getDate()).padStart(2, '0')

    // getMonth - 0 a 11
    const mes = new String(date.getMonth() + 1).padStart(2, '0')

    // getYear - 24
    // getFullYear - 2024
    const ano = date.getFullYear()

    return `${dia}/${mes}/${ano}`
}

const formatarNumero = (numero) => {
    return `R$ ${parseFloat(numero).toFixed(2).replace('.', ',')}`
}

const addVenda = (event) => {
    event.preventDefault()
    const form = event.target

    const { dataVenda, nomeProduto, quantidadeVendida, valorVendido } = form

    const tr = criarElementoComConteudo("tr")
    const tdData = criarElementoComConteudo("td", dataVenda.value)
    const tdProduto = criarElementoComConteudo("td", nomeProduto.value)
    const tdQuantidade = criarElementoComConteudo("td", quantidadeVendida.value)
    const tdValor = criarElementoComConteudo("td", formatarNumero(valorVendido.value))

    tr.appendChild(tdData)
    tr.appendChild(tdProduto)
    tr.appendChild(tdQuantidade)
    tr.appendChild(tdValor)

    const tabelaVendas = document.getElementById("vendas")
    tabelaVendas.children[1].appendChild(tr)

    form.reset()

    atualizaProdutosVendidos(produtosVendidos)
}

const removerVenda = (event) => {
    event.target.parentNode.parentNode.remove()
    atualizaProdutosVendidos(produtosVendidos)
}

const produtosVendidos = {}
document.getElementById("resumo-vendas-cab").parentNode.style.marginTop = '50px'
function zerarProdutos(produtos) {
    Object.keys(produtos).forEach(prod => {
        produtosVendidos[prod] = {
            quantidade: 0,
            valor: 0
        }
    })
}

function atualizaProdutosVendidos(produtosVendidos) {
    zerarProdutos(produtosVendidos)
    const vendas = document.getElementById("vendas")
    const conteudovendas = vendas.children[1]
    const listaDeVendas = conteudovendas.children
    const listaDeVendasArray = Array.from(listaDeVendas)

    listaDeVendasArray.forEach(venda => {
        const vendaExtraida = extrairDadosDaVenda(venda)

        addProdutoVendido(produtosVendidos, vendaExtraida)
    })

    montarResumoDeVendas(produtosVendidos)
}

function extrairDadosDaVenda(vendaLine) {
    const produto = vendaLine.children[1].innerText
    const quantidade = parseInt(vendaLine.children[2].innerText)
    const valorVendido = vendaLine.children[3].innerText

    const valor = parseFloat(valorVendido.replace('R$ ', ''))

    return {
        produto,
        quantidade,
        valor
    }
}

function addProdutoVendido(produtosVendidos, venda) {
    if (!produtosVendidos[venda.produto]) {
        produtosVendidos[venda.produto] = {
            quantidade: 0,
            valor: 0
        }
    }

    produtosVendidos[venda.produto].quantidade += venda.quantidade
    produtosVendidos[venda.produto].valor += venda.valor
}

function criarElementoComConteudo(elemento, conteudo) {
    const node = document.createElement(elemento)
    if (conteudo) {
        node.innerText = conteudo
    }
    return node
}

function montarResumoDeVendas(produtosVendidos) {
    const resumo = document.getElementById("resumo-vendas")
    resumo.innerHTML = ""

    Object.keys(produtosVendidos).forEach(produto => {
        const tr = criarElementoComConteudo("tr")
        const tdProduto = criarElementoComConteudo("td", produto)
        const tdQuantidade = criarElementoComConteudo("td", produtosVendidos[produto].quantidade)
        const tdValor = criarElementoComConteudo("td", `R$ ${produtosVendidos[produto].valor.toFixed(2).replace('.', ',')}`)

        tr.appendChild(tdProduto)
        tr.appendChild(tdQuantidade)
        tr.appendChild(tdValor)

        resumo.appendChild(tr)
    })
}

atualizaProdutosVendidos(produtosVendidos)



const formulario = document.getElementById("formulario")

console.log(formulario)

formulario.addEventListener("submit", (event) => {
    // Cancelar a execução padrão de um evento, não funciona apenas com formulários
    event.preventDefault()

    // obter o formulario a partir do evento
    const formulario = event.target

    // extrair os dados de dentro do form
    // não precisamos usar o getElementById pois como colocamos name nos inputs
    // podemos acessar diretamente de dentro do formulario
    const dataVenda = formulario.dataVenda
    const nomeProduto = formulario.nomeProduto
    const quantidadeVendida = formulario.quantidadeVendida
    const valorVendido = formulario.valorVendido

    const tr = criarElementoComConteudo("tr")

    // para pegar o conteudo inserido dentro de um input usamos a propriedade value
    const tdData = criarElementoComConteudo("td", formatarData(dataVenda.value))
    const tdProduto = criarElementoComConteudo("td", nomeProduto.value)
    const tdQuantidade = criarElementoComConteudo("td", quantidadeVendida.value)
    const tdValor = criarElementoComConteudo("td", formatarNumero(valorVendido.value))

    const tdRemover = criarElementoComConteudo("td")
    const botaoRemover = criarElementoComConteudo("button", "Excluir")
    tdRemover.appendChild(botaoRemover)
    botaoRemover.addEventListener("click", removerVenda)

    tr.appendChild(tdData)
    tr.appendChild(tdProduto)
    tr.appendChild(tdQuantidade)
    tr.appendChild(tdValor)
    tr.appendChild(tdRemover)

    const tabelaVendas = document.getElementById("vendas")
    tabelaVendas.children[1].appendChild(tr)

    adicionarProdutoNaLista(nomeProduto.value)

    // A função reset do elemento formulario limpa os campos possibilitando nova inserção
    formulario.reset()

    atualizaProdutosVendidos(produtosVendidos)
})



// PRÁTICA
// Criar a formatação dos campos data e valor de venda na tabelas de vendas
// ao add uma nova venda

// Criar um botão de excluir uma venda na tabela de vendas
// Deve atualizar o resumo ao atualizar
// Lembre-se de adicionar esta coluna na submissão do formulário



const vendasHead = document.getElementById("vendas").children[0]
const vendasBody = document.getElementById("vendas").children[1]

const tdHead = criarElementoComConteudo("th")
vendasHead.children[0].appendChild(tdHead)

Array.from(vendasBody.children).forEach(tr => {
    const td = criarElementoComConteudo("td")
    const botao = criarElementoComConteudo("button", "Excluir")

    botao.addEventListener("click", removerVenda)

    td.appendChild(botao)
    tr.appendChild(td)
})




/*
  0. Refatorar o codigo
  1. como adicionar ou remover classes de um elemento
  2. como alterar o atributo href de um link (setAttribute)
  3. eventos de elementos
  3.1 Como executar uma acao no evento onclick
  3.2 Como executar uma acao no evento dblclick
  Pratica: Escreva um codigo que ao clicar duas vezes no titulo sobre a empresa deixe o texto do paragrafo em negrito adicionando uma classe para isso

  4. Criar o formulario
  5. Como capturar o evento de submissao do formulario
  6. Como evitar que o formulario seja enviado na web
  7. Como obter os valores dos campos dos formularios
  8. Como limpar o formulario apos submissao
  9. Como inserir uma nova linha na tabela de produtos vendidos
  10. Como recalcular o resumo de vendas.
  Pratica: Criar um botao para excluir uma venda e recalcular o resumo de vendas
  Pratica 2: Criar um botao para excluir um produto e excluir ele da tabela de vendas e do resumo de vendas.

*/

const formExcluirProduto = document.getElementById("formulario-excluir-produto");

const listaProdutos = document.getElementById("produtos");
const listaProdutosArray = Array.from(listaProdutos.children);

const selectProdutos = document.getElementById("produto");
listaProdutosArray.forEach((produtoLi) => {
    const opcao = document.createElement("option");
    opcao.value = produtoLi.innerText;
    opcao.innerText = produtoLi.innerText;
    selectProdutos.appendChild(opcao);
});

formExcluirProduto.addEventListener("submit", (event) => {
    event.preventDefault();

    const produtoSelecionado = formExcluirProduto.produto.value;

    listaProdutosArray.forEach((produtoLi) => {
        if (produtoLi.innerText.toUpperCase() === produtoSelecionado.toUpperCase()) {
            listaProdutos.removeChild(produtoLi);
        }
    });

    const listaVendas = document.getElementById("vendas");
    const corpoVendas = listaVendas.children[1];
    const listaCorpoVendas = Array.from(corpoVendas.children);

    listaCorpoVendas.forEach((vendaTr) => {
        const produtoVenda = vendaTr.children[1].innerText;

        if (produtoVenda.toUpperCase() === produtoSelecionado.toUpperCase()) {
            corpoVendas.removeChild(vendaTr);
        }
    });

    atualizaProdutosVendidos(produtosVendidos);

    formExcluirProduto.reset();
});
