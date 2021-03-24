import { createSquare2D } from "./initialPoints/util";
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
    const normalArr: number[] = [];

    this.points = [
      // front
      ...createSquare2D(
        [-sizemt, sizemt, halfSize],
        [sizemt, sizemt, halfSize],
        [sizemt, -sizemt, halfSize],
        [-sizemt, -sizemt, halfSize],
        halfThicc,
        "front",
        normalArr,
        true
      ),
      ...createSquare2D(
        [-sizemt, sizemt, halfSize - this.thickness],
        [sizemt, sizemt, halfSize - this.thickness],
        [sizemt, -sizemt, halfSize - this.thickness],
        [-sizemt, -sizemt, halfSize - this.thickness],
        halfThicc,
        "front",
        normalArr,
        false
      ),
      // back
      ...createSquare2D(
        [-sizemt, sizemt, -halfSize],
        [sizemt, sizemt, -halfSize],
        [sizemt, -sizemt, -halfSize],
        [-sizemt, -sizemt, -halfSize],
        halfThicc,
        "front",
        normalArr,
        false
      ),
      ...createSquare2D(
        [-sizemt, sizemt, -halfSize + this.thickness],
        [sizemt, sizemt, -halfSize + this.thickness],
        [sizemt, -sizemt, -halfSize + this.thickness],
        [-sizemt, -sizemt, -halfSize + this.thickness],
        halfThicc,
        "front",
        normalArr,
        true
      ),
      // left
      ...createSquare2D(
        [-halfSize, sizemt, sizemt],
        [-halfSize, sizemt, -sizemt],
        [-halfSize, -sizemt, -sizemt],
        [-halfSize, -sizemt, sizemt],
        halfThicc,
        "side",
        normalArr,
        false
      ),
      ...createSquare2D(
        [-halfSize + this.thickness, sizemt, sizemt],
        [-halfSize + this.thickness, sizemt, -sizemt],
        [-halfSize + this.thickness, -sizemt, -sizemt],
        [-halfSize + this.thickness, -sizemt, sizemt],
        halfThicc,
        "side",
        normalArr,
        true
      ),
      // right
      ...createSquare2D(
        [halfSize, sizemt, sizemt],
        [halfSize, sizemt, -sizemt],
        [halfSize, -sizemt, -sizemt],
        [halfSize, -sizemt, sizemt],
        halfThicc,
        "side",
        normalArr,
        true
      ),
      ...createSquare2D(
        [halfSize - this.thickness, sizemt, sizemt],
        [halfSize - this.thickness, sizemt, -sizemt],
        [halfSize - this.thickness, -sizemt, -sizemt],
        [halfSize - this.thickness, -sizemt, sizemt],
        halfThicc,
        "side",
        normalArr,
        false
      ),
      // top
      ...createSquare2D(
        [-sizemt, halfSize, -sizemt],
        [sizemt, halfSize, -sizemt],
        [sizemt, halfSize, sizemt],
        [-sizemt, halfSize, sizemt],
        halfThicc,
        "ground",
        normalArr,
        false
      ),
      ...createSquare2D(
        [-sizemt, halfSize - this.thickness, -sizemt],
        [sizemt, halfSize - this.thickness, -sizemt],
        [sizemt, halfSize - this.thickness, sizemt],
        [-sizemt, halfSize - this.thickness, sizemt],
        halfThicc,
        "ground",
        normalArr,
        true
      ),
      //bottom
      ...createSquare2D(
        [-sizemt, -halfSize, -sizemt],
        [sizemt, -halfSize, -sizemt],
        [sizemt, -halfSize, sizemt],
        [-sizemt, -halfSize, sizemt],
        halfThicc,
        "ground",
        normalArr,
        true
      ),
      ...createSquare2D(
        [-sizemt, -halfSize + this.thickness, -sizemt],
        [sizemt, -halfSize + this.thickness, -sizemt],
        [sizemt, -halfSize + this.thickness, sizemt],
        [-sizemt, -halfSize + this.thickness, sizemt],
        halfThicc,
        "ground",
        normalArr,
        false
      ),
    ];
    this.setNormals(...normalArr);
    this.changeNormal(normalArr);
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
