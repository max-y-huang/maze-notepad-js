import consts from './../consts';
import $ from './global';
import keyLogger from './keyLogger';
import { Camera } from './camera';
import { Cursor } from './cursor';
import { Maze } from './maze';

const sketch = p => {

  let setupWidth = 0, setupHeight = 0;
  let camera;
  let cursor;
  let maze;

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    onResize(props.width, props.height);
    $.mouseOverSketch = props.mouseOverCanvas;
    $.showErrorMessageFunc = props.showErrorMessageFunc;
    $.setModeFunc = props.setModeFunc;

    if (props.mode !== $.mode) {
      changeMode(props.mode);
    }
    if (props.createTool !== $.createTool) {
      changeCreateTool(props.createTool);
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
      maze.solvedGraph = maze.graph.kruskal(maze.graph.generateMazeFilterFunc);
      $.mode = mode;
    }
  }

  const changeCreateTool = (tool) => {
    maze.solvedGraph = maze.graph.kruskal(maze.graph.generateMazeFilterFunc);
    $.createTool = tool;
  }

  p.setup = () => {
    p.createCanvas(setupWidth, setupHeight);
    p.frameRate(60);
    p.noSmooth();
    camera = new Camera(p, 96, 96, 2, 2, 1, 8);
    maze = new Maze(p, 100, 100);
    cursor = new Cursor(p, camera, maze);
  };

  p.draw = () => {
    camera.translateWithKeyboard();
    camera.zoomWithKeyboard();

    p.background(241);

    p.push();
    camera.focus();

    maze.draw();
    cursor.draw();

    p.pop();

    p.textSize(16);
    p.text(Math.round(p.frameRate()) + ' FPS', 4, 16);
  };

  // Used instead of default windowResized() to keep track of new width and height.
  const onResize = (width, height) => {
    // setupWidth and setupHeight are used in case setup runs after this function.
    setupWidth = width;
    setupHeight = height;
    p.resizeCanvas(width, height);
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
