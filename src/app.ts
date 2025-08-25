// Singleton
export class App {
  private static instance: App;
  public canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private cellWidth = 26;
  private rows!: number;
  private cols!: number;
  private color!: string;

  private constructor() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public static getInstance(): App {
    if (!this.instance) {
      this.instance = new App();
    }
    return this.instance;
  }

  fitCellWidth = (initialWidth: number) => {
    initialWidth = Math.floor(initialWidth);
    while (initialWidth % this.cellWidth != 0) {
      initialWidth -= 1;
    }
    return initialWidth;
  };

  getCellWidth(): number {
    return this.cellWidth;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  getRows(): number {
    return this.rows;
  }

  getCols(): number {
    return this.cols;
  }

  getColor(): string {
    if (!this.color) {
      this.color = 'rgba(28, 110, 164,0.6)';
    }
    return this.color;
  }

  setDimensions = () => {
    this.canvas.width = this.fitCellWidth(window.innerWidth * 0.9);
    this.canvas.height = this.fitCellWidth(window.innerHeight * 0.8);
    this.rows = Math.floor(this.canvas.height / this.cellWidth);
    this.cols = Math.floor(this.canvas.width / this.cellWidth);
  };
}
