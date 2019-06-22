import { FreeCameraKeyboardRotateInput } from "../Input/FreeCameraKeyboardRotateInput";

export type VoxelEngineOptions = {
  canvasElement: string;
}

export class VoxelEngine {
  private _options: VoxelEngineOptions;

  private _canvas!: HTMLCanvasElement;
  private _engine!: BABYLON.Engine;
  private _scene!: BABYLON.Scene;
  private _camera!: BABYLON.UniversalCamera;

  constructor(options: VoxelEngineOptions) {
    this._options = {
      ...options
    };
  }

  initialize() {
    if (this._engine) {
      console.info(`Engine already started`);
      return;
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
  }
}