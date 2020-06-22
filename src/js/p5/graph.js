class Graph {

  edgeList = [];

  constructor(size) {
    this.size = size;
    this.adjList = [];
    for (let i = 0; i < size; i++) {
      this.adjList.push([]);
    }
  }

  addEdge(a, b, weight, notes=null) {
    let itemA = { a: a, b: b, weight: weight, notes: notes };
    let itemB = { a: b, b: a, weight: weight, notes: notes };
    // Add in 3 different locations. Adjacency lists always have its own node as node a.
    this.edgeList.push(itemA);
    this.adjList[a].push(itemA);
    this.adjList[b].push(itemB);
  }
  
  editEdgeNotes(a, b, newNotes) {
    const sameEdgeFilter = e => (e.a === a && e.b === b) || (e.b === a && e.a === b);
    // Update notes in all 3 locations.
    let edgeListIndex = this.edgeList.findIndex(sameEdgeFilter);
    let adjListAIndex = this.adjList[a].findIndex(sameEdgeFilter);
    let adjListBIndex = this.adjList[b].findIndex(sameEdgeFilter);
    if (edgeListIndex !== -1) {
      this.edgeList[edgeListIndex].notes = newNotes;
    }
    if (adjListAIndex !== -1) {
      this.adjList[a][adjListAIndex].notes = newNotes;
    }
    if (adjListBIndex !== -1) {
      this.adjList[b][adjListBIndex].notes = newNotes;
    }
  }

  bfs(start, filterFunc = (() => true)) {
    let parents = Array(this.size).fill(-1);
    let queue = [];
    queue.push(start);
    parents[start] = 0;
    while (queue.length > 0) {
      let v = queue.shift();
      this.adjList[v].filter(filterFunc).forEach(edge => {  // Loop through connecting edges.
        // edge.a is always v.
        if (parents[edge.b] === -1) {
          parents[edge.b] = v;
          queue.push(edge.b);
        }
      });
    }
    return parents;
  }

  kruskal(filterFunc = (() => true), sortFunc = ((a, b) => a.weight - b.weight)) {
    let mst = new Graph(this.size);
    let edges = this.edgeList.filter(filterFunc).sort(sortFunc);
    let ds = new DisjointSet(this.w * this.h);
    edges.forEach(edge => {
      // Attached vertices if not already connected.
      if (ds.find(edge.a) !== ds.find(edge.b)) {
        ds.union(edge.a, edge.b);
        mst.addEdge(edge.a, edge.b, edge.weight);
      }
    });
    return mst;
  }
}

class MazeGraph extends Graph {

  constructor(w, h) {
    super(w * h);
    this.w = w;
    this.h = h;
    this.activeList = Array(w * h).fill(false);
    this.markerList = Array(w * h).fill(null);
    this.resetEdgeList();
  }

  addEdge(a, b, weight) {
    super.addEdge(a, b, weight, { suggestedPath: false });
  }

  floodFillFilterFunc = edge => this.activeList[edge.a] === this.activeList[edge.b];
  generateMazeFilterFunc = edge => this.activeList[edge.a] && this.activeList[edge.b];
  generateMazeSortFunc = (a, b) => {
    let aWeight = a.weight, bWeight = b.weight;
    // If suggested path, convert edge weight from [1, 2) to [0, 1).
    if (a.notes.suggestedPath) {
      aWeight -= 1;
    }
    if (b.notes.suggestedPath) {
      bWeight -= 1;
    }
    return aWeight - bWeight;
  }

  resetEdgeList() {
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        let v = i * this.w + j;
        // Connect right with a random edge with weight between 1 and 2.
        if (j < this.w - 1) {
          this.addEdge(v, v + 1, Math.random() + 1);
        }
        // Connect down with a random edge with weight between 1 and 2.
        if (i < this.h - 1) {
          this.addEdge(v, v + this.w, Math.random() + 1);
        }
      }
    }
  }

  generateMazeGraph() {
    return this.kruskal(this.generateMazeFilterFunc, this.generateMazeSortFunc);
  }
}

class DisjointSet {

  constructor(size) {
    this.size = size;
    this.parentList = Array(size).fill(0).map((x, i) => i);
    this.rankList = Array(size).fill(0);
  }

  // Uses path compression.
  find(n) {
    if (this.parentList[n] !== n) {
      this.parentList[n] = this.find(this.parentList[n]);
    }
    return this.parentList[n];
  }

  // Uses union by rank.
  union(a, b) {
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
