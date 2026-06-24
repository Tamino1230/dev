
let canvas;
let bgColor = "#171724";

// imgs & font
let upsideImage;
let font;
let four0four;

let raptor;
let cursor;
let player;
let platforms = [];
let stairs = [];
let cameraY = 0;
let worldMouseY;
let isLookingUp = false;

// popups
let popups;
let cursorInspectPopup;
let upsidePopup;
let wHintHelper;

// music
let song;
let songIsPlaying = false;
let chaos = false;

function onImageError() { console.warn("IMAGE ERROR") }
function onImageSuccess() { console.warn("IMAGE SUCC")}

function buildLevel(reverseStairs=false, grey=false) {
    platforms = [];
    stairs = [];
    woodColor = color(180, 100, 50);
    grassColor = color(50, 180, 50);

    greyColor = color(48, 49, 49);

    if (grey) {
        woodColor = greyColor;
        grassColor = greyColor;
    }
        

    // house floor00
    platforms.push(new Platform(100, 50, 800, 20, woodColor));
    // walls
    // left
    platforms.push(new Platform(100, -100, 50, 1200, woodColor));
    // right
    platforms.push(new Platform(850, -100, 50, 1200, woodColor));
    
    // dach
    // left
    platforms.push(new Slope(100-20, 180-300, 500, 10-250, woodColor))
    // right
    platforms.push(new Slope(900+20, 180-300, 500, 10-250, woodColor))

    // way down
    // 04
    stairs.push(new Platform(747, 799, 120, 40, woodColor))
    stairs.push(new Slope(440, 1100, 750, 800, woodColor));

    // 03
    stairs.push(new Platform(100, 548, 340, 43, woodColor))
    stairs.push(new Slope(440, 550, 750, 800, woodColor));

    // 02
    stairs.push(new Platform(744, 299, 120, 43, woodColor))
    stairs.push(new Slope(744, 352-50, 440, 600-50, woodColor));

    // 01
    stairs.push(new Platform(440-45, 352-300, 50, 43, woodColor))
    stairs.push(new Slope(440, 352-300, 742, 600-300, woodColor));

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
    platforms.push(new Platform(0, 1100, windowWidth, 200, grassColor));

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
    text("My bad, my bad, upsi", 1050, 450)
    text("But did it scare you..?", 1050, 480)

    text("okay.. fine ik it didnt.", 1050, 650)
    text("BUT NOW!.", 1050, 680)

    text("Just kidding sorry :3", 1050, 1050)
    pop();
}

function toggleSong() {
    songIsPlaying = !songIsPlaying
    if (songIsPlaying) {
        song.play();
    } else {
        song.stop();
    }
}

async function buildPopups() {
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

    // Generated Popups:
    popups = []

    popups.push(new Popup({
        img: await loadImage("src/p5.js/assets/song.png"),
        imgW: 500,
        imgH: 224,
        x: 1250,
        y: 850,
        text: "Here you can listen to some music (hover)",
        hoverText: "Hover to toggle play song!",
        TextXOffset: 140,
        hoverAction: toggleSong,
    }))

    popups.push(new Popup({
        img: await loadImage("src/p5.js/assets/tamm-cat.png"),
        imgW: 96*2.5,
        imgH: 64*2.5,
        x: 600, 
        y: -50, 
        text: "This is my portfolio to show off\nwhat im capable of :3",
        hoverText: "This is a VERY secret message",
        TextXOffset: 167
    }));

    popups.push(new Popup({
        img: await loadImage("src/images/drawing-03.jpeg"),
        imgW: 64*2.5,
        imgH: 96*2.5,
        x: 300,
        y: 400,
        text: "I really love to draw\nHere i draw a Spinosaurus<3",
        hoverText: "I love dinosaurs",
        TextXOffset: 130
    }));

    popups.push(new Popup({
        img: await loadImage("src/images/drawing-07.jpeg"),
        imgW: 64*2.5,
        imgH: 110*2.5,
        x: 750,
        y: 567,
        text: "Also i like crafting",
        hoverText: "I made this for the TADC final",
        TextXOffset: 150
    }));

    popups.push(new Popup({
        img: await loadImage("src/images/Alone_01.jpg"),
        imgW: 80*2.5,
        imgH: 120*2.5,
        x: 300,
        y: 825,
        text: "\nI spend much time drawing details",
        hoverText: "Thats my girlfriend btw",
        TextXOffset: 122
    }));

    popups.push(new Popup({
        img: await loadImage("src/images/pomni_colored.png"),
        imgW: 1240 * 0.5,
        imgH: 1752 * 0.5,
        x: 1625,
        y: 755,
        hoverText: "Made for an animation (tiktok: @IhrPookie)",
        TextXOffset: 200,
        TextYOffset: -100
    }));
}

