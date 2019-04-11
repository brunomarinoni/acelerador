import { RotationType } from './RotationType';
import { Actor } from '../Actor';
import { Promise } from '../Promises';
import { EasingFunction } from '../Util/EasingFunctions';
/**
 * The fluent Action API allows you to perform "actions" on
 * [[Actor|Actors]] such as following, moving, rotating, and
 * more. You can implement your own actions by implementing
 * the [[IAction]] interface.
 *
 * [[include:Actions.md]]
 */
export declare class ActionContext {
    private _actors;
    private _queues;
    constructor();
    constructor(actor: Actor);
    constructor(actors: Actor[]);
    /**
     * Clears all queued actions from the Actor
     */
    clearActions(): void;
    addActorToContext(actor: Actor): void;
    removeActorFromContext(actor: Actor): void;
    /**
     * This method will move an actor to the specified `x` and `y` position over the
     * specified duration using a given [[EasingFunctions]] and return back the actor. This
     * method is part of the actor 'Action' fluent API allowing action chaining.
     * @param x         The x location to move the actor to
     * @param y         The y location to move the actor to
     * @param duration  The time it should take the actor to move to the new location in milliseconds
     * @param easingFcn Use [[EasingFunctions]] or a custom function to use to calculate position
     */
    easeTo(x: number, y: number, duration: number, easingFcn?: EasingFunction): this;
    /**
     * This method will move an actor to the specified x and y position at the
     * speed specified (in pixels per second) and return back the actor. This
     * method is part of the actor 'Action' fluent API allowing action chaining.
     * @param x      The x location to move the actor to
     * @param y      The y location to move the actor to
     * @param speed  The speed in pixels per second to move
     */
    moveTo(x: number, y: number, speed: number): ActionContext;
    /**
     * This method will move an actor to the specified x and y position by a
     * certain time (in milliseconds). This method is part of the actor
     * 'Action' fluent API allowing action chaining.
     * @param x     The x location to move the actor to
     * @param y     The y location to move the actor to
     * @param time  The time it should take the actor to move to the new location in milliseconds
     */
    moveBy(x: number, y: number, time: number): ActionContext;
    /**
     * This method will rotate an actor to the specified angle at the speed
     * specified (in radians per second) and return back the actor. This
     * method is part of the actor 'Action' fluent API allowing action chaining.
     * @param angleRadians  The angle to rotate to in radians
     * @param speed         The angular velocity of the rotation specified in radians per second
     * @param rotationType  The [[RotationType]] to use for this rotation
     */
    rotateTo(angleRadians: number, speed: number, rotationType?: RotationType): ActionContext;
    /**
     * This method will rotate an actor to the specified angle by a certain
     * time (in milliseconds) and return back the actor. This method is part
     * of the actor 'Action' fluent API allowing action chaining.
     * @param angleRadians  The angle to rotate to in radians
     * @param time          The time it should take the actor to complete the rotation in milliseconds
     * @param rotationType  The [[RotationType]] to use for this rotation
     */
    rotateBy(angleRadians: number, time: number, rotationType?: RotationType): ActionContext;
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
    scaleTo(sizeX: number, sizeY: number, speedX: number, speedY: number): ActionContext;
    /**
     * This method will scale an actor to the specified size by a certain time
     * (in milliseconds) and return back the actor. This method is part of the
     * actor 'Action' fluent API allowing action chaining.
     * @param sizeX   The scaling factor to apply on X axis
     * @param sizeY   The scaling factor to apply on Y axis
     * @param time    The time it should take to complete the scaling in milliseconds
     */
    scaleBy(sizeX: number, sizeY: number, time: number): ActionContext;
    /**
     * This method will cause an actor to blink (become visible and not
     * visible). Optionally, you may specify the number of blinks. Specify the amount of time
     * the actor should be visible per blink, and the amount of time not visible.
     * This method is part of the actor 'Action' fluent API allowing action chaining.
     * @param timeVisible     The amount of time to stay visible per blink in milliseconds
     * @param timeNotVisible  The amount of time to stay not visible per blink in milliseconds
     * @param numBlinks       The number of times to blink
     */
    blink(timeVisible: number, timeNotVisible: number, numBlinks?: number): ActionContext;
    /**
     * This method will cause an actor's opacity to change from its current value
     * to the provided value by a specified time (in milliseconds). This method is
     * part of the actor 'Action' fluent API allowing action chaining.
     * @param opacity  The ending opacity
     * @param time     The time it should take to fade the actor (in milliseconds)
     */
    fade(opacity: number, time: number): ActionContext;
    /**
     * This method will delay the next action from executing for a certain
     * amount of time (in milliseconds). This method is part of the actor
     * 'Action' fluent API allowing action chaining.
     * @param time  The amount of time to delay the next action in the queue from executing in milliseconds
     */
    delay(time: number): ActionContext;
    /**
     * This method will add an action to the queue that will remove the actor from the
     * scene once it has completed its previous actions. Any actions on the
     * action queue after this action will not be executed.
     */
    die(): ActionContext;
    /**
     * This method allows you to call an arbitrary method as the next action in the
     * action queue. This is useful if you want to execute code in after a specific
     * action, i.e An actor arrives at a destination after traversing a path
     */
    callMethod(method: () => any): ActionContext;
    /**
     * This method will cause the actor to repeat all of the previously
     * called actions a certain number of times. If the number of repeats
     * is not specified it will repeat forever. This method is part of
     * the actor 'Action' fluent API allowing action chaining
     * @param times  The number of times to repeat all the previous actions in the action queue. If nothing is specified the actions
     * will repeat forever
     */
    repeat(times?: number): ActionContext;
    /**
     * This method will cause the actor to repeat all of the previously
     * called actions forever. This method is part of the actor 'Action'
     * fluent API allowing action chaining.
     */
    repeatForever(): ActionContext;
    /**
     * This method will cause the actor to follow another at a specified distance
     * @param actor           The actor to follow
     * @param followDistance  The distance to maintain when following, if not specified the actor will follow at the current distance.
     */
    follow(actor: Actor, followDistance?: number): ActionContext;
    /**
     * This method will cause the actor to move towards another until they
     * collide "meet" at a specified speed.
     * @param actor  The actor to meet
     * @param speed  The speed in pixels per second to move, if not specified it will match the speed of the other actor
     */
    meet(actor: Actor, speed?: number): ActionContext;
    /**
     * Returns a promise that resolves when the current action queue up to now
     * is finished.
     */
    asPromise<T>(): Promise<T>;
}
