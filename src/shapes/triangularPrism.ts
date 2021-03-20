import {mat4} from "../util/matrix";
import Shape from "./shape";

class TriangularPrism extends Shape {
  // override
  public draw() {
    const gl = this.gl;

    const vertexData = this.points;

    this.changePosition(vertexData);

    //prettier-ignore
    this.setColor([
      [255, 0, 0],
      [0, 215, 0],
      [0, 0, 0],
    ]);

    const worldMatrixPos = gl.getUniformLocation(this.program, "mWorld");
    const viewMatrixPos = gl.getUniformLocation(this.program, "mView");
    const projMatrixPos = gl.getUniformLocation(this.program, "mProj");
    const worldMatrix = new Float32Array(mat4.identity());
    const viewMatrix = new Float32Array(mat4.identity());
    const projMatrix = new Float32Array(this.projMatrix);

    this.gl.uniformMatrix4fv(worldMatrixPos, false, worldMatrix);
    this.gl.uniformMatrix4fv(viewMatrixPos, false, viewMatrix);
    this.gl.uniformMatrix4fv(projMatrixPos, false, projMatrix);

    // render each rectangle separately
    for (let i = 0; i < this.points.length / (this.dimention * 4); i++) {
      this.render(this.gl.TRIANGLE_FAN, 4 * i, 4);
    }
  }
}

export default TriangularPrism;
