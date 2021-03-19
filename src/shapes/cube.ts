import {mat4} from "../util/matrix";
import Shape from "./shape";

class Cube extends Shape {
  // override

  public draw() {
    const gl = this.gl;
    //prettier-ignore

    const vertexData = this.points;

    this.changePosition(vertexData);
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

    // loop to draw cube side(rusuk), each as a rectangle.
    // To draw a rectangle needs 4 points, and each cube' face(sisi) has 4 side,
    // In total 6 faces x 4 sides = 24.
    for (var i = 0; i < 24; i++) {
      this.render(this.gl.TRIANGLE_FAN, 4 * i, 4);
    }
  }
}

export default Cube;
