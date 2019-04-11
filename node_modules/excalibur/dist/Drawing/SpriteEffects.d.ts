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
 * The interface that all sprite effects must implement
 */
export interface SpriteEffect {
    /**
     * Should update individual pixels values
     * @param x          The pixel's x coordinate
     * @param y          The pixel's y coordinate
     * @param imageData  The sprite's raw pixel data
     */
    updatePixel(x: number, y: number, imageData: ImageData): void;
}
/**
 * Applies the "Grayscale" effect to a sprite, removing color information.
 */
export declare class Grayscale implements SpriteEffect {
    updatePixel(x: number, y: number, imageData: ImageData): void;
}
/**
 * Applies the "Invert" effect to a sprite, inverting the pixel colors.
 */
export declare class Invert implements SpriteEffect {
    updatePixel(x: number, y: number, imageData: ImageData): void;
}
/**
 * Applies the "Opacity" effect to a sprite, setting the alpha of all pixels to a given value.
 */
export declare class Opacity implements SpriteEffect {
    opacity: number;
    /**
     * @param opacity  The new opacity of the sprite from 0-1.0
     */
    constructor(opacity: number);
    updatePixel(x: number, y: number, imageData: ImageData): void;
}
/**
 * Applies the "Colorize" effect to a sprite, changing the color channels of all the pixels to an
 * average of the original color and the provided color
 */
export declare class Colorize implements SpriteEffect {
    color: Color;
    /**
     * @param color  The color to apply to the sprite
     */
    constructor(color: Color);
    updatePixel(x: number, y: number, imageData: ImageData): void;
}
/**
 * Applies the "Lighten" effect to a sprite, changes the lightness of the color according to HSL
 */
export declare class Lighten implements SpriteEffect {
    factor: number;
    /**
     * @param factor  The factor of the effect between 0-1
     */
    constructor(factor?: number);
    updatePixel(x: number, y: number, imageData: ImageData): void;
}
/**
 * Applies the "Darken" effect to a sprite, changes the darkness of the color according to HSL
 */
export declare class Darken implements SpriteEffect {
    factor: number;
    /**
     * @param factor  The factor of the effect between 0-1
     */
    constructor(factor?: number);
    updatePixel(x: number, y: number, imageData: ImageData): void;
}
/**
 * Applies the "Saturate" effect to a sprite, saturates the color according to HSL
 */
export declare class Saturate implements SpriteEffect {
    factor: number;
    /**
     * @param factor  The factor of the effect between 0-1
     */
    constructor(factor?: number);
    updatePixel(x: number, y: number, imageData: ImageData): void;
}
/**
 * Applies the "Desaturate" effect to a sprite, desaturates the color according to HSL
 */
export declare class Desaturate implements SpriteEffect {
    factor: number;
    /**
     * @param factor  The factor of the effect between 0-1
     */
    constructor(factor?: number);
    updatePixel(x: number, y: number, imageData: ImageData): void;
}
/**
 * Applies the "Fill" effect to a sprite, changing the color channels of all non-transparent pixels to match
 * a given color
 */
export declare class Fill implements SpriteEffect {
    color: Color;
    /**
     * @param color  The color to apply to the sprite
     */
    constructor(color: Color);
    updatePixel(x: number, y: number, imageData: ImageData): void;
}
