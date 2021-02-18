import { VoxelEngine } from "../../../Engine/VoxelEngine";
import { ChunkBuilder } from "../../../Plugin/Geometry/Simplex/Chunk/ChunkBuilder";

async function game() {
  const engine = new VoxelEngine({ canvasElement: "app" });
  engine.initialize().start();
  const e = await (await fetch("assets/conf/default/material-info.json")).json(),
  t = await (await fetch("assets/conf/default/blocks-mapping.json")).json(),
  i = await (await fetch("assets/conf/default/blocks-definition.json")).json();
  engine.loadMaterial(Object.assign({}, e, i, t));
  const simplexMap = new ChunkBuilder(32, 20, 20, 1);
  simplexMap.initializeSimplexNoiseMap();
  (engine.evtChunkIsNeeded = (e) => simplexMap.getChunkAt(e, !0));
}

game();
