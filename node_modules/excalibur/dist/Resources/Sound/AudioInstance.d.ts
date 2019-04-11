import { Audio } from '../../Interfaces/Audio';
import { Promise } from '../../Promises';
/**
 * Internal class for producing of AudioInstances
 */
export declare class AudioInstanceFactory {
    static create(src: string | AudioBuffer): AudioInstance;
}
/**
 * Internal class representing base AudioInstance implementation
 */
export declare class AudioInstance implements Audio {
    protected _src: string | AudioBuffer;
    loop: boolean;
    volume: number;
    protected _volume: number;
    protected _loop: boolean;
    protected _playingPromise: Promise<boolean>;
    protected _isPlaying: boolean;
    protected _isPaused: boolean;
    protected _instance: HTMLAudioElement | AudioBufferSourceNode;
    constructor(_src: string | AudioBuffer);
    isPlaying(): boolean;
    pause(): void;
    stop(): void;
    play(): Promise<boolean>;
    protected _startPlayBack(): void;
    protected _resumePlayBack(): void;
    protected _wireUpOnEnded(): void;
    protected _handleOnEnded(): void;
}
/**
 * Internal class representing a HTML5 audio instance
 */
export declare class AudioTagInstance extends AudioInstance {
    volume: number;
    protected _src: string;
    protected _instance: HTMLAudioElement;
    constructor(src: string);
    pause(): void;
    stop(): void;
    protected _startPlayBack(): void;
    protected _resumePlayBack(): void;
    protected _handleOnEnded(): void;
}
/**
 * Internal class representing a Web Audio AudioBufferSourceNode instance
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
 */
export declare class WebAudioInstance extends AudioInstance {
    volume: number;
    private readonly _playbackRate;
    protected _src: AudioBuffer;
    protected _instance: AudioBufferSourceNode;
    private _audioContext;
    private _volumeNode;
    private _startTime;
    /**
     * Current playback offset (in seconds)
     */
    private _currentOffset;
    constructor(_src: AudioBuffer);
    pause(): void;
    stop(): void;
    protected _startPlayBack(): void;
    protected _resumePlayBack(): void;
    protected _handleOnEnded(): void;
    private _rememberStartTime;
    private _setPauseOffset;
    private _createNewBufferSource;
}
