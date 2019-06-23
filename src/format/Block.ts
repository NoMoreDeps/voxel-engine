export type Block = {
  name  : string;
  guid  : string;
  uid   : number;
  sidesTex : [
    string,// BACK
    string,// FRONT
    string,// RIGHT
    string,// LEFT
    string,// TOP
    string // BOTTOM
  ];
  size: [
    number, // WIDTH
    number, // HEIGHT
    number  // DEPTH
  ];
  type    : string; // GAZ, LIQUID, BLOCK
  opacity : number;
  speed   : number; // 0 - 1
};