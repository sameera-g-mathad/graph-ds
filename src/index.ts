import { App } from './app';
import { Graph } from './graph';

const app = App.getInstance();
let graph: Graph;
const init = () => {
  app.setDimensions();
  graph = Graph.requestGraph('maze');
};

app.canvas.addEventListener('click', (event) => {
  let bounds = app.canvas.getBoundingClientRect();
  let cellWidth = app.getCellWidth();
  let col = Math.floor((event.clientX - bounds.x) / cellWidth);
  let row = Math.floor((event.clientY - bounds.y) / cellWidth);
  if (graph.isValid(row, col)) {
    if (!graph.sourceExists) {
      graph.graphSource(row, col);
    } else if (!graph.destinationExists) {
      graph.graphDestination(row, col);
      graph.traverse();
    } else {
      graph.clearSrcAndDest();
    }
  }
});

window.addEventListener('load', init);
window.addEventListener('resize', init);
