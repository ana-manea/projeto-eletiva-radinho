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

function setupMobileMenu() {
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

/* Contador de caracteres */
const CHARACTER_LIMITS = {
    bio: 1000,
    artistName: 50,
    location: 100,
    genres: 100,
    website: 200,
    instagram: 50,
    twitter: 50,
    tiktok: 50
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

/* Limite de caracteres */
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
    
    const charCount = field.parentElement.querySelector('.char-count');
    if (charCount) {
        charCount.parentElement.insertBefore(warning, charCount.nextSibling);
    }
    
    setTimeout(() => {
        warning.style.opacity = '0';
        warning.style.transition = 'opacity 0.3s ease';
        setTimeout(() => warning.remove(), 300);
    }, 3000);
}

function initCharacterCounters() {
    const fieldsWithCounter = ['bio', 'artistName', 'location', 'genres', 'website', 'instagram', 'twitter', 'tiktok'];
    
    fieldsWithCounter.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            
            updateCharacterCount(fieldId);
            
            enforceCharacterLimit(fieldId);
            
            field.addEventListener('input', () => updateCharacterCount(fieldId));
        }
    });
}

/* Editar perfil */
function setupProfileEditing() {
    const btnEdit = document.getElementById('btnEdit');
    const btnCancel = document.getElementById('btnCancel');
    const btnSave = document.getElementById('btnSave');
    const headerActions = document.getElementById('headerActions');
    const headerActionsEditing = document.getElementById('headerActionsEditing');
    const uploadHeaderBtn = document.getElementById('uploadHeaderBtn');
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    
    const editableFields = [
        'artistName', 'bio', 'location', 'genres', 
        'website', 'instagram', 'twitter', 'tiktok'
    ];
    
    let originalValues = {};
   
    function enableEditMode() {
       
        editableFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                originalValues[fieldId] = field.value;
                field.disabled = false;
                field.style.cursor = 'text';
            }
        });
        
        if (headerActions) headerActions.style.display = 'none';
        if (headerActionsEditing) headerActionsEditing.style.display = 'flex';
        if (uploadHeaderBtn) uploadHeaderBtn.style.display = 'flex';
        if (uploadAvatarBtn) uploadAvatarBtn.style.display = 'flex';
        
        const firstField = document.getElementById('artistName');
        if (firstField) firstField.focus();
    }
    
    function disableEditMode() {
        editableFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.disabled = true;
                field.style.cursor = 'default';
                field.classList.remove('near-limit', 'at-limit');
            }
        });
        
        if (headerActions) headerActions.style.display = 'flex';
        if (headerActionsEditing) headerActionsEditing.style.display = 'none';
        if (uploadHeaderBtn) uploadHeaderBtn.style.display = 'none';
        if (uploadAvatarBtn) uploadAvatarBtn.style.display = 'none';
    }
    
    function restoreOriginalValues() {
        editableFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && originalValues[fieldId] !== undefined) {
                field.value = originalValues[fieldId];
                updateCharacterCount(fieldId);
            }
        });
    }
    
    function showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.innerHTML = `
            <div style="
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
                font-size: 14px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideInRight 0.3s ease;
            ">
                <span style="font-size: 18px;">✓</span>
                ${message}
            </div>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    if (btnEdit) {
        btnEdit.addEventListener('click', enableEditMode);
    }
    
    if (btnCancel) {
        btnCancel.addEventListener('click', () => {
            restoreOriginalValues();
            disableEditMode();
        });
    }
    
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            console.log('Salvando perfil...');
            
            editableFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    originalValues[fieldId] = field.value;
                }
            });
            
            showSuccessMessage('Perfil atualizado com sucesso!');
            disableEditMode();
        });
    }
    
    setupImageUpload();
}

/* Envio de imagem */
function setupImageUpload() {
    const uploadHeaderBtn = document.getElementById('uploadHeaderBtn');
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    const headerImageInput = document.getElementById('headerImageInput');
    const avatarImageInput = document.getElementById('avatarImageInput');
    const headerBackground = document.getElementById('headerBackground');
    const profileAvatar = document.getElementById('profileAvatar');
    const navAvatar = document.getElementById('navAvatar');
    
    if (uploadHeaderBtn && headerImageInput) {
        uploadHeaderBtn.addEventListener('click', () => {
            headerImageInput.click();
        });
        
        headerImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (headerBackground) {
                        headerBackground.style.backgroundImage = `url(${e.target.result})`;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (uploadAvatarBtn && avatarImageInput) {
        uploadAvatarBtn.addEventListener('click', () => {
            avatarImageInput.click();
        });
        
        avatarImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (profileAvatar) {
                        profileAvatar.src = e.target.result;
                    }
                    if (navAvatar) {
                        navAvatar.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

/* Iniciando o sistema */
document.addEventListener('DOMContentLoaded', function() {
    setupMobileMenu();
    
    if (window.location.pathname.includes('perfil')) {
        initCharacterCounters();
        setupProfileEditing();
    }
    
    const path = window.location.pathname;
    
    if (path.includes('homeArtista')) {
        
    } else if (path.includes('musica')) {
        
    } else if (path.includes('audiencia')) {
        
    } else if (path.includes('perfil')) {
        
    }
    
    setTimeout(() => {
    }, 100);
});