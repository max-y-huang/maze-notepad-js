class Camera {

  zoomKeyboardSpeed = 100;
  zoomKeyboardSpeedCheck = 0;

  constructor (p, keyLogger, x, y, z, zStep) {
    this.p = p;
    this.keyLogger = keyLogger;
    this.pos = { x: x, y: y, z: z };
    this.zStep = zStep;
  }

  focus = () => {
    this.p.translate(this.pos.x, this.pos.y);
    this.p.scale(this.pos.z);
  }

  translate = (changeX, changeY) => {
    this.pos.x -= changeX;
    this.pos.y -= changeY;
  }

  translateWithMouse = () => {
    this.pos.x += this.p.movedX;
    this.pos.y += this.p.movedY;
  }

  translateWithKeyboard = () => {
    let speed = 30;
    let changeX = 0, changeY = 0;
    if (this.keyLogger.isKeyPressed('w')) {
      changeY -= speed;
    }
    if (this.keyLogger.isKeyPressed('a')) {
      changeX -= speed;
    }
    if (this.keyLogger.isKeyPressed('s')) {
      changeY += speed;
    }
    if (this.keyLogger.isKeyPressed('d')) {
      changeX += speed;
    }
    this.translate(changeX, changeY);
  }

  zoom = (delta) => {
    this.pos.x = (this.pos.x - this.p.mouseX) * delta + this.p.mouseX;
    this.pos.y = (this.pos.y - this.p.mouseY) * delta + this.p.mouseY;
    this.pos.z *= delta;
  }

  zoomWithMouse = (event) => {
    this.zoom(event.delta > 0 ? 1 / this.zStep : this.zStep);
  }

  zoomWithKeyboard = () => {
    if (!this.keyLogger.isKeyPressed('q') && !this.keyLogger.isKeyPressed('e')) {
      this.zoomKeyboardSpeedCheck = 0;
      return;
    }

    let delta = 1;
    if (this.keyLogger.isKeyPressed('q')) {
      delta /= this.zStep;
    }
    if (this.keyLogger.isKeyPressed('e')) {
      delta *= this.zStep;
    }
    if (this.p.millis() >= this.zoomKeyboardSpeed + this.zoomKeyboardSpeedCheck) {
      this.zoomKeyboardSpeedCheck = this.p.millis();
      this.zoom(delta);
    }
  }
}

export { Camera };
