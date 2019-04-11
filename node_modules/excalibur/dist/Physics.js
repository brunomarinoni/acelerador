import { Vector } from './Algebra';
/**
 * Possible collision resolution strategies
 *
 * The default is [[CollisionResolutionStrategy.Box]] which performs simple axis aligned arcade style physics.
 *
 * More advanced rigid body physics are enabled by setting [[CollisionResolutionStrategy.RigidBody]] which allows for complicated
 * simulated physical interactions.
 */
export var CollisionResolutionStrategy;
(function (CollisionResolutionStrategy) {
    CollisionResolutionStrategy[CollisionResolutionStrategy["Box"] = 0] = "Box";
    CollisionResolutionStrategy[CollisionResolutionStrategy["RigidBody"] = 1] = "RigidBody";
})(CollisionResolutionStrategy || (CollisionResolutionStrategy = {}));
/**
 * Possible broadphase collision pair identification strategies
 *
 * The default strategy is [[BroadphaseStrategy.DynamicAABBTree]] which uses a binary tree of axis-aligned bounding boxes to identify
 * potential collision pairs which is O(nlog(n)) faster. The other possible strategy is the [[BroadphaseStrategy.Naive]] strategy
 * which loops over every object for every object in the scene to identify collision pairs which is O(n^2) slower.
 */
export var BroadphaseStrategy;
(function (BroadphaseStrategy) {
    BroadphaseStrategy[BroadphaseStrategy["Naive"] = 0] = "Naive";
    BroadphaseStrategy[BroadphaseStrategy["DynamicAABBTree"] = 1] = "DynamicAABBTree";
})(BroadphaseStrategy || (BroadphaseStrategy = {}));
/**
 * Possible numerical integrators for position and velocity
 */
export var Integrator;
(function (Integrator) {
    Integrator[Integrator["Euler"] = 0] = "Euler";
})(Integrator || (Integrator = {}));
/**
 * The [[Physics]] object is the global configuration object for all Excalibur physics.
 *
 * [[include:Physics.md]]
 */
/* istanbul ignore next */
var Physics = /** @class */ (function () {
    function Physics() {
    }
    /**
     * Configures Excalibur to use box physics. Box physics which performs simple axis aligned arcade style physics.
     */
    Physics.useBoxPhysics = function () {
        Physics.collisionResolutionStrategy = CollisionResolutionStrategy.Box;
    };
    /**
     * Configures Excalibur to use rigid body physics. Rigid body physics allows for complicated
     * simulated physical interactions.
     */
    Physics.useRigidBodyPhysics = function () {
        Physics.collisionResolutionStrategy = CollisionResolutionStrategy.RigidBody;
    };
    /**
     * Global acceleration that is applied to all vanilla actors that have a [[CollisionType.Active|active]] collision type.
     * Global acceleration won't effect [[Label|labels]], [[UIActor|ui actors]], or [[Trigger|triggers]] in Excalibur.
     *
     * This is a great way to globally simulate effects like gravity.
     */
    Physics.acc = new Vector(0, 0);
    /**
     * Globally switches all Excalibur physics behavior on or off.
     */
    Physics.enabled = true;
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
    Physics.collisionPasses = 5;
    /**
     * Gets or sets the broadphase pair identification strategy.
     *
     * The default strategy is [[BroadphaseStrategy.DynamicAABBTree]] which uses a binary tree of axis-aligned bounding boxes to identify
     * potential collision pairs which is O(nlog(n)) faster. The other possible strategy is the [[BroadphaseStrategy.Naive]] strategy
     * which loops over every object for every object in the scene to identify collision pairs which is O(n^2) slower.
     */
    Physics.broadphaseStrategy = BroadphaseStrategy.DynamicAABBTree;
    /**
     * Globally switches the debug information for the broadphase strategy
     */
    Physics.broadphaseDebug = false;
    /**
     * Show the normals as a result of collision on the screen.
     */
    Physics.showCollisionNormals = false;
    /**
     * Show the position, velocity, and acceleration as graphical vectors.
     */
    Physics.showMotionVectors = false;
    /**
     * Show the axis-aligned bounding boxes of the collision bodies on the screen.
     */
    Physics.showBounds = false;
    /**
     * Show the bounding collision area shapes
     */
    Physics.showArea = false;
    /**
     * Show points of collision interpreted by excalibur as a result of collision.
     */
    Physics.showContacts = false;
    /**
     * Show the surface normals of the collision areas.
     */
    Physics.showNormals = false;
    /**
     * Gets or sets the global collision resolution strategy (narrowphase).
     *
     * The default is [[CollisionResolutionStrategy.Box]] which performs simple axis aligned arcade style physics.
     *
     * More advanced rigid body physics are enabled by setting [[CollisionResolutionStrategy.RigidBody]] which allows for complicated
     * simulated physical interactions.
     */
    Physics.collisionResolutionStrategy = CollisionResolutionStrategy.Box;
    /**
     * The default mass to use if none is specified
     */
    Physics.defaultMass = 10;
    /**
     * Gets or sets the position and velocity positional integrator, currently only Euler is supported.
     */
    Physics.integrator = Integrator.Euler;
    /**
     * Number of steps to use in integration. A higher number improves the positional accuracy over time. This can be useful to increase
     * if you have fast moving objects in your simulation or you have a large number of objects and need to increase stability.
     */
    Physics.integrationSteps = 1;
    /**
     * Gets or sets whether rotation is allowed in a RigidBody collision resolution
     */
    Physics.allowRigidBodyRotation = true;
    /**
     * Small value to help collision passes settle themselves after the narrowphase.
     */
    Physics.collisionShift = 0.001;
    /**
     * Factor to add to the RigidBody BoundingBox, bounding box (dimensions += vel * dynamicTreeVelocityMultiplyer);
     */
    Physics.dynamicTreeVelocityMultiplyer = 2;
    /**
     * Pad RigidBody BoundingBox by a constant amount
     */
    Physics.boundsPadding = 5;
    /**
     * Surface epsilon is used to help deal with surface penatration
     */
    Physics.surfaceEpsilon = 0.1;
    /**
     * Enable fast moving body checking, this enables checking for collision pairs via raycast for fast moving objects to prevent
     * bodies from tunneling through one another.
     */
    Physics.checkForFastBodies = true;
    /**
     * Disable minimum fast moving body raycast, by default if ex.Physics.checkForFastBodies = true Excalibur will only check if the
     * body is moving at least half of its minimum diminension in an update. If ex.Physics.disableMinimumSpeedForFastBody is set to true,
     * Excalibur will always perform the fast body raycast regardless of speed.
     */
    Physics.disableMinimumSpeedForFastBody = false;
    return Physics;
}());
export { Physics };
//# sourceMappingURL=Physics.js.map