
/* =========================================
   CONFIGURATION
========================================= */

const CONFIG = {
    stage: "#dino-stage",
    
    dinosaurs: [
        {
            id: "spino",
            image: "src/images/Dinos/spino.png",
            width: 1400,

            facing: "left",
            enterFrom: "right",

            verticalPosition: 0.95,
            entranceDepth: 0.02
        },
        {
            id: "trex",
            image: "src/images/Dinos/trex.png",
            width: 1200,

            facing: "right",
            enterFrom: "left",

            verticalPosition: 1.32,
            entranceDepth: 0.08 * (-1)
        },
        {
            id: "stego",
            image: "src/images/Dinos/stego.png",
            width: 1250,

            facing: "right",
            enterFrom: "left",

            verticalPosition: 1.08,
            entranceDepth: 0.15 * (-1)
        }
    ],



    minDelay: 700,
    maxDelay: 3500,

    enterDuration: 6700,
    lookDuration: 3500,
    exitDuration: 4100,

    enterScale: 0.8,
    foregroundScale: 1
};


/* =========================================
   UTILITIES
========================================= */

const random = (min, max) =>
    Math.random() * (max - min) + min;

const randomInt = (min, max) =>
    Math.floor(random(min, max));

const wait = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

const clamp = (value, min, max) =>
    Math.max(min, Math.min(max, value));

const stage = document.querySelector(CONFIG.stage);

const REFERENCE_WIDTH = 1000;

let stageScale = 1;


function updateStageScale() {
    if (!stage) return;

    stageScale = window.innerWidth / REFERENCE_WIDTH;

    stage.style.width = "100%";
    stage.style.height = "100%";
    stage.style.transform = "none";
}

updateStageScale();

window.addEventListener("resize", updateStageScale);



/* =========================================
   SCENE STATE
========================================= */

let currentDino = null;
let running = true;
let previousDinoId = null;


/* =========================================
   CREATE DINOSAUR
========================================= */

function createDino(config) {
    const wrapper = document.createElement("div");
    wrapper.className = "dino";
    wrapper.dataset.id = config.id;

    wrapper.style.setProperty(
        "--dino-width",
        `${config.width}px`
    );

    const image = document.createElement("img");

    image.src = config.image;
    image.alt = config.id;
    image.draggable = false;

    wrapper.appendChild(image);
    stage.appendChild(wrapper);

    return { wrapper, image, config };
}


/* =========================================
   IMAGE LOADING
========================================= */

function loadImage(image) {
    if (image.complete && image.naturalWidth > 0) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        image.addEventListener("load", resolve, { once: true });

        image.addEventListener(
            "error",
            () => reject(new Error(`Could not load ${image.src}`)),
            { once: true }
        );
    });
}


/* =========================================
   VECTOR ANIMATION
========================================= */

function moveVector(dino, from, to, duration, startScale, endScale) {
    return new Promise(resolve => {
        const startTime = performance.now();

        function animate(now) {
            if (!running || currentDino !== dino) {
                resolve();
                return;
            }

            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);

            // Smoothstep interpolation.
            const progress = t * t * (3 - 2 * t);

            const x = from.x + (to.x - from.x) * progress;
            const y = from.y + (to.y - from.y) * progress;
            const scale =
                startScale + (endScale - startScale) * progress;

            dino.wrapper.style.left = `${x}px`;
            dino.wrapper.style.top = `${y}px`;
            dino.wrapper.style.transform = `scale(${scale})`;

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        }

        requestAnimationFrame(animate);
    });
}

/* =========================================
   LOOK AROUND
========================================= */

async function lookAround(dino) {
    const image = dino.image;
    const duration = CONFIG.lookDuration;
    const start = performance.now();

    dino.wrapper.classList.add("idle");

    return new Promise(resolve => {
        function animate(now) {
            if (!running || currentDino !== dino) {
                resolve();
                return;
            }

            const elapsed = now - start;

            const angle = Math.sin(elapsed / 450) * 2.5;
            const vertical = Math.sin(elapsed / 650) * 5;

            const glance = Math.sin(elapsed / 1150) * 1.2;

            image.style.transform =
                `translateY(${vertical}px) rotate(${angle + glance}deg)`;

            if (elapsed < duration) {
                requestAnimationFrame(animate);
            } else {
                image.style.transform = "";
                dino.wrapper.classList.remove("idle");
                resolve();
            }
        }

        requestAnimationFrame(animate);
    });
}

