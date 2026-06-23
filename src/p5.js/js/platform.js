class Platform {
    constructor(x, y, w, h = null, c = color(100)) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.color = c;

        if (h === null) {
            this.h = 1200 - this.y; 
        } else {
            this.h = h;
        }
    }

    draw(cameraY) {
        push();
        fill(this.color);
        noStroke();
        rectMode(CORNER);
        rect(this.x, this.y, this.w, this.h);
        pop();
    }
}

class Slope {
  constructor(x1, y1, x2, y2, c = color(140, 100, 180)) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = c;
    
    this.minX = min(x1, x2);
    this.maxX = max(x1, x2);
  }

  getYAt(playerX) {
    let percentage = (playerX - this.x1) / (this.x2 - this.x1);
    return this.y1 + percentage * (this.y2 - this.y1);
  }

  draw() {
    push();
    stroke(this.color);
    strokeWeight(4);
    line(this.x1, this.y1, this.x2, this.y2);
    
    noStroke();
    fill(this.color);
    beginShape();
    vertex(this.x1, this.y1);
    vertex(this.x2, this.y2);
    vertex(this.x2, this.y2 + 40);
    vertex(this.x1, this.y1 + 40);
    endShape(CLOSE);
    pop();
  }
}