import ColorManager from "./ColorManager";
import {Line} from "./shape/line";
import {Polygon} from "./shape/polygon";
import {Shape} from "./shape/shape";
import {Square} from "./shape/square";

type Status = "SELECT" | "LINE" | "SQUARE" | "POLYGON";

export class App {
  private status: Status = "SELECT";
  private shapes: Shape[] = [];
  private mouseState: MouseState = {
    bef: [0, 0],
    pos: [0, 0],
    pressed: {
      pos: null,
    },
    shapeId: -1,
  };
  private hitboxProgram: WebGLProgram;
  private frameBuf: WebGLFramebuffer;
  private clickedShape: Shape | null = null;
  private drawingShape: Shape | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private gl: WebGL2RenderingContext,
    width: number,
    height: number,
    private backgroundColor: Color,
    private colorManager: ColorManager,
  ) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    canvas.addEventListener("mousemove", (event) => {
      this.onMouseMove(this.getMousePoint(event));
    });
    canvas.addEventListener("mousedown", (event) => {
      this.onMouseDown(this.getMousePoint(event));
    });
    canvas.addEventListener("mouseup", (event) => {
      this.onMouseUp(this.getMousePoint(event));
    });
    document.onkeypress = (e) => {
      if (e.key === "Enter") {
        this.onApplyPressed(this.mouseState);
      }
      if (e.key === "x") {
        this.onDeletePressed(this.mouseState);
      }
    };

    const hitboxProgram = gl.createProgram();
    if (!hitboxProgram) {
      throw new Error("Failed when creating hitbox program!");
    }
    this.hitboxProgram = hitboxProgram;
    this.initHitboxShader();

    const texBuf = gl.createTexture();
    if (!texBuf) {
      throw new Error("Failed creating texture");
    }
    gl.bindTexture(gl.TEXTURE_2D, texBuf);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const depBuf = gl.createRenderbuffer();
    if (!depBuf) {
      throw new Error("Failed creating render buffer");
    }
    gl.bindRenderbuffer(gl.RENDERBUFFER, depBuf);

    gl.bindTexture(gl.TEXTURE_2D, texBuf);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.canvas.width,
      gl.canvas.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.bindRenderbuffer(gl.RENDERBUFFER, depBuf);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      gl.canvas.width,
      gl.canvas.height,
    );

    const frameBuf = gl.createFramebuffer();
    if (!frameBuf) {
      throw new Error("Failed creating frame buffer");
    }
    this.frameBuf = frameBuf;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuf);

    // using the texture and depth buffer with frame buffer
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texBuf, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depBuf);
  }

  private initHitboxShader() {
    const {gl, hitboxProgram} = this;

    gl.attachShader(
      hitboxProgram,
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
      hitboxProgram,
      this.createShader(
        gl.FRAGMENT_SHADER,
        `
          precision mediump float;

          uniform vec4 dataId;

          void main() {
            gl_FragColor = dataId;
          }
        `,
      ),
    );

    gl.linkProgram(hitboxProgram);
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

  private getMousePoint(event: MouseEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return [event.x - rect.left, event.y - rect.top];
  }

  public setColorManager(colorManager: ColorManager) {
    this.colorManager = colorManager;
  }

  public render(_time: number) {
    const {gl, hitboxProgram} = this;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // drawing texture
    const frameBuffer = this.frameBuf;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(...this.backgroundColor, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(hitboxProgram);
    for (const shape of this.shapes) {
      if (this.clickedShape?.getId() === shape.getId()) {
        shape.renderHitbox(hitboxProgram, true);
      }
    }
    for (const shape of this.shapes) {
      if (this.clickedShape?.getId() !== shape.getId()) {
        shape.renderHitbox(hitboxProgram, false);
      }
    }

    if (!this.mouseState.pressed.pos) {
      this.mouseState.shapeId = this.getPixelId(this.mouseState.pos);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    this.drawingShape?.render(true);
    for (const shape of this.shapes) {
      if (this.clickedShape?.getId() === shape.getId()) {
        shape.render(true);
      }
    }
    for (const shape of this.shapes) {
      if (this.clickedShape?.getId() !== shape.getId()) {
        shape.render(false);
      }
    }
  }

  private getPixelId(pos: Point) {
    const {gl, canvas} = this;

    const pixelX = pos[0];
    const pixelY = canvas.clientHeight - pos[1];
    const data = new Uint8Array(4);
    gl.readPixels(pixelX, pixelY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
    return id;
  }

  public onStatusChange(newStatus: Status) {
    if (this.status === newStatus) {
      return;
    }
    this.status = newStatus;
    this.clickedShape = null;
  }

  private onMouseMove(newPos: Point) {
    const el = document.getElementById("coord");
    if (el) {
      el.innerText = JSON.stringify(newPos);
    }
    this.mouseState.bef = this.mouseState.pos;
    this.mouseState.pos = newPos;

    const state = this.mouseState;
    const id = state.shapeId;
    let [dx, dy] = this.toScaledPoint([state.pos[0] - state.bef[0], state.pos[1] - state.bef[1]]);
    dx += 1;
    dy -= 1;
    const [x, y] = this.toScaledPoint(newPos);

    if (this.status === "SELECT") {
      // Kalo dragging, panggil clickedShape on mouse move
      if (this.mouseState.pressed.pos) {
        this.clickedShape?.onSelectedMouseMove(id, [dx, dy], [x, y]);
      }
    } else if (this.drawingShape && this.mouseState.pressed.pos) {
      this.drawingShape.onDrawingMouseMove(this.mouseState);
    }
  }

  private onMouseDown(pos: Point) {
    this.mouseState.pressed.pos = pos;
    if (this.status === "SELECT") {
      const clickedId = this.mouseState.shapeId;
      this.clickedShape = this.shapes.filter((v) => v.containsId(clickedId))[0] ?? null;
      this.colorManager?.setSelectedShape(this.clickedShape);
    } else if (!this.drawingShape) {
      this.colorManager?.removeSelectedShape();
      this.drawingShape = this.mapToShape(this.status);
      if (this.drawingShape) {
        this.drawingShape.onDrawingMouseDown(pos);
      }
    }
  }

  private onMouseUp(pos: Point) {
    this.mouseState.pressed.pos = null;
    if (this.status === "SELECT") {
      this.clickedShape?.onSelectedMouseUp(this.mouseState, pos);
    } else if (this.drawingShape) {
      if (this.drawingShape.onDrawingMouseUp(this.mouseState, pos)) {
        this.addShape(this.drawingShape);
      }
      this.drawingShape = null;
    }
  }

  private onApplyPressed(state: MouseState) {
    this.drawingShape?.onDrawingApplyPressed(state);
  }

  private onDeletePressed(state: MouseState) {
    if (this.status === "SELECT") {
      if (!this.clickedShape) {
        return;
      }
      this.deleteShape(this.clickedShape.getId());
    }
  }

  public addShape(shape: Shape) {
    this.shapes.splice(0, 0, shape);
  }

  public deleteShape(id?: number) {
    this.shapes = this.shapes.filter((shape) => {
      return shape.getId() != id;
    });
  }

  toScaledPoint(point: Point): Point {
    const x = (point[0] / this.canvas.width) * 2 - 1;
    const y = (point[1] / this.canvas.height) * 2 - 1;
    return [x, -y];
  }

  mapToShape(status: Status): Shape | null {
    switch (status) {
      case "POLYGON":
        return new Polygon(this.canvas, this.gl, randColor());
      case "LINE":
        return new Line(this.canvas, this.gl, randColor());
      case "SQUARE":
        return new Square(this.mouseState.pos, 0, this.canvas, this.gl, randColor());
    }
    return null;
  }

  getDataInstance(): AppInstance {
    return {
      shapes: this.shapes.map((v) => v.getDataInstance()),
    };
  }
}

const randColor = (): Color => [Math.random(), Math.random(), Math.random()];
