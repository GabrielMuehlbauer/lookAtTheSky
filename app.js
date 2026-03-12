// --- Elementos do HTML ---
const searchBar = document.getElementById("search-bar");
const gallery = document.getElementById("gallery");
const detailsSection = document.getElementById("details");
const detailsContent = document.getElementById("details-content");
const btnLoadMore = document.getElementById("btn-load-more");

// --- Configurações da API ---
const API_URL = "https://api.nasa.gov/planetary/apod";
const API_KEY = "PXSKhwDmEQIJ3c7e3qHW2sVK0ehzt1XcLyVTxQUS"; 

let fotosNASA = [];

// --- 1. Busca os Dados na NASA ---
async function loadItems() {
    // Muda o texto do botão para dar feedback visual
    btnLoadMore.innerText = "A carregar...";
    btnLoadMore.disabled = true;

    const url = `${API_URL}?api_key=${API_KEY}&count=10`; 
    
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erro na comunicação com a API: " + res.status);
        const data = await res.json();
        
        // Filtra as novas imagens
        const novasFotos = data.filter(item => item.media_type === 'image');
        
        // Adiciona as novas fotos à lista que já existia (usando o operador spread ...)
        fotosNASA = [...fotosNASA, ...novasFotos];
        
        // Renderiza aplicando o filtro de pesquisa atual (caso o utilizador tenha algo escrito)
        aplicarFiltro();

    } catch (error) {
        console.error(error);
        alert("Não foi possível carregar mais imagens no momento.");
    } finally {
        // Restaura o botão independentemente de dar erro ou sucesso
        btnLoadMore.innerText = "Descobrir mais galáxias";
        btnLoadMore.disabled = false;
    }
}

// --- 2. Cria as Imagens no Ecrã ---
function renderizarFotos(listaDeFotos) {
    gallery.innerHTML = ""; 

    if (listaDeFotos.length === 0) {
        gallery.innerHTML = "<p>Nenhuma imagem encontrada.</p>";
        btnLoadMore.style = "display: none;"
        return;
    }

    listaDeFotos.forEach(foto => {
        const imgElement = document.createElement("img");
        imgElement.src = foto.url;
        imgElement.alt = foto.title;
        imgElement.className = "gallery-item"; 
        
        imgElement.addEventListener("click", () => abrirDetalhes(foto));
        
        gallery.appendChild(imgElement);
    });
}

// --- 3. Filtro de Pesquisa ---
function aplicarFiltro() {
    const textoPesquisa = searchBar.value.toLowerCase();
    const fotosFiltradas = fotosNASA.filter(foto => 
        foto.title.toLowerCase().includes(textoPesquisa)
    );
    renderizarFotos(fotosFiltradas);
}

searchBar.addEventListener("input", aplicarFiltro);

// --- 4. Evento do Botão Carregar Mais ---
btnLoadMore.addEventListener("click", loadItems);

// --- 5. Abrir e Fechar Detalhes ---
function abrirDetalhes(foto) {
    detailsContent.querySelector("h2").innerText = foto.title;
    detailsContent.querySelector("h3").innerText = foto.copyright ? `Autor: ${foto.copyright}` : "Autor: NASA / Domínio Público";
    
    const paragrafos = detailsContent.querySelectorAll("p");
    paragrafos[0].innerText = `Data: ${foto.date}`;
    paragrafos[1].innerText = foto.explanation;
    
    detailsContent.querySelector("img").src = foto.url;
    detailsContent.querySelector("img").alt = foto.title;

    detailsSection.style.display = "flex";
}

detailsSection.addEventListener("click", (evento) => {
    if (evento.target === detailsSection) {
        detailsSection.style.display = "none";
    }
});

// --- Inicia o Aplicativo ---
loadItems();