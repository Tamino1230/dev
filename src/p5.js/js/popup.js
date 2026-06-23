class Popup {
    constructor(config = {}) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.target = config.target || null; 
        
        this.offsetX = config.offsetX || 0;
        this.offsetY = config.offsetY || -70; 

        this.img = config.img || null; 
        this.imgW = config.imgW || 40;
        this.imgH = config.imgH || 40;

        this.text = config.text || "";
        this.w = config.w || (this.img ? this.imgW + 20 : 120);
        this.h = config.h || (this.img ? this.imgH + 20 : 40);
        
        this.bgColor = config.bgColor || color(23, 23, 36, 220); 
        this.textColor = config.textColor || color(255);
        this.visible = true;
    }

    update() {
        // if (!this.visible) return;

        if (this.target) {
            this.x = this.target.x + this.offsetX;
            this.y = this.target.y + this.offsetY;
        }
    }

    draw() {
        if (!this.visible) return;

        push();
        rectMode(CENTER);
        imageMode(CENTER);
        textAlign(CENTER, CENTER);
        
        fill(this.bgColor);
        noStroke();

        if (!this.img) {
            triangle(
                this.x - 6, this.y + this.h / 2,
                this.x + 6, this.y + this.h / 2,
                this.x, this.y + this.h / 2 + 6
            );
        }
        

        if (this.img) {
            let imgYOffset = this.text !== "" ? -8 : 0;
            image(this.img, this.x, this.y + imgYOffset, this.imgW, this.imgH);
        }

        if (this.text !== "") {
            let textYOffset = this.img ? this.imgH / 2 : 0;
            fill(this.textColor);
            textSize(12);
            text(this.text, this.x, this.y + textYOffset);
        }
        
        pop();
    }
}