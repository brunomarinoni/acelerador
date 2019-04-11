import { Loadable } from '../Interfaces/Loadable';
import { Class } from '../Class';
import { Engine } from '../Engine';
import { Promise } from '../Promises';
import { Logger } from '../Util/Log';
/**
 * The [[Resource]] type allows games built in Excalibur to load generic resources.
 * For any type of remote resource it is recommended to use [[Resource]] for preloading.
 *
 * [[include:Resources.md]]
 */
export declare class Resource<T> extends Class implements Loadable {
    path: string;
    responseType: '' | 'arraybuffer' | 'blob' | 'document' | 'json' | 'text';
    bustCache: boolean;
    data: T;
    logger: Logger;
    arrayBuffer: ArrayBuffer;
    /**
     * @param path          Path to the remote resource
     * @param responseType  The type to expect as a response: "" | "arraybuffer" | "blob" | "document" | "json" | "text";
     * @param bustCache     Whether or not to cache-bust requests
     */
    constructor(path: string, responseType: '' | 'arraybuffer' | 'blob' | 'document' | 'json' | 'text', bustCache?: boolean);
    /**
     * Returns true if the Resource is completely loaded and is ready
     * to be drawn.
     */
    isLoaded(): boolean;
    wireEngine(_engine: Engine): void;
    private _cacheBust;
    private _start;
    /**
     * Begin loading the resource and returns a promise to be resolved on completion
     */
    load(): Promise<T>;
    /**
     * Returns the loaded data once the resource is loaded
     */
    getData(): any;
    getArrayData(): any;
    /**
     * Sets the data for this resource directly
     */
    setData(data: any): void;
    /**
     * This method is meant to be overriden to handle any additional
     * processing. Such as decoding downloaded audio bits.
     */
    processData(data: T): any;
    onprogress: (e: any) => void;
    oncomplete: () => void;
    onerror: (e: any) => void;
}
