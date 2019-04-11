import { Scene } from './Scene';
import { Vector } from './Algebra';
import { Actor } from './Actor';
import { Trigger } from './Trigger';
import { FrameStats } from './Debug';
import { Engine } from './Engine';
import { TileMap } from './TileMap';
import { Side } from './Collision/Side';
import * as Input from './Input/Index';
import { Pair, Camera } from './index';
export declare enum EventTypes {
    Kill = "kill",
    PreKill = "prekill",
    PostKill = "postkill",
    PreDraw = "predraw",
    PostDraw = "postdraw",
    PreDebugDraw = "predebugdraw",
    PostDebugDraw = "postdebugdraw",
    PreUpdate = "preupdate",
    PostUpdate = "postupdate",
    PreFrame = "preframe",
    PostFrame = "postframe",
    PreCollision = "precollision",
    CollisionStart = "collisionstart",
    CollisionEnd = "collisionend",
    PostCollision = "postcollision",
    Initialize = "initialize",
    Activate = "activate",
    Deactivate = "deactivate",
    ExitViewport = "exitviewport",
    EnterViewport = "enterviewport",
    ExitTrigger = "exit",
    EnterTrigger = "enter",
    Connect = "connect",
    Disconnect = "disconnect",
    Button = "button",
    Axis = "axis",
    Subscribe = "subscribe",
    Unsubscribe = "unsubscribe",
    Visible = "visible",
    Hidden = "hidden",
    Start = "start",
    Stop = "stop",
    PointerUp = "pointerup",
    PointerDown = "pointerdown",
    PointerMove = "pointermove",
    PointerEnter = "pointerenter",
    PointerLeave = "pointerleave",
    PointerCancel = "pointercancel",
    PointerWheel = "pointerwheel",
    Up = "up",
    Down = "down",
    Move = "move",
    Enter = "enter",
    Leave = "leave",
    Cancel = "cancel",
    Wheel = "wheel",
    Press = "press",
    Release = "release",
    Hold = "hold",
    PointerDragStart = "pointerdragstart",
    PointerDragEnd = "pointerdragend",
    PointerDragEnter = "pointerdragenter",
    PointerDragLeave = "pointerdragleave",
    PointerDragMove = "pointerdragmove"
}
export declare type kill = 'kill';
export declare type prekill = 'prekill';
export declare type postkill = 'postkill';
export declare type predraw = 'predraw';
export declare type postdraw = 'postdraw';
export declare type predebugdraw = 'predebugdraw';
export declare type postdebugdraw = 'postdebugdraw';
export declare type preupdate = 'preupdate';
export declare type postupdate = 'postupdate';
export declare type preframe = 'preframe';
export declare type postframe = 'postframe';
export declare type precollision = 'precollision';
export declare type collisionstart = 'collisionstart';
export declare type collisionend = 'collisionend';
export declare type postcollision = 'postcollision';
export declare type initialize = 'initialize';
export declare type activate = 'activate';
export declare type deactivate = 'deactivate';
export declare type exitviewport = 'exitviewport';
export declare type enterviewport = 'enterviewport';
export declare type exittrigger = 'exit';
export declare type entertrigger = 'enter';
export declare type connect = 'connect';
export declare type disconnect = 'disconnect';
export declare type button = 'button';
export declare type axis = 'axis';
export declare type subscribe = 'subscribe';
export declare type unsubscribe = 'unsubscribe';
export declare type visible = 'visible';
export declare type hidden = 'hidden';
export declare type start = 'start';
export declare type stop = 'stop';
export declare type pointerup = 'pointerup';
export declare type pointerdown = 'pointerdown';
export declare type pointermove = 'pointermove';
export declare type pointerenter = 'pointerenter';
export declare type pointerleave = 'pointerleave';
export declare type pointercancel = 'pointercancel';
export declare type pointerwheel = 'pointerwheel';
export declare type up = 'up';
export declare type down = 'down';
export declare type move = 'move';
export declare type enter = 'enter';
export declare type leave = 'leave';
export declare type cancel = 'cancel';
export declare type wheel = 'wheel';
export declare type press = 'press';
export declare type release = 'release';
export declare type hold = 'hold';
export declare type pointerdragstart = 'pointerdragstart';
export declare type pointerdragend = 'pointerdragend';
export declare type pointerdragenter = 'pointerdragenter';
export declare type pointerdragleave = 'pointerdragleave';
export declare type pointerdragmove = 'pointerdragmove';
/**
 * Base event type in Excalibur that all other event types derive from. Not all event types are thrown on all Excalibur game objects,
 * some events are unique to a type, others are not.
 *
 */
