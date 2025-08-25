export interface DrawableInterface {
  ctx: CanvasRenderingContext2D;
  cellWidth: number;
  x: number;
  y: number;
  value: number;
  visited: boolean;
  stroked: boolean;
}

// Types:
export type storageType =
  | 'stack'
  | 'queue'
  | 'maxNumericHeap'
  | 'maxTupleHeap'
  | 'minNumericHeap'
  | 'minTupleHeap';
export type graphFlavor = 'regular' | 'weighted' | 'maze';
export type shape = 'circle' | 'square';
