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
import { Color } from './Drawing/Color';
import { WebAudio } from './Util/WebAudio';
import { Logger } from './Util/Log';
import { Promise, PromiseState } from './Promises';
import { Class } from './Class';
import * as DrawUtil from './Util/DrawUtil';
import logoImg from './Loader.logo.png';
import loaderCss from './Loader.css';
/**
 * Pre-loading assets
 *
 * The loader provides a mechanism to preload multiple resources at
 * one time. The loader must be passed to the engine in order to
 * trigger the loading progress bar.
 *
 * The [[Loader]] itself implements [[ILoadable]] so you can load loaders.
 *
 * ## Example: Pre-loading resources for a game
 *
 * ```js
 * // create a loader
 * var loader = new ex.Loader();
 *
 * // create a resource dictionary (best practice is to keep a separate file)
 * var resources = {
 *   TextureGround: new ex.Texture("/images/textures/ground.png"),
 *   SoundDeath: new ex.Sound("/sound/death.wav", "/sound/death.mp3")
 * };
 *
 * // loop through dictionary and add to loader
 * for (var loadable in resources) {
 *   if (resources.hasOwnProperty(loadable)) {
 *     loader.addResource(resources[loadable]);
 *   }
 * }
 *
 * // start game
 * game.start(loader).then(function () {
 *   console.log("Game started!");
 * });
 * ```
 *
 * ## Customize the Loader
 *
 * The loader can be customized to show different, text, logo, background color, and button.
 *
 * ```typescript
 * var loader = new ex.Loader([playerTexture]);
 *
 * // The loaders button text can simply modified using this
 * loader.playButtonText = 'Start the best game ever';
 *
 * // The logo can be changed by inserting a base64 image string here
 *
 * loader.logo = 'data:image/png;base64,iVBORw...';
 * loader.logoWidth = 15;
 * loader.logoHeight = 14;
 *
 * // The background color can be changed like so by supplying a valid CSS color string
 *
 * loader.backgroundColor = 'red'
 * loader.backgroundColor = '#176BAA'
 *
 * // To build a completely new button
 * loader.startButtonFactory = () => {
 *     let myButton = document.createElement('button');
 *     myButton.textContent = 'The best button';
 *     return myButton;
 * };
 *
 * engine.start(loader).then(() => {});
 * ```
 */
