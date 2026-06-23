
class Player {
    constructor() {
        this.x = 250;
        this.y = -50;
        this.platforms = [];

        // Constants
        this.debug = false;
        this.speed = 3;
        this.size = 80;
        this.hitboxW = 40;
        this.hitboxH = 60;
        this.gravity = 5;
        this.navigation = {
            "left": "a",
            "right": "d",
            "up": "w",
            "down": "s"
        };

        // Sheets
        this.idleSheet;
        this.moveSheet;
        this.animations;
        this.currentAnimation;
        this.new_animation;

        // States
        this.isWalkingLeft = false;
        this.isWalking = false;
        this.isIdling = true;
    }

    async preload() {
        this.idleSheet = await loadImage("src/p5.js/assets/dino/idle.png");
        this.moveSheet = await loadImage("src/p5.js/assets/dino/move.png");
    }

    _refreshPlatforms(platforms) {
        this.platforms = platforms;
    }

    _setupAnimations() {
        this.animations = {
            "idle": new AnimationPlayer(this.idleSheet, this.idleSheet.width / 3, this.idleSheet.height, 3, 10),
            "move": new AnimationPlayer(this.moveSheet, this.moveSheet.width / 6, this.moveSheet.height, 6, 5),
        };

        this.currentAnimation = "idle";
    }

    _apply_gravity() {
        this.y += this.gravity;
        
        // slope
        for (let obj of this.platforms) {
        if (obj instanceof Slope) {
            if (this.x >= obj.minX && this.x <= obj.maxX) {
            let slopeY = obj.getYAt(this.x);
            
            let pBottom = this.y + this.hitboxH / 2;
            
            if (pBottom >= slopeY && pBottom <= slopeY + this.gravity + 4) {
                this.y = slopeY - this.hitboxH / 2;
                return;
            }
            }
        }
        }

        // default
        if (this.colliding()) {
        for (let platform of this.platforms) {
            if (platform instanceof Platform) {
            let pLeft   = this.x - this.hitboxW / 2;
            let pRight  = this.x + this.hitboxW / 2;
            let pTop    = this.y - this.hitboxH / 2;
            let pBottom = this.y + this.hitboxH / 2;

            if (pRight > platform.x && pLeft < platform.x + platform.w &&
                pBottom > platform.y && pTop < platform.y + platform.h) {
                
                this.y = platform.y - this.hitboxH / 2; 
                break;
            }
            }
        }
        }
    }

    colliding() {
        if (!this.platforms || this.platforms.length === 0) {
            console.error("No Platforms set!");
            return false;
        }

        let pLeft = this.x - this.hitboxW / 2;
        let pRight = this.x + this.hitboxW / 2;
        let pTop = this.y - this.hitboxH / 2;
        let pBottom = this.y + this.hitboxH / 2;

        for (let platform of this.platforms) {
            let platLeft = platform.x;
            let platRight = platform.x + platform.w;
            let platTop = platform.y;
            let platBottom = platform.y + platform.h;

            if (pRight > platLeft &&
                pLeft < platRight &&
                pBottom > platTop &&
                pTop < platBottom) {
                return true;
            }
        }

        return false;
    }

    update() {
        this.animations[this.currentAnimation].update();
        this._apply_gravity();

        this.isWalking = false;

        // Movement LEFT
        if (keyIsDown(this.navigation["left"])) {
            if (this.x <= 177) { return };
            this.x -= this.speed;
            this.isWalkingLeft = true;
            this.isWalking = true;
            this.isIdling = false;
        // Movement RIGHT
        } else if (keyIsDown(this.navigation["right"])) {
            if (this.x >= 822) { return };
            this.x += this.speed;
            this.isWalkingLeft = false;
            this.isIdling = false;
            this.isWalking = true;
        // IDLE
        } else {
            this.isIdling = true;
            this.currentAnimation = "idle";
        }

        // Switch Animations
        if (this.isIdling) {
            this.new_animation = "idle";
        } else if (this.isWalking) {
            this.new_animation = "move";
        }

        if (this.new_animation !== this.currentAnimation) {
            this.currentAnimation = this.new_animation;
        }
    }

    draw() {
        this.animations[this.currentAnimation].draw(this.x, this.y, this.size, this.size, this.isWalkingLeft);

        if (this.debug) {
            push();
            noFill();
            stroke(255, 0, 0);
            rectMode(CENTER);
            rect(this.x, this.y, this.hitboxW, this.hitboxH);
            pop();
        }

    }
}