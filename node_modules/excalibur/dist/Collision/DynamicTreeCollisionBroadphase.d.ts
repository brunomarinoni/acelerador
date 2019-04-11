import { CollisionBroadphase } from './CollisionResolver';
import { Pair } from './Pair';
import { Body } from './Body';
import { Actor } from '../Actor';
import { FrameStats } from '../Debug';
import { CollisionResolutionStrategy } from '../Physics';
export declare class DynamicTreeCollisionBroadphase implements CollisionBroadphase {
    private _dynamicCollisionTree;
    private _collisionHash;
    private _collisionPairCache;
    private _lastFramePairs;
    private _lastFramePairsHash;
    /**
     * Tracks a physics body for collisions
     */
    track(target: Body): void;
    /**
     * Untracks a physics body
     */
    untrack(target: Body): void;
    private _shouldGenerateCollisionPair;
    /**
     * Detects potential collision pairs in a broadphase approach with the dynamic aabb tree strategy
     */
    broadphase(targets: Actor[], delta: number, stats?: FrameStats): Pair[];
    /**
     * Applies narrow phase on collision pairs to find actual area intersections
     * Adds actual colliding pairs to stats' Frame data
     */
    narrowphase(pairs: Pair[], stats?: FrameStats): Pair[];
    /**
     * Perform collision resolution given a strategy (rigid body or box) and move objects out of intersect.
     */
    resolve(pairs: Pair[], delta: number, strategy: CollisionResolutionStrategy): Pair[];
    runCollisionStartEnd(pairs: Pair[]): void;
    /**
     * Update the dynamic tree positions
     */
    update(targets: Actor[]): number;
    debugDraw(ctx: CanvasRenderingContext2D): void;
}
