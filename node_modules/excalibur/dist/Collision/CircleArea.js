import { BoundingBox } from './BoundingBox';
import { PolygonArea } from './PolygonArea';
import { EdgeArea } from './EdgeArea';
import { CollisionJumpTable } from './CollisionJumpTable';
import { Vector, Projection } from '../Algebra';
import { Physics } from '../Physics';
import { Color } from '../Drawing/Color';
/**
 * This is a circle collision area for the excalibur rigid body physics simulation
 */
var CircleArea = /** @class */ (function () {
    function CircleArea(options) {
        /**
         * This is the center position of the circle, relative to the body position
         */
        this.pos = Vector.Zero;
        this.pos = options.pos || Vector.Zero;
        this.radius = options.radius || 0;
        this.body = options.body || null;
    }
    /**
     * Get the center of the collision area in world coordinates
     */
    CircleArea.prototype.getCenter = function () {
        if (this.body) {
            return this.pos.add(this.body.pos);
        }
        return this.pos;
    };
    /**
     * Tests if a point is contained in this collision area
     */
    CircleArea.prototype.contains = function (point) {
        var distance = this.body.pos.distance(point);
        if (distance <= this.radius) {
            return true;
        }
        return false;
    };
    /**
     * Casts a ray at the CircleArea and returns the nearest point of collision
     * @param ray
     */
    CircleArea.prototype.rayCast = function (ray, max) {
        if (max === void 0) { max = Infinity; }
        //https://en.wikipedia.org/wiki/Line%E2%80%93sphere_intersection
        var c = this.getCenter();
        var dir = ray.dir;
        var orig = ray.pos;
        var discriminant = Math.sqrt(Math.pow(dir.dot(orig.sub(c)), 2) - Math.pow(orig.sub(c).distance(), 2) + Math.pow(this.radius, 2));
        if (discriminant < 0) {
            // no intersection
            return null;
        }
        else {
            var toi = 0;
            if (discriminant === 0) {
                toi = -dir.dot(orig.sub(c));
                if (toi > 0 && toi < max) {
                    return ray.getPoint(toi);
                }
                return null;
            }
            else {
                var toi1 = -dir.dot(orig.sub(c)) + discriminant;
                var toi2 = -dir.dot(orig.sub(c)) - discriminant;
                var mintoi = Math.min(toi1, toi2);
                if (mintoi <= max) {
                    return ray.getPoint(mintoi);
                }
                return null;
            }
        }
    };
    /**
     * @inheritdoc
     */
    CircleArea.prototype.collide = function (area) {
        if (area instanceof CircleArea) {
            return CollisionJumpTable.CollideCircleCircle(this, area);
        }
        else if (area instanceof PolygonArea) {
            return CollisionJumpTable.CollideCirclePolygon(this, area);
        }
        else if (area instanceof EdgeArea) {
            return CollisionJumpTable.CollideCircleEdge(this, area);
        }
        else {
            throw new Error("Circle could not collide with unknown ICollisionArea " + typeof area);
        }
    };
    /**
     * Find the point on the shape furthest in the direction specified
     */
    CircleArea.prototype.getFurthestPoint = function (direction) {
        return this.getCenter().add(direction.normalize().scale(this.radius));
    };
    /**
     * Get the axis aligned bounding box for the circle area
     */
    CircleArea.prototype.getBounds = function () {
        return new BoundingBox(this.pos.x + this.body.pos.x - this.radius, this.pos.y + this.body.pos.y - this.radius, this.pos.x + this.body.pos.x + this.radius, this.pos.y + this.body.pos.y + this.radius);
    };
    /**
     * Get axis not implemented on circles, since there are infinite axis in a circle
     */
    CircleArea.prototype.getAxes = function () {
        return null;
    };
    /**
     * Returns the moment of inertia of a circle given it's mass
     * https://en.wikipedia.org/wiki/List_of_moments_of_inertia
     */
    CircleArea.prototype.getMomentOfInertia = function () {
        var mass = this.body ? this.body.mass : Physics.defaultMass;
        return (mass * this.radius * this.radius) / 2;
    };
    /**
     * Tests the separating axis theorem for circles against polygons
     */
    CircleArea.prototype.testSeparatingAxisTheorem = function (polygon) {
        var axes = polygon.getAxes();
        var pc = polygon.getCenter();
        // Special SAT with circles
        var closestPointOnPoly = polygon.getFurthestPoint(this.pos.sub(pc));
        axes.push(this.pos.sub(closestPointOnPoly).normalize());
        var minOverlap = Number.MAX_VALUE;
        var minAxis = null;
        var minIndex = -1;
        for (var i = 0; i < axes.length; i++) {
            var proj1 = polygon.project(axes[i]);
            var proj2 = this.project(axes[i]);
            var overlap = proj1.getOverlap(proj2);
            if (overlap <= 0) {
                return null;
            }
            else {
                if (overlap < minOverlap) {
                    minOverlap = overlap;
                    minAxis = axes[i];
                    minIndex = i;
                }
            }
        }
        if (minIndex < 0) {
            return null;
        }
        return minAxis.normalize().scale(minOverlap);
    };
    /* istanbul ignore next */
    CircleArea.prototype.recalc = function () {
        // circles don't cache
    };
    /**
     * Project the circle along a specified axis
     */
    CircleArea.prototype.project = function (axis) {
        var scalars = [];
        var point = this.getCenter();
        var dotProduct = point.dot(axis);
        scalars.push(dotProduct);
        scalars.push(dotProduct + this.radius);
        scalars.push(dotProduct - this.radius);
        return new Projection(Math.min.apply(Math, scalars), Math.max.apply(Math, scalars));
    };
    /* istanbul ignore next */
    CircleArea.prototype.debugDraw = function (ctx, color) {
        if (color === void 0) { color = Color.Green; }
        var pos = this.body ? this.body.pos.add(this.pos) : this.pos;
        var rotation = this.body ? this.body.rotation : 0;
        ctx.beginPath();
        ctx.strokeStyle = color.toString();
        ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(Math.cos(rotation) * this.radius + pos.x, Math.sin(rotation) * this.radius + pos.y);
        ctx.closePath();
        ctx.stroke();
    };
    return CircleArea;
}());
export { CircleArea };
//# sourceMappingURL=CircleArea.js.map