
// Pages
let currentPage;
let overlay;
let blocks = [];
let track = document.getElementById('track');
let index = 0;

function moveSlider(direction) {
    const firstCard = track.querySelector('.card-draw');
    if (!firstCard) return;
    
    const cardWidth = firstCard.getBoundingClientRect().width;
    
    const gap = 24; 
    const step = cardWidth + gap;

    const containerWidth = track.parentElement.clientWidth;
    const visibleCards = Math.round(containerWidth / step) || 1;

    const totalCards = track.children.length;
    const maxIndex = Math.max(0, totalCards - visibleCards);

    index += direction;
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;

    track.style.transform = `translateX(${-index * step}px)`;
}

let activeGalleryImages = [];
let activeImageIndex = 0;

function openGallery(imagesArray) {
    if (!imagesArray || imagesArray.length === 0) return;
    
    activeGalleryImages = imagesArray;
    activeImageIndex = 0;
    
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('gallery-img');
    
    modalImg.src = activeGalleryImages[activeImageIndex];
    modal.classList.add('show-modal');
}

function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    modal.classList.remove('show-modal');
}

function changeGalleryImage(direction) {
    activeImageIndex += direction;
    
    if (activeImageIndex < 0) {
        activeImageIndex = activeGalleryImages.length - 1;
    } else if (activeImageIndex >= activeGalleryImages.length) {
        activeImageIndex = 0;
    }
    
    const modalImg = document.getElementById('gallery-img');
    
    modalImg.style.opacity = 0;
    setTimeout(() => {
        modalImg.src = activeGalleryImages[activeImageIndex];
        modalImg.style.opacity = 1;
    }, 200);
}

document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('gallery-modal');
    if (!modal.classList.contains('show-modal')) return;
    
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') changeGalleryImage(-1);
    if (e.key === 'ArrowRight') changeGalleryImage(1);
});

function hidePages() {
    document.getElementById("start").hidden = true;
    document.getElementById("professional").hidden = true;
    document.getElementById("personal").hidden = true;
    document.getElementById("contact").hidden = true;
}

function unselectNavBtns() {
    document.getElementById("start-btn").className = "nav-btn";
    document.getElementById("professional-btn").className = "nav-btn";
    document.getElementById("personal-btn").className = "nav-btn";
    document.getElementById("contact-btn").className = "nav-btn";
}

function showStart() {
    document.getElementById("start").hidden = false;
    document.getElementById("start-btn").className = "nav-btn selected";
    currentPage = "start";
}

function showProfessional() {
    document.getElementById("professional").hidden = false;
    document.getElementById("professional-btn").className = "nav-btn selected";
    currentPage = "professional";
}

function showPersonal() {
    document.getElementById("personal").hidden = false;
    document.getElementById("personal-btn").className = "nav-btn selected";
    currentPage = "personal";
}

function showContact() {
    document.getElementById("contact").hidden = false;
    document.getElementById("contact-btn").className = "nav-btn selected";
    currentPage = "contact";
}

function showPage(name) {
    if (currentPage === name) {
        return;
        console.warn("Already here!");
    }
    startTransition(endTransition);
    setTimeout(() => {
        hidePages();
        unselectNavBtns();
        
        switch(name) {
            case "start":
                showStart();
                break;
            case "professional":
                showProfessional();
                break;
            case "personal":
                showPersonal();
                break;
            case "contact":
                showContact();
                break;
            default:
                console.error(`Page ${name} wasnt found!!!`);
        }
    }, 1250);
}

function createAnimationGrid() {
    overlay = document.createElement('div');
    overlay.id = 'grid-overlay';
    overlay.hidden = true;
    document.body.appendChild(overlay);

    const cols = 10;
    
    // SIZE
    const blockHeightInPx = window.innerWidth / cols;
    const rows = Math.ceil(window.innerHeight / blockHeightInPx); 
    
    const totalBlocks = rows * cols;

    for (let i = 0; i < totalBlocks; i++) {
        const block = document.createElement('div');
        block.classList.add('grid-block');
        overlay.appendChild(block);
    }

    blocks = Array.from(document.querySelectorAll('.grid-block'));
    setTimeout(() => overlay.hidden = false, 100);
}

function startTransition(callback) {
    overlay.classList.add('active');
    
    blocks.forEach((block, index) => {
        const delay = Math.random() * 500; 
        
        setTimeout(() => {
            block.classList.add('show');
        }, delay);
    });

    setTimeout(() => {
        if (callback) callback();
    }, 1250);
}

function endTransition() {
    blocks.forEach((block, index) => {
        const delay = Math.random() * 300; 
        
        setTimeout(() => {
            block.classList.remove('show');
        }, delay);
    });

    setTimeout(() => {
        overlay.classList.remove('active');
    }, 1000);
}


// Start Page
function cycleText(elementId, words, interval = 2000) {
  const el = document.getElementById(elementId);
  let i = 0;

  setInterval(() => {
    el.classList.add("hide");

    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove("hide");
    }, 400);

  }, interval);
}

// MAINNN
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
    // showStart();
    showProfessional();
    createAnimationGrid();
    cycleText("visitor", ["Visitor", "Traveler", "Friend", "Dinosaur", "Alien", "Guest", "Human", "Fella"], 6700);
    cycleText("nickname", ["Tamino1230", "Dinosaur LOVER", "Tamii<3", "TamTam", "Gangle/Kinger", "This weird guy"], 4300); 
});