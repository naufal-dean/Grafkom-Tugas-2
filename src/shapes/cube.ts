import {createSquare2D} from "./initialPoints/util";
import Shape from "./shape";

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
    // half size min half thickness
    const sizemt = halfSize - halfThicc;

    this.points = [
      // front - back
      ...createSquare2D(
        [-sizemt, sizemt, halfSize],
        [sizemt, sizemt, halfSize],
        [sizemt, -sizemt, halfSize],
        [-sizemt, -sizemt, halfSize],
        halfThicc,
        "front",
      ),
      ...createSquare2D(
        [-sizemt, sizemt, -halfSize],
        [sizemt, sizemt, -halfSize],
        [sizemt, -sizemt, -halfSize],
        [-sizemt, -sizemt, -halfSize],
        halfThicc,
        "front",
      ),
      // sides
      ...createSquare2D(
        [-halfSize, sizemt, sizemt],
        [-halfSize, sizemt, -sizemt],
        [-halfSize, -sizemt, -sizemt],
        [-halfSize, -sizemt, sizemt],
        halfThicc,
        "side",
      ),
      ...createSquare2D(
        [halfSize, sizemt, sizemt],
        [halfSize, sizemt, -sizemt],
        [halfSize, -sizemt, -sizemt],
        [halfSize, -sizemt, sizemt],
        halfThicc,
        "side",
      ),
      // bottom - top
      ...createSquare2D(
        [-sizemt, halfSize, -sizemt],
        [sizemt, halfSize, -sizemt],
        [sizemt, halfSize, sizemt],
        [-sizemt, halfSize, sizemt],
        halfThicc,
        "ground",
      ),
      ...createSquare2D(
        [-sizemt, -halfSize, -sizemt],
        [sizemt, -halfSize, -sizemt],
        [sizemt, -halfSize, sizemt],
        [-sizemt, -halfSize, sizemt],
        halfThicc,
        "ground",
      ),
    ];
  }
  public draw() {
    const vertexData = this.points;

    this.changePosition(vertexData);

    // loop to draw cube side(rusuk), each as a rectangle.
    // To draw a rectangle needs 4 points, and each cube' face(sisi) has 4 side,
    // In total 6 faces x 4 sides = 24.
    for (var i = 0; i < 24; i++) {
      this.render(this.gl.TRIANGLE_FAN, 4 * i, 4);
    }
  }
}

export default Cube;
