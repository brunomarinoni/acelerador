import { CullingBox } from './../Util/CullingBox';
import { Trait } from '../Interfaces/Trait';
import { Actor } from '../Actor';
import { Engine } from '../Engine';
export declare class OffscreenCulling implements Trait {
    cullingBox: CullingBox;
    update(actor: Actor, engine: Engine): void;
}
