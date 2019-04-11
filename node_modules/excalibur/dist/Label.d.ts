import { Engine } from './Engine';
import { Color } from './Drawing/Color';
import { SpriteFont } from './Drawing/SpriteSheet';
import { Actor } from './Actor';
import { Vector } from './Algebra';
/**
 * Enum representing the different font size units
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-size
 */
export declare enum FontUnit {
    /**
     * Em is a scalable unit, 1 em is equal to the current font size of the current element, parent elements can effect em values
     */
    Em = 0,
    /**
     * Rem is similar to the Em, it is a scalable unit. 1 rem is eqaul to the font size of the root element
     */
    Rem = 1,
    /**
     * Pixel is a unit of length in screen pixels
     */
    Px = 2,
    /**
     * Point is a physical unit length (1/72 of an inch)
     */
    Pt = 3,
    /**
     * Percent is a scalable unit similar to Em, the only difference is the Em units scale faster when Text-Size stuff
     */
    Percent = 4
}
/**
 * Enum representing the different horizontal text alignments
 */
export declare enum TextAlign {
    /**
     * The text is left-aligned.
     */
    Left = 0,
    /**
     * The text is right-aligned.
     */
    Right = 1,
    /**
     * The text is centered.
     */
    Center = 2,
    /**
     * The text is aligned at the normal start of the line (left-aligned for left-to-right locales,
     * right-aligned for right-to-left locales).
     */
    Start = 3,
    /**
     * The text is aligned at the normal end of the line (right-aligned for left-to-right locales,
     * left-aligned for right-to-left locales).
     */
    End = 4
}
/**
 * Enum representing the different baseline text alignments
 */
export declare enum BaseAlign {
    /**
     * The text baseline is the top of the em square.
     */
    Top = 0,
    /**
     * The text baseline is the hanging baseline.  Currently unsupported; this will act like
     * alphabetic.
     */
    Hanging = 1,
    /**
     * The text baseline is the middle of the em square.
     */
    Middle = 2,
    /**
     * The text baseline is the normal alphabetic baseline.
     */
    Alphabetic = 3,
    /**
     * The text baseline is the ideographic baseline; this is the bottom of
     * the body of the characters, if the main body of characters protrudes
     * beneath the alphabetic baseline.  Currently unsupported; this will
     * act like alphabetic.
     */
    Ideographic = 4,
    /**
     * The text baseline is the bottom of the bounding box.  This differs
     * from the ideographic baseline in that the ideographic baseline
     * doesn't consider descenders.
     */
    Bottom = 5
}
/**
 * Enum representing the different possible font styles
 */
export declare enum FontStyle {
    Normal = 0,
    Italic = 1,
    Oblique = 2
}
/**
 * [[include:Constructors.md]]
 */
export interface LabelArgs extends Partial<LabelImpl> {
    text?: string;
    bold?: boolean;
    pos?: Vector;
    spriteFont?: SpriteFont;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: FontStyle;
    fontUnit?: FontUnit;
    textAlign?: TextAlign;
    maxWidth?: number;
}
/**
 * @hidden
 */
export declare class LabelImpl extends Actor {
    /**
     * The text to draw.
     */
    text: string;
    /**
     * Sets or gets the bold property of the label's text, by default it's false
     */
    bold: boolean;
    /**
     * The [[SpriteFont]] to use, if any. Overrides [[fontFamily]] if present.
     */
    spriteFont: SpriteFont;
    /**
     * The CSS font family string (e.g. `sans-serif`, `Droid Sans Pro`). Web fonts
     * are supported, same as in CSS.
     */
    fontFamily: string;
    /**
     * The font size in the selected units, default is 10 (default units is pixel)
     */
    fontSize: number;
    /**
     * The font style for this label, the default is [[FontStyle.Normal]]
     */
    fontStyle: FontStyle;
    /**
     * The css units for a font size such as px, pt, em (SpriteFont only support px), by default is 'px';
     */
    fontUnit: FontUnit;
    /**
     * Gets or sets the horizontal text alignment property for the label.
     */
    textAlign: TextAlign;
    /**
     * Gets or sets the baseline alignment property for the label.
     */
    baseAlign: BaseAlign;
    /**
     * Gets or sets the maximum width (in pixels) that the label should occupy
     */
    maxWidth: number;
    /**
     * Gets or sets the letter spacing on a Label. Only supported with Sprite Fonts.
     */
    letterSpacing: number;
    /**
     * Whether or not the [[SpriteFont]] will be case-sensitive when matching characters.
     */
    caseInsensitive: boolean;
    private _textShadowOn;
    private _shadowOffsetX;
    private _shadowOffsetY;
    /**
     * @param text        The text of the label
     * @param x           The x position of the label
     * @param y           The y position of the label
     * @param fontFamily  Use any valid CSS font string for the label's font. Web fonts are supported. Default is `10px sans-serif`.
     * @param spriteFont  Use an Excalibur sprite font for the label's font, if a SpriteFont is provided it will take precedence
     * over a css font.
     */
    constructor(textOrConfig?: string | Partial<LabelImpl>, x?: number, y?: number, fontFamily?: string, spriteFont?: SpriteFont);
    /**
     * Returns the width of the text in the label (in pixels);
     * @param ctx  Rendering context to measure the string with
     */
    getTextWidth(ctx: CanvasRenderingContext2D): number;
    private _lookupFontUnit;
    private _lookupTextAlign;
    private _lookupBaseAlign;
    private _lookupFontStyle;
    /**
     * Sets the text shadow for sprite fonts
     * @param offsetX      The x offset in pixels to place the shadow
     * @param offsetY      The y offset in pixels to place the shadow
     * @param shadowColor  The color of the text shadow
     */
    setTextShadow(offsetX: number, offsetY: number, shadowColor: Color): void;
    /**
     * Toggles text shadows on or off, only applies when using sprite fonts
     */
    useTextShadow(on: boolean): void;
    /**
     * Clears the current text shadow
     */
    clearTextShadow(): void;
    update(engine: Engine, delta: number): void;
    draw(ctx: CanvasRenderingContext2D, delta: number): void;
    private _fontDraw;
    protected readonly _fontString: string;
    debugDraw(ctx: CanvasRenderingContext2D): void;
}
declare const Label_base: typeof LabelImpl;
/**
 * Labels are the way to draw small amounts of text to the screen. They are
 * actors and inherit all of the benefits and capabilities.
 *
 * [[include:Labels.md]]
 */
export declare class Label extends Label_base {
    constructor();
    constructor(config?: LabelArgs);
    constructor(text?: string, x?: number, y?: number, fontFamily?: string, spriteFont?: SpriteFont);
}
export {};
