class Raptor {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.seesTarget = false;
        
        // Base sizes
        this.baseSizeX = 1050;
        this.baseSizeY = 650;
        this.sizeX = this.baseSizeX;
        this.sizeY = this.baseSizeY;
        
        this.visionRange = 850;
        this.target = target;
        this.foundTarget = false;
        this.idleSheet;
        this.animations;
        this.currentAnimation;

        this.isJumpscaring = false;
        this.jumpscareTimer = 0;
        this.jumpscareDuration = 250;
    }

    async preload() {
        this.idleSheet = await loadImage("src/p5.js/assets/raptor/raptor-idle.png");
        this.pounceSheet = await loadImage("src/p5.js/assets/raptor/raptor-pounce.png");
    }

    _setupAnimations() {
        this.animations = {
            "idle": new AnimationPlayer(this.idleSheet, this.idleSheet.width / 2, this.idleSheet.height, 2, 30),
            "jump": new AnimationPlayer(this.pounceSheet, this.pounceSheet.width, this.pounceSheet.height, 1, 10)
        }
        this.currentAnimation = "idle";
    }

    canSeeTarget() {
        if (this.foundTarget) {
            return false;
        }
        let distance = dist(this.x, this.y, this.target.x, this.target.y);
        
        if (distance <= this.visionRange) {
            this.seesTarget = true;
            this.foundTarget = true;
            return true;
        } else {
            this.seesTarget = false;
            return false;
        }
    }

    jumpS() {   
        if (!this.isJumpscaring) {
            this.isJumpscaring = true;
            this.jumpscareTimer = millis();
            
            this.currentAnimation = "jump";
            this.sizeX = this.baseSizeX * 10.45;
            this.sizeY = this.baseSizeY * 10.45;
        }
    }

    update() {
        this.animations[this.currentAnimation].update();

        if (this.isJumpscaring) {
            if (millis() - this.jumpscareTimer >= this.jumpscareDuration) {
                this.isJumpscaring = false;
                this.currentAnimation = "idle";
                this.sizeX = this.baseSizeX;
                this.sizeY = this.baseSizeY;
            }
        }
    }

    draw() {
        push();
        rectMode(CENTER);
        
        // if (this.seesTarget) {
        //     fill(255, 50, 50);
        // } else {
        //     fill(150, 0, 0);
        // }
        
        this.animations[this.currentAnimation].draw(this.x, this.y, this.sizeX, this.sizeY, true);
        
        // if (this.seesTarget && this.target) {
        //     stroke(255, 0, 0, 180);
        //     strokeWeight(3);
        //     line(this.x, this.y, this.target.x, this.target.y);
        // }
        pop();
    }
}