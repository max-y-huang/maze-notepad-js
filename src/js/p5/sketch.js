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
  };

  p.setup = () => {
    p.createCanvas(setupWidth, setupHeight);
    p.frameRate(60);
    p.noSmooth();
    camera = new Camera(p, 0, 0, 1, 2, 1, 8);
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
    if (p.mouseButton === p.LEFT || p.mouseButton === p.RIGHT) {
      maze.shape(cursor.getX(), cursor.getY(), p.mouseButton === p.LEFT, cursor.getX(), cursor.getY());
    }
  }

  p.mouseDragged = () => {
    if (!$.mouseOverSketch) {
      return;
    }
    if (p.mouseButton === p.LEFT || p.mouseButton === p.RIGHT) {
      maze.shape(cursor.getX(), cursor.getY(), p.mouseButton === p.LEFT, cursor.getX(p.mouseX - p.movedX), cursor.getY(p.mouseY - p.movedY));
    }
    else if (p.mouseButton === p.CENTER) {
      camera.translateWithMouse();
    }
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
    if (p.key === ' ') {
      if ($.mode === $.CREATE) {
        maze.solvedGraph = maze.graph.kruskal();  // TODO: Move to maze.
        $.mode = $.SOLVE;
      }
      else if ($.mode === $.SOLVE) {
        $.mode = $.CREATE;
      }
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