var Loader = /** @class */ (function (_super) {
    __extends(Loader, _super);
    /**
     * @param loadables  Optionally provide the list of resources you want to load at constructor time
     */
    function Loader(loadables) {
        var _this = _super.call(this) || this;
        _this._resourceList = [];
        _this._index = 0;
        _this._playButtonShown = false;
        _this._resourceCount = 0;
        _this._numLoaded = 0;
        _this._progressCounts = {};
        _this._totalCounts = {};
        // logo drawing stuff
        // base64 string encoding of the excalibur logo (logo-white.png)
        _this.logo = logoImg;
        _this.logoWidth = 468;
        _this.logoHeight = 118;
        _this.backgroundColor = '#176BAA';
        _this.suppressPlayButton = false;
        /** Loads the css from Loader.css */
        _this._playButtonStyles = loaderCss.toString();
        /**
         * Get/set play button text
         */
        _this.playButtonText = 'Play game';
        /**
         * Return a html button element for excalibur to use as a play button
         */
        _this.startButtonFactory = function () {
            var buttonElement = document.createElement('button');
            buttonElement.id = 'excalibur-play';
            buttonElement.textContent = _this.playButtonText;
            buttonElement.style.display = 'none';
            return buttonElement;
        };
        _this.getData = function () {
            return;
        };
        _this.setData = function () {
            return;
        };
        _this.processData = function () {
            return;
        };
        _this.onprogress = function (e) {
            Logger.getInstance().debug('[ex.Loader] Loading ' + ((100 * e.loaded) / e.total).toFixed(0));
            return;
        };
        _this.oncomplete = function () {
            return;
        };
        _this.onerror = function () {
            return;
        };
        if (loadables) {
            _this.addResources(loadables);
        }
        return _this;
    }
    Object.defineProperty(Loader.prototype, "_image", {
        get: function () {
            if (!this._imageElement) {
                this._imageElement = new Image();
                this._imageElement.src = this.logo;
            }
            return this._imageElement;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Loader.prototype, "_playButton", {
        get: function () {
            if (!this._playButtonRootElement) {
                this._playButtonRootElement = document.createElement('div');
                this._playButtonRootElement.style.position = 'absolute';
                document.body.appendChild(this._playButtonRootElement);
            }
            if (!this._styleBlock) {
                this._styleBlock = document.createElement('style');
                this._styleBlock.textContent = this._playButtonStyles;
                document.head.appendChild(this._styleBlock);
            }
            if (!this._playButtonElement) {
                this._playButtonElement = this.startButtonFactory();
                this._playButtonRootElement.appendChild(this._playButtonElement);
            }
            return this._playButtonElement;
        },
        enumerable: true,
        configurable: true
    });
    Loader.prototype.wireEngine = function (engine) {
        this._engine = engine;
    };
    /**
     * Add a resource to the loader to load
     * @param loadable  Resource to add
     */
    Loader.prototype.addResource = function (loadable) {
        var key = this._index++;
        this._resourceList.push(loadable);
        this._progressCounts[key] = 0;
        this._totalCounts[key] = 1;
        this._resourceCount++;
    };
    /**
     * Add a list of resources to the loader to load
     * @param loadables  The list of resources to load
     */
    Loader.prototype.addResources = function (loadables) {
        var i = 0, len = loadables.length;
        for (i; i < len; i++) {
            this.addResource(loadables[i]);
        }
    };
    /**
     * Returns true if the loader has completely loaded all resources
     */
    Loader.prototype.isLoaded = function () {
        return this._numLoaded === this._resourceCount;
    };
    /**
     * Shows the play button and returns a promise that resolves when clicked
     */
    Loader.prototype.showPlayButton = function () {
        if (this.suppressPlayButton) {
            return Promise.resolve();
        }
        else {
            this._playButtonShown = true;
            this._playButton.style.display = 'block';
            var promise_1 = new Promise();
            this._playButton.addEventListener('click', function () { return (promise_1.state() === PromiseState.Pending ? promise_1.resolve() : promise_1); });
            this._playButton.addEventListener('touchend', function () { return (promise_1.state() === PromiseState.Pending ? promise_1.resolve() : promise_1); });
            this._playButton.addEventListener('pointerup', function () { return (promise_1.state() === PromiseState.Pending ? promise_1.resolve() : promise_1); });
            return promise_1;
        }
    };
    Loader.prototype.hidePlayButton = function () {
        this._playButtonShown = false;
        this._playButton.style.display = 'none';
    };
    /**
     * Begin loading all of the supplied resources, returning a promise
     * that resolves when loading of all is complete
     */
    Loader.prototype.load = function () {
        var _this = this;
        var complete = new Promise();
        var me = this;
        if (this._resourceList.length === 0) {
            me.showPlayButton().then(function () {
                // Unlock audio context in chrome after user gesture
                // https://github.com/excaliburjs/Excalibur/issues/262
                // https://github.com/excaliburjs/Excalibur/issues/1031
                WebAudio.unlock().then(function () {
                    me.hidePlayButton();
                    me.oncomplete.call(me);
                    complete.resolve();
                });
            });
            return complete;
        }
        var progressArray = new Array(this._resourceList.length);
        var progressChunks = this._resourceList.length;
        this._resourceList.forEach(function (r, i) {
            if (_this._engine) {
                r.wireEngine(_this._engine);
            }
            r.onprogress = function (e) {
                var total = e.total;
                var loaded = e.loaded;
                progressArray[i] = { loaded: (loaded / total) * (100 / progressChunks), total: 100 };
                var progressResult = progressArray.reduce(function (accum, next) {
                    return { loaded: accum.loaded + next.loaded, total: 100 };
                }, { loaded: 0, total: 100 });
                me.onprogress.call(me, progressResult);
            };
            r.oncomplete = r.onerror = function () {
                me._numLoaded++;
                if (me._numLoaded === me._resourceCount) {
                    setTimeout(function () {
                        me.showPlayButton().then(function () {
                            // Unlock audio context in chrome after user gesture
                            // https://github.com/excaliburjs/Excalibur/issues/262
                            // https://github.com/excaliburjs/Excalibur/issues/1031
                            WebAudio.unlock().then(function () {
                                me.hidePlayButton();
                                me.oncomplete.call(me);
                                complete.resolve();
                            });
                        });
                    }, 200); // short delay in showing the button for aesthetics
                }
            };
        });
        function loadNext(list, index) {
            if (!list[index]) {
                return;
            }
            list[index].load().then(function () {
                loadNext(list, index + 1);
            });
        }
        loadNext(this._resourceList, 0);
        return complete;
    };
    /**
     * Loader draw function. Draws the default Excalibur loading screen.
     * Override `logo`, `logoWidth`, `logoHeight` and `backgroundColor` properties
     * to customize the drawing, or just override entire method.
     */
    Loader.prototype.draw = function (ctx) {
        var canvasHeight = this._engine.canvasHeight / window.devicePixelRatio;
        var canvasWidth = this._engine.canvasWidth / window.devicePixelRatio;
        if (this._playButtonRootElement) {
            var left = ctx.canvas.offsetLeft;
            var top_1 = ctx.canvas.offsetTop;
            var buttonWidth = this._playButton.clientWidth;
            var buttonHeight = this._playButton.clientHeight;
            this._playButtonRootElement.style.left = left + canvasWidth / 2 - buttonWidth / 2 + "px";
            this._playButtonRootElement.style.top = top_1 + canvasHeight / 2 - buttonHeight / 2 + 100 + "px";
        }
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        var y = canvasHeight / 2;
        var width = Math.min(this.logoWidth, canvasWidth * 0.75);
        var x = canvasWidth / 2 - width / 2;
        var imageHeight = Math.floor(width * (this.logoHeight / this.logoWidth)); // OG height/width factor
        var oldAntialias = this._engine.getAntialiasing();
        this._engine.setAntialiasing(true);
        ctx.drawImage(this._image, 0, 0, this.logoWidth, this.logoHeight, x, y - imageHeight - 20, width, imageHeight);
        // loading box
        if (!this.suppressPlayButton && this._playButtonShown) {
            this._engine.setAntialiasing(oldAntialias);
            return;
        }
        ctx.lineWidth = 2;
        DrawUtil.roundRect(ctx, x, y, width, 20, 10);
        var progress = width * (this._numLoaded / this._resourceCount);
        var margin = 5;
        var progressWidth = progress - margin * 2;
        var height = 20 - margin * 2;
        DrawUtil.roundRect(ctx, x + margin, y + margin, progressWidth > 0 ? progressWidth : 0, height, 5, null, Color.White);
        this._engine.setAntialiasing(oldAntialias);
    };
    /**
     * Perform any calculations or logic in the `update` method. The default `Loader` does not
     * do anything in this method so it is safe to override.
     */
    Loader.prototype.update = function (_engine, _delta) {
        // overridable update
    };
    return Loader;
}(Class));
export { Loader };
//# sourceMappingURL=Loader.js.map