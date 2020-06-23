import $ from './global';

class Ruler {

  width = 32;
  height = 32;
  colour = [ 64, 64, 64 ];
  markerWeight = 2;
  markerColour = [ 224 ];
  markerLength = 14;
  textSize = 12;

  constructor(p, camera, maze) {
    this.p = p;
    this.camera = camera;
    this.maze = maze;
  }

  draw() {
    // Check run condition.
    if (!$.useRuler) {
      return;
    }
    // Draw ruler background.
    this.p.noStroke();
    this.p.fill(this.colour);
    this.p.rect(0, 0, $.width, this.height);
    this.p.rect(0, 0, this.width, $.height);
    // Draw ruler markers.
    this.p.fill(this.markerColour);
    this.p.strokeWeight(this.markerWeight);
    this.p.strokeCap(this.p.SQUARE);
    this.p.textSize(this.textSize);
    this.p.textFont('Verdana');
    this.p.textAlign(this.p.LEFT, this.p.TOP);
    for (let i = 0; i <= this.maze.w; i += $.rulerIncrement) {
      let x = this.camera.pos.x + i * $.tileSize * this.camera.pos.z;
      if (x < this.width) {
        continue;
      }
      this.p.stroke(this.markerColour);
      this.p.line(x, 0, x, this.markerLength);
      this.p.noStroke();
      this.p.text(i, x + 8, 4);
    }
    for (let i = 0; i <= this.maze.h; i += $.rulerIncrement) {
      let y = this.camera.pos.y + i * $.tileSize * this.camera.pos.z;
      if (y < this.height) {
        continue;
      }
      this.p.stroke(this.markerColour);
      this.p.line(0, y, this.markerLength, y);
      this.p.noStroke();
      this.p.text(i, 4, y + 8);
    }
  }
}

export { Ruler };
