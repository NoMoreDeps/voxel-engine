/**
 * Convert a vector 3 coordinate to a flat array index
 * @param x {number} The x coordinate
 * @param y {number} The y coordinate
 * @param z {number} The z coordinate
 * @param size {number} The size of each dimension, the size is the same for each one
 */
export function vector3ToArrayIndex(x: number, y: number, z: number, size: number = 32) {
  return (size * size * x) + (size * y) + z;
}

/**
 * Convert a flat array index to a 3D coordinate representation
 * @param index {number} The array index
 * @param size {number} The size of x,y,z dimension
 */
export function arrayIndexToVector3(index: number, size: number = 32) {
  return new BABYLON.Vector3(
    (index / (size * size)) >> 0,
    ((index / size) % size) >> 0,
    (index % size) >> 0
  );
}

export function vector2ToArrayIndex(x: number, y: number, size: number = 32) {
  return (size * x) + y;
}

export function arrayIndexToVector2(index: number, size: number = 32) {
  return new BABYLON.Vector2(
    (index / size) >> 0,
    (index % size) >> 0
  );
}

export function fillArrayWithEmptiness(data: Array<number>, size: number = 32 * 32 * 32) {
  data.length = 0;
  for (let i = 0; i < size; i++) {
    data.push(0);
  }
}

export function getNextNonZeroValueIndex(array: Array<number>, startPosition: number): [number, number] {
  for(let i = startPosition + 1; i < array.length; i++) {
    if (array[i] !== 0) {
      return [i, array[i]];
    }
  }

  return [-1, -1];
}

export function forX(start: number, end: number, handler: (index: number) => void, step: number = 1) {
  for (let i = start; i < end; i += step) {
    handler(i);
  }
} 

export function getLocalPosition(worldPosition: BABYLON.Vector3) : [BABYLON.Vector3, BABYLON.Vector3] {
  const chunkX  = worldPosition.x % 32;
  const regionX = (worldPosition.x - chunkX) / 32;

  const chunkY = worldPosition.y % 32;
  const regionY = (worldPosition.y - chunkY) / 32;
  
  const chunkZ = worldPosition.z % 32;
  const regionZ = (worldPosition.z - chunkZ) / 32;

  return [
    new BABYLON.Vector3(
      regionX , 
      regionY , 
      regionZ)
    ,
    new BABYLON.Vector3(
      chunkX >> 0 , 
      chunkY >> 0, 
      chunkZ >> 0)
  ]
}
