import { clamp } from '../funcs';

class Cursor {

  tileSize = 12;

  constructor (p, camera, maze) {
    this.p = p;
    this.camera = camera;
    this.maze = maze;
  }

  getX = () => clamp(Math.floor((this.p.mouseX - this.camera.pos.x) / this.camera.pos.z / this.tileSize), 0, this.maze.w - 1);
  getY = () => clamp(Math.floor((this.p.mouseY - this.camera.pos.y) / this.camera.pos.z / this.tileSize), 0, this.maze.h - 1);
 
  draw = () => {
    this.p.noFill();
    this.p.stroke(0);
    this.p.strokeWeight(1);
    this.p.rect(this.getX() * this.tileSize, this.getY() * this.tileSize, this.tileSize, this.tileSize);
  }
}

export default Cursor;
