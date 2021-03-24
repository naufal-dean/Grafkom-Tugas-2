import {vec} from "../../util/vector";
import {buildQuad } from "./util"

/*
 * Triangular Prism
 */

// Type declaration
// TODO: maybe can be reused
type TrianglePoints = {v1: Point; v2: Point; v3: Point};

/*
 * @param radius distance from (x,z)=(0,0) to vertices
 * @param y vertical position
 * @param x x coord of the central of the triangle
 * @param z z coord of the central of the triangle
 */
const generateTrianglePoints = (
  radius: number,
  y: number,
  x: number = 0,
  z: number = 0,
): TrianglePoints => {
  const radiusSin30 = radius * 0.5;
  const radiusCos30 = radius * 0.5 * Math.sqrt(3);

  return {
    // near
    v1: [x, y, z + radius],
    // far left
    v2: [x - radiusCos30, y, z - radiusSin30],
    // far right
    v3: [x + radiusCos30, y, z - radiusSin30],
  };
};


/*
 * @param innerTriangle the inner hollow triangle boundary
 * @param outerTriangle the outer hollow triangle boundary
 * @param reversed is quad reversed
 */
const buildHollowTriangle = (
  innerTriangle: TrianglePoints,
  outerTriangle: TrianglePoints,
  normalArray: number[],
  reversed: boolean = false,
) => {
  return [
    ...buildQuad(
      outerTriangle.v1,
      innerTriangle.v1,
      innerTriangle.v2,
      outerTriangle.v2,
      normalArray,
      reversed,
    ),
    ...buildQuad(
      outerTriangle.v2,
      innerTriangle.v2,
      innerTriangle.v3,
      outerTriangle.v3,
      normalArray,
      reversed,
    ),
    ...buildQuad(
      outerTriangle.v3,
      innerTriangle.v3,
      innerTriangle.v1,
      outerTriangle.v1,
      normalArray,
      reversed,
    ),
  ];
};

/*
 * @param t1 the first triangle to be connected
 * @param t2 the second triangle to be connected
 */
const buildTriangleConnector = (
  t1: TrianglePoints,
  t2: TrianglePoints,
  normalArray: number[],
  reversed: boolean = false,
) => {
  return [
    ...buildQuad(t1.v1, t2.v1, t2.v3, t1.v3, normalArray, reversed),
    ...buildQuad(t1.v3, t2.v3, t2.v2, t1.v2, normalArray, reversed),
    ...buildQuad(t1.v2, t2.v2, t2.v1, t1.v1, normalArray, reversed),
  ];
};

interface ITrianglePoints {
  inner: TrianglePoints[];
  outer: TrianglePoints[];
}

// 8 triangle points to be used as reference
const trianglesPoints: ITrianglePoints = {
  inner: [
    generateTrianglePoints(0.4, 0.6),
    generateTrianglePoints(0.4, 0.5),
    generateTrianglePoints(0.4, -0.5),
    generateTrianglePoints(0.4, -0.6),
  ],
  outer: [
    generateTrianglePoints(0.6, 0.6),
    generateTrianglePoints(0.6, 0.5),
    generateTrianglePoints(0.6, -0.5),
    generateTrianglePoints(0.6, -0.6),
  ],
};

// Vertical structure triangle radius
// 0.2 = r + r*sin30
// r = 0.2 / (1 + sin30) = 0.2 / 1.5
const vsTriangleRadius = 0.2 / 1.5;

// Vertical structure triangle center for near, far left, and far right
const vsTriangleRadiusSin30 = vsTriangleRadius * 0.5;
const vsTriangleRadiusCos30 = vsTriangleRadius * 0.5 * Math.sqrt(3);
const vsTriangleCenter = [
  {x: 0, z: 0.6 - vsTriangleRadius}, // near
  {
    x: trianglesPoints.outer[0].v2[0] + vsTriangleRadiusCos30,
    z: trianglesPoints.outer[0].v2[2] + vsTriangleRadiusSin30,
  }, // far left
  {
    x: trianglesPoints.outer[0].v3[0] - vsTriangleRadiusCos30,
    z: trianglesPoints.outer[0].v3[2] + vsTriangleRadiusSin30,
  }, // far right
];

let triangularPrismNormals: number[] = [];
// prettier-ignore
const triangularPrismPoints = [
  // Top triangle structure
  ...buildHollowTriangle(trianglesPoints.inner[0], trianglesPoints.outer[0], triangularPrismNormals),
  ...buildHollowTriangle(trianglesPoints.inner[1], trianglesPoints.outer[1], triangularPrismNormals, true),
  ...buildTriangleConnector(trianglesPoints.inner[0], trianglesPoints.inner[1], triangularPrismNormals, true),
  ...buildTriangleConnector(trianglesPoints.outer[0], trianglesPoints.outer[1], triangularPrismNormals),
  // Bottom triangle structure
  ...buildHollowTriangle(trianglesPoints.inner[2], trianglesPoints.outer[2], triangularPrismNormals),
  ...buildHollowTriangle(trianglesPoints.inner[3], trianglesPoints.outer[3], triangularPrismNormals, true),
  ...buildTriangleConnector(trianglesPoints.inner[2], trianglesPoints.inner[3], triangularPrismNormals, true),
  ...buildTriangleConnector(trianglesPoints.outer[2], trianglesPoints.outer[3], triangularPrismNormals),
  // Vertical structure
  ...buildTriangleConnector(
    generateTrianglePoints(vsTriangleRadius, 0.5, vsTriangleCenter[0].x, vsTriangleCenter[0].z),
    generateTrianglePoints(vsTriangleRadius, -0.5, vsTriangleCenter[0].x, vsTriangleCenter[0].z),
    triangularPrismNormals
  ),
  ...buildTriangleConnector(
    generateTrianglePoints(vsTriangleRadius, 0.5, vsTriangleCenter[1].x, vsTriangleCenter[1].z),
    generateTrianglePoints(vsTriangleRadius, -0.5, vsTriangleCenter[1].x, vsTriangleCenter[1].z),
    triangularPrismNormals
  ),
  ...buildTriangleConnector(
    generateTrianglePoints(vsTriangleRadius, 0.5, vsTriangleCenter[2].x, vsTriangleCenter[2].z),
    generateTrianglePoints(vsTriangleRadius, -0.5, vsTriangleCenter[2].x, vsTriangleCenter[2].z),
    triangularPrismNormals
  ),
];

export default {
  points: triangularPrismPoints,
  normals: triangularPrismNormals,
};
