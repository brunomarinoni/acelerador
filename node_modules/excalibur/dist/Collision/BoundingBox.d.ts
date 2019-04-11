import { PolygonArea } from './PolygonArea';
import { Actor } from '../Actor';
import { Vector, Ray } from '../Algebra';
import { Color } from '../Drawing/Color';
/**
 * Interface all collidable objects must implement
 */
export interface Collidable {
    /**
     * Test whether this bounding box collides with another one.
     *
     * @param collidable  Other collidable to test
     * @returns Vector The intersection vector that can be used to resolve the collision.
     * If there is no collision, `null` is returned.
     */
    collides(collidable: Collidable): Vector;
    /**
     * Tests wether a point is contained within the collidable
     * @param point  The point to test
     */
    contains(point: Vector): boolean;
    debugDraw(ctx: CanvasRenderingContext2D): void;
}
/**
 * Axis Aligned collision primitive for Excalibur.
 */
export declare class BoundingBox implements Collidable {
    left: number;
    top: number;
    right: number;
    bottom: number;
    /**
     * @param left    x coordinate of the left edge
     * @param top     y coordinate of the top edge
     * @param right   x coordinate of the right edge
     * @param bottom  y coordinate of the bottom edge
     */
    constructor(left?: number, top?: number, right?: number, bottom?: number);
    static fromPoints(points: Vector[]): BoundingBox;
    /**
     * Returns the calculated width of the bounding box
     */
    getWidth(): number;
    /**
     * Returns the calculated height of the bounding box
     */
    getHeight(): number;
    /**
     * Rotates a bounding box by and angle and around a point, if no point is specified (0, 0) is used by default. The resulting bounding
     * box is also axis-align. This is useful when a new axis-aligned bounding box is needed for rotated geometry.
     */
    rotate(angle: number, point?: Vector): BoundingBox;
    /**
     * Returns the perimeter of the bounding box
     */
    getPerimeter(): number;
    getPoints(): Vector[];
    /**
     * Creates a Polygon collision area from the points of the bounding box
     */
    toPolygon(actor?: Actor): PolygonArea;
    /**
     * Determines whether a ray intersects with a bounding box
     */
    rayCast(ray: Ray, farClipDistance?: number): boolean;
    rayCastTime(ray: Ray, farClipDistance?: number): number;
    /**
     * Tests whether a point is contained within the bounding box
     * @param p  The point to test
     */
    contains(p: Vector): boolean;
    /**
     * Tests whether another bounding box is totally contained in this one
     * @param bb  The bounding box to test
     */
    contains(bb: BoundingBox): boolean;
    /**
     * Combines this bounding box and another together returning a new bounding box
     * @param other  The bounding box to combine
     */
    combine(other: BoundingBox): BoundingBox;
    readonly dimensions: Vector;
    /**
     * Test wether this bounding box collides with another returning,
     * the intersection vector that can be used to resolve the collision. If there
     * is no collision null is returned.
     *
     * @returns A Vector in the direction of the current BoundingBox
     * @param collidable  Other collidable to test
     */
    collides(collidable: Collidable): Vector;
    debugDraw(ctx: CanvasRenderingContext2D, color?: Color): void;
}