function generateRandomString() {
    const chars = "    a̸͙͋b̵̀ͅc̷̥͊d̶̛̪e̷̯͒f̵̱̈́g̴̦̈́h̵̥̓ḯ̷͕j̸̩̈́k̴͇̓ļ̶͝ṃ̷͌ṋ̸̒ò̴͚p̵͚̓q̸̔ͅr̵̠̚s̶͓͆t̸͚̍ư̶͖v̸̠̎w̷̥̃x̷̦̍ý̷͈z̷̙͘A̸͚͗Ḃ̴͚C̷̰͝Ḍ̸̍E̵̗͝F̵̬̈Ǵ̸̺H̸͕̆I̶̘̐J̴̬͋K̵̥̂L̷͚͝M̴̲̾Ṇ̴̇O̴̲͐P̶̘̓Q̴̩̔Ŕ̴͇S̶̟̈́T̴͔̃U̵͇͒V̶̜̓Ẅ̴̻X̶̤͂Y̸̖̊Z̵͗ͅ0̵̜̀1̴̟̊2̷̥̄3̵͈̚4̸͓̎5̵͙̒6̷̫͐7̸̜̄8̵̻̕9̷̬͝!̴̥̽?̸̘͌@̵̦́#̷̩͊:̴̘̈́*̶͕̌";
    
    let stringLength = floor(random(10, 35)); 
    let result = "";

    for (let i = 0; i < stringLength; i++) {
        let randomIndex = floor(random(chars.length));
        result += chars[randomIndex];
    }

    return result;
}

function disaster() {
    chaos = true
    song.stop();
    buildLevel(false, true);
    popups.reverse().forEach((popup, i) => {
        setTimeout(() => {
            popup.img = four0four;
            popup.text = generateRandomString();
            popup.hoverText = generateRandomString();
            popup.hoverAction = popup.pass;
        }, i * 2000);
    });

    // full bugged but its good.
    setTimeout(() => {
        screenAnimation();
    }, popups.length * 2000);
}

function screenAnimation() {
    showPage("start", forceAnimation=false);
    setTimeout(() => canvas.remove(), 1000)
    setTimeout(() => document.getElementById("personal-btn").innerText = "p̶̜̏e̵̟̒ȑ̴̞s̸͇͆o̸̚ͅn̵̼͑a̶̝͘l̴͔̕", 1000)
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
    song = await loadSound("/src/p5.js/sounds/bubblegum-bitch.mp3");
    four0four = await loadImage("/src/p5.js/assets/404.png");

    await buildPopups();
    player._setupAnimations();
    player._refreshPlatforms(platforms);
    raptor._setupAnimations();
}

function draw() {
    background(bgColor);

    if (keyIsDown("w")) {
        buildLevel(true, grey=chaos);
        isLookingUp = true;
        upsidePopup.visible = true;
    }

    if (keyIsDown("f")) {
        screenAnimation();
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

    for (let popup of popups) {
        popup.draw();
        popup.update();
    }


    player.draw();
    upsidePopup.draw();
    wHintHelper.draw();
    raptor.draw();

    pop();


    cursor.draw();
    // cursorInspectPopup.draw();

    player.update();
    if (raptor.canSeeTarget()) {
        raptor.jumpS();
    }
    raptor.update();
    upsidePopup.update();
    wHintHelper.update();
    // cursorInspectPopup.update();

    showDebugCursor();

    if (player.y >= 1070) {
        disaster()
    }

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
        buildLevel(false, grey=chaos);
        upsidePopup.visible = false;
    }
}