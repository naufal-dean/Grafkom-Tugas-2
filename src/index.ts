import App from "./app";
import Triangle from "./shapes/triangle";
import Cube from "./shapes/cube";
import {cubePoints, trianglePoints} from "./shapes/initialPoints";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const triangle = new Triangle(canvas);
triangle.addPoint(...trianglePoints);

const app = new App();
app.setShape(triangle);

const prismBtn = document.getElementById("prism") as HTMLElement;
prismBtn.addEventListener("click", () => {
  app.setShape(triangle);
});

const cubeBtn = document.getElementById("cube") as HTMLElement;
cubeBtn.addEventListener("click", () => {
  const cube = new Cube(canvas);
  cube.addPoint(...cubePoints);
  app.setShape(cube);
});

app.start();
