import { UIActor } from './UIActor';
import { InitializeEvent, ActivateEvent, DeactivateEvent, PreUpdateEvent, PostUpdateEvent, PreDrawEvent, PostDrawEvent, PreDebugDrawEvent, PostDebugDrawEvent, GameEvent } from './Events';
import { Timer } from './Timer';
import { Engine } from './Engine';
import { Group } from './Group';
import { TileMap } from './TileMap';
import { Camera } from './Camera';
import { Actor } from './Actor';
import { Class } from './Class';
import { CanInitialize, CanActivate, CanDeactivate, CanUpdate, CanDraw } from './Interfaces/LifecycleEvents';
import * as Events from './Events';
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
export declare class Scene extends Class implements CanInitialize, CanActivate, CanDeactivate, CanUpdate, CanDraw {
    /**
     * Gets or sets the current camera for the scene
     */
    camera: Camera;
    /**
     * The actors in the current scene
     */
    actors: Actor[];
    /**
     * The triggers in the current scene
     */
    triggers: Trigger[];
    /**
     * The [[TileMap]]s in the scene, if any
     */
    tileMaps: TileMap[];
    /**
     * The [[Group]]s in the scene, if any
     */
    groups: {
        [key: string]: Group;
    };
    /**
     * Access to the Excalibur engine
     */
    private _engine;
    /**
     * The [[UIActor]]s in a scene, if any; these are drawn last
     */
    uiActors: Actor[];
    private _isInitialized;
    private _sortedDrawingTree;
    private _broadphase;
    private _killQueue;
    private _triggerKillQueue;
    private _timers;
    private _cancelQueue;
    private _logger;
    constructor(_engine: Engine);
    on(eventName: Events.initialize, handler: (event?: InitializeEvent) => void): void;
    on(eventName: Events.activate, handler: (event?: ActivateEvent) => void): void;
    on(eventName: Events.deactivate, handler: (event?: DeactivateEvent) => void): void;
    on(eventName: Events.preupdate, handler: (event?: PreUpdateEvent) => void): void;
    on(eventName: Events.postupdate, handler: (event?: PostUpdateEvent) => void): void;
    on(eventName: Events.predraw, handler: (event?: PreDrawEvent) => void): void;
    on(eventName: Events.postdraw, handler: (event?: PostDrawEvent) => void): void;
    on(eventName: Events.predebugdraw, handler: (event?: PreDebugDrawEvent) => void): void;
    on(eventName: Events.postdebugdraw, handler: (event?: PostDebugDrawEvent) => void): void;
    on(eventName: string, handler: (event?: GameEvent<any>) => void): void;
    once(eventName: Events.initialize, handler: (event?: InitializeEvent) => void): void;
    once(eventName: Events.activate, handler: (event?: ActivateEvent) => void): void;
    once(eventName: Events.deactivate, handler: (event?: DeactivateEvent) => void): void;
    once(eventName: Events.preupdate, handler: (event?: PreUpdateEvent) => void): void;
    once(eventName: Events.postupdate, handler: (event?: PostUpdateEvent) => void): void;
    once(eventName: Events.predraw, handler: (event?: PreDrawEvent) => void): void;
    once(eventName: Events.postdraw, handler: (event?: PostDrawEvent) => void): void;
    once(eventName: Events.predebugdraw, handler: (event?: PreDebugDrawEvent) => void): void;
    once(eventName: Events.postdebugdraw, handler: (event?: PostDebugDrawEvent) => void): void;
    once(eventName: string, handler: (event?: GameEvent<any>) => void): void;
    off(eventName: Events.initialize, handler?: (event?: InitializeEvent) => void): void;
    off(eventName: Events.activate, handler?: (event?: ActivateEvent) => void): void;
    off(eventName: Events.deactivate, handler?: (event?: DeactivateEvent) => void): void;
    off(eventName: Events.preupdate, handler?: (event?: PreUpdateEvent) => void): void;
    off(eventName: Events.postupdate, handler?: (event?: PostUpdateEvent) => void): void;
    off(eventName: Events.predraw, handler?: (event?: PreDrawEvent) => void): void;
    off(eventName: Events.postdraw, handler?: (event?: PostDrawEvent) => void): void;
    off(eventName: Events.predebugdraw, handler?: (event?: PreDebugDrawEvent) => void): void;
    off(eventName: Events.postdebugdraw, handler?: (event?: PostDebugDrawEvent) => void): void;
    off(eventName: string, handler?: (event?: GameEvent<any>) => void): void;
    /**
     * This is called before the first update of the [[Scene]]. Initializes scene members like the camera. This method is meant to be
     * overridden. This is where initialization of child actors should take place.
     */
    onInitialize(_engine: Engine): void;
    /**
     * This is called when the scene is made active and started. It is meant to be overriden,
     * this is where you should setup any DOM UI or event handlers needed for the scene.
     */
    onActivate(_oldScene: Scene, _newScene: Scene): void;
    /**
     * This is called when the scene is made transitioned away from and stopped. It is meant to be overriden,
     * this is where you should cleanup any DOM UI or event handlers needed for the scene.
     */
    onDeactivate(_oldScene: Scene, _newScene: Scene): void;
    /**
     * Safe to override onPreUpdate lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPreUpdate` is called directly before a scene is updated.
     */
    onPreUpdate(_engine: Engine, _delta: number): void;
    /**
     * Safe to override onPostUpdate lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPostUpdate` is called directly after a scene is updated.
     */
    onPostUpdate(_engine: Engine, _delta: number): void;
    /**
     * Safe to override onPreDraw lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPreDraw` is called directly before a scene is drawn.
     */
    onPreDraw(_ctx: CanvasRenderingContext2D, _delta: number): void;
    /**
     * Safe to override onPostDraw lifecycle event handler. Synonymous with `.on('preupdate', (evt) =>{...})`
     *
     * `onPostDraw` is called directly after a scene is drawn.
     */
    onPostDraw(_ctx: CanvasRenderingContext2D, _delta: number): void;
    /**
     * Initializes actors in the scene
     */
    private _initializeChildren;
    /**
     * Gets whether or not the [[Scene]] has been initialized
     */
    readonly isInitialized: boolean;
    /**
     * It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Initializes the scene before the first update, meant to be called by engine not by users of
     * Excalibur
     * @internal
     */
    _initialize(engine: Engine): void;
    /**
     * It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Activates the scene with the base behavior, then calls the overridable `onActivate` implementation.
     * @internal
     */
    _activate(oldScene: Scene, newScene: Scene): void;
    /**
     * It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Deactivates the scene with the base behavior, then calls the overridable `onDeactivate` implementation.
     * @internal
     */
    _deactivate(oldScene: Scene, newScene: Scene): void;
    /**
     * It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Internal _preupdate handler for [[onPreUpdate]] lifecycle event
     * @internal
     */
    _preupdate(_engine: Engine, delta: number): void;
    /**
     *  It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Internal _preupdate handler for [[onPostUpdate]] lifecycle event
     * @internal
     */
    _postupdate(_engine: Engine, delta: number): void;
    /**
     * It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Internal _predraw handler for [[onPreDraw]] lifecycle event
     *
     * @internal
     */
    _predraw(_ctx: CanvasRenderingContext2D, _delta: number): void;
    /**
     * It is not recommended that internal excalibur methods be overriden, do so at your own risk.
     *
     * Internal _postdraw handler for [[onPostDraw]] lifecycle event
     *
     * @internal
     */
    _postdraw(_ctx: CanvasRenderingContext2D, _delta: number): void;
    /**
     * Updates all the actors and timers in the scene. Called by the [[Engine]].
     * @param engine  Reference to the current Engine
     * @param delta   The number of milliseconds since the last update
     */
    update(engine: Engine, delta: number): void;
    private _processKillQueue;
    /**
     * Draws all the actors in the Scene. Called by the [[Engine]].
     * @param ctx    The current rendering context
     * @param delta  The number of milliseconds since the last draw
     */
    draw(ctx: CanvasRenderingContext2D, delta: number): void;
    /**
     * Draws all the actors' debug information in the Scene. Called by the [[Engine]].
     * @param ctx  The current rendering context
     */
    debugDraw(ctx: CanvasRenderingContext2D): void;
    /**
     * Checks whether an actor is contained in this scene or not
     */
    contains(actor: Actor): boolean;
    /**
     * Adds a [[Timer]] to the current [[Scene]].
     * @param timer  The timer to add to the current [[Scene]].
     */
    add(timer: Timer): void;
    /**
     * Adds a [[TileMap]] to the [[Scene]], once this is done the [[TileMap]] will be drawn and updated.
     */
    add(tileMap: TileMap): void;
    /**
     * Adds a [[Trigger]] to the [[Scene]], once this is done the [[Trigger]] will listen for interactions with other actors.
     * @param trigger
     */
    add(trigger: Trigger): void;
    /**
     * Adds an actor to the scene, once this is done the [[Actor]] will be drawn and updated.
     * @param actor  The actor to add to the current scene
     */
    add(actor: Actor): void;
    /**
     * Adds a [[UIActor]] to the scene.
     * @param uiActor  The UIActor to add to the current scene
     */
    add(uiActor: UIActor): void;
    /**
     * Removes a [[Timer]] from the current scene, it will no longer be updated.
     * @param timer  The timer to remove to the current scene.
     */
    remove(timer: Timer): void;
    /**
     * Removes a [[TileMap]] from the scene, it will no longer be drawn or updated.
     * @param tileMap {TileMap}
     */
    remove(tileMap: TileMap): void;
    /**
     * Removes an actor from the scene, it will no longer be drawn or updated.
     * @param actor  The actor to remove from the current scene.
     */
    remove(actor: Actor): void;
    /**
     * Removes a [[UIActor]] to the scene, it will no longer be drawn or updated
     * @param uiActor  The UIActor to remove from the current scene
     */
    remove(uiActor: UIActor): void;
    /**
     * Adds (any) actor to act as a piece of UI, meaning it is always positioned
     * in screen coordinates. UI actors do not participate in collisions.
     * @todo Should this be `UIActor` only?
     */
    addUIActor(actor: Actor): void;
    /**
     * Removes an actor as a piece of UI
     */
    removeUIActor(actor: Actor): void;
    /**
     * Adds an actor to the scene, once this is done the actor will be drawn and updated.
     */
    protected _addChild(actor: Actor): void;
    /**
     * Adds a [[TileMap]] to the scene, once this is done the TileMap will be drawn and updated.
     */
    addTileMap(tileMap: TileMap): void;
    /**
     * Removes a [[TileMap]] from the scene, it will no longer be drawn or updated.
     */
    removeTileMap(tileMap: TileMap): void;
    /**
     * Removes an actor from the scene, it will no longer be drawn or updated.
     */
    protected _removeChild(actor: Actor): void;
    /**
     * Adds a [[Timer]] to the scene
     * @param timer  The timer to add
     */
    addTimer(timer: Timer): Timer;
    /**
     * Removes a [[Timer]] from the scene.
     * @warning Can be dangerous, use [[cancelTimer]] instead
     * @param timer  The timer to remove
     */
    removeTimer(timer: Timer): Timer;
    /**
     * Cancels a [[Timer]], removing it from the scene nicely
     * @param timer  The timer to cancel
     */
    cancelTimer(timer: Timer): Timer;
    /**
     * Tests whether a [[Timer]] is active in the scene
     */
    isTimerActive(timer: Timer): boolean;
    /**
     * Creates and adds a [[Group]] to the scene with a name
     */
    createGroup(name: string): Group;
    /**
     * Returns a [[Group]] by name
     */
    getGroup(name: string): Group;
    /**
     * Removes a [[Group]] by name
     */
    removeGroup(name: string): void;
    /**
     * Removes a [[Group]] by reference
     */
    removeGroup(group: Group): void;
    /**
     * Removes the given actor from the sorted drawing tree
     */
    cleanupDrawTree(actor: Actor): void;
    /**
     * Updates the given actor's position in the sorted drawing tree
     */
    updateDrawTree(actor: Actor): void;
    /**
     * Checks if an actor is in this scene's sorted draw tree
     */
    isActorInDrawTree(actor: Actor): boolean;
    isCurrentScene(): boolean;
    private _collectActorStats;
}
