class vec {
  static add = (v1: number[], v2: number[]) => {
    if (v1.length != v2.length) {
      throw "vec.add: vector length must be equal";
    }

    let res = [];
    for (let i = 0; i < v1.length; i++) {
      res.push(v1[i] + v2[i]);
    }
    return res;
  }

  static sub = (v1: number[], v2: number[]) => {
    if (v1.length != v2.length) {
      throw "vec.sub: vector length must be equal";
    }

    let res = [];
    for (let i = 0; i < v1.length; i++) {
      res.push(v1[i] - v2[i]);
    }
    return res;
  }

  static dot = (v1: number[], v2: number[]) => {
    if (v1.length != v2.length) {
      throw "vec.dot: vector length must be equal";
    }

    let res = 0;
    for (let i = 0; i < v1.length; i++) {
      res += v1[i] * v2[i];
    }
    return res;
  }

  static cross = (v1: number[], v2: number[]) => {
    // Notes: only support vector with length == 3

    if (v1.length != 3 ||  v2.length != 3) {
      throw "vec.cross: vector length must equal to 3";
    }

    // prettier-ignore
    return [
      v1[1] * v2[2] - v1[2] * v2[1],
      v1[2] * v2[0] - v1[0] * v2[2],
      v1[0] * v2[1] - v1[1] * v2[0],
    ];
  }

  static len = (v: number[]) => {
    return Math.sqrt(vec.dot(v));
  }

  static normalize = (v: number[]) => {
    // Notes: the input array is not preserved, it is assumed that the length of v is not 0

    const vLength = vec.len(v);
    for (let i = 0; i < v.length; i++) {
      v[i] /= vLength;
    }
    return v;
  }
}

export {vec};
