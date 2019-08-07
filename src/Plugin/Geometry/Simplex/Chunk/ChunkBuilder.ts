import { Chunk } from "../../../../Geometry/Terrain/Chunk/Types/Chunk";
import { SimplexNoise } from "../Terrain/SimplexNoise";
import { fillArrayWithEmptiness, vector2ToArrayIndex, forX, vector3ToArrayIndex, arrayIndexToVector3 } from "../../../../Core/Math/Array";
import { Side } from "../../../../Geometry/Terrain/Block/Types/Sides";
import { Vector3 } from "../../../../Core/Types/Geometry/Vector3";

export class ChunkBuilder {

  private _store: { [key: string]: Chunk }
  private _simplexMap: Array<number>;

  constructor(private _chunkSize: number = 32, private _mapWidth: number = 1, private _mapDepth: number = 1, private _mapHeight: number = 1) {
    this._store = {};
    this._simplexMap = new Array<number>();
  }

  getChunkAt(position: Vector3, withrcData: boolean = false) {
    const flatPos = `${position.x}-${position.y}-${position.z}`;

    if (flatPos in this._store && ( (withrcData === true && this._store[flatPos].hasRc === true) || !withrcData ) ) {
      return this._store[flatPos];
    }

    this._store[flatPos] = this.inflateSimplexNoiseMapToChunk(position);
    withrcData === true && this._simplifyChunk(position);
    
    return this._store[flatPos];
  }

  protected createChunk(): Chunk {
    return ChunkBuilder.create(this._chunkSize);
  }

  static create(size: number = 32) : Chunk {
    const chunk = {
      position    : new BABYLON.Vector3(0,0,0)  ,
      data        : []                          ,
      dataSize    : 0                           ,
      rcData      : []                          ,
      rcDataSize  : 0                           ,
      size        : size                        ,
      hasRc       : false
    } as Chunk;

    fillArrayWithEmptiness(chunk.data, size * size * size);

    return chunk;
  }

  initializeSimplexNoiseMap(width?: number, depth?: number, height?: number, scale: number = 0.015, octaves: number = 4, persistence: number = 2, seed: number = 1) {
    this._simplexMap = ChunkBuilder.createSimplexNoiseMap(
      width  || this._mapWidth  * this._chunkSize, 
      depth  || this._mapDepth  * this._chunkSize, 
      height || this._mapHeight * this._chunkSize
      , scale, octaves, persistence, seed);
  }

