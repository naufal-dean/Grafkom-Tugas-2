type Matrix = number[];

const toRadian = (degree: number) => (degree * Math.PI) / 180;

class mat4 {
  static dimention = 4;
  static identity() {
    // prettier-ignore
    return [
      1, 0, 0, 0, 
      0, 1, 0, 0, 
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }
  static scale = (s1: number, s2: number, s3: number) => {
    // prettier-ignore
    return [
      s1,0,0,0,
      0,s2,0,0,
      0,0,s3,0,
      0,0,0,1
    ]
  };
  static translation(tx: number, ty: number, tz: number) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
  }

  static xRotation(angle: number) {
    const angleInRadians = toRadian(angle);
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
  }

  static yRotation(angle: number) {
    const angleInRadians = toRadian(angle);
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
  }

  static zRotation(angle: number) {
    const angleInRadians = toRadian(angle);
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
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
  };
  static mMult = (...args: Matrix[]) => {
    let temp = args[0];
    for (let i = 1; i < args.length; i++) {
      temp = mat4.multiply(temp, args[i]);
    }
    return temp;
  };

  static projection = (width: number, height: number, depth: number) => {
    // Note: This matrix flips the Y axis so 0 is at the top.
    // prettier-ignore
    return [
      2 / width, 0, 0, 0,
      0, -2 / height, 0, 0,
      0, 0, 2 / depth, 0,
     -1, 1, 0, 1,
   ];
  };
}

export {mat4, toRadian};
