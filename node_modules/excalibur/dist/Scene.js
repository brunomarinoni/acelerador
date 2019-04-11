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
import { UIActor } from './UIActor';
import { Physics } from './Physics';
import { InitializeEvent, PreUpdateEvent, PostUpdateEvent, PreDrawEvent, PostDrawEvent, PreDebugDrawEvent, PostDebugDrawEvent } from './Events';
import { Logger } from './Util/Log';
import { Timer } from './Timer';
import { DynamicTreeCollisionBroadphase } from './Collision/DynamicTreeCollisionBroadphase';
import { SortedList } from './Util/SortedList';
import { Group } from './Group';
import { TileMap } from './TileMap';
import { Camera } from './Camera';
import { Actor } from './Actor';
import { Class } from './Class';
import * as Util from './Util/Util';
import * as ActorUtils from './Util/Actors';
import { Trigger } from './Trigger';
/**
 * [[Actor|Actors]] are composed together into groupings called Scenes in
 * Excalibur. The metaphor models the same idea behind real world
 * actors in a scene. Only actors in scenes will be updated and drawn.
 *
 * Typical usages of a scene include: levels, menus, loading screens, etc.
 *
 * [[include:Scenes.md]]
 */
var Scene = /** @class */ (function (_super) {
    __extends(Scene, _super);
    function Scene(_engine) {
        var _this = _super.call(this) || this;
        /**
         * The actors in the current scene
         */
        _this.actors = [];
        /**
         * The triggers in the current scene
         */
        _this.triggers = [];
        /**
         * The [[TileMap]]s in the scene, if any
         */
        _this.tileMaps = [];
        /**
         * The [[Group]]s in the scene, if any
         */
        _this.groups = {};
        /**
         * The [[UIActor]]s in a scene, if any; these are drawn last
         */
        _this.uiActors = [];
        _this._isInitialized = false;
        _this._sortedDrawingTree = new SortedList(Actor.prototype.getZIndex);
        _this._broadphase = new DynamicTreeCollisionBroadphase();
        _this._killQueue = [];
        _this._triggerKillQueue = [];
        _this._timers = [];
        _this._cancelQueue = [];
        _this._logger = Logger.getInstance();
        _this.camera = new Camera();
        _this._engine = _engine;
        if (_engine) {
            _this.camera.x = _engine.halfDrawWidth;
            _this.camera.y = _engine.halfDrawHeight;
        }
        return _this;
    }
    Scene.prototype.on = function (eventName, handler) {
        _super.prototype.on.call(this, eventName, handler);
    };
    Scene.prototype.once = function (eventName, handler) {
        _super.prototype.once.call(this, eventName, handler);
    };
    Scene.prototype.off = function (eventName, handler) {
        _super.prototype.off.call(this, eventName, handler);
    };
    /**
     * This is called before the first update of the [[Scene]]. Initializes scene members like the camera. This method is meant to be
     * overridden. This is where initialization of child actors should take place.
     */
    Scene.prototype.onInitialize = function (_engine) {
        // will be overridden
    };
    /**
     * This is called when the scene is made active and started. It is meant to be overriden,
     * this is where you should setup any DOM UI or event handlers needed for the scene.
     */
    Scene.prototype.onActivate = function (_oldScene, _newScene) {
        // will be overridden
    };
    /**
     * This is called when the scene is made transitioned away from and stopped. It is meant to be overriden,
     * this is where you should cleanup any DOM UI or event handlers needed for the scene.
     */
    Scene.prototype.onDeactivate = function (_oldScene, _newScene) {
        // will be overridden
    };
    /**
     * Safe to override onPreUpdate lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPreUpdate` is called directly before a scene is updated.
     */
    Scene.prototype.onPreUpdate = function (_engine, _delta) {
        // will be overridden
    };
    /**
     * Safe to override onPostUpdate lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPostUpdate` is called directly after a scene is updated.
     */
    Scene.prototype.onPostUpdate = function (_engine, _delta) {
        // will be overridden
    };
    /**
     * Safe to override onPreDraw lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPreDraw` is called directly before a scene is drawn.
     */
    Scene.prototype.onPreDraw = function (_ctx, _delta) {
        // will be overridden
    };
    /**
     * Safe to override onPostDraw lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPostDraw` is called directly after a scene is drawn.
     */
    Scene.prototype.onPostDraw = function (_ctx, _delta) {
        // will be overridden
    };
    /**
     * Initializes actors in the scene
     */
    Scene.prototype._initializeChildren = function () {
        for (var _i = 0, _a = this.actors; _i < _a.length; _i++) {
            var child = _a[_i];
            child._initialize(this._engine);
        }
    };
    Object.defineProperty(Scene.prototype, "isInitialized", {
        /**
         * Gets whether or not the [[Scene]] has been initialized
         */
        get: function () {
            return this._isInitialized;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Initializes the scene before the first update, meant to be called by engine not by users of
     * Excalibur
     * @internal
     */
    Scene.prototype._initialize = function (engine) {
        if (!this.isInitialized) {
            this._engine = engine;
            if (this.camera) {
                this.camera.x = engine.halfDrawWidth;
                this.camera.y = engine.halfDrawHeight;
            }
            this._initializeChildren();
            this._logger.debug('Scene.onInitialize', this, engine);
            this.eventDispatcher.emit('initialize', new InitializeEvent(engine, this));
            this.onInitialize.call(this, engine);
            this._isInitialized = true;
        }
    };
    /**
     * It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Activates the scene with the base behavior, then calls the overridable `onActivate` implementation.
     * @internal
     */
    Scene.prototype._activate = function (oldScene, newScene) {
        this._logger.debug('Scene.onActivate', this);
        this.onActivate(oldScene, newScene);
    };
    /**
     * It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Deactivates the scene with the base behavior, then calls the overridable `onDeactivate` implementation.
     * @internal
     */
    Scene.prototype._deactivate = function (oldScene, newScene) {
        this._logger.debug('Scene.onDectivate', this);
        this.onDeactivate(oldScene, newScene);
    };
    /**
     * It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Internal _preupdate handler for [[onPreUpdate]] lifecycle event
     * @internal
     */
    Scene.prototype._preupdate = function (_engine, delta) {
        this.emit('preupdate', new PreUpdateEvent(_engine, delta, this));
        this.onPreUpdate(_engine, delta);
    };
    /**
     *  It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Internal _preupdate handler for [[onPostUpdate]] lifecycle event
     * @internal
     */
    Scene.prototype._postupdate = function (_engine, delta) {
        this.emit('postupdate', new PostUpdateEvent(_engine, delta, this));
        this.onPostUpdate(_engine, delta);
    };
    /**
     * It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Internal _predraw handler for [[onPreDraw]] lifecycle event
     *
     * @internal
     */
    Scene.prototype._predraw = function (_ctx, _delta) {
        this.emit('predraw', new PreDrawEvent(_ctx, _delta, this));
        this.onPreDraw(_ctx, _delta);
    };
    /**
     * It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Internal _postdraw handler for [[onPostDraw]] lifecycle event
     *
     * @internal
     */
    Scene.prototype._postdraw = function (_ctx, _delta) {
        this.emit('postdraw', new PostDrawEvent(_ctx, _delta, this));
        this.onPostDraw(_ctx, _delta);
    };
    /**
     * Updates all the actors and timers in the scene. Called by the [[Engine]].
     * @param engine  Reference to the current Engine
     * @param delta   The number of milliseconds since the last update
     */
    Scene.prototype.update = function (engine, delta) {
        this._preupdate(engine, delta);
        if (this.camera) {
            this.camera.update(engine, delta);
        }
        var i, len;
        // Remove timers in the cancel queue before updating them
        for (i = 0, len = this._cancelQueue.length; i < len; i++) {
            this.removeTimer(this._cancelQueue[i]);
        }
        this._cancelQueue.length = 0;
        // Cycle through timers updating timers
        for (var _i = 0, _a = this._timers; _i < _a.length; _i++) {
            var timer = _a[_i];
            timer.update(delta);
        }
        // Cycle through actors updating UI actors
        for (i = 0, len = this.uiActors.length; i < len; i++) {
            this.uiActors[i].update(engine, delta);
        }
        // Cycle through actors updating tile maps
        for (i = 0, len = this.tileMaps.length; i < len; i++) {
            this.tileMaps[i].update(engine, delta);
        }
        // Cycle through actors updating actors
        for (i = 0, len = this.actors.length; i < len; i++) {
            this.actors[i].update(engine, delta);
        }
        // Cycle through triggers updating
        for (i = 0, len = this.triggers.length; i < len; i++) {
            this.triggers[i].update(engine, delta);
        }
        this._collectActorStats(engine);
        // propagates all events through their paths assigned
        engine.input.pointers.propagate();
        // Run the broadphase and narrowphase
        if (this._broadphase && Physics.enabled) {
            var beforeBroadphase = Date.now();
            this._broadphase.update(this.actors, delta);
            var pairs = this._broadphase.broadphase(this.actors, delta, engine.stats.currFrame);
            var afterBroadphase = Date.now();
            var beforeNarrowphase = Date.now();
            var iter = Physics.collisionPasses;
            var collisionDelta = delta / iter;
            while (iter > 0) {
                // Run the narrowphase
                pairs = this._broadphase.narrowphase(pairs, engine.stats.currFrame);
                // Run collision resolution strategy
                pairs = this._broadphase.resolve(pairs, collisionDelta, Physics.collisionResolutionStrategy);
                this._broadphase.runCollisionStartEnd(pairs);
                iter--;
            }
            var afterNarrowphase = Date.now();
            engine.stats.currFrame.physics.broadphase = afterBroadphase - beforeBroadphase;
            engine.stats.currFrame.physics.narrowphase = afterNarrowphase - beforeNarrowphase;
        }
        engine.stats.currFrame.actors.killed = this._killQueue.length + this._triggerKillQueue.length;
        this._processKillQueue(this._killQueue, this.actors);
        this._processKillQueue(this._triggerKillQueue, this.triggers);
        this._postupdate(engine, delta);
    };
    Scene.prototype._processKillQueue = function (killQueue, collection) {
        // Remove actors from scene graph after being killed
        var actorIndex;
        for (var _i = 0, killQueue_1 = killQueue; _i < killQueue_1.length; _i++) {
            var killed = killQueue_1[_i];
            //don't remove actors that were readded during the same frame they were killed
            if (killed.isKilled()) {
                actorIndex = collection.indexOf(killed);
                if (actorIndex > -1) {
                    this._sortedDrawingTree.removeByComparable(killed);
                    collection.splice(actorIndex, 1);
                }
            }
        }
        killQueue.length = 0;
    };
    /**
     * Draws all the actors in the Scene. Called by the [[Engine]].
     * @param ctx    The current rendering context
     * @param delta  The number of milliseconds since the last draw
     */
    Scene.prototype.draw = function (ctx, delta) {
        this._predraw(ctx, delta);
        ctx.save();
        if (this.camera) {
            this.camera.draw(ctx);
        }
        var i, len;
        for (i = 0, len = this.tileMaps.length; i < len; i++) {
            this.tileMaps[i].draw(ctx, delta);
        }
        var sortedChildren = this._sortedDrawingTree.list();
        for (i = 0, len = sortedChildren.length; i < len; i++) {
            // only draw actors that are visible and on screen
            if (sortedChildren[i].visible && !sortedChildren[i].isOffScreen) {
                sortedChildren[i].draw(ctx, delta);
            }
        }
        if (this._engine && this._engine.isDebug) {
            ctx.strokeStyle = 'yellow';
            this.debugDraw(ctx);
        }
        ctx.restore();
        for (i = 0, len = this.uiActors.length; i < len; i++) {
            // only draw ui actors that are visible and on screen
            if (this.uiActors[i].visible) {
                this.uiActors[i].draw(ctx, delta);
            }
        }
        if (this._engine && this._engine.isDebug) {
            for (i = 0, len = this.uiActors.length; i < len; i++) {
                this.uiActors[i].debugDraw(ctx);
            }
        }
        this._postdraw(ctx, delta);
    };
    /**
     * Draws all the actors' debug information in the Scene. Called by the [[Engine]].
     * @param ctx  The current rendering context
     */
    /* istanbul ignore next */
    Scene.prototype.debugDraw = function (ctx) {
        this.emit('predebugdraw', new PreDebugDrawEvent(ctx, this));
        var i, len;
        for (i = 0, len = this.tileMaps.length; i < len; i++) {
            this.tileMaps[i].debugDraw(ctx);
        }
        for (i = 0, len = this.actors.length; i < len; i++) {
            this.actors[i].debugDraw(ctx);
        }
        for (i = 0, len = this.triggers.length; i < len; i++) {
            this.triggers[i].debugDraw(ctx);
        }
        this._broadphase.debugDraw(ctx, 20);
        this.camera.debugDraw(ctx);
        this.emit('postdebugdraw', new PostDebugDrawEvent(ctx, this));
    };
    /**
     * Checks whether an actor is contained in this scene or not
     */
    Scene.prototype.contains = function (actor) {
        return this.actors.indexOf(actor) > -1;
    };
    Scene.prototype.add = function (entity) {
        if (entity instanceof Actor) {
            entity.unkill();
        }
        if (entity instanceof UIActor) {
            if (!Util.contains(this.uiActors, entity)) {
                this.addUIActor(entity);
            }
            return;
        }
        if (entity instanceof Actor) {
            if (!Util.contains(this.actors, entity)) {
                this._addChild(entity);
            }
            return;
        }
        if (entity instanceof Timer) {
            if (!Util.contains(this._timers, entity)) {
                this.addTimer(entity);
            }
            return;
        }
        if (entity instanceof TileMap) {
            if (!Util.contains(this.tileMaps, entity)) {
                this.addTileMap(entity);
            }
        }
    };
    Scene.prototype.remove = function (entity) {
        if (entity instanceof UIActor) {
            this.removeUIActor(entity);
            return;
        }
        if (entity instanceof Actor) {
            this._removeChild(entity);
        }
        if (entity instanceof Timer) {
            this.removeTimer(entity);
        }
        if (entity instanceof TileMap) {
            this.removeTileMap(entity);
        }
    };
    /**
     * Adds (any) actor to act as a piece of UI, meaning it is always positioned
     * in screen coordinates. UI actors do not participate in collisions.
     * @todo Should this be `UIActor` only?
     */
    Scene.prototype.addUIActor = function (actor) {
        this.uiActors.push(actor);
        actor.scene = this;
    };
    /**
     * Removes an actor as a piece of UI
     */
    Scene.prototype.removeUIActor = function (actor) {
        var index = this.uiActors.indexOf(actor);
        if (index > -1) {
            this.uiActors.splice(index, 1);
        }
    };
    /**
     * Adds an actor to the scene, once this is done the actor will be drawn and updated.
     */
    Scene.prototype._addChild = function (actor) {
        this._broadphase.track(actor.body);
        actor.scene = this;
        if (actor instanceof Trigger) {
            this.triggers.push(actor);
        }
        else {
            this.actors.push(actor);
        }
        this._sortedDrawingTree.add(actor);
    };
    /**
     * Adds a [[TileMap]] to the scene, once this is done the TileMap will be drawn and updated.
     */
    Scene.prototype.addTileMap = function (tileMap) {
        this.tileMaps.push(tileMap);
    };
    /**
     * Removes a [[TileMap]] from the scene, it will no longer be drawn or updated.
     */
    Scene.prototype.removeTileMap = function (tileMap) {
        var index = this.tileMaps.indexOf(tileMap);
        if (index > -1) {
            this.tileMaps.splice(index, 1);
        }
    };
    /**
     * Removes an actor from the scene, it will no longer be drawn or updated.
     */
    Scene.prototype._removeChild = function (actor) {
        if (!Util.contains(this.actors, actor)) {
            return;
        }
        this._broadphase.untrack(actor.body);
        if (actor instanceof Trigger) {
            this._triggerKillQueue.push(actor);
        }
        else {
            if (!actor.isKilled()) {
                actor.kill();
            }
            this._killQueue.push(actor);
        }
        actor.parent = null;
    };
    /**
     * Adds a [[Timer]] to the scene
     * @param timer  The timer to add
     */
    Scene.prototype.addTimer = function (timer) {
        this._timers.push(timer);
        timer.scene = this;
        return timer;
    };
    /**
     * Removes a [[Timer]] from the scene.
     * @warning Can be dangerous, use [[cancelTimer]] instead
     * @param timer  The timer to remove
     */
    Scene.prototype.removeTimer = function (timer) {
        var i = this._timers.indexOf(timer);
        if (i !== -1) {
            this._timers.splice(i, 1);
        }
        return timer;
    };
    /**
     * Cancels a [[Timer]], removing it from the scene nicely
     * @param timer  The timer to cancel
     */
    Scene.prototype.cancelTimer = function (timer) {
        this._cancelQueue.push(timer);
        return timer;
    };
    /**
     * Tests whether a [[Timer]] is active in the scene
     */
    Scene.prototype.isTimerActive = function (timer) {
        return this._timers.indexOf(timer) > -1 && !timer.complete;
    };
    /**
     * Creates and adds a [[Group]] to the scene with a name
     */
    Scene.prototype.createGroup = function (name) {
        return new Group(name, this);
    };
    /**
     * Returns a [[Group]] by name
     */
    Scene.prototype.getGroup = function (name) {
        return this.groups[name];
    };
    Scene.prototype.removeGroup = function (group) {
        if (typeof group === 'string') {
            delete this.groups[group];
        }
        else if (group instanceof Group) {
            delete this.groups[group.name];
        }
        else {
            this._logger.error('Invalid arguments to removeGroup', group);
        }
    };
    /**
     * Removes the given actor from the sorted drawing tree
     */
    Scene.prototype.cleanupDrawTree = function (actor) {
        this._sortedDrawingTree.removeByComparable(actor);
    };
    /**
     * Updates the given actor's position in the sorted drawing tree
     */
    Scene.prototype.updateDrawTree = function (actor) {
        this._sortedDrawingTree.add(actor);
    };
    /**
     * Checks if an actor is in this scene's sorted draw tree
     */
    Scene.prototype.isActorInDrawTree = function (actor) {
        return this._sortedDrawingTree.find(actor);
    };
    Scene.prototype.isCurrentScene = function () {
        if (this._engine) {
            return this._engine.currentScene === this;
        }
        return false;
    };
    Scene.prototype._collectActorStats = function (engine) {
        for (var _i = 0, _a = this.uiActors; _i < _a.length; _i++) {
            var _ui = _a[_i];
            engine.stats.currFrame.actors.ui++;
        }
        for (var _b = 0, _c = this.actors; _b < _c.length; _b++) {
            var actor = _c[_b];
            engine.stats.currFrame.actors.alive++;
            for (var _d = 0, _e = actor.children; _d < _e.length; _d++) {
                var child = _e[_d];
                if (ActorUtils.isUIActor(child)) {
                    engine.stats.currFrame.actors.ui++;
                }
                else {
                    engine.stats.currFrame.actors.alive++;
                }
            }
        }
    };
    return Scene;
}(Class));
export { Scene };
//# sourceMappingURL=Scene.js.map