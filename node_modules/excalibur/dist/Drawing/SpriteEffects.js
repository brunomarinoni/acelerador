/**
 * These effects can be applied to any bitmap image but are mainly used
 * for [[Sprite]] effects or [[Animation]] effects.
 *
 * [[include:SpriteEffects.md]]
 */
/**
 * @typedoc
 */
import { Color } from './Color';
/**
 * Applies the "Grayscale" effect to a sprite, removing color information.
 */
var Grayscale = /** @class */ (function () {
    function Grayscale() {
    }
    Grayscale.prototype.updatePixel = function (x, y, imageData) {
        var firstPixel = (x + y * imageData.width) * 4;
        var pixel = imageData.data;
        var avg = (pixel[firstPixel + 0] + pixel[firstPixel + 1] + pixel[firstPixel + 2]) / 3;
        pixel[firstPixel + 0] = avg;
        pixel[firstPixel + 1] = avg;
        pixel[firstPixel + 2] = avg;
    };
    return Grayscale;
}());
export { Grayscale };
/**
 * Applies the "Invert" effect to a sprite, inverting the pixel colors.
 */
var Invert = /** @class */ (function () {
    function Invert() {
    }
    Invert.prototype.updatePixel = function (x, y, imageData) {
        var firstPixel = (x + y * imageData.width) * 4;
        var pixel = imageData.data;
        pixel[firstPixel + 0] = 255 - pixel[firstPixel + 0];
        pixel[firstPixel + 1] = 255 - pixel[firstPixel + 1];
        pixel[firstPixel + 2] = 255 - pixel[firstPixel + 2];
    };
    return Invert;
}());
export { Invert };
/**
 * Applies the "Opacity" effect to a sprite, setting the alpha of all pixels to a given value.
 */
var Opacity = /** @class */ (function () {
    /**
     * @param opacity  The new opacity of the sprite from 0-1.0
     */
    function Opacity(opacity) {
        this.opacity = opacity;
    }
    Opacity.prototype.updatePixel = function (x, y, imageData) {
        var firstPixel = (x + y * imageData.width) * 4;
        var pixel = imageData.data;
        if (pixel[firstPixel + 3] !== 0) {
            pixel[firstPixel + 3] = Math.round(this.opacity * pixel[firstPixel + 3]);
        }
    };
    return Opacity;
}());
export { Opacity };
/**
 * Applies the "Colorize" effect to a sprite, changing the color channels of all the pixels to an
 * average of the original color and the provided color
 */
var Colorize = /** @class */ (function () {
    /**
     * @param color  The color to apply to the sprite
     */
    function Colorize(color) {
        this.color = color;
    }
    Colorize.prototype.updatePixel = function (x, y, imageData) {
        var firstPixel = (x + y * imageData.width) * 4;
        var pixel = imageData.data;
        if (pixel[firstPixel + 3] !== 0) {
            pixel[firstPixel + 0] = (pixel[firstPixel + 0] + this.color.r) / 2;
            pixel[firstPixel + 1] = (pixel[firstPixel + 1] + this.color.g) / 2;
            pixel[firstPixel + 2] = (pixel[firstPixel + 2] + this.color.b) / 2;
        }
    };
    return Colorize;
}());
export { Colorize };
/**
 * Applies the "Lighten" effect to a sprite, changes the lightness of the color according to HSL
 */
var Lighten = /** @class */ (function () {
    /**
     * @param factor  The factor of the effect between 0-1
     */
    function Lighten(factor) {
        if (factor === void 0) { factor = 0.1; }
        this.factor = factor;
    }
    Lighten.prototype.updatePixel = function (x, y, imageData) {
        var firstPixel = (x + y * imageData.width) * 4;
        var pixel = imageData.data;
        var color = Color.fromRGB(pixel[firstPixel + 0], pixel[firstPixel + 1], pixel[firstPixel + 2], pixel[firstPixel + 3]).lighten(this.factor);
        pixel[firstPixel + 0] = color.r;
        pixel[firstPixel + 1] = color.g;
        pixel[firstPixel + 2] = color.b;
        pixel[firstPixel + 3] = color.a;
    };
    return Lighten;
}());
export { Lighten };
/**
 * Applies the "Darken" effect to a sprite, changes the darkness of the color according to HSL
 */
