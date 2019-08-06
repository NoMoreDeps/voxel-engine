import { Chunk } from "../../Chunk/Types/Chunk";

export type Region = {
  chunks: {
    [keyPosition: string] : Chunk;
  }
}