
function showDebugCursor() {
    push();
    fill("red");
    text(`X: ${mouseX}; Y; ${mouseY}`, mouseX + 40, mouseY + 5);
    pop();
}

class Cursor {
    constructor() {
        this.cursorImg;
        this.cursorImgImpact;
        this.currentCursor;

        noCursor();
    }

    draw() {
        if (!this.currentCursor) {return}
        let mouseSpeedX = mouseX - pmouseX;
        let tiltAmount = map(mouseSpeedX, -50, 50, -0.25, 0.25, true);

        push();
        translate(mouseX, mouseY); 
        rotate(tiltAmount); 
        imageMode(CENTER);
        image(this.currentCursor, 0, 0, 64, 64); 
        pop();
    }

    async preload() {
        this.cursorImg = await loadImage("/src/p5.js/assets/cursor.png");
        this.cursorImgImpact = await loadImage("/src/p5.js/assets/cursor_impact.png");
        this.currentCursor = this.cursorImg;
    }

    _returnToDisabled() {
        this.currentCursor = this.cursorImg;
    }

    activateImpact() {
        if (this.currentCursor === this.cursorImg) {
            this.currentCursor = this.cursorImgImpact;
        }

        setTimeout(() => (this._returnToDisabled()), 100)
    }
}