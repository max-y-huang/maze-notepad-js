class Graph {

  edgeList = [];
  activeList = [];

  constructor (w, h) {
    this.w = w;
    this.h = h;
    this.resetEdgeList();
    this.resetActiveList();
  }

  getActiveState = (x, y) => this.activeList[y * this.w + x];
  setActiveState = (x, y, state) => { this.activeList[y * this.w + x] = state; }

  resetActiveList = () => {
    this.activeList = Array(this.w * this.h).fill(false);
  }

  resetEdgeList = () => {
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        let v = i * this.w + j;
        // Connect right with a random edge with weight between 1 and 2.
        if (j < this.w - 1) {
          this.edgeList.push({ a: v, b: v + 1, weight: Math.random() + 1 });
        }
        // Connect down with a random edge with weight between 1 and 2.
        if (i < this.h - 1) {
          this.edgeList.push({ a: v, b: v + this.h, weight: Math.random() + 1 });
        }
      }
    }
  }
}

export default Graph;
