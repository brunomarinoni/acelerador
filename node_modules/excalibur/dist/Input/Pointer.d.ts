import { Engine } from './../Engine';
import { GameEvent } from '../Events';
import { Actor } from '../Actor';
import { Vector, GlobalCoordinates } from '../Algebra';
import { Class } from '../Class';
import * as Events from '../Events';
export interface ActorsUnderPointer {
    [ActorId: number]: Actor;
    length: number;
}
/**
 * The type of pointer for a [[PointerEvent]].
 */
export declare enum PointerType {
    Touch = 0,
    Mouse = 1,
    Pen = 2,
    Unknown = 3
}
/**
 * The mouse button being pressed.
 */
export declare enum PointerButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Unknown = 3
}
export declare enum WheelDeltaMode {
    Pixel = 0,
    Line = 1,
    Page = 2
}
/**
 * Determines the scope of handling mouse/touch events. See [[Pointers]] for more information.
 */
export declare enum PointerScope {
    /**
     * Handle events on the `canvas` element only. Events originating outside the
     * `canvas` will not be handled.
     */
    Canvas = 0,
    /**
     * Handles events on the entire document. All events will be handled by Excalibur.
     */
    Document = 1
}
/**
 * Pointer events
 *
 * Represents a mouse, touch, or stylus event. See [[Pointers]] for more information on
 * handling pointer input.
 *
 * For mouse-based events, you can inspect [[PointerEvent.button]] to see what button was pressed.
 */
export declare class PointerEvent extends GameEvent<Actor> {
    protected coordinates: GlobalCoordinates;
    pointer: Pointer;
    index: number;
    pointerType: PointerType;
    button: PointerButton;
    ev: any;
    /** The world coordinates of the event. */
    readonly worldPos: Vector;
    /** The page coordinates of the event. */
    readonly pagePos: Vector;
    /** The screen coordinates of the event. */
    readonly screenPos: Vector;
    /**
     * @param coordinates         The [[GlobalCoordinates]] of the event
     * @param pointer             The [[Pointer]] of the event
     * @param index               The index of the pointer (zero-based)
     * @param pointerType         The type of pointer
     * @param button              The button pressed (if [[PointerType.Mouse]])
     * @param ev                  The raw DOM event being handled
     * @param pos                 (Will be added to signature in 0.14.0 release) The position of the event (in world coordinates)
     */
    constructor(coordinates: GlobalCoordinates, pointer: Pointer, index: number, pointerType: PointerType, button: PointerButton, ev: any);
    readonly pos: Vector;
    /**
     * Sets event path to actor, depending on actor provided.
     * If actor is lower in hierarchy tree, previous path'll be kept.
     * @param actor Actor, to lay path form.
     */
    layPath(actor: Actor): void;
}
export declare class PointerEventFactory<T extends PointerEvent> {
    protected _pointerEventType: new (coordinates: GlobalCoordinates, pointer: Pointer, index: number, pointerType: PointerType, button: PointerButton, ev: any) => T;
    constructor(_pointerEventType: new (coordinates: GlobalCoordinates, pointer: Pointer, index: number, pointerType: PointerType, button: PointerButton, ev: any) => T);
    /**
     * Create specific PointerEvent
     */
    create(coordinates: GlobalCoordinates, pointer: Pointer, index: number, pointerType: PointerType, button: PointerButton, ev: any): T;
}
export declare class PointerDragEvent extends PointerEvent {
}
export declare class PointerUpEvent extends PointerEvent {
    protected _name: string;
    protected _onActionEnd(actor: Actor): void;
}
export declare class PointerDownEvent extends PointerEvent {
    protected _name: string;
    protected _onActionEnd(actor: Actor): void;
}
export declare class PointerMoveEvent extends PointerEvent {
    protected _name: string;
    propagate(): void;
    /**
     * Sets event path to actor, depending on actor provided.
     * If actor is in a dragging state, current dragging target would be used.
     * @param actor Actor, to lay path form.
     */
    layPath(actor: Actor): void;
    protected _onActionStart(actor: Actor): void;
    private _onActorEnter;
    private _onActorLeave;
}
export declare class PointerEnterEvent extends PointerEvent {
    protected _name: string;
    protected _onActionStart(actor: Actor): void;
    protected _onActionEnd(actor: Actor): void;
}
export declare class PointerLeaveEvent extends PointerEvent {
    protected _name: string;
    layPath(actor: Actor): void;
    protected _onActionStart(actor: Actor): void;
    protected _onActionEnd(actor: Actor): void;
}
export declare class PointerCancelEvent extends PointerEvent {
    protected _name: string;
}
/**
 * Wheel Events
 *
 * Represents a mouse wheel event. See [[Pointers]] for more information on
 * handling point input.
 */
