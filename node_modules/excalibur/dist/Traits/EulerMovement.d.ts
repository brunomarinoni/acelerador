import { Trait } from '../Interfaces/Trait';
import { Actor } from '../Actor';
import { Engine } from '../Engine';
export declare class EulerMovement implements Trait {
    update(actor: Actor, _engine: Engine, delta: number): void;
}
