var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { EX_VERSION } from './';
import './Polyfill';
import { Promise } from './Promises';
import { Vector } from './Algebra';
import { UIActor } from './UIActor';
import { Actor } from './Actor';
import { Timer } from './Timer';
import { TileMap } from './TileMap';
import { Loader } from './Loader';
import { Detector } from './Util/Detector';
import { VisibleEvent, HiddenEvent, GameStartEvent, GameStopEvent, PreUpdateEvent, PostUpdateEvent, PreFrameEvent, PostFrameEvent, DeactivateEvent, ActivateEvent, PreDrawEvent, PostDrawEvent, InitializeEvent } from './Events';
import { Logger, LogLevel } from './Util/Log';
import { Color } from './Drawing/Color';
import { Scene } from './Scene';
import { Debug } from './Debug';
import { Class } from './Class';
import * as Input from './Input/Index';
import * as Util from './Util/Util';
import { BoundingBox } from './Collision/BoundingBox';
/**
 * Enum representing the different display modes available to Excalibur
 */
export var DisplayMode;
(function (DisplayMode) {
    /**
     * Show the game as full screen
     */
    DisplayMode[DisplayMode["FullScreen"] = 0] = "FullScreen";
    /**
     * Scale the game to the parent DOM container
     */
    DisplayMode[DisplayMode["Container"] = 1] = "Container";
    /**
     * Show the game as a fixed size
     */
    DisplayMode[DisplayMode["Fixed"] = 2] = "Fixed";
    /**
     * Allow the game to be positioned with the [[IEngineOptions.position]] option
     */
    DisplayMode[DisplayMode["Position"] = 3] = "Position";
})(DisplayMode || (DisplayMode = {}));
/**
 * Enum representing the different mousewheel event bubble prevention
 */
export var ScrollPreventionMode;
(function (ScrollPreventionMode) {
    /**
     * Do not prevent any page scrolling
     */
    ScrollPreventionMode[ScrollPreventionMode["None"] = 0] = "None";
    /**
     * Prevent page scroll if mouse is over the game canvas
     */
    ScrollPreventionMode[ScrollPreventionMode["Canvas"] = 1] = "Canvas";
    /**
     * Prevent all page scrolling via mouse wheel
     */
    ScrollPreventionMode[ScrollPreventionMode["All"] = 2] = "All";
})(ScrollPreventionMode || (ScrollPreventionMode = {}));
/**
 * The Excalibur Engine
 *
 * The [[Engine]] is the main driver for a game. It is responsible for
 * starting/stopping the game, maintaining state, transmitting events,
 * loading resources, and managing the scene.
 *
 * [[include:Engine.md]]
 */
