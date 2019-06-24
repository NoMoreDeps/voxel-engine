/// <reference path="../@types/babylon.d.ts" />

import { FreeCameraKeyboardRotateInput } from "../input/FreeCameraKeyboardRotateInput" ;
import { VoxelEngineOptions }            from "./types/VoxelEngineOptions"             ;
import { GameMaterialInfo }              from "./types/GameMaterialInfo"               ;
import { IntGameMaterialInfo }           from "./types/IntGameMaterialInfo"            ;
import { Chunk } from "../format/Chunk";
import { vector3ToArrayIndex, arrayIndexToVector3, getNextNonZeroValueIndex } from "../core/Math";

export class VoxelEngine {
  private _options : VoxelEngineOptions      ;
  private _canvas !: HTMLCanvasElement       ;
  private _engine !: BABYLON.Engine          ;
  private _scene  !: BABYLON.Scene           ;
  private _camera !: BABYLON.UniversalCamera ;

  sps!: BABYLON.SolidParticleSystem

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
    this._camera = new BABYLON.UniversalCamera('MainCharcter', new BABYLON.Vector3(0, 2, 0), this._scene);
    
    // Target the camera to scene origin.
    this._camera.setTarget(new BABYLON.Vector3(5, 2, 5));

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
    matinfo.texture  = new BABYLON.Texture(matinfo.texturePath, this._scene, undefined, undefined, 1);
    matinfo.material = new BABYLON.StandardMaterial(matinfo.name, this._scene);
    matinfo.texture.hasAlpha = true;

    matinfo.material.diffuseTexture = matinfo.texture;
    matinfo.material.ambientColor = BABYLON.Color3.White();
    matinfo.material.diffuseTexture.level = 4;

    matinfo.sps = new BABYLON.SolidParticleSystem(name, this._scene);
  }

  getTex(x: number, y: number) {
    const unit = 1/16;
    const texelAdjut = 1/512;
    return new BABYLON.Vector4(unit * x + texelAdjut, unit * y + texelAdjut, unit * x + unit - texelAdjut, unit * y + unit - texelAdjut);
  }


  addChunkToScene(materialName: string, chunk: Chunk, position: BABYLON.Vector3) {

    let a = (Math.random() * 100 % 15) >> 0;
    let b = (Math.random() * 100 % 15) >> 0;

    a = 15;
    b = 3;

    const block = BABYLON.MeshBuilder.CreateTiledBox("box",  {width: 1, height: 1, depth: 1 , faceUV:[
      this.getTex(3, 15),
      this.getTex(3, 15),
      this.getTex(3, 15),
      this.getTex(3, 15),
      this.getTex(11,14),
      this.getTex(4,11)
    ]}, this._scene);

    const sps = new BABYLON.SolidParticleSystem(performance.now().toString(), this._scene, {updatable: true});

    let nextIndex = 0;

    sps.addShape(block, chunk.dataSize, {positionFunction: (particle: BABYLON.Particle, i: number, s: number) => {
      nextIndex = getNextNonZeroValueIndex(chunk.data, nextIndex);
      particle.position = arrayIndexToVector3(nextIndex);
    }});
 
    block.dispose();

    sps.buildMesh();
    sps.mesh.material = (<IntGameMaterialInfo>this._gameMaterialRepo[materialName]).material;

    sps.mesh.position = position;
  }

  start() {

    let fps = 0;

    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = "25px";
    div.style.height = "25px";
    div.style.top = "0px";
    div.style.left = "0px";
    div.style.backgroundColor = "white";
    div.style.textAlign = "center";
    div.style.lineHeight = "25px";
    div.style.zIndex = "9999";
    document.body.appendChild(div)

    // Run the render loop.
    this._engine.runRenderLoop(() => {
      this._scene.render();
      fps++;
    });

    setInterval(() => (div.innerText = fps.toString(), fps = 0 ), 1000 )

    // The canvas/window resize event handler.
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }
}