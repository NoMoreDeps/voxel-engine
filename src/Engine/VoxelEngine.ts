/// <reference path="../Core/Types/D3Engine/Babylon.d.ts" />
/// <reference path="../Core/Types/D3Engine/babylon.gui.d.ts" />

import { FreeCameraKeyboardRotateInput } from "../Input/FreeCameraKeyboardRotateInput"  ;
import { VoxelEngineOptions }            from "./Types/VoxelEngineOptions"              ;
import { GameMaterialInfo }              from "./Types/GameMaterialInfo"                ;
import { Chunk }                         from "../Geometry/Terrain/Chunk/Types/Chunk"   ;
import { IntGameMaterialInfo }           from "./Types/IntGameMaterialInfo"             ;
import { Region }                        from "../Geometry/Terrain/Region/Types/Region" ;
import * as ArrayHelper                  from "../Core/Math/Array";
import { Side } from "../Geometry/Terrain/Block/Types/Sides";

export class VoxelEngine {
  private _options : VoxelEngineOptions      ;
  private _canvas !: HTMLCanvasElement       ;
  private _engine !: BABYLON.Engine          ;
  private _scene  !: BABYLON.Scene           ;
  private _camera !: BABYLON.UniversalCamera ;

  private region: Region = { chunks: { }};
  private lastPosition: BABYLON.Vector3 = new BABYLON.Vector3(0,0,0);

  sps!: BABYLON.SolidParticleSystem

  // Assets
  private _gameMaterialRepo: { [key: string] : GameMaterialInfo } = {};

  constructor(options: VoxelEngineOptions) {
    this._options = {
      ...options
    };
  }

  evtChunkIsNeeded!: (position:{x: number, y: number, z: number}) => Chunk | undefined;


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

    //const light = new BABYLON.HemisphericLight("", new BABYLON.Vector3(0,5,0), this._scene);
    //light.intensityMode = BABYLON.Light.LIGHTTYPEID_HEMISPHERICLIGHT
    //light.intensity = .3;

    // Global light
    this._scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    
    // Sky backrgound color
    this._scene.clearColor = BABYLON.Color4.FromColor3(new BABYLON.Color3(135/255,206/255,250/255));

    // Creates the main camera as a first person shooter
    this._camera = new BABYLON.UniversalCamera('MainCharcter', new BABYLON.Vector3(100 ,20 , 100), this._scene);
    
    // Target the camera to scene origin.
    this._camera.setTarget(new BABYLON.Vector3(1, 0, 0));

    // Attach the camera to the canvas.
    this._camera.attachControl(this._canvas, false);

    // Remove the default input
    this._camera.inputs.removeByType("FreeCameraKeyboardMoveInput");

    // Sets the default game keyboard inputs
    const kbInputs = new FreeCameraKeyboardRotateInput(this._camera)
    this._camera.inputs.add(kbInputs);

    this._camera.inertia = 0.;
    this._camera.angularSensibility = 500;
    //this._scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    //this._scene.fogDensity = .01;
    //this._scene.fogColor = BABYLON.Color3.Gray();

    this._scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    this._camera.applyGravity = true;
    this._camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    this._scene.collisionsEnabled = true;
    this._camera.checkCollisions = true;
    (this._camera as any)._needMoveForGravity = true;

   


    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const prvDft = () => void 0;

    const btn = (keycode: number, x: number, y: number, left: boolean = true) => {
      var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "");
      button1.width = "60px"
      button1.height = "60px";
      button1.left = `${x}px`;
      button1.top = `${y}px`;
      button1.cornerRadius = 20;
      button1.thickness = 1;
      button1.horizontalAlignment = left? BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
      button1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

      button1.onPointerDownObservable.add(() => {
        kbInputs.forceKeyDown(keycode, prvDft)
      });

      button1.onPointerOutObservable.add(() => {
        kbInputs.forceKeyUp(keycode, prvDft)
      });

      button1.onPointerUpObservable.add(() => {
        kbInputs.forceKeyUp(keycode, prvDft)
      });

