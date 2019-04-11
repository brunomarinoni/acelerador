import { Color } from '../Drawing/Color';
/**
 * Options for the perlin noise generator
 */
export interface PerlinOptions {
    /**
     * Random number seed for the Perlin noise generator
     */
    seed?: number;
    /**
     * Number of octaves to use when generating the noise, the number of octaves is the number of times the perlin
     * noise is generated and laid on top of itself. Using higher values can increase the curviness of the noise, and
     * make it look more natural.
     */
    octaves?: number;
    /**
     * Frequency to use when generating the noise, the higher the number the more quickly the pattern will oscilate. Another way
     * to think about this is that it is like "zooming" out from an infinite pattern determined by the seed.
     */
    frequency?: number;
    /**
     * The amplitude determines the relative height of the peaks generated in the noise.
     */
    amplitude?: number;
    /**
     * The persistance determines how quickly the amplitude will drop off, a high degree of persistance results in smoother patterns,
     * a low degree of persistance generates spikey patterns.
     */
    persistance?: number;
}
/**
 * Generates perlin noise based on the 2002 Siggraph paper http://mrl.nyu.edu/~perlin/noise/
 * Also https://flafla2.github.io/2014/08/09/perlinnoise.html
 */
export declare class PerlinGenerator {
    private _perm;
    private _p;
    private _random;
    private _defaultPerlinOptions;
    /**
     * The persistance determines how quickly the amplitude will drop off, a high degree of persistance results in smoother patterns,
     * a low degree of persistance generates spikey patterns.
     */
    persistance: number;
    /**
     * The amplitude determines the relative height of the peaks generated in the noise.
     */
    amplitude: number;
    /**
     * Frequency to use when generating the noise, the higher the number the more quickly the pattern will oscilate. Another way
     * to think about this is that it is like "zooming" out from an infinite pattern determined by the seed.
     */
    frequency: number;
    /**
     * Number of octaves to use when generating the noise, the number of octaves is the number of times the perlin
     * noise is generated and laid on top of itself. Using higher values can increase the curviness of the noise, and
     * make it look more natural.
     */
    octaves: number;
    constructor(options?: PerlinOptions);
    /**
     * Generates 1-Dimensional perlin noise given an x and generates noises values between [0, 1].
     */
    noise(x: number): number;
    /**
     * Generates 2-Dimensional perlin noise given an (x, y) and generates noise values between [0, 1]
     */
    noise(x: number, y: number): number;
    /**
     * Generates 3-Dimensional perlin noise given an (x, y, z) and generates noise values between [0, 1]
     */
    noise(x: number, y: number, z: number): number;
    /**
     * Generates a list starting at 0 and ending at 1 of contious perlin noise, by default the step is 1/length;
     *
     */
    sequence(length: number, step?: number): number[];
    /**
     * Generates a 2D grid of perlin noise given a step value packed into a 1D array i = (x + y*width),
     * by default the step will 1/(min(dimension))
     */
    grid(width: number, height: number, step?: number): number[];
    private _gradient3d;
    private _gradient2d;
    private _gradient1d;
    private _noise1d;
    private _noise2d;
    private _noise3d;
}
/**
 * A helper to draw 2D perlin maps given a perlin generator and a function
 */
export declare class PerlinDrawer2D {
    generator: PerlinGenerator;
    colorFcn?: (val: number) => Color;
    /**
     * @param generator - An existing perlin generator
     * @param colorFcn - A color function that takes a value between [0, 255] derived from the perlin generator, and returns a color
     */
    constructor(generator: PerlinGenerator, colorFcn?: (val: number) => Color);
    /**
     * Returns an image of 2D perlin noise
     */
    image(width: number, height: number): HTMLImageElement;
    /**
     * This draws a 2D perlin grid on a canvas context, not recommended to be called every frame due to performance
     */
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void;
}
