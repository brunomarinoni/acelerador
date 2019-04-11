/**
 * Debug statistics and flags for Excalibur. If polling these values, it would be
 * best to do so on the `postupdate` event for [[Engine]], after all values have been
 * updated during a frame.
 */
var Debug = /** @class */ (function () {
    function Debug() {
        /**
         * Performance statistics
         */
        this.stats = {
            /**
             * Current frame statistics. Engine reuses this instance, use [[FrameStats.clone]] to copy frame stats.
             * Best accessed on [[postframe]] event. See [[IFrameStats]]
             */
            currFrame: new FrameStats(),
            /**
             * Previous frame statistics. Engine reuses this instance, use [[FrameStats.clone]] to copy frame stats.
             * Best accessed on [[preframe]] event. Best inspected on engine event `preframe`. See [[IFrameStats]]
             */
            prevFrame: new FrameStats()
        };
    }
    return Debug;
}());
export { Debug };
/**
 * Implementation of a frame's stats. Meant to have values copied via [[FrameStats.reset]], avoid
 * creating instances of this every frame.
 */
var FrameStats = /** @class */ (function () {
    function FrameStats() {
        this._id = 0;
        this._delta = 0;
        this._fps = 0;
        this._actorStats = {
            alive: 0,
            killed: 0,
            ui: 0,
            get remaining() {
                return this.alive - this.killed;
            },
            get total() {
                return this.remaining + this.ui;
            }
        };
        this._durationStats = {
            update: 0,
            draw: 0,
            get total() {
                return this.update + this.draw;
            }
        };
        this._physicsStats = new PhysicsStats();
    }
    /**
     * Zero out values or clone other IFrameStat stats. Allows instance reuse.
     *
     * @param [otherStats] Optional stats to clone
     */
    FrameStats.prototype.reset = function (otherStats) {
        if (otherStats) {
            this.id = otherStats.id;
            this.delta = otherStats.delta;
            this.fps = otherStats.fps;
            this.actors.alive = otherStats.actors.alive;
            this.actors.killed = otherStats.actors.killed;
            this.actors.ui = otherStats.actors.ui;
            this.duration.update = otherStats.duration.update;
            this.duration.draw = otherStats.duration.draw;
            this._physicsStats.reset(otherStats.physics);
        }
        else {
            this.id = this.delta = this.fps = 0;
            this.actors.alive = this.actors.killed = this.actors.ui = 0;
            this.duration.update = this.duration.draw = 0;
            this._physicsStats.reset();
        }
    };
    /**
     * Provides a clone of this instance.
     */
    FrameStats.prototype.clone = function () {
        var fs = new FrameStats();
        fs.reset(this);
        return fs;
    };
    Object.defineProperty(FrameStats.prototype, "id", {
        /**
         * Gets the frame's id
         */
        get: function () {
            return this._id;
        },
        /**
         * Sets the frame's id
         */
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameStats.prototype, "delta", {
        /**
         * Gets the frame's delta (time since last frame)
         */
        get: function () {
            return this._delta;
        },
        /**
         * Sets the frame's delta (time since last frame). Internal use only.
         * @internal
         */
        set: function (value) {
            this._delta = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameStats.prototype, "fps", {
        /**
         * Gets the frame's frames-per-second (FPS)
         */
        get: function () {
            return this._fps;
        },
        /**
         * Sets the frame's frames-per-second (FPS). Internal use only.
         * @internal
         */
        set: function (value) {
            this._fps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameStats.prototype, "actors", {
        /**
         * Gets the frame's actor statistics
         */
        get: function () {
            return this._actorStats;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameStats.prototype, "duration", {
        /**
         * Gets the frame's duration statistics
         */
        get: function () {
            return this._durationStats;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameStats.prototype, "physics", {
        /**
         * Gets the frame's physics statistics
         */
        get: function () {
            return this._physicsStats;
        },
        enumerable: true,
        configurable: true
    });
    return FrameStats;
}());
export { FrameStats };
var PhysicsStats = /** @class */ (function () {
    function PhysicsStats() {
        this._pairs = 0;
        this._collisions = 0;
        this._collidersHash = {};
        this._fastBodies = 0;
        this._fastBodyCollisions = 0;
        this._broadphase = 0;
        this._narrowphase = 0;
    }
    /**
     * Zero out values or clone other IPhysicsStats stats. Allows instance reuse.
     *
     * @param [otherStats] Optional stats to clone
     */
    PhysicsStats.prototype.reset = function (otherStats) {
        if (otherStats) {
            this.pairs = otherStats.pairs;
            this.collisions = otherStats.collisions;
            this.collidersHash = otherStats.collidersHash;
            this.fastBodies = otherStats.fastBodies;
            this.fastBodyCollisions = otherStats.fastBodyCollisions;
            this.broadphase = otherStats.broadphase;
            this.narrowphase = otherStats.narrowphase;
        }
        else {
            this.pairs = this.collisions = this.fastBodies = 0;
            this.fastBodyCollisions = this.broadphase = this.narrowphase = 0;
            this.collidersHash = {};
        }
    };
    /**
     * Provides a clone of this instance.
     */
    PhysicsStats.prototype.clone = function () {
        var ps = new PhysicsStats();
        ps.reset(this);
        return ps;
    };
    Object.defineProperty(PhysicsStats.prototype, "pairs", {
        get: function () {
            return this._pairs;
        },
        set: function (value) {
            this._pairs = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhysicsStats.prototype, "collisions", {
        get: function () {
            return this._collisions;
        },
        set: function (value) {
            this._collisions = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhysicsStats.prototype, "collidersHash", {
        get: function () {
            return this._collidersHash;
        },
        set: function (colliders) {
            this._collidersHash = colliders;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhysicsStats.prototype, "fastBodies", {
        get: function () {
            return this._fastBodies;
        },
        set: function (value) {
            this._fastBodies = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhysicsStats.prototype, "fastBodyCollisions", {
        get: function () {
            return this._fastBodyCollisions;
        },
        set: function (value) {
            this._fastBodyCollisions = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhysicsStats.prototype, "broadphase", {
        get: function () {
            return this._broadphase;
        },
        set: function (value) {
            this._broadphase = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PhysicsStats.prototype, "narrowphase", {
        get: function () {
            return this._narrowphase;
        },
        set: function (value) {
            this._narrowphase = value;
        },
        enumerable: true,
        configurable: true
    });
    return PhysicsStats;
}());
export { PhysicsStats };
//# sourceMappingURL=Debug.js.map