export declare class GameEvent<T> {
    /**
     * Target object for this event.
     */
    target: T;
    /**
     * determines, if event bubbles to the target's ancestors
     */
    bubbles: boolean;
    /**
     * Holds the whole path from the Root to the event target
     */
    protected _path: Actor[];
    protected _name: string;
    /**
     * Returns Event path from root to active actor.
     */
    readonly eventPath: Actor[];
    /**
     * Returns name of the event
     */
    readonly name: string;
    /**
     * Prevents event from bubbling
     */
    stopPropagation(): void;
    /**
     * Action, that calls when event happens
     */
    action(): void;
    /**
     * Propagate event further through event path
     */
    propagate(): void;
    layPath(actor: Actor): void;
    protected _onActionStart(_actor?: Actor): void;
    protected _onActionEnd(_actor?: Actor): void;
}
/**
 * The 'kill' event is emitted on actors when it is killed. The target is the actor that was killed.
 */
export declare class KillEvent extends GameEvent<Actor> {
    target: Actor;
    constructor(target: Actor);
}
/**
 * The 'prekill' event is emitted directly before an actor is killed.
 */
export declare class PreKillEvent extends GameEvent<Actor> {
    target: Actor;
    constructor(target: Actor);
}
/**
 * The 'postkill' event is emitted directly after the actor is killed.
 */
export declare class PostKillEvent extends GameEvent<Actor> {
    target: Actor;
    constructor(target: Actor);
}
/**
 * The 'start' event is emitted on engine when has started and is ready for interaction.
 */
export declare class GameStartEvent extends GameEvent<Engine> {
    target: Engine;
    constructor(target: Engine);
}
/**
 * The 'stop' event is emitted on engine when has been stopped and will no longer take input, update or draw.
 */
export declare class GameStopEvent extends GameEvent<Engine> {
    target: Engine;
    constructor(target: Engine);
}
/**
 * The 'predraw' event is emitted on actors, scenes, and engine before drawing starts. Actors' predraw happens inside their graphics
 * transform so that all drawing takes place with the actor as the origin.
 *
 */
export declare class PreDrawEvent extends GameEvent<Actor | Scene | Engine | TileMap> {
    ctx: CanvasRenderingContext2D;
    delta: number;
    target: Actor | Scene | Engine | TileMap;
    constructor(ctx: CanvasRenderingContext2D, delta: number, target: Actor | Scene | Engine | TileMap);
}
/**
 * The 'postdraw' event is emitted on actors, scenes, and engine after drawing finishes. Actors' postdraw happens inside their graphics
 * transform so that all drawing takes place with the actor as the origin.
 *
 */
export declare class PostDrawEvent extends GameEvent<Actor | Scene | Engine | TileMap> {
    ctx: CanvasRenderingContext2D;
    delta: number;
    target: Actor | Scene | Engine | TileMap;
    constructor(ctx: CanvasRenderingContext2D, delta: number, target: Actor | Scene | Engine | TileMap);
}
/**
 * The 'predebugdraw' event is emitted on actors, scenes, and engine before debug drawing starts.
 */
export declare class PreDebugDrawEvent extends GameEvent<Actor | Scene | Engine> {
    ctx: CanvasRenderingContext2D;
    target: Actor | Scene | Engine;
    constructor(ctx: CanvasRenderingContext2D, target: Actor | Scene | Engine);
}
/**
 * The 'postdebugdraw' event is emitted on actors, scenes, and engine after debug drawing starts.
 */
