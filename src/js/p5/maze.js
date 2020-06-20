import consts from './../consts';
import $ from './global';
import keyLogger from './keyLogger';
import { Graph, MazeGraph } from './graph';

class Maze {

  canvasColour = [ 255, 255, 255 ];
  mazeShapeColour = [ 64, 64, 64 ];
  canvasOutlineColour = [ 32, 32, 32 ];
  canvasOutlineWeight = 4;
  gridLineColour = [ 224, 224, 224 ];
  gridLineWeight = 1;
  mazeColour = [ 255, 255, 255 ];
  mazeStrokeColour = [ 32, 32, 32 ];
  mazeStrokeWeight = 2;
  markerDiameter = 6;

  constructor (p, w, h) {
    this.p = p;
    this.w = w;
    this.h = h;
    this.graph = new MazeGraph(w, h);
    this.solvedGraph = new Graph(w * h);
  }

  isValidMazeShape = () => {
    // Get the flood-fill graph of an active region.
    let bfsStart = this.graph.activeList.indexOf(true);
    if (bfsStart === -1) {
      return { success: false, result: 'The maze must have a shape.' };
    }
    if (bfsStart === this.graph.activeList.lastIndexOf(true)) {  // Check if there is only 1 active cell.
      return { success: false, result: 'The maze must be larger than 1x1.' };
    }
    let parents = this.graph.bfs(bfsStart, this.graph.floodFillFilterFunc);
    // Compare flood-fill with all active cells.
    for (let i = 0; i < this.graph.size; i++) {
      let isActive = this.graph.activeList[i];
      let isParent = (parents[i] !== -1);
      if (isActive !== isParent) {
        return { success: false, result: 'The maze must be contiguous.' };
      }
    }
    return { success: true };
  }

  shape = (x, y, prevX, prevY, state) => {
    if ($.mode !== consts.CREATE) {
      return;
    }
    if (keyLogger.isKeyCodePressed(this.p.SHIFT)) {
      this.shapeFill(x, y, state);
    }
    else {
      this.shapePen(x, y, prevX, prevY, state);
    }
  }

  shapePen = (x, y, prevX, prevY, state) => {
    this.graph.setActiveStateWithXY(prevX, prevY, state);
    if (x === prevX && y === prevY) {
      return;
    }
    // If mouse movement changed grids, setActiveState() for each cell along mouse path.
    let offsetX = 0;
    let offsetY = 0;
    if (Math.abs(x - prevX) > Math.abs(y - prevY)) {
      offsetX = prevX < x ? 1 : -1;
    }
    else {
      offsetY = prevY < y ? 1 : -1;
    }
    this.shape(x, y, prevX + offsetX, prevY + offsetY, state);
  }

  shapeFill = (x, y, state) => {
    // Return if filling same state as current state.
    let targetState = this.graph.getActiveStateWithXY(x, y);
    if (state === targetState) {
      return;
    }
    // BFS to find flood fill region, and setActiveState() for each cell in the region.
    let parents = this.graph.bfs(y * this.w + x, this.graph.floodFillFilterFunc);
    for (let i = 0; i < parents.length; i++) {
      if (parents[i] !== -1) {
        this.graph.setActiveState(i, state);
      }
    }
  }

  shapeWithMouse = (x, y, prevX, prevY) => {
    if (!($.mode === consts.CREATE && $.createTool === consts.SHAPE)) {
      return;
    }
    if (!(this.p.mouseIsPressed && (this.p.mouseButton === this.p.LEFT || this.p.mouseButton === this.p.RIGHT))) {
      return;
    }
    let state = (this.p.mouseButton === this.p.LEFT) !== keyLogger.isKeyCodePressed(this.p.CONTROL);  // Left-click = true, right-click = false, shift + click = opposite click.
    this.shape(x, y, prevX, prevY, state);
  }

  setMarkerWithMouse = (x, y) => {
    if (!($.mode === consts.CREATE && $.createTool === consts.MARKERS)) {
      return;
    }
    if (!(this.p.mouseIsPressed && (this.p.mouseButton === this.p.LEFT || this.p.mouseButton === this.p.RIGHT))) {
      return;
    }
    let state = (this.p.mouseButton === this.p.LEFT) !== keyLogger.isKeyCodePressed(this.p.CONTROL);  // Left-click = true, right-click = false, shift + click = opposite click.
    let code = Math.floor(Math.random() * 4);
    this.graph.setMarkerWithXY(x, y, state ? code : null);
  }

  draw = () => {
    if ($.mode === consts.CREATE) {
      this.drawCanvas();
    }
    if ($.mode === consts.CREATE && $.createTool === consts.SHAPE) {
      this.drawMazeShape()
      this.drawGridLines();
    }
    else if ($.mode === consts.CREATE) {
      this.drawGridLines();
      this.drawMaze();
    }
    else {
      this.drawMaze();
    }
    this.drawMarkers();
  }

  drawCanvas = () => {
    this.p.noStroke();
    this.p.fill(this.canvasColour);
    this.p.rect(0, 0, $.tileSize * this.w, $.tileSize * this.h);
    this.p.stroke(this.canvasOutlineColour);
    this.p.strokeWeight(this.canvasOutlineWeight);
    let outlineBuffer = (this.gridLineWeight + this.canvasOutlineWeight) / 2;
    this.p.rect(-outlineBuffer, -outlineBuffer, $.tileSize * this.w + 2 * outlineBuffer, $.tileSize * this.h + 2 * outlineBuffer);
  }

  drawGridLines = () => {
    this.p.stroke(this.gridLineColour);
    this.p.strokeCap(this.p.PROJECT);
    this.p.strokeWeight(this.gridLineWeight);
    for (let i = 0; i <= this.h; i++) {
      this.p.line(0, i * $.tileSize, $.tileSize * this.w, i * $.tileSize);
    }
    for (let i = 0; i <= this.w; i++) {
      this.p.line(i * $.tileSize, 0, i * $.tileSize, $.tileSize * this.h);
    }
  }

  drawMarkers = () => {
    this.p.noFill();
    this.p.strokeWeight(this.mazeStrokeWeight);
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        let code = this.graph.markerList[i * this.w + j];
        if (code !== null) {
          this.p.stroke(consts.COLOURS[code]);
          this.p.ellipse((j + 0.5) * $.tileSize, (i + 0.5) * $.tileSize, this.markerDiameter, this.markerDiameter);
        }
      }
    }
  }

  drawMazeShape = () => {
    this.p.noStroke();
    this.p.fill(this.mazeShapeColour);
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        if (this.graph.getActiveStateWithXY(j, i)) {
          this.p.rect(j * $.tileSize, i * $.tileSize, $.tileSize, $.tileSize);
        }
      }
    }
  }

  drawMaze = () => {
    // Draw cells.
    this.p.stroke(this.mazeStrokeColour);
    this.p.strokeWeight(this.mazeStrokeWeight);
    this.p.fill(this.mazeColour);
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        if (this.graph.getActiveStateWithXY(j, i)) {
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
