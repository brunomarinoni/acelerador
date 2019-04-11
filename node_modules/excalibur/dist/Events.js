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
export var EventTypes;
(function (EventTypes) {
    EventTypes["Kill"] = "kill";
    EventTypes["PreKill"] = "prekill";
    EventTypes["PostKill"] = "postkill";
    EventTypes["PreDraw"] = "predraw";
    EventTypes["PostDraw"] = "postdraw";
    EventTypes["PreDebugDraw"] = "predebugdraw";
    EventTypes["PostDebugDraw"] = "postdebugdraw";
    EventTypes["PreUpdate"] = "preupdate";
    EventTypes["PostUpdate"] = "postupdate";
    EventTypes["PreFrame"] = "preframe";
    EventTypes["PostFrame"] = "postframe";
    EventTypes["PreCollision"] = "precollision";
    EventTypes["CollisionStart"] = "collisionstart";
    EventTypes["CollisionEnd"] = "collisionend";
    EventTypes["PostCollision"] = "postcollision";
    EventTypes["Initialize"] = "initialize";
    EventTypes["Activate"] = "activate";
    EventTypes["Deactivate"] = "deactivate";
    EventTypes["ExitViewport"] = "exitviewport";
    EventTypes["EnterViewport"] = "enterviewport";
    EventTypes["ExitTrigger"] = "exit";
    EventTypes["EnterTrigger"] = "enter";
    EventTypes["Connect"] = "connect";
    EventTypes["Disconnect"] = "disconnect";
    EventTypes["Button"] = "button";
    EventTypes["Axis"] = "axis";
    EventTypes["Subscribe"] = "subscribe";
    EventTypes["Unsubscribe"] = "unsubscribe";
    EventTypes["Visible"] = "visible";
    EventTypes["Hidden"] = "hidden";
    EventTypes["Start"] = "start";
    EventTypes["Stop"] = "stop";
    EventTypes["PointerUp"] = "pointerup";
    EventTypes["PointerDown"] = "pointerdown";
    EventTypes["PointerMove"] = "pointermove";
    EventTypes["PointerEnter"] = "pointerenter";
    EventTypes["PointerLeave"] = "pointerleave";
    EventTypes["PointerCancel"] = "pointercancel";
    EventTypes["PointerWheel"] = "pointerwheel";
    EventTypes["Up"] = "up";
    EventTypes["Down"] = "down";
    EventTypes["Move"] = "move";
    EventTypes["Enter"] = "enter";
    EventTypes["Leave"] = "leave";
    EventTypes["Cancel"] = "cancel";
    EventTypes["Wheel"] = "wheel";
    EventTypes["Press"] = "press";
    EventTypes["Release"] = "release";
    EventTypes["Hold"] = "hold";
    EventTypes["PointerDragStart"] = "pointerdragstart";
    EventTypes["PointerDragEnd"] = "pointerdragend";
    EventTypes["PointerDragEnter"] = "pointerdragenter";
    EventTypes["PointerDragLeave"] = "pointerdragleave";
    EventTypes["PointerDragMove"] = "pointerdragmove";
})(EventTypes || (EventTypes = {}));
/**
 * Base event type in Excalibur that all other event types derive from. Not all event types are thrown on all Excalibur game objects,
 * some events are unique to a type, others are not.
 *
 */
