import { Graph, MazeGraph } from './graph';

class Maze {

  CREATE = 0;
  SOLVE = 1;
  displayTileNumbers = true;

  tileSize = 14;
  mode = this.CREATE;
  canvasColour = [ 255, 255, 255 ];
  mazeShapeColour = [ 156, 156, 156 ];
  gridLineColour = [ 196, 196, 196 ];
  gridLineWeight = 1;
  mazeColour = [ 255, 255, 255 ];
  mazeStrokeColour = [ 0, 0, 0 ];
  mazeStrokeWeight = 2;

  constructor (p, w, h) {
    this.p = p;
    this.w = w;
    this.h = h;
    this.graph = new MazeGraph(w, h);
    this.solvedGraph = new Graph(w * h);
  }

  shape = (x, y, state) => {
    if (this.mode !== this.CREATE) {
      return;
    }
    this.graph.setActiveState(x, y, state);
  }

  draw = () => {
    if (this.mode === this.CREATE) {
      this.drawCreate();
    }
    else if (this.mode === this.SOLVE) {
      this.drawSolve();
    }
  }
 
  drawCreate = () => {
    // Fill canvas colour.
    this.p.noStroke();
    this.p.fill(this.canvasColour);
    this.p.rect(0, 0, this.tileSize * this.w, this.tileSize * this.h);
    // Draw maze shape.
    this.p.fill(this.mazeShapeColour);
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        if (this.graph.getActiveState(j, i)) {
          this.p.rect(j * this.tileSize, i * this.tileSize, this.tileSize, this.tileSize);
        }
      }
    }
    // Draw canvas grid lines.
    this.p.stroke(this.gridLineColour);
    this.p.strokeCap(this.p.PROJECT);
    this.p.strokeWeight(this.gridLineWeight);
    for (let i = 1; i < this.h; i++) {
      this.p.line(0, i * this.tileSize, this.tileSize * this.w, i * this.tileSize);
    }
    for (let i = 1; i < this.w; i++) {
      this.p.line(i * this.tileSize, 0, i * this.tileSize, this.tileSize * this.h);
    }
    // Draw canvas outline.
    this.p.stroke(0);
    this.p.line(0, 0, this.tileSize * this.w, 0);
    this.p.line(0, this.tileSize * this.h, this.tileSize * this.w, this.tileSize * this.h);
    this.p.line(0, 0, 0, this.tileSize * this.h);
    this.p.line(this.tileSize * this.w, 0, this.tileSize * this.w, this.tileSize * this.h);
    // Add numbers for easy identification.
    if (this.displayTileNumbers) {
      this.p.textSize(4);
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.fill(0);
      this.p.noStroke();
      let counter = 0;
      for (let i = 0; i < this.h; i++) {
        for (let j = 0; j < this.w; j++) {
          this.p.text(counter, (j + 0.5) * this.tileSize, (i + 0.5) * this.tileSize);
          counter++;
        }
      }
    }
  }

  drawSolve = () => {
    // Draw maze shape.
    this.p.stroke(this.mazeStrokeColour);
    this.p.strokeWeight(this.mazeStrokeWeight);
    this.p.fill(this.mazeStrokeColour);
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        if (this.graph.getActiveState(j, i)) {
          this.p.rect(j * this.tileSize, i * this.tileSize, this.tileSize, this.tileSize);
        }
      }
    }
    // Draw corridors.
    this.p.stroke(this.mazeColour);
    this.p.strokeWeight(this.tileSize - this.mazeStrokeWeight);
    this.p.strokeCap(this.p.PROJECT);
    for (let i = 0; i < this.solvedGraph.edgeList.length; i++) {
      let a = this.solvedGraph.edgeList[i].a;
      let b = this.solvedGraph.edgeList[i].b;
      // Shift everything by 0.5 units in both directions.
      let xa = 0.5 + a % this.w;
      let ya = 0.5 + Math.floor(a / this.h);
      let xb = 0.5 + b % this.w;
      let yb = 0.5 + Math.floor(b / this.h);
      this.p.line(xa * this.tileSize, ya * this.tileSize, xb * this.tileSize, yb * this.tileSize);
    }
  }
}

export { Maze };
