var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ScrollPreventionMode } from './../Engine';
import { GameEvent } from '../Events';
import { Vector, GlobalCoordinates } from '../Algebra';
import { Class } from '../Class';
import * as Actors from '../Util/Actors';
import * as Util from '../Util/Util';
/**
 * The type of pointer for a [[PointerEvent]].
 */
export var PointerType;
(function (PointerType) {
    PointerType[PointerType["Touch"] = 0] = "Touch";
    PointerType[PointerType["Mouse"] = 1] = "Mouse";
    PointerType[PointerType["Pen"] = 2] = "Pen";
    PointerType[PointerType["Unknown"] = 3] = "Unknown";
})(PointerType || (PointerType = {}));
/**
 * The mouse button being pressed.
 */
export var PointerButton;
(function (PointerButton) {
    PointerButton[PointerButton["Left"] = 0] = "Left";
    PointerButton[PointerButton["Middle"] = 1] = "Middle";
    PointerButton[PointerButton["Right"] = 2] = "Right";
    PointerButton[PointerButton["Unknown"] = 3] = "Unknown";
})(PointerButton || (PointerButton = {}));
export var WheelDeltaMode;
(function (WheelDeltaMode) {
    WheelDeltaMode[WheelDeltaMode["Pixel"] = 0] = "Pixel";
    WheelDeltaMode[WheelDeltaMode["Line"] = 1] = "Line";
    WheelDeltaMode[WheelDeltaMode["Page"] = 2] = "Page";
})(WheelDeltaMode || (WheelDeltaMode = {}));
/**
 * Determines the scope of handling mouse/touch events. See [[Pointers]] for more information.
 */
export var PointerScope;
(function (PointerScope) {
    /**
     * Handle events on the `canvas` element only. Events originating outside the
     * `canvas` will not be handled.
     */
    PointerScope[PointerScope["Canvas"] = 0] = "Canvas";
    /**
     * Handles events on the entire document. All events will be handled by Excalibur.
     */
    PointerScope[PointerScope["Document"] = 1] = "Document";
})(PointerScope || (PointerScope = {}));
/**
 * A constant used to normalize wheel events across different browsers
 *
 * This normalization factor is pulled from https://developer.mozilla.org/en-US/docs/Web/Events/wheel#Listening_to_this_event_across_browser
 */
var ScrollWheelNormalizationFactor = -1 / 40;
/**
 * Pointer events
 *
 * Represents a mouse, touch, or stylus event. See [[Pointers]] for more information on
 * handling pointer input.
 *
 * For mouse-based events, you can inspect [[PointerEvent.button]] to see what button was pressed.
 */
