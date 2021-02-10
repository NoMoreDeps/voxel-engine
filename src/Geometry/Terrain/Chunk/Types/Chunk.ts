import { Vector3 } from "../../../../Core/Types/Geometry/Vector3";

export type Chunk = {
  position   : Vector3       ; // 3D position in the world
  size       : number        ; // Size of the chunk, default will be 32
  data       : Array<number> ; // The original data
  dataSize   : number        ; // The number of non empty blocks
  rcData     : Array<number> ; // An optimized version of visible only visible data
  rcDataSize : number        ; // The number of visible blocks
  hasRc      : boolean       ; // Define if a chunk has been optimized or not
};