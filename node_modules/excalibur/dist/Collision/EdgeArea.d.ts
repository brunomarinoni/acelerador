import { Body } from './Body';
import { BoundingBox } from './BoundingBox';
import { CollisionContact } from './CollisionContact';
import { CollisionArea } from './CollisionArea';
import { Vector, Ray, Projection } from '../Algebra';
import { Color } from '../Drawing/Color';
export interface EdgeAreaOptions {
    begin?: Vector;
    end?: Vector;
    body?: Body;
}
export declare class EdgeArea implements CollisionArea {
    body: Body;
    pos: Vector;
    begin: Vector;
    end: Vector;
    constructor(options: EdgeAreaOptions);
    /**
     * Get the center of the collision area in world coordinates
     */
    getCenter(): Vector;
    private _getBodyPos;
    private _getTransformedBegin;
    private _getTransformedEnd;
    /**
     * Returns the slope of the line in the form of a vector
     */
    getSlope(): Vector;
    /**
     * Returns the length of the line segment in pixels
     */
    getLength(): number;
    /**
     * Tests if a point is contained in this collision area
     */
    contains(): boolean;
    /**
     * @inheritdoc
     */
    rayCast(ray: Ray, max?: number): Vector;
    /**
     * @inheritdoc
     */
    collide(area: CollisionArea): CollisionContact;
    /**
     * Find the point on the shape furthest in the direction specified
     */
    getFurthestPoint(direction: Vector): Vector;
    /**
     * Get the axis aligned bounding box for the circle area
     */
    getBounds(): BoundingBox;
    /**
     * Get the axis associated with the edge
     */
    getAxes(): Vector[];
    /**
     * Get the moment of inertia for an edge
     * https://en.wikipedia.org/wiki/List_of_moments_of_inertia
     */
    getMomentOfInertia(): number;
    /**
     * @inheritdoc
     */
    recalc(): void;
    /**
     * Project the edge along a specified axis
     */
    project(axis: Vector): Projection;
    debugDraw(ctx: CanvasRenderingContext2D, color?: Color): void;
}
