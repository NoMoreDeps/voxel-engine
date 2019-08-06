export type SubBlock = {
  type: "BLOCK";
  guid: string;
  data: Array<[string, number, number, number]>; // BLOCK ID , X, Y, Z
};
