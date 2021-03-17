import {constants} from "../constants";
import {createId} from "./id";
import {Shape} from "./shape";

export class Square extends Shape {
  constructor(
    private point: Point,
    private size: number,
    ...args: AbstractContructorParameters<typeof Shape>
  ) {
    super(...args);
    this.updatePoints();
  }

  static load(
    canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    instance: SquareInstance,
  ): Square {
    return new Square(instance.p, instance.size, canvas, gl, instance.color);
  }

  renderHitboxShape(hitboxProgram: WebGLProgram): void {
    const {gl} = this;

    const points = this.getAllPoints().flat();
    this.createArrayBuffer(hitboxProgram, points, constants.pointSize);

    this.assignDataId(this.id, hitboxProgram);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / constants.pointSize);
  }

  public setSize(size: number) {
    this.size = size;
    this.updatePoints();
  }

  protected renderShape() {
    const {gl, program} = this;

    const points = this.getAllPoints().flat();

    this.createArrayBuffer(program, points, constants.pointSize);

    this.applyColor(program, this.color);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length / constants.pointSize);
  }

  private updatePoints() {
    const target = this.getAllPoints();
    for (let i = 0; i < 4; ++i) {
      const p = this.points[i];
      this.points[i] = {
        id: p?.id ?? createId(),
        point: target[i],
      };
    }
  }

  public getAllPoints(): Point[] {
    const [x, y] = this.point;
    return [
      [x, y],
      [x + this.size, y],
      [x + this.size, y + this.size],
      [x, y + this.size],
    ];
  }

  private updateBy2Points(pivot: Point, pos: Point) {
    const size = Math.max(Math.abs(pivot[0] - pos[0]), Math.abs(pivot[1] - pos[1]));
    const x = pivot[0] < pos[0] ? pivot[0] : pivot[0] - size;
    const y = pivot[1] < pos[1] ? pivot[1] : pivot[1] - size;
    this.point = [x, y];
    this.size = size;
    this.updatePoints();
  }

  getDataInstance(): ShapeInstance {
    return {
      type: "square",
      object: {
        color: this.color,
        size: this.size,
        p: this.point,
      },
    };
  }

  private getSizeToPoint(p: Point) {
    return Math.max(Math.abs(p[0] - this.point[0]), Math.abs(p[1] - this.point[1]));
  }

  setDrawingPoint(p: Point | null) {
    super.setDrawingPoint(p);
    if (p) {
      this.setSize(this.getSizeToPoint(p));
    }
  }

  onDrawingApplyPressed(): void {}

  private pivot: Point | null = null;
  onSelectedMouseMove(id: number, [dx, dy]: [number, number], [x, y]: Point): void {
    if (id === this.id) {
      this.point[0] += dx;
      this.point[1] += dy;
      this.updatePoints();
    } else {
      if (!this.pivot) {
        const i = this.points.findIndex((v) => v.id === id);
        if (i >= 0 && i < this.points.length) {
          this.pivot = this.points[(i + 2) % 4].point;
        }
      }
      if (this.pivot) {
        this.updateBy2Points(this.pivot, [x, y]);
      }
    }
  }

  onSelectedMouseUp(state: MouseState, pos: Point) {
    this.pivot = null;
  }

  onDrawingMouseUp(state: MouseState, pos: Point): boolean {
    this.pivot = null;
    if (this.drawingPoint) {
      this.setDrawingPoint(null);
      return true;
    }
    return false;
  }

  onDrawingMouseMove(state: MouseState) {
    super.onDrawingMouseMove(state);
    if (this.pivot && this.drawingPoint) {
      this.updateBy2Points(this.pivot, this.drawingPoint);
    }
  }

  onDrawingMouseDown(pos: Point) {
    this.pivot = this.toScaledPoint(pos);
    this.updateBy2Points(this.pivot, this.pivot);
  }
}
