import type { storageType } from './interface';

// A class to implement different storages,
// such as stack, queue, and heap used by
// different algorithms such as 'BFS', 'DFS', 'UCS'.
// Have made it generic to work with
// any type. Ex: Number and [Number, ...Number]
export abstract class Storage<T> {
  // Abstract methods.
  abstract push(element: T): void;
  abstract pop(): T;
  abstract toString(): string;
  abstract isEmpty(): boolean;
  abstract clear(): void;

  // Static factory method(like) method, to
  // create a instance of a storage. Instance of Stack, Queue,
  // Minheap, or Maxheap is returns
  static getStorage<T>(name: storageType): Storage<T> {
    switch (name) {
      case 'stack':
        return new Stack<T>();
      case 'queue':
        return new Queue<T>();
      case 'maxNumericHeap':
        return new MaxNumericHeap<T>();
      case 'maxTupleHeap':
        return new MaxTupleHeap<T>();
      case 'minNumericHeap':
        return new MinNumericHeap<T>();
      case 'minTupleHeap':
        return new MinTupleHeap<T>();
      default:
        return new Stack<T>();
    }
  }
}

class Stack<T> extends Storage<T> {
  private stack: T[] = [];

  // Push an element to the end of the stack.
  push(element: T): void {
    this.stack.push(element);
  }

  // Pop the end element from the stack
  pop(): T {
    if (this.stack.length > 0) {
      return this.stack.pop()!;
    }
    throw Error('Cannot pop from an empty stack');
  }

  // Prints the content of the stack.
  // Have added for reference during
  // testing, not used in the graph.
  toString(): string {
    return `${this.stack}`;
  }
  // Returns boolean value whether the
  // ds is empty or not.
  isEmpty(): boolean {
    return this.stack.length == 0;
  }
  // Clears the stack.
  clear(): void {
    this.stack = [];
  }
}

class Queue<T> extends Storage<T> {
  private queue: T[] = [];
  // Push an element to the rear of the array.
  push(element: T): void {
    this.queue.push(element);
  }

  // Pops an element from the beginning of the queue.
  pop(): T {
    if (this.queue.length > 0) {
      return this.queue.shift()!;
    }
    throw Error('Cannot pop from an empty queue');
  }

  // Prints the content of the queue.
  // Have added for reference during
  // testing, not used in the graph.
  toString(): string {
    return `${this.queue}`;
  }

  // Returns boolean value whether the
  // ds is empty or not.
  isEmpty(): boolean {
    return this.queue.length == 0;
  }

  // Clears the queue
  clear(): void {
    this.queue = [];
  }
}

abstract class Heap<T> extends Storage<T> {
  // The heap starts with null here. This
  // is because the child and parent are compared
  // back and forth. The parent for element 4 and 5
  // should return 2, with 0 index it gets complicated.
  private heap: T[] = [null as T];
  abstract compare(a: T, b: T): boolean;

  // Push an element. This is an O(logn)
  // operation. The child element is compared
  // with only its parent, that is at 'i/2' position,
  // where 'i' is the position of the child.
  push(element: T): void {
    this.heap.push(element);
    let child = this.heap.length - 1;
    while (child > 1) {
      let parent = Math.floor(child / 2);
      // Abstract method to compare different types
      // of data.
      if (this.compare(this.heap[parent], element)) {
        this.heap[child] = this.heap[parent];
        child = parent;
      } else break;
    }
    this.heap[child] = element;
  }

  // Pop the element from the beginning of the heap.
  // O(logn) operation. This is because, the next root
  // of the heap has to be decided
  pop(): T {
    if (this.heap.length > 1) {
      let popped_element = this.heap[1];
      let last_element = this.heap.pop()!;
      if (this.heap.length != 1) this.heap[1] = last_element;

      let i = 1,
        j = 2 * i;

      while (j < this.heap.length) {
        if (
          j + 1 < this.heap.length &&
          this.compare(this.heap[j], this.heap[j + 1])
        ) {
          j += 1;
        }
        if (this.compare(this.heap[i], this.heap[j])) {
          let temp = this.heap[i];
          this.heap[i] = this.heap[j];
          this.heap[j] = temp;
          i = j;
          j = 2 * i;
        } else {
          break;
        }
      }
      return popped_element;
    }
    throw Error('Cannot pop from an empty heap');
  }

  // Prints the content of the queue.
  // Have added for reference during
  // testing, not used in the graph.
  toString(): string {
    return `${this.heap}`;
  }

  // Returns boolean value whether the
  // ds is empty or not.
  isEmpty(): boolean {
    return this.heap.length == 1;
  }

  // Clears the heap. Null is added
  // for convinience.
  clear(): void {
    this.heap = [null as T];
  }
}

// Subclass of Heap that is used to
// comapare two elements. Useful if the
// components in comparision are numbers.
// Max heap.
class MaxNumericHeap<T> extends Heap<T> {
  compare(a: T, b: T): boolean {
    return a < b;
  }
}

// Subclass of Heap that is used to
// comapare two ds such as arrays. The
// first index is used for comparison.
class MaxTupleHeap<T> extends Heap<T> {
  // Used for max heap.
  compare(a: T, b: T): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a[0] <= b[0];
    }
    throw Error('TupleHeap expects tuples to be passed');
  }
}

// Subclass of Heap that is used to
// comapare two elements. Useful if the
// components in comparision are numbers.
// Min heap.
class MinNumericHeap<T> extends Heap<T> {
  compare(a: T, b: T): boolean {
    return a > b;
  }
}

// Subclass of Heap that is used to
// comapare two ds such as arrays. The
// first index is used for comparison.
class MinTupleHeap<T> extends Heap<T> {
  // Used for min heap.
  compare(a: T, b: T): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a[0] >= b[0];
    }
    throw Error('TupleHeap expects tuples to be passed');
  }
}
