
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
        this.x;
        this.y;
        this.cursorInspectPopup;

        this._buildPopup();
        noCursor();
    }

    _buildPopup() {
        this.cursorInspectPopup = new Popup({
            target: this,
            text: "Hover to inspect!",
            offset: 10,
            bgColor: color(180, 180, 180)
        })
    }

    draw() {
        if (!this.currentCursor) {return}

        this.x = mouseX;
        this.y = mouseY;

        let mouseSpeedX = mouseX - pmouseX;
        let tiltAmount = map(mouseSpeedX, -50, 50, -43, 43, true);

        push();
        angleMode(DEGREES);
        translate(this.x, this.y); 
        rotate(tiltAmount); 
        imageMode(CENTER);
        image(this.currentCursor, 0, 0, 64, 64); 
        pop();

        this.cursorInspectPopup.draw()
        this.cursorInspectPopup.update()
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