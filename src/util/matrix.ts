type Matrix = number[];

const toRadian = (degree: number) => (degree * Math.PI) / 180;

class mat4 {
  static dimention = 4;

  static identity() {
    // prettier-ignore
    return [
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      0,  0,  0,  1
    ];
  }

  static scale = (s1: number, s2: number, s3: number) => {
    // prettier-ignore
    return [
      s1, 0,  0,  0,
      0,  s2, 0,  0,
      0,  0,  s3, 0,
      0,  0,  0,  1
    ];
  }

  static translation(tx: number, ty: number, tz: number) {
    // prettier-ignore
    return [
      1,  0,  0,  0,
      0,  1,  0,  0,
      0,  0,  1,  0,
      tx, ty, tz, 1
    ];
  }

  static xRotation(angle: number) {
    const angleInRadians = toRadian(angle);
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    // prettier-ignore
    return [
      1,  0,  0,  0,
      0,  c,  s,  0,
      0,  -s, c,  0,
      0,  0,  0,  1
    ];
  }

  static yRotation(angle: number) {
    const angleInRadians = toRadian(angle);
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    // prettier-ignore
    return [
      c,  0,  -s, 0,
      0,  1,  0,  0,
      s,  0,  c,  0,
      0,  0,  0,  1
    ];
  }

  static zRotation(angle: number) {
    const angleInRadians = toRadian(angle);
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    // prettier-ignore
    return [
      c,  s,  0,  0,
      -s, c,  0,  0,
      0,  0,  1,  0,
      0,  0,  0,  1
    ];
  }

  static multiply = (matA: Matrix, matB: Matrix): Matrix => {
    const out = [];
    for (let i = 0; i < mat4.dimention; i++) {
      for (let j = 0; j < mat4.dimention; j++) {
        let temp = 0;
        for (let k = 0; k < mat4.dimention; k++) {
          temp += matA[i * mat4.dimention + k] * matB[k * mat4.dimention + j];
        }
        out.push(temp);
      }
    }
    return out;
  }

  static mMult = (...args: Matrix[]) => {
    let temp = args[0];
    for (let i = 1; i < args.length; i++) {
      temp = mat4.multiply(temp, args[i]);
    }
    return temp;
  }

  static orthographicProjMatrix = (left: number = -1, right: number = 1,
      bottom: number = -1, top: number = 1, near: number = -1, far: number = 1) => {

    // Initial check
    if (left == right || bottom == top || near == far) {
      throw "Invalid parameter(s)";
    }

    // Calculate width, height, and depth
    // Notes: far and near coordinates is reversed from z axis (z+ is -, vice versa)
    const width = right - left;
    const height = top - bottom;
    const depth = far - near;

    // prettier-ignore
    return [
      2 / width, 0, 0, 0,
      0, 2 / height, 0, 0,
      0, 0, -2 / depth, 0,
      - (left + right) / width, - (top + bottom) / width, - (near + far) / depth,  1
    ];
  }

  static obliqueProjMatrix = (theta: number = 70, phi: number = 70, left: number = -1, right: number = 1,
      bottom: number = -1, top: number = 1, near: number = -1, far: number = 1) => {
    // Notes: theta and phi is in degree, it is assumed that the cot of theta and phi is not infinity

    // Initial check
    if (left == right || bottom == top || near == far) {
      throw "Invalid parameter(s)";
    }

    // Convert theta and phi to radian
    const ctgTheta = 1 / Math.tan(toRadian(theta));
    const ctgPhi = 1 / Math.tan(toRadian(phi));

    // Oblique == shear + orthographic
    // prettier-ignore
    return mat4.multiply(
      mat4.orthographicProjMatrix(),
      [
        1, 0, 0, 0,
        0, 1, 0, 0,
        -ctgTheta, -ctgPhi, 1, 0,
        0, 0, 0, 1,
      ]
    );
  }

  static perspectiveProjMatrix = (fov: number = 90, aspect: number = 1, near: number = 0, far: number = 3) => {
    // Notes: fov is in degree, it is assumed that the cot of fov is not infinity

    const ctgHalfFov = 1 / Math.tan(toRadian(fov) / 2);
    const depth = far - near;

    // prettier-ignore
    return [
      ctgHalfFov / aspect, 0, 0, 0,
      0, ctgHalfFov, 0, 0,
      0, 0, - (near + far) / depth, -1,
      0, 0, -2 * near * far / depth, 0,
    ];
  }

  static projection = (width: number, height: number, depth: number) => {
    // Note: This matrix flips the Y axis so 0 is at the top.
    // prettier-ignore
    return [
      2 / width, 0, 0, 0,
      0, -2 / height, 0, 0,
      0, 0, 2 / depth, 0,
     -1, 1, 0, 1,
   ];
  }
}

export {mat4, toRadian};
