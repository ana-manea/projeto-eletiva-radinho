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
        window.location.href = "infoUsuario.html";
    });
});