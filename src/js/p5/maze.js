class Maze {

  tileSize = 12;
  canvasColour = [ 241, 241, 241 ];
  lineColour = [ 196, 196, 196 ];
  lineWeight = 1;

  constructor (p, w, h) {
    this.p = p;
    this.w = w;
    this.h = h;
  }
 
  draw = () => {
    this.p.noStroke();
    this.p.fill(this.canvasColour);
    this.p.rect(0, 0, this.tileSize * this.w, this.tileSize * this.h);

    this.p.stroke(this.lineColour);
    this.p.strokeCap(this.p.SQUARE);
    this.p.strokeWeight(this.lineWeight);
    for (let i = 1; i < this.h; i++) {
      this.p.line(0, i * this.tileSize, this.tileSize * this.w, i * this.tileSize);
    }
    for (let i = 1; i < this.w; i++) {
      this.p.line(i * this.tileSize, 0, i * this.tileSize, this.tileSize * this.h);
    }
  }
}

export default Maze;
