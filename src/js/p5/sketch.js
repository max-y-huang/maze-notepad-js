import consts from './../consts';
import $ from './global';
import keyLogger from './keyLogger';
import { Camera } from './camera';
import { Cursor } from './cursor';
import { Maze } from './maze';

const sketch = p => {

  let testingMode = false;  // TODO: Set to false when deploying.

  let camera;
  let cursor;
  let maze;

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    changeMode(props.mode);
    changeCreateTool(props.createTool);
    changeMarkerColour(props.markerColour);
  };

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
        $.showErrorMessageFunc(validCheck.result);  // Display error message.
        $.setModeFunc($.mode);  // Revert mode back from SOLVE.
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
