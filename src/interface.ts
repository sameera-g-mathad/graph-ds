// interace used by Drawable constructor
// for creating an instance.
export interface DrawableInterface {
  ctx: CanvasRenderingContext2D;
  cellWidth: number;
  stroked: boolean;
  text: boolean;
  value: number;
  visited: boolean;
  x: number;
  y: number;
}

// Types:

// Color Object:
export type styleType =
  | 'bg'
  | 'nodeColor'
  | 'source'
  | 'destination'
  | 'path'
  | 'text'
  | 'mix'
  | 'visited';

// Algorithm supported type.
export type algo = 'a*' | 'bfs' | 'dfs' | 'ucs-min' | 'ucs-max';

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
