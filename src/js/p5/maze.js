import consts from './../consts';
import $ from './global';
import keyLogger from './keyLogger';
import { Graph, MazeGraph } from './graph';

class Maze {

  gridLineColour = [ 192, 192, 192 ];
  gridLineWeight = 1;
  mazeColour = [ 224, 224, 224 ];
  mazeStrokeColour = [ 32, 32, 32 ];
  mazeStrokeWeight = 2;
  markerSize = 6;
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
    this.solvedGraph = new Graph(w * h);  // Graph used to draw the maze.
    this.toShapeList = Array(w * h).fill(0);  // -1 = remove, 1 = add, 0 = nothing.
    this.needsUpdate = false;  // Set to true when an update is requested. Set to false in update().
    this.mazeImg = p.createGraphics(10, 10);  // Placeholder. Is set in updateMazeImg().
    this.markersImg = p.createGraphics(10, 10);  // Placeholder. Is set in updateMarkersImg().
  }

  coordToIndex(x, y) {
    return y * this.w + x;
  }

  indexToCoord(index) {
    return { x: index % this.w, y: Math.floor(index / this.w) };
  }

  resetPattern() {
    this.graph.resetEdgeWeights();
    this.update(true);
  }

  update(force = false) {
    // Check run condition.
    if (!this.needsUpdate && !force) {
      return;
    }

    this.solvedGraph = this.graph.generateMazeGraph();  // Generate maze.
    for (let i = 0; i < this.toShapeList.length; i++) {  // toShapeList needs to be cleared.
      this.toShapeList[i] = 0;
    }
    this.updateMazeImg();
    this.updateMarkersImg();
    // Allow update requests.
    this.needsUpdate = false;
  }

  updateMazeImg() {
    this.mazeImg = this.p.createGraphics(this.w * $.tileSize + this.mazeStrokeWeight, this.h * $.tileSize + this.mazeStrokeWeight);  // Padding to accomodate stroke weight.
    // Shift to accomodate stroke weight.
    this.mazeImg.push();
    this.mazeImg.translate(this.mazeStrokeWeight / 2, this.mazeStrokeWeight / 2);
    // Draw cells.
    this.mazeImg.stroke(this.mazeStrokeColour);
    this.mazeImg.strokeWeight(this.mazeStrokeWeight);
    this.mazeImg.fill(this.mazeColour);
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        let index = this.coordToIndex(j, i);
        if (this.graph.activeList[index]) {
          this.mazeImg.rect(j * $.tileSize, i * $.tileSize, $.tileSize, $.tileSize);
        }
      }
    }
    // Draw corridors.
    this.mazeImg.stroke(this.mazeColour);
    this.mazeImg.strokeWeight($.tileSize - this.mazeStrokeWeight);
    this.mazeImg.strokeCap(this.p.PROJECT);
    this.solvedGraph.edgeList.forEach(e => {
      let a = this.indexToCoord(e.a);
      let b = this.indexToCoord(e.b);
      this.mazeImg.line((a.x + 0.5) * $.tileSize, (a.y + 0.5) * $.tileSize, (b.x + 0.5) * $.tileSize, (b.y + 0.5) * $.tileSize);
    });

    this.mazeImg.pop();
    // Pass image to App for export purposes.
    $.app_setMazeImgFunc(this.mazeImg);
  }

  updateMarkersImg() {
    this.markersImg = this.p.createGraphics(this.w * $.tileSize + this.mazeStrokeWeight, this.h * $.tileSize + this.mazeStrokeWeight);  // Padding to accomodate stroke weight.
    // Shift to accomodate stroke weight.
    this.markersImg.push();
    this.markersImg.translate(this.mazeStrokeWeight / 2, this.mazeStrokeWeight / 2);
    // Draw markers.
    this.markersImg.noFill();
    this.markersImg.strokeWeight(this.mazeStrokeWeight);
    this.markersImg.rectMode(this.p.CENTER);
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        let index = this.coordToIndex(j, i);
        let code = this.graph.markerList[index];
        if (code !== null) {
          this.markersImg.stroke(consts.COLOURS[code]);
          this.markersImg.rect((j + 0.5) * $.tileSize, (i + 0.5) * $.tileSize, this.markerSize, this.markerSize);
        }
      }
    }
    this.markersImg.rectMode(this.p.CORNER);

    this.markersImg.pop();
    // Pass image to App for export purposes.
    $.app_setMarkersImgFunc(this.markersImg);
  }

  isValidMazeShape() {
    // Get the flood-fill graph of an active region.
    let bfsStart = this.graph.activeList.indexOf(true);
    // No shape error.
    if (bfsStart === -1) {
      return { success: false, result: 'The maze must have a shape.' };
    }
    // 1x1 cell error
    if (bfsStart === this.graph.activeList.lastIndexOf(true)) {
      return { success: false, result: 'The maze must be larger than 1x1.' };
    }
    let parents = this.graph.bfs(bfsStart, this.graph.floodFillFilterFunc);
    // Compare flood-fill with all active cells.
    for (let i = 0; i < this.graph.size; i++) {
      let isActive = this.graph.activeList[i];
      let isParent = (parents[i] !== -1);
      // Not continuous error.
      if (isActive !== isParent) {
        return { success: false, result: 'The maze must be contiguous.' };
      }
    }
    // No errors.
    return { success: true };
  }

  shape(x, y, currX, currY, state) {
    // Check run condition.
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
    if (state !== this.graph.activeList[index]) {
      this.toShapeList[index] = state ? 1 : -1;
    }
    this.graph.activeList[index] = state;
    this.needsUpdate = true;  // Request update.
  }

  shapePen(x, y, currX, currY, state) {
    let currIndex = this.coordToIndex(currX, currY);
    // Update current point.
    this.shapePoint(currIndex, state);
    // Finish if reached target.
    if (x === currX && y === currY) {
      return;
    }
    // Call shapePen() for each cell along mouse path.
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
    let index = this.coordToIndex(x, y);
    // Check run condition (not filling the same state as the selected cell).
    let targetState = this.graph.activeList[index];
    if (state === targetState) {
      return;
    }
    // BFS to find flood fill region, and shapeFill() for each cell in the region.
    let parents = this.graph.bfs(index, this.graph.floodFillFilterFunc);
    parents.forEach((parent, i) => {
      if (parent !== -1) {
        this.shapePoint(i, state);
      }
    })
  }

  shapeWithMouse(x, y, currX, currY) {
    // Check run condition (SHAPE mode and left or right click).
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
    this.needsUpdate = true;  // Request update.
  }

  setSuggestedPathPen(x, y, currX, currY, state, prevX=currX, prevY=currY) {
    let indexPrev = this.coordToIndex(prevX, prevY);
    let indexCurr = this.coordToIndex(currX, currY);
    // Treat like pen if state = true
    if (state) {
      this.graph.editEdge(indexPrev, indexCurr, { notes: { suggestedPath: state } });
    }
    // Treat like eraser if state = false
    else {
      this.graph.adjList[indexCurr].forEach(e => {
        this.graph.editEdge(e.a, e.b, { notes: { suggestedPath: state } });
      });
    }
    // Finish if reached target.
    if (x === currX && y === currY) {
      return;
    }
    // Call setSuggestedPathPen() for each cell along mouse path.
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
    // Check run condition (PATHS mode and left or right click).
    if (!($.mode === consts.CREATE && $.createTool === consts.PATHS)) {
      return;
    }
    if (!(this.p.mouseIsPressed && (this.p.mouseButton === this.p.LEFT || this.p.mouseButton === this.p.RIGHT))) {
      return;
    }

    let state = (this.p.mouseButton === this.p.LEFT) !== keyLogger.isKeyCodePressed(this.p.CONTROL);  // Left-click = true, right-click = false, shift + click = opposite click.
    this.setSuggestedPath(x, y, prevX, prevY, state);
  }

  setMarker(x, y, state) {
    let index = this.coordToIndex(x, y);
    this.graph.markerList[index] = state ? $.markerColour : null;
    this.updateMarkersImg();
  }

  setMarkerWithMouse(x, y) {
    // Check run condition (MARKERS mode and left or right click).
    if (!($.mode === consts.CREATE && $.createTool === consts.MARKERS)) {
      return;
    }
    if (!(this.p.mouseIsPressed && (this.p.mouseButton === this.p.LEFT || this.p.mouseButton === this.p.RIGHT))) {
      return;
    }
    
    let state = (this.p.mouseButton === this.p.LEFT) !== keyLogger.isKeyCodePressed(this.p.CONTROL);  // Left-click = true, right-click = false, shift + click = opposite click.
    this.setMarker(x, y, state);
  }

  draw() {
    if ($.mode === consts.CREATE) {
      this.drawGrid();
    }
    this.drawMaze();
    this.drawMarkers();
    if ($.mode === consts.CREATE) {
      this.drawSuggestedPaths();
    }
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
      let a = this.indexToCoord(e.a);
      let b = this.indexToCoord(e.b);
      this.p.line((a.x + 0.5) * $.tileSize, (a.y + 0.5) * $.tileSize, (b.x + 0.5) * $.tileSize, (b.y + 0.5) * $.tileSize);
    })
  }

  drawMarkers() {
    this.p.image(this.markersImg, -this.mazeStrokeWeight / 2, -this.mazeStrokeWeight / 2);  // Shift to accomodate stroke weight.
  }

  drawMaze() {
    this.p.image(this.mazeImg, -this.mazeStrokeWeight / 2, -this.mazeStrokeWeight / 2);  // Shift to accomodate stroke weight.
    // Draw toShapeList.
    this.p.strokeWeight(this.mazeStrokeWeight);
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        let index = this.coordToIndex(j, i);
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