var GameEvent = /** @class */ (function () {
    function GameEvent() {
        /**
         * determines, if event bubbles to the target's ancestors
         */
        this.bubbles = true;
        /**
         * Holds the whole path from the Root to the event target
         */
        this._path = [];
        this._name = '';
    }
    Object.defineProperty(GameEvent.prototype, "eventPath", {
        /**
         * Returns Event path from root to active actor.
         */
        get: function () {
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameEvent.prototype, "name", {
        /**
         * Returns name of the event
         */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Prevents event from bubbling
     */
    GameEvent.prototype.stopPropagation = function () {
        this.bubbles = false;
    };
    /**
     * Action, that calls when event happens
     */
    GameEvent.prototype.action = function () {
        var actor = this.eventPath.pop();
        if (actor) {
            this._onActionStart(actor);
            actor.eventDispatcher.emit(this._name, this);
            this._onActionEnd(actor);
        }
    };
    /**
     * Propagate event further through event path
     */
    GameEvent.prototype.propagate = function () {
        if (!this.eventPath.length) {
            return;
        }
        this.action();
        if (this.bubbles) {
            this.propagate();
        }
    };
    GameEvent.prototype.layPath = function (actor) {
        var actorPath = actor.getAncestors();
        this._path = actorPath.length > this._path.length ? actorPath : this._path;
    };
    GameEvent.prototype._onActionStart = function (_actor) {
        // to be rewritten
    };
    GameEvent.prototype._onActionEnd = function (_actor) {
        // to be rewritten
    };
    return GameEvent;
}());
export { GameEvent };
/**
 * The 'kill' event is emitted on actors when it is killed. The target is the actor that was killed.
 */
var KillEvent = /** @class */ (function (_super) {
    __extends(KillEvent, _super);
    function KillEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return KillEvent;
}(GameEvent));
export { KillEvent };
/**
 * The 'prekill' event is emitted directly before an actor is killed.
 */
var PreKillEvent = /** @class */ (function (_super) {
    __extends(PreKillEvent, _super);
    function PreKillEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return PreKillEvent;
}(GameEvent));
export { PreKillEvent };
/**
 * The 'postkill' event is emitted directly after the actor is killed.
 */
var PostKillEvent = /** @class */ (function (_super) {
    __extends(PostKillEvent, _super);
    function PostKillEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return PostKillEvent;
}(GameEvent));
export { PostKillEvent };
/**
 * The 'start' event is emitted on engine when has started and is ready for interaction.
 */
var GameStartEvent = /** @class */ (function (_super) {
    __extends(GameStartEvent, _super);
    function GameStartEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return GameStartEvent;
}(GameEvent));
export { GameStartEvent };
/**
 * The 'stop' event is emitted on engine when has been stopped and will no longer take input, update or draw.
 */
var GameStopEvent = /** @class */ (function (_super) {
    __extends(GameStopEvent, _super);
    function GameStopEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return GameStopEvent;
}(GameEvent));
export { GameStopEvent };
/**
 * The 'predraw' event is emitted on actors, scenes, and engine before drawing starts. Actors' predraw happens inside their graphics
 * transform so that all drawing takes place with the actor as the origin.
 *
 */
var PreDrawEvent = /** @class */ (function (_super) {
    __extends(PreDrawEvent, _super);
    function PreDrawEvent(ctx, delta, target) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        _this.delta = delta;
        _this.target = target;
        return _this;
    }
    return PreDrawEvent;
}(GameEvent));
export { PreDrawEvent };
/**
 * The 'postdraw' event is emitted on actors, scenes, and engine after drawing finishes. Actors' postdraw happens inside their graphics
 * transform so that all drawing takes place with the actor as the origin.
 *
 */
var PostDrawEvent = /** @class */ (function (_super) {
    __extends(PostDrawEvent, _super);
    function PostDrawEvent(ctx, delta, target) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        _this.delta = delta;
        _this.target = target;
        return _this;
    }
    return PostDrawEvent;
}(GameEvent));
export { PostDrawEvent };
/**
 * The 'predebugdraw' event is emitted on actors, scenes, and engine before debug drawing starts.
 */
var PreDebugDrawEvent = /** @class */ (function (_super) {
    __extends(PreDebugDrawEvent, _super);
    function PreDebugDrawEvent(ctx, target) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        _this.target = target;
        return _this;
    }
    return PreDebugDrawEvent;
}(GameEvent));
export { PreDebugDrawEvent };
/**
 * The 'postdebugdraw' event is emitted on actors, scenes, and engine after debug drawing starts.
 */
var PostDebugDrawEvent = /** @class */ (function (_super) {
    __extends(PostDebugDrawEvent, _super);
    function PostDebugDrawEvent(ctx, target) {
        var _this = _super.call(this) || this;
        _this.ctx = ctx;
        _this.target = target;
        return _this;
    }
    return PostDebugDrawEvent;
}(GameEvent));
export { PostDebugDrawEvent };
/**
 * The 'preupdate' event is emitted on actors, scenes, camera, and engine before the update starts.
 */
var PreUpdateEvent = /** @class */ (function (_super) {
    __extends(PreUpdateEvent, _super);
    function PreUpdateEvent(engine, delta, target) {
        var _this = _super.call(this) || this;
        _this.engine = engine;
        _this.delta = delta;
        _this.target = target;
        return _this;
    }
    return PreUpdateEvent;
}(GameEvent));
export { PreUpdateEvent };
/**
 * The 'postupdate' event is emitted on actors, scenes, camera, and engine after the update ends.
 */
var PostUpdateEvent = /** @class */ (function (_super) {
    __extends(PostUpdateEvent, _super);
    function PostUpdateEvent(engine, delta, target) {
        var _this = _super.call(this) || this;
        _this.engine = engine;
        _this.delta = delta;
        _this.target = target;
        return _this;
    }
    return PostUpdateEvent;
}(GameEvent));
export { PostUpdateEvent };
/**
 * The 'preframe' event is emitted on the engine, before the frame begins.
 */
var PreFrameEvent = /** @class */ (function (_super) {
    __extends(PreFrameEvent, _super);
    function PreFrameEvent(engine, prevStats) {
        var _this = _super.call(this) || this;
        _this.engine = engine;
        _this.prevStats = prevStats;
        _this.target = engine;
        return _this;
    }
    return PreFrameEvent;
}(GameEvent));
export { PreFrameEvent };
/**
 * The 'postframe' event is emitted on the engine, after a frame ends.
 */
var PostFrameEvent = /** @class */ (function (_super) {
    __extends(PostFrameEvent, _super);
    function PostFrameEvent(engine, stats) {
        var _this = _super.call(this) || this;
        _this.engine = engine;
        _this.stats = stats;
        _this.target = engine;
        return _this;
    }
    return PostFrameEvent;
}(GameEvent));
export { PostFrameEvent };
/**
 * Event received when a gamepad is connected to Excalibur. [[Gamepads]] receives this event.
 */
var GamepadConnectEvent = /** @class */ (function (_super) {
    __extends(GamepadConnectEvent, _super);
    function GamepadConnectEvent(index, gamepad) {
        var _this = _super.call(this) || this;
        _this.index = index;
        _this.gamepad = gamepad;
        _this.target = gamepad;
        return _this;
    }
    return GamepadConnectEvent;
}(GameEvent));
export { GamepadConnectEvent };
/**
 * Event received when a gamepad is disconnected from Excalibur. [[Gamepads]] receives this event.
 */
var GamepadDisconnectEvent = /** @class */ (function (_super) {
    __extends(GamepadDisconnectEvent, _super);
    function GamepadDisconnectEvent(index, gamepad) {
        var _this = _super.call(this) || this;
        _this.index = index;
        _this.gamepad = gamepad;
        _this.target = gamepad;
        return _this;
    }
    return GamepadDisconnectEvent;
}(GameEvent));
export { GamepadDisconnectEvent };
/**
 * Gamepad button event. See [[Gamepads]] for information on responding to controller input. [[Gamepad]] instances receive this event;
 */
var GamepadButtonEvent = /** @class */ (function (_super) {
    __extends(GamepadButtonEvent, _super);
    /**
     * @param button  The Gamepad button
     * @param value   A numeric value between 0 and 1
     */
    function GamepadButtonEvent(button, value, target) {
        var _this = _super.call(this) || this;
        _this.button = button;
        _this.value = value;
        _this.target = target;
        return _this;
    }
    return GamepadButtonEvent;
}(GameEvent));
export { GamepadButtonEvent };
/**
 * Gamepad axis event. See [[Gamepads]] for information on responding to controller input. [[Gamepad]] instances receive this event;
 */
var GamepadAxisEvent = /** @class */ (function (_super) {
    __extends(GamepadAxisEvent, _super);
    /**
     * @param axis  The Gamepad axis
     * @param value A numeric value between -1 and 1
     */
    function GamepadAxisEvent(axis, value, target) {
        var _this = _super.call(this) || this;
        _this.axis = axis;
        _this.value = value;
        _this.target = target;
        return _this;
    }
    return GamepadAxisEvent;
}(GameEvent));
export { GamepadAxisEvent };
/**
 * Subscribe event thrown when handlers for events other than subscribe are added. Meta event that is received by
 * [[EventDispatcher|event dispatchers]].
 */
var SubscribeEvent = /** @class */ (function (_super) {
    __extends(SubscribeEvent, _super);
    function SubscribeEvent(topic, handler) {
        var _this = _super.call(this) || this;
        _this.topic = topic;
        _this.handler = handler;
        return _this;
    }
    return SubscribeEvent;
}(GameEvent));
export { SubscribeEvent };
/**
 * Unsubscribe event thrown when handlers for events other than unsubscribe are removed. Meta event that is received by
 * [[EventDispatcher|event dispatchers]].
 */
var UnsubscribeEvent = /** @class */ (function (_super) {
    __extends(UnsubscribeEvent, _super);
    function UnsubscribeEvent(topic, handler) {
        var _this = _super.call(this) || this;
        _this.topic = topic;
        _this.handler = handler;
        return _this;
    }
    return UnsubscribeEvent;
}(GameEvent));
export { UnsubscribeEvent };
/**
 * Event received by the [[Engine]] when the browser window is visible on a screen.
 */
var VisibleEvent = /** @class */ (function (_super) {
    __extends(VisibleEvent, _super);
    function VisibleEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return VisibleEvent;
}(GameEvent));
export { VisibleEvent };
/**
 * Event received by the [[Engine]] when the browser window is hidden from all screens.
 */
var HiddenEvent = /** @class */ (function (_super) {
    __extends(HiddenEvent, _super);
    function HiddenEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return HiddenEvent;
}(GameEvent));
export { HiddenEvent };
/**
 * Event thrown on an [[Actor|actor]] when a collision will occur this frame if it resolves
 */
var PreCollisionEvent = /** @class */ (function (_super) {
    __extends(PreCollisionEvent, _super);
    /**
     * @param actor         The actor the event was thrown on
     * @param other         The actor that will collided with the current actor
     * @param side          The side that will be collided with the current actor
     * @param intersection  Intersection vector
     */
    function PreCollisionEvent(actor, other, side, intersection) {
        var _this = _super.call(this) || this;
        _this.actor = actor;
        _this.other = other;
        _this.side = side;
        _this.intersection = intersection;
        _this.target = actor;
        return _this;
    }
    return PreCollisionEvent;
}(GameEvent));
export { PreCollisionEvent };
/**
 * Event thrown on an [[Actor|actor]] when a collision has been resolved (body reacted) this frame
 */
var PostCollisionEvent = /** @class */ (function (_super) {
    __extends(PostCollisionEvent, _super);
    /**
     * @param actor         The actor the event was thrown on
     * @param other         The actor that did collide with the current actor
     * @param side          The side that did collide with the current actor
     * @param intersection  Intersection vector
     */
    function PostCollisionEvent(actor, other, side, intersection) {
        var _this = _super.call(this) || this;
        _this.actor = actor;
        _this.other = other;
        _this.side = side;
        _this.intersection = intersection;
        _this.target = actor;
        return _this;
    }
    return PostCollisionEvent;
}(GameEvent));
export { PostCollisionEvent };
/**
 * Event thrown the first time an [[Actor|actor]] collides with another, after an actor is in contact normal collision events are fired.
 */
var CollisionStartEvent = /** @class */ (function (_super) {
    __extends(CollisionStartEvent, _super);
    /**
     *
     */
    function CollisionStartEvent(actor, other, pair) {
        var _this = _super.call(this) || this;
        _this.actor = actor;
        _this.other = other;
        _this.pair = pair;
        _this.target = actor;
        return _this;
    }
    return CollisionStartEvent;
}(GameEvent));
export { CollisionStartEvent };
/**
 * Event thrown when the [[Actor|actor]] is no longer colliding with another
 */
var CollisionEndEvent = /** @class */ (function (_super) {
    __extends(CollisionEndEvent, _super);
    /**
     *
     */
    function CollisionEndEvent(actor, other) {
        var _this = _super.call(this) || this;
        _this.actor = actor;
        _this.other = other;
        _this.target = actor;
        return _this;
    }
    return CollisionEndEvent;
}(GameEvent));
export { CollisionEndEvent };
/**
 * Event thrown on an [[Actor]] and a [[Scene]] only once before the first update call
 */
var InitializeEvent = /** @class */ (function (_super) {
    __extends(InitializeEvent, _super);
    /**
     * @param engine  The reference to the current engine
     */
    function InitializeEvent(engine, target) {
        var _this = _super.call(this) || this;
        _this.engine = engine;
        _this.target = target;
        return _this;
    }
    return InitializeEvent;
}(GameEvent));
export { InitializeEvent };
/**
 * Event thrown on a [[Scene]] on activation
 */
var ActivateEvent = /** @class */ (function (_super) {
    __extends(ActivateEvent, _super);
    /**
     * @param oldScene  The reference to the old scene
     */
    function ActivateEvent(oldScene, target) {
        var _this = _super.call(this) || this;
        _this.oldScene = oldScene;
        _this.target = target;
        return _this;
    }
    return ActivateEvent;
}(GameEvent));
export { ActivateEvent };
/**
 * Event thrown on a [[Scene]] on deactivation
 */
var DeactivateEvent = /** @class */ (function (_super) {
    __extends(DeactivateEvent, _super);
    /**
     * @param newScene  The reference to the new scene
     */
    function DeactivateEvent(newScene, target) {
        var _this = _super.call(this) || this;
        _this.newScene = newScene;
        _this.target = target;
        return _this;
    }
    return DeactivateEvent;
}(GameEvent));
export { DeactivateEvent };
/**
 * Event thrown on an [[Actor]] when it completely leaves the screen.
 */
var ExitViewPortEvent = /** @class */ (function (_super) {
    __extends(ExitViewPortEvent, _super);
    function ExitViewPortEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return ExitViewPortEvent;
}(GameEvent));
export { ExitViewPortEvent };
/**
 * Event thrown on an [[Actor]] when it completely leaves the screen.
 */
var EnterViewPortEvent = /** @class */ (function (_super) {
    __extends(EnterViewPortEvent, _super);
    function EnterViewPortEvent(target) {
        var _this = _super.call(this) || this;
        _this.target = target;
        return _this;
    }
    return EnterViewPortEvent;
}(GameEvent));
export { EnterViewPortEvent };
var EnterTriggerEvent = /** @class */ (function (_super) {
    __extends(EnterTriggerEvent, _super);
    function EnterTriggerEvent(target, actor) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.actor = actor;
        return _this;
    }
    return EnterTriggerEvent;
}(GameEvent));
export { EnterTriggerEvent };
var ExitTriggerEvent = /** @class */ (function (_super) {
    __extends(ExitTriggerEvent, _super);
    function ExitTriggerEvent(target, actor) {
        var _this = _super.call(this) || this;
        _this.target = target;
        _this.actor = actor;
        return _this;
    }
    return ExitTriggerEvent;
}(GameEvent));
export { ExitTriggerEvent };
//# sourceMappingURL=Events.js.map