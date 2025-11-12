let abertoPerfil = false;

function interagirMenuPerfil()
{
    abertoPerfil = !abertoPerfil;
    if (abertoPerfil)
        document.getElementById('perfil-menu-suspenso').classList.add('aberto');

    else
        document.getElementById('perfil-menu-suspenso').classList.remove('aberto');
}

let abertoOpcoes = false;

function interagirMenuOpcoes()
{
    abertoOpcoes = !abertoOpcoes;
    if (abertoOpcoes)
        document.getElementById('opcoes-menu-suspenso').classList.add('aberto');

    else
        document.getElementById('opcoes-menu-suspenso').classList.remove('aberto');
}