export declare class WheelEvent extends GameEvent<Actor> {
    x: number;
    y: number;
    pageX: number;
    pageY: number;
    screenX: number;
    screenY: number;
    index: number;
    deltaX: number;
    deltaY: number;
    deltaZ: number;
    deltaMode: WheelDeltaMode;
    ev: any;
    /**
     * @param x            The `x` coordinate of the event (in world coordinates)
     * @param y            The `y` coordinate of the event (in world coordinates)
     * @param pageX        The `x` coordinate of the event (in document coordinates)
     * @param pageY        The `y` coordinate of the event (in document coordinates)
     * @param screenX      The `x` coordinate of the event (in screen coordinates)
     * @param screenY      The `y` coordinate of the event (in screen coordinates)
     * @param index        The index of the pointer (zero-based)
     * @param deltaX       The type of pointer
     * @param deltaY       The type of pointer
     * @param deltaZ       The type of pointer
     * @param deltaMode    The type of movement [[WheelDeltaMode]]
     * @param ev           The raw DOM event being handled
     */
    constructor(x: number, y: number, pageX: number, pageY: number, screenX: number, screenY: number, index: number, deltaX: number, deltaY: number, deltaZ: number, deltaMode: WheelDeltaMode, ev: any);
}
/**
 * Handles pointer events (mouse, touch, stylus, etc.) and normalizes to
 * [W3C Pointer Events](http://www.w3.org/TR/pointerevents/).
 *
 * [[include:Pointers.md]]
 */
export declare class Pointers extends Class {
    private _engine;
    private _pointerDown;
    private _pointerUp;
    private _pointerMove;
    private _pointerCancel;
    private _wheel;
    private _pointers;
    private _activePointers;
    constructor(engine: Engine);
    on(eventName: Events.up, handler: (event?: PointerEvent) => void): void;
    on(eventName: Events.down, handler: (event?: PointerEvent) => void): void;
    on(eventName: Events.move, handler: (event?: PointerEvent) => void): void;
    on(eventName: Events.enter, handler: (event?: PointerEvent) => void): void;
    on(eventName: Events.leave, handler: (event?: PointerEvent) => void): void;
    on(eventName: Events.cancel, handler: (event?: PointerEvent) => void): void;
    on(eventName: Events.wheel, handler: (event?: WheelEvent) => void): void;
    on(eventName: string, handler: (event?: GameEvent<any>) => void): void;
    /**
     * Primary pointer (mouse, 1 finger, stylus, etc.)
     */
    primary: Pointer;
    /**
     * Initializes pointer event listeners
     */
    init(target?: GlobalEventHandlers): void;
    update(): void;
    /**
     * Safely gets a Pointer at a specific index and initializes one if it doesn't yet exist
     * @param index  The pointer index to retrieve
     */
    at(index: number): Pointer;
    /**
     * Get number of pointers being watched
     */
    count(): number;
    /**
     * Propogates events through ancestors chain if necessary
     */
    propagate(): void;
    /**
     * Revises pointer events paths accordingly to actor provided
     * @param actor  Actor to be revised
     */
    revisePointerEventsPaths(actor: Actor): void;
    private _propagatePointerEvent;
    private _revisePointerEventPath;
    private _validateWheelEventPath;
    private _propagateWheelEvent;
    private _propagateWheelPointerEvent;
    private _handleMouseEvent;
    private _handleTouchEvent;
    private _handlePointerEvent;
    private _handleWheelEvent;
    /**
     * Gets the index of the pointer specified for the given pointer ID or finds the next empty pointer slot available.
     * This is required because IE10/11 uses incrementing pointer IDs so we need to store a mapping of ID => idx
     */
    private _getPointerIndex;
    private _stringToPointerType;
}
/**
 * Captures and dispatches PointerEvents
 */
export declare class Pointer extends Class {
    private _isDown;
    private _wasDown;
    private _actorsUnderPointer;
    /**
     * Whether the Pointer is currently dragging.
     */
    readonly isDragging: boolean;
    /**
     * Whether the Pointer just started dragging.
     */
    readonly isDragStart: boolean;
    /**
     * Whether the Pointer just ended dragging.
     */
    readonly isDragEnd: boolean;
    /**
     * Returns true if pointer has any actors under
     */
    readonly hasActorsUnderPointer: boolean;
    /**
     * The last position on the document this pointer was at. Can be `null` if pointer was never active.
     */
    lastPagePos: Vector;
    /**
     * The last position on the screen this pointer was at. Can be `null` if pointer was never active.
     */
    lastScreenPos: Vector;
    /**
     * The last position in the game world coordinates this pointer was at. Can be `null` if pointer was never active.
     */
    lastWorldPos: Vector;
    /**
     * Returns the currently dragging target or null if it isn't exist
     */
    dragTarget: Actor;
    constructor();
    update(): void;
    /**
     * Adds an Actor to actorsUnderPointer object.
     * @param actor An Actor to be added;
     */
    addActorUnderPointer(actor: Actor): void;
    /**
     * Removes an Actor from actorsUnderPointer object.
     * @param actor An Actor to be removed;
     */
    removeActorUnderPointer(actor: Actor): void;
    /**
     * Returns an Actor from actorsUnderPointer object.
     * @param actor An Actor to be ;
     */
    getActorsUnderPointer(): Actor[];
    /**
     * Checks if Pointer has a specific Actor under.
     * @param actor An Actor for check;
     */
    isActorUnderPointer(actor: Actor): boolean;
    /**
     * Checks if Pointer has a specific Actor in ActrorsUnderPointer list.
     * @param actor An Actor for check;
     */
    hasActorUnderPointerInList(actor: Actor): boolean;
    private _onPointerMove;
    private _onPointerDown;
    private _onPointerUp;
}