  static createSimplexNoiseMap(width: number, depth: number, height: number = 32, scale: number = 0.015, octaves: number = 4, persistence: number = 2, seed: number = 1) {
    const simplexInstance = new SimplexNoise();
    simplexInstance.init();
    simplexInstance.noiseDetail(55, .34567);
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

  inflateSimplexNoiseMapToChunk(position: Vector3) {
    const size = this._chunkSize;
    const chunk = ChunkBuilder.create(size);
    const {x, y, z} = {...position};
    
    forX(x * size, x * size + size, (_x) => {
      forX(z * size, z * size + size, (_z) => {
        let __y = this._simplexMap[vector2ToArrayIndex(_x, _z, Math.sqrt(this._simplexMap.length))] - (y * size);
        if (__y < 0) {
          __y = 0
        }
        forX(y, __y , (_y) => {
          chunk.data[vector3ToArrayIndex(_x % 32, _y % 32, _z % 32, size)] = 1;
          chunk.dataSize ++;
        })
      });
    });

    return chunk;
  }

  _simplifyChunk(position: Vector3): void {
    const chunk = this.getChunkAt(position, false);
    if (chunk.hasRc) return;
    
    let dataSize = 0;
    const newData = new Array<number>();
    const size = Math.cbrt(chunk.data.length);

    const shouldRemove = (chunk: Chunk, x: number, y: number, z:number): boolean => {
      const newPos = {
        x: position.x,
        y: position.y,
        z: position.z,
      };

      // Checks for adjacent chunk
      if (x < 0) {
        newPos.x--;
        if (newPos.x < 0) return true;
        //return shouldRemove(this.getChunkAt(newPos, false), this._chunkSize, y, z);  
        return shouldRemove(this.getChunkAt(newPos, false), this._chunkSize - 1, y, z);  
      }

      if (x >= size) {
        newPos.x++;
        if (newPos.x > this._mapWidth) return true;
        // return shouldRemove(this.getChunkAt(newPos, false), 0, y, z);  
        return shouldRemove(this.getChunkAt(newPos, false), 0, y, z);  
      }

      if (y < 0) {
        newPos.y--;
        if (newPos.y < 0) return true;
        //return shouldRemove(this.getChunkAt(newPos, false), x, this._chunkSize, z);
        return shouldRemove(this.getChunkAt(newPos, false), x, this._chunkSize - 1, z);
      }

      if (y >= size) {
        newPos.y++;
        if (newPos.y > this._mapWidth) return true;
        //return shouldRemove(this.getChunkAt(newPos, false), x, 0, z);
        return shouldRemove(this.getChunkAt(newPos, false), x, 0 - 1, z);
      }

      if (z < 0) {
        newPos.z--;
        if (newPos.z < 0) return false;
        //return shouldRemove(this.getChunkAt(newPos, false), x, y, this._chunkSize);
        return shouldRemove(this.getChunkAt(newPos, false), x, y, this._chunkSize - 1);
      }

      if (z >= size) {
        newPos.z++;
        if (newPos.z < 0) return true;
       //return shouldRemove(this.getChunkAt(newPos, false), x, y, 0);
        return shouldRemove(this.getChunkAt(newPos, false), x, y, 0);
      }
      
      return chunk.data[vector3ToArrayIndex(x, y, z, size)] !== 0;
    }
    
    chunk.data.forEach( (cell, idx) => {
      let _idx = newData.push(cell) - 1;
      if (cell === 0) return;

      let _cell = Side.All;
      const pos = arrayIndexToVector3(idx, size);

      shouldRemove(chunk, pos.x + 1, pos.y, pos.z) && (_cell -= Side.Backward);
      shouldRemove(chunk, pos.x - 1, pos.y, pos.z) && (_cell -= Side.Forward);
      shouldRemove(chunk, pos.x, pos.y + 1, pos.z) && (_cell -= Side.Top);
      shouldRemove(chunk, pos.x, pos.y - 1, pos.z) && (_cell -= Side.Bottom);
      shouldRemove(chunk, pos.x, pos.y, pos.z - 1) && (_cell -= Side.Right);
      shouldRemove(chunk, pos.x, pos.y, pos.z + 1) && (_cell -= Side.Left);

      newData[_idx] = _cell;      
      _cell !== 0 && dataSize++;

      if (pos.y === 0) newData[_idx] = 0;
    });

    [chunk.rcData, chunk.rcDataSize] = [newData, dataSize];
    chunk.hasRc = true;
  }

  simplifyChunk(position: Vector3): void {
    const chunk = this.getChunkAt(position, false);
    if (chunk.hasRc) return;
    
    let dataSize = 0;
    const newData = new Array<number>();
    const size = Math.cbrt(chunk.data.length);

    const shouldRemove = (chunk: Chunk, x: number, y: number, z:number): boolean => {
      const newPos = {
        x: position.x,
        y: position.y,
        z: position.z,
      };

      // Checks for adjacent chunk
      if (x < 0) {
        return true;
      }

      if (x >= size) {
        return true;

      }

      if (y < 0) {
        return true;

      }

      if (y >= size) {
        return true;

      }

      if (z < 0) {
        return true;

      }

      if (z >= size) {
        return true;

      }
      
      return chunk.data[vector3ToArrayIndex(x, y, z, size)] !== 0;
    }
    
    chunk.data.forEach( (cell, idx) => {
      let _idx = newData.push(cell) - 1;
      if (cell === 0) return;

      let _cell = Side.All;
      const pos = arrayIndexToVector3(idx, size);

      shouldRemove(chunk, pos.x + 1, pos.y, pos.z) && (_cell -= Side.Backward);
      shouldRemove(chunk, pos.x - 1, pos.y, pos.z) && (_cell -= Side.Forward);
      shouldRemove(chunk, pos.x, pos.y + 1, pos.z) && (_cell -= Side.Top);
      shouldRemove(chunk, pos.x, pos.y - 1, pos.z) && (_cell -= Side.Bottom);
      shouldRemove(chunk, pos.x, pos.y, pos.z - 1) && (_cell -= Side.Right);
      shouldRemove(chunk, pos.x, pos.y, pos.z + 1) && (_cell -= Side.Left);

      newData[_idx] = _cell;      
      _cell !== 0 && dataSize++;

      if (pos.y === 0) newData[_idx] = 0;
    });

    [chunk.rcData, chunk.rcDataSize] = [newData, dataSize];
    chunk.hasRc = true;
  }
}