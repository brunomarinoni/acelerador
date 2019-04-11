import * as Util from './Util/Util';
/**
 * A 2D vector on a plane.
 */
var Vector = /** @class */ (function () {
    /**
     * @param x  X component of the Vector
     * @param y  Y component of the Vector
     */
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Vector, "Zero", {
        /**
         * A (0, 0) vector
         */
        get: function () {
            return new Vector(0, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector, "One", {
        /**
         * A (1, 1) vector
         */
        get: function () {
            return new Vector(1, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector, "Half", {
        /**
         * A (0.5, 0.5) vector
         */
        get: function () {
            return new Vector(0.5, 0.5);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector, "Up", {
        /**
         * A unit vector pointing up (0, -1)
         */
        get: function () {
            return new Vector(0, -1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector, "Down", {
        /**
         * A unit vector pointing down (0, 1)
         */
        get: function () {
            return new Vector(0, 1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector, "Left", {
        /**
         * A unit vector pointing left (-1, 0)
         */
        get: function () {
            return new Vector(-1, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector, "Right", {
        /**
         * A unit vector pointing right (1, 0)
         */
        get: function () {
            return new Vector(1, 0);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a vector of unit length in the direction of the specified angle in Radians.
     * @param angle The angle to generate the vector
     */
    Vector.fromAngle = function (angle) {
        return new Vector(Math.cos(angle), Math.sin(angle));
    };
    /**
     * Checks if vector is not null, undefined, or if any of its components are NaN or Infinity.
     */
    Vector.isValid = function (vec) {
        if (vec === null || vec === undefined) {
            return false;
        }
        if (isNaN(vec.x) || isNaN(vec.y)) {
            return false;
        }
        if (vec.x === Infinity || vec.y === Infinity || vec.x === -Infinity || vec.y === -Infinity) {
            return false;
        }
        return true;
    };
    /**
     * Calculates distance between two Vectors
     * @param vec1
     * @param vec2
     */
    Vector.distance = function (vec1, vec2) {
        return Math.sqrt(Math.pow(vec1.x - vec2.x, 2) + Math.pow(vec1.y - vec2.y, 2));
    };
    /**
     * Sets the x and y components at once
     */
    Vector.prototype.setTo = function (x, y) {
        this.x = x;
        this.y = y;
    };
    /**
     * Compares this point against another and tests for equality
     * @param point  The other point to compare to
     */
    Vector.prototype.equals = function (vector, tolerance) {
        if (tolerance === void 0) { tolerance = 0.001; }
        return Math.abs(this.x - vector.x) <= tolerance && Math.abs(this.y - vector.y) <= tolerance;
    };
    /**
     * The distance to another vector. If no other Vector is specified, this will return the [[magnitude]].
     * @param v  The other vector. Leave blank to use origin vector.
     */
    Vector.prototype.distance = function (v) {
        if (!v) {
            v = Vector.Zero;
        }
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    };
    /**
     * The magnitude (size) of the Vector
     */
    Vector.prototype.magnitude = function () {
        return this.distance();
    };
    /**
     * Normalizes a vector to have a magnitude of 1.
     */
    Vector.prototype.normalize = function () {
        var d = this.distance();
        if (d > 0) {
            return new Vector(this.x / d, this.y / d);
        }
        else {
            return new Vector(0, 1);
        }
    };
    /**
     * Returns the average (midpoint) between the current point and the specified
     */
    Vector.prototype.average = function (vec) {
        return this.add(vec).scale(0.5);
    };
    /**
     * Scales a vector's by a factor of size
     * @param size  The factor to scale the magnitude by
     */
    Vector.prototype.scale = function (size) {
        return new Vector(this.x * size, this.y * size);
    };
    /**
     * Adds one vector to another
     * @param v The vector to add
     */
    Vector.prototype.add = function (v) {
        return new Vector(this.x + v.x, this.y + v.y);
    };
    /**
     * Subtracts a vector from another, if you subract vector `B.sub(A)` the resulting vector points from A -> B
     * @param v The vector to subtract
     */
    Vector.prototype.sub = function (v) {
        return new Vector(this.x - v.x, this.y - v.y);
    };
    /**
     * Adds one vector to this one modifying the original
     * @param v The vector to add
     */
    Vector.prototype.addEqual = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    /**
     * Subtracts a vector from this one modifying the original
     * @parallel v The vector to subtract
     */
    Vector.prototype.subEqual = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    /**
     * Scales this vector by a factor of size and modifies the original
     */
    Vector.prototype.scaleEqual = function (size) {
        this.x *= size;
        this.y *= size;
        return this;
    };
    /**
     * Performs a dot product with another vector
     * @param v  The vector to dot
     */
    Vector.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector.prototype.cross = function (v) {
        if (v instanceof Vector) {
            return this.x * v.y - this.y * v.x;
        }
        else if (typeof v === 'number') {
            return new Vector(v * this.y, -v * this.x);
        }
    };
    /**
     * Returns the perpendicular vector to this one
     */
    Vector.prototype.perpendicular = function () {
        return new Vector(this.y, -this.x);
    };
    /**
     * Returns the normal vector to this one, same as the perpendicular of length 1
     */
    Vector.prototype.normal = function () {
        return this.perpendicular().normalize();
    };
    /**
     * Negate the current vector
     */
    Vector.prototype.negate = function () {
        return this.scale(-1);
    };
    /**
     * Returns the angle of this vector.
     */
    Vector.prototype.toAngle = function () {
        return Math.atan2(this.y, this.x);
    };
    /**
     * Rotates the current vector around a point by a certain number of
     * degrees in radians
     */
    Vector.prototype.rotate = function (angle, anchor) {
        if (!anchor) {
            anchor = new Vector(0, 0);
        }
        var sinAngle = Math.sin(angle);
        var cosAngle = Math.cos(angle);
        var x = cosAngle * (this.x - anchor.x) - sinAngle * (this.y - anchor.y) + anchor.x;
        var y = sinAngle * (this.x - anchor.x) + cosAngle * (this.y - anchor.y) + anchor.y;
        return new Vector(x, y);
    };
    /**
     * Creates new vector that has the same values as the previous.
     */
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y);
    };
    /**
     * Returns a string repesentation of the vector.
     */
    Vector.prototype.toString = function () {
        return "(" + this.x + ", " + this.y + ")";
    };
    return Vector;
}());
export { Vector };
/**
 * A 2D ray that can be cast into the scene to do collision detection
 */
var Ray = /** @class */ (function () {
    /**
     * @param pos The starting position for the ray
     * @param dir The vector indicating the direction of the ray
     */
    function Ray(pos, dir) {
        this.pos = pos;
        this.dir = dir.normalize();
    }
    /**
     * Tests a whether this ray intersects with a line segment. Returns a number greater than or equal to 0 on success.
     * This number indicates the mathematical intersection time.
     * @param line  The line to test
     */
    Ray.prototype.intersect = function (line) {
        var numerator = line.begin.sub(this.pos);
        // Test is line and ray are parallel and non intersecting
        if (this.dir.cross(line.getSlope()) === 0 && numerator.cross(this.dir) !== 0) {
            return -1;
        }
        // Lines are parallel
        var divisor = this.dir.cross(line.getSlope());
        if (divisor === 0) {
            return -1;
        }
        var t = numerator.cross(line.getSlope()) / divisor;
        if (t >= 0) {
            var u = numerator.cross(this.dir) / divisor / line.getLength();
            if (u >= 0 && u <= 1) {
                return t;
            }
        }
        return -1;
    };
    /**
     * Returns the point of intersection given the intersection time
     */
    Ray.prototype.getPoint = function (time) {
        return this.pos.add(this.dir.scale(time));
    };
    return Ray;
}());
export { Ray };
/**
 * A 2D line segment
 */
var Line = /** @class */ (function () {
    /**
     * @param begin  The starting point of the line segment
     * @param end  The ending point of the line segment
     */
    function Line(begin, end) {
        this.begin = begin;
        this.end = end;
    }
    Object.defineProperty(Line.prototype, "slope", {
        /**
         * Gets the raw slope (m) of the line. Will return (+/-)Infinity for vertical lines.
         */
        get: function () {
            return (this.end.y - this.begin.y) / (this.end.x - this.begin.x);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "intercept", {
        /**
         * Gets the Y-intercept (b) of the line. Will return (+/-)Infinity if there is no intercept.
         */
        get: function () {
            return this.begin.y - this.slope * this.begin.x;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets the normal of the line
     */
    Line.prototype.normal = function () {
        return this.end.sub(this.begin).normal();
    };
    /**
     * Returns the slope of the line in the form of a vector
     */
    Line.prototype.getSlope = function () {
        var begin = this.begin;
        var end = this.end;
        var distance = begin.distance(end);
        return end.sub(begin).scale(1 / distance);
    };
    /**
     * Returns the length of the line segment in pixels
     */
    Line.prototype.getLength = function () {
        var begin = this.begin;
        var end = this.end;
        var distance = begin.distance(end);
        return distance;
    };
    /**
     * Find the perpendicular distance from the line to a point
     * https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
     * @param point
     */
    Line.prototype.distanceToPoint = function (point) {
        var x0 = point.x;
        var y0 = point.y;
        var l = this.getLength();
        var dy = this.end.y - this.begin.y;
        var dx = this.end.x - this.begin.x;
        var distance = Math.abs(dy * x0 - dx * y0 + this.end.x * this.begin.y - this.end.y * this.begin.x) / l;
        return distance;
    };
    /**
     * Finds a point on the line given only an X or a Y value. Given an X value, the function returns
     * a new point with the calculated Y value and vice-versa.
     *
     * @param x The known X value of the target point
     * @param y The known Y value of the target point
     * @returns A new point with the other calculated axis value
     */
    Line.prototype.findPoint = function (x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        var m = this.slope;
        var b = this.intercept;
        if (x !== null) {
            return new Vector(x, m * x + b);
        }
        else if (y !== null) {
            return new Vector((y - b) / m, y);
        }
        else {
            throw new Error('You must provide an X or a Y value');
        }
    };
    /**
     * @see http://stackoverflow.com/a/11908158/109458
     */
    Line.prototype.hasPoint = function () {
        var currPoint;
        var threshold = 0;
        if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
            currPoint = new Vector(arguments[0], arguments[1]);
            threshold = arguments[2] || 0;
        }
        else if (arguments[0] instanceof Vector) {
            currPoint = arguments[0];
            threshold = arguments[1] || 0;
        }
        else {
            throw 'Could not determine the arguments for Vector.hasPoint';
        }
        var dxc = currPoint.x - this.begin.x;
        var dyc = currPoint.y - this.begin.y;
        var dx1 = this.end.x - this.begin.x;
        var dy1 = this.end.y - this.begin.y;
        var cross = dxc * dy1 - dyc * dx1;
        // check whether point lines on the line
        if (Math.abs(cross) > threshold) {
            return false;
        }
        // check whether point lies in-between start and end
        if (Math.abs(dx1) >= Math.abs(dy1)) {
            return dx1 > 0 ? this.begin.x <= currPoint.x && currPoint.x <= this.end.x : this.end.x <= currPoint.x && currPoint.x <= this.begin.x;
        }
        else {
            return dy1 > 0 ? this.begin.y <= currPoint.y && currPoint.y <= this.end.y : this.end.y <= currPoint.y && currPoint.y <= this.begin.y;
        }
    };
    return Line;
}());
export { Line };
/**
 * A 1 dimensional projection on an axis, used to test overlaps
 */
var Projection = /** @class */ (function () {
    function Projection(min, max) {
        this.min = min;
        this.max = max;
    }
    Projection.prototype.overlaps = function (projection) {
        return this.max > projection.min && projection.max > this.min;
    };
    Projection.prototype.getOverlap = function (projection) {
        if (this.overlaps(projection)) {
            if (this.max > projection.max) {
                return projection.max - this.min;
            }
            else {
                return this.max - projection.min;
            }
        }
        return 0;
    };
    return Projection;
}());
export { Projection };
var GlobalCoordinates = /** @class */ (function () {
    function GlobalCoordinates(worldPos, pagePos, screenPos) {
        this.worldPos = worldPos;
        this.pagePos = pagePos;
        this.screenPos = screenPos;
    }
    GlobalCoordinates.fromPagePosition = function (xOrPos, yOrEngine, engineOrUndefined) {
        var pageX;
        var pageY;
        var pagePos;
        var engine;
        if (arguments.length === 3) {
            pageX = xOrPos;
            pageY = yOrEngine;
            pagePos = new Vector(pageX, pageY);
            engine = engineOrUndefined;
        }
        else {
            pagePos = xOrPos;
            pageX = pagePos.x;
            pageY = pagePos.y;
            engine = yOrEngine;
        }
        var screenX = pageX - Util.getPosition(engine.canvas).x;
        var screenY = pageY - Util.getPosition(engine.canvas).y;
        var screenPos = new Vector(screenX, screenY);
        var worldPos = engine.screenToWorldCoordinates(screenPos);
        return new GlobalCoordinates(worldPos, pagePos, screenPos);
    };
    return GlobalCoordinates;
}());
export { GlobalCoordinates };
//# sourceMappingURL=Algebra.js.map