import { Body } from './Body';
import { CollisionContact } from './CollisionContact';
import { Actor } from '../Actor';
import { CollisionResolutionStrategy } from '../Physics';
/**
 * Models a potential collision between 2 bodies
 */
export declare class Pair {
    bodyA: Body;
    bodyB: Body;
    id: string;
    collision: CollisionContact;
    constructor(bodyA: Body, bodyB: Body);
    static canCollide(actorA: Actor, actorB: Actor): boolean;
    /**
     * Returns whether or not it is possible for the pairs to collide
     */
    readonly canCollide: boolean;
    /**
     * Runs the collison intersection logic on the members of this pair
     */
    collide(): void;
    /**
     * Resovles the collision body position and velocity if a collision occured
     */
    resolve(strategy: CollisionResolutionStrategy): void;
    /**
     * Calculates the unique pair hash id for this collision pair
     */
    static calculatePairHash(bodyA: Body, bodyB: Body): string;
    debugDraw(ctx: CanvasRenderingContext2D): void;
}
