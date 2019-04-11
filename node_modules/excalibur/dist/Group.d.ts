import { BoundingBox } from './Collision/BoundingBox';
import { GameEvent } from './Events';
import { Vector } from './Algebra';
import { Scene } from './Scene';
import { ActionContext } from './Actions/ActionContext';
import { Actor } from './Actor';
import { Eventable } from './Interfaces/Evented';
import { Actionable } from './Actions/Actionable';
import { Class } from './Class';
/**
 * Groups are used for logically grouping Actors so they can be acted upon
 * in bulk.
 *
 * [[include:Groups.md]]
 */
export declare class Group extends Class implements Actionable, Eventable {
    name: string;
    scene: Scene;
    private _logger;
    private _members;
    actions: ActionContext;
    constructor(name: string, scene: Scene);
    add(actor: Actor): void;
    add(actors: Actor[]): void;
    remove(actor: Actor): void;
    move(vector: Vector): void;
    move(dx: number, dy: number): void;
    rotate(angle: number): void;
    on(eventName: string, handler: (event?: GameEvent<any>) => void): void;
    off(eventName: string, handler?: (event?: GameEvent<any>) => void): void;
    emit(topic: string, event?: GameEvent<any>): void;
    contains(actor: Actor): boolean;
    getMembers(): Actor[];
    getRandomMember(): Actor;
    getBounds(): BoundingBox;
}
