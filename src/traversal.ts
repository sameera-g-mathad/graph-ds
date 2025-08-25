import { Storage } from './storage';
import { Drawable } from './drawable';
// Graph implemented here will be for canvas api and uses requireAnimationFrame
// as a source for recursion.

export abstract class Traversal {
  protected st!: Storage<any>;
  protected directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  constructor() {}
  static getTraversal(type: 'bfs' | 'dfs' | 'ucs') {
    switch (type) {
      case 'bfs':
        return new BFS();
      case 'dfs':
        return new DFS();
      case 'ucs':
        return new UCS();
    }
  }

  carvePath(
    graph: Drawable[][],
    source: [number, number],
    destination: [number, number]
  ): void {
    let i = destination[0],
      j = destination[1];
    const carve = () => {
      if (i == source[0] && j == source[1]) {
        graph[i][j].update('yellow');
        return;
      }
      graph[i][j].update('yellow');
      i = graph[i][j].parent[0];
      j = graph[i][j].parent[1];
      requestAnimationFrame(carve);
    };
    carve();
  }

  traverse(
    graph: Drawable[][],
    source: [number, number],
    destination: [number, number]
  ): void {
    const rows = graph.length;
    const cols = graph[0].length;
    this.st.push([graph[source[0]][source[1]].value, ...source]);
    graph[source[0]][source[1]].parent = source;
    const start = () => {
      if (this.st.isEmpty()) {
        return;
      }
      const [_, row, col] = this.st.pop();

      if (graph[row][col].visited) {
        requestAnimationFrame(start);
        return;
      }
      graph[row][col].visited = true;
      graph[row][col].update('blue');

      if (row == destination[0] && col == destination[1]) {
        this.st.clear();
        this.carvePath(graph, source, destination);
        return;
      }

      for (let [dr, dc] of this.directions) {
        let drow = row + dr;
        let dcol = col + dc;
        if (
          drow >= 0 &&
          drow < rows &&
          dcol >= 0 &&
          dcol < cols &&
          !graph[drow][dcol].visited
        ) {
          graph[drow][dcol].parent = [row, col];
          this.st.push([graph[drow][dcol].value, drow, dcol]);
        }
      }
      requestAnimationFrame(start);
    };
    start();
  }
}

class BFS extends Traversal {
  constructor() {
    super();
    this.st = Storage.getStorage<[Number, Number, Number]>('queue');
  }
}

class DFS extends Traversal {
  constructor() {
    super();
    this.st = Storage.getStorage<[Number, Number, Number]>('stack');
    console.log(this.st.toString());
  }
}

class UCS extends Traversal {
  constructor() {
    super();
    this.st = Storage.getStorage<[Number, Number, Number]>('maxTupleHeap');
  }
}
