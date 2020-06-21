import consts from './../consts';
import $ from './global';
import keyLogger from './keyLogger';
import { Graph, MazeGraph } from './graph';

class Maze {

  mazeShapeColour = [ 224, 224, 224 ];
  gridLineColour = [ 176, 176, 176 ];
  gridLineWeight = 1;
  mazeColour = [ 224, 224, 224 ];
  mazeStrokeColour = [ 32, 32, 32 ];
  mazeStrokeWeight = 2;
  markerDiameter = 6;
  suggestedPathsColour = consts.COLOURS[0];
  suggestedPathsWeight = 2;
  toShapeAddColour = [ 192, 255, 192 ];
  toShapeAddStrokeColour = [ 96, 128, 96 ];
  toShapeRemoveColour = [ 255, 192, 192 ];
  toShapeRemoveStrokeColour = [ 128, 96, 96 ];

  constructor(p, w, h) {
    this.p = p;
    this.w = w;
    this.h = h;
    this.graph = new MazeGraph(w, h);
    this.solvedGraph = new Graph(w * h);
    this.toShapeList = Array(w * h).fill(0);  // -1 = remove, 1 = add, 0 = nothing.
    this.needsUpdate = false;
  }

  update() {
    if (!this.needsUpdate) {
      return;
    }
    this.solvedGraph = this.graph.generateMazeGraph();
    for (let i = 0; i < this.toShapeList.length; i++) {
      this.toShapeList[i] = 0;
    }
    this.needsUpdate = false;
  }

