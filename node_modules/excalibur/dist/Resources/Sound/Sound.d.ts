import { Audio } from '../../Interfaces/Audio';
import { Engine } from '../../Engine';
import { Resource } from '../Resource';
import { AudioInstance } from './AudioInstance';
import { Promise } from '../../Promises';
/**
 * The [[Sound]] object allows games built in Excalibur to load audio
 * components, from soundtracks to sound effects. [[Sound]] is an [[ILoadable]]
 * which means it can be passed to a [[Loader]] to pre-load before a game or level.
 *
 * [[include:Sounds.md]]
 */
export declare class Sound extends Resource<Blob | ArrayBuffer> implements Audio {
    /**
     * Indicates whether the clip should loop when complete
     * @param value  Set the looping flag
     */
    loop: boolean;
    volume: number;
    /**
     * Return array of Current AudioInstances playing or being paused
     */
    readonly instances: AudioInstance[];
    path: string;
    private _loop;
    private _volume;
    private _isPaused;
    private _tracks;
    private _engine;
    private _wasPlayingOnHidden;
    private _processedData;
    private _audioContext;
    /**
     * @param paths A list of audio sources (clip.wav, clip.mp3, clip.ogg) for this audio clip. This is done for browser compatibility.
     */
    constructor(...paths: string[]);
    wireEngine(engine: Engine): void;
    /**
     * Returns how many instances of the sound are currently playing
     */
    instanceCount(): number;
    /**
     * Whether or not the sound is playing right now
     */
    isPlaying(): boolean;
    /**
     * Play the sound, returns a promise that resolves when the sound is done playing
     * An optional volume argument can be passed in to play the sound. Max volume is 1.0
     */
    play(volume?: number): Promise<boolean>;
    /**
     * Stop the sound, and do not rewind
     */
    pause(): void;
    /**
     * Stop the sound and rewind
     */
    stop(): void;
    setData(data: any): void;
    processData(data: Blob | ArrayBuffer): Promise<string | AudioBuffer>;
    /**
     * Get Id of provided AudioInstance in current trackList
     * @param track [[AudioInstance]] which Id is to be given
     */
    getTrackId(track: AudioInstance): number;
    private _resumePlayback;
    private _startPlayback;
    private _processArrayBufferData;
    private _processBlobData;
    private _setProcessedData;
    private _createNewTrack;
    private _getTrackInstance;
    private _detectResponseType;
}
