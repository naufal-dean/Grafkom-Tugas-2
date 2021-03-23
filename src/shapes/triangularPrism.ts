import Shape from "./shape";

class TriangularPrism extends Shape {
  setupPoints() {}

  // override
  public draw() {
    const vertexData = this.points;
    const normalData = this.normals;

    this.changePosition(vertexData);
    this.changeNormal(normalData);

    //prettier-ignore
    this.setColor([0,0,0]);

    // render each rectangle separately
    for (let i = 0; i < this.points.length / (this.dimention * 4); i++) {
      this.render(this.gl.TRIANGLE_FAN, 4 * i, 4);
    }
  }
}

export default TriangularPrism;
