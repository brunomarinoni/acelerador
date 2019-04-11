import { Physics, CollisionResolutionStrategy } from './../Physics';
import { EdgeArea } from './EdgeArea';
import { CircleArea } from './CircleArea';
import { PolygonArea } from './PolygonArea';
import { Pair } from './Pair';
import { Vector } from '../Algebra';
import { Color } from '../Drawing/Color';
import * as DrawUtil from '../Util/DrawUtil';
var Body = /** @class */ (function () {
    /**
     * Constructs a new physics body associated with an actor
     */
    function Body(actor) {
        this.actor = actor;
        /**
         * [[ICollisionArea|Collision area]] of this physics body, defines the shape for rigid body collision
         */
        this.collisionArea = null;
        /**
         * The (x, y) position of the actor this will be in the middle of the actor if the
         * [[Actor.anchor]] is set to (0.5, 0.5) which is default.
         * If you want the (x, y) position to be the top left of the actor specify an anchor of (0, 0).
         */
        this.pos = new Vector(0, 0);
        /**
         * The position of the actor last frame (x, y) in pixels
         */
        this.oldPos = new Vector(0, 0);
        /**
         * The current velocity vector (vx, vy) of the actor in pixels/second
         */
        this.vel = new Vector(0, 0);
        /**
         * The velocity of the actor last frame (vx, vy) in pixels/second
         */
        this.oldVel = new Vector(0, 0);
        /**
         * The curret acceleration vector (ax, ay) of the actor in pixels/second/second. An acceleration pointing down such as (0, 100) may
         * be useful to simulate a gravitational effect.
         */
        this.acc = new Vector(0, 0);
        /**
         * The current torque applied to the actor
         */
        this.torque = 0;
        /**
         * The current mass of the actor, mass can be thought of as the resistance to acceleration.
         */
        this.mass = 1.0;
        /**
         * The current moment of inertia, moi can be thought of as the resistance to rotation.
         */
        this.moi = 1000;
        /**
         * The current "motion" of the actor, used to calculated sleep in the physics simulation
         */
        this.motion = 10;
        /**
         * The coefficient of friction on this actor
         */
        this.friction = 0.99;
        /**
         * The coefficient of restitution of this actor, represents the amount of energy preserved after collision
         */
        this.restitution = 0.2;
        /**
         * The rotation of the actor in radians
         */
        this.rotation = 0; // radians
        /**
         * The rotational velocity of the actor in radians/second
         */
        this.rx = 0; //radians/sec
        this._totalMtv = Vector.Zero;
    }
    /**
     * Add minimum translation vectors accumulated during the current frame to resolve collisions.
     */
    Body.prototype.addMtv = function (mtv) {
        this._totalMtv.addEqual(mtv);
    };
    /**
     * Applies the accumulated translation vectors to the actors position
     */
    Body.prototype.applyMtv = function () {
        this.pos.addEqual(this._totalMtv);
        this._totalMtv.setTo(0, 0);
    };
    /**
     * Returns the body's [[BoundingBox]] calculated for this instant in world space.
     */
    Body.prototype.getBounds = function () {
        if (Physics.collisionResolutionStrategy === CollisionResolutionStrategy.Box) {
            return this.actor.getBounds();
        }
        else {
            return this.collisionArea.getBounds();
        }
    };
    /**
     * Returns the actor's [[BoundingBox]] relative to the actors position.
     */
    Body.prototype.getRelativeBounds = function () {
        if (Physics.collisionResolutionStrategy === CollisionResolutionStrategy.Box) {
            return this.actor.getRelativeBounds();
        }
        else {
            return this.actor.getRelativeBounds();
        }
    };
    /**
     * Updates the collision area geometry and internal caches
     */
    Body.prototype.update = function () {
        if (this.collisionArea) {
            // Update the geometry if needed
            if (this.actor && this.actor.isGeometryDirty && this.collisionArea instanceof PolygonArea) {
                this.collisionArea.points = this.actor.getRelativeGeometry();
            }
            this.collisionArea.recalc();
        }
    };
    /**
     * Sets up a box collision area based on the current bounds of the associated actor of this physics body.
     *
     * By default, the box is center is at (0, 0) which means it is centered around the actors anchor.
     */
    Body.prototype.useBoxCollision = function (center) {
        if (center === void 0) { center = Vector.Zero; }
        this.collisionArea = new PolygonArea({
            body: this,
            points: this.actor.getRelativeGeometry(),
            pos: center // position relative to actor
        });
        // in case of a nan moi, coalesce to a safe default
        this.moi = this.collisionArea.getMomentOfInertia() || this.moi;
    };
    /**
     * Sets up a polygon collision area based on a list of of points relative to the anchor of the associated actor of this physics body.
     *
     * Only [convex polygon](https://en.wikipedia.org/wiki/Convex_polygon) definitions are supported.
     *
     * By default, the box is center is at (0, 0) which means it is centered around the actors anchor.
     */
    Body.prototype.usePolygonCollision = function (points, center) {
        if (center === void 0) { center = Vector.Zero; }
        this.collisionArea = new PolygonArea({
            body: this,
            points: points,
            pos: center // position relative to actor
        });
        // in case of a nan moi, collesce to a safe default
        this.moi = this.collisionArea.getMomentOfInertia() || this.moi;
    };
    /**
     * Sets up a [[CircleArea|circle collision area]] with a specified radius in pixels.
     *
     * By default, the box is center is at (0, 0) which means it is centered around the actors anchor.
     */
    Body.prototype.useCircleCollision = function (radius, center) {
        if (center === void 0) { center = Vector.Zero; }
        if (!radius) {
            radius = this.actor.getWidth() / 2;
        }
        this.collisionArea = new CircleArea({
            body: this,
            radius: radius,
            pos: center
        });
        this.moi = this.collisionArea.getMomentOfInertia() || this.moi;
    };
    /**
     * Sets up an [[EdgeArea|edge collision]] with a start point and an end point relative to the anchor of the associated actor
     * of this physics body.
     *
     * By default, the box is center is at (0, 0) which means it is centered around the actors anchor.
     */
    Body.prototype.useEdgeCollision = function (begin, end) {
        this.collisionArea = new EdgeArea({
            begin: begin,
            end: end,
            body: this
        });
        this.moi = this.collisionArea.getMomentOfInertia() || this.moi;
    };
    /* istanbul ignore next */
    Body.prototype.debugDraw = function (ctx) {
        // Draw motion vectors
        if (Physics.showMotionVectors) {
            DrawUtil.vector(ctx, Color.Yellow, this.pos, this.acc.add(Physics.acc));
            DrawUtil.vector(ctx, Color.Red, this.pos, this.vel);
            DrawUtil.point(ctx, Color.Red, this.pos);
        }
        if (Physics.showBounds) {
            this.getBounds().debugDraw(ctx, Color.Yellow);
        }
        if (Physics.showArea) {
            this.collisionArea.debugDraw(ctx, Color.Green);
        }
    };
    /**
     * Returns a boolean indicating whether this body collided with
     * or was in stationary contact with
     * the body of the other [[Actor]]
     */
    Body.prototype.touching = function (other) {
        var pair = new Pair(this, other.body);
        pair.collide();
        if (pair.collision) {
            return true;
        }
        return false;
    };
    return Body;
}());
export { Body };
//# sourceMappingURL=Body.js.map