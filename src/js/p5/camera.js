class Camera {

  constructor (p, x, y, z, zStep) {
    this.p = p;
    this.pos = { x: x, y: y, z: z };
    this.zStep = zStep;
  }

  focus = () => {
    this.p.translate(this.pos.x, this.pos.y);
    this.p.scale(this.pos.z);
  }

  translate = () => {
    this.pos.x += this.p.movedX;
    this.pos.y += this.p.movedY;
  }

  zoom = (event) => {
    let delta = event.delta > 0 ? 1 / this.zStep : this.zStep;
    this.pos.x = (this.pos.x - this.p.mouseX) * delta + this.p.mouseX;
    this.pos.y = (this.pos.y - this.p.mouseY) * delta + this.p.mouseY;
    this.pos.z *= delta;
  }
}

export { Camera };
