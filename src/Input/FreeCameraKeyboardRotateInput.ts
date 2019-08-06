
type KeyEvent = (evt: { keyCode: any; preventDefault: () => void; }) => void

enum KeyboardAction {
  KeyLeft      = "KeyLeft"      ,
  KeyRight     = "KeyRight"     ,
  KeyForward   = "KeyForward"   ,
  KeyBackward  = "KeyBackward"  ,
  KeyMoveUp    = "KeyMoveUp"    ,
  KeyMoveDown  = "KeyMoveDown"  ,
  KeyTurnLeft  = "KeyTurnLeft"  ,
  KeyTurnRight = "KeyTurnRight" ,
  KeyUp        = "KeyUp"        ,
  KeyDown      = "KeyDown"
}


export class FreeCameraKeyboardRotateInput implements BABYLON.ICameraInput<BABYLON.FreeCamera> {
  camera: BABYLON.Nullable<BABYLON.FreeCamera>;  
  private _noPreventDefault: boolean = false;

  private _keys: number[]  = []    ; // KEYS TO PROCESS               
  private _keysLeft        = [65]  ; // MOVE LEFT    
  private _keysRight       = [68]  ; // MOVE RIGHT   
  private _keysForward     = [87]  ; // MOVE FORWARD 
  private _keysBackward    = [83]  ; // MOVE BACKWARD
  private _keysMoveUp      = [32]  ; // MOVE UP      
  private _keysMoveDown    = [16]  ; // MOVE DOWN    
  private _keysTurnLeft    = [39]  ; // TURN LEFT    
  private _keysTurnRight   = [37]  ; // TURN RIGHT   
  private _keysUp          = [38]  ; // TURN UP      
  private _keysDown        = [40]  ; // TURN DOWN    
  private _sensibility     = 0.005 ; // SENSITIVITY
  private _movementSpeed   = 0.50  ; // MOVEMENT SPEED       
  
  /**
   * Maps a key from the keyboard to the camera
   * @param keycode The keyboard event key code
   * @param action The Action to set the key to
   */
  setKeycode(keycode: number, action: KeyboardAction) {
    switch(action) {
      case KeyboardAction.KeyLeft:
        this._keysLeft.length = 0;
        this._keysLeft.push(keycode);  
      break;
      
      case KeyboardAction.KeyRight:
        this._keysRight.length = 0;
        this._keysRight.push(keycode);  
      break;

      case KeyboardAction.KeyForward:
        this._keysForward.length = 0;
        this._keysForward.push(keycode);  
      break;

      case KeyboardAction.KeyBackward:
        this._keysBackward .length = 0;
        this._keysBackward .push(keycode);  
      break;

      case KeyboardAction.KeyMoveUp:
        this._keysMoveUp.length = 0;
        this._keysMoveUp.push(keycode);  
      break;

      case KeyboardAction.KeyMoveDown:
        this._keysMoveDown.length = 0;
        this._keysMoveDown.push(keycode);  
      break;

      case KeyboardAction.KeyTurnLeft:
        this._keysTurnLeft.length = 0;
        this._keysTurnLeft.push(keycode);  
      break;

      case KeyboardAction.KeyTurnRight:
        this._keysTurnRight.length = 0;
        this._keysTurnRight.push(keycode);  
      break;

      case KeyboardAction.KeyUp:
        this._keysUp.length = 0;
        this._keysUp.push(keycode);  
      break;

      case KeyboardAction.KeyDown:
        this._keysDown.length = 0;
        this._keysDown.push(keycode);  
      break;
    }
  }

  public forceKeyUp(keyCode: number, preventDefault: () => void) {
    this._onKeyUp({keyCode, preventDefault})
  }

  public forceKeyDown(keyCode: number, preventDefault: () => void) {
    this._onKeyDown({keyCode, preventDefault})
  }


