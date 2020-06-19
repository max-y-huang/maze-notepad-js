class Camera {

  constructor (p, x, y, zoom, zoomStep) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.zoom = zoom;
    this.zoomStep = zoomStep;
  }

  focus = () => {
    this.p.translate(this.x, this.y);
    this.p.scale(this.zoom);
  }

  onTranslate = () => {
    this.x += this.p.movedX;
    this.y += this.p.movedY;
  }

  onZoom = (event) => {
    let delta = event.delta > 0 ? 1 / this.zoomStep : this.zoomStep;
    this.x = (this.x - this.p.mouseX) * delta + this.p.mouseX;
    this.y = (this.y - this.p.mouseY) * delta + this.p.mouseY;
    this.zoom *= delta;
  }
}

export default Camera;
