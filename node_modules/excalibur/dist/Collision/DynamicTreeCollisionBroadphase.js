import { Physics } from './../Physics';
import { DynamicTree } from './DynamicTree';
import { Pair } from './Pair';
import { Vector, Ray } from '../Algebra';
import { CollisionType } from '../Actor';
import { Logger } from '../Util/Log';
import { CollisionStartEvent, CollisionEndEvent } from '../Events';
var DynamicTreeCollisionBroadphase = /** @class */ (function () {
    function DynamicTreeCollisionBroadphase() {
        this._dynamicCollisionTree = new DynamicTree();
        this._collisionHash = {};
        this._collisionPairCache = [];
        this._lastFramePairs = [];
        this._lastFramePairsHash = {};
    }
    /**
     * Tracks a physics body for collisions
     */
    DynamicTreeCollisionBroadphase.prototype.track = function (target) {
        if (!target) {
            Logger.getInstance().warn('Cannot track null physics body');
            return;
        }
        this._dynamicCollisionTree.trackBody(target);
    };
    /**
     * Untracks a physics body
     */
    DynamicTreeCollisionBroadphase.prototype.untrack = function (target) {
        if (!target) {
            Logger.getInstance().warn('Cannot untrack a null physics body');
            return;
        }
        this._dynamicCollisionTree.untrackBody(target);
    };
    DynamicTreeCollisionBroadphase.prototype._shouldGenerateCollisionPair = function (actorA, actorB) {
        // if the collision pair has been calculated already short circuit
        var hash = Pair.calculatePairHash(actorA.body, actorB.body);
        if (this._collisionHash[hash]) {
            return false; // pair exists easy exit return false
        }
        return Pair.canCollide(actorA, actorB);
    };
    /**
     * Detects potential collision pairs in a broadphase approach with the dynamic aabb tree strategy
     */
    DynamicTreeCollisionBroadphase.prototype.broadphase = function (targets, delta, stats) {
        var _this = this;
        var seconds = delta / 1000;
        // Retrieve the list of potential colliders, exclude killed, prevented, and self
        var potentialColliders = targets.filter(function (other) {
            return !other.isKilled() && other.collisionType !== CollisionType.PreventCollision;
        });
        // clear old list of collision pairs
        this._collisionPairCache = [];
        this._collisionHash = {};
        // check for normal collision pairs
        var actor;
        for (var j = 0, l = potentialColliders.length; j < l; j++) {
            actor = potentialColliders[j];
            // Query the collision tree for potential colliders
            this._dynamicCollisionTree.query(actor.body, function (other) {
                if (_this._shouldGenerateCollisionPair(actor, other.actor)) {
                    var pair = new Pair(actor.body, other);
                    _this._collisionHash[pair.id] = true;
                    _this._collisionPairCache.push(pair);
                }
                // Always return false, to query whole tree. Returning true in the query method stops searching
                return false;
            });
        }
        if (stats) {
            stats.physics.pairs = this._collisionPairCache.length;
        }
        // Check dynamic tree for fast moving objects
        // Fast moving objects are those moving at least there smallest bound per frame
        if (Physics.checkForFastBodies) {
            var _loop_1 = function (actor_1) {
                // Skip non-active objects. Does not make sense on other collison types
                if (actor_1.collisionType !== CollisionType.Active) {
                    return "continue";
                }
                // Maximum travel distance next frame
                updateDistance = actor_1.vel.magnitude() * seconds + // velocity term
                    actor_1.acc.magnitude() * 0.5 * seconds * seconds; // acc term
                // Find the minimum dimension
                minDimension = Math.min(actor_1.body.getBounds().getHeight(), actor_1.body.getBounds().getWidth());
                if (Physics.disableMinimumSpeedForFastBody || updateDistance > minDimension / 2) {
                    if (stats) {
                        stats.physics.fastBodies++;
                    }
                    // start with the oldPos because the integration for actors has already happened
                    // objects resting on a surface may be slightly penatrating in the current position
                    updateVec = actor_1.pos.sub(actor_1.oldPos);
                    centerPoint = actor_1.body.collisionArea.getCenter();
                    furthestPoint = actor_1.body.collisionArea.getFurthestPoint(actor_1.vel);
                    origin = furthestPoint.sub(updateVec);
                    ray = new Ray(origin, actor_1.vel);
                    // back the ray up by -2x surfaceEpsilon to account for fast moving objects starting on the surface
                    ray.pos = ray.pos.add(ray.dir.scale(-2 * Physics.surfaceEpsilon));
                    minTranslate = new Vector(Infinity, Infinity);
                    this_1._dynamicCollisionTree.rayCastQuery(ray, updateDistance + Physics.surfaceEpsilon * 2, function (other) {
                        if (actor_1.body !== other && other.collisionArea) {
                            var hitPoint = other.collisionArea.rayCast(ray, updateDistance + Physics.surfaceEpsilon * 10);
                            if (hitPoint) {
                                var translate = hitPoint.sub(origin);
                                if (translate.magnitude() < minTranslate.magnitude()) {
                                    minTranslate = translate;
                                    minBody = other;
                                }
                            }
                        }
                        return false;
                    });
                    if (minBody && Vector.isValid(minTranslate)) {
                        pair = new Pair(actor_1.body, minBody);
                        if (!this_1._collisionHash[pair.id]) {
                            this_1._collisionHash[pair.id] = true;
                            this_1._collisionPairCache.push(pair);
                        }
                        // move the fast moving object to the other body
                        // need to push into the surface by ex.Physics.surfaceEpsilon
                        shift = centerPoint.sub(furthestPoint);
                        actor_1.pos = origin
                            .add(shift)
                            .add(minTranslate)
                            .add(ray.dir.scale(2 * Physics.surfaceEpsilon));
                        actor_1.body.collisionArea.recalc();
                        if (stats) {
                            stats.physics.fastBodyCollisions++;
                        }
                    }
                }
            };
            var this_1 = this, updateDistance, minDimension, updateVec, centerPoint, furthestPoint, origin, ray, minBody, minTranslate, pair, shift;
            for (var _i = 0, potentialColliders_1 = potentialColliders; _i < potentialColliders_1.length; _i++) {
                var actor_1 = potentialColliders_1[_i];
                _loop_1(actor_1);
            }
        }
        // return cache
        return this._collisionPairCache;
    };
    /**
     * Applies narrow phase on collision pairs to find actual area intersections
     * Adds actual colliding pairs to stats' Frame data
     */
    DynamicTreeCollisionBroadphase.prototype.narrowphase = function (pairs, stats) {
        for (var i = 0; i < pairs.length; i++) {
            pairs[i].collide();
            if (stats && pairs[i].collision) {
                stats.physics.collisions++;
                stats.physics.collidersHash[pairs[i].id] = pairs[i];
            }
        }
        return pairs.filter(function (p) { return p.collision; });
    };
    /**
     * Perform collision resolution given a strategy (rigid body or box) and move objects out of intersect.
     */
    DynamicTreeCollisionBroadphase.prototype.resolve = function (pairs, delta, strategy) {
        for (var _i = 0, pairs_1 = pairs; _i < pairs_1.length; _i++) {
            var pair = pairs_1[_i];
            pair.resolve(strategy);
            if (pair.collision) {
                pair.bodyA.applyMtv();
                pair.bodyB.applyMtv();
                // todo still don't like this, this is a small integration step to resolve narrowphase collisions
                pair.bodyA.actor.integrate(delta * Physics.collisionShift);
                pair.bodyB.actor.integrate(delta * Physics.collisionShift);
            }
        }
        return pairs.filter(function (p) { return p.canCollide; });
    };
    DynamicTreeCollisionBroadphase.prototype.runCollisionStartEnd = function (pairs) {
        var currentFrameHash = {};
        for (var _i = 0, pairs_2 = pairs; _i < pairs_2.length; _i++) {
            var p = pairs_2[_i];
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
     * Update the dynamic tree positions
     */
    DynamicTreeCollisionBroadphase.prototype.update = function (targets) {
        var updated = 0, i = 0, len = targets.length;
        for (i; i < len; i++) {
            if (this._dynamicCollisionTree.updateBody(targets[i].body)) {
                updated++;
            }
        }
        return updated;
    };
    /* istanbul ignore next */
    DynamicTreeCollisionBroadphase.prototype.debugDraw = function (ctx) {
        if (Physics.broadphaseDebug) {
            this._dynamicCollisionTree.debugDraw(ctx);
        }
        if (Physics.showContacts || Physics.showCollisionNormals) {
            for (var _i = 0, _a = this._collisionPairCache; _i < _a.length; _i++) {
                var pair = _a[_i];
                pair.debugDraw(ctx);
            }
        }
    };
    return DynamicTreeCollisionBroadphase;
}());
export { DynamicTreeCollisionBroadphase };
//# sourceMappingURL=DynamicTreeCollisionBroadphase.js.map