/**
 * Revises pointer events path accordingly to the actor
 */
var CapturePointer = /** @class */ (function () {
    function CapturePointer() {
    }
    CapturePointer.prototype.update = function (actor, engine) {
        if (!actor.enableCapturePointer) {
            return;
        }
        if (actor.isKilled()) {
            return;
        }
        engine.input.pointers.revisePointerEventsPaths(actor);
    };
    return CapturePointer;
}());
export { CapturePointer };
//# sourceMappingURL=CapturePointer.js.map