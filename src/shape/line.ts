import {constants} from "../constants";
import {Shape} from "./shape";

export class Line extends Shape {
  static load(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext, instance: LineInstance): Line {
    const line = new Line(canvas, gl, instance.color);
    line.addPoint(instance.p0);
    line.addPoint(instance.p1);
    return line;
  }

  renderHitboxShape(hitboxProgram: WebGLProgram): void {
    const {gl} = this;

    const points = this.getFlatPoints();

    this.createArrayBuffer(hitboxProgram, points, constants.pointSize);

    this.assignDataId(this.id, hitboxProgram);

    gl.lineWidth(6);
    gl.drawArrays(gl.LINES, 0, points.length / constants.pointSize);
    gl.lineWidth(1);
  }

  protected renderShape() {
    const {gl, program} = this;

    const points = this.getFlatPoints();

    this.createArrayBuffer(program, points, constants.pointSize);

    this.applyColor(program, this.color);

    gl.lineWidth(6);
    gl.drawArrays(gl.LINES, 0, points.length / constants.pointSize);
    gl.lineWidth(1);
  }

  getFlatPoints(): number[] {
    const res = this.points.map((point) => point.point);
    if (this.drawingPoint) {
      res.push(this.drawingPoint);
    }
    return res.flat();
  }

  getDataInstance(): ShapeInstance {
    return {
      type: "line",
      object: {
        color: this.color,
        p0: this.points[0].point,
        p1: this.points[1].point,
      },
    };
  }

  onDrawingApplyPressed() {}

  onSelectedMouseMove(id: number, [dx, dy]: [number, number]): void {
    if (id === this.id) {
      for (let i = 0; i < this.points.length; ++i) {
        this.updatePoint(i, [this.points[i].point[0] + dx, this.points[i].point[1] + dy]);
      }
    } else {
      const i = this.points.findIndex((v) => v.id === id);
      if (i >= 0 && i < this.points.length) {
        this.updatePoint(i, [this.points[i].point[0] + dx, this.points[i].point[1] + dy]);
      }
    }
  }

  onSelectedMouseUp(state: MouseState, pos: Point) {}

  onDrawingMouseUp(state: MouseState, pos: Point): boolean {
    if (this.drawingPoint) {
      this.addPoint(this.drawingPoint);
      this.setDrawingPoint(null);
      return true;
    }
    return false;
  }

  onDrawingMouseDown(pos: Point) {
    this.addPoint(this.toScaledPoint(pos));
    this.setDrawingPoint(this.toScaledPoint(pos));
  }
}
