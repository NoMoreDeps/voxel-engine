import { Chunk } from "./Chunk";

export type region = {
  chunks: {
    [keyPosition: string] : Chunk;
  }
}