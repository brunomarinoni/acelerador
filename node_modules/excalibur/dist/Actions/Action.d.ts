import { RotationType } from './RotationType';
import { Actor } from '../Actor';
/**
 * Used for implementing actions for the [[ActionContext|Action API]].
 */
export interface Action {
    update(delta: number): void;
    isComplete(actor: Actor): boolean;
    reset(): void;
    stop(): void;
}
export declare class EaseTo implements Action {
    actor: Actor;
    easingFcn: (currentTime: number, startValue: number, endValue: number, duration: number) => number;
    private _currentLerpTime;
    private _lerpDuration;
    private _lerpStart;
    private _lerpEnd;
    private _initialized;
    private _stopped;
    private _distance;
    constructor(actor: Actor, x: number, y: number, duration: number, easingFcn: (currentTime: number, startValue: number, endValue: number, duration: number) => number);
    private _initialize;
    update(delta: number): void;
    isComplete(actor: Actor): boolean;
    reset(): void;
    stop(): void;
}
export declare class MoveTo implements Action {
    private _actor;
    x: number;
    y: number;
    private _start;
    private _end;
    private _dir;
    private _speed;
    private _distance;
    private _started;
    private _stopped;
    constructor(actor: Actor, destx: number, desty: number, speed: number);
    update(_delta: number): void;
    isComplete(actor: Actor): boolean;
    stop(): void;
    reset(): void;
}
export declare class MoveBy implements Action {
    private _actor;
    x: number;
    y: number;
    private _distance;
    private _speed;
    private _time;
    private _start;
    private _end;
    private _dir;
    private _started;
    private _stopped;
    constructor(actor: Actor, destx: number, desty: number, time: number);
    update(_delta: number): void;
    isComplete(actor: Actor): boolean;
    stop(): void;
    reset(): void;
}
export declare class Follow implements Action {
    private _actor;
    private _actorToFollow;
    x: number;
    y: number;
    private _current;
    private _end;
    private _dir;
    private _speed;
    private _maximumDistance;
    private _distanceBetween;
    private _started;
    private _stopped;
    constructor(actor: Actor, actorToFollow: Actor, followDistance?: number);
    update(_delta: number): void;
    stop(): void;
    isComplete(): boolean;
    reset(): void;
}
export declare class Meet implements Action {
    private _actor;
    private _actorToMeet;
    x: number;
    y: number;
    private _current;
    private _end;
    private _dir;
    private _speed;
    private _distanceBetween;
    private _started;
    private _stopped;
    private _speedWasSpecified;
    constructor(actor: Actor, actorToMeet: Actor, speed?: number);
    update(_delta: number): void;
    isComplete(): boolean;
    stop(): void;
    reset(): void;
}
export declare class RotateTo implements Action {
    private _actor;
    x: number;
    y: number;
    private _start;
    private _end;
    private _speed;
    private _rotationType;
    private _direction;
    private _distance;
    private _shortDistance;
    private _longDistance;
    private _shortestPathIsPositive;
    private _started;
    private _stopped;
    constructor(actor: Actor, angleRadians: number, speed: number, rotationType?: RotationType);
    update(_delta: number): void;
    isComplete(): boolean;
    stop(): void;
    reset(): void;
}
export declare class RotateBy implements Action {
    private _actor;
    x: number;
    y: number;
    private _start;
    private _end;
    private _speed;
    private _time;
    private _rotationType;
    private _direction;
    private _distance;
    private _shortDistance;
    private _longDistance;
    private _shortestPathIsPositive;
    private _started;
    private _stopped;
    constructor(actor: Actor, angleRadians: number, time: number, rotationType?: RotationType);
    update(_delta: number): void;
    isComplete(): boolean;
    stop(): void;
    reset(): void;
}
export declare class ScaleTo implements Action {
    private _actor;
    x: number;
    y: number;
    private _startX;
    private _startY;
    private _endX;
    private _endY;
    private _speedX;
    private _speedY;
    private _distanceX;
    private _distanceY;
    private _started;
    private _stopped;
    constructor(actor: Actor, scaleX: number, scaleY: number, speedX: number, speedY: number);
    update(_delta: number): void;
    isComplete(): boolean;
    stop(): void;
    reset(): void;
}
export declare class ScaleBy implements Action {
    private _actor;
    x: number;
    y: number;
    private _startX;
    private _startY;
    private _endX;
    private _endY;
    private _distanceX;
    private _distanceY;
    private _started;
    private _stopped;
    private _speedX;
    private _speedY;
    constructor(actor: Actor, scaleX: number, scaleY: number, time: number);
    update(_delta: number): void;
    isComplete(): boolean;
    stop(): void;
    reset(): void;
}
export declare class Delay implements Action {
    x: number;
    y: number;
    private _actor;
    private _elapsedTime;
    private _delay;
    private _started;
    private _stopped;
    constructor(actor: Actor, delay: number);
    update(delta: number): void;
    isComplete(): boolean;
    stop(): void;
    reset(): void;
}
export declare class Blink implements Action {
    private _timeVisible;
    private _timeNotVisible;
    private _elapsedTime;
    private _totalTime;
    private _actor;
    private _duration;
    private _stopped;
    private _started;
    constructor(actor: Actor, timeVisible: number, timeNotVisible: number, numBlinks?: number);
    update(delta: number): void;
    isComplete(): boolean;
    stop(): void;
    reset(): void;
}
export declare class Fade implements Action {
    x: number;
    y: number;
    private _actor;
    private _endOpacity;
    private _speed;
    private _multiplier;
    private _started;
    private _stopped;
    constructor(actor: Actor, endOpacity: number, speed: number);
    update(delta: number): void;
    isComplete(): boolean;
    stop(): void;
    reset(): void;
}
export declare class Die implements Action {
    x: number;
    y: number;
    private _actor;
    private _stopped;
    constructor(actor: Actor);
    update(_delta: number): void;
    isComplete(): boolean;
    stop(): void;
    reset(): void;
}
export declare class CallMethod implements Action {
    x: number;
    y: number;
    private _method;
    private _actor;
    private _hasBeenCalled;
    constructor(actor: Actor, method: () => any);
    update(_delta: number): void;
    isComplete(): boolean;
    reset(): void;
    stop(): void;
}
export declare class Repeat implements Action {
    x: number;
    y: number;
    private _actor;
    private _actionQueue;
    private _repeat;
    private _originalRepeat;
    private _stopped;
    constructor(actor: Actor, repeat: number, actions: Action[]);
    update(delta: number): void;
    isComplete(): boolean;
    stop(): void;
    reset(): void;
}
export declare class RepeatForever implements Action {
    x: number;
    y: number;
    private _actor;
    private _actionQueue;
    private _stopped;
    constructor(actor: Actor, actions: Action[]);
    update(delta: number): void;
    isComplete(): boolean;
    stop(): void;
    reset(): void;
}
/**
 * Action Queues
 *
 * Action queues are part of the [[ActionContext|Action API]] and
 * store the list of actions to be executed for an [[Actor]].
 *
 * Actors implement [[Actor.actions]] which can be manipulated by
 * advanced users to adjust the actions currently being executed in the
 * queue.
 */
export declare class ActionQueue {
    private _actor;
    private _actions;
    private _currentAction;
    private _completedActions;
    constructor(actor: Actor);
    add(action: Action): void;
    remove(action: Action): void;
    clearActions(): void;
    getActions(): Action[];
    hasNext(): boolean;
    reset(): void;
    update(delta: number): void;
}
