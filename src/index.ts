import App from "./app";
import Triangle from "./shapes/triangle";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const triangle = new Triangle(canvas);
triangle.addPoint([0, 0.8, 0], [-0.8, -0.8, 0], [0.8, -0.8, 0]);
const app = new App();
app.setShape(triangle);
app.start();
