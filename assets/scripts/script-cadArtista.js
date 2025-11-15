/* Contador de carecteres */
const CHARACTER_LIMITS = {
    nome: 50,
    bio: 1000,
};

function updateCharacterCount(fieldId) {
    const field = document.getElementById(fieldId);
    const countElement = document.getElementById(`${fieldId}Count`);
    
    if (!field || !countElement) return;
    
    const currentLength = field.value.length;
    const maxLength = CHARACTER_LIMITS[fieldId] || 1000;

    countElement.textContent = currentLength;
    
    const percentage = (currentLength / maxLength) * 100;

    field.classList.remove('near-limit', 'at-limit');
    
    if (percentage >= 100) {
        countElement.style.color = '#ef4444';
        countElement.parentElement.style.color = '#ef4444';
        field.classList.add('at-limit');
    } else if (percentage >= 90) {
        countElement.style.color = '#f59e0b';
        countElement.parentElement.style.color = '#f59e0b';
        field.classList.add('near-limit');
    } else {
        countElement.style.color = 'rgba(255, 255, 255, 0.6)';
        countElement.parentElement.style.color = 'rgba(255, 255, 255, 0.6)';
    }
}

/* Limite de carecteress */
function enforceCharacterLimit(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const maxLength = CHARACTER_LIMITS[fieldId];
    if (!maxLength) return;
    
    field.addEventListener('input', function() {
        if (this.value.length > maxLength) {
            this.value = this.value.substring(0, maxLength);
        }
        updateCharacterCount(fieldId);
    });
   
    field.addEventListener('paste', function(e) {
        setTimeout(() => {
            if (this.value.length > maxLength) {
                this.value = this.value.substring(0, maxLength);
                updateCharacterCount(fieldId);
                showLimitWarning(fieldId);
            }
        }, 10);
    });
}

function showLimitWarning(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const existingWarning = field.parentElement.querySelector('.limit-warning');
    if (existingWarning) {
        existingWarning.remove();
    }
    
    const warning = document.createElement('div');
    warning.className = 'limit-warning';
    warning.style.cssText = `
        color: #ef4444;
        font-size: 12px;
        margin-top: 4px;
        animation: slideIn 0.3s ease;
    `;
    warning.textContent = 'Limite de caracteres atingido!';
    
    field.parentElement.appendChild(warning);
    
    setTimeout(() => {
        warning.style.opacity = '0';
        warning.style.transition = 'opacity 0.3s ease';
        setTimeout(() => warning.remove(), 300);
    }, 3000);
}

function initCharacterCounters() {

    const fieldsWithCounter = [
        'nome', 'bio'
    ];
    
    fieldsWithCounter.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {

            updateCharacterCount(fieldId);
            
            enforceCharacterLimit(fieldId);
            
            field.addEventListener('input', () => updateCharacterCount(fieldId));
        }
    });
}

/* Menu mobile */
function toggleMobileMenu() {
    const navMobile = document.getElementById('navMobile');
    const overlay = document.getElementById('mobileMenuOverlay');
    const body = document.body;
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');
    
    if (!navMobile || !overlay) return;
    
    const isActive = navMobile.classList.contains('active');
    
    navMobile.classList.toggle('active', !isActive);
    overlay.classList.toggle('active', !isActive);
    body.classList.toggle('menu-open', !isActive);
    
    if (menuIcon) menuIcon.style.display = isActive ? 'block' : 'none';
    if (closeIcon) closeIcon.style.display = isActive ? 'none' : 'block';
}

/* Autenticação */
function updateAuthButtons() {
    const isLoggedIn = localStorage.getItem('userLoggedIn');
    const buttons = ['btnSignIn', 'btnSignInMobile'];
    
    buttons.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.textContent = isLoggedIn ? 'Sair' : 'Entrar';
            btn.onclick = isLoggedIn ? handleSignOut : handleSignIn;
        }
    });
}

function handleSignIn() {
    window.location.href = '../index.html';
}

function handleSignOut() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userData');
        alert('Você saiu com sucesso!');
        window.location.href = '../view/pagInicial.html';
    }
}

/* Validação */
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateDuration(duration) {
    return /^\d{1,2}:\d{2}$/.test(duration);
}

function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function setupInputValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"], input[id="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                this.style.borderColor = 'rgba(255, 50, 50, 0.5)';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });

    const durationInput = document.getElementById('duracao');
    if (durationInput) {
        durationInput.addEventListener('blur', function() {
            if (this.value && !validateDuration(this.value)) {
                this.style.borderColor = 'rgba(255, 50, 50, 0.5)';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
    }

    const urlInputs = document.querySelectorAll('input[type="url"]');
    urlInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateURL(this.value)) {
                this.style.borderColor = 'rgba(255, 50, 50, 0.5)';
            } else {
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }
        });
    });
}

