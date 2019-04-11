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
import { Color } from './Drawing/Color';
import { ActionQueue } from './Actions/Action';
import { EventDispatcher } from './EventDispatcher';
import { Actor, CollisionType } from './Actor';
import { Vector } from './Algebra';
import { ExitTriggerEvent, EnterTriggerEvent } from './Events';
import * as Util from './Util/Util';
var triggerDefaults = {
    pos: Vector.Zero,
    width: 10,
    height: 10,
    visible: false,
    action: function () {
        return;
    },
    filter: function () { return true; },
    repeat: -1
};
/**
 * Triggers are a method of firing arbitrary code on collision. These are useful
 * as 'buttons', 'switches', or to trigger effects in a game. By default triggers
 * are invisible, and can only be seen when [[Trigger.visible]] is set to `true`.
 *
 * [[include:Triggers.md]]
 */
var Trigger = /** @class */ (function (_super) {
    __extends(Trigger, _super);
    /**
     *
     * @param opts Trigger options
     */
    function Trigger(opts) {
        var _this = _super.call(this, opts.pos.x, opts.pos.y, opts.width, opts.height) || this;
        /**
         * Action to fire when triggered by collision
         */
        _this.action = function () {
            return;
        };
        /**
         * Filter to add additional granularity to action dispatch, if a filter is specified the action will only fire when
         * filter return true for the collided actor.
         */
        _this.filter = function () { return true; };
        /**
         * Number of times to repeat before killing the trigger,
         */
        _this.repeat = -1;
        opts = Util.extend({}, triggerDefaults, opts);
        _this.filter = opts.filter || _this.filter;
        _this.repeat = opts.repeat || _this.repeat;
        _this.action = opts.action || _this.action;
        if (opts.target) {
            _this.target = opts.target;
        }
        _this.visible = opts.visible;
        _this.collisionType = CollisionType.Passive;
        _this.eventDispatcher = new EventDispatcher(_this);
        _this.actionQueue = new ActionQueue(_this);
        _this.on('collisionstart', function (evt) {
            if (_this.filter(evt.other)) {
                _this.emit('enter', new EnterTriggerEvent(_this, evt.other));
                _this._dispatchAction();
                // remove trigger if its done, -1 repeat forever
                if (_this.repeat === 0) {
                    _this.kill();
                }
            }
        });
        _this.on('collisionend', function (evt) {
            if (_this.filter(evt.other)) {
                _this.emit('exit', new ExitTriggerEvent(_this, evt.other));
            }
        });
        return _this;
    }
    Object.defineProperty(Trigger.prototype, "target", {
        get: function () {
            return this._target;
        },
        set: function (target) {
            this._target = target;
            this.filter = function (actor) { return actor === target; };
        },
        enumerable: true,
        configurable: true
    });
    Trigger.prototype._initialize = function (engine) {
        _super.prototype._initialize.call(this, engine);
    };
    Trigger.prototype._dispatchAction = function () {
        this.action.call(this);
        this.repeat--;
    };
    /* istanbul ignore next */
    Trigger.prototype.debugDraw = function (ctx) {
        _super.prototype.debugDraw.call(this, ctx);
        // Meant to draw debug information about actors
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        var bb = this.getBounds();
        var wp = this.getWorldPos();
        bb.left = bb.left - wp.x;
        bb.right = bb.right - wp.x;
        bb.top = bb.top - wp.y;
        bb.bottom = bb.bottom - wp.y;
        // Currently collision primitives cannot rotate
        // ctx.rotate(this.rotation);
        ctx.fillStyle = Color.Violet.toString();
        ctx.strokeStyle = Color.Violet.toString();
        ctx.fillText('Trigger', 10, 10);
        bb.debugDraw(ctx);
        ctx.restore();
    };
    return Trigger;
}(Actor));
export { Trigger };
//# sourceMappingURL=Trigger.js.map