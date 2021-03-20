import {mat4} from "../util/matrix";
type Transformation = "translate" | "rotate" | "scale";

abstract class Shape {
  protected gl: WebGL2RenderingContext;
  protected dimention: number = 3;
  protected program: WebGLProgram;
  protected points: Point[] = [];
  protected translate: Point = [0, 0, 0];
  protected rotate: Point = [0, 0, 0];
  protected scale: Point = [1, 1, 1];
  protected zoom: number = 1;
  protected transformMatrix: number[] = mat4.identity();
  protected projMatrix: number[] = mat4.identity();

  constructor(protected canvas: HTMLCanvasElement) {
    canvas.width = 800;
    canvas.height = 800;
    this.gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.program = this.createProgram();
    this.initMainShader(this.program);
  }

  protected initMainShader(program: WebGLProgram) {
    const gl = this.gl;
    const vShader = this.createCompiledShader(
      gl.VERTEX_SHADER,
      `
      attribute vec3 position;
      attribute vec3 vertColor;
      varying vec3 fragColor;
      uniform mat4 mTransform;
      uniform mat4 mWorld;
      uniform mat4 mView;
      uniform mat4 mProj;

      void main() {
        fragColor = vertColor;
        gl_Position = mProj * mView * mWorld * mTransform * vec4(position, 1);
      }
      `,
    );
    const fShader = this.createCompiledShader(
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;

      varying vec3 fragColor;

      void main() {
        gl_FragColor = vec4(fragColor,1);
      }
      `,
    );
    this.setupProgram(program, vShader, fShader);
  }

  public setTransformation(transformationType: Transformation, newArr: Point) {
    switch (transformationType) {
      case "rotate":
        this.rotate = newArr;
        break;
      case "scale":
        this.scale = newArr;
        break;
      case "translate":
        this.translate = newArr;
        break;
    }
    this.calculateTransformMatrix();
  }

  public getTransformation(transformationType: Transformation) {
    switch (transformationType) {
      case "rotate":
        return this.rotate;
      case "scale":
        return this.scale;
      case "translate":
        return this.translate;
    }
  }

  protected calculateTransformMatrix() {
    this.transformMatrix = mat4.mMult(
      mat4.xRotation(this.rotate[0]),
      mat4.yRotation(this.rotate[1]),
      mat4.zRotation(this.rotate[2]),
      mat4.scale(...this.scale),
      mat4.translation(...this.translate),
    );
  }

  // TODO: implement setProjection

  public render(mode: number, startingIdx: number, size: number) {
    this.gl.drawArrays(mode, startingIdx, size);
  }

  public addPoint(...points: Point[]) {
    points.forEach((point) => {
      this.points.push(point);
    });
  }

  protected abstract getPointsFlat(): number[];

  public abstract draw(): void;

  setColor(colors: Color[]) {
    const gl = this.gl;
    const real_color = this.mapColor(colors.flat());
    const colorBuffer = gl.createBuffer();
    if (!colorBuffer) throw "no color buffer error";
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(real_color), gl.STATIC_DRAW);

    const colorPointer = gl.getAttribLocation(this.program, "vertColor");
    gl.enableVertexAttribArray(colorPointer);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorPointer, 3, gl.FLOAT, false, 0, 0);
    return colorBuffer;
  }

  mapColor(color: number[]) {
    return color.map((elmt) => (elmt % 256) / 255);
  }

  changePosition(vertexData: number[]) {
    const {gl, program} = this;
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const positionPos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionPos);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(positionPos, this.dimention, gl.FLOAT, false, 0, 0);

    return buffer;
  }

  createCompiledShader(type: number, sourceCode: string) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    if (!shader) {
      const shaderTypeString = type == gl.VERTEX_SHADER ? "vertex" : "fragment";
      throw `Error while creating ${shaderTypeString} shader`;
    }
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);
    return shader;
  }

  setupProgram(program: WebGLProgram, vShader: WebGLShader, fShader: WebGLShader) {
    this.gl.attachShader(program, vShader);
    this.gl.attachShader(program, fShader);
    this.gl.linkProgram(program);
    this.gl.useProgram(program);
  }

  createProgram() {
    const program = this.gl.createProgram();
    if (!program) {
      throw "No program!";
    }
    return program;
  }
}

export default Shape;
