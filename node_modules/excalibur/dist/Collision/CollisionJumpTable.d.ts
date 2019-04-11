import { CircleArea } from './CircleArea';
import { CollisionContact } from './CollisionContact';
import { PolygonArea } from './PolygonArea';
import { EdgeArea } from './EdgeArea';
export declare var CollisionJumpTable: {
    CollideCircleCircle(circleA: CircleArea, circleB: CircleArea): CollisionContact;
    CollideCirclePolygon(circle: CircleArea, polygon: PolygonArea): CollisionContact;
    CollideCircleEdge(circle: CircleArea, edge: EdgeArea): CollisionContact;
    CollideEdgeEdge(): CollisionContact;
    CollidePolygonEdge(polygon: PolygonArea, edge: EdgeArea): CollisionContact;
    CollidePolygonPolygon(polyA: PolygonArea, polyB: PolygonArea): CollisionContact;
};
