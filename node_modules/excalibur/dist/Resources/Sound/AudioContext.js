/**
 * Internal class used to build instances of AudioContext
 */
/* istanbul ignore next */
var AudioContextFactory = /** @class */ (function () {
    function AudioContextFactory() {
    }
    AudioContextFactory.create = function () {
        if (!this._INSTANCE) {
            if (window.AudioContext || window.webkitAudioContext) {
                this._INSTANCE = new window.AudioContext();
            }
        }
        return this._INSTANCE;
    };
    AudioContextFactory._INSTANCE = null;
    return AudioContextFactory;
}());
export { AudioContextFactory };
//# sourceMappingURL=AudioContext.js.map