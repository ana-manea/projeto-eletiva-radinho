

function abrirEdicao()
{
    document.getElementById('pop-up').style.display = "flex";
    document.body.style.overflow = "hidden";
}

function fecharEdicao()
{
    document.getElementById('pop-up').style.display = "none";
    document.body.style.overflow = "auto";
}

function redirecionarFoto()
{
    abrirEdicao();
    inputFoto.click();
}
