import { KeyLogger } from './keyLogger';
import { Camera } from './camera';
import { Cursor } from './cursor';
import { Maze } from './maze';

const sketch = p => {

  let setupWidth = 0, setupHeight = 0;
  let keyLogger;
  let camera;
  let cursor;
  let maze;

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    onResize(props.width, props.height);
  };

  p.setup = () => {
    p.createCanvas(setupWidth, setupHeight);
    p.frameRate(60);
    p.noSmooth();
    keyLogger = new KeyLogger();
    camera = new Camera(p, keyLogger, 0, 0, 1, Math.sqrt(2));
    maze = new Maze(p, 10, 10);
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
    if (p.mouseButton === p.LEFT || p.mouseButton === p.RIGHT) {
      maze.shape(cursor.getX(), cursor.getY(), p.mouseButton === p.LEFT);
    }
  }

  p.mouseDragged = () => {
    if (p.mouseButton === p.LEFT || p.mouseButton === p.RIGHT) {
      maze.shape(cursor.getX(), cursor.getY(), p.mouseButton === p.LEFT);
    }
    else if (p.mouseButton === p.CENTER) {
      camera.translateWithMouse();
    }
  }

  p.mouseWheel = (event) => {
    camera.zoomWithMouse(event);
  }

  p.keyPressed = () => {
    if (p.key === 'P' || p.key === 'p') {
      console.log(maze.graph.kruskal().edgeList);
    }
    keyLogger.onKeyDown(p.key);
  }

  p.keyReleased = () => {
    keyLogger.onKeyUp(p.key);
  }
};

export default sketch;
