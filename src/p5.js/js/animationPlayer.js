
class AnimationPlayer {
  constructor(spriteSheet, frameWidth, frameHeight, totalFrames, frameDelay) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.totalFrames = totalFrames;
    this.frameDelay = frameDelay; 
    
    this.frames = [];
    this.currentFrame = 0;
    this.timer = 0;
    
    this.extractFrames();
  }
  
  extractFrames() {
    let cols = Math.floor(this.spriteSheet.width / this.frameWidth);
    for (let i = 0; i < this.totalFrames; i++) {
      let x = (i % cols) * this.frameWidth;
      let y = Math.floor(i / cols) * this.frameHeight;
      let img = this.spriteSheet.get(x, y, this.frameWidth, this.frameHeight);
      this.frames.push(img);
    }
  }
  
  update() {
    this.timer++;
    if (this.timer >= this.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      this.timer = 0;
    }
  }
  
  draw(x, y, w, h, mirrored = false) {
    if (this.frames.length > 0) {
      imageMode(CENTER);
      
      push();
      
      if (mirrored) {
        translate(x, y);
        scale(-1, 1);
        image(this.frames[this.currentFrame], 0, 0, w, h);
      } else {
        image(this.frames[this.currentFrame], x, y, w, h);
      }
      
      pop();
    }
  }
  
  reset() {
    this.currentFrame = 0;
    this.timer = 0;
  }
}