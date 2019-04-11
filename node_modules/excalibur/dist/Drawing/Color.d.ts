/**
 * Provides standard colors (e.g. [[Color.Black]])
 * but you can also create custom colors using RGB, HSL, or Hex. Also provides
 * useful color operations like [[Color.lighten]], [[Color.darken]], and more.
 *
 * [[include:Colors.md]]
 */
export declare class Color {
    /**
     * Red channel
     */
    r: number;
    /**
     * Green channel
     */
    g: number;
    /**
     * Blue channel
     */
    b: number;
    /**
     * Alpha channel (between 0 and 1)
     */
    a: number;
    /**
     * Hue
     */
    h: number;
    /**
     * Saturation
     */
    s: number;
    /**
     * Lightness
     */
    l: number;
    /**
     * Creates a new instance of Color from an r, g, b, a
     *
     * @param r  The red component of color (0-255)
     * @param g  The green component of color (0-255)
     * @param b  The blue component of color (0-255)
     * @param a  The alpha component of color (0-1.0)
     */
    constructor(r: number, g: number, b: number, a?: number);
    /**
     * Creates a new instance of Color from an r, g, b, a
     *
     * @param r  The red component of color (0-255)
     * @param g  The green component of color (0-255)
     * @param b  The blue component of color (0-255)
     * @param a  The alpha component of color (0-1.0)
     */
    static fromRGB(r: number, g: number, b: number, a?: number): Color;
    /**
     * Creates a new inscance of Color from a hex string
     *
     * @param hex  CSS color string of the form #ffffff, the alpha component is optional
     */
    static fromHex(hex: string): Color;
    /**
     * Creats a new instance of Color from hsla values
     *
     * @param h  Hue is represented [0-1]
     * @param s  Saturation is represented [0-1]
     * @param l  Luminance is represented [0-1]
     * @param a  Alpha is represented [0-1]
     */
    static fromHSL(h: number, s: number, l: number, a?: number): Color;
    /**
     * Lightens the current color by a specified amount
     *
     * @param factor  The amount to lighten by [0-1]
     */
    lighten(factor?: number): Color;
    /**
     * Darkens the current color by a specified amount
     *
     * @param factor  The amount to darken by [0-1]
     */
    darken(factor?: number): Color;
    /**
     * Saturates the current color by a specified amount
     *
     * @param factor  The amount to saturate by [0-1]
     */
    saturate(factor?: number): Color;
    /**
     * Desaturates the current color by a specified amount
     *
     * @param factor  The amount to desaturate by [0-1]
     */
    desaturate(factor?: number): Color;
    /**
     * Multiplies a color by another, results in a darker color
     *
     * @param color  The other color
     */
    mulitiply(color: Color): Color;
    /**
     * Screens a color by another, results in a lighter color
     *
     * @param color  The other color
     */
    screen(color: Color): Color;
    /**
     * Inverts the current color
     */
    invert(): Color;
    /**
     * Averages the current color with another
     *
     * @param color  The other color
     */
    average(color: Color): Color;
    /**
     * Returns a CSS string representation of a color.
     *
     * @param format Color representation, accepts: rgb, hsl, or hex
     */
    toString(format?: 'rgb' | 'hsl' | 'hex'): string;
    /**
     * Returns Hex Value of a color component
     * @param c color component
     * @see https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     */
    private _componentToHex;
    /**
     * Return Hex representation of a color.
     */
    toHex(): string;
    /**
     * Return RGBA representation of a color.
     */
    toRGBA(): string;
    /**
     * Return HSLA representation of a color.
     */
    toHSLA(): string;
    /**
     * Returns a CSS string representation of a color.
     */
    fillStyle(): string;
    /**
     * Returns a clone of the current color.
     */
    clone(): Color;
    /**
     * Black (#000000)
     */
    static readonly Black: Color;
    /**
     * White (#FFFFFF)
     */
    static readonly White: Color;
    /**
     * Gray (#808080)
     */
    static readonly Gray: Color;
    /**
     * Light gray (#D3D3D3)
     */
    static readonly LightGray: Color;
    /**
     * Dark gray (#A9A9A9)
     */
    static readonly DarkGray: Color;
    /**
     * Yellow (#FFFF00)
     */
    static readonly Yellow: Color;
    /**
     * Orange (#FFA500)
     */
    static readonly Orange: Color;
    /**
     * Red (#FF0000)
     */
    static readonly Red: Color;
    /**
     * Vermillion (#FF5B31)
     */
    static readonly Vermillion: Color;
    /**
     * Rose (#FF007F)
     */
    static readonly Rose: Color;
    /**
     * Magenta (#FF00FF)
     */
    static readonly Magenta: Color;
    /**
     * Violet (#7F00FF)
     */
    static readonly Violet: Color;
    /**
     * Blue (#0000FF)
     */
    static readonly Blue: Color;
    /**
     * Azure (#007FFF)
     */
    static readonly Azure: Color;
    /**
     * Cyan (#00FFFF)
     */
    static readonly Cyan: Color;
    /**
     * Viridian (#59978F)
     */
    static readonly Viridian: Color;
    /**
     * Green (#00FF00)
     */
    static readonly Green: Color;
    /**
     * Chartreuse (#7FFF00)
     */
    static readonly Chartreuse: Color;
    /**
     * Transparent (#FFFFFF00)
     */
    static readonly Transparent: Color;
}
