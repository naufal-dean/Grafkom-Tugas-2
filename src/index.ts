import App from "./app";
import Triangle from "./shapes/triangle";
import TriangularPrism from "./shapes/triangularPrism";
import Cube from "./shapes/cube";
import {cubePoints, trianglePoints, triangularPrismPoints} from "./shapes/initialPoints";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// Init default shapes
const triangularPrism = new TriangularPrism(canvas);
triangularPrism.addPoint(...triangularPrismPoints);

// Init app
const app = new App();
app.setShape(triangularPrism);

// Event handler
const prismBtn = document.getElementById("prism") as HTMLElement;
prismBtn.addEventListener("click", () => {
  const triangularPrism = new TriangularPrism(canvas);
  triangularPrism.addPoint(...triangularPrismPoints);

  app.setShape(triangularPrism);
});

const cubeBtn = document.getElementById("cube") as HTMLElement;
cubeBtn.addEventListener("click", () => {
  const cube = new Cube(canvas);
  cube.addPoint(...cubePoints);

  app.setShape(cube);
});

// Start app
app.start();
