import keyLogger from './keyLogger';

class Camera {

  // Zooming with keyboard only occurs every 100ms.
  zoomKeyboardSpeed = 100;  // In milliseconds.
  zoomKeyboardSpeedCheck = 0;

  constructor(p, x, y, z, zStep, zMin, zMax) {
    this.p = p;
    this.pos = { x: x, y: y, z: z };
    this.zStep = zStep;  // Zoom strength.
    this.zMin = zMin;
    this.zMax = zMax;
  }

  // Shifts the screen to reflect camera.
  focus() {
    this.p.translate(this.pos.x, this.pos.y);
    this.p.scale(this.pos.z);
  }

  translate(changeX, changeY) {
    this.pos.x -= changeX;
    this.pos.y -= changeY;
    // Integer coordinates eliminate anti-aliasing.
    this.pos.x = Math.round(this.pos.x);
    this.pos.y = Math.round(this.pos.y);
  }

  translateWithMouse() {
    // Check for run condition (middle-click).
    if (!(this.p.mouseIsPressed && this.p.mouseButton === this.p.CENTER)) {
      return;
    }
    
    this.translate(-this.p.movedX, -this.p.movedY);
  }

  translateWithKeyboard() {
    let speed = 30;
    let changeX = 0, changeY = 0;
    if (keyLogger.isKeyPressed('w')) {
      changeY -= speed;
    }
    if (keyLogger.isKeyPressed('a')) {
      changeX -= speed;
    }
    if (keyLogger.isKeyPressed('s')) {
      changeY += speed;
    }
    if (keyLogger.isKeyPressed('d')) {
      changeX += speed;
    }
    this.translate(changeX, changeY);
  }

  zoom(delta) {
    // Bind zoom between zMin and zMax. clamp() is not used because x and y also need to be modified (which messes up with clamp()).
    if (this.pos.z * delta < this.zMin) {
      delta = this.zMin / this.pos.z;
    }
    else if (this.pos.z * delta > this.zMax) {
      delta = this.zMax / this.pos.z;
    }
    // Zoom in on mouse.
    this.pos.x = (this.pos.x - this.p.mouseX) * delta + this.p.mouseX;
    this.pos.y = (this.pos.y - this.p.mouseY) * delta + this.p.mouseY;
    this.pos.z *= delta;
    // Integer coordinates eliminate anti-aliasing.
    this.pos.x = Math.round(this.pos.x);
    this.pos.y = Math.round(this.pos.y);
  }

  zoomWithMouse(event) {
    this.zoom(event.delta > 0 ? 1 / this.zStep : this.zStep);
  }

  zoomWithKeyboard() {
    // Check for run condition.
    if (!keyLogger.isKeyPressed('q') && !keyLogger.isKeyPressed('e')) {
      this.zoomKeyboardSpeedCheck = 0;  // Reset zoom timer when not activated.
      return;
    }
    // Zoom timer check.
    if (this.p.millis() < this.zoomKeyboardSpeed + this.zoomKeyboardSpeedCheck) {
      return;
    }
    this.zoomKeyboardSpeedCheck = this.p.millis();

    let delta = 1;
    if (keyLogger.isKeyPressed('q')) {
      delta /= this.zStep;
    }
    if (keyLogger.isKeyPressed('e')) {
      delta *= this.zStep;
    }
    this.zoom(delta);
  }
}

export { Camera };
