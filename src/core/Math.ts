export function vector3ToArrayIndex(x: number, y: number, z: number, size: number = 32) {
  return (size * size * x) + (size * y) + z;
}

export function arrayIndexToVector3(index: number, size: number = 32) {
  return new BABYLON.Vector3(
    (index / (size * size)) >> 0,
    ((index / size) % size) >> 0,
    (index % size) >> 0
  );
}

export function fillArrayWithEmptiness(data: Array<number>, size: number = 32 * 32 * 32) {
  data.length = 0;
  for (let i = 0; i < size; i++) {
    data.push(0);
  }
}

export function getNextNonZeroValueIndex(array: Array<number>, startPosition: number) {
  for(let i = startPosition + 1; i < array.length; i++) {
    if (array[i] !== 0) {
      return i;
    }
  }

  return -1;
}