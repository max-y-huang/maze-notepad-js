let initWidth = 0, initHeight = 0;

const sketch = p => {

  p.camera = { x: 0, y: 0, zoom: 1, zoomStep: Math.sqrt(2) };

  p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
    p.onResize(props.width, props.height);
  };

  p.setup = () => {
    p.createCanvas(initWidth, initHeight);
    p.frameRate(60);
  };

  p.draw = () => {
    p.background(100);

    p.push();
    p.translate(p.camera.x, p.camera.y);
    p.scale(p.camera.zoom);

    p.rect(100, 100, 200, 200);

    p.pop();

    p.textSize(16);
    p.text(Math.round(p.frameRate()) + ' FPS', 4, 16);
  };

  // Used instead of default windowResized() to keep track of new width and height.
  p.onResize = (width, height) => {
    // initWidth and initHeight are used in case setup runs after this function.
    initWidth = width;
    initHeight = height;
    p.resizeCanvas(width, height);
  }

  p.mouseDragged = () => {
    p.camera.x += p.movedX;
    p.camera.y += p.movedY;
  }

  p.mouseWheel = (event) => {
    let delta = event.delta > 0 ? 1 / p.camera.zoomStep : p.camera.zoomStep;
    p.camera.x = (p.camera.x - p.mouseX) * delta + p.mouseX;
    p.camera.y = (p.camera.y - p.mouseY) * delta + p.mouseY;
    p.camera.zoom *= delta;
  }
};

export default sketch;
