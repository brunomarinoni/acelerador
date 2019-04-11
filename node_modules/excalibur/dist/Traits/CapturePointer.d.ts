import { Trait } from '../Interfaces/Trait';
import { Actor } from '../Actor';
import { Engine } from '../Engine';
export interface CapturePointerConfig {
    /**
     * Capture PointerMove events (may be expensive!)
     */
    captureMoveEvents: boolean;
    /**
     * Capture PointerDrag events (may be expensive!)
     */
    captureDragEvents: boolean;
}
/**
 * Revises pointer events path accordingly to the actor
 */
export declare class CapturePointer implements Trait {
    update(actor: Actor, engine: Engine): void;
}
