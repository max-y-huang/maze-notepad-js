import consts from './../consts';
import $ from './global';
import { clamp } from '../funcs';

class Cursor {

  colour = consts.COLOURS[2];

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
    if ($.mode === consts.CREATE && $.createTool === consts.SHAPE) {
      this.drawSquareCursor();
    }
    if ($.mode === consts.CREATE && $.createTool === consts.MARKERS) {
      this.drawSquareCursor();
    }
  }

  drawSquareCursor = () => {
    this.p.noFill();
    this.p.stroke(this.colour);
    this.p.strokeWeight(2);
    this.p.rect(this.getX() * $.tileSize, this.getY() * $.tileSize, $.tileSize, $.tileSize);
  }
}

export { Cursor };