var PointerEvent = /** @class */ (function (_super) {
    __extends(PointerEvent, _super);
    /**
     * @param coordinates         The [[GlobalCoordinates]] of the event
     * @param pointer             The [[Pointer]] of the event
     * @param index               The index of the pointer (zero-based)
     * @param pointerType         The type of pointer
     * @param button              The button pressed (if [[PointerType.Mouse]])
     * @param ev                  The raw DOM event being handled
     * @param pos                 (Will be added to signature in 0.14.0 release) The position of the event (in world coordinates)
     */
    function PointerEvent(coordinates, pointer, index, pointerType, button, ev) {
        var _this = _super.call(this) || this;
        _this.coordinates = coordinates;
        _this.pointer = pointer;
        _this.index = index;
        _this.pointerType = pointerType;
        _this.button = button;
        _this.ev = ev;
        return _this;
    }
    Object.defineProperty(PointerEvent.prototype, "worldPos", {
        /** The world coordinates of the event. */
        get: function () {
            return this.coordinates.worldPos.clone();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointerEvent.prototype, "pagePos", {
        /** The page coordinates of the event. */
        get: function () {
            return this.coordinates.pagePos.clone();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointerEvent.prototype, "screenPos", {
        /** The screen coordinates of the event. */
        get: function () {
            return this.coordinates.screenPos.clone();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PointerEvent.prototype, "pos", {
        get: function () {
            return this.coordinates.worldPos.clone();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets event path to actor, depending on actor provided.
     * If actor is lower in hierarchy tree, previous path'll be kept.
     * @param actor Actor, to lay path form.
     */
    PointerEvent.prototype.layPath = function (actor) {
        if (!this.pointer.isActorUnderPointer(actor)) {
            return;
        }
        var actorPath = actor.getAncestors();
        this._path = actorPath.length > this._path.length ? actorPath : this._path;
    };
    return PointerEvent;
}(GameEvent));
export { PointerEvent };
var PointerEventFactory = /** @class */ (function () {
    function PointerEventFactory(_pointerEventType) {
        this._pointerEventType = _pointerEventType;
    }
    /**
     * Create specific PointerEvent
     */
    PointerEventFactory.prototype.create = function (coordinates, pointer, index, pointerType, button, ev) {
        return new this._pointerEventType(coordinates, pointer, index, pointerType, button, ev);
    };
    return PointerEventFactory;
}());
export { PointerEventFactory };
var PointerDragEvent = /** @class */ (function (_super) {
    __extends(PointerDragEvent, _super);
    function PointerDragEvent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PointerDragEvent;
}(PointerEvent));
export { PointerDragEvent };
var PointerUpEvent = /** @class */ (function (_super) {
    __extends(PointerUpEvent, _super);
    function PointerUpEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._name = 'pointerup';
        return _this;
    }
    PointerUpEvent.prototype._onActionEnd = function (actor) {
        var pointer = this.pointer;
        if (pointer.isDragEnd && actor.capturePointer.captureDragEvents) {
            actor.eventDispatcher.emit('pointerdragend', this);
        }
    };
    return PointerUpEvent;
}(PointerEvent));
export { PointerUpEvent };
var PointerDownEvent = /** @class */ (function (_super) {
    __extends(PointerDownEvent, _super);
    function PointerDownEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._name = 'pointerdown';
        return _this;
    }
    PointerDownEvent.prototype._onActionEnd = function (actor) {
        if (this.pointer.isDragStart && actor.capturePointer.captureDragEvents) {
            actor.eventDispatcher.emit('pointerdragstart', this);
        }
    };
    return PointerDownEvent;
}(PointerEvent));
export { PointerDownEvent };
var PointerMoveEvent = /** @class */ (function (_super) {
    __extends(PointerMoveEvent, _super);
    function PointerMoveEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._name = 'pointermove';
        return _this;
    }
    PointerMoveEvent.prototype.propagate = function () {
        var _this = this;
        if (!this.eventPath.length) {
            if (this.pointer.hasActorsUnderPointer) {
                var actors = this.pointer.getActorsUnderPointer();
                actors.forEach(function (actor) {
                    if (!_this.pointer.isActorUnderPointer(actor)) {
                        _this._onActorLeave(actor);
                    }
                });
            }
            return;
        }
        this.action();
        if (this.bubbles) {
            this.propagate();
        }
    };
    /**
     * Sets event path to actor, depending on actor provided.
     * If actor is in a dragging state, current dragging target would be used.
     * @param actor Actor, to lay path form.
     */
    PointerMoveEvent.prototype.layPath = function (actor) {
        /**
         *  double-check is preformed, because user could move pointer too fast and
         *  in that case, pointer can appear out of boundings of the dragging element
         */
        if (this.pointer.isDragging) {
            actor = this.pointer.dragTarget || actor;
        }
        else if (!this.pointer.isActorUnderPointer(actor)) {
            return;
        }
        var actorPath = actor.getAncestors();
        this._path = actorPath.length > this._path.length ? actorPath : this._path;
    };
    PointerMoveEvent.prototype._onActionStart = function (actor) {
        if (!actor.capturePointer.captureMoveEvents) {
            return;
        }
        if (this.pointer.isActorUnderPointer(actor) && !this.pointer.hasActorUnderPointerInList(actor)) {
            this._onActorEnter(actor);
        }
        if (this.pointer.isDragging && actor.capturePointer.captureDragEvents) {
            actor.eventDispatcher.emit('pointerdragmove', this);
        }
    };
    PointerMoveEvent.prototype._onActorEnter = function (actor) {
        var pe = createPointerEventByName('enter', this.coordinates, this.pointer, this.index, this.pointerType, this.button, this.ev);
        pe.layPath(actor);
        pe.propagate();
        this.pointer.addActorUnderPointer(actor);
        if (this.pointer.isDragging) {
            this.pointer.dragTarget = actor;
        }
    };
    PointerMoveEvent.prototype._onActorLeave = function (actor) {
        var pe = createPointerEventByName('leave', this.coordinates, this.pointer, this.index, this.pointerType, this.button, this.ev);
        pe.layPath(actor);
        pe.propagate();
        this.pointer.removeActorUnderPointer(actor);
    };
    return PointerMoveEvent;
}(PointerEvent));
export { PointerMoveEvent };
var PointerEnterEvent = /** @class */ (function (_super) {
    __extends(PointerEnterEvent, _super);
    function PointerEnterEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._name = 'pointerenter';
        return _this;
    }
    PointerEnterEvent.prototype._onActionStart = function (actor) {
        if (!actor.capturePointer.captureMoveEvents) {
            return;
        }
    };
    PointerEnterEvent.prototype._onActionEnd = function (actor) {
        var pointer = this.pointer;
        if (pointer.isDragging && actor.capturePointer.captureDragEvents) {
            actor.eventDispatcher.emit('pointerdragenter', this);
        }
    };
    return PointerEnterEvent;
}(PointerEvent));
export { PointerEnterEvent };
var PointerLeaveEvent = /** @class */ (function (_super) {
    __extends(PointerLeaveEvent, _super);
    function PointerLeaveEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._name = 'pointerleave';
        return _this;
    }
    PointerLeaveEvent.prototype.layPath = function (actor) {
        var actorPath = actor.getAncestors();
        this._path = actorPath.length > this._path.length ? actorPath : this._path;
    };
    PointerLeaveEvent.prototype._onActionStart = function (actor) {
        if (!actor.capturePointer.captureMoveEvents) {
            return;
        }
    };
    PointerLeaveEvent.prototype._onActionEnd = function (actor) {
        var pointer = this.pointer;
        if (pointer.isDragging && actor.capturePointer.captureDragEvents) {
            actor.eventDispatcher.emit('pointerdragleave', this);
        }
    };
    return PointerLeaveEvent;
}(PointerEvent));
export { PointerLeaveEvent };
var PointerCancelEvent = /** @class */ (function (_super) {
    __extends(PointerCancelEvent, _super);
    function PointerCancelEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._name = 'pointercancel';
        return _this;
    }
    return PointerCancelEvent;
}(PointerEvent));
export { PointerCancelEvent };
/**
 * Wheel Events
 *
 * Represents a mouse wheel event. See [[Pointers]] for more information on
 * handling point input.
 */
var WheelEvent = /** @class */ (function (_super) {
    __extends(WheelEvent, _super);
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
    function WheelEvent(x, y, pageX, pageY, screenX, screenY, index, deltaX, deltaY, deltaZ, deltaMode, ev) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        _this.pageX = pageX;
        _this.pageY = pageY;
        _this.screenX = screenX;
        _this.screenY = screenY;
        _this.index = index;
        _this.deltaX = deltaX;
        _this.deltaY = deltaY;
        _this.deltaZ = deltaZ;
        _this.deltaMode = deltaMode;
        _this.ev = ev;
        return _this;
    }
    return WheelEvent;
}(GameEvent));
export { WheelEvent };
function createPointerEventByName(eventName, coordinates, pointer, index, pointerType, button, ev) {
    var factory;
    switch (eventName) {
        case 'up':
            factory = new PointerEventFactory(PointerUpEvent);
            break;
        case 'down':
            factory = new PointerEventFactory(PointerDownEvent);
            break;
        case 'move':
            factory = new PointerEventFactory(PointerMoveEvent);
            break;
        case 'cancel':
            factory = new PointerEventFactory(PointerCancelEvent);
            break;
        case 'enter':
            factory = new PointerEventFactory(PointerEnterEvent);
            break;
        case 'leave':
            factory = new PointerEventFactory(PointerLeaveEvent);
            break;
    }
    return factory.create(coordinates, pointer, index, pointerType, button, ev);
}
/**
 * Handles pointer events (mouse, touch, stylus, etc.) and normalizes to
 * [W3C Pointer Events](http://www.w3.org/TR/pointerevents/).
 *
 * [[include:Pointers.md]]
 */
var Pointers = /** @class */ (function (_super) {
    __extends(Pointers, _super);
    function Pointers(engine) {
        var _this = _super.call(this) || this;
        _this._pointerDown = [];
        _this._pointerUp = [];
        _this._pointerMove = [];
        _this._pointerCancel = [];
        _this._wheel = [];
        _this._pointers = [];
        _this._activePointers = [];
        _this._engine = engine;
        _this._pointers.push(new Pointer());
        _this._activePointers = [-1];
        _this.primary = _this._pointers[0];
        return _this;
    }
    Pointers.prototype.on = function (eventName, handler) {
        _super.prototype.on.call(this, eventName, handler);
    };
    /**
     * Initializes pointer event listeners
     */
    Pointers.prototype.init = function (target) {
        target = target || this._engine.canvas;
        // Touch Events
        target.addEventListener('touchstart', this._handleTouchEvent('down', this._pointerDown));
        target.addEventListener('touchend', this._handleTouchEvent('up', this._pointerUp));
        target.addEventListener('touchmove', this._handleTouchEvent('move', this._pointerMove));
        target.addEventListener('touchcancel', this._handleTouchEvent('cancel', this._pointerCancel));
        // W3C Pointer Events
        // Current: IE11, IE10
        if (window.PointerEvent) {
            // IE11
            this._engine.canvas.style.touchAction = 'none';
            target.addEventListener('pointerdown', this._handlePointerEvent('down', this._pointerDown));
            target.addEventListener('pointerup', this._handlePointerEvent('up', this._pointerUp));
            target.addEventListener('pointermove', this._handlePointerEvent('move', this._pointerMove));
            target.addEventListener('pointercancel', this._handlePointerEvent('cancel', this._pointerCancel));
        }
        else if (window.MSPointerEvent) {
            // IE10
            this._engine.canvas.style.msTouchAction = 'none';
            target.addEventListener('MSPointerDown', this._handlePointerEvent('down', this._pointerDown));
            target.addEventListener('MSPointerUp', this._handlePointerEvent('up', this._pointerUp));
            target.addEventListener('MSPointerMove', this._handlePointerEvent('move', this._pointerMove));
            target.addEventListener('MSPointerCancel', this._handlePointerEvent('cancel', this._pointerCancel));
        }
        else {
            // Mouse Events
            target.addEventListener('mousedown', this._handleMouseEvent('down', this._pointerDown));
            target.addEventListener('mouseup', this._handleMouseEvent('up', this._pointerUp));
            target.addEventListener('mousemove', this._handleMouseEvent('move', this._pointerMove));
        }
        // MDN MouseWheelEvent
        if ('onwheel' in document.createElement('div')) {
            // Modern Browsers
            target.addEventListener('wheel', this._handleWheelEvent('wheel', this._wheel));
        }
        else if (document.onmousewheel !== undefined) {
            // Webkit and IE
            target.addEventListener('mousewheel', this._handleWheelEvent('wheel', this._wheel));
        }
        else {
            // Remaining browser and older Firefox
            target.addEventListener('MozMousePixelScroll', this._handleWheelEvent('wheel', this._wheel));
        }
    };
    Pointers.prototype.update = function () {
        this._pointerUp.length = 0;
        this._pointerDown.length = 0;
        this._pointerMove.length = 0;
        this._pointerCancel.length = 0;
        this._wheel.length = 0;
        for (var i = 0; i < this._pointers.length; i++) {
            this._pointers[i].update();
        }
    };
    /**
     * Safely gets a Pointer at a specific index and initializes one if it doesn't yet exist
     * @param index  The pointer index to retrieve
     */
    Pointers.prototype.at = function (index) {
        if (index >= this._pointers.length) {
            // Ensure there is a pointer to retrieve
            for (var i = this._pointers.length - 1, max = index; i < max; i++) {
                this._pointers.push(new Pointer());
                this._activePointers.push(-1);
            }
        }
        return this._pointers[index];
    };
    /**
     * Get number of pointers being watched
     */
    Pointers.prototype.count = function () {
        return this._pointers.length;
    };
    /**
     * Propogates events through ancestors chain if necessary
     */
    Pointers.prototype.propagate = function () {
        this._propagatePointerEvent(this._pointerDown);
        this._propagatePointerEvent(this._pointerUp);
        this._propagatePointerEvent(this._pointerMove);
        this._propagatePointerEvent(this._pointerCancel);
        this._propagateWheelEvent('pointerwheel', this._wheel);
    };
    /**
     * Revises pointer events paths accordingly to actor provided
     * @param actor  Actor to be revised
     */
    Pointers.prototype.revisePointerEventsPaths = function (actor) {
        this._revisePointerEventPath(actor, this._pointerDown);
        this._revisePointerEventPath(actor, this._pointerUp);
        this._revisePointerEventPath(actor, this._pointerMove);
        this._revisePointerEventPath(actor, this._pointerCancel);
        this._validateWheelEventPath(this._wheel, actor);
    };
    Pointers.prototype._propagatePointerEvent = function (pointers) {
        var len = pointers.length;
        for (var i = 0; i < len; i++) {
            pointers[i].propagate();
        }
    };
    Pointers.prototype._revisePointerEventPath = function (actor, pointers) {
        var len = pointers.length;
        for (var i = 0; i < len; i++) {
            var pointerEvent = pointers[i];
            pointerEvent.layPath(actor);
        }
    };
    Pointers.prototype._validateWheelEventPath = function (pointers, actor) {
        for (var i = 0; i < pointers.length; i++) {
            var wheelEvent = pointers[i];
            var isNotUIActor = !Actors.isUIActor(actor);
            if (actor.contains(wheelEvent.x, wheelEvent.y, isNotUIActor)) {
                wheelEvent.layPath(actor);
            }
        }
    };
    Pointers.prototype._propagateWheelEvent = function (eventName, pointers) {
        var len = pointers.length;
        var wheelEvent;
        for (var i = 0; i < len; i++) {
            wheelEvent = pointers[i];
            switch (eventName) {
                case 'pointerwheel':
                    this._propagateWheelPointerEvent(wheelEvent);
                    break;
            }
        }
    };
    Pointers.prototype._propagateWheelPointerEvent = function (wheelEvent) {
        if (!wheelEvent.eventPath.length) {
            return;
        }
        var actor = wheelEvent.eventPath.pop();
        actor.eventDispatcher.emit('pointerwheel', wheelEvent);
        if (wheelEvent.bubbles) {
            this._propagateWheelPointerEvent(wheelEvent);
        }
    };
    Pointers.prototype._handleMouseEvent = function (eventName, eventArr) {
        var _this = this;
        return function (e) {
            e.preventDefault();
            var pointer = _this.at(0);
            var coordinates = GlobalCoordinates.fromPagePosition(e.pageX, e.pageY, _this._engine);
            var pe = createPointerEventByName(eventName, coordinates, pointer, 0, PointerType.Mouse, e.button, e);
            eventArr.push(pe);
            pointer.eventDispatcher.emit(eventName, pe);
        };
    };
    Pointers.prototype._handleTouchEvent = function (eventName, eventArr) {
        var _this = this;
        return function (e) {
            e.preventDefault();
            for (var i = 0, len = e.changedTouches.length; i < len; i++) {
                var index = _this._pointers.length > 1 ? _this._getPointerIndex(e.changedTouches[i].identifier) : 0;
                if (index === -1) {
                    continue;
                }
                var pointer = _this.at(index);
                var coordinates = GlobalCoordinates.fromPagePosition(e.changedTouches[i].pageX, e.changedTouches[i].pageY, _this._engine);
                var pe = createPointerEventByName(eventName, coordinates, pointer, index, PointerType.Touch, PointerButton.Unknown, e);
                eventArr.push(pe);
                pointer.eventDispatcher.emit(eventName, pe);
                // only with multi-pointer
                if (_this._pointers.length > 1) {
                    if (eventName === 'up') {
                        // remove pointer ID from pool when pointer is lifted
                        _this._activePointers[index] = -1;
                    }
                    else if (eventName === 'down') {
                        // set pointer ID to given index
                        _this._activePointers[index] = e.changedTouches[i].identifier;
                    }
                }
            }
        };
    };
    Pointers.prototype._handlePointerEvent = function (eventName, eventArr) {
        var _this = this;
        return function (e) {
            e.preventDefault();
            // get the index for this pointer ID if multi-pointer is asked for
            var index = _this._pointers.length > 1 ? _this._getPointerIndex(e.pointerId) : 0;
            if (index === -1) {
                return;
            }
            var pointer = _this.at(index);
            var coordinates = GlobalCoordinates.fromPagePosition(e.pageX, e.pageY, _this._engine);
            var pe = createPointerEventByName(eventName, coordinates, pointer, index, _this._stringToPointerType(e.pointerType), e.button, e);
            eventArr.push(pe);
            pointer.eventDispatcher.emit(eventName, pe);
            // only with multi-pointer
            if (_this._pointers.length > 1) {
                if (eventName === 'up') {
                    // remove pointer ID from pool when pointer is lifted
                    _this._activePointers[index] = -1;
                }
                else if (eventName === 'down') {
                    // set pointer ID to given index
                    _this._activePointers[index] = e.pointerId;
                }
            }
        };
    };
    Pointers.prototype._handleWheelEvent = function (eventName, eventArr) {
        var _this = this;
        return function (e) {
            // Should we prevent page scroll because of this event
            if (_this._engine.pageScrollPreventionMode === ScrollPreventionMode.All ||
                (_this._engine.pageScrollPreventionMode === ScrollPreventionMode.Canvas && e.target === _this._engine.canvas)) {
                e.preventDefault();
            }
            var x = e.pageX - Util.getPosition(_this._engine.canvas).x;
            var y = e.pageY - Util.getPosition(_this._engine.canvas).y;
            var transformedPoint = _this._engine.screenToWorldCoordinates(new Vector(x, y));
            // deltaX, deltaY, and deltaZ are the standard modern properties
            // wheelDeltaX, wheelDeltaY, are legacy properties in webkit browsers and older IE
            // e.detail is only used in opera
            var deltaX = e.deltaX || e.wheelDeltaX * ScrollWheelNormalizationFactor || 0;
            var deltaY = e.deltaY || e.wheelDeltaY * ScrollWheelNormalizationFactor || e.wheelDelta * ScrollWheelNormalizationFactor || e.detail || 0;
            var deltaZ = e.deltaZ || 0;
            var deltaMode = WheelDeltaMode.Pixel;
            if (e.deltaMode) {
                if (e.deltaMode === 1) {
                    deltaMode = WheelDeltaMode.Line;
                }
                else if (e.deltaMode === 2) {
                    deltaMode = WheelDeltaMode.Page;
                }
            }
            var we = new WheelEvent(transformedPoint.x, transformedPoint.y, e.pageX, e.pageY, x, y, 0, deltaX, deltaY, deltaZ, deltaMode, e);
            eventArr.push(we);
            _this.at(0).eventDispatcher.emit(eventName, we);
        };
    };
    /**
     * Gets the index of the pointer specified for the given pointer ID or finds the next empty pointer slot available.
     * This is required because IE10/11 uses incrementing pointer IDs so we need to store a mapping of ID => idx
     */
    Pointers.prototype._getPointerIndex = function (pointerId) {
        var idx;
        if ((idx = this._activePointers.indexOf(pointerId)) > -1) {
            return idx;
        }
        for (var i = 0; i < this._activePointers.length; i++) {
            if (this._activePointers[i] === -1) {
                return i;
            }
        }
        // ignore pointer because game isn't watching
        return -1;
    };
    Pointers.prototype._stringToPointerType = function (s) {
        switch (s) {
            case 'touch':
                return PointerType.Touch;
            case 'mouse':
                return PointerType.Mouse;
            case 'pen':
                return PointerType.Pen;
            default:
                return PointerType.Unknown;
        }
    };
    return Pointers;
}(Class));
export { Pointers };
/**
 * Captures and dispatches PointerEvents
 */
var Pointer = /** @class */ (function (_super) {
    __extends(Pointer, _super);
    function Pointer() {
        var _this = _super.call(this) || this;
        _this._isDown = false;
        _this._wasDown = false;
        _this._actorsUnderPointer = { length: 0 };
        /**
         * The last position on the document this pointer was at. Can be `null` if pointer was never active.
         */
        _this.lastPagePos = null;
        /**
         * The last position on the screen this pointer was at. Can be `null` if pointer was never active.
         */
        _this.lastScreenPos = null;
        /**
         * The last position in the game world coordinates this pointer was at. Can be `null` if pointer was never active.
         */
        _this.lastWorldPos = null;
        /**
         * Returns the currently dragging target or null if it isn't exist
         */
        _this.dragTarget = null;
        _this.on('move', _this._onPointerMove);
        _this.on('down', _this._onPointerDown);
        _this.on('up', _this._onPointerUp);
        return _this;
    }
    Object.defineProperty(Pointer.prototype, "isDragging", {
        /**
         * Whether the Pointer is currently dragging.
         */
        get: function () {
            return this._isDown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pointer.prototype, "isDragStart", {
        /**
         * Whether the Pointer just started dragging.
         */
        get: function () {
            return !this._wasDown && this._isDown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pointer.prototype, "isDragEnd", {
        /**
         * Whether the Pointer just ended dragging.
         */
        get: function () {
            return this._wasDown && !this._isDown;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Pointer.prototype, "hasActorsUnderPointer", {
        /**
         * Returns true if pointer has any actors under
         */
        get: function () {
            return !!this._actorsUnderPointer.length;
        },
        enumerable: true,
        configurable: true
    });
    Pointer.prototype.update = function () {
        if (this._wasDown && !this._isDown) {
            this._wasDown = false;
        }
        else if (!this._wasDown && this._isDown) {
            this._wasDown = true;
        }
    };
    /**
     * Adds an Actor to actorsUnderPointer object.
     * @param actor An Actor to be added;
     */
    Pointer.prototype.addActorUnderPointer = function (actor) {
        if (!this.hasActorUnderPointerInList(actor)) {
            this._actorsUnderPointer[actor.id] = actor;
            this._actorsUnderPointer.length += 1;
        }
    };
    /**
     * Removes an Actor from actorsUnderPointer object.
     * @param actor An Actor to be removed;
     */
    Pointer.prototype.removeActorUnderPointer = function (actor) {
        if (this.hasActorUnderPointerInList(actor)) {
            delete this._actorsUnderPointer[actor.id];
            this._actorsUnderPointer.length -= 1;
        }
    };
    /**
     * Returns an Actor from actorsUnderPointer object.
     * @param actor An Actor to be ;
     */
    Pointer.prototype.getActorsUnderPointer = function () {
        var actors = [];
        for (var id in this._actorsUnderPointer) {
            if (id === 'length') {
                continue;
            }
            var actor = this._actorsUnderPointer[id];
            actors.push(actor);
        }
        return actors;
    };
    /**
     * Checks if Pointer has a specific Actor under.
     * @param actor An Actor for check;
     */
    Pointer.prototype.isActorUnderPointer = function (actor) {
        if (this.lastWorldPos) {
            return actor.contains(this.lastWorldPos.x, this.lastWorldPos.y, !Actors.isUIActor(actor));
        }
        return false;
    };
    /**
     * Checks if Pointer has a specific Actor in ActrorsUnderPointer list.
     * @param actor An Actor for check;
     */
    Pointer.prototype.hasActorUnderPointerInList = function (actor) {
        return this._actorsUnderPointer.hasOwnProperty(actor.id.toString());
    };
    Pointer.prototype._onPointerMove = function (ev) {
        this.lastPagePos = new Vector(ev.pagePos.x, ev.pagePos.y);
        this.lastScreenPos = new Vector(ev.screenPos.x, ev.screenPos.y);
        this.lastWorldPos = new Vector(ev.worldPos.x, ev.worldPos.y);
    };
    Pointer.prototype._onPointerDown = function (ev) {
        this.lastPagePos = new Vector(ev.pagePos.x, ev.pagePos.y);
        this.lastScreenPos = new Vector(ev.screenPos.x, ev.screenPos.y);
        this.lastWorldPos = new Vector(ev.worldPos.x, ev.worldPos.y);
        this._isDown = true;
    };
    Pointer.prototype._onPointerUp = function () {
        this._isDown = false;
        this.dragTarget = null;
    };
    return Pointer;
}(Class));
export { Pointer };
//# sourceMappingURL=Pointer.js.map