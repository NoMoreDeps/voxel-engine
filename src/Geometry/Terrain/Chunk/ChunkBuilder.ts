import { Chunk } from "./Types/Chunk";
import { fillArrayWithEmptiness, vector3ToArrayIndex, arrayIndexToVector3 } from "../../../Core/Math/Array";

export class ChunkBuilder {

  static create(size: number = 32) : Chunk {
    const chunk = {
      data   : [] ,
      dataSize: 0,
      rcData : [] ,
      rcDataSize: 0,
      size   : size
    } as Chunk;

    return chunk;
  }

  static fillSimple(chunk: Chunk) {
    fillArrayWithEmptiness(chunk.data);
    fillArrayWithEmptiness(chunk.rcData);
    
    for (let y = 0; y < ((chunk.size / 2)) + 1 >> 0; y++) {
      for (let x = 0; x < chunk.size; x++) {
        for (let z = 0; z < chunk.size; z++) {

          var init = vector3ToArrayIndex(x,y,z);
          var dec = arrayIndexToVector3(init);

          

          if (x >= (0 + y) && x <= (chunk.size - y - 1)) {
            if (z === (0 + y) || z === (chunk.size - y - 1)) {
              if (chunk.data[vector3ToArrayIndex(x, y, z)] === 0) {
                chunk.data[vector3ToArrayIndex(x, y, z)] = 1;
                chunk.dataSize++;
               
              }
            }
          }

          if (z >= (0 + y) && z <= (chunk.size - y - 1)) {
            if (x === (0 + y) || x === (chunk.size - y - 1)) {
              if (chunk.data[vector3ToArrayIndex(x, y, z)] === 0) {
                chunk.data[vector3ToArrayIndex(x, y, z)] = 1;
                chunk.dataSize++;
               
              }
            }
          }
        }
      }
    }
  }
}