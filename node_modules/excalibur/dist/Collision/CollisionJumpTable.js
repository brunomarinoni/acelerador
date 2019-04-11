import { CollisionContact } from './CollisionContact';
import { PolygonArea } from './PolygonArea';
export var CollisionJumpTable = {
    CollideCircleCircle: function (circleA, circleB) {
        var radius = circleA.radius + circleB.radius;
        var circleAPos = circleA.body.pos.add(circleA.pos);
        var circleBPos = circleB.body.pos.add(circleB.pos);
        if (circleAPos.distance(circleBPos) > radius) {
            return null;
        }
        var axisOfCollision = circleBPos.sub(circleAPos).normalize();
        var mvt = axisOfCollision.scale(radius - circleBPos.distance(circleAPos));
        var pointOfCollision = circleA.getFurthestPoint(axisOfCollision);
        return new CollisionContact(circleA, circleB, mvt, pointOfCollision, axisOfCollision);
    },
    CollideCirclePolygon: function (circle, polygon) {
        var minAxis = circle.testSeparatingAxisTheorem(polygon);
        if (!minAxis) {
            return null;
        }
        // make sure that the minAxis is pointing away from circle
        var samedir = minAxis.dot(polygon.getCenter().sub(circle.getCenter()));
        minAxis = samedir < 0 ? minAxis.negate() : minAxis;
        var verts = [];
        var point1 = polygon.getFurthestPoint(minAxis.negate());
        var point2 = circle.getFurthestPoint(minAxis); //.add(cc);
        if (circle.contains(point1)) {
            verts.push(point1);
        }
        if (polygon.contains(point2)) {
            verts.push(point2);
        }
        if (verts.length === 0) {
            return null;
        }
        return new CollisionContact(circle, polygon, minAxis, verts.length === 2 ? verts[0].average(verts[1]) : verts[0], minAxis.normalize());
    },
    CollideCircleEdge: function (circle, edge) {
        // center of the circle
        var cc = circle.getCenter();
        // vector in the direction of the edge
        var e = edge.end.sub(edge.begin);
        // amount of overlap with the circle's center along the edge direction
        var u = e.dot(edge.end.sub(cc));
        var v = e.dot(cc.sub(edge.begin));
        // Potential region A collision (circle is on the left side of the edge, before the beginning)
        if (v <= 0) {
            var da = edge.begin.sub(cc);
            var dda = da.dot(da); // quick and dirty way of calc'n distance in r^2 terms saves some sqrts
            // save some sqrts
            if (dda > circle.radius * circle.radius) {
                return null; // no collision
            }
            return new CollisionContact(circle, edge, da.normalize().scale(circle.radius - Math.sqrt(dda)), edge.begin, da.normalize());
        }
        // Potential region B collision (circle is on the right side of the edge, after the end)
        if (u <= 0) {
            var db = edge.end.sub(cc);
            var ddb = db.dot(db);
            if (ddb > circle.radius * circle.radius) {
                return null;
            }
            return new CollisionContact(circle, edge, db.normalize().scale(circle.radius - Math.sqrt(ddb)), edge.end, db.normalize());
        }
        // Otherwise potential region AB collision (circle is in the middle of the edge between the beginning and end)
        var den = e.dot(e);
        var pointOnEdge = edge.begin
            .scale(u)
            .add(edge.end.scale(v))
            .scale(1 / den);
        var d = cc.sub(pointOnEdge);
        var dd = d.dot(d);
        if (dd > circle.radius * circle.radius) {
            return null; // no collision
        }
        var n = e.perpendicular();
        // flip correct direction
        if (n.dot(cc.sub(edge.begin)) < 0) {
            n.x = -n.x;
            n.y = -n.y;
        }
        n = n.normalize();
        var mvt = n.scale(Math.abs(circle.radius - Math.sqrt(dd)));
        return new CollisionContact(circle, edge, mvt.negate(), pointOnEdge, n.negate());
    },
    CollideEdgeEdge: function () {
        // Edge-edge collision doesn't make sense
        return null;
    },
    CollidePolygonEdge: function (polygon, edge) {
        // 3 cases:
        // (1) Polygon lands on the full face
        // (2) Polygon lands on the right point
        // (3) Polygon lands on the left point
        var e = edge.end.sub(edge.begin);
        var edgeNormal = e.normal();
        if (polygon.contains(edge.begin)) {
            var _a = polygon.getClosestFace(edge.begin), mtv = _a.distance, face = _a.face;
            if (mtv) {
                return new CollisionContact(polygon, edge, mtv.negate(), edge.begin.add(mtv.negate()), face.normal().negate());
            }
        }
        if (polygon.contains(edge.end)) {
            var _b = polygon.getClosestFace(edge.end), mtv = _b.distance, face = _b.face;
            if (mtv) {
                return new CollisionContact(polygon, edge, mtv.negate(), edge.end.add(mtv.negate()), face.normal().negate());
            }
        }
        var pc = polygon.getCenter();
        var ec = edge.getCenter();
        var dir = ec.sub(pc).normalize();
        // build a temporary polygon from the edge to use SAT
        var linePoly = new PolygonArea({
            points: [edge.begin, edge.end, edge.end.add(dir.scale(30)), edge.begin.add(dir.scale(30))]
        });
        var minAxis = polygon.testSeparatingAxisTheorem(linePoly);
        // no minAxis, no overlap, no collision
        if (!minAxis) {
            return null;
        }
        // flip the normal and axis to always have positive collisions
        edgeNormal = edgeNormal.dot(dir) < 0 ? edgeNormal.negate() : edgeNormal;
        minAxis = minAxis.dot(dir) < 0 ? minAxis.negate() : minAxis;
        return new CollisionContact(polygon, edge, minAxis, polygon.getFurthestPoint(edgeNormal), edgeNormal);
    },
    CollidePolygonPolygon: function (polyA, polyB) {
        // do a SAT test to find a min axis if it exists
        var minAxis = polyA.testSeparatingAxisTheorem(polyB);
        // no overlap, no collision return null
        if (!minAxis) {
            return null;
        }
        // make sure that minAxis is pointing from A -> B
        var sameDir = minAxis.dot(polyB.getCenter().sub(polyA.getCenter()));
        minAxis = sameDir < 0 ? minAxis.negate() : minAxis;
        // find rough point of collision
        // todo this could be better
        var verts = [];
        var pointA = polyA.getFurthestPoint(minAxis);
        var pointB = polyB.getFurthestPoint(minAxis.negate());
        if (polyB.contains(pointA)) {
            verts.push(pointA);
        }
        if (polyA.contains(pointB)) {
            verts.push(pointB);
        }
        // no candidates, pick something
        if (verts.length === 0) {
            verts.push(pointB);
        }
        var contact = verts.length === 2 ? verts[0].add(verts[1]).scale(0.5) : verts[0];
        return new CollisionContact(polyA, polyB, minAxis, contact, minAxis.normalize());
    }
};
//# sourceMappingURL=CollisionJumpTable.js.map