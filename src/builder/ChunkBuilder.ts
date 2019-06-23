import { Chunk } from "../format/Chunk";
import { fillArrayWithEmptiness, vector3ToArrayIndex } from "../core/Math";

export class ChunkBuilder {

  static create(size: number = 32) : Chunk {
    const chunk = {
      data   : [] ,
      rcData : [] ,
      size   : size
    } as Chunk;

    return chunk;
  }

  static fillSimple(chunk: Chunk) {
    fillArrayWithEmptiness(chunk.data);
    fillArrayWithEmptiness(chunk.rcData);
    
    for (let x=0; x < chunk.size; x++) {
      for (let z=0; z < chunk.size; z++) {
        chunk.data[vector3ToArrayIndex(x, 0, z)] = 1;
      }
    }
  }
}