import Graph from './graph';

class Maze {

  tileSize = 6;

  constructor (p, w, h) {
    this.p = p;
    this.w = w;
    this.h = h;
    this.graph = new Graph();
  }
 
  draw = () => {

    this.p.rect(0, 0, this.tileSize * this.w, this.tileSize * this.h);
  }
}

export default Maze;
