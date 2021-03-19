import {mat4} from "../util/matrix";
import Shape from "./shape";

class Cube extends Shape {
  private size: number = 1;

  protected getPointsFlat() {
    return [];
  }

  draw() {
    const {gl, program} = this;
    // prettier-ignore
    const vertexData = [
      // left column
      0,   0,  0,
      30,   0,  0,
       0, 150,  0,
       0, 150,  0,
      30,   0,  0,
      30, 150,  0,

     // top rung
      30,   0,  0,
     100,   0,  0,
      30,  30,  0,
      30,  30,  0,
     100,   0,  0,
     100,  30,  0,

     // middle rung
      30,  60,  0,
      67,  60,  0,
      30,  90,  0,
      30,  90,  0,
      67,  60,  0,
      67,  90,  0
    ]
    this.changePosition(vertexData);

    const worldMatrixPos = gl.getUniformLocation(this.program, "mWorld");
    const viewMatrixPos = gl.getUniformLocation(this.program, "mView");
    const projMatrixPos = gl.getUniformLocation(this.program, "mProj");
    const worldMatrix = new Float32Array(mat4.identity());
    const viewMatrix = new Float32Array(mat4.identity());
    const projMatrix = new Float32Array(mat4.identity());

    this.gl.uniformMatrix4fv(worldMatrixPos, false, worldMatrix);
    this.gl.uniformMatrix4fv(viewMatrixPos, false, viewMatrix);
    this.gl.uniformMatrix4fv(projMatrixPos, false, projMatrix);

    this.render(this.gl.TRIANGLES, vertexData.length / this.dimention);
  }

  public setSize(size: number) {
    this.size = size;
  }
}

export default Cube;
