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
import { Resource } from './Resource';
import { Promise } from '../Promises';
import { Sprite } from '../Drawing/Sprite';
/**
 * The [[Texture]] object allows games built in Excalibur to load image resources.
 * [[Texture]] is an [[ILoadable]] which means it can be passed to a [[Loader]]
 * to pre-load before starting a level or game.
 *
 * [[include:Textures.md]]
 */
var Texture = /** @class */ (function (_super) {
    __extends(Texture, _super);
    /**
     * @param path       Path to the image resource
     * @param bustCache  Optionally load texture with cache busting
     */
    function Texture(path, bustCache) {
        if (bustCache === void 0) { bustCache = true; }
        var _this = _super.call(this, path, 'blob', bustCache) || this;
        _this.path = path;
        _this.bustCache = bustCache;
        /**
         * A [[Promise]] that resolves when the Texture is loaded.
         */
        _this.loaded = new Promise();
        _this._isLoaded = false;
        _this._sprite = null;
        _this._sprite = new Sprite(_this, 0, 0, 0, 0);
        return _this;
    }
    /**
     * Returns true if the Texture is completely loaded and is ready
     * to be drawn.
     */
    Texture.prototype.isLoaded = function () {
        return this._isLoaded;
    };
    /**
     * Begins loading the texture and returns a promise to be resolved on completion
     */
    Texture.prototype.load = function () {
        var _this = this;
        var complete = new Promise();
        if (this.path.indexOf('data:image/') > -1) {
            this.image = new Image();
            this.image.addEventListener('load', function () {
                _this.width = _this._sprite.width = _this.image.naturalWidth;
                _this.height = _this._sprite.height = _this.image.naturalHeight;
                _this._sprite = new Sprite(_this, 0, 0, _this.width, _this.height);
                _this.loaded.resolve(_this.image);
                complete.resolve(_this.image);
            });
            this.image.src = this.path;
        }
        else {
            var loaded = _super.prototype.load.call(this);
            loaded.then(function () {
                _this.image = new Image();
                _this.image.addEventListener('load', function () {
                    _this._isLoaded = true;
                    _this.width = _this._sprite.width = _this.image.naturalWidth;
                    _this.height = _this._sprite.height = _this.image.naturalHeight;
                    _this.loaded.resolve(_this.image);
                    complete.resolve(_this.image);
                });
                _this.image.src = _super.prototype.getData.call(_this);
            }, function () {
                complete.reject('Error loading texture.');
            });
        }
        return complete;
    };
    Texture.prototype.asSprite = function () {
        return this._sprite;
    };
    return Texture;
}(Resource));
export { Texture };
//# sourceMappingURL=Texture.js.map