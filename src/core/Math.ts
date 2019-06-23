export function vector3ToArrayIndex(x: number, y: number, z: number, size: number = 32) {
  return x + y * size + z * size * size;
}

export function arrayIndexToVector3(index: number, size: number = 32) {
  const z = index / (size * size);
  index -= (z * size * size);

  const y = index / size;
  const x = index % size;

  return new BABYLON.Vector3(x, y, z);
}

export function fillArrayWithEmptiness(data: Array<number>, size: number = 32 * 32 * 32) {
  data.length = 0;
  for (let i = 0; i < size; i++) {
    data.push(0);
  }
}