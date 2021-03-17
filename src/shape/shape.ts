import {constants} from "../constants";
import {createId, toDataId} from "./id";

// base abstract class
export abstract class Shape {
  protected program: WebGLProgram;
  protected points: {id: number; point: Point}[] = [];
  protected drawingPoint: Point | null = null;
  protected id: number = createId();

  constructor(
    protected canvas: HTMLCanvasElement,
    protected gl: WebGL2RenderingContext,
    protected color: Color,
  ) {
    const program = gl.createProgram();
    if (!program) {
      throw new Error("Failed when creating program!");
    }
    this.program = program;
    this.initMainShader();
  }

  private initMainShader() {
    const {gl, program} = this;
    gl.attachShader(
      program,
      this.createShader(
        gl.VERTEX_SHADER,
        `
          precision mediump float;

          attribute vec2 position;

          void main() {
            gl_Position = vec4(position, 0, 1);
          }
        `,
      ),
    );

    gl.attachShader(
      program,
      this.createShader(
        gl.FRAGMENT_SHADER,
        `
          precision mediump float;

          uniform vec3 color;

          void main() {
            gl_FragColor = vec4(color, 1);
          }
        `,
      ),
    );

    gl.linkProgram(program);
  }

  protected assignDataId(id: number, hitboxProgram: WebGLProgram) {
    const {gl} = this;
    const dataPointer = gl.getUniformLocation(hitboxProgram, "dataId");
    gl.uniform4fv(dataPointer, new Float32Array(toDataId(id)));
  }

  abstract renderHitboxShape(hitboxProgram: WebGLProgram): void;
  renderHitbox(hitboxProgram: WebGLProgram, selected: boolean) {
    if (selected) {
      this.renderPoints(hitboxProgram, true);
      this.renderSelected(hitboxProgram, true);
    }
    this.renderHitboxShape(hitboxProgram);
  }

  protected abstract renderShape(): void;
  render(selected: boolean) {
    const {gl, program} = this;

    gl.useProgram(program);
    if (selected) {
      this.renderPoints(program, false);
      this.renderSelected(program, false);
    }
    this.renderShape();
  }

  protected createShader(shaderType: number, source: string): WebGLShader {
    const shader = this.gl.createShader(shaderType);
    if (!shader) {
      throw new Error("Failed when creating shader!");
    }
    this.gl.shaderSource(
      shader,
      // varying is for gradient
      source,
    );
    this.gl.compileShader(shader);
    return shader;
  }

  protected createArrayBuffer(program: WebGLProgram, data: number[], size: number) {
    const {gl} = this;

    const positionBufferPointer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferPointer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    const positionPointer = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionPointer);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferPointer);
    gl.vertexAttribPointer(positionPointer, size, gl.FLOAT, false, 0, 0);

    return positionBufferPointer;
  }

  protected applyColor(program: WebGLProgram, color: Color) {
    const {gl} = this;

    const colorPointer = gl.getUniformLocation(program, "color");
    gl.uniform3fv(colorPointer, new Float32Array(color));
  }

  protected flatPoints(withDrawingPoint: boolean) {
    const arr = this.points.map((v) => v.point);
    if (withDrawingPoint && this.drawingPoint) {
      arr.push(this.drawingPoint);
    }
    return arr.flat();
  }

  protected renderPoints(program: WebGLProgram, assignId: boolean) {
    const {gl} = this;

    const size = 0.02;
    const count = 6;

    const pp = this.points.map((v) => v.point);
    if (this.drawingPoint) {
      pp.push(this.drawingPoint);
    }
    const points = pp
      .map((v) => {
        return [
          v[0] + size,
          v[1] + size,
          v[0] - size,
          v[1] + size,
          v[0] - size,
          v[1] - size,

          v[0] - size,
          v[1] - size,
          v[0] + size,
          v[1] - size,
          v[0] + size,
          v[1] + size,
        ];
      })
      .flat();
    this.createArrayBuffer(program, points, constants.pointSize);

    if (!assignId) {
      this.applyColor(program, constants.selectedPointColor);
    }

    for (let i = 0; i < this.points.length; ++i) {
      const p = this.points[i];
      if (assignId) {
        this.assignDataId(p.id, program);
      }
      gl.drawArrays(gl.TRIANGLES, i * count, count);
    }
    if (this.drawingPoint) {
      gl.drawArrays(gl.TRIANGLES, this.points.length * count, count);
    }
  }

  protected renderSelected(program: WebGLProgram, assignId: boolean) {
    const {gl} = this;

    const points = this.flatPoints(true);
    this.createArrayBuffer(program, points, constants.pointSize);

    gl.lineWidth(6);

    if (assignId) {
      this.assignDataId(this.id, program);
    } else {
      this.applyColor(program, constants.selectedColor);
    }

    let len = this.points.length;
    if (this.drawingPoint) {
      ++len;
    }
    gl.drawArrays(gl.LINE_LOOP, 0, len);
    gl.lineWidth(1);
  }

  setDrawingPoint(p: Point | null) {
    this.drawingPoint = p;
  }

  containsId(id: number) {
    return [this.id, ...this.points.map((v) => v.id)].includes(id);
  }

  setColor(color: Color) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  addPoint(p: Point) {
    this.points.push({id: createId(), point: p});
  }

  updatePoint(index: number, p: Point) {
    this.points[index].point = p;
  }

  getId() {
    return this.id;
  }

  abstract onSelectedMouseMove(id: number, delta: [number, number], mouseScaledPos: Point): void;
  abstract onSelectedMouseUp(state: MouseState, pos: Point): void;

  toScaledPoint(point: Point): Point {
    const x = (point[0] / this.canvas.width) * 2 - 1;
    const y = (point[1] / this.canvas.height) * 2 - 1;
    return [x, -y];
  }

  abstract onDrawingMouseUp(state: MouseState, pos: Point): boolean;

  onDrawingMouseMove(state: MouseState) {
    this.setDrawingPoint(this.toScaledPoint(state.pos));
  }

  abstract onDrawingApplyPressed(state: MouseState): void;

  abstract getDataInstance(): ShapeInstance;

  abstract onDrawingMouseDown(pos: Point): void;
}
