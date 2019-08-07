import { Vector3 } from "../../../../Core/Types/Geometry/Vector3";

export type Chunk = {
  position   : Vector3       ;
  size       : number        ;
  data       : Array<number> ;
  dataSize   : number        ;
  rcData     : Array<number> ;
  rcDataSize : number        ;
  hasRc      : boolean       ;
};