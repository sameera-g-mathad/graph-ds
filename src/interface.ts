// interace used by Drawable constructor
// for creating an instance.
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

// Algorithm supported type.
export type algo = 'bfs' | 'dfs' | 'ucs-min' | 'ucs-max';

// Data structure supported type.
export type storageType =
  | 'stack'
  | 'queue'
  | 'maxNumericHeap'
  | 'maxTupleHeap'
  | 'minNumericHeap'
  | 'minTupleHeap';

// Graph supported type.
export type graphFlavor = 'regular' | 'weighted' | 'maze';

// Drawable supported type.
export type shape = 'circle' | 'square';
