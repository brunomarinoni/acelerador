import { CollisionArea } from './CollisionArea';
import { BoundingBox } from './BoundingBox';
import { Vector } from '../Algebra';
import { Actor } from '../Actor';
export declare class Body {
    actor: Actor;
    /**
     * Constructs a new physics body associated with an actor
     */
    constructor(actor: Actor);
    /**
     * [[ICollisionArea|Collision area]] of this physics body, defines the shape for rigid body collision
     */
    collisionArea: CollisionArea;
    /**
     * The (x, y) position of the actor this will be in the middle of the actor if the
     * [[Actor.anchor]] is set to (0.5, 0.5) which is default.
     * If you want the (x, y) position to be the top left of the actor specify an anchor of (0, 0).
     */
    pos: Vector;
    /**
     * The position of the actor last frame (x, y) in pixels
     */
    oldPos: Vector;
    /**
     * The current velocity vector (vx, vy) of the actor in pixels/second
     */
    vel: Vector;
    /**
     * The velocity of the actor last frame (vx, vy) in pixels/second
     */
    oldVel: Vector;
    /**
     * The curret acceleration vector (ax, ay) of the actor in pixels/second/second. An acceleration pointing down such as (0, 100) may
     * be useful to simulate a gravitational effect.
     */
    acc: Vector;
    /**
     * The current torque applied to the actor
     */
    torque: number;
    /**
     * The current mass of the actor, mass can be thought of as the resistance to acceleration.
     */
    mass: number;
    /**
     * The current moment of inertia, moi can be thought of as the resistance to rotation.
     */
    moi: number;
    /**
     * The current "motion" of the actor, used to calculated sleep in the physics simulation
     */
    motion: number;
    /**
     * The coefficient of friction on this actor
     */
    friction: number;
    /**
     * The coefficient of restitution of this actor, represents the amount of energy preserved after collision
     */
    restitution: number;
    /**
     * The rotation of the actor in radians
     */
    rotation: number;
    /**
     * The rotational velocity of the actor in radians/second
     */
    rx: number;
    private _totalMtv;
    /**
     * Add minimum translation vectors accumulated during the current frame to resolve collisions.
     */
    addMtv(mtv: Vector): void;
    /**
     * Applies the accumulated translation vectors to the actors position
     */
    applyMtv(): void;
    /**
     * Returns the body's [[BoundingBox]] calculated for this instant in world space.
     */
    getBounds(): BoundingBox;
    /**
     * Returns the actor's [[BoundingBox]] relative to the actors position.
     */
    getRelativeBounds(): BoundingBox;
    /**
     * Updates the collision area geometry and internal caches
     */
    update(): void;
    /**
     * Sets up a box collision area based on the current bounds of the associated actor of this physics body.
     *
     * By default, the box is center is at (0, 0) which means it is centered around the actors anchor.
     */
    useBoxCollision(center?: Vector): void;
    /**
     * Sets up a polygon collision area based on a list of of points relative to the anchor of the associated actor of this physics body.
     *
     * Only [convex polygon](https://en.wikipedia.org/wiki/Convex_polygon) definitions are supported.
     *
     * By default, the box is center is at (0, 0) which means it is centered around the actors anchor.
     */
    usePolygonCollision(points: Vector[], center?: Vector): void;
    /**
     * Sets up a [[CircleArea|circle collision area]] with a specified radius in pixels.
     *
     * By default, the box is center is at (0, 0) which means it is centered around the actors anchor.
     */
    useCircleCollision(radius?: number, center?: Vector): void;
    /**
     * Sets up an [[EdgeArea|edge collision]] with a start point and an end point relative to the anchor of the associated actor
     * of this physics body.
     *
     * By default, the box is center is at (0, 0) which means it is centered around the actors anchor.
     */
    useEdgeCollision(begin: Vector, end: Vector): void;
    debugDraw(ctx: CanvasRenderingContext2D): void;
    /**
     * Returns a boolean indicating whether this body collided with
     * or was in stationary contact with
     * the body of the other [[Actor]]
     */
    touching(other: Actor): boolean;
}
