import { Chunk } from "../../../../Geometry/Terrain/Chunk/Types/Chunk";
import { SimplexNoise } from "../Terrain/SimplexNoise";
import { fillArrayWithEmptiness, vector2ToArrayIndex, forX, vector3ToArrayIndex, arrayIndexToVector3 } from "../../../../Core/Math/Array";
import { Side } from "../../../../Geometry/Terrain/Block/Types/Sides";

export class ChunkBuilder {
  static create(size: number = 32) : Chunk {
    const chunk = {
      data   : [] ,
      dataSize: 0,
      rcData : [] ,
      rcDataSize: 0,
      size   : size
    } as Chunk;

    fillArrayWithEmptiness(chunk.data, size * size * size);

    return chunk;
  }

  static createSimplexNoiseMap(width: number, depth: number, height: number = 32, scale: number = 0.015, octaves: number = 4, persistence: number = 2, seed: number = 1) {
    const simplexInstance = new SimplexNoise();
    simplexInstance.init();
    simplexInstance.noiseDetail(45, .34567);
    const array2D = new Array<number>();
    fillArrayWithEmptiness(array2D, width * depth);

    let tab = [];

    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        array2D[vector2ToArrayIndex(x, z, width)] = (simplexInstance.noise(x * scale, z * scale) * height / 1.34) >> 0;
      }
      tab.length = 0;
    }

    return array2D;
  }

  static inflateSimplexNoiseMapToChunk(simplexMap: Array<number>, x: number, y: number, z: number, size: number = 32) {
    const chunk = ChunkBuilder.create(size);
    debugger
    forX(x * size, x * size + size, (_x) => {
      forX(z * size, z * size + size, (_z) => {
        let __y = simplexMap[vector2ToArrayIndex(_x, _z, Math.sqrt(simplexMap.length))] - (y * size);
        if (__y < 0) {
          __y = 0
        }
        forX(y, __y , (_y) => {
          chunk.data[vector3ToArrayIndex(_x % 32, _y % 32, _z % 32, size)] = 1;
          chunk.dataSize ++;
        })
      });
    });

    [chunk.rcData, chunk.rcDataSize] = ChunkBuilder.simplifyMatrix3D(chunk.data);

    return chunk;
  }

  static simplifyMatrix3D(data: Array<number>): [Array<number>, number] {
    let dataSize = 0;
    const newData = new Array<number>();
    const size = Math.cbrt(data.length);

    const shouldRemove = (tab: Array<number>, x: number, y: number, z:number): boolean => {
      const isValidPosition =  
          x < 0     ? false 
        : x >= size ? false
        : y < 0     ? false
        : y >= size ? false
        : z < 0     ? false
        : z >= size ? false
        : true;   

      if (!isValidPosition) return false;
      
      return tab[vector3ToArrayIndex(x, y, z, size)] !== 0;
    }
    
    data.forEach( (cell, idx) => {
      let _idx = newData.push(cell) - 1;
      if (cell === 0) return;

      let _cell = 63;
      const pos = arrayIndexToVector3(idx, size);

      shouldRemove(data, pos.x + 1, pos.y, pos.z) && (_cell -= Side.Backward);
      shouldRemove(data, pos.x - 1, pos.y, pos.z) && (_cell -= Side.Forward);
      shouldRemove(data, pos.x, pos.y + 1, pos.z) && (_cell -= Side.Top);
      shouldRemove(data, pos.x, pos.y - 1, pos.z) && (_cell -= Side.Bottom);
      shouldRemove(data, pos.x, pos.y, pos.z - 1) && (_cell -= Side.Right);
      shouldRemove(data, pos.x, pos.y, pos.z + 1) && (_cell -= Side.Left);

      newData[_idx] = _cell;      
      _cell !== 0 && dataSize++;

      if (pos.y === 0) newData[_idx] = 0;
    });

    return [newData, dataSize];
  }
}