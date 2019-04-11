import { CollisionType } from '../Actor';
import { Side } from '../Collision/Side';
import { PreCollisionEvent, PostCollisionEvent } from '../Events';
var TileMapCollisionDetection = /** @class */ (function () {
    function TileMapCollisionDetection() {
    }
    TileMapCollisionDetection.prototype.update = function (actor, engine) {
        var eventDispatcher = actor.eventDispatcher;
        if (actor.collisionType !== CollisionType.PreventCollision && engine.currentScene && engine.currentScene.tileMaps) {
            for (var j = 0; j < engine.currentScene.tileMaps.length; j++) {
                var map = engine.currentScene.tileMaps[j];
                var intersectMap;
                var side = Side.None;
                var max = 2;
                while ((intersectMap = map.collides(actor))) {
                    if (max-- < 0) {
                        break;
                    }
                    side = actor.getSideFromIntersect(intersectMap);
                    eventDispatcher.emit('precollision', new PreCollisionEvent(actor, null, side, intersectMap));
                    if (actor.collisionType === CollisionType.Active) {
                        actor.pos.y += intersectMap.y;
                        actor.pos.x += intersectMap.x;
                        eventDispatcher.emit('postcollision', new PostCollisionEvent(actor, null, side, intersectMap));
                    }
                }
            }
        }
    };
    return TileMapCollisionDetection;
}());
export { TileMapCollisionDetection };
//# sourceMappingURL=TileMapCollisionDetection.js.map