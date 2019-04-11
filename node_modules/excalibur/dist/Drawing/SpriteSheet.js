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
import { Sprite } from './Sprite';
import { Animation } from './Animation';
import { Color } from './Color';
import * as Effects from './SpriteEffects';
import { Texture } from '../Resources/Texture';
import { Logger } from '../Util/Log';
import { TextAlign, BaseAlign } from '../Label';
import { Configurable } from '../Configurable';
/**
 * @hidden
 */
var SpriteSheetImpl = /** @class */ (function () {
    /**
     * @param image     The backing image texture to build the SpriteSheet
     * @param columns   The number of columns in the image texture
     * @param rows      The number of rows in the image texture
     * @param spWidth   The width of each individual sprite in pixels
     * @param spHeight  The height of each individual sprite in pixels
     * @param spacing   The spacing between every sprite in a spritesheet
     */
    function SpriteSheetImpl(imageOrConfigOrSprites, columns, rows, spWidth, spHeight, spacing) {
        var _this = this;
        this.sprites = [];
        this.image = null;
        this.columns = 0;
        this.rows = 0;
        this.spWidth = 0;
        this.spHeight = 0;
        this.spacing = 0;
        var loadFromImage = false;
        if (imageOrConfigOrSprites instanceof Array) {
            this.sprites = imageOrConfigOrSprites;
        }
        else {
            if (imageOrConfigOrSprites && !(imageOrConfigOrSprites instanceof Texture)) {
                this.columns = imageOrConfigOrSprites.columns;
                this.rows = imageOrConfigOrSprites.rows;
                this.spWidth = imageOrConfigOrSprites.spWidth;
                this.spHeight = imageOrConfigOrSprites.spHeight;
                this.image = imageOrConfigOrSprites.image;
                this.spacing = imageOrConfigOrSprites.spacing || 0;
            }
            else {
                this.image = imageOrConfigOrSprites;
                this.columns = columns;
                this.rows = rows;
                this.spWidth = spWidth;
                this.spHeight = spHeight;
                this.spacing = spacing || 0;
            }
            this.sprites = new Array(this.columns * this.rows);
            loadFromImage = true;
        }
        // Inspect actual image dimensions with preloading
        if (this.image instanceof Texture) {
            var isWidthError_1 = false;
            var isHeightError_1 = false;
            this.image.loaded.then(function (image) {
                isWidthError_1 = _this.spWidth * _this.columns > image.naturalWidth;
                isHeightError_1 = _this.spHeight * _this.rows > image.naturalHeight;
            });
            if (isWidthError_1) {
                throw new RangeError("SpriteSheet specified is wider, " +
                    (this.columns + " cols x " + this.spWidth + " pixels > " + this.image.image.naturalWidth + " ") +
                    "pixels than image width");
            }
            if (isHeightError_1) {
                throw new RangeError("SpriteSheet specified is taller, " +
                    (this.rows + " rows x " + this.spHeight + " pixels > " + this.image.image.naturalHeight + " ") +
                    "pixels than image height");
            }
        }
        if (loadFromImage) {
            var i = 0;
            var j = 0;
            for (i = 0; i < this.rows; i++) {
                for (j = 0; j < this.columns; j++) {
                    this.sprites[j + i * this.columns] = new Sprite(this.image, j * this.spWidth + this.spacing * j + this.spacing, i * this.spHeight + this.spacing * i + this.spacing, this.spWidth, this.spHeight);
                }
            }
        }
    }
    /**
     * Create an animation from the this SpriteSheet by listing out the
     * sprite indices. Sprites are organized in row major order in the SpriteSheet.
     * @param engine   Reference to the current game [[Engine]]
     * @param indices  An array of sprite indices to use in the animation
     * @param speed    The number in milliseconds to display each frame in the animation
     */
    SpriteSheetImpl.prototype.getAnimationByIndices = function (engine, indices, speed) {
        var _this = this;
        var images = indices.map(function (index) {
            return _this.sprites[index];
        });
        images = images.map(function (i) {
            return i.clone();
        });
        return new Animation(engine, images, speed);
    };
    /**
     * Create an animation from the this SpriteSheet by specifing the range of
     * images with the beginning (inclusive) and ending (exclusive) index
     * For example `getAnimationBetween(engine, 0, 5, 200)` returns an animation with 5 frames.
     * @param engine      Reference to the current game Engine
     * @param beginIndex  The index to start taking frames (inclusive)
     * @param endIndex    The index to stop taking frames (exclusive)
     * @param speed       The number in milliseconds to display each frame in the animation
     */
    SpriteSheetImpl.prototype.getAnimationBetween = function (engine, beginIndex, endIndex, speed) {
        var images = this.sprites.slice(beginIndex, endIndex);
        images = images.map(function (i) {
            return i.clone();
        });
        return new Animation(engine, images, speed);
    };
    /**
     * Treat the entire SpriteSheet as one animation, organizing the frames in
     * row major order.
     * @param engine  Reference to the current game [[Engine]]
     * @param speed   The number in milliseconds to display each frame the animation
     */
    SpriteSheetImpl.prototype.getAnimationForAll = function (engine, speed) {
        var sprites = this.sprites.map(function (i) {
            return i.clone();
        });
        return new Animation(engine, sprites, speed);
    };
    /**
     * Retreive a specific sprite from the SpriteSheet by its index. Sprites are organized
     * in row major order in the SpriteSheet.
     * @param index  The index of the sprite
     */
    SpriteSheetImpl.prototype.getSprite = function (index) {
        if (index >= 0 && index < this.sprites.length) {
            return this.sprites[index];
        }
        else {
            throw new Error('Invalid index: ' + index);
        }
    };
    /**
     * Get an animation with bespoke sprite coordinates. This is useful if the SpriteSheet is
     * packed and not a uniform width or height. The resulting [[Animation]] will have the height and width of the
     * largest dimension (width, height) from among the sprite coordinates
     * @param engine
     * @param spriteCoordinates
     * @param speed
     */
    SpriteSheetImpl.prototype.getAnimationByCoords = function (engine, spriteCoordinates, speed) {
        var maxWidth = 0;
        var maxHeight = 0;
        var sprites = new Array(spriteCoordinates.length);
        for (var i = 0; i < spriteCoordinates.length; i++) {
            var coord = spriteCoordinates[i];
            // no need to pass image again if using a spritesheet
            coord.image = coord.image || this.image;
            maxWidth = Math.max(maxWidth, coord.drawWidth);
            maxHeight = Math.max(maxHeight, coord.drawHeight);
            sprites[i] = new Sprite(coord);
        }
        var anim = new Animation(engine, sprites, speed);
        anim.drawWidth = maxWidth;
        anim.drawHeight = maxHeight;
        return anim;
    };
    return SpriteSheetImpl;
}());
export { SpriteSheetImpl };
/**
 * Sprite sheets are a useful mechanism for slicing up image resources into
 * separate sprites or for generating in game animations. [[Sprite|Sprites]] are organized
 * in row major order in the [[SpriteSheet]].
 *
 * [[include:SpriteSheets.md]]
 */
