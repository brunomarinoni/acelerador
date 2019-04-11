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
import * as Effects from './SpriteEffects';
import { Color } from './Color';
import { Texture } from '../Resources/Texture';
import { Vector } from '../Algebra';
import { Logger } from '../Util/Log';
import { clamp } from '../Util/Util';
import { Configurable } from '../Configurable';
/**
 * @hidden
 */
var SpriteImpl = /** @class */ (function () {
    /**
     * @param image   The backing image texture to build the Sprite
     * @param x      The x position of the sprite
     * @param y      The y position of the sprite
     * @param width  The width of the sprite in pixels
     * @param height The height of the sprite in pixels
     */
    function SpriteImpl(imageOrConfig, x, y, width, height) {
        var _this = this;
        this.x = 0;
        this.y = 0;
        this.rotation = 0.0;
        this.anchor = new Vector(0.0, 0.0);
        this.scale = new Vector(1, 1);
        this.logger = Logger.getInstance();
        /**
         * Draws the sprite flipped vertically
         */
        this.flipVertical = false;
        /**
         * Draws the sprite flipped horizontally
         */
        this.flipHorizontal = false;
        this.effects = [];
        this.width = 0;
        this.height = 0;
        this._spriteCanvas = null;
        this._spriteCtx = null;
        this._pixelData = null;
        this._pixelsLoaded = false;
        this._dirtyEffect = false;
        var image = imageOrConfig;
        if (imageOrConfig && !(imageOrConfig instanceof Texture)) {
            x = imageOrConfig.x | 0;
            y = imageOrConfig.y | 0;
            width = imageOrConfig.width | 0;
            height = imageOrConfig.height | 0;
            image = imageOrConfig.image;
            if (!image) {
                var message = 'An image texture is required to contsruct a sprite';
                throw new Error(message);
            }
        }
        this.x = x || 0;
        this.y = y || 0;
        this._texture = image;
        this._spriteCanvas = document.createElement('canvas');
        this._spriteCanvas.width = width;
        this._spriteCanvas.height = height;
        this._spriteCtx = this._spriteCanvas.getContext('2d');
        this._texture.loaded
            .then(function () {
            _this.width = _this.width || _this._texture.image.naturalWidth;
            _this.height = _this.height || _this._texture.image.naturalHeight;
            _this._spriteCanvas.width = _this._spriteCanvas.width || _this._texture.image.naturalWidth;
            _this._spriteCanvas.height = _this._spriteCanvas.height || _this._texture.image.naturalHeight;
            _this._loadPixels();
            _this._dirtyEffect = true;
        })
            .error(function (e) {
            _this.logger.error('Error loading texture ', _this._texture.path, e);
        });
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(SpriteImpl.prototype, "drawWidth", {
        get: function () {
            return this.width * this.scale.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpriteImpl.prototype, "drawHeight", {
        get: function () {
            return this.height * this.scale.y;
        },
        enumerable: true,
        configurable: true
    });
    SpriteImpl.prototype._loadPixels = function () {
        if (this._texture.isLoaded() && !this._pixelsLoaded) {
            var naturalWidth = this._texture.image.naturalWidth || 0;
            var naturalHeight = this._texture.image.naturalHeight || 0;
            if (this.width > naturalWidth) {
                this.logger.warn("The sprite width " + this.width + " exceeds the width \n                              " + naturalWidth + " of the backing texture " + this._texture.path);
            }
            if (this.width <= 0 || naturalWidth <= 0) {
                throw new Error("The width of a sprite cannot be 0 or negative, sprite width: " + this.width + ", original width: " + naturalWidth);
            }
            if (this.height > naturalHeight) {
                this.logger.warn("The sprite height " + this.height + " exceeds the height \n                              " + naturalHeight + " of the backing texture " + this._texture.path);
            }
            if (this.height <= 0 || naturalHeight <= 0) {
                throw new Error("The height of a sprite cannot be 0 or negative, sprite height: " + this.height + ", original height: " + naturalHeight);
            }
            this._spriteCtx.drawImage(this._texture.image, clamp(this.x, 0, naturalWidth), clamp(this.y, 0, naturalHeight), clamp(this.width, 0, naturalWidth), clamp(this.height, 0, naturalHeight), 0, 0, this.width, this.height);
            this._pixelsLoaded = true;
        }
    };
    /**
     * Applies the [[Opacity]] effect to a sprite, setting the alpha of all pixels to a given value
     */
    SpriteImpl.prototype.opacity = function (value) {
        this.addEffect(new Effects.Opacity(value));
    };
    /**
     * Applies the [[Grayscale]] effect to a sprite, removing color information.
     */
    SpriteImpl.prototype.grayscale = function () {
        this.addEffect(new Effects.Grayscale());
    };
    /**
     * Applies the [[Invert]] effect to a sprite, inverting the pixel colors.
     */
    SpriteImpl.prototype.invert = function () {
        this.addEffect(new Effects.Invert());
    };
    /**
     * Applies the [[Fill]] effect to a sprite, changing the color channels of all non-transparent pixels to match a given color
     */
    SpriteImpl.prototype.fill = function (color) {
        this.addEffect(new Effects.Fill(color));
    };
    /**
     * Applies the [[Colorize]] effect to a sprite, changing the color channels of all pixels to be the average of the original color
     * and the provided color.
     */
    SpriteImpl.prototype.colorize = function (color) {
        this.addEffect(new Effects.Colorize(color));
    };
    /**
     * Applies the [[Lighten]] effect to a sprite, changes the lightness of the color according to HSL
     */
    SpriteImpl.prototype.lighten = function (factor) {
        if (factor === void 0) { factor = 0.1; }
        this.addEffect(new Effects.Lighten(factor));
    };
    /**
     * Applies the [[Darken]] effect to a sprite, changes the darkness of the color according to HSL
     */
    SpriteImpl.prototype.darken = function (factor) {
        if (factor === void 0) { factor = 0.1; }
        this.addEffect(new Effects.Darken(factor));
    };
    /**
     * Applies the [[Saturate]] effect to a sprite, saturates the color according to HSL
     */
    SpriteImpl.prototype.saturate = function (factor) {
        if (factor === void 0) { factor = 0.1; }
        this.addEffect(new Effects.Saturate(factor));
    };
    /**
     * Applies the [[Desaturate]] effect to a sprite, desaturates the color according to HSL
     */
    SpriteImpl.prototype.desaturate = function (factor) {
        if (factor === void 0) { factor = 0.1; }
        this.addEffect(new Effects.Desaturate(factor));
    };
    /**
     * Adds a new [[ISpriteEffect]] to this drawing.
     * @param effect  Effect to add to the this drawing
     */
    SpriteImpl.prototype.addEffect = function (effect) {
        this.effects.push(effect);
        // We must check if the texture and the backing sprite pixels are loaded as well before
        // an effect can be applied
        if (!this._texture.isLoaded() || !this._pixelsLoaded) {
            this._dirtyEffect = true;
        }
        else {
            this._applyEffects();
        }
    };
    SpriteImpl.prototype.removeEffect = function (param) {
        var indexToRemove = -1;
        if (typeof param === 'number') {
            indexToRemove = param;
        }
        else {
            indexToRemove = this.effects.indexOf(param);
        }
        // bounds check
        if (indexToRemove < 0 || indexToRemove >= this.effects.length) {
            return;
        }
        this.effects.splice(indexToRemove, 1);
        // We must check if the texture and the backing sprite pixels are loaded as well before
        // an effect can be applied
        if (!this._texture.isLoaded() || !this._pixelsLoaded) {
            this._dirtyEffect = true;
        }
        else {
            this._applyEffects();
        }
    };
    SpriteImpl.prototype._applyEffects = function () {
        var naturalWidth = this._texture.image.naturalWidth || 0;
        var naturalHeight = this._texture.image.naturalHeight || 0;
        this._spriteCtx.clearRect(0, 0, this.width, this.height);
        this._spriteCtx.drawImage(this._texture.image, clamp(this.x, 0, naturalWidth), clamp(this.y, 0, naturalHeight), clamp(this.width, 0, naturalWidth), clamp(this.height, 0, naturalHeight), 0, 0, this.width, this.height);
        this._pixelData = this._spriteCtx.getImageData(0, 0, this.width, this.height);
        var i = 0, x = 0, y = 0, len = this.effects.length;
        for (i; i < len; i++) {
            y = 0;
            for (y; y < this.height; y++) {
                x = 0;
                for (x; x < this.width; x++) {
                    this.effects[i].updatePixel(x, y, this._pixelData);
                }
            }
        }
        this._spriteCtx.clearRect(0, 0, this.width, this.height);
        this._spriteCtx.putImageData(this._pixelData, 0, 0);
        this._dirtyEffect = false;
    };
    /**
     * Clears all effects from the drawing and return it to its original state.
     */
    SpriteImpl.prototype.clearEffects = function () {
        this.effects.length = 0;
        this._applyEffects();
    };
    /**
     * Resets the internal state of the drawing (if any)
     */
    SpriteImpl.prototype.reset = function () {
        // do nothing
    };
    SpriteImpl.prototype.debugDraw = function (ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.rotation);
        var xpoint = this.drawWidth * this.anchor.x;
        var ypoint = this.drawHeight * this.anchor.y;
        ctx.strokeStyle = Color.Black.toString();
        ctx.strokeRect(-xpoint, -ypoint, this.drawWidth, this.drawHeight);
        ctx.restore();
    };
    /**
     * Draws the sprite appropriately to the 2D rendering context, at an x and y coordinate.
     * @param ctx  The 2D rendering context
     * @param x    The x coordinate of where to draw
     * @param y    The y coordinate of where to draw
     */
    SpriteImpl.prototype.draw = function (ctx, x, y) {
        if (this._dirtyEffect) {
            this._applyEffects();
        }
        // calculating current dimensions
        ctx.save();
        var xpoint = this.drawWidth * this.anchor.x;
        var ypoint = this.drawHeight * this.anchor.y;
        ctx.translate(x, y);
        ctx.rotate(this.rotation);
        // todo cache flipped sprites
        if (this.flipHorizontal) {
            ctx.translate(this.drawWidth, 0);
            ctx.scale(-1, 1);
        }
        if (this.flipVertical) {
            ctx.translate(0, this.drawHeight);
            ctx.scale(1, -1);
        }
        ctx.drawImage(this._spriteCanvas, 0, 0, this.width, this.height, -xpoint, -ypoint, this.drawWidth, this.drawHeight);
        ctx.restore();
    };
    /**
     * Produces a copy of the current sprite
     */
    SpriteImpl.prototype.clone = function () {
        var result = new Sprite(this._texture, this.x, this.y, this.width, this.height);
        result.scale = this.scale.clone();
        result.rotation = this.rotation;
        result.flipHorizontal = this.flipHorizontal;
        result.flipVertical = this.flipVertical;
        var i = 0, len = this.effects.length;
        for (i; i < len; i++) {
            result.addEffect(this.effects[i]);
        }
        return result;
    };
    return SpriteImpl;
}());
export { SpriteImpl };
/**
 * A [[Sprite]] is one of the main drawing primitives. It is responsible for drawing
 * images or parts of images from a [[Texture]] resource to the screen.
 *
 * [[include:Sprites.md]]
 */
var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite(imageOrConfig, x, y, width, height) {
        return _super.call(this, imageOrConfig, x, y, width, height) || this;
    }
    return Sprite;
}(Configurable(SpriteImpl)));
export { Sprite };
//# sourceMappingURL=Sprite.js.map