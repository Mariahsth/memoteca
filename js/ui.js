import api from "./api.js"

const ui = {

    async preencherFormulario(pensamentoId){
        const pensamento=await api.buscarPensamentoPorId(pensamentoId);
        document.getElementById("pensamento-id").value=pensamento.id;
        document.getElementById("pensamento-conteudo").value=pensamento.conteudo;
        document.getElementById("pensamento-autoria").value=pensamento.autoria;
        document.getElementById("pensamento-data").value=pensamento.data.toISOString().split("T")[0];
        document.getElementById("form-container").scrollIntoView()


    },

    async renderizarPensamentos(pensamentosFiltrados=null){
        const listaPensamentos= document.getElementById("lista-pensamentos");
        const mensagemVazia = document.getElementById("mensagem-vazia");
        listaPensamentos.innerHTML= "";
        try {
            let pensamentosParaRenderizar;
            if (pensamentosFiltrados) {
                pensamentosParaRenderizar=pensamentosFiltrados;
            } else{
                pensamentosParaRenderizar= await api.buscarPensamentos();
            }
            if (pensamentosParaRenderizar.length===0){
                mensagemVazia.style.display = "block";
            } else {
                mensagemVazia.style.display = "none";
                pensamentosParaRenderizar.forEach(ui.adicionandoPensamentoNaLista)
            }
        } 
        catch {
            alert("Erro ao renderizar pensamentos");
        }
    },

    adicionandoPensamentoNaLista(pensamento){
        const listaPensamentos= document.getElementById("lista-pensamentos");
        
        const li=document.createElement("li");
        li.setAttribute("data-id", pensamento.id);
        li.classList.add("li-pensamento");

        const img=document.createElement("img");
        img.src="assets/imagens/aspas-azuis.png";
        img.alt="Aspas azuis";
        img.classList.add("icone-aspas");

        const pensamentoConteudo=document.createElement("div");
        pensamentoConteudo.textContent=pensamento.conteudo;
        pensamentoConteudo.classList.add("pensamento-conteudo");

        const pensamentoAutoria=document.createElement("div");
        pensamentoAutoria.textContent=pensamento.autoria;
        pensamentoAutoria.classList.add("pensamento-autoria");

        var options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC'
        }
        const dataFormatada = pensamento.data.toLocaleDateString('pt-BR', options)
        const pensamentoData=document.createElement("div");

        const dataComRegex=dataFormatada.replace(/^(\w)/, (letra)=> letra.toUpperCase())


        pensamentoData.textContent=dataComRegex;
        pensamentoData.classList.add("pensamento-data");


        const botaoEditar=document.createElement("button");
        botaoEditar.classList.add("botao-editar");
        botaoEditar.onclick=()=>ui.preencherFormulario(pensamento.id);

        const iconeEditar = document.createElement("img")
        iconeEditar.src = "assets/imagens/icone-editar.png"
        iconeEditar.alt = "Editar"
        botaoEditar.appendChild(iconeEditar)

        const botaoExcluir=document.createElement("button");
        botaoExcluir.classList.add("botao-excluir");
        botaoExcluir.onclick=async()=>{
            try {
                await api.excluirPensamento(pensamento);
            } catch (error) {
                alert("Erro ao excluir pensamento")
            }
        };

        const botaoFavoritar=document.createElement("button");
        botaoFavoritar.classList.add("botao-favorito");

        const iconeFavorito=document.createElement("img");
        iconeFavorito.src= pensamento.favorito? "assets/imagens/favorite.png":"assets/imagens/favorite_outline.png";
        iconeFavorito.alt="Favoritar"
        botaoFavoritar.appendChild(iconeFavorito)

        botaoFavoritar.onclick=async()=>{
            try {
                await api.atualizarFavorito(pensamento.id, !pensamento.favorito)
            } catch (error) {
                alert("Erro no botão favoritar")
            }
        }


        const iconeExcluir = document.createElement("img");
        iconeExcluir.src = "assets/imagens/icone-excluir.png";
        iconeExcluir.alt = "Excluir";
        botaoExcluir.appendChild(iconeExcluir);

        const icones = document.createElement("div");
        icones.classList.add("icones");
        icones.appendChild(botaoFavoritar)
        icones.appendChild(botaoEditar);
        icones.appendChild(botaoExcluir);

        li.appendChild(img);
        li.appendChild(pensamentoConteudo);
        li.appendChild(pensamentoAutoria);
        li.appendChild(pensamentoData)
        li.appendChild(icones);
        listaPensamentos.appendChild(li);
    },

    limparFormulario() {
        document.getElementById("pensamento-form").reset();
    }

}

export default ui;