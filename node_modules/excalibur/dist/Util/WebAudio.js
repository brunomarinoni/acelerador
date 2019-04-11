import { AudioContextFactory } from '../Resources/Sound/AudioContext';
import { Promise, PromiseState } from '../Promises';
import { Logger } from './Log';
function isLegacyWebAudioSource(source) {
    return !!source.playbackState;
}
var WebAudio = /** @class */ (function () {
    function WebAudio() {
    }
    /**
     * Play an empty sound to unlock Safari WebAudio context. Call this function
     * right after a user interaction event.
     * @source https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     */
    WebAudio.unlock = function () {
        var promise = new Promise();
        if (WebAudio._unlocked || !AudioContextFactory.create()) {
            return promise.resolve(true);
        }
        var unlockTimeoutTimer = setTimeout(function () {
            Logger.getInstance().warn('Excalibur was unable to unlock the audio context, audio probably will not play in this browser.');
            promise.resolve();
        }, 200);
        var audioContext = AudioContextFactory.create();
        audioContext.resume().then(function () {
            // create empty buffer and play it
            var buffer = audioContext.createBuffer(1, 1, 22050);
            var source = audioContext.createBufferSource();
            var ended = false;
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.onended = function () { return (ended = true); };
            if (source.noteOn) {
                // deprecated
                source.noteOn(0);
            }
            else {
                source.start(0);
            }
            // by checking the play state after some time, we know if we're really unlocked
            setTimeout(function () {
                if (isLegacyWebAudioSource(source)) {
                    if (source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE) {
                        WebAudio._unlocked = true;
                    }
                }
                else {
                    if (audioContext.currentTime > 0 || ended) {
                        WebAudio._unlocked = true;
                    }
                }
            }, 0);
            clearTimeout(unlockTimeoutTimer);
            if (promise.state() === PromiseState.Pending) {
                promise.resolve();
            }
        }, function () {
            if (promise.state() === PromiseState.Pending) {
                promise.reject(false);
            }
        });
        return promise;
    };
    WebAudio.isUnlocked = function () {
        return this._unlocked;
    };
    WebAudio._unlocked = false;
    return WebAudio;
}());
export { WebAudio };
//# sourceMappingURL=WebAudio.js.map