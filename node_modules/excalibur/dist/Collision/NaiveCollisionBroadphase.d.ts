import { Pair } from './Pair';
import { Actor } from './../Actor';
import { CollisionBroadphase } from './CollisionResolver';
export declare class NaiveCollisionBroadphase implements CollisionBroadphase {
    private _lastFramePairs;
    private _lastFramePairsHash;
    track(): void;
    untrack(): void;
    /**
     * Detects potential collision pairs in a broadphase approach with the dynamic aabb tree strategy
     */
    broadphase(targets: Actor[]): Pair[];
    /**
     * Identify actual collisions from those pairs, and calculate collision impulse
     */
    narrowphase(pairs: Pair[]): Pair[];
    runCollisionStartEnd(pairs: Pair[]): void;
    /**
     * Resolve the position and velocity of the physics bodies
     */
    resolve(pairs: Pair[]): Pair[];
    update(): number;
    debugDraw(): void;
}