export declare class PostDebugDrawEvent extends GameEvent<Actor | Scene | Engine> {
    ctx: CanvasRenderingContext2D;
    target: Actor | Scene | Engine;
    constructor(ctx: CanvasRenderingContext2D, target: Actor | Scene | Engine);
}
/**
 * The 'preupdate' event is emitted on actors, scenes, camera, and engine before the update starts.
 */
export declare class PreUpdateEvent extends GameEvent<Actor | Scene | Engine | TileMap | Camera> {
    engine: Engine;
    delta: number;
    target: Actor | Scene | Engine | TileMap | Camera;
    constructor(engine: Engine, delta: number, target: Actor | Scene | Engine | TileMap | Camera);
}
/**
 * The 'postupdate' event is emitted on actors, scenes, camera, and engine after the update ends.
 */
export declare class PostUpdateEvent extends GameEvent<Actor | Scene | Engine | TileMap | Camera> {
    engine: Engine;
    delta: number;
    target: Actor | Scene | Engine | TileMap | Camera;
    constructor(engine: Engine, delta: number, target: Actor | Scene | Engine | TileMap | Camera);
}
/**
 * The 'preframe' event is emitted on the engine, before the frame begins.
 */
export declare class PreFrameEvent extends GameEvent<Engine> {
    engine: Engine;
    prevStats: FrameStats;
    constructor(engine: Engine, prevStats: FrameStats);
}
/**
 * The 'postframe' event is emitted on the engine, after a frame ends.
 */
export declare class PostFrameEvent extends GameEvent<Engine> {
    engine: Engine;
    stats: FrameStats;
    constructor(engine: Engine, stats: FrameStats);
}
/**
 * Event received when a gamepad is connected to Excalibur. [[Gamepads]] receives this event.
 */
export declare class GamepadConnectEvent extends GameEvent<Input.Gamepad> {
    index: number;
    gamepad: Input.Gamepad;
    constructor(index: number, gamepad: Input.Gamepad);
}
/**
 * Event received when a gamepad is disconnected from Excalibur. [[Gamepads]] receives this event.
 */
export declare class GamepadDisconnectEvent extends GameEvent<Input.Gamepad> {
    index: number;
    gamepad: Input.Gamepad;
    constructor(index: number, gamepad: Input.Gamepad);
}
/**
 * Gamepad button event. See [[Gamepads]] for information on responding to controller input. [[Gamepad]] instances receive this event;
 */
export declare class GamepadButtonEvent extends GameEvent<Input.Gamepad> {
    button: Input.Buttons;
    value: number;
    target: Input.Gamepad;
    /**
     * @param button  The Gamepad button
     * @param value   A numeric value between 0 and 1
     */
    constructor(button: Input.Buttons, value: number, target: Input.Gamepad);
}
/**
 * Gamepad axis event. See [[Gamepads]] for information on responding to controller input. [[Gamepad]] instances receive this event;
 */
export declare class GamepadAxisEvent extends GameEvent<Input.Gamepad> {
    axis: Input.Axes;
    value: number;
    target: Input.Gamepad;
    /**
     * @param axis  The Gamepad axis
     * @param value A numeric value between -1 and 1
     */
    constructor(axis: Input.Axes, value: number, target: Input.Gamepad);
}
/**
 * Subscribe event thrown when handlers for events other than subscribe are added. Meta event that is received by
 * [[EventDispatcher|event dispatchers]].
 */
export declare class SubscribeEvent<T> extends GameEvent<T> {
    topic: string;
    handler: (event?: GameEvent<T>) => void;
    constructor(topic: string, handler: (event?: GameEvent<T>) => void);
}
/**
 * Unsubscribe event thrown when handlers for events other than unsubscribe are removed. Meta event that is received by
 * [[EventDispatcher|event dispatchers]].
 */
