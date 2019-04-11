import { Vector } from '../Algebra';
import { Random } from '../Math/Random';
import { Side } from '../Collision/Side';
/**
 * Two PI constant
 */
export declare const TwoPI: number;
/**
 * Merges one or more objects into a single target object
 *
 * @param deep Whether or not to do a deep clone
 * @param target The target object to attach properties on
 * @param objects The objects whose properties to merge
 * @returns Merged object with properties from other objects
 */
export declare function extend(deep: boolean, target: any, ...objects: any[]): any;
/**
 * Merges one or more objects into a single target object
 *
 * @param target The target object to attach properties on
 * @param object2 The second object whose properties to merge
 * @returns Merged object with properties from other objects
 */
export declare function extend<T1, T2>(target: T1, object2: T2): T1 & T2;
/**
 * Merges one or more objects into a single target object
 *
 * @param target The target object to attach properties on
 * @param object2 The second object whose properties to merge
 * @param object3 The third object whose properties to merge
 * @returns Merged object with properties from other objects
 */
export declare function extend<T1, T2, T3>(target: T1, object2: T2, object3: T3): T1 & T2 & T3;
/**
 * Merges one or more objects into a single target object
 *
 * @param target The target object to attach properties on
 * @param objects The objects whose properties to merge
 * @returns Merged object with properties from other objects
 */
export declare function extend(target: any, ...objects: any[]): any;
export declare function base64Encode(inputStr: string): string;
/**
 * Clamps a value between a min and max inclusive
 */
export declare function clamp(val: number, min: number, max: number): number;
export declare function randomInRange(min: number, max: number, random?: Random): number;
export declare function randomIntInRange(min: number, max: number, random?: Random): number;
export declare function canonicalizeAngle(angle: number): number;
export declare function toDegrees(radians: number): number;
export declare function toRadians(degrees: number): number;
export declare function getPosition(el: HTMLElement): Vector;
export declare function addItemToArray<T>(item: T, array: T[]): boolean;
export declare function removeItemFromArray<T>(item: T, array: T[]): boolean;
export declare function contains(array: Array<any>, obj: any): boolean;
export declare function getOppositeSide(side: Side): Side;
export declare function getSideFromVector(direction: Vector): Side;
/**
 * Excalibur's dynamically resizing collection
 */
export declare class Collection<T> {
    /**
     * Default collection size
     */
    static DefaultSize: number;
    private _internalArray;
    private _endPointer;
    /**
     * @param initialSize  Initial size of the internal backing array
     */
    constructor(initialSize?: number);
    private _resize;
    /**
     * Push elements to the end of the collection
     */
    push(element: T): T;
    /**
     * Removes elements from the end of the collection
     */
    pop(): T;
    /**
     * Returns the count of the collection
     */
    count(): number;
    /**
     * Empties the collection
     */
    clear(): void;
    /**
     * Returns the size of the internal backing array
     */
    internalSize(): number;
    /**
     * Returns an element at a specific index
     * @param index  Index of element to retrieve
     */
    elementAt(index: number): T;
    /**
     * Inserts an element at a specific index
     * @param index  Index to insert the element
     * @param value  Element to insert
     */
    insert(index: number, value: T): T;
    /**
     * Removes an element at a specific index
     * @param index  Index of element to remove
     */
    remove(index: number): T;
    /**
     * Removes an element by reference
     * @param element  Element to retrieve
     */
    removeElement(element: T): void;
    /**
     * Returns a array representing the collection
     */
    toArray(): T[];
    /**
     * Iterate over every element in the collection
     * @param func  Callback to call for each element passing a reference to the element and its index, returned values are ignored
     */
    forEach(func: (element: T, index: number) => any): void;
    /**
     * Mutate every element in the collection
     * @param func  Callback to call for each element passing a reference to the element and its index, any values returned mutate
     * the collection
     */
    map(func: (element: T, index: number) => any): void;
}
