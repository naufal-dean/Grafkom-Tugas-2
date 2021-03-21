import {toCartesian} from "../util/convert";
import {mat4} from "../util/matrix";
type Transformation = "translate" | "rotate" | "scale";
type Projection = "orthographic" | "oblique" | "perspective";
type CameraSetting = "radius" | "theta" | "phi";

abstract class Shape {
  // Webgl properties
  protected gl: WebGL2RenderingContext;
  protected program: WebGLProgram;

  // Shape properties
  protected dimention: number = 3;
  protected points: Point[] = [];

  // Object transformations
  protected translate: Point = [0, 0, 0];
  protected rotate: Point = [0, 0, 0];
  protected scale: Point = [1, 1, 1];
  protected zoom: number = 1;

  // Camera position or eye value (in spherical coordinate), format: (radius, theta, phi)
  protected cameraPosition: [number, number, number] = [0, 0, 0];

  // Matrices used
  protected transformMatrix: number[] = mat4.identity();
  protected viewMatrix: number[] = mat4.identity();
  protected projMatrix: number[] = mat4.orthographicProj();

  constructor(protected canvas: HTMLCanvasElement) {
    canvas.width = 800;
    canvas.height = 800;

    this.gl = canvas.getContext("webgl2") as WebGL2RenderingContext;
    this.gl.viewport(0, 0, canvas.width, canvas.height);
    this.program = this.createProgram();
    this.initMainShader(this.program);

    this.calculateTransformMatrix();
    this.calculateViewMatrix();
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
      default:
        throw `shape.setTransformation: invalid transformation type '${transformationType}'`;
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
      default:
        throw `shape.getTransformation: invalid transformation type '${transformationType}'`;
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

  public setProjection(projectionType: Projection) {
    switch (projectionType) {
      case "orthographic":
        this.projMatrix = mat4.orthographicProj();
        break;
      case "oblique":
        this.projMatrix = mat4.obliqueProj();
        break;
      case "perspective":
        this.projMatrix = mat4.perspectiveProj();
        break;
      default:
        throw `shape.setProjection: invalid projection type '${projectionType}'`;
    }
  }

  public setCamera(cameraSettingType: CameraSetting, newValue: number) {
    // Notes: newValue can be radius, theta (in degree), and phi (in degree)

    switch (cameraSettingType) {
      case "radius":
        this.cameraPosition[0] = newValue;
        break;
      case "theta":
        this.cameraPosition[1] = newValue;
        break;
      case "phi":
        this.cameraPosition[2] = newValue;
        break;
      default:
        throw `shape.setCamera: invalid camera setting type '${cameraSettingType}'`;
    }
    this.calculateViewMatrix();
  }

  protected calculateViewMatrix() {
    console.log(toCartesian(this.cameraPosition));

    this.viewMatrix = mat4.lookAt(toCartesian(this.cameraPosition));

    console.log(this.viewMatrix);
  }

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
    if (!colorBuffer) throw "shape.setColor: no color buffer error";
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
      throw `shape.createCompiledShader: error while creating ${shaderTypeString} shader`;
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
      throw "shape.createProgram: no program!";
    }
    return program;
  }
}

export default Shape;
