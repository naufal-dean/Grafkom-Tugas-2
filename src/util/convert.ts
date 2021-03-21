// Convert degree to radian
const toRadian = (degree: number) => (degree * Math.PI) / 180;

// Convert spherical coordinate to cartesian
const toCartesian = (sphericalCoord: [number, number, number]) => {
  // Notes: theta and phi in degree

  // Unpack value
  const [ radius, theta, phi ] = sphericalCoord;
  const thetaInRadians = toRadian(theta);
  const phiInRadians = toRadian(phi);

  // Calculate cartesian coordinate
  let cartesianCoord = [];
  cartesianCoord.push(radius * Math.sin(thetaInRadians) * Math.cos(phiInRadians));  // x
  cartesianCoord.push(radius * Math.sin(thetaInRadians) * Math.sin(phiInRadians));  // y
  cartesianCoord.push(radius * Math.cos(thetaInRadians));  // z

  // Return
  return cartesianCoord;
};

export {toRadian, toCartesian};
