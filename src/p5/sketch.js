
import Maze from './maze';

const sketch = p => {

  let setupWidth = 0, setupHeight = 0;
  let camera;
  let maze;

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    onResize(props.width, props.height);
  };

  p.setup = () => {
    p.createCanvas(setupWidth, setupHeight);
    p.frameRate(60);
    camera = { x: 0, y: 0, zoom: 1, zoomStep: Math.sqrt(2) };
    maze = new Maze(p, 10, 10);
  };

  p.draw = () => {
    p.background(100);

    p.push();
    p.translate(camera.x, camera.y);
    p.scale(camera.zoom);

    maze.draw();

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
    camera.x += p.movedX;
    camera.y += p.movedY;
  }

  p.mouseWheel = (event) => {
    let delta = event.delta > 0 ? 1 / camera.zoomStep : camera.zoomStep;
    camera.x = (camera.x - p.mouseX) * delta + p.mouseX;
    camera.y = (camera.y - p.mouseY) * delta + p.mouseY;
    camera.zoom *= delta;
  }
};

export default sketch;
