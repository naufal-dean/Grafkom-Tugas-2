import Shape from "./shape";
import { buildBlockDatas } from "./initialPoints";

class Block extends Shape {
  constructor(
    canvas: HTMLCanvasElement,
    private length: number,
    private height: number,
    private width: number,
    private thickness: number,
  ) {
    super(canvas);
    this.setupPoints();
  }

  public setLength(length: number) {
    this.length = length;
    this.setupPoints();
  }

  public setWidth(width: number) {
    this.width = width;
    this.setupPoints();
  }

  public setHeight(height: number) {
    this.height = height;
    this.setupPoints();
  }

  setupPoints() {
    const { width, height, length, thickness } = this;
    // length min thickness, len plus thickness, and so on...
    const halflen = length / 2;
    const halfhei = height / 2;
    const halfwid = width / 2;
    const halfthicc = thickness / 2;

    const blockDatas = buildBlockDatas(halflen, halfhei, halfwid, halfthicc, thickness);
    this.points = blockDatas.points;
    this.setNormals(...blockDatas.normalVector)
    this.changeNormal(blockDatas.normalVector);
  }

  public draw() {
    this.changePosition(this.points);

    for (var i = 0; i < this.points.length / this.dimention; i++) {
      this.render(this.gl.TRIANGLE_FAN, 4 * i, 4);
    }
  }
}

export default Block;
