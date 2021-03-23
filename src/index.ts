import App from "./app";
import Cube from "./shapes/cube";
import Block from "./shapes/block";
import {triangularPrism} from "./shapes/initialPoints";
import TriangularPrism from "./shapes/triangularPrism";
import Shape from "./shapes/shape";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

// function for debugging block / cube as well
function initDefaultShape(shapeName: ShapeType): Shape {
  let defaultObj: Shape;
  switch (shapeName) {
    case "block":
      defaultObj = new Block(canvas, 0.4, 0.2, 0.2, 0.025);
      break;
    case "cube":
      defaultObj = new Cube(canvas, 0.2, 0.025);
      break;
    case "prism":
      defaultObj = new TriangularPrism(canvas);

      defaultObj.setPoints(...triangularPrism.points);
      defaultObj.setNormals(...triangularPrism.normals);
      break;
  }
  return defaultObj;
}

// Init default shapes
// change this to prism later
const defaultObj = initDefaultShape("prism");

// Init app
const app = new App();
app.setShape(defaultObj);

// Pick hollow object buttons event handler
const prismBtn = document.getElementById("prism") as HTMLElement;
prismBtn.addEventListener("click", () => {
  const triangularPrism = new TriangularPrism(canvas);
  triangularPrism.setPoints(...triangularPrism.points);
  triangularPrism.setNormals(...triangularPrism.normals);

  app.setShape(triangularPrism);
  app.resetAll();
});

const cubeBtn = document.getElementById("cube") as HTMLElement;
cubeBtn.addEventListener("click", () => {
  const cube = new Cube(canvas, 0.2, 0.025);

  app.setShape(cube);
  app.resetAll();
});

const blockBtn = document.getElementById("block") as HTMLElement;
blockBtn.addEventListener("click", () => {
  const block = new Block(canvas, 0.8, 0.4, 0.2, 0.025);

  app.setShape(block);
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

const camResetBtn = document.getElementById("cam-reset") as HTMLElement;
camResetBtn.addEventListener("click", () => {
  app.resetCamera();
});

// Start app
app.start();