var Engine = /** @class */ (function (_super) {
    __extends(Engine, _super);
    /**
     * Creates a new game using the given [[IEngineOptions]]. By default, if no options are provided,
     * the game will be rendered full screen (taking up all available browser window space).
     * You can customize the game rendering through [[IEngineOptions]].
     *
     * Example:
     *
     * ```js
     * var game = new ex.Engine({
     *   width: 0, // the width of the canvas
     *   height: 0, // the height of the canvas
     *   enableCanvasTransparency: true, // the transparencySection of the canvas
     *   canvasElementId: '', // the DOM canvas element ID, if you are providing your own
     *   displayMode: ex.DisplayMode.FullScreen, // the display mode
     *   pointerScope: ex.Input.PointerScope.Document, // the scope of capturing pointer (mouse/touch) events
     *   backgroundColor: ex.Color.fromHex('#2185d0') // background color of the engine
     * });
     *
     * // call game.start, which is a Promise
     * game.start().then(function () {
     *   // ready, set, go!
     * });
     * ```
     */
    function Engine(options) {
        var _this = _super.call(this) || this;
        _this._hasStarted = false;
        /**
         * Access Excalibur debugging functionality.
         */
        _this.debug = new Debug();
        /**
         * Gets or sets the list of post processors to apply at the end of drawing a frame (such as [[ColorBlindCorrector]])
         */
        _this.postProcessors = [];
        /**
         * Contains all the scenes currently registered with Excalibur
         */
        _this.scenes = {};
        _this._animations = [];
        /**
         * Indicates whether the engine is set to fullscreen or not
         */
        _this.isFullscreen = false;
        /**
         * Indicates the current [[DisplayMode]] of the engine.
         */
        _this.displayMode = DisplayMode.FullScreen;
        _this._suppressHiDPIScaling = false;
        _this._suppressPlayButton = false;
        /**
         * Indicates whether audio should be paused when the game is no longer visible.
         */
        _this.pauseAudioWhenHidden = true;
        /**
         * Indicates whether the engine should draw with debug information
         */
        _this.isDebug = false;
        _this.debugColor = new Color(255, 255, 255);
        /**
         * Sets the Transparency for the engine.
         */
        _this.enableCanvasTransparency = true;
        /**
         * The action to take when a fatal exception is thrown
         */
        _this.onFatalException = function (e) {
            Logger.getInstance().fatal(e);
        };
        _this._isSmoothingEnabled = true;
        _this._timescale = 1.0;
        _this._isLoading = false;
        _this._isInitialized = false;
        options = Util.extend({}, Engine._DefaultEngineOptions, options);
        // Check compatibility
        var detector = new Detector();
        if (!options.suppressMinimumBrowserFeatureDetection && !(_this._compatible = detector.test())) {
            var message = document.createElement('div');
            message.innerText = 'Sorry, your browser does not support all the features needed for Excalibur';
            document.body.appendChild(message);
            detector.failedTests.forEach(function (test) {
                var testMessage = document.createElement('div');
                testMessage.innerText = 'Browser feature missing ' + test;
                document.body.appendChild(testMessage);
            });
            if (options.canvasElementId) {
                var canvas = document.getElementById(options.canvasElementId);
                if (canvas) {
                    canvas.parentElement.removeChild(canvas);
                }
            }
            return _this;
        }
        else {
            _this._compatible = true;
        }
        // Use native console API for color fun
        if (console.log && !options.suppressConsoleBootMessage) {
            console.log("%cPowered by Excalibur.js (v" + EX_VERSION + ")", 'background: #176BAA; color: white; border-radius: 5px; padding: 15px; font-size: 1.5em; line-height: 80px;');
            console.log('\n\
      /| ________________\n\
O|===|* >________________>\n\
      \\|');
            console.log('Visit', 'http://excaliburjs.com', 'for more information');
        }
        // Suppress play button
        if (options.suppressPlayButton) {
            _this._suppressPlayButton = true;
        }
        _this._logger = Logger.getInstance();
        // If debug is enabled, let's log browser features to the console.
        if (_this._logger.defaultLevel === LogLevel.Debug) {
            detector.logBrowserFeatures();
        }
        _this._logger.debug('Building engine...');
        _this.canvasElementId = options.canvasElementId;
        if (options.canvasElementId) {
            _this._logger.debug('Using Canvas element specified: ' + options.canvasElementId);
            _this.canvas = document.getElementById(options.canvasElementId);
        }
        else {
            _this._logger.debug('Using generated canvas element');
            _this.canvas = document.createElement('canvas');
        }
        if (options.width && options.height) {
            if (options.displayMode === undefined) {
                _this.displayMode = DisplayMode.Fixed;
            }
            _this._logger.debug('Engine viewport is size ' + options.width + ' x ' + options.height);
            _this.canvas.width = options.width;
            _this.canvas.height = options.height;
        }
        else if (!options.displayMode) {
            _this._logger.debug('Engine viewport is fullscreen');
            _this.displayMode = DisplayMode.FullScreen;
        }
        if (options.backgroundColor) {
            _this.backgroundColor = options.backgroundColor.clone();
        }
        _this.enableCanvasTransparency = options.enableCanvasTransparency;
        _this._loader = new Loader();
        _this._initialize(options);
        _this.rootScene = _this.currentScene = new Scene(_this);
        _this.addScene('root', _this.rootScene);
        _this.goToScene('root');
        return _this;
    }
    Object.defineProperty(Engine.prototype, "canvasWidth", {
        /**
         * The width of the game canvas in pixels (physical width component of the
         * resolution of the canvas element)
         */
        get: function () {
            return this.canvas.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "halfCanvasWidth", {
        /**
         * Returns half width of the game canvas in pixels (half physical width component)
         */
        get: function () {
            return this.canvas.width / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "canvasHeight", {
        /**
         * The height of the game canvas in pixels, (physical height component of
         * the resolution of the canvas element)
         */
        get: function () {
            return this.canvas.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "halfCanvasHeight", {
        /**
         * Returns half height of the game canvas in pixels (half physical height component)
         */
        get: function () {
            return this.canvas.height / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "drawWidth", {
        /**
         * Returns the width of the engine's visible drawing surface in pixels including zoom and device pixel ratio.
         */
        get: function () {
            if (this.currentScene && this.currentScene.camera) {
                return this.canvasWidth / this.currentScene.camera.getZoom() / this.pixelRatio;
            }
            return this.canvasWidth / this.pixelRatio;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "halfDrawWidth", {
        /**
         * Returns half the width of the engine's visible drawing surface in pixels including zoom and device pixel ratio.
         */
        get: function () {
            return this.drawWidth / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "drawHeight", {
        /**
         * Returns the height of the engine's visible drawing surface in pixels including zoom and device pixel ratio.
         */
        get: function () {
            if (this.currentScene && this.currentScene.camera) {
                return this.canvasHeight / this.currentScene.camera.getZoom() / this.pixelRatio;
            }
            return this.canvasHeight / this.pixelRatio;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "halfDrawHeight", {
        /**
         * Returns half the height of the engine's visible drawing surface in pixels including zoom and device pixel ratio.
         */
        get: function () {
            return this.drawHeight / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "isHiDpi", {
        /**
         * Returns whether excalibur detects the current screen to be HiDPI
         */
        get: function () {
            return this.pixelRatio !== 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "stats", {
        /**
         * Access [[stats]] that holds frame statistics.
         */
        get: function () {
            return this.debug.stats;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Engine.prototype, "pixelRatio", {
        /**
         * Returns the calculated pixel ration for use in rendering
         */
        get: function () {
            if (this._suppressHiDPIScaling) {
                return 1;
            }
            if (window.devicePixelRatio < 1) {
                return 1;
            }
            var devicePixelRatio = window.devicePixelRatio || 1;
            var pixelRatio = devicePixelRatio;
            return pixelRatio;
        },
        enumerable: true,
        configurable: true
    });
    Engine.prototype.on = function (eventName, handler) {
        _super.prototype.on.call(this, eventName, handler);
    };
    Engine.prototype.once = function (eventName, handler) {
        _super.prototype.once.call(this, eventName, handler);
    };
    Engine.prototype.off = function (eventName, handler) {
        _super.prototype.off.call(this, eventName, handler);
    };
    /**
     * Returns a BoundingBox of the top left corner of the screen
     * and the bottom right corner of the screen.
     */
    Engine.prototype.getWorldBounds = function () {
        var left = this.screenToWorldCoordinates(Vector.Zero).x;
        var top = this.screenToWorldCoordinates(Vector.Zero).y;
        var right = left + this.drawWidth;
        var bottom = top + this.drawHeight;
        return new BoundingBox(left, top, right, bottom);
    };
    Object.defineProperty(Engine.prototype, "timescale", {
        /**
         * Gets the current engine timescale factor (default is 1.0 which is 1:1 time)
         */
        get: function () {
            return this._timescale;
        },
        /**
         * Sets the current engine timescale factor. Useful for creating slow-motion effects or fast-forward effects
         * when using time-based movement.
         */
        set: function (value) {
            if (value <= 0) {
                Logger.getInstance().error('Cannot set engine.timescale to a value of 0 or less than 0.');
                return;
            }
            this._timescale = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Plays a sprite animation on the screen at the specified `x` and `y`
     * (in game coordinates, not screen pixels). These animations play
     * independent of actors, and will be cleaned up internally as soon
     * as they are complete. Note animations that loop will never be
     * cleaned up.
     *
     * @param animation  Animation to play
     * @param x          x game coordinate to play the animation
     * @param y          y game coordinate to play the animation
     */
    Engine.prototype.playAnimation = function (animation, x, y) {
        this._animations.push(new AnimationNode(animation, x, y));
    };
    /**
     * Adds a [[TileMap]] to the [[currentScene]], once this is done the TileMap
     * will be drawn and updated.
     */
    Engine.prototype.addTileMap = function (tileMap) {
        this.currentScene.addTileMap(tileMap);
    };
    /**
     * Removes a [[TileMap]] from the [[currentScene]], it will no longer be drawn or updated.
     */
    Engine.prototype.removeTileMap = function (tileMap) {
        this.currentScene.removeTileMap(tileMap);
    };
    /**
     * Adds a [[Timer]] to the [[currentScene]].
     * @param timer  The timer to add to the [[currentScene]].
     */
    Engine.prototype.addTimer = function (timer) {
        return this.currentScene.addTimer(timer);
    };
    /**
     * Removes a [[Timer]] from the [[currentScene]].
     * @param timer  The timer to remove to the [[currentScene]].
     */
    Engine.prototype.removeTimer = function (timer) {
        return this.currentScene.removeTimer(timer);
    };
    /**
     * Adds a [[Scene]] to the engine, think of scenes in Excalibur as you
     * would levels or menus.
     *
     * @param key  The name of the scene, must be unique
     * @param scene The scene to add to the engine
     */
    Engine.prototype.addScene = function (key, scene) {
        if (this.scenes[key]) {
            this._logger.warn('Scene', key, 'already exists overwriting');
        }
        this.scenes[key] = scene;
    };
    /**
     * @internal
     */
    Engine.prototype.removeScene = function (entity) {
        if (entity instanceof Scene) {
            // remove scene
            for (var key in this.scenes) {
                if (this.scenes.hasOwnProperty(key)) {
                    if (this.scenes[key] === entity) {
                        delete this.scenes[key];
                    }
                }
            }
        }
        if (typeof entity === 'string') {
            // remove scene
            delete this.scenes[entity];
        }
    };
    Engine.prototype.add = function (entity) {
        if (entity instanceof UIActor) {
            this.currentScene.addUIActor(entity);
            return;
        }
        if (entity instanceof Actor) {
            this._addChild(entity);
        }
        if (entity instanceof Timer) {
            this.addTimer(entity);
        }
        if (entity instanceof TileMap) {
            this.addTileMap(entity);
        }
        if (arguments.length === 2) {
            this.addScene(arguments[0], arguments[1]);
        }
    };
    Engine.prototype.remove = function (entity) {
        if (entity instanceof UIActor) {
            this.currentScene.removeUIActor(entity);
            return;
        }
        if (entity instanceof Actor) {
            this._removeChild(entity);
        }
        if (entity instanceof Timer) {
            this.removeTimer(entity);
        }
        if (entity instanceof TileMap) {
            this.removeTileMap(entity);
        }
        if (entity instanceof Scene) {
            this.removeScene(entity);
        }
        if (typeof entity === 'string') {
            this.removeScene(entity);
        }
    };
    /**
     * Adds an actor to the [[currentScene]] of the game. This is synonymous
     * to calling `engine.currentScene.add(actor)`.
     *
     * Actors can only be drawn if they are a member of a scene, and only
     * the [[currentScene]] may be drawn or updated.
     *
     * @param actor  The actor to add to the [[currentScene]]
     */
    Engine.prototype._addChild = function (actor) {
        this.currentScene.add(actor);
    };
    /**
     * Removes an actor from the [[currentScene]] of the game. This is synonymous
     * to calling `engine.currentScene.remove(actor)`.
     * Actors that are removed from a scene will no longer be drawn or updated.
     *
     * @param actor  The actor to remove from the [[currentScene]].
     */
    Engine.prototype._removeChild = function (actor) {
        this.currentScene.remove(actor);
    };
    /**
     * Changes the currently updating and drawing scene to a different,
     * named scene. Calls the [[Scene]] lifecycle events.
     * @param key  The key of the scene to transition to.
     */
    Engine.prototype.goToScene = function (key) {
        if (this.scenes[key]) {
            var oldScene = this.currentScene;
            var newScene = this.scenes[key];
            this._logger.debug('Going to scene:', key);
            // only deactivate when initialized
            if (this.currentScene.isInitialized) {
                this.currentScene._deactivate.call(this.currentScene, [oldScene, newScene]);
                this.currentScene.eventDispatcher.emit('deactivate', new DeactivateEvent(newScene, this.currentScene));
            }
            // set current scene to new one
            this.currentScene = newScene;
            // initialize the current scene if has not been already
            this.currentScene._initialize(this);
            this.currentScene._activate.call(this.currentScene, [oldScene, newScene]);
            this.currentScene.eventDispatcher.emit('activate', new ActivateEvent(oldScene, this.currentScene));
        }
        else {
            this._logger.error('Scene', key, 'does not exist!');
        }
    };
    /**
     * Transforms the current x, y from screen coordinates to world coordinates
     * @param point  Screen coordinate to convert
     */
    Engine.prototype.screenToWorldCoordinates = function (point) {
        var newX = point.x;
        var newY = point.y;
        // transform back to world space
        newX = (newX / this.canvas.clientWidth) * this.drawWidth;
        newY = (newY / this.canvas.clientHeight) * this.drawHeight;
        // transform based on zoom
        newX = newX - this.halfDrawWidth;
        newY = newY - this.halfDrawHeight;
        // shift by focus
        if (this.currentScene && this.currentScene.camera) {
            var focus = this.currentScene.camera.getFocus();
            newX += focus.x;
            newY += focus.y;
        }
        return new Vector(Math.floor(newX), Math.floor(newY));
    };
    /**
     * Transforms a world coordinate, to a screen coordinate
     * @param point  World coordinate to convert
     */
    Engine.prototype.worldToScreenCoordinates = function (point) {
        var screenX = point.x;
        var screenY = point.y;
        // shift by focus
        if (this.currentScene && this.currentScene.camera) {
            var focus = this.currentScene.camera.getFocus();
            screenX -= focus.x;
            screenY -= focus.y;
        }
        // transform back on zoom
        screenX = screenX + this.halfDrawWidth;
        screenY = screenY + this.halfDrawHeight;
        // transform back to screen space
        screenX = (screenX * this.canvas.clientWidth) / this.drawWidth;
        screenY = (screenY * this.canvas.clientHeight) / this.drawHeight;
        return new Vector(Math.floor(screenX), Math.floor(screenY));
    };
    /**
     * Sets the internal canvas height based on the selected display mode.
     */
    Engine.prototype._setHeightByDisplayMode = function (parent) {
        if (this.displayMode === DisplayMode.Container) {
            this.canvas.width = parent.clientWidth;
            this.canvas.height = parent.clientHeight;
        }
        if (this.displayMode === DisplayMode.FullScreen) {
            document.body.style.margin = '0px';
            document.body.style.overflow = 'hidden';
            this.canvas.width = parent.innerWidth;
            this.canvas.height = parent.innerHeight;
        }
    };
    /**
     * Initializes the internal canvas, rendering context, displaymode, and native event listeners
     */
    Engine.prototype._initialize = function (options) {
        var _this = this;
        if (options.displayMode) {
            this.displayMode = options.displayMode;
        }
        if (this.displayMode === DisplayMode.FullScreen || this.displayMode === DisplayMode.Container) {
            var parent = (this.displayMode === DisplayMode.Container ? (this.canvas.parentElement || document.body) : window);
            this._setHeightByDisplayMode(parent);
            window.addEventListener('resize', function () {
                _this._logger.debug('View port resized');
                _this._setHeightByDisplayMode(parent);
                _this._logger.info('parent.clientHeight ' + parent.clientHeight);
                _this.setAntialiasing(_this._isSmoothingEnabled);
            });
        }
        else if (this.displayMode === DisplayMode.Position) {
            this._intializeDisplayModePosition(options);
        }
        // initialize inputs
        this.input = {
            keyboard: new Input.Keyboard(),
            pointers: new Input.Pointers(this),
            gamepads: new Input.Gamepads()
        };
        this.input.keyboard.init();
        this.input.pointers.init(options && options.pointerScope === Input.PointerScope.Document ? document : this.canvas);
        this.input.gamepads.init();
        this.pageScrollPreventionMode = options.scrollPreventionMode;
        // Issue #385 make use of the visibility api
        // https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
        var hidden, visibilityChange;
        if (typeof document.hidden !== 'undefined') {
            // Opera 12.10 and Firefox 18 and later support
            hidden = 'hidden';
            visibilityChange = 'visibilitychange';
        }
        else if ('msHidden' in document) {
            hidden = 'msHidden';
            visibilityChange = 'msvisibilitychange';
        }
        else if ('webkitHidden' in document) {
            hidden = 'webkitHidden';
            visibilityChange = 'webkitvisibilitychange';
        }
        document.addEventListener(visibilityChange, function () {
            if (document[hidden]) {
                _this.eventDispatcher.emit('hidden', new HiddenEvent(_this));
                _this._logger.debug('Window hidden');
            }
            else {
                _this.eventDispatcher.emit('visible', new VisibleEvent(_this));
                _this._logger.debug('Window visible');
            }
        });
        this.ctx = this.canvas.getContext('2d', { alpha: this.enableCanvasTransparency });
        this._suppressHiDPIScaling = !!options.suppressHiDPIScaling;
        if (!options.suppressHiDPIScaling) {
            this._initializeHiDpi();
        }
        if (!this.canvasElementId) {
            document.body.appendChild(this.canvas);
        }
    };
    Engine.prototype.onInitialize = function (_engine) {
        // Override me
    };
    Engine.prototype._intializeDisplayModePosition = function (options) {
        if (!options.position) {
            throw new Error('DisplayMode of Position was selected but no position option was given');
        }
        else {
            this.canvas.style.display = 'block';
            this.canvas.style.position = 'absolute';
            if (typeof options.position === 'string') {
                var specifiedPosition = options.position.split(' ');
                switch (specifiedPosition[0]) {
                    case 'top':
                        this.canvas.style.top = '0px';
                        break;
                    case 'bottom':
                        this.canvas.style.bottom = '0px';
                        break;
                    case 'middle':
                        this.canvas.style.top = '50%';
                        var offsetY = -this.halfDrawHeight;
                        this.canvas.style.marginTop = offsetY.toString();
                        break;
                    default:
                        throw new Error('Invalid Position Given');
                }
                if (specifiedPosition[1]) {
                    switch (specifiedPosition[1]) {
                        case 'left':
                            this.canvas.style.left = '0px';
                            break;
                        case 'right':
                            this.canvas.style.right = '0px';
                            break;
                        case 'center':
                            this.canvas.style.left = '50%';
                            var offsetX = -this.halfDrawWidth;
                            this.canvas.style.marginLeft = offsetX.toString();
                            break;
                        default:
                            throw new Error('Invalid Position Given');
                    }
                }
            }
            else {
                if (options.position.top) {
                    typeof options.position.top === 'number'
                        ? (this.canvas.style.top = options.position.top.toString() + 'px')
                        : (this.canvas.style.top = options.position.top);
                }
                if (options.position.right) {
                    typeof options.position.right === 'number'
                        ? (this.canvas.style.right = options.position.right.toString() + 'px')
                        : (this.canvas.style.right = options.position.right);
                }
                if (options.position.bottom) {
                    typeof options.position.bottom === 'number'
                        ? (this.canvas.style.bottom = options.position.bottom.toString() + 'px')
                        : (this.canvas.style.bottom = options.position.bottom);
                }
                if (options.position.left) {
                    typeof options.position.left === 'number'
                        ? (this.canvas.style.left = options.position.left.toString() + 'px')
                        : (this.canvas.style.left = options.position.left);
                }
            }
        }
    };
    Engine.prototype._initializeHiDpi = function () {
        // Scale the canvas if needed
        if (this.isHiDpi) {
            var oldWidth = this.canvas.width;
            var oldHeight = this.canvas.height;
            this.canvas.width = oldWidth * this.pixelRatio;
            this.canvas.height = oldHeight * this.pixelRatio;
            this.canvas.style.width = oldWidth + 'px';
            this.canvas.style.height = oldHeight + 'px';
            this._logger.warn("Hi DPI screen detected, resetting canvas resolution from \n                           " + oldWidth + "x" + oldHeight + " to " + this.canvas.width + "x" + this.canvas.height + " \n                           css size will remain " + oldWidth + "x" + oldHeight);
            this.ctx.scale(this.pixelRatio, this.pixelRatio);
            this._logger.warn("Canvas drawing context was scaled by " + this.pixelRatio);
        }
    };
    /**
     * If supported by the browser, this will set the antialiasing flag on the
     * canvas. Set this to `false` if you want a 'jagged' pixel art look to your
     * image resources.
     * @param isSmooth  Set smoothing to true or false
     */
    Engine.prototype.setAntialiasing = function (isSmooth) {
        this._isSmoothingEnabled = isSmooth;
        var ctx = this.ctx;
        ctx.imageSmoothingEnabled = isSmooth;
        for (var _i = 0, _a = ['webkitImageSmoothingEnabled', 'mozImageSmoothingEnabled', 'msImageSmoothingEnabled']; _i < _a.length; _i++) {
            var smoothing = _a[_i];
            if (smoothing in ctx) {
                ctx[smoothing] = isSmooth;
            }
        }
    };
    /**
     * Return the current smoothing status of the canvas
     */
    Engine.prototype.getAntialiasing = function () {
        return (this.ctx.imageSmoothingEnabled ||
            this.ctx.webkitImageSmoothingEnabled ||
            this.ctx.mozImageSmoothingEnabled ||
            this.ctx.msImageSmoothingEnabled);
    };
    Object.defineProperty(Engine.prototype, "isInitialized", {
        /**
         * Gets whether the actor is Initialized
         */
        get: function () {
            return this._isInitialized;
        },
        enumerable: true,
        configurable: true
    });
    Engine.prototype._overrideInitialize = function (engine) {
        if (!this.isInitialized) {
            this.onInitialize(engine);
            _super.prototype.emit.call(this, 'initialize', new InitializeEvent(engine, this));
            this._isInitialized = true;
        }
    };
    /**
     * Updates the entire state of the game
     * @param delta  Number of milliseconds elapsed since the last update.
     */
    Engine.prototype._update = function (delta) {
        if (this._isLoading) {
            // suspend updates untill loading is finished
            this._loader.update(this, delta);
            // Update input listeners
            this.input.keyboard.update();
            this.input.pointers.update();
            this.input.gamepads.update();
            return;
        }
        this._overrideInitialize(this);
        // Publish preupdate events
        this._preupdate(delta);
        // process engine level events
        this.currentScene.update(this, delta);
        // update animations
        this._animations = this._animations.filter(function (a) {
            return !a.animation.isDone();
        });
        // Update input listeners
        this.input.keyboard.update();
        this.input.pointers.update();
        this.input.gamepads.update();
        // Publish update event
        this._postupdate(delta);
    };
    /**
     * @internal
     */
    Engine.prototype._preupdate = function (delta) {
        this.emit('preupdate', new PreUpdateEvent(this, delta, this));
        this.onPreUpdate(this, delta);
    };
    Engine.prototype.onPreUpdate = function (_engine, _delta) {
        // Override me
    };
    /**
     * @internal
     */
    Engine.prototype._postupdate = function (delta) {
        this.emit('postupdate', new PostUpdateEvent(this, delta, this));
        this.onPostUpdate(this, delta);
    };
    Engine.prototype.onPostUpdate = function (_engine, _delta) {
        // Override me
    };
    /**
     * Draws the entire game
     * @param delta  Number of milliseconds elapsed since the last draw.
     */
    Engine.prototype._draw = function (delta) {
        var ctx = this.ctx;
        this._predraw(ctx, delta);
        if (this._isLoading) {
            this._loader.draw(ctx, delta);
            // Drawing nothing else while loading
            return;
        }
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        ctx.fillStyle = this.backgroundColor.toString();
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.currentScene.draw(this.ctx, delta);
        // todo needs to be a better way of doing this
        var a = 0, len = this._animations.length;
        for (a; a < len; a++) {
            this._animations[a].animation.draw(ctx, this._animations[a].x, this._animations[a].y);
        }
        // Draw debug information
        if (this.isDebug) {
            this.ctx.font = 'Consolas';
            this.ctx.fillStyle = this.debugColor.toString();
            var keys = this.input.keyboard.getKeys();
            for (var j = 0; j < keys.length; j++) {
                this.ctx.fillText(keys[j].toString() + ' : ' + (Input.Keys[keys[j]] ? Input.Keys[keys[j]] : 'Not Mapped'), 100, 10 * j + 10);
            }
            this.ctx.fillText('FPS:' + this.stats.currFrame.fps.toFixed(2).toString(), 10, 10);
        }
        // Post processing
        for (var i = 0; i < this.postProcessors.length; i++) {
            this.postProcessors[i].process(this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight), this.ctx);
        }
        this._postdraw(ctx, delta);
    };
    /**
     * @internal
     */
    Engine.prototype._predraw = function (_ctx, delta) {
        this.emit('predraw', new PreDrawEvent(_ctx, delta, this));
        this.onPreDraw(_ctx, delta);
    };
    Engine.prototype.onPreDraw = function (_ctx, _delta) {
        // Override me
    };
    /**
     * @internal
     */
    Engine.prototype._postdraw = function (_ctx, delta) {
        this.emit('postdraw', new PostDrawEvent(_ctx, delta, this));
        this.onPostDraw(_ctx, delta);
    };
    Engine.prototype.onPostDraw = function (_ctx, _delta) {
        // Override me
    };
    /**
     * Starts the internal game loop for Excalibur after loading
     * any provided assets.
     * @param loader  Optional [[ILoader]] to use to load resources. The default loader is [[Loader]], override to provide your own
     * custom loader.
     */
    Engine.prototype.start = function (loader) {
        var _this = this;
        if (!this._compatible) {
            var promise = new Promise();
            return promise.reject('Excalibur is incompatible with your browser');
        }
        var loadingComplete;
        if (loader) {
            this._loader = loader;
            this._loader.suppressPlayButton = this._suppressPlayButton || this._loader.suppressPlayButton;
            this._loader.wireEngine(this);
            loadingComplete = this.load(this._loader);
        }
        else {
            loadingComplete = Promise.resolve();
        }
        loadingComplete.then(function () {
            _this.emit('start', new GameStartEvent(_this));
        });
        if (!this._hasStarted) {
            this._hasStarted = true;
            this._logger.debug('Starting game...');
            Engine.createMainLoop(this, window.requestAnimationFrame, Date.now)();
            this._logger.debug('Game started');
        }
        else {
            // Game already started;
        }
        return loadingComplete;
    };
    Engine.createMainLoop = function (game, raf, nowFn) {
        var lastTime = nowFn();
        return function mainloop() {
            if (!game._hasStarted) {
                return;
            }
            try {
                game._requestId = raf(mainloop);
                game.emit('preframe', new PreFrameEvent(game, game.stats.prevFrame));
                // Get the time to calculate time-elapsed
                var now = nowFn();
                var elapsed = Math.floor(now - lastTime) || 1;
                // Resolves issue #138 if the game has been paused, or blurred for
                // more than a 200 milliseconds, reset elapsed time to 1. This improves reliability
                // and provides more expected behavior when the engine comes back
                // into focus
                if (elapsed > 200) {
                    elapsed = 1;
                }
                var delta = elapsed * game.timescale;
                // reset frame stats (reuse existing instances)
                var frameId = game.stats.prevFrame.id + 1;
                game.stats.prevFrame.reset(game.stats.currFrame);
                game.stats.currFrame.reset();
                game.stats.currFrame.id = frameId;
                game.stats.currFrame.delta = delta;
                game.stats.currFrame.fps = 1.0 / (delta / 1000);
                var beforeUpdate = nowFn();
                game._update(delta);
                var afterUpdate = nowFn();
                game._draw(delta);
                var afterDraw = nowFn();
                game.stats.currFrame.duration.update = afterUpdate - beforeUpdate;
                game.stats.currFrame.duration.draw = afterDraw - afterUpdate;
                lastTime = now;
                game.emit('postframe', new PostFrameEvent(game, game.stats.currFrame));
            }
            catch (e) {
                window.cancelAnimationFrame(game._requestId);
                game.stop();
                game.onFatalException(e);
            }
        };
    };
    /**
     * Stops Excalibur's main loop, useful for pausing the game.
     */
    Engine.prototype.stop = function () {
        if (this._hasStarted) {
            this.emit('stop', new GameStopEvent(this));
            this._hasStarted = false;
            this._logger.debug('Game stopped');
        }
    };
    /**
     * Returns the Engine's Running status, Useful for checking whether engine is running or paused.
     */
    Engine.prototype.isPaused = function () {
        return !this._hasStarted;
    };
    /**
     * Takes a screen shot of the current viewport and returns it as an
     * HTML Image Element.
     */
    Engine.prototype.screenshot = function () {
        var result = new Image();
        var raw = this.canvas.toDataURL('image/png');
        result.src = raw;
        return result;
    };
    /**
     * Another option available to you to load resources into the game.
     * Immediately after calling this the game will pause and the loading screen
     * will appear.
     * @param loader  Some [[ILoadable]] such as a [[Loader]] collection, [[Sound]], or [[Texture]].
     */
    Engine.prototype.load = function (loader) {
        var _this = this;
        var complete = new Promise();
        this._isLoading = true;
        loader.load().then(function () {
            if (_this._suppressPlayButton) {
                setTimeout(function () {
                    _this._isLoading = false;
                    complete.resolve();
                    // Delay is to give the logo a chance to show, otherwise don't delay
                }, 500);
            }
            else {
                _this._isLoading = false;
                complete.resolve();
            }
        });
        return complete;
    };
    /**
     * Default [[IEngineOptions]]
     */
    Engine._DefaultEngineOptions = {
        width: 0,
        height: 0,
        enableCanvasTransparency: true,
        canvasElementId: '',
        pointerScope: Input.PointerScope.Document,
        suppressConsoleBootMessage: null,
        suppressMinimumBrowserFeatureDetection: null,
        suppressHiDPIScaling: null,
        suppressPlayButton: null,
        scrollPreventionMode: ScrollPreventionMode.Canvas,
        backgroundColor: Color.fromHex('#2185d0') // Excalibur blue
    };
    return Engine;
}(Class));
export { Engine };
/**
 * @internal
 */
var AnimationNode = /** @class */ (function () {
    function AnimationNode(animation, x, y) {
        this.animation = animation;
        this.x = x;
        this.y = y;
    }
    return AnimationNode;
}());
//# sourceMappingURL=Engine.js.map