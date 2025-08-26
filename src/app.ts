import type { algo, shape, styleType } from './interface';

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
  private algo!: algo;
  private shape!: shape;
  public colorObj!: { [key in styleType]: string };
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

  // Getter to return the shape of node.
  getShape(): shape {
    return this.shape;
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
    else if (width > 40) this.cellWidth = 40;
    else this.cellWidth = width;
  }

  setColor(obj: { [key in styleType]: string }) {
    this.colorObj = obj;
  }
  // To set the dimenisions of the canvas.
  // Works well with the resize of the window as well.
  setDimensions = () => {
    this.canvas.width = this.fitCellWidth(window.innerWidth * 0.9);
    this.canvas.height = this.fitCellWidth(window.innerHeight * 0.8);
    this.rows = Math.floor(this.canvas.height / this.cellWidth);
    this.cols = Math.floor(this.canvas.width / this.cellWidth);
  };

  // Sets the shape of each node to either 'circle'
  // or 'square'
  setShape(shape: shape): void {
    this.shape = shape;
  }
}
