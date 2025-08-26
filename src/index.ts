import { App } from './app';
import { Graph } from './graph';
import type { algo, graphFlavor } from './interface';

// Get the algorithm name from the html element.
// Ex: 'bfs', 'dfs', 'ucs'
const algorithm = document.getElementById('algo') as HTMLSelectElement;

// Get the graph type supported in the application.
// ex: 'regular', 'maze', 'weighted'.
const graphType = document.getElementById('graph') as HTMLSelectElement;

// Used to set the cell width of each node in the graph.
// Allowed range: [15, 30]
const cellInput = document.getElementById('cellWidth') as HTMLInputElement;

// Used to regenerate the graph for randomness.
const regenerate = document.getElementById('regen') as HTMLButtonElement;

// Used to start the traversal.
const start = document.getElementById('start') as HTMLButtonElement;

// The singleton app, used to hold all the
// settings of the application.
const app = App.getInstance();

// declare a graph variable to hold reference later.
let graph: Graph;

// method called to set the app settings,
// create a graph instance.
// Is called when graphType changes or regenerate button
// is clicked and when the window is loaded or resized.
const init = () => {
  // set cell width.
  app.setCellWidth(parseInt(cellInput.value));

  // To set Dimensions. Adjusts the canvas window
  // dimensions according to the size of the website.
  // Works well when resizing.
  app.setDimensions();
  app.setAlgo(algorithm.value as algo);
  graph = Graph.requestGraph(graphType.value as graphFlavor);
};

// Sets the source and destination points in the
// graph.
app.canvas.addEventListener('click', (event) => {
  // Gets the boundary of the canvas
  let bounds = app.canvas.getBoundingClientRect();
  let cellWidth = app.getCellWidth();
  // Subtract the window point_x with the relative canvas point
  // to find where the click happened inside the graph/canvas.
  // Dividing by cellWidth, gives the cell dimensions or exact
  // cell that was clicked within the graph/canvas.
  let col = Math.floor((event.clientX - bounds.x) / cellWidth);
  let row = Math.floor((event.clientY - bounds.y) / cellWidth);

  // This check is added to counter valid boxes,
  // expecially in case of maze graph. Since walls
  // cannot be considered a start or a destination.
  if (graph.isValid(row, col)) {
    // check if source exists.
    if (!graph.sourceExists) {
      graph.graphSource(row, col);
    }
    // check if destination exists.
    else if (!graph.destinationExists) {
      graph.graphDestination(row, col);
    }
    // Clears the previous source and destination value
    // when user clicks more than twice to reset values.
    else {
      graph.clearSrcAndDest();
    }
  }
});

// Gets the updated selected algorithm.
algorithm.addEventListener('change', () => {
  app.setAlgo(algorithm.value as algo);
});

// Gets the updated selected graph type.
graphType.addEventListener('change', () => {
  graph = Graph.requestGraph(graphType.value as graphFlavor);
});

// Gets the cell width to be used in the graph.
// Since the input returns a string, proper
// type checks are placed and also the range
// is maintained within [15, 30]
cellInput.addEventListener('change', () => {
  let newValue = parseInt(cellInput.value);
  if (Number.isNaN(newValue)) {
    cellInput.value = '15';
  } else if (newValue < 15) {
    cellInput.value = '20';
  } else if (newValue > 30) {
    cellInput.value = '30';
  }
});

// Regerates the entire graph.
regenerate.addEventListener('click', init);

// Starts the graph traversal.
start.addEventListener('click', () => graph.traverse());

// Start of the application
window.addEventListener('load', init);

// When user resizes the window.
window.addEventListener('resize', init);
