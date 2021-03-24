import { createSquare2D } from "./util";

const buildCubeDatas = (halfSize: number, halfThicc: number, thickness: number) => {
  // half size min half thickness
  const sizemt = halfSize - halfThicc;
  const normalArr: number[] = [];

  const points = [
    // front
    ...createSquare2D(
      [-sizemt, sizemt, halfSize],
      [sizemt, sizemt, halfSize],
      [sizemt, -sizemt, halfSize],
      [-sizemt, -sizemt, halfSize],
      halfThicc,
      "front",
      normalArr,
      true
    ),
    ...createSquare2D(
      [-sizemt, sizemt, halfSize - thickness],
      [sizemt, sizemt, halfSize - thickness],
      [sizemt, -sizemt, halfSize - thickness],
      [-sizemt, -sizemt, halfSize - thickness],
      halfThicc,
      "front",
      normalArr,
      false
    ),
    // back
    ...createSquare2D(
      [-sizemt, sizemt, -halfSize],
      [sizemt, sizemt, -halfSize],
      [sizemt, -sizemt, -halfSize],
      [-sizemt, -sizemt, -halfSize],
      halfThicc,
      "front",
      normalArr,
      false
    ),
    ...createSquare2D(
      [-sizemt, sizemt, -halfSize + thickness],
      [sizemt, sizemt, -halfSize + thickness],
      [sizemt, -sizemt, -halfSize + thickness],
      [-sizemt, -sizemt, -halfSize + thickness],
      halfThicc,
      "front",
      normalArr,
      true
    ),
    // left
    ...createSquare2D(
      [-halfSize, sizemt, sizemt],
      [-halfSize, sizemt, -sizemt],
      [-halfSize, -sizemt, -sizemt],
      [-halfSize, -sizemt, sizemt],
      halfThicc,
      "side",
      normalArr,
      false
    ),
    ...createSquare2D(
      [-halfSize + thickness, sizemt, sizemt],
      [-halfSize + thickness, sizemt, -sizemt],
      [-halfSize + thickness, -sizemt, -sizemt],
      [-halfSize + thickness, -sizemt, sizemt],
      halfThicc,
      "side",
      normalArr,
      true
    ),
    // right
    ...createSquare2D(
      [halfSize, sizemt, sizemt],
      [halfSize, sizemt, -sizemt],
      [halfSize, -sizemt, -sizemt],
      [halfSize, -sizemt, sizemt],
      halfThicc,
      "side",
      normalArr,
      true
    ),
    ...createSquare2D(
      [halfSize - thickness, sizemt, sizemt],
      [halfSize - thickness, sizemt, -sizemt],
      [halfSize - thickness, -sizemt, -sizemt],
      [halfSize - thickness, -sizemt, sizemt],
      halfThicc,
      "side",
      normalArr,
      false
    ),
    // top
    ...createSquare2D(
      [-sizemt, halfSize, -sizemt],
      [sizemt, halfSize, -sizemt],
      [sizemt, halfSize, sizemt],
      [-sizemt, halfSize, sizemt],
      halfThicc,
      "ground",
      normalArr,
      false
    ),
    ...createSquare2D(
      [-sizemt, halfSize - thickness, -sizemt],
      [sizemt, halfSize - thickness, -sizemt],
      [sizemt, halfSize - thickness, sizemt],
      [-sizemt, halfSize - thickness, sizemt],
      halfThicc,
      "ground",
      normalArr,
      true
    ),
    //bottom
    ...createSquare2D(
      [-sizemt, -halfSize, -sizemt],
      [sizemt, -halfSize, -sizemt],
      [sizemt, -halfSize, sizemt],
      [-sizemt, -halfSize, sizemt],
      halfThicc,
      "ground",
      normalArr,
      true
    ),
    ...createSquare2D(
      [-sizemt, -halfSize + thickness, -sizemt],
      [sizemt, -halfSize + thickness, -sizemt],
      [sizemt, -halfSize + thickness, sizemt],
      [-sizemt, -halfSize + thickness, sizemt],
      halfThicc,
      "ground",
      normalArr,
      false
    ),
  ];
  // prettier-ignore
  return {
    points: points,
    normalVector: normalArr
  };
}

export default buildCubeDatas;
