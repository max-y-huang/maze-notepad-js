class Graph {

  edgeList = [];

  constructor (size) {
    this.size = size;
  }

  addEdge = (a, b, weight) => {
    this.edgeList.push({ a: a, b: b, weight: weight });
  }

  kruskal = () => {
    const activeEdgesFilter = edge => this.activeList[edge.a] && this.activeList[edge.b];
    const edgeWeightSort = (a, b) => a.weight - b.weight;

    let mst = new Graph(this.size);
    let edges = this.edgeList.filter(activeEdgesFilter).sort(edgeWeightSort);
    let ds = new DisjointSet(this.w * this.h);

    edges.forEach(edge => {
      if (ds.find(edge.a) !== ds.find(edge.b)) {
        ds.union(edge.a, edge.b);
        mst.addEdge(edge.a, edge.b, edge.weight);
      }
    });

    return mst;
  }
}

class MazeGraph extends Graph {

  activeList = [];

  constructor (w, h) {
    super(w * h);
    this.w = w;
    this.h = h;
    this.activeList = Array(this.w * this.h).fill(false);
    this.resetEdgeList();
  }

  getActiveState = (x, y) => this.activeList[y * this.w + x];
  setActiveState = (x, y, state) => { this.activeList[y * this.w + x] = state; }

  resetEdgeList = () => {
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        let v = i * this.w + j;
        // Connect right with a random edge with weight between 1 and 2.
        if (j < this.w - 1) {
          this.addEdge(v, v + 1, Math.random() + 1);
        }
        // Connect down with a random edge with weight between 1 and 2.
        if (i < this.h - 1) {
          this.addEdge(v, v + this.h, Math.random() + 1);
        }
      }
    }
  }
}

class DisjointSet {

  constructor (size) {
    this.size = size;
    this.parentList = Array(size).fill(0).map((x, i) => i);
    this.rankList = Array(size).fill(0);
  }

  find = (n) => {
    if (this.parentList[n] !== n) {
      this.parentList[n] = this.find(this.parentList[n]);
    }
    return this.parentList[n];
  }

  union = (a, b) => {
    let rootA = this.find(a);
    let rootB = this.find(b);
    if (rootA === rootB) {
      return;
    }
    // Make sure that rootA's rank <= rootB's rank
    if (this.rankList[rootA] < this.rankList[rootB]) {
      [ rootA, rootB ] = [ rootB, rootA ];
    }
    this.parentList[rootB] = rootA;
    if (this.rankList[rootA] === this.rankList[rootB]) {
      this.rankList[rootA]++;
    }
  }
}

export { Graph, MazeGraph };
