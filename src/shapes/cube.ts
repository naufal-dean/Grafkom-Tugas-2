import Shape from "./shape";
import {buildCubeDatas} from "./initialPoints";

class Cube extends Shape {
  constructor(canvas: HTMLCanvasElement, private size: number, private thickness: number) {
    super(canvas);
    this.setupPoints();
  }

  public setSize(size: number) {
    this.size = size;
    this.setupPoints();
  }

  setupPoints() {
    const halfSize = this.size / 2;
    const halfThicc = this.thickness / 2;

    const cubeDatas = buildCubeDatas(halfSize, halfThicc);
    this.points = cubeDatas.points;
  }

  public draw() {
    const vertexData = this.points;

    this.changePosition(vertexData);

    // loop to draw cube side(rusuk), each as a rectangle.
    // To draw a rectangle needs 4 points, and each cube' face(sisi) has 4 side,
    // In total 6 faces x 4 sides = 24.
    for (var i = 0; i < this.points.length / this.dimention; i++) {
      this.render(this.gl.TRIANGLE_FAN, 4 * i, 4);
    }
  }
}

export default Cube;
