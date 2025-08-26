import { Drawable } from './drawable';
import { App } from './app';
import { Traversal } from './traversal';
import type { graphFlavor, shape } from './interface';

// Graph holds the array of Drawable, or as the name
// suggests, the graph that is displayed on the
// screen.
export abstract class Graph {
  protected graph: Drawable[][];
  protected app: App;
  protected cols: number;
  protected rows: number;
  private source: [number, number] | null = null;
  private destination: [number, number] | null = null;

  constructor(
    gridShape: shape = 'square',
    visited: boolean = false,
    stroked: boolean = true
  ) {
    // Get the singleton app instance.
    this.app = App.getInstance();
    this.rows = this.app.getRows();
    this.cols = this.app.getCols();
    const ctx = this.app.getContext();
    const cellWidth = this.app.getCellWidth();

    // Graph initialization.
    this.graph = Array.from({ length: this.rows }, (_, i) =>
      Array.from({ length: this.cols }, (_, j) =>
        // Each Drawable instance is passed
        // with a ctx, cellwidth, value to be filled,
        // whether to be stroked and most of all, a 'visited'
        // attribute, used by traversal algorithms.
        Drawable.requestShape(
          {
            ctx,
            cellWidth: cellWidth,
            x: j * cellWidth,
            y: i * cellWidth,
            value: this.fillValue(),
            visited: visited,
            stroked: stroked,
          },
          gridShape
        )
      )
    );
  }

  // This method is used to display the
  // graph on the screen.
  display() {
    const color = this.app.getColor();
    let i = 0;
    // This is a recusive(I think) method,
    // that uses setTimeout to simulate animation
    // of the graph on screen.
    const animate = () => {
      if (i >= this.rows) return;
      for (let j = 0; j < this.cols; j++) {
        this.graph[i][j].update(color);
      }
      i += 1;
      setTimeout(animate, 20);
    };
    animate();
  }

  // Value to be filled for each node.
  // Regular - Returns 1,
  // Maze - 1 for walls and 0 for path.
  // Weighted - Random values between [1, 10] inclusve.
  abstract fillValue(): number;

  // Static factory method(like) method, to
  // create a instance of either 'square' or 'circle'
  // to be displayed on the graph.
  static requestGraph(type: graphFlavor) {
    switch (type) {
      case 'regular':
        return new RegularGraph('square');
      case 'maze':
        return new Maze('square');
      case 'weighted':
        return new WeightedGraph('square');
      default:
        return new WeightedGraph('square');
    }
  }

  // This is used to check whether a selected
  // node is valid to be chosen as either 'source'
  // or 'destination'. This is critical in Maze
  // instance as walls cannot be choses for traversal
  public isValid(row: number, col: number) {
    return !this.graph[row][col].visited;
  }

  // Getter method to check if a source
  // node exits.
  get sourceExists() {
    return this.source;
  }

  // Getter method to check if a destination
  // node exits.
  get destinationExists() {
    return this.destination;
  }

  // Sets the graph source and colors it.
  public graphSource(row: number, col: number) {
    this.source = [row, col];
    this.graph[row][col].update('green');
  }

  // Sets the graph destination and colors it.
  public graphDestination(row: number, col: number) {
    this.destination = [row, col];
    this.graph[row][col].update('red');
  }

  // Clears both source and destination
  // if the user clicks on different nodes
  // more than twice. This enables users to
  // select and change their initial selection.
  public clearSrcAndDest() {
    if (this.source && this.destination) {
      const color = this.app.getColor();
      const [src_row, src_col] = this.source;
      this.graph[src_row][src_col].update(color);
      const [dest_row, dest_col] = this.destination;
      this.graph[dest_row][dest_col].update(color);
    }

    this.source = null;
    this.destination = null;
  }

  // The main method used for graph traversal.
  public traverse(): void {
    // gerTraversal returns a new instance everytime
    // and if both source and destination existes, graph
    // traversal begines.
    let traversal = Traversal.getTraversal(this.app.getAlgo());
    if (this.source && this.destination)
      traversal.traverse(this.graph, this.source, this.destination);
    // this.clearSrcAndDest();
  }
}