  private _onKeyDown:KeyEvent = (evt: { keyCode: number; preventDefault: () => void; }) => {
    if (
      this._keysLeft.indexOf(evt.keyCode)      !== -1 ||
      this._keysRight.indexOf(evt.keyCode)     !== -1 ||
      this._keysForward.indexOf(evt.keyCode)   !== -1 ||
      this._keysBackward.indexOf(evt.keyCode)  !== -1 ||
      this._keysMoveUp.indexOf(evt.keyCode)    !== -1 ||
      this._keysMoveDown.indexOf(evt.keyCode)  !== -1 ||
      this._keysTurnLeft.indexOf(evt.keyCode)  !== -1 ||
      this._keysTurnRight.indexOf(evt.keyCode) !== -1 ||
      this._keysUp.indexOf(evt.keyCode)        !== -1 ||
      this._keysDown.indexOf(evt.keyCode)      !== -1  
      ) {
      var index = this._keys.indexOf(evt.keyCode);
      if (index === -1) {
          this._keys.push(evt.keyCode);
      }
      if (!this._noPreventDefault) {
          evt.preventDefault();
      }
    }
  }

  private _onKeyUp: KeyEvent = (evt: { keyCode: any; preventDefault: () => void; }) => {
    if (
      this._keysLeft.indexOf(evt.keyCode)      !== -1 ||
      this._keysRight.indexOf(evt.keyCode)     !== -1 ||
      this._keysForward.indexOf(evt.keyCode)   !== -1 ||
      this._keysBackward.indexOf(evt.keyCode)  !== -1 ||
      this._keysMoveUp.indexOf(evt.keyCode)    !== -1 ||
      this._keysMoveDown.indexOf(evt.keyCode)  !== -1 ||
      this._keysTurnLeft.indexOf(evt.keyCode)  !== -1 ||
      this._keysTurnRight.indexOf(evt.keyCode) !== -1 ||
      this._keysUp.indexOf(evt.keyCode)        !== -1 ||
      this._keysDown.indexOf(evt.keyCode)      !== -1
      ) {
      var index = this._keys.indexOf(evt.keyCode);
      if (index >= 0) {
          this._keys.splice(index, 1);
      }
      if (!this._noPreventDefault) {
          evt.preventDefault();
      }
    }
  };

  private _onLostFocus(evt: FocusEvent) {
    this._keys = [];
  };

  /**
   * Attach new inputs to a camera
   * @param cam The current camera to attach to
   */
  constructor(cam: BABYLON.Nullable<BABYLON.FreeCamera>) {
    this.camera = cam;
  }
  
  getClassName(): string {
    return "FreeCameraKeyboardRotateInput";
  }

  getSimpleName(): string {
    return "keyboardRotate";
  }

  toggleFullScreen(): void {
    var doc = window.document as unknown as any;
    var docEl = doc.documentElement as unknown as any;
  
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
  }

  attachControl(element: HTMLElement, noPreventDefault?: boolean | undefined): void {
    this._noPreventDefault = !!noPreventDefault;

    element.tabIndex = 1;
    element.addEventListener("keydown" , this._onKeyDown , false);
    element.addEventListener("keyup"   , this._onKeyUp   , false);

    BABYLON.Tools.RegisterTopRootEvents([
        { name: "blur", handler: this._onLostFocus }
    ]);

    let isLocked = false;
    let isFullScreen = false;

    document.addEventListener("fullscreenchange", onFullScreenChange, false);
    document.addEventListener("mozfullscreenchange", onFullScreenChange, false);
    document.addEventListener("webkitfullscreenchange", onFullScreenChange, false);
    document.addEventListener("msfullscreenchange", onFullScreenChange, false);

    function onFullScreenChange() {
        if (document.fullscreen !== undefined) {
            isFullScreen = document.fullscreen;
        } else if ((document as any).mozFullScreen !== undefined) {
            isFullScreen = (document as any).mozFullScreen;
        } else if ((document as any).webkitIsFullScreen !== undefined) {
            isFullScreen = (document as any).webkitIsFullScreen;
        } else if ((document as any).msIsFullScreen !== undefined) {
            isFullScreen = (document as any).msIsFullScreen;
        }
    }

    const switchFullscreen = function () {
        if (!isFullScreen) {
            BABYLON.Tools.RequestFullscreen(element);
        }
    };

    let canvas = document.querySelector<HTMLDivElement>("canvas");
    canvas!.onclick = switchFullscreen;

    // On click event, request pointer lock
    this.camera!.getScene().onPointerDown = (evt) => {

      //true/false check if we're locked, faster than checking pointerlock on each single click.
      if (!isLocked) {
        let canvas = document.querySelector<HTMLCanvasElement>("canvas");
        canvas!.requestPointerLock = canvas!.requestPointerLock || canvas!.msRequestPointerLock
          || canvas!.mozRequestPointerLock || canvas!.webkitRequestPointerLock;
        if (canvas!.requestPointerLock) {
          canvas!.requestPointerLock();
        }
      }

      //continue with shooting requests or whatever :P
      //evt === 0 (left mouse click)
      //evt === 1 (mouse wheel click (not scrolling))
      //evt === 2 (right mouse click)
    };
  }

