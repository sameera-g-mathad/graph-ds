import type { algo } from './interface';

// Singleton
export class App {
  // instance is used for returning the
  // only instance of the class App
  private static instance: App;
  public canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private cellWidth!: number;
  private rows!: number;
  private cols!: number;
  private color!: string;
  private algo!: algo;

  private constructor() {
    // Set the canvas and context of the app/canvas
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  // Static method to create only
  // app instance and return it.
  public static getInstance(): App {
    if (!this.instance) {
      this.instance = new App();
    }
    return this.instance;
  }

  // This method is used to make sure, the width and height
  // of the canvas are divisible by cell width, so that there
  // are no paddings or unused space inside the canvas.
  fitCellWidth = (initialWidth: number) => {
    initialWidth = Math.floor(initialWidth);
    while (initialWidth % this.cellWidth != 0) {
      initialWidth -= 1;
    }
    return initialWidth;
  };

  // Getter to return the selected
  // algorithm (Ex: 'bfs', 'dfs', 'ucs') back
  // to the traversal instance.
  getAlgo(): algo {
    return this.algo;
  }

  // Getter to return the set cellwidth.
  getCellWidth(): number {
    return this.cellWidth;
  }

  // Getter to return the number of cols.
  getCols(): number {
    return this.cols;
  }

  // Getter to return the color of the graph.
  getColor(): string {
    if (!this.color) {
      this.color = 'rgba(28, 110, 164,0.6)';
    }
    return this.color;
  }

  // Getter to return the context,
  // used by canvas objects to effectively
  // utilize canvas api.
  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  // Getter to return the number of rows.
  getRows(): number {
    return this.rows;
  }

  // Setter to set the user selected
  // algorithm.
  setAlgo(type: algo): void {
    this.algo = type;
  }

  // Setter to set the cell width
  // of the canvas object.
  setCellWidth(width: number) {
    if (width < 15) this.cellWidth = 15;
    else if (width > 30) this.cellWidth = 30;
    else this.cellWidth = width;
  }

  // To set the dimenisions of the canvas.
  // Works well with the resize of the window as well.
  setDimensions = () => {
    this.canvas.width = this.fitCellWidth(window.innerWidth * 0.9);
    this.canvas.height = this.fitCellWidth(window.innerHeight * 0.8);
    this.rows = Math.floor(this.canvas.height / this.cellWidth);
    this.cols = Math.floor(this.canvas.width / this.cellWidth);
  };
}
