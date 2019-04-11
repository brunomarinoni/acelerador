import { Color } from './Color';
import * as Effects from './SpriteEffects';
import { Drawable } from '../Interfaces/Drawable';
import { Vector } from '../Algebra';
/**
 * Creates a closed polygon drawing given a list of [[Vector]]s.
 *
 * @warning Use sparingly as Polygons are performance intensive
 */
export declare class Polygon implements Drawable {
    flipVertical: boolean;
    flipHorizontal: boolean;
    drawWidth: number;
    drawHeight: number;
    width: number;
    height: number;
    /**
     * The color to use for the lines of the polygon
     */
    lineColor: Color;
    /**
     * The color to use for the interior of the polygon
     */
    fillColor: Color;
    /**
     * The width of the lines of the polygon
     */
    lineWidth: number;
    /**
     * Indicates whether the polygon is filled or not.
     */
    filled: boolean;
    private _points;
    anchor: Vector;
    rotation: number;
    scale: Vector;
    /**
     * @param points  The vectors to use to build the polygon in order
     */
    constructor(points: Vector[]);
    /**
     * @notimplemented Effects are not supported on `Polygon`
     */
    addEffect(): void;
    /**
     * @notimplemented Effects are not supported on `Polygon`
     */
    removeEffect(index: number): void;
    /**
     * @notimplemented Effects are not supported on `Polygon`
     */
    removeEffect(effect: Effects.SpriteEffect): void;
    /**
     * @notimplemented Effects are not supported on `Polygon`
     */
    clearEffects(): void;
    reset(): void;
    draw(ctx: CanvasRenderingContext2D, x: number, y: number): void;
}
