import consts from './../consts';
import $ from './global';
import keyLogger from './keyLogger';
import { Camera } from './camera';
import { Cursor } from './cursor';
import { Maze } from './maze';

const sketch = p => {

  let testingMode = false;

  let camera;
  let cursor;
  let maze;

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    if (props.mode !== $.mode) {
      changeMode(props.mode);
    }
    if (props.createTool !== $.createTool) {
      changeCreateTool(props.createTool);
    }
    if (props.markerColour !== $.markerColour) {
      changeMarkerColour(props.markerColour);
    }
  };

  const changeMode = (mode) => {
    if (mode === consts.CREATE) {
      $.mode = mode;
    }
    else if (mode === consts.SOLVE) {
      let validCheck = maze.isValidMazeShape();
      if (!validCheck.success) {
        $.showErrorMessageFunc(validCheck.result);
        $.setModeFunc($.mode);
        return;
      }
      $.mode = mode;
    }
  }

  const changeCreateTool = (tool) => {
    $.createTool = tool;
  }

  const changeMarkerColour = (colour) => {
    $.markerColour = colour;
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

    if (testingMode) {
      p.stroke(255, 0, 0);
      p.strokeWeight(8);
      p.strokeCap(p.PROJECT);
      p.line(4, 4, 4, 32);
      p.line(4, 4, 32, 4);
      p.line(p.width - 4, p.height - 4, p.width - 4, p.height - 32);
      p.line(p.width - 4, p.height - 4, p.width - 32, p.height - 4);
      p.noStroke();
      p.fill(255, 0, 0);
      p.textSize(16);
      p.text(Math.round(p.frameRate()) + ' FPS', 16, 32);
    }
  };

  // Used instead of default windowResized() to keep track of new width and height.
  const onResize = () => {
    if (p.width === $.width && p.height === $.height) {
      return;
    }
    p.resizeCanvas($.width, $.height);
  }

  p.mousePressed = () => {
    if (!$.mouseOverSketch) {
      return;
    }
    maze.shapeWithMouse(cursor.getX(), cursor.getY(), cursor.getX(), cursor.getY());
    maze.setMarkerWithMouse(cursor.getX(), cursor.getY());
  }

  p.mouseDragged = () => {
    if (!$.mouseOverSketch) {
      return;
    }
    camera.translateWithMouse();
    maze.shapeWithMouse(cursor.getX(), cursor.getY(), cursor.getX(p.mouseX - p.movedX), cursor.getY(p.mouseY - p.movedY));
  }

  p.mouseReleased = () => {
    maze.update();
  }

  p.mouseWheel = (event) => {
    if (!$.mouseOverSketch) {
      return;
    }
    camera.zoomWithMouse(event);
  }

  p.keyPressed = () => {
    if (!$.mouseOverSketch) {
      return;
    }
    keyLogger.onKeyDown(p.key);
    keyLogger.onKeyCodeDown(p.keyCode);
  }

  p.keyReleased = () => {
    keyLogger.onKeyUp(p.key);
    keyLogger.onKeyCodeUp(p.keyCode);
  }
};

export default sketch;
