import { saveAs } from 'file-saver';

import consts from './../consts';
import $ from './global';
import keyLogger from './keyLogger';
import { Camera } from './camera';
import { Cursor } from './cursor';
import { Maze } from './maze';

const sketch = p => {

  let testingMode = false;  // TODO: Set to false when deploying.

  let requestOpenMazeFlag = 0;
  let requestSaveMazeFlag = 0;

  let camera;
  let cursor;
  let maze;

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    openMazeFile(props.requestOpenMazeFlag, props.openMazeFile);
    saveMazeFile(props.requestSaveMazeFlag, 'maze.mznp');
    changeMode(props.mode);
    changeCreateTool(props.createTool);
    changeMarkerColour(props.markerColour);
  };

  const openMazeFile = (flag, file) => {
    // Check for run condition.
    if (flag === requestOpenMazeFlag) {
      return;
    }
    requestOpenMazeFlag = flag;

    // Adding edges with addEdge to update both edgeList and adjList.
    maze.graph.edgeList = [];
    file.edgeList.forEach(edge => {
      maze.graph.addEdge(edge.a, edge.b, edge.weight, edge.notes);
    });
    maze.graph.activeList = file.activeList;
    maze.graph.markerList = file.markerList;
    maze.needsUpdate = true;
    maze.update();
  }

  const saveMazeFile = (flag, fileName) => {
    // Check for run condition.
    if (flag === requestSaveMazeFlag) {
      return;
    }
    requestSaveMazeFlag = flag;

    let content = {
      edgeList: maze.graph.edgeList,
      activeList: maze.graph.activeList,
      markerList: maze.graph.markerList
    };
    saveAs(new Blob([ JSON.stringify(content) ], { type: 'text/plain;charset=utf-8' }), fileName);
  }

  const changeMode = (mode) => {
    // Check for run condition.
    if (mode === $.mode) {
      return;
    }
    
    if (mode === consts.CREATE) {
      $.mode = mode;
    }
    else if (mode === consts.SOLVE) {
      // Validate maze before changing mode to SOLVE.
      let validCheck = maze.isValidMazeShape();
      if (!validCheck.success) {
        $.app_showErrorMessageFunc(validCheck.result);  // Display error message.
        $.app_setModeFunc($.mode);  // Revert mode back from SOLVE.
        return;
      }
      $.mode = mode;
    }
  }

  const changeCreateTool = (createTool) => {
    // Check for run condition.
    if (createTool === $.createTool) {
      return;
    }
    $.createTool = createTool;
  }

  const changeMarkerColour = (markerColour) => {
    // Check for run condition.
    if (markerColour === $.markerColour) {
      return;
    }
    $.markerColour = markerColour;
  }

  p.setup = () => {
    p.createCanvas($.width, $.height);
    p.frameRate(60);
    p.noSmooth();
    camera = new Camera(p, 96, 96, 2, 2, 1, 8);
    maze = new Maze(p, 100, 100);
    cursor = new Cursor(p, camera, maze);
    // Add multiple square mazes (with partial overlap) to create a non-square shape.
    addStarterMaze(4, 4, 8, 8);
    addStarterMaze(12, 4, 8, 8);
    addStarterMaze(12, 12, 8, 7);
    addStarterMaze(15, 19, 2, 1);
    addStarterMaze(4, 20, 8, 8);
    addStarterMaze(12, 20, 8, 8);
    addStarterMaze(20, 20, 8, 8);
  };

  p.draw = () => {
    onResize();

    camera.translateWithKeyboard();
    camera.zoomWithKeyboard();

    p.background(64);
    p.push();
    camera.focus();
    maze.draw();
    cursor.draw();
    p.pop();

    drawTestingWidgets();
  };

  const drawTestingWidgets = () => {
    if (!testingMode) {
      return;
    }
    // Draw corners to test canvas size.
    p.stroke(255, 0, 0);
    p.strokeWeight(8);
    p.strokeCap(p.PROJECT);
    p.line(4, 4, 4, 32);
    p.line(4, 4, 32, 4);
    p.line(p.width - 4, p.height - 4, p.width - 4, p.height - 32);
    p.line(p.width - 4, p.height - 4, p.width - 32, p.height - 4);
    // Draw frame rate.
    p.noStroke();
    p.fill(255, 0, 0);
    p.textSize(16);
    p.text(Math.round(p.frameRate()) + ' FPS', 16, 32);
  }

  const addStarterMaze = (x, y, w, h) => {
    maze.needsUpdate = true;
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        let index = (i + y) * maze.w + (j + x);
        maze.graph.activeList[index] = true;
      }
    }
    maze.update();
  }

  // Used instead of default windowResized() to keep track of new width and height.
  const onResize = () => {
    // Check run conditions.
    if (p.width === $.width && p.height === $.height) {
      return;
    }

    p.resizeCanvas($.width, $.height);
  }

  p.mousePressed = () => {
    // Check run conditions.
    if (!$.mouseOverSketch) {
      return;
    }

    maze.shapeWithMouse(cursor.getX(), cursor.getY(), cursor.getX(), cursor.getY());
    maze.setSuggestedPathWithMouse(cursor.getX(), cursor.getY(), cursor.getX(), cursor.getY());
    maze.setMarkerWithMouse(cursor.getX(), cursor.getY());
  }

  p.mouseDragged = () => {
    // Check run conditions.
    if (!$.mouseOverSketch) {
      return;
    }

    camera.translateWithMouse();
    maze.shapeWithMouse(cursor.getX(), cursor.getY(), cursor.getX(p.mouseX - p.movedX), cursor.getY(p.mouseY - p.movedY));
    maze.setSuggestedPathWithMouse(cursor.getX(), cursor.getY(), cursor.getX(p.mouseX - p.movedX), cursor.getY(p.mouseY - p.movedY));
  }

  p.mouseReleased = () => {
    maze.update();
  }

  p.mouseWheel = (event) => {
    // Check run conditions.
    if (!$.mouseOverSketch) {
      return;
    }

    camera.zoomWithMouse(event);
  }

  // Key inputs work even if the mouse is not over the sketch.

  p.keyPressed = () => {
    keyLogger.onKeyDown(p.key);
    keyLogger.onKeyCodeDown(p.keyCode);
  }

  p.keyReleased = () => {
    keyLogger.onKeyUp(p.key);
    keyLogger.onKeyCodeUp(p.keyCode);
  }
};

export default sketch;
