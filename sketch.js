
let canvas;
let bgColor = "#171724";

// imgs & font
let upsideImage;
let font;

let upsidePopup;
let wHintHelper;
let raptor;
let cursor;
let player;
let platforms = [];
let stairs = [];
let cameraY = 0;
let worldMouseY;
let isLookingUp = false;

function onImageError() { console.warn("IMAGE ERROR") }
function onImageSuccess() { console.warn("IMAGE SUCC")}

function buildLevel(reverseStairs=false) {
    platforms = [];
    stairs = [];

    // house floor00
    platforms.push(new Platform(100, 50, 800, 20, color(180, 100, 50)));
    // walls
    // left
    platforms.push(new Platform(100, -100, 50, 1200, color(180, 100, 50)));
    // right
    platforms.push(new Platform(850, -100, 50, 1200, color(180, 100, 50)));
    
    // dach
    // left
    platforms.push(new Slope(100-20, 180-300, 500, 10-250, color(180, 100, 50)))
    // right
    platforms.push(new Slope(900+20, 180-300, 500, 10-250, color(180, 100, 50)))

    // way down
    // 04
    stairs.push(new Platform(747, 799, 120, 40, color(180, 100, 50)))
    stairs.push(new Slope(440, 1100, 750, 800, color(180, 100, 50)));

    // 03
    stairs.push(new Platform(100, 548, 340, 43, color(180, 100, 50)))
    stairs.push(new Slope(440, 550, 750, 800, color(180, 100, 50)));

    // 02
    stairs.push(new Platform(744, 299, 120, 43, color(180, 100, 50)))
    stairs.push(new Slope(744, 352-50, 440, 600-50, color(180, 100, 50)));

    // 01
    stairs.push(new Platform(440-45, 352-300, 50, 43, color(180, 100, 50)))
    stairs.push(new Slope(440, 352-300, 742, 600-300, color(180, 100, 50)));

    if (reverseStairs) {
        // console.log("text.")
        let reversed = [...stairs].reverse();
        for (let stair of reversed) {
            platforms.push(stair);
        }
    } else {
        for (let stair of stairs) {
            platforms.push(stair);
        }
    }

    // Floor ROCK-bottom
    platforms.push(new Platform(0, 1100, windowWidth, 200, color(50, 180, 50)));

    // --- CRUCIAL: Tell the player about the refreshed list! ---
    if (player) {
        player._refreshPlatforms(platforms);
    }
}

function buildCredits() {
    angleMode(DEGREES);

    push();
    textSize(67);
    textFont(font);
    fill("white");
    text("Made by Tamino1230", 1100, 0)

    push();
    fill("green");
    textSize(35);
    
    rotate(-6);
    text("Dinooosauwwwr", 1050, 50);

    fill("yellow");
    rotate(4+6);
    text("p5.js Game", 1300, -155);
    pop()

    textSize(30);
    text("My bad, my bad, for the jumpscare", 1050, 450)
    text("But did it scare you..?", 1050, 480)

    text("okay.. fine ik it didnt.", 1050, 650)
    text("BUT NOW!.", 1050, 680)

    text("Just kidding sorry :3", 1050, 1050)
    pop();
}

function activateHintW() {
    wHintHelper.visible = true;
    setTimeout(() => wHintHelper.visible = false);
}

async function setup() {
    canvas = createCanvas(windowWidth, 600);
    canvas.parent('canvas-container');

    noSmooth();

    buildLevel(false);

    cursor = new Cursor();
    player = new Player();
    raptor = new Raptor(1400, 30, player);
    await cursor.preload();
    await player.preload();
    await raptor.preload();
    font = await loadFont("src/fonts/Lato/Lato-Black.ttf");
    upsideImage = await loadImage("/src/p5.js/assets/upside.png");
    
    upsidePopup = new Popup({
        target: player,
        img: upsideImage,
        imgW: 64*2,
        imgH: 32*2,
        offset: +10
    });
    wHintHelper = new Popup({
        target: player,
        offset: -50,
        text: "Hold W to walk back up again!"
    })

    upsidePopup.visible = false;
    wHintHelper.visible = false;
    player._setupAnimations();
    player._refreshPlatforms(platforms);
    raptor._setupAnimations();
}

function draw() {
    background(bgColor);

    if (keyIsDown("w")) {
        buildLevel(true);
        isLookingUp = true;
        upsidePopup.visible = true;
    }

    let targetCameraY = player.y - height / 2;
    cameraY = lerp(cameraY, targetCameraY, 0.1);
    if (cameraY >= 540) {cameraY = 540}
    worldMouseY = mouseY + cameraY;

    push();
    translate(0, -cameraY);
    for (let platform of platforms) {
        platform.draw();
    }

    buildCredits();

    player.draw();
    raptor.draw();
    upsidePopup.draw();
    wHintHelper.draw();
    pop();

    cursor.draw();

    player.update();
    if (raptor.canSeeTarget()) {
        raptor.jumpS();
    }
    raptor.update();
    upsidePopup.update();
    wHintHelper.update();

    showDebugCursor();
}

function windowResized() {
    resizeCanvas(windowWidth, 600);
}

function mouseClicked(event) {
    cursor.activateImpact()
}

function keyReleased() {
    if (key === 'w' || key === player.navigation["up"]) {
        isLookingUp = false;
        buildLevel(false);
        upsidePopup.visible = false;
    }
}