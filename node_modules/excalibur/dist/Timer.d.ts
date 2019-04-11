import { Scene } from './Scene';
/**
 * The Excalibur timer hooks into the internal timer and fires callbacks,
 * after a certain interval, optionally repeating.
 */
export declare class Timer {
    static id: number;
    id: number;
    interval: number;
    fcn: () => void;
    repeats: boolean;
    maxNumberOfRepeats: number;
    private _elapsedTime;
    private _totalTimeAlive;
    private _paused;
    private _numberOfTicks;
    complete: boolean;
    scene: Scene;
    /**
     * @param fcn        The callback to be fired after the interval is complete.
     * @param interval   Interval length
     * @param repeats    Indicates whether this call back should be fired only once, or repeat after every interval as completed.
     * @param numberOfRepeats Specifies a maximum number of times that this timer will execute.
     */
    constructor(fcn: () => void, interval: number, repeats?: boolean, numberOfRepeats?: number);
    /**
     * Updates the timer after a certain number of milliseconds have elapsed. This is used internally by the engine.
     * @param delta  Number of elapsed milliseconds since the last update.
     */
    update(delta: number): void;
    /**
     * Resets the timer so that it can be reused, and optionally reconfigure the timers interval.
     * @param newInterval If specified, sets a new non-negative interval in milliseconds to refire the callback
     * @param newNumberOfRepeats If specified, sets a new non-negative upper limit to the number of time this timer executes
     */
    reset(newInterval?: number, newNumberOfRepeats?: number): void;
    readonly timesRepeated: number;
    getTimeRunning(): number;
    /**
     * Pauses the timer so that no more time will be incremented towards the next call
     */
    pause(): void;
    /**
     * Unpauses the timer. Time will now increment towards the next call
     */
    unpause(): void;
    /**
     * Cancels the timer, preventing any further executions.
     */
    cancel(): void;
}
