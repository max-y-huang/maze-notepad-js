import $ from './global';
import { Graph, MazeGraph } from './graph';

class Maze {

  displayTileNumbers = false;

  canvasColour = [ 255, 255, 255 ];
  mazeShapeColour = [ 208, 224, 255 ];
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
    if ($.mode !== $.CREATE) {
      return;
    }
    this.graph.setActiveState(x, y, state);
  }

  draw = () => {
    if ($.mode === $.CREATE) {
      this.drawCreate();
    }
    else if ($.mode === $.SOLVE) {
      this.drawSolve();
    }
  }
 
  drawCreate = () => {
    // Fill canvas colour.
    this.p.noStroke();
    this.p.fill(this.canvasColour);
    this.p.rect(0, 0, $.tileSize * this.w, $.tileSize * this.h);
    // Draw maze shape.
    this.p.fill(this.mazeShapeColour);
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        if (this.graph.getActiveState(j, i)) {
          this.p.rect(j * $.tileSize, i * $.tileSize, $.tileSize, $.tileSize);
        }
      }
    }
    // Draw canvas grid lines.
    this.p.stroke(this.gridLineColour);
    this.p.strokeCap(this.p.PROJECT);
    this.p.strokeWeight(this.gridLineWeight);
    for (let i = 1; i < this.h; i++) {
      this.p.line(0, i * $.tileSize, $.tileSize * this.w, i * $.tileSize);
    }
    for (let i = 1; i < this.w; i++) {
      this.p.line(i * $.tileSize, 0, i * $.tileSize, $.tileSize * this.h);
    }
    // Draw canvas outline.
    this.p.stroke(0);
    this.p.line(0, 0, $.tileSize * this.w, 0);
    this.p.line(0, $.tileSize * this.h, $.tileSize * this.w, $.tileSize * this.h);
    this.p.line(0, 0, 0, $.tileSize * this.h);
    this.p.line($.tileSize * this.w, 0, $.tileSize * this.w, $.tileSize * this.h);
    // Add numbers for easy identification.
    if (this.displayTileNumbers) {
      this.p.textSize(4);
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.fill(0);
      this.p.noStroke();
      let counter = 0;
      for (let i = 0; i < this.h; i++) {
        for (let j = 0; j < this.w; j++) {
          this.p.text(counter, (j + 0.5) * $.tileSize, (i + 0.5) * $.tileSize);
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
          this.p.rect(j * $.tileSize, i * $.tileSize, $.tileSize, $.tileSize);
        }
      }
    }
    // Draw corridors.
    this.p.stroke(this.mazeColour);
    this.p.strokeWeight($.tileSize - this.mazeStrokeWeight);
    this.p.strokeCap(this.p.PROJECT);
    for (let i = 0; i < this.solvedGraph.edgeList.length; i++) {
      let a = this.solvedGraph.edgeList[i].a;
      let b = this.solvedGraph.edgeList[i].b;
      // Shift everything by 0.5 units in both directions.
      let xa = 0.5 + a % this.w;
      let ya = 0.5 + Math.floor(a / this.h);
      let xb = 0.5 + b % this.w;
      let yb = 0.5 + Math.floor(b / this.h);
      this.p.line(xa * $.tileSize, ya * $.tileSize, xb * $.tileSize, yb * $.tileSize);
    }
  }
}

export { Maze };
