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
import { Vector } from './Algebra';
import { ActionContext } from './Actions/ActionContext';
import { Actor } from './Actor';
import { Logger } from './Util/Log';
import { Class } from './Class';
/**
 * Groups are used for logically grouping Actors so they can be acted upon
 * in bulk.
 *
 * [[include:Groups.md]]
 */
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group(name, scene) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.scene = scene;
        _this._logger = Logger.getInstance();
        _this._members = [];
        _this.actions = new ActionContext();
        if (scene == null) {
            _this._logger.error('Invalid constructor arguments passed to Group: ', name, ', scene must not be null!');
        }
        else {
            var existingGroup = scene.groups[name];
            if (existingGroup) {
                _this._logger.warn('Group with name', name, 'already exists. This new group will replace it.');
            }
            scene.groups[name] = _this;
        }
        return _this;
    }
    Group.prototype.add = function (actorOrActors) {
        if (actorOrActors instanceof Actor) {
            actorOrActors = [].concat(actorOrActors);
        }
        var i = 0, len = actorOrActors.length, groupIdx;
        for (i; i < len; i++) {
            groupIdx = this.getMembers().indexOf(actorOrActors[i]);
            if (groupIdx === -1) {
                this._members.push(actorOrActors[i]);
                this.scene.add(actorOrActors[i]);
                this.actions.addActorToContext(actorOrActors[i]);
                this.eventDispatcher.wire(actorOrActors[i].eventDispatcher);
            }
        }
    };
    Group.prototype.remove = function (actor) {
        var index = this._members.indexOf(actor);
        if (index > -1) {
            this._members.splice(index, 1);
            this.actions.removeActorFromContext(actor);
            this.eventDispatcher.unwire(actor.eventDispatcher);
        }
    };
    Group.prototype.move = function (args) {
        var i = 0, members = this.getMembers(), len = members.length;
        if (arguments.length === 1 && args instanceof Vector) {
            for (i; i < len; i++) {
                members[i].pos.x += args.x;
                members[i].pos.y += args.y;
            }
        }
        else if (typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
            var x = arguments[0];
            var y = arguments[1];
            for (i; i < len; i++) {
                members[i].pos.x += x;
                members[i].pos.y += y;
            }
        }
        else {
            this._logger.error('Invalid arguments passed to group move', this.name, 'args:', arguments);
        }
    };
    Group.prototype.rotate = function (angle) {
        if (typeof angle !== 'number') {
            this._logger.error('Invalid arguments passed to group rotate', this.name, 'args:', arguments);
            return;
        }
        for (var _i = 0, _a = this.getMembers(); _i < _a.length; _i++) {
            var member = _a[_i];
            member.rotation += angle;
        }
    };
    Group.prototype.on = function (eventName, handler) {
        this.eventDispatcher.on(eventName, handler);
    };
    Group.prototype.off = function (eventName, handler) {
        this.eventDispatcher.off(eventName, handler);
    };
    Group.prototype.emit = function (topic, event) {
        this.eventDispatcher.emit(topic, event);
    };
    Group.prototype.contains = function (actor) {
        return this.getMembers().indexOf(actor) > -1;
    };
    Group.prototype.getMembers = function () {
        return this._members;
    };
    Group.prototype.getRandomMember = function () {
        return this._members[Math.floor(Math.random() * this._members.length)];
    };
    Group.prototype.getBounds = function () {
        return this.getMembers()
            .map(function (a) { return a.getBounds(); })
            .reduce(function (prev, curr) {
            return prev.combine(curr);
        });
    };
    return Group;
}(Class));
export { Group };
//# sourceMappingURL=Group.js.map