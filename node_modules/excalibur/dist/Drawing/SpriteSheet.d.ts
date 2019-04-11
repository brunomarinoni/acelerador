import { Sprite, SpriteArgs } from './Sprite';
import { Animation } from './Animation';
import { Color } from './Color';
import { Texture } from '../Resources/Texture';
import { Engine } from '../Engine';
import { TextAlign, BaseAlign } from '../Label';
/**
 * @hidden
 */
export declare class SpriteSheetImpl {
    sprites: Sprite[];
    image: Texture;
    columns: number;
    rows: number;
    spWidth: number;
    spHeight: number;
    spacing: number;
    /**
     * @param image     The backing image texture to build the SpriteSheet
     * @param columns   The number of columns in the image texture
     * @param rows      The number of rows in the image texture
     * @param spWidth   The width of each individual sprite in pixels
     * @param spHeight  The height of each individual sprite in pixels
     * @param spacing   The spacing between every sprite in a spritesheet
     */
    constructor(imageOrConfigOrSprites: Texture | SpriteSheetArgs | Sprite[], columns?: number, rows?: number, spWidth?: number, spHeight?: number, spacing?: number);
    /**
     * Create an animation from the this SpriteSheet by listing out the
     * sprite indices. Sprites are organized in row major order in the SpriteSheet.
     * @param engine   Reference to the current game [[Engine]]
     * @param indices  An array of sprite indices to use in the animation
     * @param speed    The number in milliseconds to display each frame in the animation
     */
    getAnimationByIndices(engine: Engine, indices: number[], speed: number): Animation;
    /**
     * Create an animation from the this SpriteSheet by specifing the range of
     * images with the beginning (inclusive) and ending (exclusive) index
     * For example `getAnimationBetween(engine, 0, 5, 200)` returns an animation with 5 frames.
     * @param engine      Reference to the current game Engine
     * @param beginIndex  The index to start taking frames (inclusive)
     * @param endIndex    The index to stop taking frames (exclusive)
     * @param speed       The number in milliseconds to display each frame in the animation
     */
    getAnimationBetween(engine: Engine, beginIndex: number, endIndex: number, speed: number): Animation;
    /**
     * Treat the entire SpriteSheet as one animation, organizing the frames in
     * row major order.
     * @param engine  Reference to the current game [[Engine]]
     * @param speed   The number in milliseconds to display each frame the animation
     */
    getAnimationForAll(engine: Engine, speed: number): Animation;
    /**
     * Retreive a specific sprite from the SpriteSheet by its index. Sprites are organized
     * in row major order in the SpriteSheet.
     * @param index  The index of the sprite
     */
    getSprite(index: number): Sprite;
    /**
     * Get an animation with bespoke sprite coordinates. This is useful if the SpriteSheet is
     * packed and not a uniform width or height. The resulting [[Animation]] will have the height and width of the
     * largest dimension (width, height) from among the sprite coordinates
     * @param engine
     * @param spriteCoordinates
     * @param speed
     */
    getAnimationByCoords(engine: Engine, spriteCoordinates: SpriteArgs[], speed: number): Animation;
}
/**
 * [[include:Constructors.md]]
 */
export interface SpriteSheetArgs extends Partial<SpriteSheetImpl> {
    image: Texture;
    sprites?: Sprite[];
    spWidth: number;
    spHeight: number;
    rows: number;
    columns: number;
    spacing?: number;
}
declare const SpriteSheet_base: typeof SpriteSheetImpl;
/**
 * Sprite sheets are a useful mechanism for slicing up image resources into
 * separate sprites or for generating in game animations. [[Sprite|Sprites]] are organized
 * in row major order in the [[SpriteSheet]].
 *
 * [[include:SpriteSheets.md]]
 */
export declare class SpriteSheet extends SpriteSheet_base {
    constructor(config: SpriteSheetArgs);
    constructor(sprites: Sprite[]);
    constructor(image: Texture, columns: number, rows: number, spWidth: number, spHeight: number);
}
export declare class SpriteFontImpl extends SpriteSheet {
    private _currentColor;
    private _currentOpacity;
    private _sprites;
    private _textShadowOn;
    private _textShadowDirty;
    private _textShadowColor;
    private _textShadowSprites;
    private _shadowOffsetX;
    private _shadowOffsetY;
    private _alphabet;
    private _caseInsensitive;
    /**
     * @param image           The backing image texture to build the SpriteFont
     * @param alphabet        A string representing all the characters in the image, in row major order.
     * @param caseInsensitive  Indicate whether this font takes case into account
     * @param columns         The number of columns of characters in the image
     * @param rows            The number of rows of characters in the image
     * @param spWidth         The width of each character in pixels
     * @param spHeight        The height of each character in pixels
     */
    constructor(imageOrConfig: Texture | SpriteFontArgs, alphabet: string, caseInsensitive: boolean, columns: number, rows: number, spWidth: number, spHeight: number, spacing?: number);
    /**
     * Returns a dictionary that maps each character in the alphabet to the appropriate [[Sprite]].
     */
    getTextSprites(): {
        [key: string]: Sprite;
    };
    /**
     * Sets the text shadow for sprite fonts
     * @param offsetX      The x offset in pixels to place the shadow
     * @param offsetY      The y offset in pixels to place the shadow
     * @param shadowColor  The color of the text shadow
     */
    setTextShadow(offsetX: number, offsetY: number, shadowColor: Color): void;
    /**
     * Toggles text shadows on or off
     */
    useTextShadow(on: boolean): void;
    /**
     * Draws the current sprite font
     */
    draw(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, options: SpriteFontOptions): void;
    private _parseOptions;
}
/**
 * Specify various font attributes for sprite fonts
 */
export interface SpriteFontOptions {
    color?: Color;
    opacity?: number;
    fontSize?: number;
    letterSpacing?: number;
    textAlign?: TextAlign;
    baseAlign?: BaseAlign;
    maxWidth?: number;
}
/**
 * [[include:Constructors.md]]
 */
export interface SpriteFontArgs extends SpriteSheetArgs {
    image: Texture;
    columns: number;
    rows: number;
    spWidth: number;
    spHeight: number;
    alphabet: string;
    caseInsensitive: boolean;
}
declare const SpriteFont_base: typeof SpriteFontImpl;
/**
 * Sprite fonts are a used in conjunction with a [[Label]] to specify
 * a particular bitmap as a font. Note that some font features are not
 * supported by Sprite fonts.
 *
 * [[include:SpriteFonts.md]]
 */
export declare class SpriteFont extends SpriteFont_base {
    constructor(config: SpriteFontArgs);
    constructor(image: Texture, alphabet: string, caseInsensitive: boolean, columns: number, rows: number, spWidth: number, spHeight: number);
}
export {};
