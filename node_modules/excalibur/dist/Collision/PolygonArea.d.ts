import { Color } from './../Drawing/Color';
import { BoundingBox } from './BoundingBox';
import { CollisionContact } from './CollisionContact';
import { CollisionArea } from './CollisionArea';
import { Body } from './Body';
import { Vector, Line, Ray, Projection } from './../Algebra';
export interface PolygonAreaOptions {
    pos?: Vector;
    points?: Vector[];
    clockwiseWinding?: boolean;
    body?: Body;
}
/**
 * Polygon collision area for detecting collisions for actors, or independently
 */
export declare class PolygonArea implements CollisionArea {
    pos: Vector;
    points: Vector[];
    body: Body;
    private _transformedPoints;
    private _axes;
    private _sides;
    constructor(options: PolygonAreaOptions);
    /**
     * Get the center of the collision area in world coordinates
     */
    getCenter(): Vector;
    /**
     * Calculates the underlying transformation from the body relative space to world space
     */
    private _calculateTransformation;
    /**
     * Gets the points that make up the polygon in world space, from actor relative space (if specified)
     */
    getTransformedPoints(): Vector[];
    /**
     * Gets the sides of the polygon in world space
     */
    getSides(): Line[];
    recalc(): void;
    /**
     * Tests if a point is contained in this collision area in world space
     */
    contains(point: Vector): boolean;
    /**
     * Returns a collision contact if the 2 collision areas collide, otherwise collide will
     * return null.
     * @param area
     */
    collide(area: CollisionArea): CollisionContact;
    /**
     * Find the point on the shape furthest in the direction specified
     */
    getFurthestPoint(direction: Vector): Vector;
    /**
     * Finds the closes face to the point using perpendicular distance
     * @param point point to test against polygon
     */
    getClosestFace(point: Vector): {
        distance: Vector;
        face: Line;
    };
    /**
     * Get the axis aligned bounding box for the polygon area
     */
    getBounds(): BoundingBox;
    /**
     * Get the moment of inertia for an arbitrary polygon
     * https://en.wikipedia.org/wiki/List_of_moments_of_inertia
     */
    getMomentOfInertia(): number;
    /**
     * Casts a ray into the polygon and returns a vector representing the point of contact (in world space) or null if no collision.
     */
    rayCast(ray: Ray, max?: number): Vector;
    /**
     * Get the axis associated with the edge
     */
    getAxes(): Vector[];
    /**
     * Perform Separating Axis test against another polygon, returns null if no overlap in polys
     * Reference http://www.dyn4j.org/2010/01/sat/
     */
    testSeparatingAxisTheorem(other: PolygonArea): Vector;
    /**
     * Project the edges of the polygon along a specified axis
     */
    project(axis: Vector): Projection;
    debugDraw(ctx: CanvasRenderingContext2D, color?: Color): void;
}
