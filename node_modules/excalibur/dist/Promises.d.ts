/**
 * Valid states for a promise to be in
 */
export declare enum PromiseState {
    Resolved = 0,
    Rejected = 1,
    Pending = 2
}
export interface PromiseLike<T> {
    then(successCallback?: (value?: T) => any, rejectCallback?: (value?: T) => any): PromiseLike<T>;
    error(rejectCallback?: (value?: any) => any): PromiseLike<T>;
    resolve(value?: T): PromiseLike<T>;
    reject(value?: any): PromiseLike<T>;
    state(): PromiseState;
}
/**
 * Promises are used to do asynchronous work and they are useful for
 * creating a chain of actions. In Excalibur they are used for loading,
 * sounds, animation, actions, and more.
 *
 * [[include:Promises.md]]
 */
export declare class Promise<T> implements PromiseLike<T> {
    private _state;
    private _value;
    private _successCallbacks;
    private _rejectCallback;
    private _errorCallback;
    /**
     * Create and resolve a Promise with an optional value
     * @param value  An optional value to wrap in a resolved promise
     */
    static resolve<T>(value?: T): Promise<T>;
    /**
     * Create and reject a Promise with an optional value
     * @param value  An optional value to wrap in a rejected promise
     */
    static reject<T>(value?: T): Promise<T>;
    /**
     * Returns a new promise that resolves when all the promises passed to it resolve, or rejects
     * when at least 1 promise rejects.
     */
    static join<T>(promises: Promise<T>[]): Promise<T>;
    /**
     * Returns a new promise that resolves when all the promises passed to it resolve, or rejects
     * when at least 1 promise rejects.
     */
    static join<T>(...promises: Promise<T>[]): Promise<T>;
    /**
     * Chain success and reject callbacks after the promise is resolved
     * @param successCallback  Call on resolution of promise
     * @param rejectCallback   Call on rejection of promise
     */
    then(successCallback?: (value?: T) => any, rejectCallback?: (value?: any) => any): this;
    /**
     * Add an error callback to the promise
     * @param errorCallback  Call if there was an error in a callback
     */
    error(errorCallback?: (value?: any) => any): this;
    /**
     * Resolve the promise and pass an option value to the success callbacks
     * @param value  Value to pass to the success callbacks
     */
    resolve(value?: T): Promise<T>;
    /**
     * Reject the promise and pass an option value to the reject callbacks
     * @param value  Value to pass to the reject callbacks
     */
    reject(value?: any): this;
    /**
     * Inspect the current state of a promise
     */
    state(): PromiseState;
    private _handleError;
}
