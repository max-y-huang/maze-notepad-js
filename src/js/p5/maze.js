import consts from './../consts';
import $ from './global';
import keyLogger from './keyLogger';
import { Graph, MazeGraph } from './graph';

class Maze {

  gridLineColour = [ 128, 128, 128 ];
  gridLineEmphasisColour = [ 224, 224, 224 ];
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

  cropX1 = 0;
  cropY1 = 0;
  cropX2 = 0;
  cropY2 = 0;
  solutions = null;
  mazeImg = null;
  markersImg = null;
  solutionsImgs = null;

  constructor(p, camera, w, h) {
    this.p = p;
    this.camera = camera;
    this.w = w;
    this.h = h;
    this.graph = new MazeGraph(w, h);
    this.solvedGraph = new Graph(w * h);  // Graph used to draw the maze.
    this.toShapeList = Array(w * h).fill(0);  // -1 = remove, 1 = add, 0 = nothing.
    this.needsUpdate = false;  // Set to true when an update is requested. Set to false in update().
  }

  coordToIndex(x, y) {
    return y * this.w + x;
  }

  indexToCoord(index) {
    return { x: index % this.w, y: Math.floor(index / this.w) };
  }

  loadFile(file) {
    this.graph.load(file);
    this.update(true);
  }

  saveFile(fileName) {
    this.graph.save(fileName);
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
    this.updateSolutions();
    this.updateMazeImg();
    this.updateMarkersImg();
    this.updateSolutionsImgs();
    // Allow update requests.
    this.needsUpdate = false;
  }

  updateMazeImg() {
    // Reset cropping points to the most unoptimal points. Will be optimized later.
    this.cropX1 = this.w;
    this.cropY1 = this.h;
    this.cropX2 = 0;
    this.cropY2 = 0;

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
          // Update cropping points.
          this.cropX1 = Math.min(this.cropX1, j);
          this.cropY1 = Math.min(this.cropY1, i);
          this.cropX2 = Math.max(this.cropX2, j);
          this.cropY2 = Math.max(this.cropY2, i);

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
    $.app__setExportMazeData({
      mazeImg: this.mazeImg,
      markersImg: this.markersImg,
      cropX1: this.cropX1,
      cropX2: this.cropX2,
      cropY1: this.cropY1,
      cropY2: this.cropY2,
    });
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

    // Does not require passing data to App.
  }

  updateSolutionsImgs() {
    this.solutionsImgs = [];
    for (let c = 0; c < consts.COLOURS.length; c++) {
      // Check run condition.
      if (this.solutions[c] === null) {
        this.solutionsImgs.push(this.p.createGraphics(10, 10));  // Append dummy image.
        continue;
      }

      let img = this.p.createGraphics(this.w * $.tileSize + this.mazeStrokeWeight, this.h * $.tileSize + this.mazeStrokeWeight);  // Padding to accomodate stroke weight.
      // Shift to accomodate stroke weight.
      img.push();
      img.translate(this.mazeStrokeWeight / 2, this.mazeStrokeWeight / 2);
      // Draw solution.
      img.stroke(consts.COLOURS[c]);
      img.strokeWeight(this.suggestedPathsWeight);
      img.strokeCap(this.p.ROUND);
      this.solutions[c].forEach(e => {
        let a = this.indexToCoord(e.a);
        let b = this.indexToCoord(e.b);
        img.line((a.x + 0.5) * $.tileSize, (a.y + 0.5) * $.tileSize, (b.x + 0.5) * $.tileSize, (b.y + 0.5) * $.tileSize);
      });

      img.pop();

      this.solutionsImgs.push(img);
    }
  }

