import { Physics } from './../Physics';
import { CollisionContact } from './CollisionContact';
import { Pair } from './Pair';
import { CollisionType } from './../Actor';
import { CollisionStartEvent, CollisionEndEvent } from '../Events';
var NaiveCollisionBroadphase = /** @class */ (function () {
    function NaiveCollisionBroadphase() {
        this._lastFramePairs = [];
        this._lastFramePairsHash = {};
    }
    NaiveCollisionBroadphase.prototype.track = function () {
        // pass
    };
    NaiveCollisionBroadphase.prototype.untrack = function () {
        // pass
    };
    /**
     * Detects potential collision pairs in a broadphase approach with the dynamic aabb tree strategy
     */
    NaiveCollisionBroadphase.prototype.broadphase = function (targets) {
        // Retrieve the list of potential colliders, exclude killed, prevented, and self
        var potentialColliders = targets.filter(function (other) {
            return !other.isKilled() && other.collisionType !== CollisionType.PreventCollision;
        });
        var actor1;
        var actor2;
        var collisionPairs = [];
        for (var j = 0, l = potentialColliders.length; j < l; j++) {
            actor1 = potentialColliders[j];
            for (var i = j + 1; i < l; i++) {
                actor2 = potentialColliders[i];
                var minimumTranslationVector;
                if ((minimumTranslationVector = actor1.collides(actor2))) {
                    var pair = new Pair(actor1.body, actor2.body);
                    pair.collision = new CollisionContact(actor1.collisionArea, actor2.collisionArea, minimumTranslationVector, actor1.pos, minimumTranslationVector);
                    if (!collisionPairs.some(function (cp) {
                        return cp.id === pair.id;
                    })) {
                        collisionPairs.push(pair);
                    }
                }
            }
        }
        return collisionPairs;
    };
    /**
     * Identify actual collisions from those pairs, and calculate collision impulse
     */
    NaiveCollisionBroadphase.prototype.narrowphase = function (pairs) {
        return pairs;
    };
    NaiveCollisionBroadphase.prototype.runCollisionStartEnd = function (pairs) {
        var currentFrameHash = {};
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var p = pairs_1[_i];
            // load currentFrameHash
            currentFrameHash[p.id] = p;
            // find all new collisions
            if (!this._lastFramePairsHash[p.id]) {
                var actor1 = p.bodyA.actor;
                var actor2 = p.bodyB.actor;
                actor1.emit('collisionstart', new CollisionStartEvent(actor1, actor2, p));
                actor2.emit('collisionstart', new CollisionStartEvent(actor2, actor1, p));
            }
        }
        // find all old collisions
        for (var _a = 0, _b = this._lastFramePairs; _a < _b.length; _a++) {
            var p = _b[_a];
            if (!currentFrameHash[p.id]) {
                var actor1 = p.bodyA.actor;
                var actor2 = p.bodyB.actor;
                actor1.emit('collisionend', new CollisionEndEvent(actor1, actor2));
                actor2.emit('collisionend', new CollisionEndEvent(actor2, actor1));
            }
        }
        // reset the last frame cache
        this._lastFramePairs = pairs;
        this._lastFramePairsHash = currentFrameHash;
    };
    /**
     * Resolve the position and velocity of the physics bodies
     */
    NaiveCollisionBroadphase.prototype.resolve = function (pairs) {
        for (var _i = 0, pairs_2 = pairs; _i < pairs_2.length; _i++) {
            var pair = pairs_2[_i];
            pair.resolve(Physics.collisionResolutionStrategy);
        }
        return pairs.filter(function (p) { return p.canCollide; });
    };
    NaiveCollisionBroadphase.prototype.update = function () {
        return 0;
    };
    NaiveCollisionBroadphase.prototype.debugDraw = function () {
        return;
    };
    return NaiveCollisionBroadphase;
}());
export { NaiveCollisionBroadphase };
//# sourceMappingURL=NaiveCollisionBroadphase.js.map