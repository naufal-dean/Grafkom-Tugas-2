import {mat4} from "../util/matrix";
import Shape from "./shape";

class Triangle extends Shape {
  // override
  protected getPointsFlat(): number[] {
    return this.points.flat();
  }

  public draw() {
    const gl = this.gl;
    //prettier-ignore
    const vertexData = this.getPointsFlat();

    this.changePosition(vertexData);
    this.setColor([
      [255, 1, 0],
      [0, 255, 0],
      [0, 0, 255],
    ]);

    const transformMatrixPos = gl.getUniformLocation(this.program, "mTransform");
    const worldMatrixPos = gl.getUniformLocation(this.program, "mWorld");
    const viewMatrixPos = gl.getUniformLocation(this.program, "mView");
    const projMatrixPos = gl.getUniformLocation(this.program, "mProj");

    const transformMatrix = new Float32Array(this.transformMatrix);
    const worldMatrix = new Float32Array(mat4.identity());
    const viewMatrix = new Float32Array(this.viewMatrix);
    const projMatrix = new Float32Array(this.projMatrix);

    this.gl.uniformMatrix4fv(transformMatrixPos, false, transformMatrix);
    this.gl.uniformMatrix4fv(worldMatrixPos, false, worldMatrix);
    this.gl.uniformMatrix4fv(viewMatrixPos, false, viewMatrix);
    this.gl.uniformMatrix4fv(projMatrixPos, false, projMatrix);

    this.render(this.gl.TRIANGLES, 0, this.points.length);
  }
}

export default Triangle;
