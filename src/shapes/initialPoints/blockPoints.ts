import { createSquare2D } from "./util";

const buildBlockDatas = (halflen: number, halfhei: number, halfwid: number, halfthicc: number, thickness: number) => {
  // half size min half thickness
  const lenmt = halflen - halfthicc;
  const heimt = halfhei - halfthicc;
  const widmt = halfwid - halfthicc;
  const normalArr: number[] = []
  //prettier-ignore
  const points = [
    // front 
    ...createSquare2D([-lenmt, heimt, halfwid], [lenmt, heimt, halfwid], [lenmt, -heimt, halfwid], [-lenmt, -heimt, halfwid], halfthicc, "front", normalArr),
    ...createSquare2D([-lenmt, heimt, halfwid - thickness], [lenmt, heimt, halfwid - thickness], [lenmt, -heimt, halfwid - thickness], [-lenmt, -heimt, halfwid - thickness], halfthicc, "front", normalArr, false),
    // back
    ...createSquare2D([-lenmt, heimt, -halfwid], [lenmt, heimt, -halfwid], [lenmt, -heimt, -halfwid], [-lenmt, -heimt, -halfwid], halfthicc, "front", normalArr, false),
    ...createSquare2D([-lenmt, heimt, -halfwid + thickness], [lenmt, heimt, -halfwid + thickness], [lenmt, -heimt, -halfwid + thickness], [-lenmt, -heimt, -halfwid + thickness], halfthicc, "front", normalArr, true),

    // left
    ...createSquare2D([-halflen, heimt, widmt], [-halflen, heimt, -widmt], [-halflen, -heimt, -widmt], [-halflen, -heimt, widmt], halfthicc, "side", normalArr, false),
    ...createSquare2D([-halflen + thickness, heimt, widmt], [-halflen + thickness, heimt, -widmt], [-halflen + thickness, -heimt, -widmt], [-halflen + thickness, -heimt, widmt], halfthicc, "side", normalArr, true),
    // right
    ...createSquare2D([halflen, heimt, widmt], [halflen, heimt, -widmt], [halflen, -heimt, -widmt], [halflen, -heimt, widmt], halfthicc, "side", normalArr),
    ...createSquare2D([halflen - thickness, heimt, widmt], [halflen - thickness, heimt, -widmt], [halflen - thickness, -heimt, -widmt], [halflen - thickness, -heimt, widmt], halfthicc, "side", normalArr, false),
    // top
    ...createSquare2D([-lenmt, halfhei - thickness, -widmt], [lenmt, halfhei - thickness, -widmt], [lenmt, halfhei - thickness, widmt], [-lenmt, halfhei - thickness, widmt], halfthicc, "ground", normalArr, true),
    ...createSquare2D([-lenmt, halfhei, -widmt], [lenmt, halfhei, -widmt], [lenmt, halfhei, widmt], [-lenmt, halfhei, widmt], halfthicc, "ground", normalArr, false),
    // bottom
    ...createSquare2D([-lenmt, -halfhei + thickness, -widmt], [lenmt, -halfhei + thickness, -widmt], [lenmt, -halfhei + thickness, widmt], [-lenmt, -halfhei + thickness, widmt], halfthicc, "ground", normalArr, false),
    ...createSquare2D([-lenmt, -halfhei, -widmt], [lenmt, -halfhei, -widmt], [lenmt, -halfhei, widmt], [-lenmt, -halfhei, widmt], halfthicc, "ground", normalArr, true),
  ]
  // prettier-ignore
  return {
    points: points,
    normalVector: normalArr
  };
}

export default buildBlockDatas;
