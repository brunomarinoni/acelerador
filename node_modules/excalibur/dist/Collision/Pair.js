import { Physics } from './../Physics';
import { Color } from './../Drawing/Color';
import { CollisionType } from '../Actor';
import * as DrawUtil from '../Util/DrawUtil';
/**
 * Models a potential collision between 2 bodies
 */
var Pair = /** @class */ (function () {
    function Pair(bodyA, bodyB) {
        this.bodyA = bodyA;
        this.bodyB = bodyB;
        this.id = null;
        this.collision = null;
        this.id = Pair.calculatePairHash(bodyA, bodyB);
    }
    Pair.canCollide = function (actorA, actorB) {
        // if both are fixed short circuit
        if (actorA.collisionType === CollisionType.Fixed && actorB.collisionType === CollisionType.Fixed) {
            return false;
        }
        // if the either is prevent collision short circuit
        if (actorB.collisionType === CollisionType.PreventCollision || actorA.collisionType === CollisionType.PreventCollision) {
            return false;
        }
        // if either is dead short circuit
        if (actorA.isKilled() || actorB.isKilled()) {
            return false;
        }
        return true;
    };
    Object.defineProperty(Pair.prototype, "canCollide", {
        /**
         * Returns whether or not it is possible for the pairs to collide
         */
        get: function () {
            var actorA = this.bodyA.actor;
            var actorB = this.bodyB.actor;
            return Pair.canCollide(actorA, actorB);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Runs the collison intersection logic on the members of this pair
     */
    Pair.prototype.collide = function () {
        this.collision = this.bodyA.collisionArea.collide(this.bodyB.collisionArea);
    };
    /**
     * Resovles the collision body position and velocity if a collision occured
     */
    Pair.prototype.resolve = function (strategy) {
        if (this.collision) {
            this.collision.resolve(strategy);
        }
    };
    /**
     * Calculates the unique pair hash id for this collision pair
     */
    Pair.calculatePairHash = function (bodyA, bodyB) {
        if (bodyA.actor.id < bodyB.actor.id) {
            return "#" + bodyA.actor.id + "+" + bodyB.actor.id;
        }
        else {
            return "#" + bodyB.actor.id + "+" + bodyA.actor.id;
        }
    };
    /* istanbul ignore next */
    Pair.prototype.debugDraw = function (ctx) {
        if (this.collision) {
            if (Physics.showContacts) {
                DrawUtil.point(ctx, Color.Red, this.collision.point);
            }
            if (Physics.showCollisionNormals) {
                DrawUtil.vector(ctx, Color.Cyan, this.collision.point, this.collision.normal, 30);
            }
        }
    };
    return Pair;
}());
export { Pair };
//# sourceMappingURL=Pair.js.map