// main.js
let currentImage = 1;
const maxImages = 39;

let dogmaCount = 0;
let scienceCount = 0;

// Controle de estado
let isLoading = false;
let isEnding = false;
let clickCooldown = false;

// Fila de ações pendentes
let pendingAction = null;

// Elementos DOM
const elements = {
    dogmaBtn: document.getElementById('dogma_button'),
    scienceBtn: document.getElementById('science_button'),
    image: document.getElementById('image'),
    dogmaText: document.getElementById('dogma_count'),
    scienceText: document.getElementById('science_count'),
    certificado: document.getElementById('certificado'),
    aiaiAudio: document.getElementById('aiaiAudio'),
    totalDogmas: document.getElementById('total_dogmas'),
    totalSciences: document.getElementById('total_sciences'),
    currentImageText: document.getElementById('current_image'),
    confettiContainer: document.getElementById('confetti-container')
};

// Inicialização
function init() {
    loadImage();
    setupEventListeners();
    
    // Pré-carregar próxima imagem para ser mais rápido
    preloadNextImage();
}

function setupEventListeners() {
    elements.dogmaBtn.addEventListener('click', () => handleButtonClick('dogma'));
    elements.scienceBtn.addEventListener('click', () => handleButtonClick('science'));
}

function handleButtonClick(type) {
    // Prevenir cliques durante carregamento ou fim do jogo
    if (isLoading || isEnding || clickCooldown) {
        // Feedback visual de que o clique foi ignorado
        showIgnoredFeedback(type);
        return;
    }
    
    // Ativar cooldown
    clickCooldown = true;
    
    // Desabilitar botões durante o carregamento
    setButtonsDisabled(true);
    
    // Tocar feedback visual
    showFeedback(type);
    
    // Processar ação
    processAction(type);
    
    // Resetar cooldown após tempo suficiente
    setTimeout(() => {
        clickCooldown = false;
        if (!isLoading && !isEnding) {
            setButtonsDisabled(false);
        }
    }, 150); // 300ms é geralmente suficiente para carregamento
}

function setButtonsDisabled(disabled) {
    elements.dogmaBtn.disabled = disabled;
    elements.scienceBtn.disabled = disabled;
}

function showIgnoredFeedback(type) {
    const button = type === 'dogma' ? elements.dogmaBtn : elements.scienceBtn;
    
    // Feedback visual rápido
    button.style.opacity = '0.5';
    setTimeout(() => {
        button.style.opacity = '1';
    }, 150);
    
    // Pequena vibração para indicar que o clique foi ignorado
    button.style.transform = 'translateX(2px)';
    setTimeout(() => {
        button.style.transform = 'translateX(-2px)';
        setTimeout(() => {
            button.style.transform = 'translateX(0)';
        }, 50);
    }, 50);
}

function processAction(type) {
    if (currentImage < maxImages) {
        // Atualizar contador
        updateCount(type);
        
        // Avançar imagem
        currentImage++;
        
        // Mostrar loading state
        showLoadingState();
        
        // Carregar nova imagem
        loadImageWithCallback(() => {
            // Esconder loading state
            hideLoadingState();
            
            // Pré-carregar próxima imagem
            if (currentImage < maxImages) {
                preloadNextImage();
            }
            
            // Se não estiver no fim, reabilitar botões
            if (currentImage < maxImages && !isEnding) {
                setButtonsDisabled(false);
            }
            
            isLoading = false;
        });
        
    } else if (currentImage === maxImages && !isEnding) {
        // Última imagem - processar clique final
        updateCount(type);
        end();
    }
}

