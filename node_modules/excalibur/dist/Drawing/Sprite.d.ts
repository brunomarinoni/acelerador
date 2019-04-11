import * as Effects from './SpriteEffects';
import { Color } from './Color';
import { Drawable } from '../Interfaces/Drawable';
import { Texture } from '../Resources/Texture';
import { Vector } from '../Algebra';
import { Logger } from '../Util/Log';
/**
 * @hidden
 */
export declare class SpriteImpl implements Drawable {
    private _texture;
    x: number;
    y: number;
    readonly drawWidth: number;
    readonly drawHeight: number;
    rotation: number;
    anchor: Vector;
    scale: Vector;
    logger: Logger;
    /**
     * Draws the sprite flipped vertically
     */
    flipVertical: boolean;
    /**
     * Draws the sprite flipped horizontally
     */
    flipHorizontal: boolean;
    effects: Effects.SpriteEffect[];
    width: number;
    height: number;
    private _spriteCanvas;
    private _spriteCtx;
    private _pixelData;
    private _pixelsLoaded;
    private _dirtyEffect;
    /**
     * @param image   The backing image texture to build the Sprite
     * @param x      The x position of the sprite
     * @param y      The y position of the sprite
     * @param width  The width of the sprite in pixels
     * @param height The height of the sprite in pixels
     */
    constructor(imageOrConfig: Texture | SpriteArgs, x: number, y: number, width: number, height: number);
    private _loadPixels;
    /**
     * Applies the [[Opacity]] effect to a sprite, setting the alpha of all pixels to a given value
     */
    opacity(value: number): void;
    /**
     * Applies the [[Grayscale]] effect to a sprite, removing color information.
     */
    grayscale(): void;
    /**
     * Applies the [[Invert]] effect to a sprite, inverting the pixel colors.
     */
    invert(): void;
    /**
     * Applies the [[Fill]] effect to a sprite, changing the color channels of all non-transparent pixels to match a given color
     */
    fill(color: Color): void;
    /**
     * Applies the [[Colorize]] effect to a sprite, changing the color channels of all pixels to be the average of the original color
     * and the provided color.
     */
    colorize(color: Color): void;
    /**
     * Applies the [[Lighten]] effect to a sprite, changes the lightness of the color according to HSL
     */
    lighten(factor?: number): void;
    /**
     * Applies the [[Darken]] effect to a sprite, changes the darkness of the color according to HSL
     */
    darken(factor?: number): void;
    /**
     * Applies the [[Saturate]] effect to a sprite, saturates the color according to HSL
     */
    saturate(factor?: number): void;
    /**
     * Applies the [[Desaturate]] effect to a sprite, desaturates the color according to HSL
     */
    desaturate(factor?: number): void;
    /**
     * Adds a new [[ISpriteEffect]] to this drawing.
     * @param effect  Effect to add to the this drawing
     */
    addEffect(effect: Effects.SpriteEffect): void;
    /**
     * Removes a [[ISpriteEffect]] from this sprite.
     * @param effect  Effect to remove from this sprite
     */
    removeEffect(effect: Effects.SpriteEffect): void;
    /**
     * Removes an effect given the index from this sprite.
     * @param index  Index of the effect to remove from this sprite
     */
    removeEffect(index: number): void;
    private _applyEffects;
    /**
     * Clears all effects from the drawing and return it to its original state.
     */
    clearEffects(): void;
    /**
     * Resets the internal state of the drawing (if any)
     */
    reset(): void;
    debugDraw(ctx: CanvasRenderingContext2D, x: number, y: number): void;
    /**
     * Draws the sprite appropriately to the 2D rendering context, at an x and y coordinate.
     * @param ctx  The 2D rendering context
     * @param x    The x coordinate of where to draw
     * @param y    The y coordinate of where to draw
     */
    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void;
    /**
     * Produces a copy of the current sprite
     */
    clone(): SpriteImpl;
}
/**
 * [[include:Constructors.md]]
 */
export interface SpriteArgs extends Partial<SpriteImpl> {
    image?: Texture;
    x?: number;
    width?: number;
    height?: number;
    rotation?: number;
    anchor?: Vector;
    scale?: Vector;
    flipVertical?: boolean;
    flipHorizontal?: boolean;
}
declare const Sprite_base: typeof SpriteImpl;
/**
 * A [[Sprite]] is one of the main drawing primitives. It is responsible for drawing
 * images or parts of images from a [[Texture]] resource to the screen.
 *
 * [[include:Sprites.md]]
 */
export declare class Sprite extends Sprite_base {
    constructor(config: SpriteArgs);
    constructor(image: Texture, x: number, y: number, width: number, height: number);
}
export {};
