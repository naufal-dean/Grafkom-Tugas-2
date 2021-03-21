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

// Pick hollow object buttons event handler
const prismBtn = document.getElementById("prism") as HTMLElement;
prismBtn.addEventListener("click", () => {
  const triangularPrism = new TriangularPrism(canvas);
  triangularPrism.addPoint(...triangularPrismPoints);

  app.setShape(triangularPrism);
  app.resetAll();
});

const cubeBtn = document.getElementById("cube") as HTMLElement;
cubeBtn.addEventListener("click", () => {
  const cube = new Cube(canvas);
  cube.addPoint(...cubePoints);

  app.setShape(cube);
  app.resetAll();
});

// Perspective buttons event handler
const orthographicBtn = document.getElementById("orthographic") as HTMLElement;
orthographicBtn.addEventListener("click", () => {
  app.setShapeProjection("orthographic");
});

const obliqueBtn = document.getElementById("oblique") as HTMLElement;
obliqueBtn.addEventListener("click", () => {
  app.setShapeProjection("oblique");
});

const perspectiveBtn = document.getElementById("perspective") as HTMLElement;
perspectiveBtn.addEventListener("click", () => {
  app.setShapeProjection("perspective");
});

// Reset button event handler
const resetBtn = document.getElementById("reset") as HTMLElement;
resetBtn.addEventListener("click", () => {
  app.resetShape();
});

const resetBtn = document.getElementById("cam-reset") as HTMLElement;
resetBtn.addEventListener("click", () => {
  app.resetCamera();
});

// Start app
app.start();
