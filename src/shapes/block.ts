import {mat4} from "../util/matrix";
import {createSquare2D} from "./initialPoints/util";
import Shape from "./shape";

class Block extends Shape {
  constructor(
    canvas: HTMLCanvasElement,
    private length: number,
    private height: number,
    private width: number,
    private thickness: number,
  ) {
    super(canvas);
    this.setupPoints();
  }

  public setLength(length: number) {
    this.length = length;
    this.setupPoints();
  }

  public setWidth(width: number) {
    this.width = width;
    this.setupPoints();
  }

  public setHeight(height: number) {
    this.height = height;
    this.setupPoints();
  }

  setupPoints() {
    const {width, height, length, thickness} = this;
    // length min thickness, len plus thickness, and so on...
    const halflen = length / 2;
    const halfhei = height / 2;
    const halfwid = width / 2;
    const halfthicc = thickness / 2;
    const lenmt = halflen - halfthicc;
    const heimt = halfhei - halfthicc;
    const widmt = halfwid - halfthicc;
    //prettier-ignore
    this.points = [
      // front - back
      ...createSquare2D([-lenmt, heimt, halfwid], [lenmt, heimt, halfwid], [lenmt, -heimt, halfwid], [-lenmt, -heimt, halfwid], halfthicc, "front"),
      ...createSquare2D([-lenmt, heimt, halfwid-thickness], [lenmt, heimt, halfwid-thickness], [lenmt, -heimt, halfwid-thickness], [-lenmt, -heimt, halfwid-thickness], halfthicc, "front"),
      ...createSquare2D([-lenmt, heimt, -halfwid], [lenmt, heimt, -halfwid], [lenmt, -heimt, -halfwid], [-lenmt, -heimt, -halfwid], halfthicc, "front"),
      ...createSquare2D([-lenmt, heimt, -halfwid + thickness], [lenmt, heimt, -halfwid+ thickness], [lenmt, -heimt, -halfwid+ thickness], [-lenmt, -heimt, -halfwid+ thickness], halfthicc, "front"),

      // sides
      ...createSquare2D([-halflen, heimt, widmt], [-halflen, heimt, -widmt], [-halflen, -heimt, -widmt], [-halflen, -heimt, widmt], halfthicc, "side"),
      ...createSquare2D([-halflen+thickness, heimt, widmt], [-halflen+thickness, heimt, -widmt], [-halflen+thickness, -heimt, -widmt], [-halflen+thickness, -heimt, widmt], halfthicc, "side"),
      ...createSquare2D([halflen, heimt, widmt], [halflen, heimt, -widmt], [halflen, -heimt, -widmt], [halflen, -heimt, widmt], halfthicc, "side"),
      ...createSquare2D([halflen - thickness, heimt, widmt], [halflen- thickness, heimt, -widmt], [halflen- thickness, -heimt, -widmt], [halflen- thickness, -heimt, widmt], halfthicc, "side"),
      // bottom - top
      ...createSquare2D([-lenmt, halfhei-thickness, -widmt], [lenmt, halfhei-thickness, -widmt], [lenmt, halfhei-thickness, widmt], [-lenmt, halfhei-thickness, widmt], halfthicc, "ground"),
      ...createSquare2D([-lenmt, -halfhei + thickness, -widmt], [lenmt, -halfhei + thickness, -widmt], [lenmt, -halfhei + thickness, widmt], [-lenmt, -halfhei + thickness, widmt], halfthicc, "ground"),
    ]
  }

  public draw() {
    this.changePosition(this.points);

    // loop to draw cube side(rusuk), each as a rectangle.
    // To draw a rectangle needs 4 points, and each cube' face(sisi) has 4 side,
    // In total 6 faces x 4 sides = 24.
    for (var i = 0; i < this.points.length / this.dimention; i++) {
      this.render(this.gl.TRIANGLE_FAN, 4 * i, 4);
    }
  }
}

export default Block;