var Darken = /** @class */ (function () {
    /**
     * @param factor  The factor of the effect between 0-1
     */
    function Darken(factor) {
        if (factor === void 0) { factor = 0.1; }
        this.factor = factor;
    }
    Darken.prototype.updatePixel = function (x, y, imageData) {
        var firstPixel = (x + y * imageData.width) * 4;
        var pixel = imageData.data;
        var color = Color.fromRGB(pixel[firstPixel + 0], pixel[firstPixel + 1], pixel[firstPixel + 2], pixel[firstPixel + 3]).darken(this.factor);
        pixel[firstPixel + 0] = color.r;
        pixel[firstPixel + 1] = color.g;
        pixel[firstPixel + 2] = color.b;
        pixel[firstPixel + 3] = color.a;
    };
    return Darken;
}());
export { Darken };
/**
 * Applies the "Saturate" effect to a sprite, saturates the color according to HSL
 */
var Saturate = /** @class */ (function () {
    /**
     * @param factor  The factor of the effect between 0-1
     */
    function Saturate(factor) {
        if (factor === void 0) { factor = 0.1; }
        this.factor = factor;
    }
    Saturate.prototype.updatePixel = function (x, y, imageData) {
        var firstPixel = (x + y * imageData.width) * 4;
        var pixel = imageData.data;
        var color = Color.fromRGB(pixel[firstPixel + 0], pixel[firstPixel + 1], pixel[firstPixel + 2], pixel[firstPixel + 3]).saturate(this.factor);
        pixel[firstPixel + 0] = color.r;
        pixel[firstPixel + 1] = color.g;
        pixel[firstPixel + 2] = color.b;
        pixel[firstPixel + 3] = color.a;
    };
    return Saturate;
}());
export { Saturate };
/**
 * Applies the "Desaturate" effect to a sprite, desaturates the color according to HSL
 */
var Desaturate = /** @class */ (function () {
    /**
     * @param factor  The factor of the effect between 0-1
     */
    function Desaturate(factor) {
        if (factor === void 0) { factor = 0.1; }
        this.factor = factor;
    }
    Desaturate.prototype.updatePixel = function (x, y, imageData) {
        var firstPixel = (x + y * imageData.width) * 4;
        var pixel = imageData.data;
        var color = Color.fromRGB(pixel[firstPixel + 0], pixel[firstPixel + 1], pixel[firstPixel + 2], pixel[firstPixel + 3]).desaturate(this.factor);
        pixel[firstPixel + 0] = color.r;
        pixel[firstPixel + 1] = color.g;
        pixel[firstPixel + 2] = color.b;
        pixel[firstPixel + 3] = color.a;
    };
    return Desaturate;
}());
export { Desaturate };
/**
 * Applies the "Fill" effect to a sprite, changing the color channels of all non-transparent pixels to match
 * a given color
 */
var Fill = /** @class */ (function () {
    /**
     * @param color  The color to apply to the sprite
     */
    function Fill(color) {
        this.color = color;
    }
    Fill.prototype.updatePixel = function (x, y, imageData) {
        var firstPixel = (x + y * imageData.width) * 4;
        var pixel = imageData.data;
        if (pixel[firstPixel + 3] !== 0) {
            pixel[firstPixel + 0] = this.color.r;
            pixel[firstPixel + 1] = this.color.g;
            pixel[firstPixel + 2] = this.color.b;
        }
    };
    return Fill;
}());
export { Fill };
//# sourceMappingURL=SpriteEffects.js.map