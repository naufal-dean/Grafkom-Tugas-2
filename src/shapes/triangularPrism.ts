import Shape from "./shape";
import {buildTriangularPrismDatas} from "./initialPoints";

class TriangularPrism extends Shape {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.setupPoints();
  }

  setupPoints() {
    const triangularPrismDatas = buildTriangularPrismDatas();
    this.points = triangularPrismDatas.points;
    this.normals = triangularPrismDatas.normals;
  }

  // override
  public draw() {
    const vertexData = this.points;
    const normalData = this.normals;

    this.changePosition(vertexData);
    this.changeNormal(normalData);

    // render each rectangle separately
    for (let i = 0; i < this.points.length / (this.dimention * 4); i++) {
      this.render(this.gl.TRIANGLE_FAN, 4 * i, 4);
    }
  }
}

export default TriangularPrism;
