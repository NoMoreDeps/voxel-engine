import { SubBlock } from "./SubBlock";
import { SubStructure } from "./SubStructure";

export type Structure = {
  guid: string;
  content: Array<SubBlock | SubStructure>;
};