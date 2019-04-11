import { GameEvent, SubscribeEvent, UnsubscribeEvent } from './Events';
/**
 * Excalibur's internal event dispatcher implementation.
 * Callbacks are fired immediately after an event is published.
 * Typically you will use [[Class.eventDispatcher]] since most classes in
 * Excalibur inherit from [[Class]]. You will rarely create an `EventDispatcher`
 * yourself.
 *
 * [[include:Events.md]]
 */
var EventDispatcher = /** @class */ (function () {
    /**
     * @param target  The object that will be the recipient of events from this event dispatcher
     */
    function EventDispatcher(target) {
        this._handlers = {};
        this._wiredEventDispatchers = [];
        this._target = target;
    }
    /**
     * Emits an event for target
     * @param eventName  The name of the event to publish
     * @param event      Optionally pass an event data object to the handler
     */
    EventDispatcher.prototype.emit = function (eventName, event) {
        if (!eventName) {
            // key not mapped
            return;
        }
        eventName = eventName.toLowerCase();
        var target = this._target;
        if (!event) {
            event = new GameEvent();
        }
        event.target = target;
        var i, len;
        if (this._handlers[eventName]) {
            i = 0;
            len = this._handlers[eventName].length;
            for (i; i < len; i++) {
                this._handlers[eventName][i].call(target, event);
            }
        }
        i = 0;
        len = this._wiredEventDispatchers.length;
        for (i; i < len; i++) {
            this._wiredEventDispatchers[i].emit(eventName, event);
        }
    };
    /**
     * Subscribe an event handler to a particular event name, multiple handlers per event name are allowed.
     * @param eventName  The name of the event to subscribe to
     * @param handler    The handler callback to fire on this event
     */
    EventDispatcher.prototype.on = function (eventName, handler) {
        eventName = eventName.toLowerCase();
        if (!this._handlers[eventName]) {
            this._handlers[eventName] = [];
        }
        this._handlers[eventName].push(handler);
        // meta event handlers
        if (eventName !== 'unsubscribe' && eventName !== 'subscribe') {
            this.emit('subscribe', new SubscribeEvent(eventName, handler));
        }
    };
    /**
     * Unsubscribe an event handler(s) from an event. If a specific handler
     * is specified for an event, only that handler will be unsubscribed.
     * Otherwise all handlers will be unsubscribed for that event.
     *
     * @param eventName  The name of the event to unsubscribe
     * @param handler    Optionally the specific handler to unsubscribe
     *
     */
    EventDispatcher.prototype.off = function (eventName, handler) {
        eventName = eventName.toLowerCase();
        var eventHandlers = this._handlers[eventName];
        if (eventHandlers) {
            // if no explicit handler is give with the event name clear all handlers
            if (!handler) {
                this._handlers[eventName].length = 0;
            }
            else {
                var index = eventHandlers.indexOf(handler);
                this._handlers[eventName].splice(index, 1);
            }
        }
        // meta event handlers
        if (eventName !== 'unsubscribe' && eventName !== 'subscribe') {
            this.emit('unsubscribe', new UnsubscribeEvent(eventName, handler));
        }
    };
    /**
     * Once listens to an event one time, then unsubscribes from that event
     *
     * @param eventName The name of the event to subscribe to once
     * @param handler   The handler of the event that will be auto unsubscribed
     */
    EventDispatcher.prototype.once = function (eventName, handler) {
        var _this = this;
        var metaHandler = function (event) {
            var ev = event || new GameEvent();
            ev.target = ev.target || _this._target;
            _this.off(eventName, handler);
            handler.call(ev.target, ev);
        };
        this.on(eventName, metaHandler);
    };
    /**
     * Wires this event dispatcher to also recieve events from another
     */
    EventDispatcher.prototype.wire = function (eventDispatcher) {
        eventDispatcher._wiredEventDispatchers.push(this);
    };
    /**
     * Unwires this event dispatcher from another
     */
    EventDispatcher.prototype.unwire = function (eventDispatcher) {
        var index = eventDispatcher._wiredEventDispatchers.indexOf(this);
        if (index > -1) {
            eventDispatcher._wiredEventDispatchers.splice(index, 1);
        }
    };
    return EventDispatcher;
}());
export { EventDispatcher };
//# sourceMappingURL=EventDispatcher.js.map