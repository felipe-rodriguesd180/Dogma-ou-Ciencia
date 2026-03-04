let current_image = 1;
let max_images = 2;

let dogma_count = 0;
let science_count = 0;

const dogmaBtn = document.getElementById('dogma_button');
const scienceBtn = document.getElementById('science_button');
const image = document.getElementById('image');

const dogmaText = document.getElementById('dogma_count');
const scienceText = document.getElementById('science_count');

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

function dogmaButtonFunc() {
    if (current_image < max_images) {
        actionButton('dogma');
        nextImage();
    } else if (current_image == max_images) [alert('cabou as imagens kkkkk')];
}

function scienceButtonFunc() {
    if (current_image < max_images) {
        actionButton('science');
        nextImage();
    } else if (current_image == max_images) {
        alert('cabou as imagens kkkkk');
    }
}

loadImage();
