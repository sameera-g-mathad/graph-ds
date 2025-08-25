import type { storageType } from './interface';

export abstract class Storage<T> {
  abstract push(element: T): void;
  abstract pop(): T;
  abstract toString(): string;
  abstract isEmpty(): boolean;
  abstract clear(): void;

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

  push(element: T): void {
    this.stack.push(element);
  }

  pop(): T {
    if (this.stack.length > 0) {
      return this.stack.pop()!;
    }
    throw Error('Cannot pop from an empty stack');
  }
  toString(): string {
    return `${this.stack}`;
  }
  isEmpty(): boolean {
    return this.stack.length == 0;
  }
  clear(): void {
    this.stack = [];
  }
}

class Queue<T> extends Storage<T> {
  private queue: T[] = [];
  push(element: T): void {
    this.queue.push(element);
  }

  pop(): T {
    if (this.queue.length > 0) {
      return this.queue.shift()!;
    }
    throw Error('Cannot pop from an empty queue');
  }
  toString(): string {
    return `${this.queue}`;
  }
  isEmpty(): boolean {
    return this.queue.length == 0;
  }
  clear(): void {
    this.queue = [];
  }
}

abstract class Heap<T> extends Storage<T> {
  private heap: T[] = [null as T];
  push(element: T): void {
    this.heap.push(element);
    let child = this.heap.length - 1;
    while (child > 1) {
      let parent = Math.floor(child / 2);
      if (this.compare(this.heap[parent], element)) {
        this.heap[child] = this.heap[parent];
        child = parent;
      } else break;
    }
    this.heap[child] = element;
  }

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
  toString(): string {
    return `${this.heap}`;
  }
  isEmpty(): boolean {
    return this.heap.length == 1;
  }
  clear(): void {
    this.heap = [null as T];
  }
  abstract compare(a: T, b: T): boolean;
}

class MaxNumericHeap<T> extends Heap<T> {
  compare(a: T, b: T): boolean {
    return a < b;
  }
}

class MaxTupleHeap<T> extends Heap<T> {
  compare(a: T, b: T): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a[0] <= b[0];
    }
    throw Error('TupleHeap expects tuples to be passed');
  }
}

class MinNumericHeap<T> extends Heap<T> {
  compare(a: T, b: T): boolean {
    return a > b;
  }
}

class MinTupleHeap<T> extends Heap<T> {
  compare(a: T, b: T): boolean {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a[0] >= b[0];
    }
    throw Error('TupleHeap expects tuples to be passed');
  }
}
