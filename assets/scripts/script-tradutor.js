/* Tradutor com a API MyMemory */

// Configuração de idiomas disponíveis
const availableLanguages = {
  "pt-BR": { name: "Português do Brasil", code: "pt-BR" },
  "en-GB": { name: "English", code: "en-GB" },
  "es-ES": { name: "Español", code: "es-ES" },
  "fr-FR": { name: "Français", code: "fr-FR" },
  "de-DE": { name: "Deutsch", code: "de-DE" },
  "it-IT": { name: "Italiano", code: "it-IT" },
  "ja-JP": { name: "日本語", code: "ja-JP" }
};

// Idioma padrão
let currentLang = localStorage.getItem('gianaLang') || 'pt-BR';

// Cache de traduções com limite de tamanho
const MAX_CACHE_SIZE = 500;
const translationCache = {};
let cacheSize = 0;

// Mapeamento de elementos e seus textos originais
const originalTexts = new Map();

/* Limpa o cache quando atinge o limite */
function clearOldCache() {
  if (cacheSize >= MAX_CACHE_SIZE) {
    const keys = Object.keys(translationCache);

    for (let i = 0; i < 100 && i < keys.length; i++) {
      delete translationCache[keys[i]];
      cacheSize--;
    }
    console.log('🗑️ Cache de tradução limpo');
  }
}

async function translateText(text, fromLang, toLang) {

  if (fromLang === toLang) {
    return text;
  }

  const cacheKey = `${text}_${fromLang}_${toLang}`;
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
    );
    const data = await response.json();
    const translation = data.responseData.translatedText;
    
    clearOldCache();
    translationCache[cacheKey] = translation;
    cacheSize++;
    
    return translation;
  } catch (error) {
    console.error('Erro na tradução:', error);
    return text; 
  }
}

async function translateBatch(texts, fromLang, toLang) {
  const translations = [];
  
  for (const text of texts) {
    const translated = await translateText(text, fromLang, toLang);
    translations.push(translated);
    
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  
  return translations;
}


function saveOriginalTexts() {
  document.querySelectorAll('[data-translate]').forEach(element => {
    if (!originalTexts.has(element)) {
      const originalText = element.tagName === 'INPUT' || element.tagName === 'TEXTAREA'
        ? element.placeholder
        : element.textContent.trim();
      
      originalTexts.set(element, {
        text: originalText,
        type: element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' ? 'placeholder' : 'textContent'
      });
    }
  });
}


function observeDynamicElements() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { 

          if (node.hasAttribute && node.hasAttribute('data-translate')) {
            saveOriginalTexts();
          }
          
          if (node.querySelectorAll) {
            node.querySelectorAll('[data-translate]').forEach(() => {
              saveOriginalTexts();
            });
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}


async function translatePage(targetLang) {
  if (targetLang === 'pt-BR') {
    restoreOriginalTexts();
    return;
  }

  const elementsToTranslate = document.querySelectorAll('[data-translate]');
  const textsToTranslate = [];
  const elementsArray = [];

  elementsToTranslate.forEach(element => {
    const original = originalTexts.get(element);
    if (original && original.text) {
      textsToTranslate.push(original.text);
      elementsArray.push(element);
    }
  });

  if (textsToTranslate.length === 0) return;

  const translations = await translateBatch(textsToTranslate, 'pt-BR', targetLang);

  elementsArray.forEach((element, index) => {
    const original = originalTexts.get(element);
    if (original.type === 'placeholder') {
      element.placeholder = translations[index];
    } else {
      element.textContent = translations[index];
    }
  });
}

function restoreOriginalTexts() {
  originalTexts.forEach((original, element) => {
    if (original.type === 'placeholder') {
      element.placeholder = original.text;
    } else {
      element.textContent = original.text;
    }
  });
}

function updateLanguageButtonText() {
  const languageName = availableLanguages[currentLang].name;
  
  ['languageText', 'languageTextFooter', 'languageTextMobile'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = languageName;
    }
  });

  const langCode = currentLang.toLowerCase().split('-')[0];
  document.documentElement.setAttribute('lang', langCode);
}

