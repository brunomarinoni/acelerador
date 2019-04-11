var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Promise } from '../../Promises';
import * as Util from '../../Util/Util';
import { AudioContextFactory } from './AudioContext';
/**
 * Internal class for producing of AudioInstances
 */
/* istanbul ignore next */
var AudioInstanceFactory = /** @class */ (function () {
    function AudioInstanceFactory() {
    }
    AudioInstanceFactory.create = function (src) {
        if (typeof src === 'string') {
            return new AudioTagInstance(src);
        }
        if (src instanceof AudioBuffer) {
            return new WebAudioInstance(src);
        }
        return new AudioInstance(src);
    };
    return AudioInstanceFactory;
}());
export { AudioInstanceFactory };
/**
 * Internal class representing base AudioInstance implementation
 */
/* istanbul ignore next */
var AudioInstance = /** @class */ (function () {
    function AudioInstance(_src) {
        this._src = _src;
        this._volume = 1;
        this._loop = false;
        this._isPlaying = false;
        this._isPaused = false;
    }
    Object.defineProperty(AudioInstance.prototype, "loop", {
        get: function () {
            return this._loop;
        },
        set: function (value) {
            this._loop = value;
            if (this._instance) {
                this._instance.loop = value;
                this._wireUpOnEnded();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AudioInstance.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = Util.clamp(value, 0, 1.0);
        },
        enumerable: true,
        configurable: true
    });
    AudioInstance.prototype.isPlaying = function () {
        return this._isPlaying;
    };
    AudioInstance.prototype.pause = function () {
        if (!this._isPlaying) {
            return;
        }
        this._isPaused = true;
        this._isPlaying = false;
    };
    AudioInstance.prototype.stop = function () {
        if (!this._isPlaying) {
            return;
        }
        this._isPlaying = false;
        this._isPaused = false;
    };
    AudioInstance.prototype.play = function () {
        if (this._isPaused) {
            this._resumePlayBack();
        }
        if (!this._isPlaying) {
            this._startPlayBack();
        }
        return this._playingPromise;
    };
    AudioInstance.prototype._startPlayBack = function () {
        this._isPlaying = true;
        this._isPaused = false;
        this._playingPromise = new Promise();
    };
    AudioInstance.prototype._resumePlayBack = function () {
        if (!this._isPaused) {
            return;
        }
        this._isPaused = false;
        this._isPlaying = true;
    };
    AudioInstance.prototype._wireUpOnEnded = function () {
        var _this = this;
        if (!this.loop) {
            this._instance.onended = function () { return _this._handleOnEnded(); };
        }
    };
    AudioInstance.prototype._handleOnEnded = function () {
        /**
         * Override me
         */
    };
    return AudioInstance;
}());
export { AudioInstance };
/**
 * Internal class representing a HTML5 audio instance
 */
/* istanbul ignore next */
var AudioTagInstance = /** @class */ (function (_super) {
    __extends(AudioTagInstance, _super);
    function AudioTagInstance(src) {
        var _this = _super.call(this, src) || this;
        _this._instance = new Audio(src);
        return _this;
    }
    Object.defineProperty(AudioTagInstance.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            value = Util.clamp(value, 0, 1.0);
            this._volume = value;
            this._instance.volume = value;
        },
        enumerable: true,
        configurable: true
    });
    AudioTagInstance.prototype.pause = function () {
        if (!this._isPlaying) {
            return;
        }
        this._instance.pause();
        this._isPaused = true;
        this._isPlaying = false;
    };
    AudioTagInstance.prototype.stop = function () {
        _super.prototype.stop.call(this);
        this._instance.pause();
        this._instance.currentTime = 0;
        this._handleOnEnded();
    };
    AudioTagInstance.prototype._startPlayBack = function () {
        _super.prototype._startPlayBack.call(this);
        this._instance.load();
        this._instance.loop = this.loop;
        this._instance.play();
        this._wireUpOnEnded();
    };
    AudioTagInstance.prototype._resumePlayBack = function () {
        _super.prototype._resumePlayBack.call(this);
        this._instance.play();
        this._wireUpOnEnded();
    };
    AudioTagInstance.prototype._handleOnEnded = function () {
        this._isPlaying = false;
        this._isPaused = false;
        this._playingPromise.resolve(true);
    };
    return AudioTagInstance;
}(AudioInstance));
export { AudioTagInstance };
/**
 * Internal class representing a Web Audio AudioBufferSourceNode instance
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
 */
