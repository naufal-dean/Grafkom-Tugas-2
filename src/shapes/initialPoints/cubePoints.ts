import {createSquare2D} from "./util";

const buildCubeDatas = (halfSize: number, halfThicc: number) => {
  // half size min half thickness
  const sizemt = halfSize - halfThicc;

  // prettier-ignore
  return {
    points: [
      // front - back
      ...createSquare2D(
        [-sizemt, sizemt, halfSize],
        [sizemt, sizemt, halfSize],
        [sizemt, -sizemt, halfSize],
        [-sizemt, -sizemt, halfSize],
        halfThicc,
        "front",
      ),
      ...createSquare2D(
        [-sizemt, sizemt, halfSize - this.thickness],
        [sizemt, sizemt, halfSize - this.thickness],
        [sizemt, -sizemt, halfSize - this.thickness],
        [-sizemt, -sizemt, halfSize - this.thickness],
        halfThicc,
        "front",
      ),
      ...createSquare2D(
        [-sizemt, sizemt, -halfSize],
        [sizemt, sizemt, -halfSize],
        [sizemt, -sizemt, -halfSize],
        [-sizemt, -sizemt, -halfSize],
        halfThicc,
        "front",
      ),
      ...createSquare2D(
        [-sizemt, sizemt, -halfSize + this.thickness],
        [sizemt, sizemt, -halfSize + this.thickness],
        [sizemt, -sizemt, -halfSize + this.thickness],
        [-sizemt, -sizemt, -halfSize + this.thickness],
        halfThicc,
        "front",
      ),
      // sides
      ...createSquare2D(
        [-halfSize, sizemt, sizemt],
        [-halfSize, sizemt, -sizemt],
        [-halfSize, -sizemt, -sizemt],
        [-halfSize, -sizemt, sizemt],
        halfThicc,
        "side",
      ),
      ...createSquare2D(
        [-halfSize + this.thickness, sizemt, sizemt],
        [-halfSize + this.thickness, sizemt, -sizemt],
        [-halfSize + this.thickness, -sizemt, -sizemt],
        [-halfSize + this.thickness, -sizemt, sizemt],
        halfThicc,
        "side",
      ),
      ...createSquare2D(
        [halfSize, sizemt, sizemt],
        [halfSize, sizemt, -sizemt],
        [halfSize, -sizemt, -sizemt],
        [halfSize, -sizemt, sizemt],
        halfThicc,
        "side",
      ),
      ...createSquare2D(
        [halfSize - this.thickness, sizemt, sizemt],
        [halfSize - this.thickness, sizemt, -sizemt],
        [halfSize - this.thickness, -sizemt, -sizemt],
        [halfSize - this.thickness, -sizemt, sizemt],
        halfThicc,
        "side",
      ),
      // bottom - top
      ...createSquare2D(
        [-sizemt, halfSize, -sizemt],
        [sizemt, halfSize, -sizemt],
        [sizemt, halfSize, sizemt],
        [-sizemt, halfSize, sizemt],
        halfThicc,
        "ground",
      ),
      ...createSquare2D(
        [-sizemt, halfSize - this.thickness, -sizemt],
        [sizemt, halfSize - this.thickness, -sizemt],
        [sizemt, halfSize - this.thickness, sizemt],
        [-sizemt, halfSize - this.thickness, sizemt],
        halfThicc,
        "ground",
      ),
      ...createSquare2D(
        [-sizemt, -halfSize, -sizemt],
        [sizemt, -halfSize, -sizemt],
        [sizemt, -halfSize, sizemt],
        [-sizemt, -halfSize, sizemt],
        halfThicc,
        "ground",
      ),
      ...createSquare2D(
        [-sizemt, -halfSize + this.thickness, -sizemt],
        [sizemt, -halfSize + this.thickness, -sizemt],
        [sizemt, -halfSize + this.thickness, sizemt],
        [-sizemt, -halfSize + this.thickness, sizemt],
        halfThicc,
        "ground",
      ),
    ],
  };
}

export default buildCubeDatas;
