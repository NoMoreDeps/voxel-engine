import { Chunk } from "./Chunk";

export type Region = {
  chunks: {
    [keyPosition: string] : Chunk;
  }
}