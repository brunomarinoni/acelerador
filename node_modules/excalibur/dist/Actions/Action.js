import { RotationType } from './RotationType';
import { Vector } from '../Algebra';
import { Logger } from '../Util/Log';
import * as Util from '../Util/Util';
var EaseTo = /** @class */ (function () {
    function EaseTo(actor, x, y, duration, easingFcn) {
        this.actor = actor;
        this.easingFcn = easingFcn;
        this._currentLerpTime = 0;
        this._lerpDuration = 1 * 1000; // 1 second
        this._lerpStart = new Vector(0, 0);
        this._lerpEnd = new Vector(0, 0);
        this._initialized = false;
        this._stopped = false;
        this._distance = 0;
        this._lerpDuration = duration;
        this._lerpEnd = new Vector(x, y);
    }
    EaseTo.prototype._initialize = function () {
        this._lerpStart = new Vector(this.actor.pos.x, this.actor.pos.y);
        this._currentLerpTime = 0;
        this._distance = this._lerpStart.distance(this._lerpEnd);
    };
    EaseTo.prototype.update = function (delta) {
        if (!this._initialized) {
            this._initialize();
            this._initialized = true;
        }
        var newX = this.actor.pos.x;
        var newY = this.actor.pos.y;
        if (this._currentLerpTime < this._lerpDuration) {
            if (this._lerpEnd.x < this._lerpStart.x) {
                newX =
                    this._lerpStart.x -
                        (this.easingFcn(this._currentLerpTime, this._lerpEnd.x, this._lerpStart.x, this._lerpDuration) - this._lerpEnd.x);
            }
            else {
                newX = this.easingFcn(this._currentLerpTime, this._lerpStart.x, this._lerpEnd.x, this._lerpDuration);
            }
            if (this._lerpEnd.y < this._lerpStart.y) {
                newY =
                    this._lerpStart.y -
                        (this.easingFcn(this._currentLerpTime, this._lerpEnd.y, this._lerpStart.y, this._lerpDuration) - this._lerpEnd.y);
            }
            else {
                newY = this.easingFcn(this._currentLerpTime, this._lerpStart.y, this._lerpEnd.y, this._lerpDuration);
            }
            this.actor.pos.x = newX;
            this.actor.pos.y = newY;
            this._currentLerpTime += delta;
        }
        else {
            this.actor.pos.x = this._lerpEnd.x;
            this.actor.pos.y = this._lerpEnd.y;
            //this._lerpStart = null;
            //this._lerpEnd = null;
            //this._currentLerpTime = 0;
        }
    };
    EaseTo.prototype.isComplete = function (actor) {
        return this._stopped || new Vector(actor.pos.x, actor.pos.y).distance(this._lerpStart) >= this._distance;
    };
    EaseTo.prototype.reset = function () {
        this._initialized = false;
    };
    EaseTo.prototype.stop = function () {
        this._stopped = true;
    };
    return EaseTo;
}());
export { EaseTo };
var MoveTo = /** @class */ (function () {
    function MoveTo(actor, destx, desty, speed) {
        this._started = false;
        this._stopped = false;
        this._actor = actor;
        this._end = new Vector(destx, desty);
        this._speed = speed;
    }
    MoveTo.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._start = new Vector(this._actor.pos.x, this._actor.pos.y);
            this._distance = this._start.distance(this._end);
            this._dir = this._end.sub(this._start).normalize();
        }
        var m = this._dir.scale(this._speed);
        this._actor.vel.x = m.x;
        this._actor.vel.y = m.y;
        if (this.isComplete(this._actor)) {
            this._actor.pos.x = this._end.x;
            this._actor.pos.y = this._end.y;
            this._actor.vel.y = 0;
            this._actor.vel.x = 0;
        }
    };
    MoveTo.prototype.isComplete = function (actor) {
        return this._stopped || new Vector(actor.pos.x, actor.pos.y).distance(this._start) >= this._distance;
    };
    MoveTo.prototype.stop = function () {
        this._actor.vel.y = 0;
        this._actor.vel.x = 0;
        this._stopped = true;
    };
    MoveTo.prototype.reset = function () {
        this._started = false;
    };
    return MoveTo;
}());
export { MoveTo };
var MoveBy = /** @class */ (function () {
    function MoveBy(actor, destx, desty, time) {
        this._started = false;
        this._stopped = false;
        this._actor = actor;
        this._end = new Vector(destx, desty);
        if (time <= 0) {
            Logger.getInstance().error('Attempted to moveBy time less than or equal to zero : ' + time);
            throw new Error('Cannot move in time <= 0');
        }
        this._time = time;
    }
    MoveBy.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._start = new Vector(this._actor.pos.x, this._actor.pos.y);
            this._distance = this._start.distance(this._end);
            this._dir = this._end.sub(this._start).normalize();
            this._speed = this._distance / (this._time / 1000);
        }
        var m = this._dir.scale(this._speed);
        this._actor.vel.x = m.x;
        this._actor.vel.y = m.y;
        if (this.isComplete(this._actor)) {
            this._actor.pos.x = this._end.x;
            this._actor.pos.y = this._end.y;
            this._actor.vel.y = 0;
            this._actor.vel.x = 0;
        }
    };
    MoveBy.prototype.isComplete = function (actor) {
        return this._stopped || new Vector(actor.pos.x, actor.pos.y).distance(this._start) >= this._distance;
    };
    MoveBy.prototype.stop = function () {
        this._actor.vel.y = 0;
        this._actor.vel.x = 0;
        this._stopped = true;
    };
    MoveBy.prototype.reset = function () {
        this._started = false;
    };
    return MoveBy;
}());
export { MoveBy };
var Follow = /** @class */ (function () {
    function Follow(actor, actorToFollow, followDistance) {
        this._started = false;
        this._stopped = false;
        this._actor = actor;
        this._actorToFollow = actorToFollow;
        this._current = new Vector(this._actor.pos.x, this._actor.pos.y);
        this._end = new Vector(actorToFollow.pos.x, actorToFollow.pos.y);
        this._maximumDistance = followDistance !== undefined ? followDistance : this._current.distance(this._end);
        this._speed = 0;
    }
    Follow.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._distanceBetween = this._current.distance(this._end);
            this._dir = this._end.sub(this._current).normalize();
        }
        var actorToFollowSpeed = Math.sqrt(Math.pow(this._actorToFollow.vel.x, 2) + Math.pow(this._actorToFollow.vel.y, 2));
        if (actorToFollowSpeed !== 0) {
            this._speed = actorToFollowSpeed;
        }
        this._current.x = this._actor.pos.x;
        this._current.y = this._actor.pos.y;
        this._end.x = this._actorToFollow.pos.x;
        this._end.y = this._actorToFollow.pos.y;
        this._distanceBetween = this._current.distance(this._end);
        this._dir = this._end.sub(this._current).normalize();
        if (this._distanceBetween >= this._maximumDistance) {
            var m = this._dir.scale(this._speed);
            this._actor.vel.x = m.x;
            this._actor.vel.y = m.y;
        }
        else {
            this._actor.vel.x = 0;
            this._actor.vel.y = 0;
        }
        if (this.isComplete()) {
            this._actor.pos.x = this._end.x;
            this._actor.pos.y = this._end.y;
            this._actor.vel.y = 0;
            this._actor.vel.x = 0;
        }
    };
    Follow.prototype.stop = function () {
        this._actor.vel.y = 0;
        this._actor.vel.x = 0;
        this._stopped = true;
    };
    Follow.prototype.isComplete = function () {
        // the actor following should never stop unless specified to do so
        return this._stopped;
    };
    Follow.prototype.reset = function () {
        this._started = false;
    };
    return Follow;
}());
export { Follow };
var Meet = /** @class */ (function () {
    function Meet(actor, actorToMeet, speed) {
        this._started = false;
        this._stopped = false;
        this._speedWasSpecified = false;
        this._actor = actor;
        this._actorToMeet = actorToMeet;
        this._current = new Vector(this._actor.pos.x, this._actor.pos.y);
        this._end = new Vector(actorToMeet.pos.x, actorToMeet.pos.y);
        this._speed = speed || 0;
        if (speed !== undefined) {
            this._speedWasSpecified = true;
        }
    }
    Meet.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._distanceBetween = this._current.distance(this._end);
            this._dir = this._end.sub(this._current).normalize();
        }
        var actorToMeetSpeed = Math.sqrt(Math.pow(this._actorToMeet.vel.x, 2) + Math.pow(this._actorToMeet.vel.y, 2));
        if (actorToMeetSpeed !== 0 && !this._speedWasSpecified) {
            this._speed = actorToMeetSpeed;
        }
        this._current.x = this._actor.pos.x;
        this._current.y = this._actor.pos.y;
        this._end.x = this._actorToMeet.pos.x;
        this._end.y = this._actorToMeet.pos.y;
        this._distanceBetween = this._current.distance(this._end);
        this._dir = this._end.sub(this._current).normalize();
        var m = this._dir.scale(this._speed);
        this._actor.vel.x = m.x;
        this._actor.vel.y = m.y;
        if (this.isComplete()) {
            this._actor.pos.x = this._end.x;
            this._actor.pos.y = this._end.y;
            this._actor.vel.y = 0;
            this._actor.vel.x = 0;
        }
    };
    Meet.prototype.isComplete = function () {
        return this._stopped || this._distanceBetween <= 1;
    };
    Meet.prototype.stop = function () {
        this._actor.vel.y = 0;
        this._actor.vel.x = 0;
        this._stopped = true;
    };
    Meet.prototype.reset = function () {
        this._started = false;
    };
    return Meet;
}());
export { Meet };
var RotateTo = /** @class */ (function () {
    function RotateTo(actor, angleRadians, speed, rotationType) {
        this._started = false;
        this._stopped = false;
        this._actor = actor;
        this._end = angleRadians;
        this._speed = speed;
        this._rotationType = rotationType || RotationType.ShortestPath;
    }
    RotateTo.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._start = this._actor.rotation;
            var distance1 = Math.abs(this._end - this._start);
            var distance2 = Util.TwoPI - distance1;
            if (distance1 > distance2) {
                this._shortDistance = distance2;
                this._longDistance = distance1;
            }
            else {
                this._shortDistance = distance1;
                this._longDistance = distance2;
            }
            this._shortestPathIsPositive = (this._start - this._end + Util.TwoPI) % Util.TwoPI >= Math.PI;
            switch (this._rotationType) {
                case RotationType.ShortestPath:
                    this._distance = this._shortDistance;
                    if (this._shortestPathIsPositive) {
                        this._direction = 1;
                    }
                    else {
                        this._direction = -1;
                    }
                    break;
                case RotationType.LongestPath:
                    this._distance = this._longDistance;
                    if (this._shortestPathIsPositive) {
                        this._direction = -1;
                    }
                    else {
                        this._direction = 1;
                    }
                    break;
                case RotationType.Clockwise:
                    this._direction = 1;
                    if (this._shortestPathIsPositive) {
                        this._distance = this._shortDistance;
                    }
                    else {
                        this._distance = this._longDistance;
                    }
                    break;
                case RotationType.CounterClockwise:
                    this._direction = -1;
                    if (!this._shortestPathIsPositive) {
                        this._distance = this._shortDistance;
                    }
                    else {
                        this._distance = this._longDistance;
                    }
                    break;
            }
        }
        this._actor.rx = this._direction * this._speed;
        if (this.isComplete()) {
            this._actor.rotation = this._end;
            this._actor.rx = 0;
            this._stopped = true;
        }
    };
    RotateTo.prototype.isComplete = function () {
        var distanceTravelled = Math.abs(this._actor.rotation - this._start);
        return this._stopped || distanceTravelled >= Math.abs(this._distance);
    };
    RotateTo.prototype.stop = function () {
        this._actor.rx = 0;
        this._stopped = true;
    };
    RotateTo.prototype.reset = function () {
        this._started = false;
    };
    return RotateTo;
}());
export { RotateTo };
var RotateBy = /** @class */ (function () {
    function RotateBy(actor, angleRadians, time, rotationType) {
        this._started = false;
        this._stopped = false;
        this._actor = actor;
        this._end = angleRadians;
        this._time = time;
        this._rotationType = rotationType || RotationType.ShortestPath;
    }
    RotateBy.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._start = this._actor.rotation;
            var distance1 = Math.abs(this._end - this._start);
            var distance2 = Util.TwoPI - distance1;
            if (distance1 > distance2) {
                this._shortDistance = distance2;
                this._longDistance = distance1;
            }
            else {
                this._shortDistance = distance1;
                this._longDistance = distance2;
            }
            this._shortestPathIsPositive = (this._start - this._end + Util.TwoPI) % Util.TwoPI >= Math.PI;
            switch (this._rotationType) {
                case RotationType.ShortestPath:
                    this._distance = this._shortDistance;
                    if (this._shortestPathIsPositive) {
                        this._direction = 1;
                    }
                    else {
                        this._direction = -1;
                    }
                    break;
                case RotationType.LongestPath:
                    this._distance = this._longDistance;
                    if (this._shortestPathIsPositive) {
                        this._direction = -1;
                    }
                    else {
                        this._direction = 1;
                    }
                    break;
                case RotationType.Clockwise:
                    this._direction = 1;
                    if (this._shortDistance >= 0) {
                        this._distance = this._shortDistance;
                    }
                    else {
                        this._distance = this._longDistance;
                    }
                    break;
                case RotationType.CounterClockwise:
                    this._direction = -1;
                    if (this._shortDistance <= 0) {
                        this._distance = this._shortDistance;
                    }
                    else {
                        this._distance = this._longDistance;
                    }
                    break;
            }
            this._speed = Math.abs((this._distance / this._time) * 1000);
        }
        this._actor.rx = this._direction * this._speed;
        if (this.isComplete()) {
            this._actor.rotation = this._end;
            this._actor.rx = 0;
            this._stopped = true;
        }
    };
    RotateBy.prototype.isComplete = function () {
        var distanceTravelled = Math.abs(this._actor.rotation - this._start);
        return this._stopped || distanceTravelled >= Math.abs(this._distance);
    };
    RotateBy.prototype.stop = function () {
        this._actor.rx = 0;
        this._stopped = true;
    };
    RotateBy.prototype.reset = function () {
        this._started = false;
    };
    return RotateBy;
}());
export { RotateBy };
var ScaleTo = /** @class */ (function () {
    function ScaleTo(actor, scaleX, scaleY, speedX, speedY) {
        this._started = false;
        this._stopped = false;
        this._actor = actor;
        this._endX = scaleX;
        this._endY = scaleY;
        this._speedX = speedX;
        this._speedY = speedY;
    }
    ScaleTo.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._startX = this._actor.scale.x;
            this._startY = this._actor.scale.y;
            this._distanceX = Math.abs(this._endX - this._startX);
            this._distanceY = Math.abs(this._endY - this._startY);
        }
        if (!(Math.abs(this._actor.scale.x - this._startX) >= this._distanceX)) {
            var directionX = this._endY < this._startY ? -1 : 1;
            this._actor.sx = this._speedX * directionX;
        }
        else {
            this._actor.sx = 0;
        }
        if (!(Math.abs(this._actor.scale.y - this._startY) >= this._distanceY)) {
            var directionY = this._endY < this._startY ? -1 : 1;
            this._actor.sy = this._speedY * directionY;
        }
        else {
            this._actor.sy = 0;
        }
        if (this.isComplete()) {
            this._actor.scale.x = this._endX;
            this._actor.scale.y = this._endY;
            this._actor.sx = 0;
            this._actor.sy = 0;
        }
    };
    ScaleTo.prototype.isComplete = function () {
        return (this._stopped ||
            (Math.abs(this._actor.scale.y - this._startX) >= this._distanceX && Math.abs(this._actor.scale.y - this._startY) >= this._distanceY));
    };
    ScaleTo.prototype.stop = function () {
        this._actor.sx = 0;
        this._actor.sy = 0;
        this._stopped = true;
    };
    ScaleTo.prototype.reset = function () {
        this._started = false;
    };
    return ScaleTo;
}());
export { ScaleTo };
var ScaleBy = /** @class */ (function () {
    function ScaleBy(actor, scaleX, scaleY, time) {
        this._started = false;
        this._stopped = false;
        this._actor = actor;
        this._endX = scaleX;
        this._endY = scaleY;
        this._speedX = ((this._endX - this._actor.scale.x) / time) * 1000;
        this._speedY = ((this._endY - this._actor.scale.y) / time) * 1000;
    }
    ScaleBy.prototype.update = function (_delta) {
        if (!this._started) {
            this._started = true;
            this._startX = this._actor.scale.x;
            this._startY = this._actor.scale.y;
            this._distanceX = Math.abs(this._endX - this._startX);
            this._distanceY = Math.abs(this._endY - this._startY);
        }
        var directionX = this._endX < this._startX ? -1 : 1;
        var directionY = this._endY < this._startY ? -1 : 1;
        this._actor.sx = this._speedX * directionX;
        this._actor.sy = this._speedY * directionY;
        if (this.isComplete()) {
            this._actor.scale.x = this._endX;
            this._actor.scale.y = this._endY;
            this._actor.sx = 0;
            this._actor.sy = 0;
        }
    };
    ScaleBy.prototype.isComplete = function () {
        return (this._stopped ||
            (Math.abs(this._actor.scale.x - this._startX) >= this._distanceX && Math.abs(this._actor.scale.y - this._startY) >= this._distanceY));
    };
    ScaleBy.prototype.stop = function () {
        this._actor.sx = 0;
        this._actor.sy = 0;
        this._stopped = true;
    };
    ScaleBy.prototype.reset = function () {
        this._started = false;
    };
    return ScaleBy;
}());
export { ScaleBy };
var Delay = /** @class */ (function () {
    function Delay(actor, delay) {
        this._elapsedTime = 0;
        this._started = false;
        this._stopped = false;
        this._actor = actor;
        this._delay = delay;
    }
    Delay.prototype.update = function (delta) {
        if (!this._started) {
            this._started = true;
        }
        this.x = this._actor.pos.x;
        this.y = this._actor.pos.y;
        this._elapsedTime += delta;
    };
    Delay.prototype.isComplete = function () {
        return this._stopped || this._elapsedTime >= this._delay;
    };
    Delay.prototype.stop = function () {
        this._stopped = true;
    };
    Delay.prototype.reset = function () {
        this._elapsedTime = 0;
        this._started = false;
    };
    return Delay;
}());
export { Delay };
var Blink = /** @class */ (function () {
    function Blink(actor, timeVisible, timeNotVisible, numBlinks) {
        if (numBlinks === void 0) { numBlinks = 1; }
        this._timeVisible = 0;
        this._timeNotVisible = 0;
        this._elapsedTime = 0;
        this._totalTime = 0;
        this._stopped = false;
        this._started = false;
        this._actor = actor;
        this._timeVisible = timeVisible;
        this._timeNotVisible = timeNotVisible;
        this._duration = (timeVisible + timeNotVisible) * numBlinks;
    }
    Blink.prototype.update = function (delta) {
        if (!this._started) {
            this._started = true;
        }
        this._elapsedTime += delta;
        this._totalTime += delta;
        if (this._actor.visible && this._elapsedTime >= this._timeVisible) {
            this._actor.visible = false;
            this._elapsedTime = 0;
        }
        if (!this._actor.visible && this._elapsedTime >= this._timeNotVisible) {
            this._actor.visible = true;
            this._elapsedTime = 0;
        }
        if (this.isComplete()) {
            this._actor.visible = true;
        }
    };
    Blink.prototype.isComplete = function () {
        return this._stopped || this._totalTime >= this._duration;
    };
    Blink.prototype.stop = function () {
        this._actor.visible = true;
        this._stopped = true;
    };
    Blink.prototype.reset = function () {
        this._started = false;
        this._elapsedTime = 0;
        this._totalTime = 0;
    };
    return Blink;
}());
export { Blink };
var Fade = /** @class */ (function () {
    function Fade(actor, endOpacity, speed) {
        this._multiplier = 1;
        this._started = false;
        this._stopped = false;
        this._actor = actor;
        this._endOpacity = endOpacity;
        this._speed = speed;
    }
    Fade.prototype.update = function (delta) {
        if (!this._started) {
            this._started = true;
            // determine direction when we start
            if (this._endOpacity < this._actor.opacity) {
                this._multiplier = -1;
            }
            else {
                this._multiplier = 1;
            }
        }
        if (this._speed > 0) {
            this._actor.opacity += (this._multiplier * (Math.abs(this._actor.opacity - this._endOpacity) * delta)) / this._speed;
        }
        this._speed -= delta;
        if (this.isComplete()) {
            this._actor.opacity = this._endOpacity;
        }
        Logger.getInstance().debug('[Action fade] Actor opacity:', this._actor.opacity);
    };
    Fade.prototype.isComplete = function () {
        return this._stopped || Math.abs(this._actor.opacity - this._endOpacity) < 0.05;
    };
    Fade.prototype.stop = function () {
        this._stopped = true;
    };
    Fade.prototype.reset = function () {
        this._started = false;
    };
    return Fade;
}());
export { Fade };
var Die = /** @class */ (function () {
    function Die(actor) {
        this._stopped = false;
        this._actor = actor;
    }
    Die.prototype.update = function (_delta) {
        this._actor.actionQueue.clearActions();
        this._actor.kill();
        this._stopped = true;
    };
    Die.prototype.isComplete = function () {
        return this._stopped;
    };
    Die.prototype.stop = function () {
        return;
    };
    Die.prototype.reset = function () {
        return;
    };
    return Die;
}());
export { Die };
var CallMethod = /** @class */ (function () {
    function CallMethod(actor, method) {
        this._method = null;
        this._actor = null;
        this._hasBeenCalled = false;
        this._actor = actor;
        this._method = method;
    }
    CallMethod.prototype.update = function (_delta) {
        this._method.call(this._actor);
        this._hasBeenCalled = true;
    };
    CallMethod.prototype.isComplete = function () {
        return this._hasBeenCalled;
    };
    CallMethod.prototype.reset = function () {
        this._hasBeenCalled = false;
    };
    CallMethod.prototype.stop = function () {
        this._hasBeenCalled = true;
    };
    return CallMethod;
}());
export { CallMethod };
var Repeat = /** @class */ (function () {
    function Repeat(actor, repeat, actions) {
        this._stopped = false;
        this._actor = actor;
        this._actionQueue = new ActionQueue(actor);
        this._repeat = repeat;
        this._originalRepeat = repeat;
        var i = 0, len = actions.length;
        for (i; i < len; i++) {
            actions[i].reset();
            this._actionQueue.add(actions[i]);
        }
    }
    Repeat.prototype.update = function (delta) {
        this.x = this._actor.pos.x;
        this.y = this._actor.pos.y;
        if (!this._actionQueue.hasNext()) {
            this._actionQueue.reset();
            this._repeat--;
        }
        this._actionQueue.update(delta);
    };
    Repeat.prototype.isComplete = function () {
        return this._stopped || this._repeat <= 0;
    };
    Repeat.prototype.stop = function () {
        this._stopped = true;
    };
    Repeat.prototype.reset = function () {
        this._repeat = this._originalRepeat;
    };
    return Repeat;
}());
export { Repeat };
var RepeatForever = /** @class */ (function () {
    function RepeatForever(actor, actions) {
        this._stopped = false;
        this._actor = actor;
        this._actionQueue = new ActionQueue(actor);
        var i = 0, len = actions.length;
        for (i; i < len; i++) {
            actions[i].reset();
            this._actionQueue.add(actions[i]);
        }
    }
    RepeatForever.prototype.update = function (delta) {
        this.x = this._actor.pos.x;
        this.y = this._actor.pos.y;
        if (this._stopped) {
            return;
        }
        if (!this._actionQueue.hasNext()) {
            this._actionQueue.reset();
        }
        this._actionQueue.update(delta);
    };
    RepeatForever.prototype.isComplete = function () {
        return this._stopped;
    };
    RepeatForever.prototype.stop = function () {
        this._stopped = true;
        this._actionQueue.clearActions();
    };
    RepeatForever.prototype.reset = function () {
        return;
    };
    return RepeatForever;
}());
export { RepeatForever };
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
var ActionQueue = /** @class */ (function () {
    function ActionQueue(actor) {
        this._actions = [];
        this._completedActions = [];
        this._actor = actor;
    }
    ActionQueue.prototype.add = function (action) {
        this._actions.push(action);
    };
    ActionQueue.prototype.remove = function (action) {
        var index = this._actions.indexOf(action);
        this._actions.splice(index, 1);
    };
    ActionQueue.prototype.clearActions = function () {
        this._actions.length = 0;
        this._completedActions.length = 0;
        if (this._currentAction) {
            this._currentAction.stop();
        }
    };
    ActionQueue.prototype.getActions = function () {
        return this._actions.concat(this._completedActions);
    };
    ActionQueue.prototype.hasNext = function () {
        return this._actions.length > 0;
    };
    ActionQueue.prototype.reset = function () {
        this._actions = this.getActions();
        var i = 0, len = this._actions.length;
        for (i; i < len; i++) {
            this._actions[i].reset();
        }
        this._completedActions = [];
    };
    ActionQueue.prototype.update = function (delta) {
        if (this._actions.length > 0) {
            this._currentAction = this._actions[0];
            this._currentAction.update(delta);
            if (this._currentAction.isComplete(this._actor)) {
                this._completedActions.push(this._actions.shift());
            }
        }
    };
    return ActionQueue;
}());
export { ActionQueue };
//# sourceMappingURL=Action.js.map