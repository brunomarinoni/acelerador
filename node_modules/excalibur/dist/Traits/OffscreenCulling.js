import { CullingBox } from './../Util/CullingBox';
import { ExitViewPortEvent, EnterViewPortEvent } from '../Events';
var OffscreenCulling = /** @class */ (function () {
    function OffscreenCulling() {
        this.cullingBox = new CullingBox();
    }
    OffscreenCulling.prototype.update = function (actor, engine) {
        var events = actor.eventDispatcher;
        var isSpriteOffScreen = true;
        if (actor.currentDrawing != null) {
            isSpriteOffScreen = this.cullingBox.isSpriteOffScreen(actor, engine);
        }
        var actorBoundsOffscreen = false;
        if (engine && engine.currentScene && engine.currentScene.camera && engine.currentScene.camera.viewport) {
            actorBoundsOffscreen = !engine.currentScene.camera.viewport.collides(actor.getBounds(true));
        }
        if (!actor.isOffScreen) {
            if (actorBoundsOffscreen && isSpriteOffScreen) {
                events.emit('exitviewport', new ExitViewPortEvent(actor));
                actor.isOffScreen = true;
            }
        }
        else {
            if (!actorBoundsOffscreen || !isSpriteOffScreen) {
                events.emit('enterviewport', new EnterViewPortEvent(actor));
                actor.isOffScreen = false;
            }
        }
    };
    return OffscreenCulling;
}());
export { OffscreenCulling };
//# sourceMappingURL=OffscreenCulling.js.map