var SpriteSheet = /** @class */ (function (_super) {
    __extends(SpriteSheet, _super);
    function SpriteSheet(imageOrConfigOrSprites, columns, rows, spWidth, spHeight, spacing) {
        return _super.call(this, imageOrConfigOrSprites, columns, rows, spWidth, spHeight, spacing) || this;
    }
    return SpriteSheet;
}(Configurable(SpriteSheetImpl)));
export { SpriteSheet };
var SpriteFontImpl = /** @class */ (function (_super) {
    __extends(SpriteFontImpl, _super);
    /**
     * @param image           The backing image texture to build the SpriteFont
     * @param alphabet        A string representing all the characters in the image, in row major order.
     * @param caseInsensitive  Indicate whether this font takes case into account
     * @param columns         The number of columns of characters in the image
     * @param rows            The number of rows of characters in the image
     * @param spWidth         The width of each character in pixels
     * @param spHeight        The height of each character in pixels
     */
    function SpriteFontImpl(imageOrConfig, alphabet, caseInsensitive, columns, rows, spWidth, spHeight, spacing) {
        var _this = _super.call(this, imageOrConfig instanceof Texture
            ? {
                image: imageOrConfig,
                spWidth: spWidth,
                spHeight: spHeight,
                rows: rows,
                columns: columns,
                spacing: spacing || 0
            }
            : imageOrConfig) || this;
        _this._currentColor = Color.Black;
        _this._currentOpacity = 1.0;
        _this._sprites = {};
        // text shadow
        _this._textShadowOn = false;
        _this._textShadowDirty = true;
        _this._textShadowColor = Color.Black;
        _this._textShadowSprites = {};
        _this._shadowOffsetX = 5;
        _this._shadowOffsetY = 5;
        if (imageOrConfig && !(imageOrConfig instanceof Texture)) {
            alphabet = imageOrConfig.alphabet;
            caseInsensitive = imageOrConfig.caseInsensitive;
        }
        _this._alphabet = alphabet;
        _this._caseInsensitive = caseInsensitive;
        _this._sprites = _this.getTextSprites();
        return _this;
    }
    /**
     * Returns a dictionary that maps each character in the alphabet to the appropriate [[Sprite]].
     */
    SpriteFontImpl.prototype.getTextSprites = function () {
        var lookup = {};
        for (var i = 0; i < this._alphabet.length; i++) {
            var char = this._alphabet[i];
            if (this._caseInsensitive) {
                char = char.toLowerCase();
            }
            lookup[char] = this.sprites[i].clone();
        }
        return lookup;
    };
    /**
     * Sets the text shadow for sprite fonts
     * @param offsetX      The x offset in pixels to place the shadow
     * @param offsetY      The y offset in pixels to place the shadow
     * @param shadowColor  The color of the text shadow
     */
    SpriteFontImpl.prototype.setTextShadow = function (offsetX, offsetY, shadowColor) {
        this._textShadowOn = true;
        this._shadowOffsetX = offsetX;
        this._shadowOffsetY = offsetY;
        this._textShadowColor = shadowColor.clone();
        this._textShadowDirty = true;
        for (var character in this._sprites) {
            this._textShadowSprites[character] = this._sprites[character].clone();
        }
    };
    /**
     * Toggles text shadows on or off
     */
    SpriteFontImpl.prototype.useTextShadow = function (on) {
        this._textShadowOn = on;
        if (on) {
            this.setTextShadow(5, 5, this._textShadowColor);
        }
    };
    /**
     * Draws the current sprite font
     */
    SpriteFontImpl.prototype.draw = function (ctx, text, x, y, options) {
        options = this._parseOptions(options);
        if (this._currentColor.toString() !== options.color.toString() || this._currentOpacity !== options.opacity) {
            this._currentOpacity = options.opacity;
            this._currentColor = options.color;
            for (var char in this._sprites) {
                this._sprites[char].clearEffects();
                this._sprites[char].fill(options.color);
                this._sprites[char].opacity(options.opacity);
            }
        }
        if (this._textShadowOn && this._textShadowDirty && this._textShadowColor) {
            for (var characterShadow in this._textShadowSprites) {
                this._textShadowSprites[characterShadow].clearEffects();
                this._textShadowSprites[characterShadow].addEffect(new Effects.Fill(this._textShadowColor.clone()));
            }
            this._textShadowDirty = false;
        }
        // find the current length of text in pixels
        var sprite = this.sprites[0];
        // find the current height fo the text in pixels
        var height = sprite.drawHeight;
        // calculate appropriate scale for font size
        var scale = options.fontSize / height;
        var length = text.length * sprite.drawWidth * scale + text.length * options.letterSpacing;
        var currX = x;
        if (options.textAlign === TextAlign.Left || options.textAlign === TextAlign.Start) {
            currX = x;
        }
        else if (options.textAlign === TextAlign.Right || options.textAlign === TextAlign.End) {
            currX = x - length;
        }
        else if (options.textAlign === TextAlign.Center) {
            currX = x - length / 2;
        }
        var currY = y - height * scale;
        if (options.baseAlign === BaseAlign.Top || options.baseAlign === BaseAlign.Hanging) {
            currY = y;
        }
        else if (options.baseAlign === BaseAlign.Ideographic ||
            options.baseAlign === BaseAlign.Bottom ||
            options.baseAlign === BaseAlign.Alphabetic) {
            currY = y - height * scale;
        }
        else if (options.baseAlign === BaseAlign.Middle) {
            currY = y - (height * scale) / 2;
        }
        for (var i = 0; i < text.length; i++) {
            var character = text[i];
            if (this._caseInsensitive) {
                character = character.toLowerCase();
            }
            try {
                // if text shadow
                if (this._textShadowOn) {
                    this._textShadowSprites[character].scale.x = scale;
                    this._textShadowSprites[character].scale.y = scale;
                    this._textShadowSprites[character].draw(ctx, currX + this._shadowOffsetX, currY + this._shadowOffsetY);
                }
                var charSprite = this._sprites[character];
                charSprite.scale.x = scale;
                charSprite.scale.y = scale;
                charSprite.draw(ctx, currX, currY);
                currX += charSprite.drawWidth + options.letterSpacing;
            }
            catch (e) {
                Logger.getInstance().error("SpriteFont Error drawing char " + character);
            }
        }
    };
    SpriteFontImpl.prototype._parseOptions = function (options) {
        return {
            fontSize: options.fontSize || 10,
            letterSpacing: options.letterSpacing || 0,
            color: options.color || Color.Black,
            textAlign: typeof options.textAlign === undefined ? TextAlign.Left : options.textAlign,
            baseAlign: typeof options.baseAlign === undefined ? BaseAlign.Bottom : options.baseAlign,
            maxWidth: options.maxWidth || -1,
            opacity: options.opacity || 0
        };
    };
    return SpriteFontImpl;
}(SpriteSheet));
export { SpriteFontImpl };
/**
 * Sprite fonts are a used in conjunction with a [[Label]] to specify
 * a particular bitmap as a font. Note that some font features are not
 * supported by Sprite fonts.
 *
 * [[include:SpriteFonts.md]]
 */
var SpriteFont = /** @class */ (function (_super) {
    __extends(SpriteFont, _super);
    function SpriteFont(imageOrConfig, alphabet, caseInsensitive, columns, rows, spWidth, spHeight, spacing) {
        return _super.call(this, imageOrConfig, alphabet, caseInsensitive, columns, rows, spWidth, spHeight, spacing) || this;
    }
    return SpriteFont;
}(Configurable(SpriteFontImpl)));
export { SpriteFont };
//# sourceMappingURL=SpriteSheet.js.map