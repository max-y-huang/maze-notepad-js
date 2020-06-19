import { clamp } from '../funcs';

class Cursor {

  tileSize = 14;
  colour = [ 64, 128, 255 ];

  constructor (p, camera, maze) {
    this.p = p;
    this.camera = camera;
    this.maze = maze;
  }

  getX = () => clamp(Math.floor((this.p.mouseX - this.camera.pos.x) / this.camera.pos.z / this.tileSize), 0, this.maze.w - 1);
  getY = () => clamp(Math.floor((this.p.mouseY - this.camera.pos.y) / this.camera.pos.z / this.tileSize), 0, this.maze.h - 1);
 
  draw = () => {
    this.p.noFill();
    this.p.stroke(this.colour);
    this.p.strokeWeight(2);
    this.p.rect(this.getX() * this.tileSize, this.getY() * this.tileSize, this.tileSize, this.tileSize);
  }
}

export { Cursor };
