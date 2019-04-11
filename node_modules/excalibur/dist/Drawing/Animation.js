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
import { Vector } from '../Algebra';
import { Engine } from '../Engine';
import * as Util from '../Util/Util';
import { Configurable } from '../Configurable';
/**
 * @hidden
 */
var AnimationImpl = /** @class */ (function () {
    /**
     * Typically you will use a [[SpriteSheet]] to generate an [[Animation]].
     *
     * @param engine  Reference to the current game engine
     * @param images  An array of sprites to create the frames for the animation
     * @param speed   The number in milliseconds to display each frame in the animation
     * @param loop    Indicates whether the animation should loop after it is completed
     */
    function AnimationImpl(engineOrConfig, sprites, speed, loop) {
        /**
         * The sprite frames to play, in order. See [[SpriteSheet.getAnimationForAll]] to quickly
         * generate an [[Animation]].
         */
        this.sprites = [];
        /**
         * Current frame index being shown
         */
        this.currentFrame = 0;
        this._oldTime = Date.now();
        this.anchor = new Vector(0.0, 0.0);
        this.rotation = 0.0;
        this.scale = new Vector(1, 1);
        /**
         * Indicates whether the animation should loop after it is completed
         */
        this.loop = true;
        /**
         * Indicates the frame index the animation should freeze on for a non-looping
         * animation. By default it is the last frame.
         */
        this.freezeFrame = -1;
        /**
         * Flip each frame vertically. Sets [[Sprite.flipVertical]].
         */
        this.flipVertical = false;
        /**
         * Flip each frame horizontally. Sets [[Sprite.flipHorizontal]].
         */
        this.flipHorizontal = false;
        this.drawWidth = 0;
        this.drawHeight = 0;
        this.width = 0;
        this.height = 0;
        var engine = engineOrConfig;
        if (engineOrConfig && !(engineOrConfig instanceof Engine)) {
            var config = engineOrConfig;
            engine = config.engine;
            sprites = config.sprites;
            speed = config.speed;
            loop = config.loop;
        }
        this.sprites = sprites;
        this.speed = speed;
        this._engine = engine;
        if (loop != null) {
            this.loop = loop;
        }
        if (sprites && sprites[0]) {
            this.drawHeight = sprites[0] ? sprites[0].drawHeight : 0;
            this.drawWidth = sprites[0] ? sprites[0].drawWidth : 0;
            this.width = sprites[0] ? sprites[0].width : 0;
            this.height = sprites[0] ? sprites[0].height : 0;
            this.freezeFrame = sprites.length - 1;
        }
    }
    /**
     * Applies the opacity effect to a sprite, setting the alpha of all pixels to a given value
     */
    AnimationImpl.prototype.opacity = function (value) {
        this.addEffect(new Effects.Opacity(value));
    };
    /**
     * Applies the grayscale effect to a sprite, removing color information.
     */
    AnimationImpl.prototype.grayscale = function () {
        this.addEffect(new Effects.Grayscale());
    };
    /**
     * Applies the invert effect to a sprite, inverting the pixel colors.
     */
    AnimationImpl.prototype.invert = function () {
        this.addEffect(new Effects.Invert());
    };
    /**
     * Applies the fill effect to a sprite, changing the color channels of all non-transparent pixels to match a given color
     */
    AnimationImpl.prototype.fill = function (color) {
        this.addEffect(new Effects.Fill(color));
    };
    /**
     * Applies the colorize effect to a sprite, changing the color channels of all pixels to be the average of the original color and the
     * provided color.
     */
    AnimationImpl.prototype.colorize = function (color) {
        this.addEffect(new Effects.Colorize(color));
    };
    /**
     * Applies the lighten effect to a sprite, changes the lightness of the color according to hsl
     */
    AnimationImpl.prototype.lighten = function (factor) {
        if (factor === void 0) { factor = 0.1; }
        this.addEffect(new Effects.Lighten(factor));
    };
    /**
     * Applies the darken effect to a sprite, changes the darkness of the color according to hsl
     */
    AnimationImpl.prototype.darken = function (factor) {
        if (factor === void 0) { factor = 0.1; }
        this.addEffect(new Effects.Darken(factor));
    };
    /**
     * Applies the saturate effect to a sprite, saturates the color according to hsl
     */
    AnimationImpl.prototype.saturate = function (factor) {
        if (factor === void 0) { factor = 0.1; }
        this.addEffect(new Effects.Saturate(factor));
    };
    /**
     * Applies the desaturate effect to a sprite, desaturates the color according to hsl
     */
    AnimationImpl.prototype.desaturate = function (factor) {
        if (factor === void 0) { factor = 0.1; }
        this.addEffect(new Effects.Desaturate(factor));
    };
    /**
     * Add a [[ISpriteEffect]] manually
     */
    AnimationImpl.prototype.addEffect = function (effect) {
        for (var i in this.sprites) {
            this.sprites[i].addEffect(effect);
        }
    };
    AnimationImpl.prototype.removeEffect = function (param) {
        for (var i in this.sprites) {
            this.sprites[i].removeEffect(param);
        }
    };
    /**
     * Clear all sprite effects
     */
    AnimationImpl.prototype.clearEffects = function () {
        for (var i in this.sprites) {
            this.sprites[i].clearEffects();
        }
    };
    AnimationImpl.prototype._setAnchor = function (point) {
        //if (!this.anchor.equals(point)) {
        for (var i in this.sprites) {
            this.sprites[i].anchor.setTo(point.x, point.y);
        }
        //}
    };
    AnimationImpl.prototype._setRotation = function (radians) {
        //if (this.rotation !== radians) {
        for (var i in this.sprites) {
            this.sprites[i].rotation = radians;
        }
        //}
    };
    AnimationImpl.prototype._setScale = function (scale) {
        //if (!this.scale.equals(scale)) {
        for (var i in this.sprites) {
            this.sprites[i].scale = scale;
        }
        //}
    };
    /**
     * Resets the animation to first frame.
     */
    AnimationImpl.prototype.reset = function () {
        this.currentFrame = 0;
    };
    /**
     * Indicates whether the animation is complete, animations that loop are never complete.
     */
    AnimationImpl.prototype.isDone = function () {
        return !this.loop && this.currentFrame >= this.sprites.length;
    };
    /**
     * Not meant to be called by game developers. Ticks the animation forward internally and
     * calculates whether to change to the frame.
     * @internal
     */
    AnimationImpl.prototype.tick = function () {
        var time = Date.now();
        if (time - this._oldTime > this.speed) {
            this.currentFrame = this.loop ? (this.currentFrame + 1) % this.sprites.length : this.currentFrame + 1;
            this._oldTime = time;
        }
    };
    AnimationImpl.prototype._updateValues = function () {
        this._setAnchor(this.anchor);
        this._setRotation(this.rotation);
        this._setScale(this.scale);
    };
    /**
     * Skips ahead a specified number of frames in the animation
     * @param frames  Frames to skip ahead
     */
    AnimationImpl.prototype.skip = function (frames) {
        this.currentFrame = (this.currentFrame + frames) % this.sprites.length;
    };
    AnimationImpl.prototype.draw = function (ctx, x, y) {
        this.tick();
        this._updateValues();
        var currSprite;
        if (this.currentFrame < this.sprites.length) {
            currSprite = this.sprites[this.currentFrame];
            if (this.flipVertical) {
                currSprite.flipVertical = this.flipVertical;
            }
            if (this.flipHorizontal) {
                currSprite.flipHorizontal = this.flipHorizontal;
            }
            currSprite.draw(ctx, x, y);
        }
        if (this.freezeFrame !== -1 && this.currentFrame >= this.sprites.length) {
            currSprite = this.sprites[Util.clamp(this.freezeFrame, 0, this.sprites.length - 1)];
            currSprite.draw(ctx, x, y);
        }
        // add the calculated width
        if (currSprite) {
            this.drawWidth = currSprite.drawWidth;
            this.drawHeight = currSprite.drawHeight;
        }
    };
    /**
     * Plays an animation at an arbitrary location in the game.
     * @param x  The x position in the game to play
     * @param y  The y position in the game to play
     */
    AnimationImpl.prototype.play = function (x, y) {
        this.reset();
        this._engine.playAnimation(this, x, y);
    };
    return AnimationImpl;
}());
export { AnimationImpl };
/**
 * Animations allow you to display a series of images one after another,
 * creating the illusion of change. Generally these images will come from a [[SpriteSheet]] source.
 *
 * [[include:Animations.md]]
 */
var Animation = /** @class */ (function (_super) {
    __extends(Animation, _super);
    function Animation(engineOrConfig, images, speed, loop) {
        return _super.call(this, engineOrConfig, images, speed, loop) || this;
    }
    return Animation;
}(Configurable(AnimationImpl)));
export { Animation };
//# sourceMappingURL=Animation.js.map