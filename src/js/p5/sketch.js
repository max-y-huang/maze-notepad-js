import consts from './../consts';
import $ from './global';
import keyLogger from './keyLogger';
import { Camera } from './camera';
import { Cursor } from './cursor';
import { Ruler } from './ruler';
import { Maze } from './maze';

const sketch = p => {

  let testingMode = false;  // TODO: Set to false when deploying.

  let requestOpenMazeFlag = 0;
  let requestSaveMazeFlag = 0;
  let requestResetMazePatternFlag = 0;
  let requestResetCameraFlag = 0;
  let requestKeyLoggerClearFlag = 0;
  let requestOpenMazeHttpFlag = 0;

  let camera;
  let cursor;
  let ruler;
  let maze;

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    openMazeFile(props.requestOpenMazeFlag, props.openMazeFile);
    saveMazeFile(props.requestSaveMazeFlag, 'maze.mznp');
    resetMazePattern(props.requestResetMazePatternFlag);
    resetCamera(props.requestResetCameraFlag);
    keyLoggerClear(props.requestKeyLoggerClearFlag);
    openMazeHttp(props.requestOpenMazeHttpFlag, props.httpMazeData);
    changeUseRuler(props.useRuler);
    changeMode(props.mode);
    changeCreateTool(props.createTool);
    changeMarkerColour(props.markerColour);
    changeSolutionColour(props.solutionColour);
    changePenColour(props.penColour);
  };

  const openMazeFile = (flag, file) => {
    // Check for run condition.
    if (flag === requestOpenMazeFlag) {
      return;
    }
    requestOpenMazeFlag = flag;

    maze.loadFile(file);
  }

  const saveMazeFile = (flag, fileName) => {
    // Check for run condition.
    if (flag === requestSaveMazeFlag) {
      return;
    }
    requestSaveMazeFlag = flag;

    maze.saveFile(fileName);
  }

  const resetMazePattern = (flag) => {
    // Check for run condition.
    if (flag === requestResetMazePatternFlag) {
      return;
    }
    requestResetMazePatternFlag = flag;

    maze.resetPattern();
  }

  const resetCamera = (flag) => {
    // Check for run condition.
    if (flag === requestResetCameraFlag) {
      return;
    }
    requestResetCameraFlag = flag;
    
    camera.reset();
  }

  const keyLoggerClear = (flag) => {
    // Check for run condition.
    if (flag === requestKeyLoggerClearFlag) {
      return;
    }
    requestKeyLoggerClearFlag = flag;

    keyLogger.clear();
  }

  const openMazeHttp = (flag, data) => {
    // Check for run condition.
    if (flag === requestOpenMazeHttpFlag) {
      return;
    }
    // Wait until the maze is created.
    if (maze) {
      requestOpenMazeHttpFlag = flag;
      maze.loadData(data);
    }
  }

  const changeUseRuler = (useRuler) => {
    // Check for run condition.
    if (useRuler === $.useRuler) {
      return;
    }

    $.useRuler = useRuler;
  }

  const changeMode = (mode) => {
    // Check for run condition.
    if (mode === $.mode) {
      return;
    }

    maze.update(true);
    
    if (mode === consts.CREATE) {
      $.mode = mode;
    }
    else if (mode === consts.SOLVE) {
      // Validate maze before changing mode to SOLVE.
      let validCheck = maze.isValidMaze();
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

  const changeSolutionColour = (solutionColour) => {
    // Check for run condition.
    if (solutionColour === $.solutionColour) {
      return;
    }

    $.solutionColour = solutionColour;
  }

  const changePenColour = (penColour) => {
    // Check for run condition.
    if (penColour === $.penColour) {
      return;
    }

    $.penColour = penColour;
  }

  p.setup = () => {
    p.createCanvas($.width, $.height);
    p.frameRate(60);
    p.noSmooth();
    camera = new Camera(p, 96, 96, 2, 2, 1, 4);
    maze = new Maze(p, camera, 64, 64);
    cursor = new Cursor(p, camera, maze);
    ruler = new Ruler(p, camera, maze);
    maze.update(true);
    // Add multiple square mazes (with partial overlap) to create a non-square shape.
    /*addStarterMaze(4, 4, 8, 8);
    addStarterMaze(12, 4, 8, 8);
    addStarterMaze(12, 12, 8, 7);
    addStarterMaze(15, 19, 2, 1);
    addStarterMaze(4, 20, 8, 8);
    addStarterMaze(12, 20, 8, 8);
    addStarterMaze(20, 20, 8, 8);*/
  };

  p.draw = () => {
    onResize();

    camera.translateWithKeyboard();
    camera.zoomWithKeyboard();

    p.background('#333333');
    p.push();
    camera.focus();
    maze.draw();
    cursor.draw();
    p.pop();

    ruler.draw();

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
    if (!$.checkMouseInput) {
      return;
    }

    maze.shapeWithMouse(cursor.getX(), cursor.getY(), cursor.getX(), cursor.getY());
    maze.setSuggestedPathWithMouse(cursor.getX(), cursor.getY(), cursor.getX(), cursor.getY());
    maze.setTestingPathWithMouse(cursor.getX(), cursor.getY(), cursor.getX(), cursor.getY());
    maze.setMarkerWithMouse(cursor.getX(), cursor.getY());
  }

  p.mouseDragged = () => {
    // Check run conditions.
    if (!$.checkMouseInput) {
      return;
    }

    camera.translateWithMouse();
    maze.shapeWithMouse(cursor.getX(), cursor.getY(), cursor.getX(p.mouseX - p.movedX), cursor.getY(p.mouseY - p.movedY));
    maze.setSuggestedPathWithMouse(cursor.getX(), cursor.getY(), cursor.getX(p.mouseX - p.movedX), cursor.getY(p.mouseY - p.movedY));
    maze.setTestingPathWithMouse(cursor.getX(), cursor.getY(), cursor.getX(p.mouseX - p.movedX), cursor.getY(p.mouseY - p.movedY));
  }

  p.mouseReleased = () => {
    maze.update();
  }

  p.mouseWheel = (event) => {
    // Check run conditions.
    if (!$.checkMouseInput) {
      return;
    }

    camera.zoomWithMouse(event);
  }

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
