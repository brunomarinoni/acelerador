import { Engine } from './Engine';
import { Actor, ActorArgs } from './Actor';
/**
 * Helper [[Actor]] primitive for drawing UI's, optimized for UI drawing. Does
 * not participate in collisions. Drawn on top of all other actors.
 */
export declare class UIActor extends Actor {
    protected _engine: Engine;
    constructor();
    constructor(xOrConfig?: number, y?: number, width?: number, height?: number);
    constructor(config?: ActorArgs);
    _initialize(engine: Engine): void;
    contains(x: number, y: number, useWorld?: boolean): boolean;
}
