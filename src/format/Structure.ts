export type Structure = {
  guid: string;
  content: Array<SubBlock | SubStructure>;
};

export type SubBlock = {
  type : "BLOCK";
  guid   : string;
  data : Array<[string , number, number, number]>; // BLOCK ID , X, Y, Z
}

export type SubStructure = {
  type : "STRUCT";
  guid   : string;
  data : [string, number, number, number]; // STRUCT ID, X, Y, Z
}