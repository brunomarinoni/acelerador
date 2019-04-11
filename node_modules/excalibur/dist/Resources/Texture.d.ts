import { Resource } from './Resource';
import { Promise } from '../Promises';
import { Sprite } from '../Drawing/Sprite';
/**
 * The [[Texture]] object allows games built in Excalibur to load image resources.
 * [[Texture]] is an [[ILoadable]] which means it can be passed to a [[Loader]]
 * to pre-load before starting a level or game.
 *
 * [[include:Textures.md]]
 */
export declare class Texture extends Resource<HTMLImageElement> {
    path: string;
    bustCache: boolean;
    /**
     * The width of the texture in pixels
     */
    width: number;
    /**
     * The height of the texture in pixels
     */
    height: number;
    /**
     * A [[Promise]] that resolves when the Texture is loaded.
     */
    loaded: Promise<any>;
    private _isLoaded;
    private _sprite;
    /**
     * Populated once loading is complete
     */
    image: HTMLImageElement;
    /**
     * @param path       Path to the image resource
     * @param bustCache  Optionally load texture with cache busting
     */
    constructor(path: string, bustCache?: boolean);
    /**
     * Returns true if the Texture is completely loaded and is ready
     * to be drawn.
     */
    isLoaded(): boolean;
    /**
     * Begins loading the texture and returns a promise to be resolved on completion
     */
    load(): Promise<HTMLImageElement>;
    asSprite(): Sprite;
}
