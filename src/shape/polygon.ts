import {constants} from "../constants";
import {Shape} from "./shape";

export class Polygon extends Shape {
  static load(
    canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    instance: PolygonInstance,
  ): Polygon {
    const polygon = new Polygon(canvas, gl, instance.color);
    for (const point of instance.points) {
      polygon.addPoint(point);
    }
    return polygon;
  }

  renderHitboxShape(hitboxProgram: WebGLProgram): void {
    const {gl} = this;

    const points = this.convexHullPoints().flat();
    this.createArrayBuffer(hitboxProgram, points, constants.pointSize);

    this.assignDataId(this.id, hitboxProgram);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / constants.pointSize);
  }

  protected renderShape() {
    const {gl, program} = this;

    const points = this.convexHullPoints().flat();
    this.createArrayBuffer(program, points, constants.pointSize);

    this.applyColor(program, this.color);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / constants.pointSize);
  }

  private convexHullPoints(): Point[] {
    const points = this.points.map((v) => v.point);
    if (this.drawingPoint) {
      points.push(this.drawingPoint);
    }
    if (points.length < 3) {
      return points;
    }
    let pI = 0;
    for (let i = 0; i < points.length; ++i) {
      if (points[i][0] < points[pI][0]) {
        pI = i;
      }
    }
    const start = pI;
    const res: Point[] = [];
    do {
      res.push(points[pI]);
      let nextP = (pI + 1) % points.length;
      for (let i = 0; i < points.length; ++i) {
        if (orientation(points[pI], points[i], points[nextP]) === "ccw") {
          nextP = i;
        }
      }
      pI = nextP;
    } while (pI !== start);
    return res;
  }

  onDrawingApplyPressed(state: MouseState) {
    const pos = this.drawingPoint || state.pos;
    this.addPoint(pos);
  }

  onSelectedMouseMove(id: number, [dx, dy]: [number, number]) {
    if (id === this.id) {
      for (let i = 0; i < this.points.length; ++i) {
        this.points[i].point[0] += dx;
        this.points[i].point[1] += dy;
      }
    } else {
      const i = this.points.findIndex((v) => v.id === id);
      if (i >= 0 && i < this.points.length) {
        this.updatePoint(i, [this.points[i].point[0] + dx, this.points[i].point[1] + dy]);
      }
    }
  }

  onSelectedMouseUp(state: MouseState, pos: Point) {}

  onDrawingMouseUp() {
    if (this.drawingPoint) {
      this.addPoint(this.drawingPoint);
      this.setDrawingPoint(null);
    }
    return this.points.length > 2;
  }

  getDataInstance(): ShapeInstance {
    return {
      type: "polygon",
      object: {
        color: this.color,
        points: this.points.map((v) => v.point),
      },
    };
  }

  onDrawingMouseDown(pos: Point) {
    this.addPoint(this.toScaledPoint(pos));
    this.setDrawingPoint(this.toScaledPoint(pos));
  }
}

const orientation = (p: Point, q: Point, r: Point) => {
  const val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
  if (val == 0) {
    return "colinear";
  }
  return val > 0 ? "cw" : "ccw";
};
