import { Body } from './Body';
import { BoundingBox } from './BoundingBox';
import { CollisionArea } from './CollisionArea';
import { PolygonArea } from './PolygonArea';
import { CollisionContact } from './CollisionContact';
import { Vector, Ray, Projection } from '../Algebra';
import { Color } from '../Drawing/Color';
export interface CircleAreaOptions {
    pos?: Vector;
    radius?: number;
    body?: Body;
}
/**
 * This is a circle collision area for the excalibur rigid body physics simulation
 */
export declare class CircleArea implements CollisionArea {
    /**
     * This is the center position of the circle, relative to the body position
     */
    pos: Vector;
    /**
     * This is the radius of the circle
     */
    radius: number;
    /**
     * The actor associated with this collision area
     */
    body: Body;
    constructor(options: CircleAreaOptions);
    /**
     * Get the center of the collision area in world coordinates
     */
    getCenter(): Vector;
    /**
     * Tests if a point is contained in this collision area
     */
    contains(point: Vector): boolean;
    /**
     * Casts a ray at the CircleArea and returns the nearest point of collision
     * @param ray
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
     * Get axis not implemented on circles, since there are infinite axis in a circle
     */
    getAxes(): Vector[];
    /**
     * Returns the moment of inertia of a circle given it's mass
     * https://en.wikipedia.org/wiki/List_of_moments_of_inertia
     */
    getMomentOfInertia(): number;
    /**
     * Tests the separating axis theorem for circles against polygons
     */
    testSeparatingAxisTheorem(polygon: PolygonArea): Vector;
    recalc(): void;
    /**
     * Project the circle along a specified axis
     */
    project(axis: Vector): Projection;
    debugDraw(ctx: CanvasRenderingContext2D, color?: Color): void;
}
