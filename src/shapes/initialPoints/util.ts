// sisi depan yg ngehadep kita (depan belakang) front, sisi kiri kanan: side, sisi bawah atas: flat
type orientation = "front" | "side" | "ground";
const x = 0;
const y = 1;
const z = 2;

// create a square based on 4 base point and its width, then its orientation
function createSquare2D(
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
  w: number, //width
  orientation: orientation,
): number[] {
  // prettier-ignore
  if(orientation == "front") {
    return [
      // first block ( top-left to top-right )
      p0[x] - w, p0[y] - w, p0[z],
      p0[x] - w, p0[y] + w, p0[z],
      p1[x] + w, p1[y] + w, p1[z],
      p1[x] + w, p1[y] - w, p1[z],
      // second block  ( top-right to bottom-right )
      p1[x] - w, p1[y] + w, p1[z],
      p1[x] + w, p1[y] + w, p1[z],
      p2[x] + w, p2[y] - w, p2[z],
      p2[x] - w, p2[y] - w, p2[z],
      // third block ( bottom-left to bottom-right )
      p3[x] - w, p3[y] - w, p3[z],
      p3[x] - w, p3[y] + w, p3[z],
      p2[x] + w, p2[y] + w, p2[z],
      p2[x] + w, p2[y] - w, p2[z],
      // fourth block  ( top-left to bottom-left )
      p0[x] - w, p0[y] + w, p0[z],
      p0[x] + w, p0[y] + w, p0[z],
      p3[x] + w, p3[y] - w, p3[z],
      p3[x] - w, p3[y] - w, p3[z],
    ]
  }
  if (orientation == "ground") {
    //prettier-ignore
    return [
      // first block ( top-left to top-right )
      p0[x] - w, p0[y], p0[z]  - w,
      p0[x] - w, p0[y], p0[z]  + w,
      p1[x] + w, p1[y], p1[z]  + w,
      p1[x] + w, p1[y], p1[z]  - w,
      // second block  ( top-right to bottom-right )
      p1[x] - w, p1[y], p1[z] + w,
      p1[x] + w, p1[y], p1[z] + w,
      p2[x] + w, p2[y], p2[z] - w,
      p2[x] - w, p2[y], p2[z]- w,
      // third block ( bottom-left to bottom-right )
      p3[x] - w, p3[y], p3[z] - w,
      p3[x] - w, p3[y], p3[z] + w,
      p2[x] + w, p2[y], p2[z] + w,
      p2[x] + w, p2[y], p2[z] - w,
      // fourth block  ( top-left to bottom-left )
      p0[x] - w, p0[y], p0[z] + w,
      p0[x] + w, p0[y], p0[z] + w,
      p3[x] + w, p3[y], p3[z] - w,
      p3[x] - w, p3[y], p3[z] - w,
    ]
  } else {
    // prettier-ignore
    return [
      // first block ( top-left to top-right )
      p0[x], p0[y] - w, p0[z] + w,
      p0[x], p0[y] + w, p0[z] + w,
      p1[x], p1[y] + w, p1[z] - w,
      p1[x], p1[y] - w, p1[z] - w,
      // second block  ( top-right to bottom-right )
      p1[x], p1[y] + w, p1[z] + w,
      p1[x], p1[y] + w, p1[z] - w,
      p2[x], p2[y] - w, p2[z] - w,
      p2[x], p2[y] - w, p2[z] + w,
      // third block ( bottom-left to bottom-right )
      p3[x], p3[y] - w, p3[z] + w,
      p3[x], p3[y] + w, p3[z] + w,
      p2[x], p2[y] + w, p2[z] - w,
      p2[x], p2[y] - w, p2[z] - w,
      // fourth block  ( top-left to bottom-left )
      p0[x], p0[y] + w, p0[z] + w,
      p0[x], p0[y] + w, p0[z] - w,
      p3[x], p3[y] - w, p3[z] - w,
      p3[x], p3[y] - w, p3[z] + w,
    ]
  }
}

export {createSquare2D};
