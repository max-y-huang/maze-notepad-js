import keyLogger from './keyLogger';

class Camera {

  zoomKeyboardSpeed = 100;
  zoomKeyboardSpeedCheck = 0;

  constructor (p, x, y, z, zStep, zMin, zMax) {
    this.p = p;
    this.pos = { x: x, y: y, z: z };
    this.zStep = zStep;
    this.zMin = zMin;
    this.zMax = zMax;
  }

  focus = () => {
    this.p.translate(this.pos.x, this.pos.y);
    this.p.scale(this.pos.z);
  }

  translate = (changeX, changeY) => {
    this.pos.x -= changeX;
    this.pos.y -= changeY;
    // Integer coordinates eliminate anti-aliasing.
    this.pos.x = Math.round(this.pos.x);
    this.pos.y = Math.round(this.pos.y);
  }

  translateWithMouse = () => {
    if (!(this.p.mouseIsPressed && this.p.mouseButton === this.p.CENTER)) {
      return;
    }
    this.translate(-this.p.movedX, -this.p.movedY);
  }

  translateWithKeyboard = () => {
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

  zoom = (delta) => {
    if (this.pos.z * delta < this.zMin) {
      delta = this.zMin / this.pos.z;
    }
    else if (this.pos.z * delta > this.zMax) {
      delta = this.zMax / this.pos.z;
    }
    this.pos.x = (this.pos.x - this.p.mouseX) * delta + this.p.mouseX;
    this.pos.y = (this.pos.y - this.p.mouseY) * delta + this.p.mouseY;
    this.pos.z *= delta;
    // Integer coordinates eliminate anti-aliasing.
    this.pos.x = Math.round(this.pos.x);
    this.pos.y = Math.round(this.pos.y);
  }

  zoomWithMouse = (event) => {
    this.zoom(event.delta > 0 ? 1 / this.zStep : this.zStep);
  }

  zoomWithKeyboard = () => {
    if (!keyLogger.isKeyPressed('q') && !keyLogger.isKeyPressed('e')) {
      this.zoomKeyboardSpeedCheck = 0;
      return;
    }

    let delta = 1;
    if (keyLogger.isKeyPressed('q')) {
      delta /= this.zStep;
    }
    if (keyLogger.isKeyPressed('e')) {
      delta *= this.zStep;
    }
    if (this.p.millis() >= this.zoomKeyboardSpeed + this.zoomKeyboardSpeedCheck) {
      this.zoomKeyboardSpeedCheck = this.p.millis();
      this.zoom(delta);
    }
  }
}

export { Camera };
