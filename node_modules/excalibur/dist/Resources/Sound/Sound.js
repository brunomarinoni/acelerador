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
import { ExResponse } from '../../Interfaces/AudioImplementation';
import { Resource } from '../Resource';
import { AudioInstanceFactory } from './AudioInstance';
import { AudioContextFactory } from './AudioContext';
import { NativeSoundEvent } from '../../Events/MediaEvents';
import { Promise } from '../../Promises';
import { canPlayFile } from '../../Util/Sound';
/**
 * The [[Sound]] object allows games built in Excalibur to load audio
 * components, from soundtracks to sound effects. [[Sound]] is an [[ILoadable]]
 * which means it can be passed to a [[Loader]] to pre-load before a game or level.
 *
 * [[include:Sounds.md]]
 */
var Sound = /** @class */ (function (_super) {
    __extends(Sound, _super);
    /**
     * @param paths A list of audio sources (clip.wav, clip.mp3, clip.ogg) for this audio clip. This is done for browser compatibility.
     */
    function Sound() {
        var paths = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            paths[_i] = arguments[_i];
        }
        var _this = _super.call(this, '', '') || this;
        _this._loop = false;
        _this._volume = 1;
        _this._isPaused = false;
        _this._tracks = [];
        _this._wasPlayingOnHidden = false;
        _this._processedData = new Promise();
        _this._audioContext = AudioContextFactory.create();
        _this._detectResponseType();
        /* Chrome : MP3, WAV, Ogg
             * Firefox : WAV, Ogg,
             * IE : MP3, WAV coming soon
             * Safari MP3, WAV, Ogg
             */
        for (var _a = 0, paths_1 = paths; _a < paths_1.length; _a++) {
            var path = paths_1[_a];
            if (canPlayFile(path)) {
                _this.path = path;
                break;
            }
        }
        if (!_this.path) {
            _this.logger.warn('This browser does not support any of the audio files specified:', paths.join(', '));
            _this.logger.warn('Attempting to use', paths[0]);
            _this.path = paths[0]; // select the first specified
        }
        return _this;
    }
    Object.defineProperty(Sound.prototype, "loop", {
        get: function () {
            return this._loop;
        },
        /**
         * Indicates whether the clip should loop when complete
         * @param value  Set the looping flag
         */
        set: function (value) {
            this._loop = value;
            for (var _i = 0, _a = this._tracks; _i < _a.length; _i++) {
                var track = _a[_i];
                track.loop = this._loop;
            }
            this.logger.debug('Set loop for all instances of sound', this.path, 'to', this._loop);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "volume", {
        get: function () {
            return this._volume;
        },
        set: function (value) {
            this._volume = value;
            for (var _i = 0, _a = this._tracks; _i < _a.length; _i++) {
                var track = _a[_i];
                track.volume = this._volume;
            }
            this.emit('volumechange', new NativeSoundEvent(this));
            this.logger.debug('Set loop for all instances of sound', this.path, 'to', this._volume);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "instances", {
        /**
         * Return array of Current AudioInstances playing or being paused
         */
        get: function () {
            return this._tracks;
        },
        enumerable: true,
        configurable: true
    });
    Sound.prototype.wireEngine = function (engine) {
        var _this = this;
        if (engine) {
            this._engine = engine;
            this._engine.on('hidden', function () {
                if (engine.pauseAudioWhenHidden && _this.isPlaying()) {
                    _this._wasPlayingOnHidden = true;
                    _this.pause();
                }
            });
            this._engine.on('visible', function () {
                if (engine.pauseAudioWhenHidden && _this._wasPlayingOnHidden) {
                    _this.play();
                    _this._wasPlayingOnHidden = false;
                }
            });
        }
    };
    /**
     * Returns how many instances of the sound are currently playing
     */
    Sound.prototype.instanceCount = function () {
        return this._tracks.length;
    };
    /**
     * Whether or not the sound is playing right now
     */
    Sound.prototype.isPlaying = function () {
        return this._tracks.some(function (t) { return t.isPlaying(); });
    };
    /**
     * Play the sound, returns a promise that resolves when the sound is done playing
     * An optional volume argument can be passed in to play the sound. Max volume is 1.0
     */
    Sound.prototype.play = function (volume) {
        if (!this.isLoaded()) {
            this.logger.warn('Cannot start playing. Resource', this.path, 'is not loaded yet');
            return Promise.resolve(true);
        }
        this.volume = volume || this.volume;
        if (this._isPaused) {
            return this._resumePlayback();
        }
        else {
            return this._startPlayback();
        }
    };
    /**
     * Stop the sound, and do not rewind
     */
    Sound.prototype.pause = function () {
        if (!this.isPlaying()) {
            return;
        }
        for (var _i = 0, _a = this._tracks; _i < _a.length; _i++) {
            var track = _a[_i];
            track.pause();
        }
        this._isPaused = true;
        this.emit('pause', new NativeSoundEvent(this));
        this.logger.debug('Paused all instances of sound', this.path);
    };
    /**
     * Stop the sound and rewind
     */
    Sound.prototype.stop = function () {
        if (!this.isPlaying()) {
            return;
        }
        for (var _i = 0, _a = this._tracks; _i < _a.length; _i++) {
            var track = _a[_i];
            track.stop();
        }
        this.emit('stop', new NativeSoundEvent(this));
        this._isPaused = false;
        this._tracks.length = 0;
        this.logger.debug('Stopped all instances of sound', this.path);
    };
    Sound.prototype.setData = function (data) {
        this.emit('emptied', new NativeSoundEvent(this));
        this.data = data;
        this._processedData = new Promise();
    };
    Sound.prototype.processData = function (data) {
        var _this = this;
        /**
         * Processes raw arraybuffer data and decodes into WebAudio buffer (async).
         */
        var processPromise = data instanceof ArrayBuffer ? this._processArrayBufferData(data) : this._processBlobData(data);
        return processPromise.then(function (processedData) { return _this._setProcessedData(processedData); });
    };
    /**
     * Get Id of provided AudioInstance in current trackList
     * @param track [[AudioInstance]] which Id is to be given
     */
    Sound.prototype.getTrackId = function (track) {
        return this._tracks.indexOf(track);
    };
    Sound.prototype._resumePlayback = function () {
        if (this._isPaused) {
            var resumed = [];
            // ensure we resume *current* tracks (if paused)
            for (var _i = 0, _a = this._tracks; _i < _a.length; _i++) {
                var track = _a[_i];
                resumed.push(track.play());
            }
            this._isPaused = false;
            this.emit('resume', new NativeSoundEvent(this));
            this.logger.debug('Resuming paused instances for sound', this.path, this._tracks);
            // resolve when resumed tracks are done
            return Promise.join(resumed);
        }
        else {
            return Promise.resolve(true);
        }
    };
    Sound.prototype._startPlayback = function () {
        var _this = this;
        var newTrack = this._createNewTrack();
        var playPromise = new Promise();
        newTrack.then(function (track) {
            track.play().then(function (resolved) {
                // when done, remove track
                _this.emit('playbackend', new NativeSoundEvent(_this, track));
                _this._tracks.splice(_this.getTrackId(track), 1);
                playPromise.resolve(resolved);
                return resolved;
            });
            _this.emit('playbackstart', new NativeSoundEvent(_this, track));
            _this.logger.debug('Playing new instance for sound', _this.path);
        });
        return playPromise;
    };
    Sound.prototype._processArrayBufferData = function (data) {
        var _this = this;
        var complete = new Promise();
        this._audioContext.decodeAudioData(data, function (buffer) {
            complete.resolve(buffer);
        }, function () {
            _this.logger.error('Unable to decode ' +
                ' this browser may not fully support this format, or the file may be corrupt, ' +
                'if this is an mp3 try removing id3 tags and album art from the file.');
            complete.resolve(undefined);
        });
        return complete;
    };
    Sound.prototype._processBlobData = function (data) {
        return new Promise().resolve(_super.prototype.processData.call(this, data));
    };
    Sound.prototype._setProcessedData = function (processedData) {
        this._processedData.resolve(processedData);
    };
    Sound.prototype._createNewTrack = function () {
        var _this = this;
        var aiPromise = new Promise();
        if (this._processedData.state() !== 0) {
            this.processData(this.data);
        }
        this._processedData.then(function (processedData) {
            aiPromise.resolve(_this._getTrackInstance(processedData));
            return processedData;
        }, function (error) {
            _this.logger.error(error, 'Cannot create AudioInstance due to wrong processed data.');
        });
        return aiPromise;
    };
    Sound.prototype._getTrackInstance = function (data) {
        var newTrack = AudioInstanceFactory.create(data);
        newTrack.loop = this.loop;
        newTrack.volume = this.volume;
        this._tracks.push(newTrack);
        return newTrack;
    };
    Sound.prototype._detectResponseType = function () {
        if (window.AudioContext) {
            this.responseType = ExResponse.type.arraybuffer;
        }
        else {
            this.responseType = ExResponse.type.blob;
        }
    };
    return Sound;
}(Resource));
export { Sound };
//# sourceMappingURL=Sound.js.map