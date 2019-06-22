export type Block = {
  name  : string;
  guid  : string;
  uid   : number;
  sidesTex : [
    number,// BACK
    number,// FRONT
    number,// RIGHT
    number,// LEFT
    number,// TOP
    number // BOTTOM
  ];
  size: [
    number, // WIDTH
    number, // HEIGHT
    number  // DEPTH
  ];
  type: string; // GAZ, LIQUID, BLOCK
  slow: number; // 0 - 1
};