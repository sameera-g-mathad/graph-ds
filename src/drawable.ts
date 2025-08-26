import type { shape, DrawableInterface } from './interface';

// THis area is for drawing
// canvas elements.

// Each node in the graph/canvas
// is a instance of Drawable object.
export abstract class Drawable {
  protected ctx: CanvasRenderingContext2D;
  protected cellWidth: number;
  public visited = false;
  public stroked: boolean = true;
  public value: number;
  public x: number;
  public y: number;
  public parent!: [number, number];

  constructor(drawable: DrawableInterface) {
    this.ctx = drawable.ctx;
    this.cellWidth = drawable.cellWidth;
    this.value = drawable.value;
    this.x = drawable.x;
    this.y = drawable.y;
    this.visited = drawable.visited;
    this.stroked = drawable.stroked;
  }

  // General method for drawing and displaying
  // text on the screen.
  draw(color: string) {
    this.ctx.clearRect(this.x, this.y, this.cellWidth, this.cellWidth);
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.shape();
    this.stroked && this.ctx.stroke();
    this.ctx.fill();
    this.fillText();
    this.ctx.closePath();
  }

  // Abstract method to be implemented by
  // subclasses. Either a square or a circle is
  // displayed painted on the screen.
  protected abstract shape(): void;

  // abstract as of now.
  abstract update(color: string): void;

  // Fills the text on the center of the
  // object.
  public fillText(): void {
    this.ctx.font = 'sans-serif';
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(
      `${this.value}`,
      this.x + this.cellWidth / 2,
      this.y + this.cellWidth / 2
    );
  }

  // Factory method(like) to return a instance of
  // Drawable back. Static method returns either
  // Circle or Square instances.
  public static requestShape(drawable: DrawableInterface, shape: shape) {
    switch (shape) {
      case 'circle':
        return new Circle(drawable);

      case 'square':
        return new Square(drawable);
      default:
        return new Square(drawable);
    }
  }
}

// Square is used to paint squares
// on the screen.
class Square extends Drawable {
  constructor(drawable: DrawableInterface) {
    super(drawable);
  }

  shape(): void {
    this.ctx.rect(this.x, this.y, this.cellWidth, this.cellWidth);
  }

  update(color: string) {
    this.draw(color);
  }
}

// Circle is used to paint circles
// on the screen.
class Circle extends Drawable {
  constructor(drawable: DrawableInterface) {
    super(drawable);
  }

  shape() {
    this.ctx.arc(
      this.x + this.cellWidth / 2,
      this.y + this.cellWidth / 2,
      this.cellWidth / 3,
      0,
      Math.PI * 2
    );
  }

  update(color: string) {
    this.draw(color);
  }
}