/* =========================================
   ENTRANCE
========================================= */

async function enterScene(dino) {
    const width = dino.wrapper.offsetWidth;
    const height = dino.wrapper.offsetHeight;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const referenceRatio = screenWidth / REFERENCE_WIDTH;

    const fromLeft = dino.config.enterFrom === "left";

    const travelDirection = fromLeft ? "right" : "left";
    const mirrored = dino.config.facing !== travelDirection;

    dino.image.style.scale = mirrored ? "-1 1" : "1 1";

    dino.wrapper.style.transformOrigin = fromLeft
        ? "left bottom"
        : "right bottom";

    const y = screenHeight * dino.config.verticalPosition - height;

    const startX = fromLeft ? -width : screenWidth;

    const endX = fromLeft
        ? REFERENCE_WIDTH * dino.config.entranceDepth
            * referenceRatio - width * 0.35
        : REFERENCE_WIDTH * (1 - dino.config.entranceDepth)
            * referenceRatio - width * 0.65;

    dino.exitDirection = fromLeft ? "left" : "right";
    dino.exitMirrored = mirrored;

    await moveVector(
        dino,
        { x: startX, y },
        { x: endX, y },
        CONFIG.enterDuration,
        CONFIG.enterScale,
        CONFIG.foregroundScale
    );
}

/* =========================================
   EXIT
========================================= */

async function exitScene(dino) {
    const width = dino.wrapper.offsetWidth;
    const screenWidth = REFERENCE_WIDTH;

    const currentX = parseFloat(dino.wrapper.style.left) || 0;
    const currentY = parseFloat(dino.wrapper.style.top) || 0;

    dino.image.style.scale = dino.exitMirrored ? "-1 1" : "1 1";

    const endX = dino.exitDirection === "left"
        ? -width
        : screenWidth;

    await moveVector(
        dino,
        { x: currentX, y: currentY },
        { x: endX, y: currentY },
        CONFIG.exitDuration,
        CONFIG.foregroundScale,
        CONFIG.enterScale
    );
}

/* =========================================
   ONE COMPLETE SCENE
========================================= */

async function playDinoScene(config) {
    const dino = createDino(config);
    currentDino = dino;

    try {
        await loadImage(dino.image);

        if (!running || currentDino !== dino) return;

        await enterScene(dino);

        if (!running || currentDino !== dino) return;

        await lookAround(dino);

        if (!running || currentDino !== dino) return;

        await wait(randomInt(400, 1200));

        if (!running || currentDino !== dino) return;

        await exitScene(dino);
    } finally {
        dino.wrapper.remove();

        if (currentDino === dino) {
            currentDino = null;
        }
    }
}

/* =========================================
   SCENE MANAGER
========================================= */

function chooseDinosaur() {
    let choices = CONFIG.dinosaurs;

    if (choices.length > 1 && previousDinoId) {
        choices = choices.filter(
            dino => dino.id !== previousDinoId
        );
    }

    const selected = choices[
        randomInt(0, choices.length)
    ];

    previousDinoId = selected.id;

    return selected;
}

async function startEcosystem() {
    if (!stage) {
        throw new Error("Dinosaur stage was not found.");
    }

    await Promise.all(
        CONFIG.dinosaurs.map(config => {
            const image = new Image();
            image.src = config.image;
            return loadImage(image);
        })
    );

    while (running) {
        const config = chooseDinosaur();

        await playDinoScene(config);

        if (!running) break;

        await wait(randomInt(CONFIG.minDelay, CONFIG.maxDelay));
    }
}

/* =========================================
   START
========================================= */

startEcosystem().catch(error => {
    console.error("Dinosaur scene failed:", error);
});