export declare class UnsubscribeEvent<T> extends GameEvent<T> {
    topic: string;
    handler: (event?: GameEvent<T>) => void;
    constructor(topic: string, handler: (event?: GameEvent<T>) => void);
}
/**
 * Event received by the [[Engine]] when the browser window is visible on a screen.
 */
export declare class VisibleEvent extends GameEvent<Engine> {
    target: Engine;
    constructor(target: Engine);
}
/**
 * Event received by the [[Engine]] when the browser window is hidden from all screens.
 */
export declare class HiddenEvent extends GameEvent<Engine> {
    target: Engine;
    constructor(target: Engine);
}
/**
 * Event thrown on an [[Actor|actor]] when a collision will occur this frame if it resolves
 */
export declare class PreCollisionEvent extends GameEvent<Actor> {
    actor: Actor;
    other: Actor;
    side: Side;
    intersection: Vector;
    /**
     * @param actor         The actor the event was thrown on
     * @param other         The actor that will collided with the current actor
     * @param side          The side that will be collided with the current actor
     * @param intersection  Intersection vector
     */
    constructor(actor: Actor, other: Actor, side: Side, intersection: Vector);
}
/**
 * Event thrown on an [[Actor|actor]] when a collision has been resolved (body reacted) this frame
 */
export declare class PostCollisionEvent extends GameEvent<Actor> {
    actor: Actor;
    other: Actor;
    side: Side;
    intersection: Vector;
    /**
     * @param actor         The actor the event was thrown on
     * @param other         The actor that did collide with the current actor
     * @param side          The side that did collide with the current actor
     * @param intersection  Intersection vector
     */
    constructor(actor: Actor, other: Actor, side: Side, intersection: Vector);
}
/**
 * Event thrown the first time an [[Actor|actor]] collides with another, after an actor is in contact normal collision events are fired.
 */
export declare class CollisionStartEvent extends GameEvent<Actor> {
    actor: Actor;
    other: Actor;
    pair: Pair;
    /**
     *
     */
    constructor(actor: Actor, other: Actor, pair: Pair);
}
/**
 * Event thrown when the [[Actor|actor]] is no longer colliding with another
 */
export declare class CollisionEndEvent extends GameEvent<Actor> {
    actor: Actor;
    other: Actor;
    /**
     *
     */
    constructor(actor: Actor, other: Actor);
}
/**
 * Event thrown on an [[Actor]] and a [[Scene]] only once before the first update call
 */
export declare class InitializeEvent extends GameEvent<Actor | Scene | Engine | Camera> {
    engine: Engine;
    target: Actor | Scene | Engine | Camera;
    /**
     * @param engine  The reference to the current engine
     */
    constructor(engine: Engine, target: Actor | Scene | Engine | Camera);
}
/**
 * Event thrown on a [[Scene]] on activation
 */
export declare class ActivateEvent extends GameEvent<Scene> {
    oldScene: Scene;
    target: Scene;
    /**
     * @param oldScene  The reference to the old scene
     */
    constructor(oldScene: Scene, target: Scene);
}
/**
 * Event thrown on a [[Scene]] on deactivation
 */
export declare class DeactivateEvent extends GameEvent<Scene> {
    newScene: Scene;
    target: Scene;
    /**
     * @param newScene  The reference to the new scene
     */
    constructor(newScene: Scene, target: Scene);
}
/**
 * Event thrown on an [[Actor]] when it completely leaves the screen.
 */
export declare class ExitViewPortEvent extends GameEvent<Actor> {
    target: Actor;
    constructor(target: Actor);
}
/**
 * Event thrown on an [[Actor]] when it completely leaves the screen.
 */
export declare class EnterViewPortEvent extends GameEvent<Actor> {
    target: Actor;
    constructor(target: Actor);
}
export declare class EnterTriggerEvent extends GameEvent<Actor> {
    target: Trigger;
    actor: Actor;
    constructor(target: Trigger, actor: Actor);
}
export declare class ExitTriggerEvent extends GameEvent<Actor> {
    target: Trigger;
    actor: Actor;
    constructor(target: Trigger, actor: Actor);
}
