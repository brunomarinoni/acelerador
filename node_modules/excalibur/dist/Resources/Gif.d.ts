import { Resource } from './Resource';
import { Promise } from '../Promises';
import { Sprite } from '../Drawing/Sprite';
import { Texture } from './Texture';
import { Color } from '../Drawing/Color';
import { SpriteSheet } from '../Drawing/SpriteSheet';
import { Engine } from '../Engine';
/**
 * The [[Texture]] object allows games built in Excalibur to load image resources.
 * [[Texture]] is an [[ILoadable]] which means it can be passed to a [[Loader]]
 * to pre-load before starting a level or game.
 *
 * [[include:Textures.md]]
 */
export declare class Gif extends Resource<Texture[]> {
    path: string;
    color: Color;
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
    private _stream;
    private _gif;
    private _texture;
    private _animation;
    private _transparentColor;
    /**
     * Populated once loading is complete
     */
    images: HTMLImageElement;
    /**
     * @param path       Path to the image resource
     * @param color      Optionally set the color to treat as transparent the gif, by default [[Color.Magenta]]
     * @param bustCache  Optionally load texture with cache busting
     */
    constructor(path: string, color?: Color, bustCache?: boolean);
    /**
     * Returns true if the Texture is completely loaded and is ready
     * to be drawn.
     */
    isLoaded(): boolean;
    /**
     * Begins loading the texture and returns a promise to be resolved on completion
     */
    load(): Promise<Texture[]>;
    asSprite(id?: number): Sprite;
    asSpriteSheet(): SpriteSheet;
    asAnimation(engine: Engine, speed: number): ex.Animation;
    readonly readCheckBytes: number[];
}
export interface Frame {
    sentinel: number;
    type: string;
    leftPos: number;
    topPos: number;
    width: number;
    height: number;
    lctFlag: boolean;
    interlaced: boolean;
    sorted: boolean;
    reserved: boolean[];
    lctSize: number;
    lzwMinCodeSize: number;
    pixels: number[];
}
export declare class Stream {
    data: any;
    len: number;
    position: number;
    constructor(dataArray: ArrayBuffer);
    readByte: () => any;
    readBytes: (n: number) => any[];
    read: (n: number) => string;
    readUnsigned: () => any;
}
export declare class ParseGif {
    private _st;
    private _handler;
    private _transparentColor;
    frames: Frame[];
    images: HTMLImageElement[];
    globalColorTable: any[];
    checkBytes: number[];
    constructor(stream: Stream, color?: Color);
    parseColorTable: (entries: any) => string[];
    readSubBlocks: () => string;
    parseHeader: () => void;
    parseExt: (block: any) => void;
    parseImg: (img: any) => void;
    parseBlock: () => void;
    arrayToImage: (frame: Frame) => void;
}
