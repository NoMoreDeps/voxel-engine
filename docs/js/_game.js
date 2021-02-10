! function(e) {
  var t = {};

  function i(s) {
      if (t[s]) return t[s].exports;
      var r = t[s] = {
          i: s,
          l: !1,
          exports: {}
      };
      return e[s].call(r.exports, r, r.exports, i), r.l = !0, r.exports
  }
  i.m = e, i.c = t, i.d = function(e, t, s) {
      i.o(e, t) || Object.defineProperty(e, t, {
          enumerable: !0,
          get: s
      })
  }, i.r = function(e) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
          value: "Module"
      }), Object.defineProperty(e, "__esModule", {
          value: !0
      })
  }, i.t = function(e, t) {
      if (1 & t && (e = i(e)), 8 & t) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var s = Object.create(null);
      if (i.r(s), Object.defineProperty(s, "default", {
              enumerable: !0,
              value: e
          }), 2 & t && "string" != typeof e)
          for (var r in e) i.d(s, r, function(t) {
              return e[t]
          }.bind(null, r));
      return s
  }, i.n = function(e) {
      var t = e && e.__esModule ? function() {
          return e.default
      } : function() {
          return e
      };
      return i.d(t, "a", t), t
  }, i.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t)
  }, i.p = "", i(i.s = 2)
}([function(e, t, i) {
  "use strict";
  Object.defineProperty(t, "__esModule", {
      value: !0
  }), t.vector3ToArrayIndex = function(e, t, i, s = 32) {
      return s * s * e + s * t + i
  }, t.arrayIndexToVector3 = function(e, t = 32) {
      return new BABYLON.Vector3(e / (t * t) >> 0, e / t % t >> 0, e % t >> 0)
  }, t.vector2ToArrayIndex = function(e, t, i = 32) {
      return i * e + t
  }, t.arrayIndexToVector2 = function(e, t = 32) {
      return new BABYLON.Vector2(e / t >> 0, e % t >> 0)
  }, t.fillArrayWithEmptiness = function(e, t = 32768) {
      e.length = 0;
      for (let i = 0; i < t; i++) e.push(0)
  }, t.getNextNonZeroValueIndex = function(e, t) {
      for (let i = t + 1; i < e.length; i++)
          if (0 !== e[i]) return [i, e[i]];
      return [-1, -1]
  }, t.forX = function(e, t, i, s = 1) {
      for (let r = e; r < t; r += s) i(r)
  }, t.getLocalPosition = function(e) {
      const t = e.x % 32,
          i = (e.x - t) / 32,
          s = e.y % 32,
          r = (e.y - s) / 32,
          n = e.z % 32,
          o = (e.z - n) / 32;
      return [new BABYLON.Vector3(i, r, o), new BABYLON.Vector3(t >> 0, s >> 0, n >> 0)]
  }
}, function(e, t, i) {
  "use strict";
  Object.defineProperty(t, "__esModule", {
          value: !0
      }),
      function(e) {
          e[e.Left = 1] = "Left", e[e.Right = 2] = "Right", e[e.Forward = 4] = "Forward", e[e.Backward = 8] = "Backward", e[e.Top = 16] = "Top", e[e.Bottom = 32] = "Bottom", e[e.Z_Axis = 3] = "Z_Axis", e[e.X_Axis = 12] = "X_Axis", e[e.Y_Axis = 48] = "Y_Axis", e[e.All = 63] = "All"
      }(t.Side || (t.Side = {}))
}, function(e, t, i) {
  "use strict";
  var s = this && this.__awaiter || function(e, t, i, s) {
      return new(i || (i = Promise))(function(r, n) {
          function o(e) {
              try {
                  h(s.next(e))
              } catch (e) {
                  n(e)
              }
          }

          function a(e) {
              try {
                  h(s.throw(e))
              } catch (e) {
                  n(e)
              }
          }

          function h(e) {
              e.done ? r(e.value) : new i(function(t) {
                  t(e.value)
              }).then(o, a)
          }
          h((s = s.apply(e, t || [])).next())
      })
  };
  Object.defineProperty(t, "__esModule", {
      value: !0
  });
  const r = i(3),
      n = i(5);
  class o {
      init() {
          return s(this, void 0, void 0, function*() {
              this.engine = new r.VoxelEngine({
                  canvasElement: "app"
              }), this.engine.initialize().start();
              const e = yield(yield fetch("assets/conf/default/material-info.json")).json(), t = yield(yield fetch("assets/conf/default/blocks-mapping.json")).json(), i = yield(yield fetch("assets/conf/default/blocks-definition.json")).json();
              this.engine.loadMaterial(Object.assign({}, e, i, t));
              this.simplexMap = new n.ChunkBuilder(32, 20, 20, 1), this.simplexMap.initializeSimplexNoiseMap(), this.engine.evtChunkIsNeeded = e => this.simplexMap.getChunkAt(e, !0)
          })
      }
  }
  t.Game = o, (new o).init()
}, function(e, t, i) {
  "use strict";
  var s = this && this.__importStar || function(e) {
      if (e && e.__esModule) return e;
      var t = {};
      if (null != e)
          for (var i in e) Object.hasOwnProperty.call(e, i) && (t[i] = e[i]);
      return t.default = e, t
  };
  Object.defineProperty(t, "__esModule", {
      value: !0
  });
  const r = i(4),
      n = s(i(0)),
      o = i(1);
  t.VoxelEngine = class {
      constructor(e) {
          this._lastTick = 0, this._newTick = 0, this._currentTick = 0, this.region = {
              chunks: {}
          }, this.lastPosition = new BABYLON.Vector3(0, 0, 0), this._gameMaterialRepo = {}, this.first = !0, this.hasBeenInit = !0, this._options = Object.assign({}, e)
      }
      computeTickDelta() {
          this._newTick = performance.now(), this._currentTick = this._newTick - this._lastTick, this._lastTick = this._newTick
      }
      get tickDelta() {
          return this._currentTick
      }
      initialize() {
          if (this._engine) return console.info("Engine already started"), this;
          this._canvas = document.getElementById(this._options.canvasElement), this._engine = new BABYLON.Engine(this._canvas, !0), this._scene = new BABYLON.Scene(this._engine), this._scene.blockMaterialDirtyMechanism = !0, this._scene.ambientColor = new BABYLON.Color3(.3, .3, .3), this._scene.clearColor = BABYLON.Color4.FromColor3(new BABYLON.Color3(135 / 255, 206 / 255, 250 / 255)), this._camera = new BABYLON.UniversalCamera("MainCharcter", new BABYLON.Vector3(100, 20, 100), this._scene), this._camera.setTarget(new BABYLON.Vector3(1, 0, 0)), this._camera.attachControl(this._canvas, !1), this._camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
          const e = new r.FreeCameraKeyboardRotateInput(this._camera);
          e._voxelEngine = this, this._camera.inputs.add(e), this._camera.inertia = 0, this._camera.angularSensibility = 500, this._scene.gravity = new BABYLON.Vector3(0, -.35, 0), this._camera.applyGravity = !0, this._camera.ellipsoid = new BABYLON.Vector3(1, 2, 1), this._scene.collisionsEnabled = !0, this._camera.checkCollisions = !0, this._camera._needMoveForGravity = !0;
          var t = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
          const i = () => void 0,
              s = (s, r, n, o = !0) => {
                  var a = BABYLON.GUI.Button.CreateSimpleButton("but1", "");
                  a.width = "60px", a.height = "60px", a.left = `${r}px`, a.top = `${n}px`, a.cornerRadius = 20, a.thickness = 1, a.horizontalAlignment = o ? BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT, a.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM, a.onPointerDownObservable.add(() => {
                      e.forceKeyDown(s, i)
                  }), a.onPointerOutObservable.add(() => {
                      e.forceKeyUp(s, i)
                  }), a.onPointerUpObservable.add(() => {
                      e.forceKeyUp(s, i)
                  }), t.addControl(a)
              };
          return s(65, 20, -100), s(68, 90, -100), s(87, 55, -170), s(83, 55, -30), s(37, -160, -100, !1), s(39, -90, -100, !1), s(32, -125, -170, !1), s(38, -10, -170, !1), s(40, -10, -30, !1), this
      }
      loadMaterial(e) {
          this._gameMaterialRepo[e.name] = e, this.processMaterial(e.name)
      }
      processMaterial(e) {
          const t = this._gameMaterialRepo[e];
          t.texture = new BABYLON.Texture(t.texturePath, this._scene, void 0, void 0, 1), t.material = new BABYLON.StandardMaterial(t.name, this._scene), t.texture.hasAlpha = !0, t.material.diffuseTexture = t.texture, t.material.ambientColor = BABYLON.Color3.White(), t.material.diffuseTexture.level = 6.5, t.sps = new BABYLON.SolidParticleSystem(e, this._scene)
      }
      getTex(e, t) {
          return new BABYLON.Vector4(1 / 16 * e + 1 / 512, 1 / 16 * t + 1 / 512, 1 / 16 * e + 1 / 16 - 1 / 512, 1 / 16 * t + 1 / 16 - 1 / 512)
      }
      updateGameLoop() {
          const e = this._camera.position.clone();
          e.x -= 1.5;
          const [t, i] = n.getLocalPosition(e);
          if (this.evtChunkIsNeeded)
              if (this.first) {
                  this.first = !1;
                  for (let e = 0; e <= 5; e++)
                      for (let t = 0; t <= 5; t++)
                          if (!this.region.chunks[`${e}-0-${t}`]) {
                              const i = this.evtChunkIsNeeded(new BABYLON.Vector3(e, 0, t));
                              this.addChunkToScene("default", i, new BABYLON.Vector3(32 * e, 0, 32 * t)), this.hasBeenInit && this._scene.selectionOctree.addMesh(this.addChunkToScene("default", i, new BABYLON.Vector3(32 * e, 0, 32 * t))), this.region.chunks[`${e}-0-${t}`] = i, this.hasBeenInit && this._scene.updateTransformMatrix(), this.hasBeenInit && this._scene.createOrUpdateSelectionOctree()
                          }
              } else if (!this.region.chunks[`${t.x}-${t.y}-${t.z}`]) {
              const e = this.evtChunkIsNeeded(t);
              this._scene.selectionOctree.addMesh(this.addChunkToScene("default", e, new BABYLON.Vector3(32 * t.x, 32 * t.y, 32 * t.z))), this.hasBeenInit && (this.region.chunks[`${t.x}-${t.y}-${t.z}`] = e), this.hasBeenInit && this._scene.updateTransformMatrix(), this._scene.createOrUpdateSelectionOctree()
          }
      }
      addChunkToScene(e, t, i) {
          this.globalSPS || (this.globalSPS = new BABYLON.SolidParticleSystem("s", this._scene));
          let s = 100 * Math.random() % 15 >> 0,
              r = 100 * Math.random() % 15 >> 0;
          s = 15, r = 3;
          const a = BABYLON.MeshBuilder.CreatePlane("box", {
                  height: 1,
                  width: 1,
                  frontUVs: this.getTex(11, 14),
                  sideOrientation: BABYLON.Mesh.DOUBLESIDE
              }, this._scene),
              h = BABYLON.MeshBuilder.CreatePlane("box", {
                  height: 1,
                  width: 1,
                  frontUVs: this.getTex(3, 15),
                  sideOrientation: BABYLON.Mesh.DOUBLESIDE
              }, this._scene),
              c = BABYLON.MeshBuilder.CreateTiledBox("box", {
                  width: 1,
                  height: 1,
                  depth: 1,
                  faceUV: [this.getTex(13, 3), this.getTex(13, 3), this.getTex(13, 3), this.getTex(13, 3), this.getTex(13, 3), this.getTex(13, 3)]
              }, this._scene),
              l = new BABYLON.SolidParticleSystem(performance.now().toString(), this._scene);
          let d = 0;
          for (let e = 0; e < t.rcDataSize; e++) {
              let [e, i] = n.getNextNonZeroValueIndex(t.rcData, d);
              d = e, (i & o.Side.Top) === o.Side.Top && l.addShape(a, 1, {
                  positionFunction: (e, t, i) => {
                      e.position = n.arrayIndexToVector3(d), e.rotation.x = BABYLON.Angle.FromDegrees(90).radians(), e.position.y += .5, e.position.z += 1
                  }
              }), (i & o.Side.Bottom) === o.Side.Bottom && l.addShape(h, 1, {
                  positionFunction: (e, t, i) => {
                      e.position = n.arrayIndexToVector3(d), e.rotation.x = BABYLON.Angle.FromDegrees(-90).radians(), e.position.y -= .5, e.position.z += 1
                  }
              }), (i & o.Side.Forward) === o.Side.Forward && l.addShape(h, 1, {
                  positionFunction: (e, t, i) => {
                      e.position = n.arrayIndexToVector3(d), e.rotation.y = BABYLON.Angle.FromDegrees(90).radians(), e.position.z += 1, e.position.x -= .5
                  }
              }), (i & o.Side.Backward) === o.Side.Backward && l.addShape(h, 1, {
                  positionFunction: (e, t, i) => {
                      e.position = n.arrayIndexToVector3(d), e.rotation.y = BABYLON.Angle.FromDegrees(-90).radians(), e.position.z += 1, e.position.x += .5
                  }
              }), (i & o.Side.Left) === o.Side.Left && l.addShape(h, 1, {
                  positionFunction: (e, t, i) => {
                      e.position = n.arrayIndexToVector3(d), e.rotation.y = BABYLON.Angle.FromDegrees(180).radians(), e.position.z += 1.5
                  }
              }), (i & o.Side.Right) === o.Side.Right && l.addShape(h, 1, {
                  positionFunction: (e, t, i) => {
                      e.position = n.arrayIndexToVector3(d), e.position.z += .5
                  }
              })
          }
          return a.dispose(), h.dispose(), n.forX(0, 32, e => {
              n.forX(0, 32, i => {
                  t.rcData[n.vector3ToArrayIndex(e, 6, i)]
              })
          }), c.dispose(), l.mesh || l.buildMesh(), l.mesh.material || (l.mesh.material = this._gameMaterialRepo[e].material), l.mesh.position = i, l.mesh.computeWorldMatrix(), l.setParticles(), l.mesh.freezeNormals(), l.mesh.freezeWorldMatrix(), l.mesh.checkCollisions = !0, l.mesh
      }
      start() {
          let e = 0;
          const t = document.createElement("div");
          t.style.position = "absolute", t.style.width = "25px", t.style.height = "25px", t.style.top = "0px", t.style.left = "0px", t.style.backgroundColor = "white", t.style.textAlign = "center", t.style.lineHeight = "25px", t.style.zIndex = "9999", document.body.appendChild(t), this._scene.createOrUpdateSelectionOctree(8, 1), this.hasBeenInit = !0, this._engine.runRenderLoop(() => {
              this.computeTickDelta(), this.updateGameLoop(), this._scene.createOrUpdateSelectionOctree(), this._scene.render(), e++
          }), window.game = this, setInterval(() => (t.innerText = e.toString(), e = 0), 1e3), window.addEventListener("resize", () => {
              this._engine.resize()
          })
      }
  }
}, function(e, t, i) {
  "use strict";
  var s;
  Object.defineProperty(t, "__esModule", {
          value: !0
      }),
      function(e) {
          e.KeyLeft = "KeyLeft", e.KeyRight = "KeyRight", e.KeyForward = "KeyForward", e.KeyBackward = "KeyBackward", e.KeyMoveUp = "KeyMoveUp", e.KeyMoveDown = "KeyMoveDown", e.KeyTurnLeft = "KeyTurnLeft", e.KeyTurnRight = "KeyTurnRight", e.KeyUp = "KeyUp", e.KeyDown = "KeyDown", e.KeyJump = "KeyJump"
      }(s || (s = {}));
  t.FreeCameraKeyboardRotateInput = class {
      constructor(e) {
          this._noPreventDefault = !1, this._isJumping = !1, this._keys = [], this._keysLeft = [65], this._keysRight = [68], this._keysForward = [87], this._keysBackward = [83], this._keysMoveUp = [33], this._keysMoveDown = [34], this._keysTurnLeft = [39], this._keysTurnRight = [37], this._keysUp = [38], this._keysDown = [40], this._keysJump = [32], this._sensibility = .005, this._movementSpeed = .25, this._onKeyDown = e => {
              -1 === this._keysLeft.indexOf(e.keyCode) && -1 === this._keysRight.indexOf(e.keyCode) && -1 === this._keysForward.indexOf(e.keyCode) && -1 === this._keysBackward.indexOf(e.keyCode) && -1 === this._keysMoveUp.indexOf(e.keyCode) && -1 === this._keysMoveDown.indexOf(e.keyCode) && -1 === this._keysTurnLeft.indexOf(e.keyCode) && -1 === this._keysTurnRight.indexOf(e.keyCode) && -1 === this._keysUp.indexOf(e.keyCode) && -1 === this._keysJump.indexOf(e.keyCode) && -1 === this._keysDown.indexOf(e.keyCode) || (-1 === this._keys.indexOf(e.keyCode) && this._keys.push(e.keyCode), this._noPreventDefault || e.preventDefault())
          }, this._onKeyUp = e => {
              if (-1 !== this._keysLeft.indexOf(e.keyCode) || -1 !== this._keysRight.indexOf(e.keyCode) || -1 !== this._keysForward.indexOf(e.keyCode) || -1 !== this._keysBackward.indexOf(e.keyCode) || -1 !== this._keysMoveUp.indexOf(e.keyCode) || -1 !== this._keysMoveDown.indexOf(e.keyCode) || -1 !== this._keysTurnLeft.indexOf(e.keyCode) || -1 !== this._keysTurnRight.indexOf(e.keyCode) || -1 !== this._keysUp.indexOf(e.keyCode) || -1 !== this._keysJump.indexOf(e.keyCode) || -1 !== this._keysDown.indexOf(e.keyCode)) {
                  var t = this._keys.indexOf(e.keyCode);
                  t >= 0 && this._keys.splice(t, 1), this._noPreventDefault || e.preventDefault()
              }
          }, this.camera = e
      }
      setKeycode(e, t) {
          switch (t) {
              case s.KeyJump:
                  this._keysJump.length = 0, this._keysJump.push(e);
                  break;
              case s.KeyLeft:
                  this._keysLeft.length = 0, this._keysLeft.push(e);
                  break;
              case s.KeyRight:
                  this._keysRight.length = 0, this._keysRight.push(e);
                  break;
              case s.KeyForward:
                  this._keysForward.length = 0, this._keysForward.push(e);
                  break;
              case s.KeyBackward:
                  this._keysBackward.length = 0, this._keysBackward.push(e);
                  break;
              case s.KeyMoveUp:
                  this._keysMoveUp.length = 0, this._keysMoveUp.push(e);
                  break;
              case s.KeyMoveDown:
                  this._keysMoveDown.length = 0, this._keysMoveDown.push(e);
                  break;
              case s.KeyTurnLeft:
                  this._keysTurnLeft.length = 0, this._keysTurnLeft.push(e);
                  break;
              case s.KeyTurnRight:
                  this._keysTurnRight.length = 0, this._keysTurnRight.push(e);
                  break;
              case s.KeyUp:
                  this._keysUp.length = 0, this._keysUp.push(e);
                  break;
              case s.KeyDown:
                  this._keysDown.length = 0, this._keysDown.push(e)
          }
      }
      forceKeyUp(e, t) {
          this._onKeyUp({
              keyCode: e,
              preventDefault: t
          })
      }
      forceKeyDown(e, t) {
          this._onKeyDown({
              keyCode: e,
              preventDefault: t
          })
      }
      _onLostFocus(e) {
          this._keys = []
      }
      getClassName() {
          return "FreeCameraKeyboardRotateInput"
      }
      getSimpleName() {
          return "keyboardRotate"
      }
      toggleFullScreen() {
          var e = window.document,
              t = e.documentElement,
              i = t.requestFullscreen || t.mozRequestFullScreen || t.webkitRequestFullScreen || t.msRequestFullscreen,
              s = e.exitFullscreen || e.mozCancelFullScreen || e.webkitExitFullscreen || e.msExitFullscreen;
          e.fullscreenElement || e.mozFullScreenElement || e.webkitFullscreenElement || e.msFullscreenElement ? s.call(e) : i.call(t)
      }
      attachControl(e, t) {
          this._noPreventDefault = !!t, e.tabIndex = 1, e.addEventListener("keydown", this._onKeyDown, !1), e.addEventListener("keyup", this._onKeyUp, !1), BABYLON.Tools.RegisterTopRootEvents([{
              name: "blur",
              handler: this._onLostFocus
          }]);
          let i = !1;

          function s() {
              void 0 !== document.fullscreen ? i = document.fullscreen : void 0 !== document.mozFullScreen ? i = document.mozFullScreen : void 0 !== document.webkitIsFullScreen ? i = document.webkitIsFullScreen : void 0 !== document.msIsFullScreen && (i = document.msIsFullScreen)
          }
          document.addEventListener("fullscreenchange", s, !1), document.addEventListener("mozfullscreenchange", s, !1), document.addEventListener("webkitfullscreenchange", s, !1), document.addEventListener("msfullscreenchange", s, !1), document.querySelector("canvas").onclick = function() {
              i || BABYLON.Tools.RequestFullscreen(e)
          }, this.camera.getScene().onPointerDown = e => {
              {
                  let e = document.querySelector("canvas");
                  e.requestPointerLock = e.requestPointerLock || e.msRequestPointerLock || e.mozRequestPointerLock || e.webkitRequestPointerLock, e.requestPointerLock && e.requestPointerLock()
              }
          }
      }
      detachControl(e) {
          e && (e.removeEventListener("keydown", this._onKeyDown), e.removeEventListener("keyup", this._onKeyUp), BABYLON.Tools.UnregisterTopRootEvents([{
              name: "blur",
              handler: this._onLostFocus
          }]), this._keys = [])
      }
      checkInputs() {
          if (!this.camera) return;
          const e = this.camera;
          for (let o = 0; o < this._keys.length; o++) {
              const a = this._keys[o],
                  h = e.getTarget().subtract(e.position).x,
                  c = e.getTarget().subtract(e.position).y,
                  l = e.getTarget().subtract(e.position).z,
                  d = this._movementSpeed / 16 * this._voxelEngine.tickDelta;
              if (console.log(h, c, l), -1 !== this._keysJump.indexOf(a)) {
                  if (this._isJumping) return;
                  this._isJumping = !0;
                  var t = new BABYLON.Animation("a", "position.y", 120, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
                  e.animations = [];
                  var i = [];
                  const s = e.position.y;
                  i.push({
                      frame: 0,
                      value: s
                  }), i.push({
                      frame: 20,
                      value: s + 1
                  }), i.push({
                      frame: 30,
                      value: s + 2
                  }), i.push({
                      frame: 35,
                      value: s + 1.5
                  }), i.push({
                      frame: 40,
                      value: s + 1
                  }), i.push({
                      frame: 60,
                      value: s
                  }), t.setKeys(i), new BABYLON.BezierCurveEase(.13, .01, .63, 1.41).setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN), e.animations.push(t), e.applyGravity = !1, e.getScene().beginAnimation(e, 0, 35, !1, void 0, () => {
                      e.applyGravity = !0, this._isJumping = !1
                  })
              }
              if (-1 === this._keysLeft.indexOf(a)) - 1 === this._keysRight.indexOf(a) ? -1 === this._keysForward.indexOf(a) ? -1 === this._keysBackward.indexOf(a) ? -1 === this._keysMoveUp.indexOf(a) ? -1 === this._keysMoveDown.indexOf(a) ? -1 === this._keysTurnLeft.indexOf(a) ? -1 === this._keysTurnRight.indexOf(a) ? -1 === this._keysUp.indexOf(a) ? -1 === this._keysDown.indexOf(a) || (e.cameraRotation.x += 4 * this._sensibility) : e.cameraRotation.x -= 4 * this._sensibility : e.cameraRotation.y -= 4 * this._sensibility : e.cameraRotation.y += 4 * this._sensibility : e.cameraDirection.y -= .5 * d : e.cameraDirection.y += .5 * d : (e.cameraDirection.x -= d * h, e.cameraDirection.y -= d * c, e.cameraDirection.z -= d * l) : (e.cameraDirection.x += d * h, e.cameraDirection.y += d * c, e.cameraDirection.z += d * l) : (s = l * l, r = h * h, n = 1 / Math.sqrt(s + r), e.cameraDirection.x += d * l * n, e.cameraDirection.z -= d * h * n);
              else {
                  var s = l * l,
                      r = h * h,
                      n = 1 / Math.sqrt(s + r);
                  e.cameraDirection.x -= d * l * n, e.cameraDirection.z += d * h * n
              }
          }
      }
  }
}, function(e, t, i) {
  "use strict";
  Object.defineProperty(t, "__esModule", {
      value: !0
  });
  const s = i(6),
      r = i(0),
      n = i(1);
  class o {
      constructor(e = 32, t = 1, i = 1, s = 1) {
          this._chunkSize = e, this._mapWidth = t, this._mapDepth = i, this._mapHeight = s, this._store = {}, this._simplexMap = new Array
      }
      getChunkAt(e, t = !1) {
          const i = `${e.x}-${e.y}-${e.z}`;
          return i in this._store && (!0 === t && !0 === this._store[i].hasRc || !t) ? this._store[i] : (this._store[i] = this.inflateSimplexNoiseMapToChunk(e), !0 === t && this._simplifyChunk(e), this._store[i])
      }
      createChunk() {
          return o.create(this._chunkSize)
      }
      static create(e = 32) {
          const t = {
              position: new BABYLON.Vector3(0, 0, 0),
              data: [],
              dataSize: 0,
              rcData: [],
              rcDataSize: 0,
              size: e,
              hasRc: !1
          };
          return r.fillArrayWithEmptiness(t.data, e * e * e), t
      }
      initializeSimplexNoiseMap(e, t, i, s = .015, r = 4, n = 2, a = 1) {
          this._simplexMap = o.createSimplexNoiseMap(e || this._mapWidth * this._chunkSize, t || this._mapDepth * this._chunkSize, i || this._mapHeight * this._chunkSize, s, r, n, a)
      }
      static createSimplexNoiseMap(e, t, i = 32, n = .015, o = 4, a = 2, h = 1) {
          const c = new s.SimplexNoise;
          c.init(), c.noiseDetail(55, .34567);
          const l = new Array;
          r.fillArrayWithEmptiness(l, e * t);
          let d = [];
          for (let s = 0; s < e; s++) {
              for (let o = 0; o < t; o++) l[r.vector2ToArrayIndex(s, o, e)] = c.noise(s * n, o * n) * i / 1.34 >> 0;
              d.length = 0
          }
          return l
      }
      inflateSimplexNoiseMapToChunk(e) {
          const t = this._chunkSize,
              i = o.create(t),
              {
                  x: s,
                  y: n,
                  z: a
              } = Object.assign({}, e);
          return r.forX(s * t, s * t + t, e => {
              r.forX(a * t, a * t + t, s => {
                  let o = this._simplexMap[r.vector2ToArrayIndex(e, s, Math.sqrt(this._simplexMap.length))] - n * t;
                  o < 0 && (o = 0), r.forX(n, o, n => {
                      i.data[r.vector3ToArrayIndex(e % 32, n % 32, s % 32, t)] = 1, i.dataSize++
                  })
              })
          }), i
      }
      _simplifyChunk(e) {
          const t = this.getChunkAt(e, !1);
          if (t.hasRc) return;
          let i = 0;
          const s = new Array,
              o = Math.cbrt(t.data.length),
              a = (t, i, s, n) => {
                  const h = {
                      x: e.x,
                      y: e.y,
                      z: e.z
                  };
                  return i < 0 ? (h.x--, h.x < 0 || a(this.getChunkAt(h, !1), this._chunkSize - 1, s, n)) : i >= o ? (h.x++, h.x > this._mapWidth || a(this.getChunkAt(h, !1), 0, s, n)) : s < 0 ? (h.y--, h.y < 0 || a(this.getChunkAt(h, !1), i, this._chunkSize - 1, n)) : s >= o ? (h.y++, h.y > this._mapWidth || a(this.getChunkAt(h, !1), i, -1, n)) : n < 0 ? (h.z--, !(h.z < 0) && a(this.getChunkAt(h, !1), i, s, this._chunkSize - 1)) : n >= o ? (h.z++, h.z < 0 || a(this.getChunkAt(h, !1), i, s, 0)) : 0 !== t.data[r.vector3ToArrayIndex(i, s, n, o)]
              };
          t.data.forEach((e, h) => {
              let c = s.push(e) - 1;
              if (0 === e) return;
              let l = n.Side.All;
              const d = r.arrayIndexToVector3(h, o);
              a(t, d.x + 1, d.y, d.z) && (l -= n.Side.Backward), a(t, d.x - 1, d.y, d.z) && (l -= n.Side.Forward), a(t, d.x, d.y + 1, d.z) && (l -= n.Side.Top), a(t, d.x, d.y - 1, d.z) && (l -= n.Side.Bottom), a(t, d.x, d.y, d.z - 1) && (l -= n.Side.Right), a(t, d.x, d.y, d.z + 1) && (l -= n.Side.Left), s[c] = l, 0 !== l && i++, 0 === d.y && (s[c] = 0)
          }), [t.rcData, t.rcDataSize] = [s, i], t.hasRc = !0
      }
      simplifyChunk(e) {
          const t = this.getChunkAt(e, !1);
          if (t.hasRc) return;
          let i = 0;
          const s = new Array,
              o = Math.cbrt(t.data.length),
              a = (t, i, s, n) => {
                  e.x, e.y, e.z;
                  return i < 0 || (i >= o || (s < 0 || (s >= o || (n < 0 || (n >= o || 0 !== t.data[r.vector3ToArrayIndex(i, s, n, o)])))))
              };
          t.data.forEach((e, h) => {
              let c = s.push(e) - 1;
              if (0 === e) return;
              let l = n.Side.All;
              const d = r.arrayIndexToVector3(h, o);
              a(t, d.x + 1, d.y, d.z) && (l -= n.Side.Backward), a(t, d.x - 1, d.y, d.z) && (l -= n.Side.Forward), a(t, d.x, d.y + 1, d.z) && (l -= n.Side.Top), a(t, d.x, d.y - 1, d.z) && (l -= n.Side.Bottom), a(t, d.x, d.y, d.z - 1) && (l -= n.Side.Right), a(t, d.x, d.y, d.z + 1) && (l -= n.Side.Left), s[c] = l, 0 !== l && i++, 0 === d.y && (s[c] = 0)
          }), [t.rcData, t.rcDataSize] = [s, i], t.hasRc = !0
      }
  }
  t.ChunkBuilder = o
}, function(e, t, i) {
  "use strict";
  Object.defineProperty(t, "__esModule", {
      value: !0
  });
  t.SimplexNoise = class {
      constructor() {
          this.iOctaves = 1, this.fPersistence = .5, this.F2 = .5 * (Math.sqrt(3) - 1), this.G2 = (3 - Math.sqrt(3)) / 6, this.F3 = 1 / 3, this.G3 = 1 / 6, this.F4 = (Math.sqrt(5) - 1) / 4, this.G4 = 5 - Math.sqrt(5) / 20, this.perm = new Uint8Array(512), this.permMod12 = new Uint8Array(512), this.p = new Uint8Array(256), this.grad3 = new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]), this.grad4 = new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1, 1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1, -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0])
      }
      octaveFreq() {
          let e, t;
          this.aOctFreq = new Array, this.aOctPers = new Array, this.fPersMax = 0;
          for (var i = 0; i < this.iOctaves; i++) e = Math.pow(2, i), t = Math.pow(this.fPersistence, i), this.fPersMax += t, this.aOctFreq.push(e), this.aOctPers.push(t);
          this.fPersMax = 1 / this.fPersMax
      }
      seed(e) {
          return 1 - ((e ^= e << 13) * (e * e * 15731 + 789221) + 1376312589 & 2147483647) / 1073741824
      }
      init() {
          for (var e = 0; e < 256; e++) this.p[e] = Math.abs(~~(256 * this.seed(e)));
          for (e = 0; e < 512; e++) this.perm[e] = this.p[255 & e], this.permMod12[e] = this.perm[e] % 12
      }
      noise2D(e, t) {
          var i, s, r, n, o, a = (e + t) * this.F2,
              h = Math.floor(e + a),
              c = Math.floor(t + a),
              l = (h + c) * this.G2,
              d = e - (h - l),
              u = t - (c - l);
          d > u ? (n = 1, o = 0) : (n = 0, o = 1);
          var p = d - n + this.G2,
              y = u - o + this.G2,
              f = d - 1 + 2 * this.G2,
              m = u - 1 + 2 * this.G2,
              _ = 255 & h,
              k = 255 & c,
              g = .5 - d * d - u * u;
          if (g < 0) i = 0;
          else {
              var x = this.permMod12[_ + this.perm[k]];
              i = (g *= g) * g * (this.grad3[x] * d + this.grad3[x + 1] * u)
          }
          var v = .5 - p * p - y * y;
          if (v < 0) s = 0;
          else {
              var O = this.permMod12[_ + n + this.perm[k + o]];
              s = (v *= v) * v * (this.grad3[O] * p + this.grad3[O + 1] * y)
          }
          var B = .5 - f * f - m * m;
          if (B < 0) r = 0;
          else {
              var w = this.permMod12[_ + 1 + this.perm[k + 1]];
              r = (B *= B) * B * (this.grad3[w] * f + this.grad3[w + 1] * m)
          }
          return 70 * (i + s + r)
      }
      noise3D(e, t, i) {
          var s, r, n, o, a, h, c, l, d, u, p = (e + t + i) * this.F3,
              y = Math.floor(e + p),
              f = Math.floor(t + p),
              m = Math.floor(i + p),
              _ = (y + f + m) * this.G3,
              k = e - (y - _),
              g = t - (f - _),
              x = i - (m - _);
          k >= g ? g >= x ? (a = 1, h = 0, c = 0, l = 1, d = 1, u = 0) : k >= x ? (a = 1, h = 0, c = 0, l = 1, d = 0, u = 1) : (a = 0, h = 0, c = 1, l = 1, d = 0, u = 1) : g < x ? (a = 0, h = 0, c = 1, l = 0, d = 1, u = 1) : k < x ? (a = 0, h = 1, c = 0, l = 0, d = 1, u = 1) : (a = 0, h = 1, c = 0, l = 1, d = 1, u = 0);
          var v = k - a + this.G3,
              O = g - h + this.G3,
              B = x - c + this.G3,
              w = k - l + 2 * this.G3,
              A = g - d + 2 * this.G3,
              M = x - u + 2 * this.G3,
              L = k - 1 + 3 * this.G3,
              S = g - 1 + 3 * this.G3,
              T = x - 1 + 3 * this.G3,
              C = 255 & y,
              b = 255 & f,
              N = 255 & m,
              D = .6 - k * k - g * g - x * x;
          if (D < 0) s = 0;
          else {
              D *= D;
              var F = this.permMod12[C + this.perm[b + this.perm[N]]];
              s = D * D * (this.grad3[F] * k + this.grad3[F + 1] * g + this.grad3[F + 2] * x)
          }
          var z = .6 - v * v - O * O - B * B;
          if (z < 0) r = 0;
          else {
              z *= z;
              var I = this.permMod12[C + a + this.perm[b + h + this.perm[N + c]]];
              r = z * z * (this.grad3[I] * v + this.grad3[I + 1] * O + this.grad3[I + 2] * B)
          }
          var R = .6 - w * w - A * A - M * M;
          if (R < 0) n = 0;
          else {
              R *= R;
              var P = this.permMod12[C + l + this.perm[b + d + this.perm[N + u]]];
              n = R * R * (this.grad3[P] * w + this.grad3[P + 1] * A + this.grad3[P + 2] * M)
          }
          var Y = .6 - L * L - S * S - T * T;
          if (Y < 0) o = 0;
          else {
              Y *= Y;
              var E = this.permMod12[C + 1 + this.perm[b + 1 + this.perm[N + 1]]];
              o = Y * Y * (this.grad3[E] * L + this.grad3[E + 1] * S + this.grad3[E + 2] * T)
          }
          return 32 * (s + r + n + o)
      }
      noise4D(e, t, i, s) {
          var r, n, o, a, h, c, l, d, u, p, y, f, m, _, k, g, x, v = (e + t + i + s) * this.F4,
              O = Math.floor(e + v),
              B = Math.floor(t + v),
              w = Math.floor(i + v),
              A = Math.floor(s + v),
              M = (O + B + w + A) * this.G4,
              L = e - (O - M),
              S = t - (B - M),
              T = i - (i - M),
              C = s - (s - M),
              b = 0,
              N = 0,
              D = 0,
              F = 0;
          L > S ? b++ : N++, L > T ? b++ : D++, L > C ? b++ : F++, S > T ? N++ : D++, S > C ? N++ : F++, T > C ? D++ : F++, l = N >= 3 ? 1 : 0, d = D >= 3 ? 1 : 0, u = F >= 3 ? 1 : 0, p = b >= 2 ? 1 : 0, y = N >= 2 ? 1 : 0, f = D >= 2 ? 1 : 0, m = F >= 2 ? 1 : 0, _ = b >= 1 ? 1 : 0, k = N >= 1 ? 1 : 0, g = D >= 1 ? 1 : 0, x = F >= 1 ? 1 : 0;
          var z = L - (c = b >= 3 ? 1 : 0) + this.G4,
              I = S - l + this.G4,
              R = T - d + this.G4,
              P = C - u + this.G4,
              Y = L - p + 2 * this.G4,
              E = S - y + 2 * this.G4,
              G = T - f + 2 * this.G4,
              K = C - m + 2 * this.G4,
              U = L - _ + 3 * this.G4,
              q = S - k + 3 * this.G4,
              V = T - g + 3 * this.G4,
              j = C - x + 3 * this.G4,
              $ = L - 1 + 4 * this.G4,
              J = S - 1 + 4 * this.G4,
              W = T - 1 + 4 * this.G4,
              X = C - 1 + 4 * this.G4,
              H = 255 & O,
              Z = 255 & B,
              Q = 255 & w,
              ee = 255 & A,
              te = .6 - L * L - S * S - T * T - C * C;
          if (te < 0) r = 0;
          else {
              te *= te;
              var ie = this.perm[H + this.perm[Z + this.perm[Q + this.perm[ee]]]] % 32;
              r = te * te * (this.grad4[ie] * L + this.grad4[ie] * S + this.grad4[ie] * T + this.grad4[ie] * C)
          }
          var se = .6 - z * z - I * I - R * R - P * P;
          if (se < 0) n = 0;
          else {
              se *= se;
              var re = this.perm[H + c + this.perm[Z + l + this.perm[Q + d + this.perm[ee + u]]]] % 32;
              n = se * se * (this.grad4[re] * z + this.grad4[re] * I + this.grad4[re] * R + this.grad4[re] * P)
          }
          var ne = .6 - Y * Y - E * E - G * G - K * K;
          if (ne < 0) o = 0;
          else {
              ne *= ne;
              var oe = this.perm[H + p + this.perm[Z + y + this.perm[Q + f + this.perm[ee + m]]]] % 32;
              o = ne * ne * (this.grad4[oe] * Y + this.grad4[oe] * E + this.grad4[oe] * G + this.grad4[oe] * K)
          }
          var ae = .6 - U * U - q * q - V * V - j * j;
          if (ae < 0) a = 0;
          else {
              ae *= ae;
              var he = this.perm[H + _ + this.perm[Z + k + this.perm[Q + g + this.perm[ee + x]]]] % 32;
              a = ae * ae * (this.grad4[he] * U + this.grad4[he] * q + this.grad4[he] * V + this.grad4[he] * j)
          }
          var ce = .6 - $ * $ - J * J - W * W - X * X;
          if (ce < 0) h = 0;
          else {
              ce *= ce;
              var le = this.perm[H + 1 + this.perm[Z + 1 + this.perm[Q + 1 + this.perm[ee + 1]]]] % 32;
              h = ce * ce * (this.grad4[le] * $ + this.grad4[le] * J + this.grad4[le] * W + this.grad4[le] * X)
          }
          return 27 * (r + n + o + a + h)
      }
      noise(...e) {
          this.fResult = 0;
          let t = e[0],
              i = e[1],
              s = e[2],
              r = e[3];
          for (let n = 0; n < this.iOctaves; n++) switch (this.fFreq = this.aOctFreq[n], this.fPers = this.aOctPers[n], e.length) {
              case 4:
                  this.fResult += this.fPers * this.noise4D(this.fFreq * t, this.fFreq * i, this.fFreq * s, this.fFreq * r);
                  break;
              case 3:
                  this.fResult += this.fPers * this.noise3D(this.fFreq * t, this.fFreq * i, this.fFreq * s);
                  break;
              default:
                  this.fResult += this.fPers * this.noise2D(this.fFreq * t, this.fFreq * i)
          }
          return .5 * (this.fResult * this.fPersMax + 1)
      }
      noiseDetail(e, t) {
          this.iOctaves = e || this.iOctaves, this.fPersistence = t || this.fPersistence, this.octaveFreq()
      }
  }
}]);