function cadastrarSenha(event) {
    event.preventDefault();
    window.location.href = "../view/criarSenha.html";
}

function retornarCad() {
    window.location.href = "../view/cadastrarUsuario.html";
}


document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const visualizacaoSenha = document.getElementById('visualizacaoSenha');
    const verSenha = document.getElementById('verSenha');
    const esconderSenha = document.getElementById('esconderSenha');
    const submitBtn = document.getElementById('submitBtn');
    const checkLetra = document.getElementById('checkLetra');
    const checkEspecial = document.getElementById('checkEspecial');
    const checkTamanho = document.getElementById('checkTamanho');
    const formSenha = document.getElementById('formSenha');

    if (!passwordInput) return;
    
    let mostrarSenha = false;

    visualizacaoSenha.addEventListener('click', () => {
        mostrarSenha = !mostrarSenha;
        passwordInput.type = mostrarSenha ? 'text' : 'password';
        verSenha.style.display = mostrarSenha ? 'none' : 'block';
        esconderSenha.style.display = mostrarSenha ? 'block' : 'none';
    });

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;

        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumberOrSpecial = /[0-9#?!&@$%^*()_+\-=[\]{}|;:,.<>?]/.test(password);
        const hasMinLength = password.length >= 10;

        checkLetra.classList.toggle('valid', hasLetter);
        checkEspecial.classList.toggle('valid', hasNumberOrSpecial);
        checkTamanho.classList.toggle('valid', hasMinLength);

        const isValid = hasLetter && hasNumberOrSpecial && hasMinLength;
        submitBtn.disabled = !isValid;
    });

    formSenha.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = "../view/infoUsuario.html";
    });
});


function retornarSenha() {
    window.location.href = "../view/criarSenha.html";
}

document.addEventListener('DOMContentLoaded', function() {
    const formInfo = document.getElementById('formInfo');
    const submitBtn = document.getElementById('submitBtn');
    const nomeInput = document.getElementById('nome');
    const diaInput = document.getElementById('dia');
    const mesSelect = document.getElementById('mes');
    const anoInput = document.getElementById('ano');
    const generoRadios = document.querySelectorAll('input[name="genero"]');

    diaInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        validarFormulario();
    });

    anoInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        validarFormulario();
    });

    nomeInput.addEventListener('input', validarFormulario);
    mesSelect.addEventListener('change', validarFormulario);
    generoRadios.forEach(radio => {
        radio.addEventListener('change', validarFormulario);
    });

    function validarFormulario() {
        const nome = nomeInput.value.trim();
        const dia = diaInput.value;
        const mes = mesSelect.value;
        const ano = anoInput.value;
        const generoSelecionado = document.querySelector('input[name="genero"]:checked');

        const diaValido = dia.length === 2 && parseInt(dia) >= 1 && parseInt(dia) <= 31;
        const mesValido = mes !== '';
        const anoValido = ano.length === 4 && parseInt(ano) >= 1900 && parseInt(ano) <= new Date().getFullYear();

        const isValid = nome !== '' && 
                       diaValido && 
                       mesValido && 
                       anoValido && 
                       generoSelecionado !== null;

        submitBtn.disabled = !isValid;
    }

    formInfo.addEventListener('submit', function(e) {
        e.preventDefault();
        window.location.href = "../view/TermosCondicoes.html"; 
    });
});