function createLanguageModal() {
  
  const existingModal = document.getElementById('languageModal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'languageModal';
  modal.style.cssText = `
    display: none;
    position: fixed;
    z-index: 10000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    backdrop-filter: blur(8px);
    animation: fadeIn 0.3s ease;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
    margin: 5% auto;
    padding: 2rem;
    border: 1px solid rgba(213, 24, 238, 0.3);
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 8px 32px rgba(213, 24, 238, 0.3);
    position: relative;
    animation: slideDown 0.3s ease;
  `;

  const title = document.createElement('h2');
  title.textContent = 'Selecione o idioma / Select language';
  title.style.cssText = `
    color: white;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    text-align: center;
    font-weight: 600;
  `;

  const languageList = document.createElement('div');
  languageList.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 8px;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideInRight {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100px); opacity: 0; }
    }
    #languageModal div::-webkit-scrollbar {
      width: 8px;
    }
    #languageModal div::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }
    #languageModal div::-webkit-scrollbar-thumb {
      background: rgba(213, 24, 238, 0.5);
      border-radius: 4px;
    }
    #languageModal div::-webkit-scrollbar-thumb:hover {
      background: rgba(213, 24, 238, 0.7);
    }
  `;
  document.head.appendChild(style);

  Object.entries(availableLanguages).forEach(([code, lang]) => {
    const button = document.createElement('button');
    const isActive = code === currentLang;
    
    button.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <span>${lang.name}</span>
        ${isActive ? '<span style="color: #d518ee;">✓</span>' : ''}
      </div>
    `;
    
    button.style.cssText = `
      background: ${isActive ? 'linear-gradient(135deg, #d518ee 0%, #e88bf5 100%)' : 'rgba(255, 255, 255, 0.05)'};
      color: white;
      border: 1px solid ${isActive ? '#d518ee' : 'rgba(255, 255, 255, 0.1)'};
      padding: 1rem 1.25rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: ${isActive ? '600' : '400'};
      text-align: left;
    `;

    button.addEventListener('mouseenter', () => {
      if (!isActive) {
        button.style.background = 'rgba(255, 255, 255, 0.1)';
        button.style.borderColor = 'rgba(213, 24, 238, 0.5)';
        button.style.transform = 'translateX(4px)';
      }
    });

    button.addEventListener('mouseleave', () => {
      if (!isActive) {
        button.style.background = 'rgba(255, 255, 255, 0.05)';
        button.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        button.style.transform = 'translateX(0)';
      }
    });

    button.addEventListener('click', () => {
      changeLanguage(code);
      closeLanguageModal();
    });

    languageList.appendChild(button);
  });

  const closeButton = document.createElement('button');
  closeButton.textContent = '✕';
  closeButton.style.cssText = `
    position: absolute;
    right: 1rem;
    top: 1rem;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
  `;
  closeButton.addEventListener('mouseenter', () => {
    closeButton.style.color = '#d518ee';
    closeButton.style.background = 'rgba(213, 24, 238, 0.1)';
  });
  closeButton.addEventListener('mouseleave', () => {
    closeButton.style.color = 'rgba(255, 255, 255, 0.6)';
    closeButton.style.background = 'transparent';
  });
  closeButton.addEventListener('click', closeLanguageModal);

  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(languageList);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeLanguageModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeLanguageModal();
    }
  });
}

function openLanguageModal() {
  const modal = document.getElementById('languageModal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
}

function closeLanguageModal() {
  const modal = document.getElementById('languageModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

async function changeLanguage(newLang) {
  if (currentLang === newLang) return;
  
  currentLang = newLang;
  localStorage.setItem('gianaLang', newLang);
  
  showLoadingIndicator();
  
  try {
    
    await translatePage(newLang);
    
    updateLanguageButtonText();
    
    showSuccessMessage();
  } catch (error) {
    console.error('Erro ao mudar idioma:', error);
    showErrorMessage();
  } finally {
    hideLoadingIndicator();
  }
}

function showLoadingIndicator() {
  let indicator = document.getElementById('translationLoading');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'translationLoading';
    indicator.innerHTML = `
      <div style="
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #d518ee 0%, #e88bf5 100%);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(213, 24, 238, 0.4);
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
      ">
        <div style="
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        "></div>
        Traduzindo página...
      </div>
      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    `;
    document.body.appendChild(indicator);
  }
}

function hideLoadingIndicator() {
  const indicator = document.getElementById('translationLoading');
  if (indicator) {
    indicator.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => indicator.remove(), 300);
  }
}

function showSuccessMessage() {
  const message = document.createElement('div');
  message.innerHTML = `
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
      Idioma alterado com sucesso!
    </div>
  `;
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => message.remove(), 300);
  }, 2000);
}

function showErrorMessage() {
  const message = document.createElement('div');
  message.innerHTML = `
    <div style="
      position: fixed;
      top: 80px;
      right: 20px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
      font-size: 14px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideInRight 0.3s ease;
    ">
      <span style="font-size: 18px;">⚠</span>
      Erro ao traduzir. Tente novamente.
    </div>
  `;
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => message.remove(), 300);
  }, 3000);
}

/* Inicialização */
async function initTranslationSystem() {
  
  saveOriginalTexts();
  
  observeDynamicElements();
  
  createLanguageModal();
  
  ['languageBtn', 'languageBtnMobile', 'languageBtnFooter'].forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openLanguageModal();
      });
    }
  });

  updateLanguageButtonText();

  if (currentLang !== 'pt-BR') {
    showLoadingIndicator();
    try {
      await translatePage(currentLang);
    } catch (error) {
      console.error('Erro ao carregar tradução:', error);
    } finally {
      hideLoadingIndicator();
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTranslationSystem);
} else {
  initTranslationSystem();
}

window.GianaTranslation = {
  changeLanguage,
  getCurrentLanguage: () => currentLang,
  translateText,
  openLanguageModal,
  closeLanguageModal,
  availableLanguages
};