/* Formulário artista */
function setupFormArtista() {
    const form = document.getElementById('formArtista');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const instagram = document.getElementById('instagram').value;

        if (!nome || !instagram) {
            alert('Por favor, preencha os campos obrigatórios.');
            return;
        }
        
        const urlFields = ['instagram', 'twitter', 'tiktok', 'website'];
        for (const field of urlFields) {
            const input = document.getElementById(field);
            if (input && input.value && !validateURL(input.value)) {
                alert(`Por favor, insira uma URL válida no campo ${field}.`);
                input.focus();
                return;
            }
        }

        const formData = {
            nome,
            genero: document.getElementById('genero')?.value,
            bio: document.getElementById('bio')?.value,
            instagram,
            twitter: document.getElementById('twitter')?.value,
            tiktok: document.getElementById('tiktok')?.value,
            website: document.getElementById('website')?.value,
            dataCadastro: new Date().toISOString()
        };

        console.log('Dados do artista:', formData);
        
        showSuccessMessage('Perfil de artista criado com sucesso!', `Nome: ${formData.nome}`);
        
        setTimeout(() => {
            form.reset();
            initCharacterCounters();
        }, 2000);
    });
}

/* Formulário música */
function setupFormMusica() {
    const form = document.getElementById('formMusica');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const titulo = document.getElementById('titulo').value;
        const artista = document.getElementById('artista').value;
        const album = document.getElementById('album').value;
        const tipo = document.getElementById('tipo').value;
        const audioFile = document.getElementById('audio').files[0];

        if (!titulo || !artista || !album || !tipo) {
            alert('Por favor, preencha os campos obrigatórios.');
            return;
        }

        if (!audioFile) {
            alert('Por favor, selecione um arquivo de áudio.');
            return;
        }

        const maxSize = 50 * 1024 * 1024;
        if (audioFile.size > maxSize) {
            alert('O arquivo de áudio é muito grande. Tamanho máximo: 50MB');
            return;
        }
        
        const duracao = document.getElementById('duracao')?.value;
        if (duracao && !validateDuration(duracao)) {
            alert('Por favor, insira a duração no formato correto (ex: 3:45).');
            return;
        }

        const formData = {
            titulo,
            artista,
            album,
            tipo,
            genero: document.getElementById('generoMusica')?.value,
            ano: document.getElementById('ano')?.value,
            duracao: duracao,
            letra: document.getElementById('letra')?.value,
            audioNome: audioFile.name,
            audioTamanho: audioFile.size,
            dataCadastro: new Date().toISOString()
        };

        console.log('Dados da música:', formData);
        
        showSuccessMessage('Música cadastrada com sucesso!', `Título: ${formData.titulo}`);
        
        setTimeout(() => {
            form.reset();
            initCharacterCounters();
        }, 2000);
    });

    ['audio', 'capa'].forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('change', function() {
                if (this.files.length > 0) {
                    const file = this.files[0];
                    const fileSize = (file.size / (1024 * 1024)).toFixed(2);
                    console.log(`${inputId} selecionado:`, file.name, `(${fileSize}MB)`);
                    
                    const label = this.parentElement.querySelector('.form-label');
                    if (label) {
                        label.style.color = '#10b981';
                        setTimeout(() => {
                            label.style.color = '';
                        }, 2000);
                    }
                }
            });
        }
    });
}

/* Mensagem de sucesso */
function showSuccessMessage(title, subtitle) {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 32px 48px;
            border-radius: 16px;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
            text-align: center;
            animation: scaleIn 0.3s ease;
        ">
            <div style="font-size: 48px; margin-bottom: 16px;">✓</div>
            <div style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">${title}</div>
            <div style="font-size: 14px; opacity: 0.9;">${subtitle}</div>
        </div>
        <style>
            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        </style>
    `;

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'scaleOut 0.3s ease';
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            message.remove();
            overlay.remove();
        }, 300);
    }, 2000);
}

/* Controle video */
function setupVideoControls() {
    const heroVideo = document.getElementById('heroVideo');
    const videoControl = document.getElementById('videoControl');
    
    if (videoControl && heroVideo) {
        let isPlaying = true;
        
        videoControl.addEventListener('click', function() {
            const pauseIcon = this.querySelector('.pause-icon');
            const playIcon = this.querySelector('.play-icon');
            
            if (isPlaying) {
                heroVideo.pause();
                pauseIcon?.classList.add('hidden');
                playIcon?.classList.remove('hidden');
            } else {
                heroVideo.play();
                pauseIcon?.classList.remove('hidden');
                playIcon?.classList.add('hidden');
            }
            isPlaying = !isPlaying;
        });
    }

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(err => console.log('Video autoplay failed:', err));
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.video-section').forEach(video => {
        videoObserver.observe(video);
    });
}

/* Efeitos para o scroll */
function setupScrollEffects() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });
}

/* Navegação */
function setupNavigation() {
    document.querySelectorAll('.nav-card').forEach(card => {
        card.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });

    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
    }
    
    document.querySelectorAll('.nav-mobile .nav-link').forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                const navMobile = document.getElementById('navMobile');
                const overlay = document.getElementById('mobileMenuOverlay');
                const body = document.body;
                
                navMobile?.classList.remove('active');
                overlay?.classList.remove('active');
                body.classList.remove('menu-open');
            }
        }, 250);
    });
}

/* Botões */
function setupButtons() {
    
    ['btnGetStarted', 'btnGetStartedMobile'].forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function() {
                window.location.href = '../view/cadastrarArtista-pg2.html';
            });
        }
    });
}

/* Inicialização */
document.addEventListener('DOMContentLoaded', function() {
    updateAuthButtons();
    setupNavigation();
    setupButtons();
    setupVideoControls();
    setupScrollEffects();
    setupInputValidation();
    setupFormArtista();
    setupFormMusica();
    
    initCharacterCounters();
    
    console.log('✅ Sistema Giana Station inicializado com contadores');
});