import { App } from './app';
import { Storage } from './storage';
import { Drawable } from './drawable';
import type { algo } from './interface';

// Graph implemented here will be for canvas api and uses requireAnimationFrame
// as a source for recursion.
// 'Bfs', 'Dfs', 'Ucs' supported.
export abstract class Traversal {
  protected st!: Storage<any>;
  private app: App = App.getInstance();
  protected directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  constructor() {}

  // Factory Method(like) method to return
  // new instance of evertime.
  static getTraversal(type: algo) {
    switch (type) {
      case 'a*':
        return new AStar();
      case 'bfs':
        return new BFS();
      case 'dfs':
        return new DFS();
      case 'ucs-min':
        return new UCSMin();
      case 'ucs-max':
        return new UCSMax();
      default:
        return new BFS();
    }
  }
  // Method to compute running cost. Useful in Ucs as it uses
  // priority queue. Cordinates are added to compute the distance
  // that is useful in A* algorithm.
  computeCost(
    runningCost: number,
    newNodeCost: number,
    presentCords: [number, number],
    destination: [number, number]
  ): number {
    return runningCost + newNodeCost;
  }

  // This method carves the path needed to follow
  // from source and destination. This is called once
  // all the required nodes are visited and a destination is
  // found.
  // This is done by using the parent node of every node and
  // once the destination is encountered, the path can be traversed
  // back to find the souce using parent of each node starting
  // from the destination.
  carvePath(
    graph: Drawable[][],
    source: [number, number],
    destination: [number, number]
  ): void {
    let [i, j] = graph[destination[0]][destination[1]].parent;

    const carve = () => {
      if (i == source[0] && j == source[1]) {
        return;
      }
      graph[i][j].stroked = false;
      graph[i][j].update(this.app.colorObj['path'], this.app.colorObj['text']);
      const [parentI, parentJ] = graph[i][j].parent;
      i = parentI;
      j = parentJ;
      requestAnimationFrame(carve);
    };
    carve();
  }

  // A generic method to perform 'bfs', 'dfs', 'ucs'.
  // Only change is the use of storage instance, that is
  // set to [dfs -> 'stack', bfs -> 'queue', ucs -> 'priority queue']
  traverse(
    graph: Drawable[][],
    source: [number, number],
    destination: [number, number]
  ): void {
    const rows = graph.length;
    const cols = graph[0].length;

    // push the source into storage.
    this.st.push([graph[source[0]][source[1]].value, ...source]);

    // parent of the source is source itself.
    graph[source[0]][source[1]].parent = source;

    // Inner method run recursively to paint
    // visited nodes along the way.
    const start = () => {
      // Once the storage becomes empty,
      // stop traversal.
      if (this.st.isEmpty()) {
        return;
      }

      // pop the node from the storage.
      const [cost, row, col] = this.st.pop();

      // If the node is visited, continue with the next
      // node in the storage.
      if (graph[row][col].visited) {
        requestAnimationFrame(start);
        return;
      }

      // Mark the node as visited.
      graph[row][col].visited = true;

      // If the node is destination, then stop
      // traversal and carve a path back.
      if (row == destination[0] && col == destination[1]) {
        this.st.clear();
        this.carvePath(graph, source, destination);
        return;
      }

      // Color the visited node, except the source.
      if (!(row === source[0] && col === source[1])) {
        graph[row][col].update(
          this.app.colorObj['visited'],
          this.app.colorObj['text']
        );
      }

      // Explore the neigbors.
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
          // Store the parent used for carving path
          // after destination is found.
          graph[drow][dcol].parent = [row, col];
          this.st.push([
            this.computeCost(
              cost,
              graph[drow][dcol].value,
              [drow, dcol],
              destination
            ),
            drow,
            dcol,
          ]);
        }
      }
      requestAnimationFrame(start);
    };
    // start of the traversal
    start();
  }
}

// Breadth-first Search uses queue Data-structure.
class BFS extends Traversal {
  constructor() {
    super();
    this.st = Storage.getStorage<[Number, Number, Number]>('queue');
  }
}

// Depth-first Search uses stack Data-structure.
class DFS extends Traversal {
  constructor() {
    super();
    this.st = Storage.getStorage<[Number, Number, Number]>('stack');
  }
}

// Uniform-cost Search uses heap Data-structure.
// This implementation of ucs uses Max Heap.
// Not sure if this is actually valid in search
// problems.
class UCSMax extends Traversal {
  constructor() {
    super();
    this.st = Storage.getStorage<[Number, Number, Number]>('maxTupleHeap');
  }
}

// Uniform-cost Search uses heap Data-structure.
// This implementation of ucs uses min Heap.
// Somewhat sure, this is actually valid in search
// problems.
class UCSMin extends Traversal {
  constructor() {
    super();
    this.st = Storage.getStorage<[Number, Number, Number]>('minTupleHeap');
  }
}

// a* is a heuristic algorithm, It works
// like the ucs itself using a min heap
// for traversal, but also considers the
// distance between node A and B.
class AStar extends Traversal {
  constructor() {
    super();
    this.st = Storage.getStorage<[Number, Number, Number]>('minTupleHeap');
  }
  computeCost(
    runningCost: number,
    newNodeCost: number,
    presentCords: [number, number],
    destination: [number, number]
  ): number {
    const [x1, y1] = presentCords;
    const [x2, y2] = destination;
    // const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    const distance = Math.abs(x1 - x2) + Math.abs(y1 - y2); // Manhattan distance.
    return runningCost + newNodeCost + distance;
  }
}
