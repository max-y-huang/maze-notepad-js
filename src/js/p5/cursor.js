import consts from './../consts';
import $ from './global';
import { clamp } from '../funcs';

class Cursor {

  colour = [ 41, 148, 209 ];

  constructor (p, camera, maze) {
    this.p = p;
    this.camera = camera;
    this.maze = maze;
  }

  getX = (x = this.p.mouseX) => clamp(Math.floor((x - this.camera.pos.x) / this.camera.pos.z / $.tileSize), 0, this.maze.w - 1);
  getY = (y = this.p.mouseY) => clamp(Math.floor((y - this.camera.pos.y) / this.camera.pos.z / $.tileSize), 0, this.maze.h - 1);

  draw = () => {
    if (!$.mouseOverSketch) {
      return;
    }
    if ($.mode === consts.CREATE) {
      this.drawCreate();
    }
    else if ($.mode === consts.SOLVE) {
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
