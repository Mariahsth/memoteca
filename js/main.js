import ui from "./ui.js";
import api from "./api.js";
const pensamentoSet= new Set();


async function adicionarChaveAoPensamento() {
    try {
      const pensamentos = await api.buscarPensamentos()
      pensamentos.forEach(pensamento => {
        const chavePensamento = 
        `${pensamento.conteudo.trim().toLowerCase()}-${pensamento.autoria.trim().toLowerCase()}`
        pensamentoSet.add(chavePensamento)
      })
    } catch (error) {
      alert('Erro ao adicionar chave ao pensamento')
    }
  }

const regexConteudo=/^[A-Za-zãç!.?,áé\s]{10,}$/

function validarConteudo(conteudo) {
    return regexConteudo.test(conteudo)
}

const regexAutoria=/^[A-Za-zãç!.,áé]{3,15}$/

function validarAutoria(autoria) {
    return regexAutoria.test(autoria)
}

function removerEspacos(string){
    return string.replaceAll(/\s+/g,'')
}

document.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("pensamento-conteudo").value='';
    ui.renderizarPensamentos();
    adicionarChaveAoPensamento();

    const formularioPensamento=document.getElementById("pensamento-form");
    formularioPensamento.addEventListener("submit", manipularSubmissaoFormulario);

    const botaoCancelar=document.getElementById("botao-cancelar");
    botaoCancelar.addEventListener("click", manipularCancelamento);

    const campoInput=document.getElementById("campo-busca");
    campoInput.addEventListener("input", manipularBusca)
    
})

async function manipularSubmissaoFormulario(event){
    event.preventDefault();
    const id= document.getElementById("pensamento-id").value;
    const conteudo= document.getElementById("pensamento-conteudo").value;
    const autoria= document.getElementById("pensamento-autoria").value;
    const data=document.getElementById("pensamento-data").value;

    const conteudoSemEspacos = removerEspacos(conteudo)
    const autoriaSemEspacos = removerEspacos(autoria)


    if (!validarConteudo(conteudoSemEspacos)){
        alert("É permitida a inclusão apenas de letras e espaços e com no mínimo 10 caracteres")
        return
    }
    
    if (!validarAutoria(autoriaSemEspacos)){
        alert("É permitida a inclusão apenas de letras entre 3 e 15 caracteres")
        return
    }


    if (!validaData(data)){
        alert("Não é possível o cadasteo de datas futuras. Selecione outra data")
    }


    const chaveNovoPensamento=`${conteudo.trim().toLowerCase()}-${autoria.trim().toLowerCase()}`

    if (pensamentoSet.has(chaveNovoPensamento)) {
        alert("Esse pensamento já existe")
        return
    }

    try{
        if(id) {
            await api.editarPensamento({id, conteudo, autoria, data})

        }else{
            await api.salvarPensamentos({conteudo, autoria, data});
        }
        ui.renderizarPensamentos();

    } catch{
        alert("Erro ao salvar pensamento")
    }
}


function manipularCancelamento() {
    ui.limparFormulario();
}

async function manipularBusca(){
    const termoInput=document.getElementById("campo-busca").value;
    try {
        const pensamentosFiltrados= await api.buscarPensamentosPorTermo(termoInput);
        ui.renderizarPensamentos(pensamentosFiltrados);
        
    } catch (error) {
        alert("Erro ao realizar a busca")
    }
}

function validaData(data){
    const dataAtual= new Date();
    const dataInserida= new Date(data)

    return dataInserida<=dataAtual
}