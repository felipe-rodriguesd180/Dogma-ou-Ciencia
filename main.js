let current_image = 1;
let max_images = 4;

let dogma_count = 0;
let science_count = 0;

const dogmaBtn = document.getElementById('dogma_button');
const scienceBtn = document.getElementById('science_button');
const image = document.getElementById('image');

const dogmaText = document.getElementById('dogma_count');
const scienceText = document.getElementById('science_count');

const certificado = document.getElementById('certificado');

const aiaiAudio = document.getElementById('aiaiAudio');

function loadImage() {
    image.src = `images/img${current_image}.jpg`;
}

function nextImage() {
    current_image++;

    loadImage();
}

function actionButton(action) {
    if (action == 'dogma') {
        dogma_count++;
    } else {
        science_count++;
    }

    dogmaText.innerText = `${dogma_count}`;
    scienceText.innerHTML = `${science_count}`;
}

function end() {
    if (dogma_count > science_count) {
        certificado.classList.add('open-dogma');
    } else {
        certificado.classList.add('open-science');
    }
    aiaiAudio.play();
    showConfetti();
}

function dogmaButtonFunc() {
    if (current_image < max_images) {
        actionButton('dogma');
        nextImage();
    } else if (current_image == max_images) {
        end();
    }
}

function scienceButtonFunc() {
    if (current_image < max_images) {
        actionButton('science');
        nextImage();
    } else if (current_image == max_images) {
        end();
    }
}

function showConfetti() {
    const confettiContainer = document.getElementById('confetti-container');

    // Gerar 100 confetes
    for (let i = 0; i < 100; i++) {
        const confetto = document.createElement('div');
        confetto.classList.add('confetto');

        // Adicionar ao contêiner
        confettiContainer.appendChild(confetto);

        // Definir animações para os confetes
        const size = Math.random() * 15 + 5; // Tamanho aleatório
        const leftPosition = Math.random() * 100; // Posição aleatória na tela
        const animationDuration = Math.random() * 2 + 3; // Duração aleatória da animação

        confetto.style.width = `${size}px`;
        confetto.style.height = `${size}px`;
        confetto.style.left = `${leftPosition}%`;
        confetto.style.backgroundColor = getRandomColor();
        confetto.style.animation = `fall ${animationDuration}s linear infinite`;

        // Remover o confete após a animação
        setTimeout(() => {
            confetto.remove();
        }, animationDuration * 1000); // Remover depois da animação
    }
}

// Função para gerar cores aleatórias para os confetes
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

loadImage();