  detachControl(element: BABYLON.Nullable<HTMLElement>): void {
    if (element) {
      
        element.removeEventListener("keydown" , this._onKeyDown);
        element.removeEventListener("keyup"   , this._onKeyUp);

        BABYLON.Tools.UnregisterTopRootEvents([
          { name: "blur", handler: this._onLostFocus }
        ]);

        this._keys = [];      
    }
  }

  checkInputs() {
      if (!this.camera) return;

      const camera = this.camera;
      // Keyboard
      for (let index = 0; index < this._keys.length; index++) {
          const keyCode = this._keys[index];
          const moveX = camera.getTarget().subtract(camera.position).x;
          const moveY = camera.getTarget().subtract(camera.position).y;
          const moveZ = camera.getTarget().subtract(camera.position).z;

          if (this._keysLeft.indexOf(keyCode) !== -1) {
              var zSquared = moveZ * moveZ;
              var xSquared = moveX * moveX;
              var unitVector = 1 / Math.sqrt(zSquared + xSquared);
              camera.cameraDirection.x -= this._movementSpeed * moveZ * unitVector;
              camera.cameraDirection.z += this._movementSpeed * moveX * unitVector;
              continue;
          }
          
          if (this._keysRight.indexOf(keyCode) !== -1) {
              var zSquared = moveZ * moveZ;
              var xSquared = moveX * moveX;
              var unitVector = 1 / Math.sqrt(zSquared + xSquared);
              camera.cameraDirection.x += this._movementSpeed * moveZ * unitVector;
              camera.cameraDirection.z -= this._movementSpeed * moveX * unitVector;
              continue;
          }
          
          if (this._keysForward.indexOf(keyCode) !== -1) {
              camera.cameraDirection.x += this._movementSpeed * moveX;
              camera.cameraDirection.y += this._movementSpeed * moveY;
              camera.cameraDirection.z += this._movementSpeed * moveZ;	
              continue;
          }
          
          if (this._keysBackward.indexOf(keyCode) !== -1) {
              camera.cameraDirection.x -= this._movementSpeed * moveX;
              camera.cameraDirection.y -= this._movementSpeed * moveY;
              camera.cameraDirection.z -= this._movementSpeed * moveZ;
              continue;
          }
          
          if (this._keysMoveUp.indexOf(keyCode) !== -1) {
              camera.cameraDirection.y += this._movementSpeed * 0.5;	
              continue;
          }
          
          if (this._keysMoveDown.indexOf(keyCode) !== -1) {
              camera.cameraDirection.y -= this._movementSpeed * 0.5;
              continue;
          }
          
          if (this._keysTurnLeft.indexOf(keyCode) !== -1) {
              //camera.cameraRotation.y += 1//this._sensibility;	
              camera.cameraRotation.y += this._sensibility * 4;	
              continue;
          }
          
          if (this._keysTurnRight.indexOf(keyCode) !== -1) {
              camera.cameraRotation.y -= this._sensibility * 4;
              //camera.cameraRotation.y -= 1//this._sensibility;
              continue;
          }
          
          if (this._keysUp.indexOf(keyCode) !== -1) {
              camera.cameraRotation.x -= this._sensibility * 4;
              //camera.position.y += 5;
              continue;
          }
          
          if (this._keysDown.indexOf(keyCode) !== -1) {
              camera.cameraRotation.x += this._sensibility * 4;	
             // camera.position.y -= 5;
              continue;
          }
      }

      
  }
}