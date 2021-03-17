let UNIQUE_ID = 0;

export const createId = () => ++UNIQUE_ID;
export const toDataId = (id: number) => [
  ((id >> 0) & 0xff) / 0xff,
  ((id >> 8) & 0xff) / 0xff,
  ((id >> 16) & 0xff) / 0xff,
  ((id >> 24) & 0xff) / 0xff,
];
