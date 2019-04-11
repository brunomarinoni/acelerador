import * as Actions from './Action';
import { Promise } from '../Promises';
import { EasingFunctions } from '../Util/EasingFunctions';
/**
 * The fluent Action API allows you to perform "actions" on
 * [[Actor|Actors]] such as following, moving, rotating, and
 * more. You can implement your own actions by implementing
 * the [[IAction]] interface.
 *
 * [[include:Actions.md]]
 */
var ActionContext = /** @class */ (function () {
    function ActionContext() {
        this._actors = [];
        this._queues = [];
        if (arguments !== null) {
            this._actors = Array.prototype.slice.call(arguments, 0);
            this._queues = this._actors.map(function (a) {
                return a.actionQueue;
            });
        }
    }
    /**
     * Clears all queued actions from the Actor
     */
    ActionContext.prototype.clearActions = function () {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].clearActions();
        }
    };
    ActionContext.prototype.addActorToContext = function (actor) {
        this._actors.push(actor);
        // if we run into problems replace the line below with:
        this._queues.push(actor.actionQueue);
    };
    ActionContext.prototype.removeActorFromContext = function (actor) {
        var index = this._actors.indexOf(actor);
        if (index > -1) {
            this._actors.splice(index, 1);
            this._queues.splice(index, 1);
        }
    };
    /**
     * This method will move an actor to the specified `x` and `y` position over the
     * specified duration using a given [[EasingFunctions]] and return back the actor. This
     * method is part of the actor 'Action' fluent API allowing action chaining.
     * @param x         The x location to move the actor to
     * @param y         The y location to move the actor to
     * @param duration  The time it should take the actor to move to the new location in milliseconds
     * @param easingFcn Use [[EasingFunctions]] or a custom function to use to calculate position
     */
    ActionContext.prototype.easeTo = function (x, y, duration, easingFcn) {
        if (easingFcn === void 0) { easingFcn = EasingFunctions.Linear; }
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.EaseTo(this._actors[i], x, y, duration, easingFcn));
        }
        return this;
    };
    /**
     * This method will move an actor to the specified x and y position at the
     * speed specified (in pixels per second) and return back the actor. This
     * method is part of the actor 'Action' fluent API allowing action chaining.
     * @param x      The x location to move the actor to
     * @param y      The y location to move the actor to
     * @param speed  The speed in pixels per second to move
     */
    ActionContext.prototype.moveTo = function (x, y, speed) {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.MoveTo(this._actors[i], x, y, speed));
        }
        return this;
    };
    /**
     * This method will move an actor to the specified x and y position by a
     * certain time (in milliseconds). This method is part of the actor
     * 'Action' fluent API allowing action chaining.
     * @param x     The x location to move the actor to
     * @param y     The y location to move the actor to
     * @param time  The time it should take the actor to move to the new location in milliseconds
     */
    ActionContext.prototype.moveBy = function (x, y, time) {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.MoveBy(this._actors[i], x, y, time));
        }
        return this;
    };
    /**
     * This method will rotate an actor to the specified angle at the speed
     * specified (in radians per second) and return back the actor. This
     * method is part of the actor 'Action' fluent API allowing action chaining.
     * @param angleRadians  The angle to rotate to in radians
     * @param speed         The angular velocity of the rotation specified in radians per second
     * @param rotationType  The [[RotationType]] to use for this rotation
     */
    ActionContext.prototype.rotateTo = function (angleRadians, speed, rotationType) {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.RotateTo(this._actors[i], angleRadians, speed, rotationType));
        }
        return this;
    };
    /**
     * This method will rotate an actor to the specified angle by a certain
     * time (in milliseconds) and return back the actor. This method is part
     * of the actor 'Action' fluent API allowing action chaining.
     * @param angleRadians  The angle to rotate to in radians
     * @param time          The time it should take the actor to complete the rotation in milliseconds
     * @param rotationType  The [[RotationType]] to use for this rotation
     */
    ActionContext.prototype.rotateBy = function (angleRadians, time, rotationType) {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.RotateBy(this._actors[i], angleRadians, time, rotationType));
        }
        return this;
    };
    /**
     * This method will scale an actor to the specified size at the speed
     * specified (in magnitude increase per second) and return back the
     * actor. This method is part of the actor 'Action' fluent API allowing
     * action chaining.
     * @param sizeX   The scaling factor to apply on X axis
     * @param sizeY   The scaling factor to apply on Y axis
     * @param speedX  The speed of scaling specified in magnitude increase per second on X axis
     * @param speedY  The speed of scaling specified in magnitude increase per second on Y axis
     */
    ActionContext.prototype.scaleTo = function (sizeX, sizeY, speedX, speedY) {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.ScaleTo(this._actors[i], sizeX, sizeY, speedX, speedY));
        }
        return this;
    };
    /**
     * This method will scale an actor to the specified size by a certain time
     * (in milliseconds) and return back the actor. This method is part of the
     * actor 'Action' fluent API allowing action chaining.
     * @param sizeX   The scaling factor to apply on X axis
     * @param sizeY   The scaling factor to apply on Y axis
     * @param time    The time it should take to complete the scaling in milliseconds
     */
    ActionContext.prototype.scaleBy = function (sizeX, sizeY, time) {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.ScaleBy(this._actors[i], sizeX, sizeY, time));
        }
        return this;
    };
    /**
     * This method will cause an actor to blink (become visible and not
     * visible). Optionally, you may specify the number of blinks. Specify the amount of time
     * the actor should be visible per blink, and the amount of time not visible.
     * This method is part of the actor 'Action' fluent API allowing action chaining.
     * @param timeVisible     The amount of time to stay visible per blink in milliseconds
     * @param timeNotVisible  The amount of time to stay not visible per blink in milliseconds
     * @param numBlinks       The number of times to blink
     */
    ActionContext.prototype.blink = function (timeVisible, timeNotVisible, numBlinks) {
        if (numBlinks === void 0) { numBlinks = 1; }
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.Blink(this._actors[i], timeVisible, timeNotVisible, numBlinks));
        }
        return this;
    };
    /**
     * This method will cause an actor's opacity to change from its current value
     * to the provided value by a specified time (in milliseconds). This method is
     * part of the actor 'Action' fluent API allowing action chaining.
     * @param opacity  The ending opacity
     * @param time     The time it should take to fade the actor (in milliseconds)
     */
    ActionContext.prototype.fade = function (opacity, time) {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.Fade(this._actors[i], opacity, time));
        }
        return this;
    };
    /**
     * This method will delay the next action from executing for a certain
     * amount of time (in milliseconds). This method is part of the actor
     * 'Action' fluent API allowing action chaining.
     * @param time  The amount of time to delay the next action in the queue from executing in milliseconds
     */
    ActionContext.prototype.delay = function (time) {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.Delay(this._actors[i], time));
        }
        return this;
    };
    /**
     * This method will add an action to the queue that will remove the actor from the
     * scene once it has completed its previous actions. Any actions on the
     * action queue after this action will not be executed.
     */
    ActionContext.prototype.die = function () {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.Die(this._actors[i]));
        }
        return this;
    };
    /**
     * This method allows you to call an arbitrary method as the next action in the
     * action queue. This is useful if you want to execute code in after a specific
     * action, i.e An actor arrives at a destination after traversing a path
     */
    ActionContext.prototype.callMethod = function (method) {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.CallMethod(this._actors[i], method));
        }
        return this;
    };
    /**
     * This method will cause the actor to repeat all of the previously
     * called actions a certain number of times. If the number of repeats
     * is not specified it will repeat forever. This method is part of
     * the actor 'Action' fluent API allowing action chaining
     * @param times  The number of times to repeat all the previous actions in the action queue. If nothing is specified the actions
     * will repeat forever
     */
    ActionContext.prototype.repeat = function (times) {
        if (!times) {
            this.repeatForever();
            return this;
        }
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.Repeat(this._actors[i], times, this._actors[i].actionQueue.getActions()));
        }
        return this;
    };
    /**
     * This method will cause the actor to repeat all of the previously
     * called actions forever. This method is part of the actor 'Action'
     * fluent API allowing action chaining.
     */
    ActionContext.prototype.repeatForever = function () {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            this._queues[i].add(new Actions.RepeatForever(this._actors[i], this._actors[i].actionQueue.getActions()));
        }
        return this;
    };
    /**
     * This method will cause the actor to follow another at a specified distance
     * @param actor           The actor to follow
     * @param followDistance  The distance to maintain when following, if not specified the actor will follow at the current distance.
     */
    ActionContext.prototype.follow = function (actor, followDistance) {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            if (followDistance === undefined) {
                this._queues[i].add(new Actions.Follow(this._actors[i], actor));
            }
            else {
                this._queues[i].add(new Actions.Follow(this._actors[i], actor, followDistance));
            }
        }
        return this;
    };
    /**
     * This method will cause the actor to move towards another until they
     * collide "meet" at a specified speed.
     * @param actor  The actor to meet
     * @param speed  The speed in pixels per second to move, if not specified it will match the speed of the other actor
     */
    ActionContext.prototype.meet = function (actor, speed) {
        var i = 0, len = this._queues.length;
        for (i; i < len; i++) {
            if (speed === undefined) {
                this._queues[i].add(new Actions.Meet(this._actors[i], actor));
            }
            else {
                this._queues[i].add(new Actions.Meet(this._actors[i], actor, speed));
            }
        }
        return this;
    };
    /**
     * Returns a promise that resolves when the current action queue up to now
     * is finished.
     */
    ActionContext.prototype.asPromise = function () {
        var _this = this;
        var promises = this._queues.map(function (q, i) {
            var temp = new Promise();
            q.add(new Actions.CallMethod(_this._actors[i], function () {
                temp.resolve();
            }));
            return temp;
        });
        return Promise.join.apply(this, promises);
    };
    return ActionContext;
}());
export { ActionContext };
//# sourceMappingURL=ActionContext.js.map