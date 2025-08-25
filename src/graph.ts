import { Drawable } from './drawable';
import { App } from './app';
import { Traversal } from './traversal';
import type { graphFlavor, shape } from './interface';

export abstract class Graph {
  protected graph: Drawable[][];
  private app: App;
  protected cols: number;
  protected rows: number;
  private source: [number, number] | null = null;
  private destination: [number, number] | null = null;

  constructor(
    gridShape: shape = 'square',
    visited: boolean = false,
    stroked: boolean = true
  ) {
    this.app = App.getInstance();
    this.rows = this.app.getRows();
    this.cols = this.app.getCols();
    const ctx = this.app.getContext();
    const cellWidth = this.app.getCellWidth();
    const color = this.app.getColor();
    this.graph = Array.from({ length: this.rows }, (_, i) =>
      Array.from({ length: this.cols }, (_, j) =>
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
    ); // initialize array

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.graph[i][j].update(color);
      }
    }
  }
  abstract fillValue(): number;

  static requestGraph(type: graphFlavor) {
    switch (type) {
      case 'regular':
        return new RegularGraph('square');
      case 'maze':
        return new Maze('circle');
      case 'weighted':
        return new WeightedGraph('square');
      default:
        return new WeightedGraph('square');
    }
  }
  public isValid(row: number, col: number) {
    return !this.graph[row][col].visited;
  }

  get sourceExists() {
    return this.source;
  }
  get destinationExists() {
    return this.destination;
  }

  public graphSource(row: number, col: number) {
    this.source = [row, col];
    this.graph[row][col].update('green');
  }

  public graphDestination(row: number, col: number) {
    this.destination = [row, col];
    this.graph[row][col].update('red');
  }

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

  public traverse(): void {
    let traversal = Traversal.getTraversal('ucs');
    if (this.source && this.destination)
      traversal.traverse(this.graph, this.source, this.destination);
  }
}
class RegularGraph extends Graph {
  constructor(gridShape: shape) {
    super(gridShape);
  }
  fillValue(): number {
    return 1;
  }
}

class WeightedGraph extends Graph {
  constructor(gridShape: shape) {
    super(gridShape);
  }
  fillValue(): number {
    return Math.floor(Math.random() * 10) + 1; // to avoid 0.
  }
}

class Maze extends Graph {
  constructor(gridShape: shape) {
    super(gridShape, true, false);
    this.generateMaze();
  }
  fillValue(): number {
    return 1;
  }

  generateMaze(): void {
    let directions = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ];

    const markVisited = (row: number, col: number) => {
      this.graph[row][col].value = 0;
      this.graph[row][col].update('white');
      this.graph[row][col].visited = false;
    };

    const dfs = (row: number, col: number) => {
      let stack: [number, number][] = [[row, col]];
      markVisited(row, col);

      while (stack.length > 0) {
        let [row, col] = stack[stack.length - 1];
        directions = directions.sort(() => Math.random() - 0.5); // Randomize
        let neigbor = false;

        for (let [dr, dc] of directions) {
          let drow = row + dr;
          let dcol = col + dc;
          if (
            drow >= 0 &&
            drow < this.rows &&
            dcol >= 0 &&
            dcol < this.cols &&
            this.graph[drow][dcol].value === 1
          ) {
            markVisited(drow, dcol);
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
    const randomIndex = (maxValue: number) =>
      Math.floor(Math.random() * maxValue);
    dfs(randomIndex(this.rows), 0);
  }
}