function showLoadingState() {
    isLoading = true;
    elements.image.style.opacity = '0.5';
    
    // Mostrar indicador de loading (opcional)
    const loader = document.createElement('div');
    loader.id = 'image-loader';
    loader.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        z-index: 100;
    `;
    
    // Remover loader anterior se existir
    const oldLoader = document.getElementById('image-loader');
    if (oldLoader) oldLoader.remove();
    
    elements.image.parentElement.style.position = 'relative';
    elements.image.parentElement.appendChild(loader);
}

function hideLoadingState() {
    elements.image.style.opacity = '1';
    const loader = document.getElementById('image-loader');
    if (loader) loader.remove();
}

function loadImageWithCallback(callback) {
    // Criar nova imagem para pré-carregar
    const img = new Image();
    
    // Timeout para evitar loading infinito
    const timeout = setTimeout(() => {
        console.warn('Timeout ao carregar imagem');
        callback();
    }, 5000);
    
    img.onload = () => {
        clearTimeout(timeout);
        
        // Atualizar src da imagem principal
        elements.image.src = img.src;
        elements.image.alt = `Imagem ${currentImage} sobre dogma ou ciência`;
        elements.currentImageText.textContent = `${currentImage}/${maxImages}`;
        
        callback();
    };
    
    img.onerror = () => {
        clearTimeout(timeout);
        console.error('Erro ao carregar imagem');
        
        // Tentar novamente ou pular
        elements.image.src = `images/img${currentImage}.jpg`;
        elements.image.alt = `Imagem ${currentImage}`;
        
        callback();
    };
    
    // Iniciar carregamento
    img.src = `images/img${currentImage}.jpg?t=${Date.now()}`; // Cache buster
}

function preloadNextImage() {
    if (currentImage < maxImages) {
        const nextImage = currentImage + 1;
        const img = new Image();
        img.src = `images/img${nextImage}.jpg`;
    }
}

function updateCount(type) {
    if (type === 'dogma') {
        dogmaCount++;
        elements.dogmaText.textContent = dogmaCount;
    } else {
        scienceCount++;
        elements.scienceText.textContent = scienceCount;
    }
}

function showFeedback(type) {
    const button = type === 'dogma' ? elements.dogmaBtn : elements.scienceBtn;
    const text = type === 'dogma' ? 'DOGMA+' : 'CIÊNCIA+';
    const className = type === 'dogma' ? 'dogma_up' : 'science_up';
    
    const span = document.createElement('span');
    span.textContent = text;
    span.className = className;
    span.setAttribute('aria-hidden', 'true');
    
    button.appendChild(span);
    
    setTimeout(() => span.remove(), 1400);
}

function end() {
    isEnding = true;
    setButtonsDisabled(true);
    
    // Mostrar certificado apropriado
    const winner = dogmaCount > scienceCount ? 'dogma' : 'science';
    elements.certificado.classList.add(`open-${winner}`);
    
    // Atualizar totais
    elements.totalDogmas.textContent = `Dogmas: ${dogmaCount}`;
    elements.totalSciences.textContent = `Ciências: ${scienceCount}`;
    
    // Efeitos de fim
    elements.aiaiAudio.play().catch(() => {});
    showConfetti();
}

function showConfetti() {
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => createConfetto(), i * 20); // Espalhar criação
    }
}

function createConfetto() {
    const confetto = document.createElement('div');
    confetto.className = 'confetto';
    
    const size = Math.random() * 15 + 5;
    const left = Math.random() * 100;
    const duration = Math.random() * 2 + 3;
    const delay = Math.random() * 2;
    
    confetto.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        background-color: ${getRandomColor()};
        animation: fall ${duration}s linear ${delay}s infinite;
    `;
    
    elements.confettiContainer.appendChild(confetto);
    
    setTimeout(() => confetto.remove(), (duration + delay) * 1000);
}

function getRandomColor() {
    const hue = Math.random() * 360;
    return `hsl(${hue}, 80%, 60%)`;
}

function loadImage() {
    elements.image.src = `images/img${currentImage}.jpg?t=${Date.now()}`;
    elements.image.alt = `Imagem ${currentImage} sobre dogma ou ciência`;
    elements.currentImageText.textContent = `${currentImage}/${maxImages}`;
    
    // Pré-carregar próxima
    preloadNextImage();
}

// Iniciar
init();