  updateSolutions() {
    this.solutions = [];
    for (let c = 0; c < consts.COLOURS.length; c++) {
      let firstOccurance = this.graph.markerList.indexOf(c);
      let lastOccurance = this.graph.markerList.lastIndexOf(c);
      // Not applicable if there is 1 or less markers of colour.
      if (firstOccurance === lastOccurance) {
        this.solutions.push(null);
        continue;
      }

      let edgeList = [];
      let parents = this.solvedGraph.bfs(firstOccurance);
      for (let i = firstOccurance + 1; i <= lastOccurance; i++) {
        // Do not find path if not correct marker.
        if (this.graph.markerList[i] !== c) {
          continue;
        }

        let v = i;
        while (v !== firstOccurance) {
          edgeList.push({ a: v, b: parents[v] });
          v = parents[v];
        }
      }
      this.solutions.push(edgeList);
    }

    console.log(this.solutions);
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
    let parents = this.graph.bfs(bfsStart, this.graph.floodFillShapeFilterFunc);
    // Compare flood-fill with all active cells.
    for (let i = 0; i < this.graph.size; i++) {
      let isActive = this.graph.activeList[i];
      let isParent = (parents[i] !== -1);
      let hasMarker = this.graph.markerList[i] !== null;
      // Not continuous error.
      if (isActive !== isParent) {
        return { success: false, result: 'The maze must be contiguous.' };
      }
      // Marker not on maze error.
      if (hasMarker && !isActive) {
        return { success: false, result: 'All markers must be on the maze.' };
      }
    }
    // No errors.
    return { success: true };
  }

  shape(x, y, currX, currY, state) {  
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
    let parents = this.graph.bfs(index, this.graph.floodFillShapeFilterFunc);
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
    if (keyLogger.isKeyCodePressed(this.p.SHIFT) && !state) { // Only allow fill if erasing.
      this.setSuggestedPathFill(x, y, state);
    }
    else {
      this.setSuggestedPathPen(x, y, currX, currY, state);
    }
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

  setSuggestedPathFill(x, y, state) {
    let index = this.coordToIndex(x, y);
    // BFS to find flood fill region, and shapeFill() for each cell in the region.
    let parents = this.graph.bfs(index, this.graph.floodFillSuggestedPathFilterFunc);
    parents.forEach((parent, i) => {
      if (parent !== -1) {
        this.graph.adjList[i].forEach(e => {
          this.graph.editEdge(e.a, e.b, { notes: { suggestedPath: state } });
        });
      }
    })
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
    if ($.mode === consts.SOLVE) {
      this.drawSolutions();
    }
    if ($.mode === consts.CREATE) {
      this.drawSuggestedPaths();
    }
  }

  drawGrid() {
    let regularIncrement = (this.camera.pos.z >= 1 || $.useRuler) ? 1 : $.rulerIncrement;
    // Draw regular grid lines.
    this.p.stroke(this.gridLineColour);
    this.p.strokeCap(this.p.PROJECT);
    this.p.strokeWeight(Math.max(this.gridLineWeight, 1 / this.camera.pos.z));  // Should not go below 1.
    for (let i = 0; i <= this.h; i += regularIncrement) {
      this.p.line(0, i * $.tileSize, $.tileSize * this.w, i * $.tileSize);
    }
    for (let i = 0; i <= this.w; i += regularIncrement) {
      this.p.line(i * $.tileSize, 0, i * $.tileSize, $.tileSize * this.h);
    }
    // Check run condition.
    if (!$.useRuler) {
      return;
    }
    // Draw emphasized grid lines.
    this.p.stroke(this.gridLineEmphasisColour);
    for (let i = $.rulerIncrement; i <= this.h - 1; i += $.rulerIncrement) {  // First and last lines should not be emphasized.
      this.p.line(0, i * $.tileSize, $.tileSize * this.w, i * $.tileSize);
    }
    for (let i = $.rulerIncrement; i <= this.w - 1; i += $.rulerIncrement) {
      this.p.line(i * $.tileSize, 0, i * $.tileSize, $.tileSize * this.h);
    }
  }

  drawSuggestedPaths() {
    this.p.stroke(this.suggestedPathsColour);
    this.p.strokeWeight(this.suggestedPathsWeight);
    this.p.strokeCap(this.p.ROUND);
    this.graph.edgeList.filter(e => this.graph.getNotes(e, 'suggestedPath')).forEach(e => {
      let a = this.indexToCoord(e.a);
      let b = this.indexToCoord(e.b);
      this.p.line((a.x + 0.5) * $.tileSize, (a.y + 0.5) * $.tileSize, (b.x + 0.5) * $.tileSize, (b.y + 0.5) * $.tileSize);
    });
  }

  drawMarkers() {
    this.p.image(this.markersImg, -this.mazeStrokeWeight / 2, -this.mazeStrokeWeight / 2);  // Shift to accomodate stroke weight.
  }

  drawSolutions() {
    this.p.image(this.solutionsImgs[0], -this.mazeStrokeWeight / 2, -this.mazeStrokeWeight / 2);  // Shift to accomodate stroke weight.
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