  isValidMazeShape() {
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

  shape(x, y, currX, currY, state) {
    if ($.mode !== consts.CREATE) {
      return;
    }
    if (keyLogger.isKeyCodePressed(this.p.SHIFT)) {
      this.shapeFill(x, y, state);
    }
    else {
      this.shapePen(x, y, currX, currY, state);
    }
  }

  shapePoint(index, state) {
    if (state !== this.graph.getActiveState(index)) {
      this.toShapeList[index] = state ? 1 : -1;
    }
    this.graph.setActiveState(index, state);
    this.needsUpdate = true;
  }
  shapePointWithXY(x, y, state) {
    this.shapePoint(y * this.w + x, state);
  }

  shapePen(x, y, currX, currY, state) {
    this.shapePointWithXY(currX, currY, state);
    if (x === currX && y === currY) {
      return;
    }
    // If mouse movement changed grids, shapePen() for each cell along mouse path.
    let offsetX = 0;
    let offsetY = 0;
    if (Math.abs(x - currX) > Math.abs(y - currY)) {
      offsetX = currX < x ? 1 : -1;
    }
    else {
      offsetY = currY < y ? 1 : -1;
    }
    this.shapePen(x, y, currX + offsetX, currY + offsetY, state);
  }

  shapeFill(x, y, state) {
    // Return if filling same state as current state.
    let targetState = this.graph.getActiveStateWithXY(x, y);
    if (state === targetState) {
      return;
    }
    // BFS to find flood fill region, and shapeFill() for each cell in the region.
    let parents = this.graph.bfs(y * this.w + x, this.graph.floodFillFilterFunc);
    parents.forEach((parent, i) => {
      if (parent !== -1) {
        this.shapePoint(i, state);
      }
    })
  }

  shapeWithMouse(x, y, currX, currY) {
    if (!($.mode === consts.CREATE && $.createTool === consts.SHAPE)) {
      return;
    }
    if (!(this.p.mouseIsPressed && (this.p.mouseButton === this.p.LEFT || this.p.mouseButton === this.p.RIGHT))) {
      return;
    }
    let state = (this.p.mouseButton === this.p.LEFT) !== keyLogger.isKeyCodePressed(this.p.CONTROL);  // Left-click = true, right-click = false, shift + click = opposite click.
    this.shape(x, y, currX, currY, state);
  }

  setSuggestedPath(x, y, currX, currY, state) {
    this.setSuggestedPathPen(x, y, currX, currY, state);
    this.needsUpdate = true;
  }

  setSuggestedPathPen(x, y, currX, currY, state, prevX=currX, prevY=currY) {
    let indexPrev = prevY * this.w + prevX;
    let indexCurr = currY * this.w + currX;
    // Treat like pen if state = true
    if (state) {
      this.graph.editEdgeNotes(indexPrev, indexCurr, { suggestedPath: state });
    }
    // Treat like eraser if state = false
    else {
      this.graph.adjList[indexCurr].forEach(e => {
        this.graph.editEdgeNotes(e.a, e.b, { suggestedPath: state });
      });
    }
    if (x === currX && y === currY) {
      return;
    }
    // If mouse movement changed grids, setSuggestedPathWithMouse() for each cell along mouse path.
    let offsetX = 0;
    let offsetY = 0;
    if (Math.abs(x - currX) > Math.abs(y - currY)) {
      offsetX = currX < x ? 1 : -1;
    }
    else {
      offsetY = currY < y ? 1 : -1;
    }
    this.setSuggestedPathPen(x, y, currX + offsetX, currY + offsetY, state, currX, currY);
  }

  setSuggestedPathWithMouse(x, y, prevX, prevY) {
    if (!($.mode === consts.CREATE && $.createTool === consts.PATHS)) {
      return;
    }
    if (!(this.p.mouseIsPressed && (this.p.mouseButton === this.p.LEFT || this.p.mouseButton === this.p.RIGHT))) {
      return;
    }
    let state = (this.p.mouseButton === this.p.LEFT) !== keyLogger.isKeyCodePressed(this.p.CONTROL);  // Left-click = true, right-click = false, shift + click = opposite click.
    this.setSuggestedPath(x, y, prevX, prevY, state);
  }

  setMarkerWithMouse(x, y) {
    if (!($.mode === consts.CREATE && $.createTool === consts.MARKERS)) {
      return;
    }
    if (!(this.p.mouseIsPressed && (this.p.mouseButton === this.p.LEFT || this.p.mouseButton === this.p.RIGHT))) {
      return;
    }
    let state = (this.p.mouseButton === this.p.LEFT) !== keyLogger.isKeyCodePressed(this.p.CONTROL);  // Left-click = true, right-click = false, shift + click = opposite click.
    this.graph.setMarkerWithXY(x, y, state ? $.markerColour : null);
  }

  draw() {
    if ($.mode === consts.CREATE) {
      this.drawGrid();
    }
    this.drawMaze();
    if ($.mode === consts.CREATE) {
      this.drawSuggestedPaths();
    }
    this.drawMarkers();
  }

  drawGrid() {
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

  drawSuggestedPaths() {
    this.p.stroke(this.suggestedPathsColour);
    this.p.strokeWeight(this.suggestedPathsWeight);
    this.p.strokeCap(this.p.ROUND);
    this.graph.edgeList.filter(e => e.notes.suggestedPath).forEach(e => {
      // Shift everything by 0.5 units in both directions.
      let xa = 0.5 + e.a % this.w;
      let ya = 0.5 + Math.floor(e.a / this.h);
      let xb = 0.5 + e.b % this.w;
      let yb = 0.5 + Math.floor(e.b / this.h);
      this.p.line(xa * $.tileSize, ya * $.tileSize, xb * $.tileSize, yb * $.tileSize);
    })
  }

  drawMarkers() {
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

  drawMazeShape() {
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

  // drawMaze() has graphical glitches when adding new cells into activeList without calling update(). Drawing toShapeList hides these glitches.
  drawMaze() {
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
    this.solvedGraph.edgeList.forEach(e => {
      // Shift everything by 0.5 units in both directions.
      let xa = 0.5 + e.a % this.w;
      let ya = 0.5 + Math.floor(e.a / this.h);
      let xb = 0.5 + e.b % this.w;
      let yb = 0.5 + Math.floor(e.b / this.h);
      this.p.line(xa * $.tileSize, ya * $.tileSize, xb * $.tileSize, yb * $.tileSize);
    });
    // Draw toShapeList.
    this.p.strokeWeight(this.mazeStrokeWeight);
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        let index = i * this.w + j;
        if (this.toShapeList[index] === 1) {
          this.p.stroke(this.toShapeAddStrokeColour);
          this.p.fill(this.toShapeAddColour);
          this.p.rect(j * $.tileSize, i * $.tileSize, $.tileSize, $.tileSize);
        }
        if (this.toShapeList[index] === -1) {
          this.p.stroke(this.toShapeRemoveStrokeColour);
          this.p.fill(this.toShapeRemoveColour);
          this.p.rect(j * $.tileSize, i * $.tileSize, $.tileSize, $.tileSize);
        }
      }
    }
  }
}

export { Maze };
