import { GameMaterialInfo } from "./GameMaterialInfo";

export type IntGameMaterialInfo = GameMaterialInfo & {
  material : BABYLON.StandardMaterial ;
  texture  : BABYLON.Texture          ;
};
