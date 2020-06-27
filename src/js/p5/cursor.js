import consts from './../consts';
import $ from './global';
import { clamp } from '../funcs';

class Cursor {

  colour = consts.COLOURS[0];

  constructor(p, camera, maze) {
    this.p = p;
    this.camera = camera;
    this.maze = maze;
  }

  // Get grid coordinates of mouse.
  getX(x = this.p.mouseX) {
    return clamp(Math.floor((x - this.camera.pos.x) / this.camera.pos.z / $.tileSize), 0, this.maze.w - 1);
  }
  getY(y = this.p.mouseY) {
    return clamp(Math.floor((y - this.camera.pos.y) / this.camera.pos.z / $.tileSize), 0, this.maze.h - 1);
  }

  draw() {
    // Check run conditions.
    if (!$.mouseOverSketch) {
      return;
    }
    // Draw square cursor in CREATE mode.
    if ($.mode === consts.CREATE) {
      this.drawSquareCursor();
    }
  }

  drawSquareCursor() {
    this.p.noFill();
    this.p.stroke(this.colour);
    this.p.strokeWeight(2);
    this.p.rect(this.getX() * $.tileSize, this.getY() * $.tileSize, $.tileSize, $.tileSize);
  }
}

export { Cursor };
