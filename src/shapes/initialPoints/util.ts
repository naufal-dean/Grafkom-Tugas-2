import { vec } from "../../util/vector"

// sisi depan yg ngehadep kita (depan belakang) front, sisi kiri kanan: side, sisi bawah atas: flat
type orientation = "front" | "side" | "ground";
const x = 0;
const y = 1;
const z = 2;

const squareNormal = [];

// create a square based on 4 base point and its width, then its orientation
function createSquare2D(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  w: number, //width
  orientation: orientation,
  normalArr: number[] = [],
  reversedNormal: boolean = true
): number[] {
  // prettier-ignore
  if (orientation == "front") {
    return [
      // first block ( top-left to top-right )
      ...buildQuad(
        [p0[x] - w, p0[y] - w, p0[z]],
        [p0[x] - w, p0[y] + w, p0[z]],
        [p1[x] + w, p1[y] + w, p1[z]],
        [p1[x] + w, p1[y] - w, p1[z]],
        normalArr,
        reversedNormal
      ),
      // second block  ( top-right to bottom-right )
      ...buildQuad(
        [p1[x] - w, p1[y] + w, p1[z]],
        [p1[x] + w, p1[y] + w, p1[z]],
        [p2[x] + w, p2[y] - w, p2[z]],
        [p2[x] - w, p2[y] - w, p2[z]],
        normalArr,
        reversedNormal
      ),
      // third block ( bottom-left to bottom-right )
      ...buildQuad(
        [p3[x] - w, p3[y] - w, p3[z]],
        [p3[x] - w, p3[y] + w, p3[z]],
        [p2[x] + w, p2[y] + w, p2[z]],
        [p2[x] + w, p2[y] - w, p2[z]],
        normalArr,
        reversedNormal
      ),
      // fourth block  ( top-left to bottom-left )
      ...buildQuad(
        [p0[x] - w, p0[y] + w, p0[z]],
        [p0[x] + w, p0[y] + w, p0[z]],
        [p3[x] + w, p3[y] - w, p3[z]],
        [p3[x] - w, p3[y] - w, p3[z]],
        normalArr,
        reversedNormal
      ),
    ]
  }
  if (orientation == "ground") {
    //prettier-ignore
    return [
      // first block ( top-left to top-right )
      ...buildQuad(
        [p0[x] - w, p0[y], p0[z] - w],
        [p0[x] - w, p0[y], p0[z] + w],
        [p1[x] + w, p1[y], p1[z] + w],
        [p1[x] + w, p1[y], p1[z] - w],
        normalArr,
        reversedNormal
      ),
      // second block  ( top-right to bottom-right )
      ...buildQuad(
        [p1[x] - w, p1[y], p1[z] + w],
        [p1[x] + w, p1[y], p1[z] + w],
        [p2[x] + w, p2[y], p2[z] - w],
        [p2[x] - w, p2[y], p2[z] - w],
        normalArr,
        !reversedNormal
      ),
      // third block ( bottom-left to bottom-right )
      ...buildQuad(
        [p3[x] - w, p3[y], p3[z] - w],
        [p3[x] - w, p3[y], p3[z] + w],
        [p2[x] + w, p2[y], p2[z] + w],
        [p2[x] + w, p2[y], p2[z] - w],
        normalArr,
        reversedNormal
      ),
      // fourth block  ( top-left to bottom-left )
      ...buildQuad(
        [p0[x] - w, p0[y], p0[z] + w],
        [p0[x] + w, p0[y], p0[z] + w],
        [p3[x] + w, p3[y], p3[z] - w],
        [p3[x] - w, p3[y], p3[z] - w],
        normalArr,
        !reversedNormal
      ),
    ]
  } else {
    // sides
    // prettier-ignore
    return [
      // first block ( top-left to top-right )
      ...buildQuad(
        [p0[x], p0[y] - w, p0[z] + w],
        [p0[x], p0[y] + w, p0[z] + w],
        [p1[x], p1[y] + w, p1[z] - w],
        [p1[x], p1[y] - w, p1[z] - w],
        normalArr,
        reversedNormal
      ),
      // second block  ( top-right to bottom-right )
      ...buildQuad(
        [p1[x], p1[y] + w, p1[z] + w],
        [p1[x], p1[y] + w, p1[z] - w],
        [p2[x], p2[y] - w, p2[z] - w],
        [p2[x], p2[y] - w, p2[z] + w],
        normalArr,
        reversedNormal
      ),
      // third block ( bottom-left to bottom-right )
      ...buildQuad(

        [p3[x], p3[y] - w, p3[z] + w],
        [p3[x], p3[y] + w, p3[z] + w],
        [p2[x], p2[y] + w, p2[z] - w],
        [p2[x], p2[y] - w, p2[z] - w],
        normalArr,
        reversedNormal
      ),
      // fourth block  ( top-left to bottom-left )
      ...buildQuad(

        [p0[x], p0[y] + w, p0[z] + w],
        [p0[x], p0[y] + w, p0[z] - w],
        [p3[x], p3[y] - w, p3[z] - w],
        [p3[x], p3[y] - w, p3[z] + w],
        normalArr,
        reversedNormal
      ),
    ]
  }
}


/*
 * @param p1 the first point
 * @param p2 the second point
 * @param p3 the third point
 * @param p4 the fourth point
 */
const buildQuad = (
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point,
  normalArray: number[],
  reversed: boolean = false,
) => {
  const temp1 = vec.sub(p2, p1);
  const temp2 = vec.sub(p4, p1);
  const normalDir = reversed ? -1 : 1;
  const normal = vec.mul(normalDir, vec.cross(temp1, temp2));

  normalArray.push(...normal, ...normal, ...normal, ...normal);

  if (reversed) {
    return [...p4, ...p3, ...p2, ...p1];
  } else {
    return [...p1, ...p2, ...p3, ...p4];
  }
};

export { createSquare2D, buildQuad };
