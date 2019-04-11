import { Vector } from './Algebra';
/**
 * Possible collision resolution strategies
 *
 * The default is [[CollisionResolutionStrategy.Box]] which performs simple axis aligned arcade style physics.
 *
 * More advanced rigid body physics are enabled by setting [[CollisionResolutionStrategy.RigidBody]] which allows for complicated
 * simulated physical interactions.
 */
export declare enum CollisionResolutionStrategy {
    Box = 0,
    RigidBody = 1
}
/**
 * Possible broadphase collision pair identification strategies
 *
 * The default strategy is [[BroadphaseStrategy.DynamicAABBTree]] which uses a binary tree of axis-aligned bounding boxes to identify
 * potential collision pairs which is O(nlog(n)) faster. The other possible strategy is the [[BroadphaseStrategy.Naive]] strategy
 * which loops over every object for every object in the scene to identify collision pairs which is O(n^2) slower.
 */
export declare enum BroadphaseStrategy {
    Naive = 0,
    DynamicAABBTree = 1
}
/**
 * Possible numerical integrators for position and velocity
 */
export declare enum Integrator {
    Euler = 0
}
/**
 * The [[Physics]] object is the global configuration object for all Excalibur physics.
 *
 * [[include:Physics.md]]
 */
export declare class Physics {
    /**
     * Global acceleration that is applied to all vanilla actors that have a [[CollisionType.Active|active]] collision type.
     * Global acceleration won't effect [[Label|labels]], [[UIActor|ui actors]], or [[Trigger|triggers]] in Excalibur.
     *
     * This is a great way to globally simulate effects like gravity.
     */
    static acc: Vector;
    /**
     * Globally switches all Excalibur physics behavior on or off.
     */
    static enabled: boolean;
    /**
     * Gets or sets the number of collision passes for Excalibur to perform on physics bodies.
     *
     * Reducing collision passes may cause things not to collide as expected in your game, but may increase performance.
     *
     * More passes can improve the visual quality of collisions when many objects are on the screen. This can reduce jitter, improve the
     * collision resolution of fast move objects, or the stability of large numbers of objects stacked together.
     *
     * Fewer passes will improve the performance of the game at the cost of collision quality, more passes will improve quality at the
     * cost of performance.
     *
     * The default is set to 5 passes which is a good start.
     */
    static collisionPasses: number;
    /**
     * Gets or sets the broadphase pair identification strategy.
     *
     * The default strategy is [[BroadphaseStrategy.DynamicAABBTree]] which uses a binary tree of axis-aligned bounding boxes to identify
     * potential collision pairs which is O(nlog(n)) faster. The other possible strategy is the [[BroadphaseStrategy.Naive]] strategy
     * which loops over every object for every object in the scene to identify collision pairs which is O(n^2) slower.
     */
    static broadphaseStrategy: BroadphaseStrategy;
    /**
     * Globally switches the debug information for the broadphase strategy
     */
    static broadphaseDebug: boolean;
    /**
     * Show the normals as a result of collision on the screen.
     */
    static showCollisionNormals: boolean;
    /**
     * Show the position, velocity, and acceleration as graphical vectors.
     */
    static showMotionVectors: boolean;
    /**
     * Show the axis-aligned bounding boxes of the collision bodies on the screen.
     */
    static showBounds: boolean;
    /**
     * Show the bounding collision area shapes
     */
    static showArea: boolean;
    /**
     * Show points of collision interpreted by excalibur as a result of collision.
     */
    static showContacts: boolean;
    /**
     * Show the surface normals of the collision areas.
     */
    static showNormals: boolean;
    /**
     * Gets or sets the global collision resolution strategy (narrowphase).
     *
     * The default is [[CollisionResolutionStrategy.Box]] which performs simple axis aligned arcade style physics.
     *
     * More advanced rigid body physics are enabled by setting [[CollisionResolutionStrategy.RigidBody]] which allows for complicated
     * simulated physical interactions.
     */
    static collisionResolutionStrategy: CollisionResolutionStrategy;
    /**
     * The default mass to use if none is specified
     */
    static defaultMass: number;
    /**
     * Gets or sets the position and velocity positional integrator, currently only Euler is supported.
     */
    static integrator: Integrator;
    /**
     * Number of steps to use in integration. A higher number improves the positional accuracy over time. This can be useful to increase
     * if you have fast moving objects in your simulation or you have a large number of objects and need to increase stability.
     */
    static integrationSteps: number;
    /**
     * Gets or sets whether rotation is allowed in a RigidBody collision resolution
     */
    static allowRigidBodyRotation: boolean;
    /**
     * Configures Excalibur to use box physics. Box physics which performs simple axis aligned arcade style physics.
     */
    static useBoxPhysics(): void;
    /**
     * Configures Excalibur to use rigid body physics. Rigid body physics allows for complicated
     * simulated physical interactions.
     */
    static useRigidBodyPhysics(): void;
    /**
     * Small value to help collision passes settle themselves after the narrowphase.
     */
    static collisionShift: number;
    /**
     * Factor to add to the RigidBody BoundingBox, bounding box (dimensions += vel * dynamicTreeVelocityMultiplyer);
     */
    static dynamicTreeVelocityMultiplyer: number;
    /**
     * Pad RigidBody BoundingBox by a constant amount
     */
    static boundsPadding: number;
    /**
     * Surface epsilon is used to help deal with surface penatration
     */
    static surfaceEpsilon: number;
    /**
     * Enable fast moving body checking, this enables checking for collision pairs via raycast for fast moving objects to prevent
     * bodies from tunneling through one another.
     */
    static checkForFastBodies: boolean;
    /**
     * Disable minimum fast moving body raycast, by default if ex.Physics.checkForFastBodies = true Excalibur will only check if the
     * body is moving at least half of its minimum diminension in an update. If ex.Physics.disableMinimumSpeedForFastBody is set to true,
     * Excalibur will always perform the fast body raycast regardless of speed.
     */
    static disableMinimumSpeedForFastBody: boolean;
}
