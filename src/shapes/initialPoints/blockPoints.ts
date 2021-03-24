import {createSquare2D} from "./util";

const buildBlockDatas = (halflen: number, halfhei: number, halfwid: number, halfthicc: number, thickness: number) => {
  // half size min half thickness
  const lenmt = halflen - halfthicc;
  const heimt = halfhei - halfthicc;
  const widmt = halfwid - halfthicc;

  // prettier-ignore
  return {
    points: [
      // front - back
      ...createSquare2D(
        [-lenmt, heimt, halfwid],
        [lenmt, heimt, halfwid],
        [lenmt, -heimt, halfwid],
        [-lenmt, -heimt, halfwid],
        halfthicc,
        "front"
      ),
      ...createSquare2D(
        [-lenmt, heimt, halfwid-thickness],
        [lenmt, heimt, halfwid-thickness],
        [lenmt, -heimt, halfwid-thickness],
        [-lenmt, -heimt, halfwid-thickness],
        halfthicc,
        "front"
      ),
      ...createSquare2D(
        [-lenmt, heimt, -halfwid],
        [lenmt, heimt, -halfwid],
        [lenmt, -heimt, -halfwid],
        [-lenmt, -heimt, -halfwid],
        halfthicc,
        "front"
      ),
      ...createSquare2D(
        [-lenmt, heimt, -halfwid + thickness],
        [lenmt, heimt, -halfwid+ thickness],
        [lenmt, -heimt, -halfwid+ thickness],
        [-lenmt, -heimt, -halfwid+ thickness],
        halfthicc,
        "front"
      ),

      // sides
      ...createSquare2D(
        [-halflen, heimt, widmt],
        [-halflen, heimt, -widmt],
        [-halflen, -heimt, -widmt],
        [-halflen, -heimt, widmt],
        halfthicc,
        "side"
      ),
      ...createSquare2D(
        [-halflen+thickness, heimt, widmt],
        [-halflen+thickness, heimt, -widmt],
        [-halflen+thickness, -heimt, -widmt],
        [-halflen+thickness, -heimt, widmt],
        halfthicc,
        "side"
      ),
      ...createSquare2D(
        [halflen, heimt, widmt],
        [halflen, heimt, -widmt],
        [halflen, -heimt, -widmt],
        [halflen, -heimt, widmt],
        halfthicc,
        "side"
      ),
      ...createSquare2D(
        [halflen - thickness, heimt, widmt],
        [halflen- thickness, heimt, -widmt],
        [halflen- thickness, -heimt, -widmt],
        [halflen- thickness, -heimt, widmt],
        halfthicc,
        "side"
      ),
      // bottom - top
      ...createSquare2D(
        [-lenmt, halfhei-thickness, -widmt],
        [lenmt, halfhei-thickness, -widmt],
        [lenmt, halfhei-thickness, widmt],
        [-lenmt, halfhei-thickness, widmt],
        halfthicc,
        "ground"
      ),
      ...createSquare2D(
        [-lenmt, -halfhei + thickness, -widmt],
        [lenmt, -halfhei + thickness, -widmt],
        [lenmt, -halfhei + thickness, widmt],
        [-lenmt, -halfhei + thickness, widmt],
        halfthicc,
        "ground"
      ),
    ],
  };
}

export default buildBlockDatas;