/* istanbul ignore next */
var WebAudioInstance = /** @class */ (function (_super) {
    __extends(WebAudioInstance, _super);
    function WebAudioInstance(_src) {
        var _this = _super.call(this, _src) || this;
        _this._audioContext = AudioContextFactory.create();
        _this._volumeNode = _this._audioContext.createGain();
        /**
         * Current playback offset (in seconds)
         */
        _this._currentOffset = 0;
        _this._createNewBufferSource();
        return _this;
    }
    Object.defineProperty(WebAudioInstance.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            value = Util.clamp(value, 0, 1.0);
            this._volume = value;
            if (this._volumeNode.gain.setTargetAtTime) {
                // https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime
                // After each .1 seconds timestep, the target value will ~63.2% closer to the target value.
                // This exponential ramp provides a more pleasant trasition in gain
                this._volumeNode.gain.setTargetAtTime(value, this._audioContext.currentTime, 0.1);
            }
            else {
                this._volumeNode.gain.value = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebAudioInstance.prototype, "_playbackRate", {
        get: function () {
            return this._instance ? 1 / (this._instance.playbackRate.value || 1.0) : null;
        },
        enumerable: true,
        configurable: true
    });
    WebAudioInstance.prototype.pause = function () {
        _super.prototype.pause.call(this);
        this._instance.stop(0);
        // Playback rate will be a scale factor of how fast/slow the audio is being played
        // default is 1.0
        // we need to invert it to get the time scale
        this._setPauseOffset();
    };
    WebAudioInstance.prototype.stop = function () {
        _super.prototype.stop.call(this);
        this._currentOffset = 0;
        this._instance.stop(0);
        // handler will not be wired up if we were looping
        if (!this._instance.onended) {
            this._handleOnEnded();
        }
    };
    WebAudioInstance.prototype._startPlayBack = function () {
        _super.prototype._startPlayBack.call(this);
        if (!this._instance) {
            this._createNewBufferSource();
        }
        this._rememberStartTime();
        this._volumeNode.connect(this._audioContext.destination);
        this._instance.start(0, 0);
        this._currentOffset = 0;
        this._playingPromise = new Promise();
        this._wireUpOnEnded();
    };
    WebAudioInstance.prototype._resumePlayBack = function () {
        _super.prototype._resumePlayBack.call(this);
        // a buffer source can only be started once
        // so we need to dispose of the previous instance before
        // "resuming" the next one
        this._instance.onended = null; // dispose of any previous event handler
        this._createNewBufferSource();
        var duration = this._playbackRate * this._src.duration;
        var restartTime = this._currentOffset % duration;
        this._rememberStartTime(restartTime * -1000);
        this._instance.start(0, restartTime);
        this._wireUpOnEnded();
    };
    WebAudioInstance.prototype._handleOnEnded = function () {
        // pausing calls stop(0) which triggers onended event
        // so we don't "resolve" yet (when we resume we'll try again)
        if (!this._isPaused) {
            this._isPlaying = false;
            this._playingPromise.resolve(true);
        }
    };
    WebAudioInstance.prototype._rememberStartTime = function (amend) {
        this._startTime = new Date().getTime() + (amend | 0);
    };
    WebAudioInstance.prototype._setPauseOffset = function () {
        this._currentOffset = ((new Date().getTime() - this._startTime) * this._playbackRate) / 1000; // in seconds
    };
    WebAudioInstance.prototype._createNewBufferSource = function () {
        this._instance = this._audioContext.createBufferSource();
        this._instance.buffer = this._src;
        this._instance.loop = this.loop;
        this._instance.playbackRate.setValueAtTime(1.0, 0);
        this._instance.connect(this._volumeNode);
    };
    return WebAudioInstance;
}(AudioInstance));
export { WebAudioInstance };
//# sourceMappingURL=AudioInstance.js.map