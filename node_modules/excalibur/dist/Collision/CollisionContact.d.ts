import { CollisionArea } from './CollisionArea';
import { Vector } from '../Algebra';
import { CollisionResolutionStrategy } from '../Physics';
/**
 * Collision contacts are used internally by Excalibur to resolve collision between actors. This
 * Pair prevents collisions from being evaluated more than one time
 */
export declare class CollisionContact {
    /**
     * The id of this collision contact
     */
    id: string;
    /**
     * The first rigid body in the collision
     */
    bodyA: CollisionArea;
    /**
     * The second rigid body in the collision
     */
    bodyB: CollisionArea;
    /**
     * The minimum translation vector to resolve penetration, pointing away from bodyA
     */
    mtv: Vector;
    /**
     * The point of collision shared between bodyA and bodyB
     */
    point: Vector;
    /**
     * The collision normal, pointing away from bodyA
     */
    normal: Vector;
    constructor(bodyA: CollisionArea, bodyB: CollisionArea, mtv: Vector, point: Vector, normal: Vector);
    resolve(strategy: CollisionResolutionStrategy): void;
    private _applyBoxImpulse;
    private _resolveBoxCollision;
    private _resolveRigidBodyCollision;
}