      advancedTexture.addControl(button1);
    }

    btn(65, 20 , -100);
    btn(68, 90, -100);
    btn(87, 55, -170)
    btn(83, 55, -30)


    btn(37, 20 - 180 , -100, false);
    btn(39, 90 - 180, -100, false);
    btn(32, 55 - 180, -170, false)
    btn(16, 55 - 180, -30, false)

    btn(32, 90 - 100 , -170, false);
    btn(40, 90 - 100, -30, false);

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


  first: boolean = true;

  hasBeenInit = true;

  updateGameLoop() {
    const camPos = this._camera.position.clone();
    camPos.x -= 1.5;

    //this._camera.position.y = 10;


    const [region, chunk] = ArrayHelper.getLocalPosition(camPos);
    console.log(region, chunk, camPos)
    if (!this.evtChunkIsNeeded) return;

    if (this.first) {
      this.first = false;
      
      for (let x=0; x <= 5 ;x++) { 
        for (let z=0; z <= 5; z++) { 
          
          if (!this.region.chunks[`${x}-${0}-${z}`]) {
            const newchunk = this.evtChunkIsNeeded(new BABYLON.Vector3(x,0,z))!;
            this.addChunkToScene("default",  newchunk, new BABYLON.Vector3((x) * 32, 0 * 32, (z) * 32))
            this.hasBeenInit && this._scene.selectionOctree.addMesh(this.addChunkToScene("default",  newchunk, new BABYLON.Vector3((x) * 32, 0 * 32, (z) * 32)));
            this.region.chunks[`${x}-${0}-${z}`] = newchunk; 
            this.hasBeenInit && this._scene.updateTransformMatrix()
            this.hasBeenInit && this._scene.createOrUpdateSelectionOctree();

          }

          
        }
      }
      
    } else {
      if (!this.region.chunks[`${region.x}-${region.y}-${region.z}`]) {
        const newchunk = this.evtChunkIsNeeded(region)!;
        this._scene.selectionOctree.addMesh(this.addChunkToScene("default",  newchunk, new BABYLON.Vector3((region.x) * 32, region.y * 32, (region.z) * 32)));
        //this.hasBeenInit && this.addChunkToScene("default",  newchunk, new BABYLON.Vector3((region.x) * 32, region.y * 32, (region.z) * 32))
        this.hasBeenInit && (this.region.chunks[`${region.x}-${region.y}-${region.z}`] = newchunk); 
        this.hasBeenInit && this._scene.updateTransformMatrix()

      this._scene.createOrUpdateSelectionOctree();

      }
    }
    
/* 
    const isBlock = 
      this.region
        .chunks[`${region.x}-${region.y}-${region.z}`]
        .data[ArrayHelper.vector3ToArrayIndex(chunk.x, chunk.y, chunk.z, 32)] !== 0;if (this.region
          .chunks[`${region.x}-${region.y}-${region.z}`]
          .data[ArrayHelper.vector3ToArrayIndex(chunk.x, chunk.y, chunk.z, 32)] !== 0) {
            this._camera.position.y = this._camera.position.y >> 0;
          } else if (this.region
            .chunks[`${region.x}-${region.y}-${region.z}`]
            .data[ArrayHelper.vector3ToArrayIndex(chunk.x, chunk.y - 1, chunk.z, 32)] !== 0) {
            this._camera.position.y = this._camera.position.y >> 0;
            //this._camera.position.y = chunk.y;
          } else {
            this._camera.position.y -= .2;
          }
 */

       

        /* if (this.region
          .chunks[`${region.x}-${region.y}-${region.z}`]
          .data[ArrayHelper.vector3ToArrayIndex(chunk.x, chunk.y, chunk.z, 32)] !== 0) {
            this._camera.position.y = this._camera.position.y >> 0;
          } else if (this.region
            .chunks[`${region.x}-${region.y}-${region.z}`]
            .data[ArrayHelper.vector3ToArrayIndex(chunk.x, chunk.y - 1, chunk.z, 32)] !== 0) {
            this._camera.position.y = this._camera.position.y >> 0;
            //this._camera.position.y = chunk.y;
          } else {
            this._camera.position.y -= .2;
          }
 */
/* 

      if (isBlock) {
        console.log("Collision")
        if (camPos.x >> 0 !== this.lastPosition.x >> 0) {
          //this._camera.position.x = this.lastPosition.x;
         //this._camera.position.y -= .1;
        }

       // if (this._camera.position.y >> 0 !== this.lastPosition.y >> 0) {
         //this._camera.position.y = this.lastPosition.y >> 0;
         // this.lastPosition.y = this.lastPosition.y >> 0;
         this._camera.position.y = chunk.y;
        //}

        if (this._camera.position.z >> 0 !== this.lastPosition.z >> 0) {
         // this._camera.position.z = this.lastPosition.z;
          //this._camera.position.y -= .1;
        }
        
      } else {
        this.lastPosition = this._camera.position.clone();
        //this._camera.position.y -= .1;
      }
 */
      

  }

  gameLoop() {

  }

  globalSPS!: BABYLON.SolidParticleSystem;

  addChunkToScene(materialName: string, chunk: Chunk, position: BABYLON.Vector3) {
    if (!this.globalSPS) {
      this.globalSPS = new BABYLON.SolidParticleSystem("s", this._scene);
    }

    let a = (Math.random() * 100 % 15) >> 0;
    let b = (Math.random() * 100 % 15) >> 0;

    a = 15;
    b = 3;

    /*const block = BABYLON.MeshBuilder.CreateTiledBox("box",  {width: 1, height: 1, depth: 1 , faceUV:[
      this.getTex(3, 15),
      this.getTex(3, 15),
      this.getTex(3, 15),
      this.getTex(3, 15),
      this.getTex(11,14),
      this.getTex(4,11)
    ]}, this._scene);*/

    const blockTop = BABYLON.MeshBuilder.CreatePlane("box", {height: 1, width: 1, frontUVs: this.getTex(11, 14), sideOrientation:  BABYLON.Mesh.DOUBLESIDE}  , this._scene);
    const blockFront = BABYLON.MeshBuilder.CreatePlane("box", {height: 1, width: 1, frontUVs: this.getTex(3, 15), sideOrientation:  BABYLON.Mesh.DOUBLESIDE}  , this._scene);

    const water = BABYLON.MeshBuilder.CreateTiledBox("box",  {width: 1, height: 1, depth: 1 , faceUV:[
      this.getTex(13, 3),
      this.getTex(13, 3),
      this.getTex(13, 3),
      this.getTex(13, 3),
      this.getTex(13, 3),
      this.getTex(13, 3)
    ]}, this._scene);

    const sps = new BABYLON.SolidParticleSystem(performance.now().toString(), this._scene);

    let nextIndex = 0;
    let cptTop = 0;
    let cptFront = 0;
    let cptBack = 0;
    let cptBot = 0;

    for(let rcI=0; rcI < chunk.rcDataSize; rcI++) {
      let [_nextIndex, nextPos] = ArrayHelper.getNextNonZeroValueIndex(chunk.rcData, nextIndex);
      nextIndex = _nextIndex;

      if ( (nextPos & Side.Top) === Side.Top ) {
        cptTop++;
        sps.addShape(blockTop, 1, {positionFunction: (particle: BABYLON.Particle, i: number, s: number) => {
          particle.position = ArrayHelper.arrayIndexToVector3(nextIndex);
          (<any>particle).rotation.x = BABYLON.Angle.FromDegrees(90).radians();
          particle.position.y += .5;
          particle.position.z += 1;
        }});
      }

      if ( (nextPos & Side.Bottom) === Side.Bottom ) {
        cptBot++;
        sps.addShape(blockFront, 1, {positionFunction: (particle: BABYLON.Particle, i: number, s: number) => {
          particle.position = ArrayHelper.arrayIndexToVector3(nextIndex);
          (<any>particle).rotation.x = BABYLON.Angle.FromDegrees(-90).radians();
          particle.position.y -= .5;
          particle.position.z += 1;
        }});
      }

      if ( (nextPos & Side.Forward) === Side.Forward ) {
        cptFront++;
        sps.addShape(blockFront, 1, {positionFunction: (particle: BABYLON.Particle, i: number, s: number) => {
          particle.position = ArrayHelper.arrayIndexToVector3(nextIndex);
          (<any>particle).rotation.y = BABYLON.Angle.FromDegrees(90).radians();
         particle.position.z += 1;
         particle.position.x -= .5;
        }});
      }

     if ( (nextPos & Side.Backward) === Side.Backward ) {
        cptBack++;
        sps.addShape(blockFront, 1, {positionFunction: (particle: BABYLON.Particle, i: number, s: number) => {
          particle.position = ArrayHelper.arrayIndexToVector3(nextIndex);
          (<any>particle).rotation.y = BABYLON.Angle.FromDegrees(-90).radians();
         particle.position.z += 1;
         particle.position.x += .5;
        }});
      }


      if ( (nextPos & Side.Left) === Side.Left ) {
        cptFront++;
        sps.addShape(blockFront, 1, {positionFunction: (particle: BABYLON.Particle, i: number, s: number) => {
          particle.position = ArrayHelper.arrayIndexToVector3(nextIndex);
          (<any>particle).rotation.y = BABYLON.Angle.FromDegrees(180).radians();
         //particle.position.z += 1;
          particle.position.z += 1.5;
        }});
      }

      if ( (nextPos & Side.Right) === Side.Right ) {
        cptFront++;
        sps.addShape(blockFront, 1, {positionFunction: (particle: BABYLON.Particle, i: number, s: number) => {
          particle.position = ArrayHelper.arrayIndexToVector3(nextIndex);
          //(<any>particle).rotation.y = BABYLON.Angle.FromDegrees(180).radians();
         //particle.position.z += 1;
          particle.position.z += .5;
        }});
      }


      
    }

    //console.log("rcSize", chunk.rcDataSize, 'Top faces' , cptTop, 'Bottom faces' , cptBot,'Front faces' , cptFront)
 
    blockTop.dispose();
    blockFront.dispose();

    let waterSize = 0;
    let waterlevel = 6
    ArrayHelper.forX(0, 32, _x => {
      ArrayHelper.forX(0, 32, _z => {
        const level = chunk.rcData[ArrayHelper.vector3ToArrayIndex(_x, waterlevel, _z)];
        if (level === 0) {
          //chunk.rcData[ArrayHelper.vector3ToArrayIndex(_x, waterlevel, _z)] = 1.002;
          //chunk.data[ArrayHelper.vector3ToArrayIndex(_x, waterlevel, _z)] = 1.002;
          waterSize++;

          /*sps.addShape(water, 1, {positionFunction: (particle: BABYLON.Particle, i: number, s: number) => {
            particle.position = new BABYLON.Vector3(_x, waterlevel, _z);
          }});*/
        }
      })
    })

    water.dispose();

    if (!sps.mesh) {
      sps.buildMesh();
    } else {
      //sps.rebuildMesh();
    }
    
    if (!sps.mesh.material) sps.mesh.material = (<IntGameMaterialInfo>this._gameMaterialRepo[materialName]).material;
    //sps.computeBoundingBox = true;
    sps.mesh.position = position;
    sps.mesh.computeWorldMatrix();
    sps.setParticles();

  /* setInterval( () => {
      // Checks if entire block is visible
      let nbVisible = 0;
      let nbhidden = 0;

      sps.mesh.isVisible = sps.mesh.isInFrustum(this._scene.frustumPlanes);
      
      if (sps.mesh.isVisible) {
        let pos = sps.mesh.position;
        let posc = this._camera.position;
        let vd = 32 * 5;
        if ( Math.abs(pos.x - posc.x) > vd || Math.abs(pos.y - posc.y) > vd || Math.abs(pos.z - posc.z) > vd) {
          sps.mesh.isVisible = false;
        }
      }

      //console.log("sps.mesh.isVisible", sps.mesh.isVisible)
    }, 100)  */
    sps.mesh.freezeNormals();
    sps.mesh.freezeWorldMatrix();
 

    /*const res = sps.mesh.clone();
    sps.dispose();*/

    sps.mesh.checkCollisions = true;
    return sps.mesh;

  }

  start() {

    let fps = 0;

    const div = document.createElement("div");
    div.style.position        = "absolute" ;
    div.style.width           = "25px"     ;
    div.style.height          = "25px"     ;
    div.style.top             = "0px"      ;
    div.style.left            = "0px"      ;
    div.style.backgroundColor = "white"    ;
    div.style.textAlign       = "center"   ;
    div.style.lineHeight      = "25px"     ;
    div.style.zIndex          = "9999"     ;
    document.body.appendChild(div);

    this._scene.createOrUpdateSelectionOctree(8,1);


    /*setTimeout(() => {
      this.globalSPS.buildMesh();
      this.globalSPS.mesh.material = (<IntGameMaterialInfo>this._gameMaterialRepo["default"]).material;
      this.globalSPS.setParticles();
      this.globalSPS.mesh.computeWorldMatrix();
      this.hasBeenInit = true;
    }, 10000);*/
      this.hasBeenInit = true;

    // Run the render loop.
    this._engine.runRenderLoop(() => {
      this.updateGameLoop();
      //this.gameLoop();
      this._scene.createOrUpdateSelectionOctree();
      //this._scene.meshes.forEach(e => e.isVisible = e.isInFrustum(this._scene.frustumPlanes))
      this._scene.render();
      fps++;
    });

    (window as any).game = this;

    setInterval(() => (div.innerText = fps.toString(), fps = 0 ), 1000 )

    // The canvas/window resize event handler.
    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }
}