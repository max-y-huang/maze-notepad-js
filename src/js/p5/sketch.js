import Camera from './camera';
import Cursor from './cursor';
import Maze from './maze';

const sketch = p => {

  let setupWidth = 0, setupHeight = 0;
  let camera;
  let cursor;
  let maze;

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    onResize(props.width, props.height);
  };

  p.setup = () => {
    p.createCanvas(setupWidth, setupHeight);
    p.frameRate(60);
    camera = new Camera(p, 0, 0, 1, Math.sqrt(2));
    maze = new Maze(p, 10, 10);
    cursor = new Cursor(p, camera, maze);
  };

  p.draw = () => {
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

  p.mouseDragged = () => {
    if (p.mouseButton !== p.CENTER) {
      return;
    }
    camera.translate();
  }

  p.mouseWheel = (event) => {
    camera.zoom(event);
  }
};

export default sketch;
