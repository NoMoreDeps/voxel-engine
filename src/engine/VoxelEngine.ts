/// <reference path="../@types/babylon.d.ts" />

import { FreeCameraKeyboardRotateInput } from "../input/FreeCameraKeyboardRotateInput" ;
import { VoxelEngineOptions }            from "./types/VoxelEngineOptions"             ;
import { GameMaterialInfo }              from "./types/GameMaterialInfo"               ;
import { IntGameMaterialInfo }           from "./types/IntGameMaterialInfo"            ;
import { Chunk } from "../format/Chunk";
import { vector3ToArrayIndex } from "../core/Math";

export class VoxelEngine {
  private _options : VoxelEngineOptions      ;
  private _canvas !: HTMLCanvasElement       ;
  private _engine !: BABYLON.Engine          ;
  private _scene  !: BABYLON.Scene           ;
  private _camera !: BABYLON.UniversalCamera ;

  // Assets
  private _gameMaterialRepo: { [key: string] : GameMaterialInfo } = {};

  constructor(options: VoxelEngineOptions) {
    this._options = {
      ...options
    };
  }

  initialize() : this {
    if (this._engine) {
      console.info(`Engine already started`);
      return this;
    }

    // Create canvas
    this._canvas = document.getElementById(this._options.canvasElement) as HTMLCanvasElement;
    
    // Initialize the engine
    this._engine = new BABYLON.Engine(this._canvas, true);

    // Create the empty scene with default options
    this._scene = new BABYLON.Scene(this._engine);

    // Prevent material to be updated
    this._scene.blockMaterialDirtyMechanism = true;

    // Global light
    this._scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    
    // Sky backrgound color
    this._scene.clearColor = BABYLON.Color4.FromColor3(new BABYLON.Color3(135/255,206/255,250/255));

    // Creates the main camera as a first person shooter
    this._camera = new BABYLON.UniversalCamera('MainCharcter', new BABYLON.Vector3(33, 3, 33), this._scene);
    
    // Target the camera to scene origin.
    this._camera.setTarget(new BABYLON.Vector3(0, 1, 0));

    // Attach the camera to the canvas.
    this._camera.attachControl(this._canvas, false);

    // Remove the default input
    this._camera.inputs.removeByType("FreeCameraKeyboardMoveInput");

    // Sets the default game keyboard inputs
    this._camera.inputs.add(new FreeCameraKeyboardRotateInput(this._camera));

    return this;
  }

  loadMaterial(materialInfo: GameMaterialInfo) {
    this._gameMaterialRepo[materialInfo.name] = materialInfo;
    this.processMaterial(materialInfo.name);
  }

  private processMaterial(name: string) {
    const matinfo    = <IntGameMaterialInfo> this._gameMaterialRepo[name];
    matinfo.texture  = new BABYLON.Texture(matinfo.texturePath, this._scene);
    matinfo.material = new BABYLON.StandardMaterial(matinfo.name, this._scene);
    
    matinfo.material.ambientTexture = matinfo.texture;
    matinfo.material.ambientColor = BABYLON.Color3.White();
    matinfo.material.ambientTexture.level = 1.2;
  }

  addChunkToScene(chunk: Chunk, position: BABYLON.Vector3) {
    const block = BABYLON.MeshBuilder.CreateBox("box", { size: 1});
    block.material = (<IntGameMaterialInfo>this._gameMaterialRepo["default"]).material;
    block.material.wireframe = true;

    const sps = new BABYLON.SolidParticleSystem(`${position.x}-${position.y}-${position.z}`, this._scene);

    let idx = 0;

    for(let x=0; x<chunk.size; x++) {
      for(let y=0; y<chunk.size; y++) {
        for(let z=0; z<chunk.size; z++) {
          if (chunk.data[vector3ToArrayIndex(x, y , z)] !== 0) {
            sps.addShape(block, 1);
            sps.particles[idx].position = new BABYLON.Vector3(x, y, z);         
            idx++
          }
        }
      }
    }

    sps.buildMesh();

    sps.setParticles();

    sps.mesh.computeWorldMatrix();
    sps.isAlwaysVisible = true;
  }

  start() {
    // Run the render loop.
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    // The canvas/window resize event handler.
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }
}