// Subclass that initializes all the
// graph values with 1. Works with all the
// algorithms.
class RegularGraph extends Graph {
  constructor(gridShape: shape) {
    super(gridShape);
    this.display();
  }
  fillValue(): number {
    return 1;
  }
}

// Subclass that initializes all the
// graph values with random values between [1, 10] inclusive.
//  Works with all the algorithms.
class WeightedGraph extends Graph {
  constructor(gridShape: shape) {
    super(gridShape);
    this.display();
  }
  fillValue(): number {
    return Math.floor(Math.random() * 10) + 1; // to avoid 0.
  }
}

// Creates a maze on the screen.
// Dfs is used to create a maze on the
// screen. Graph starts as a Regular graph
// and a maze is generated later. Also, all the
// nodes are considered visited, since the nodes
// with value 1 are treated as 'walls'.
//  Check out generateMaze() method below.
class Maze extends Graph {
  constructor(gridShape: shape) {
    super(gridShape, true, false);
    this.generateMaze(); // creates maze.
    this.display(); // display newly generated maze.
  }

  // This method overrides the default
  // display method, as the graph should
  // be displayed after a maze is formed.
  display(): void {
    const color = this.app.getColor();
    let i = 0;
    const animate = () => {
      if (i >= this.rows) return;
      for (let j = 0; j < this.cols; j++) {
        if (this.graph[i][j].value == 0) {
          this.graph[i][j].update('white');
          continue;
        }
        this.graph[i][j].update(color);
      }
      i += 1;
      setTimeout(animate, 20);
    };
    animate();
  }

  fillValue(): number {
    return 1;
  }

  // A dfs algorithm to generate random mazes. The ides is to
  // visit every alternating nodes, skipping 1 node in between.
  // The skipped node is not used for traversal purpose, but is marked
  // visited and this process generates the maze.
  generateMaze(): void {
    // Directions here are in the order of
    // 2 as the nodes are needed to be skipped.
    let directions = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ];

    // An interal function to mark each node visit, color
    // it.
    const markVisited = (row: number, col: number) => {
      this.graph[row][col].value = 0;
      this.graph[row][col].update('white');
      // Important. This makes the white path,
      // traversable and all the walls blocked.
      this.graph[row][col].visited = false;
    };

    // Iterative dfs method to traverse a path.
    const dfs = (row: number, col: number) => {
      // starts with a random node in the graph.
      let stack: [number, number][] = [[row, col]];
      // Node is marked visited.
      markVisited(row, col);

      while (stack.length > 0) {
        let [row, col] = stack[stack.length - 1];

        // Randomize the directions to change the order of visiting
        // nodes. This helps in creating random mazes along the way.
        directions = directions.sort(() => Math.random() - 0.5);

        // This is used to find a neighbor
        // and use iterative dfs, rather than
        // adding all the neighbors in the stack.
        // Works fine otherwise, but creates a blocky
        // maze and doesn't look random.
        let neigbor = false;

        for (let [dr, dc] of directions) {
          let drow = row + dr;
          let dcol = col + dc;
          // only visit if the neightbors are valid, inbound
          // and not visited.
          if (
            drow >= 0 &&
            drow < this.rows &&
            dcol >= 0 &&
            dcol < this.cols &&
            this.graph[drow][dcol].value === 1
          ) {
            markVisited(drow, dcol);
            // Without this a maze won't be created. Only
            // alternating nodes will be painted. With this
            // the path is connected between node and its
            // altering neighor. Such formula is used to
            // counter both [-2, 2] in directions.
            markVisited(row + dr / 2, col + dc / 2);
            stack.push([drow, dcol]);
            neigbor = true;
            break;
          }
        }
        if (!neigbor) {
          stack.pop();
        }
      }
    };
    // Used to return a random number, that can
    // be used as a starting point to generate a maze.
    // Helpful in creating random mazes.
    const randomIndex = (maxValue: number) =>
      Math.floor(Math.random() * maxValue);

    // A random row from the first column is used
    // as a random starting point.
    dfs(randomIndex(this.rows), 0);
  }
}
