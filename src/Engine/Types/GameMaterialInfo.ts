import { Block }                from "../../Geometry/Terrain/Block/Types/Block"     ;
import { Texture2BlockMapping } from "./Texture2BlockMapping" ;

export type GameMaterialInfo = {
  name        : string               ;
  texturePath : string               ;
  size        : number               ;
  mapper      : Texture2BlockMapping ;
  blocks      : Array<Block>         ;
};
