let artista;


function redirecionarAlbum(elemento)
{
    let infos = elemento.children;
    console.log(infos);

    let imagem = infos[0].children[0].currentSrc; 
    let nome = infos[1].children[0].childNodes[0].data;
    artista = infos[1].children[1].childNodes[0].data;
    
    window.location.assign("visualizarMusica.html");
}

function atualizarDados()
{
    console.log(artista);
    if(artista)
        document.getElementById("nome-artista").textContent = `${artista}`;
}

function pegarDados()
{
    console.log(artistaNome);
    artistaNome.textContent = "Giovana";
    return artistaNome;
}
