import $ from './global';
import { clamp } from '../funcs';

class Cursor {

  colour = [ 64, 128, 255 ];

  constructor (p, camera, maze) {
    this.p = p;
    this.camera = camera;
    this.maze = maze;
  }

  getX = () => clamp(Math.floor((this.p.mouseX - this.camera.pos.x) / this.camera.pos.z / $.tileSize), 0, this.maze.w - 1);
  getY = () => clamp(Math.floor((this.p.mouseY - this.camera.pos.y) / this.camera.pos.z / $.tileSize), 0, this.maze.h - 1);

  draw = () => {
    if ($.mode === $.CREATE) {
      this.drawCreate();
    }
    else if ($.mode === $.SOLVE) {
      this.drawSolve();
    }
  }

  drawCreate = () => {
    this.p.noFill();
    this.p.stroke(this.colour);
    this.p.strokeWeight(2);
    this.p.rect(this.getX() * $.tileSize, this.getY() * $.tileSize, $.tileSize, $.tileSize);
  }

  drawSolve = () => {}
}

export { Cursor };
