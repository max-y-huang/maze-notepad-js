import { saveAs } from 'file-saver';

class Graph {

  edgeList = [];

  constructor(size) {
    this.size = size;
    this.clearEdgeList();
    this.clearAdjList();
  }

  clearEdgeList() {
    this.edgeList = [];
  }

  clearAdjList() {
    this.adjList = [];
    for (let i = 0; i < this.size; i++) {
      this.adjList.push([]);
    }
  }

  addEdge(a, b, weight, notes = null) {
    let itemA = { a: a, b: b, weight: weight, notes: notes };
    let itemB = { a: b, b: a, weight: weight, notes: notes };
    // Add in 3 different locations. Adjacency lists always have its own node as node a.
    this.edgeList.push(itemA);
    this.adjList[a].push(itemA);
    this.adjList[b].push(itemB);
  }

  editEdge(a, b, newVals) {
    const sameEdgeFilter = e => (e.a === a && e.b === b) || (e.b === a && e.a === b);
    // Update notes in all 3 locations.
    let edgeListIndex = this.edgeList.findIndex(sameEdgeFilter);
    let adjListAIndex = this.adjList[a].findIndex(sameEdgeFilter);
    let adjListBIndex = this.adjList[b].findIndex(sameEdgeFilter);
    if (edgeListIndex !== -1) {
      if (newVals.weight) {
        this.edgeList[edgeListIndex].weight = newVals.weight;
      }
      if (newVals.notes) {
        this.edgeList[edgeListIndex].notes = { ...this.edgeList[edgeListIndex].notes, ...newVals.notes };
      }
    }
    if (adjListAIndex !== -1) {
      if (newVals.weight) {
        this.adjList[a][adjListAIndex].weight = newVals.weight;
      }
      if (newVals.notes) {
        this.adjList[a][adjListAIndex].notes = { ...this.adjList[a][adjListAIndex].notes, ...newVals.notes };
      }
    }
    if (adjListBIndex !== -1) {
      if (newVals.weight) {
        this.adjList[b][adjListBIndex].weight = newVals.weight;
      }
      if (newVals.notes) {
        this.adjList[b][adjListBIndex].notes = { ...this.adjList[b][adjListBIndex].notes, ...newVals.notes };
      }
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
    this.clearActiveList();
    this.clearMarkerList();
    this.w = w;
    this.h = h;
    this.initializeEdgeList();
  }

  getNotes(edge, key) {
    if (!edge.notes) {
      return false;
    }
    return edge.notes[key];
  }

  getRandomEdgeWeight() {  // Range: [1000, 2000).
    return Math.floor(Math.random() * 1000) + 1000;
  }

  addEdge(a, b, weight, notes = { suggestedPath: false, testingPath: -1 }) {
    super.addEdge(a, b, weight, notes);
  }

  floodFillShapeFilterFunc = edge => this.activeList[edge.a] === this.activeList[edge.b];
  floodFillSuggestedPathFilterFunc = edge => this.getNotes(edge, 'suggestedPath');
  floodFillTestingPathFilterFunc = edge => (this.getNotes(edge, 'testingPath') !== -1);
  generateMazeFilterFunc = edge => this.activeList[edge.a] && this.activeList[edge.b];
  generateMazeSortFunc = (a, b) => {
    let aWeight = a.weight, bWeight = b.weight;
    // If suggested path, convert edge weight from [1000, 2000) to [0, 1000).
    if (this.getNotes(a, 'suggestedPath')) {
      aWeight -= 1000;
    }
    if (this.getNotes(b, 'suggestedPath')) {
      bWeight -= 1000;
    }
    return aWeight - bWeight;
  }

  getSave = () => {
    let edgeList = this.edgeList.map(edge => [ edge.a, edge.b, edge.weight, this.getNotes(edge, 'suggestedPath') ]);
    let activeList = this.activeList.map((val, i) => (val === true) ? i : -1).filter(val => val !== -1);  // Log true values as indices.
    let markerList = this.markerList.map((val, i) => (val !== null) ? [ i, val ] : -1).filter(val => val !== -1);  // Log non-null values as indices.
    let content = {
      edgeList: edgeList,
      activeList: activeList,
      markerList: markerList
    };
    return new Blob([ JSON.stringify(content) ], { type: 'text/plain;charset=utf-8' });
  }

  load(file) {
    this.clearEdgeList();
    this.clearAdjList();
    this.clearActiveList();
    this.clearMarkerList();
    
    file.edgeList.forEach(edge => {
      this.addEdge(edge[0], edge[1], edge[2], { suggestedPath: edge[3], testingPath: -1 });
    });
    file.activeList.forEach(i => {
      this.activeList[i] = true;
    });
    file.markerList.forEach(marker => {
      this.markerList[marker[0]] = marker[1];
    });
  }

  save(fileName) {
    saveAs(this.getSave(), fileName);
  }

  clearActiveList() {
    this.activeList = Array(this.size).fill(false);
  }
  
  clearMarkerList() {
    this.markerList = Array(this.size).fill(null);
  }

  initializeEdgeList() {
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        let v = i * this.w + j;
        // Connect right.
        if (j < this.w - 1) {
          this.addEdge(v, v + 1, this.getRandomEdgeWeight());
        }
        // Connect down.
        if (i < this.h - 1) {
          this.addEdge(v, v + this.w, this.getRandomEdgeWeight());
        }
      }
    }
  }

  resetEdgeWeights() {
    this.edgeList.forEach(edge => {
      this.editEdge(edge.a, edge.b, { weight: this.getRandomEdgeWeight() });
    });
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
