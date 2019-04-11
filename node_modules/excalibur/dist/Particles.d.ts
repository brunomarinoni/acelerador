import { Engine } from './Engine';
import { Actor } from './Actor';
import { Sprite } from './Drawing/Sprite';
import { Color } from './Drawing/Color';
import { Vector } from './Algebra';
import * as Util from './Util/Util';
import { Random } from './Math/Random';
/**
 * An enum that represents the types of emitter nozzles
 */
export declare enum EmitterType {
    /**
     * Constant for the circular emitter type
     */
    Circle = 0,
    /**
     * Constant for the rectangular emitter type
     */
    Rectangle = 1
}
/**
 * @hidden
 */
export declare class ParticleImpl {
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    particleRotationalVelocity: number;
    currentRotation: number;
    focus: Vector;
    focusAccel: number;
    opacity: number;
    beginColor: Color;
    endColor: Color;
    life: number;
    fadeFlag: boolean;
    private _rRate;
    private _gRate;
    private _bRate;
    private _aRate;
    private _currentColor;
    emitter: ParticleEmitter;
    particleSize: number;
    particleSprite: Sprite;
    startSize: number;
    endSize: number;
    sizeRate: number;
    elapsedMultiplier: number;
    constructor(emitterOrConfig: ParticleEmitter | ParticleArgs, life?: number, opacity?: number, beginColor?: Color, endColor?: Color, position?: Vector, velocity?: Vector, acceleration?: Vector, startSize?: number, endSize?: number);
    kill(): void;
    update(delta: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
/**
 * [[include:Constructors.md]]
 */
export interface ParticleArgs extends Partial<ParticleImpl> {
    emitter: ParticleEmitter;
    position?: Vector;
    velocity?: Vector;
    acceleration?: Vector;
    particleRotationalVelocity?: number;
    currentRotation?: number;
    particleSize?: number;
    particleSprite?: Sprite;
}
declare const Particle_base: typeof ParticleImpl;
/**
 * Particle is used in a [[ParticleEmitter]]
 */
export declare class Particle extends Particle_base {
    constructor(config: ParticleArgs);
    constructor(emitter: ParticleEmitter, life?: number, opacity?: number, beginColor?: Color, endColor?: Color, position?: Vector, velocity?: Vector, acceleration?: Vector, startSize?: number, endSize?: number);
}
/**
 * @hidden
 */
export declare class ParticleEmitterImpl extends Actor {
    private _particlesToEmit;
    numParticles: number;
    /**
     * Random number generator
     */
    random: Random;
    /**
     * Gets or sets the isEmitting flag
     */
    isEmitting: boolean;
    /**
     * Gets or sets the backing particle collection
     */
    particles: Util.Collection<Particle>;
    /**
     * Gets or sets the backing deadParticle collection
     */
    deadParticles: Util.Collection<Particle>;
    /**
     * Gets or sets the minimum particle velocity
     */
    minVel: number;
    /**
     * Gets or sets the maximum particle velocity
     */
    maxVel: number;
    /**
     * Gets or sets the acceleration vector for all particles
     */
    acceleration: Vector;
    /**
     * Gets or sets the minimum angle in radians
     */
    minAngle: number;
    /**
     * Gets or sets the maximum angle in radians
     */
    maxAngle: number;
    /**
     * Gets or sets the emission rate for particles (particles/sec)
     */
    emitRate: number;
    /**
     * Gets or sets the life of each particle in milliseconds
     */
    particleLife: number;
    /**
     * Gets or sets the opacity of each particle from 0 to 1.0
     */
    opacity: number;
    /**
     * Gets or sets the fade flag which causes particles to gradually fade out over the course of their life.
     */
    fadeFlag: boolean;
    /**
     * Gets or sets the optional focus where all particles should accelerate towards
     */
    focus: Vector;
    /**
     * Gets or sets the acceleration for focusing particles if a focus has been specified
     */
    focusAccel: number;
    startSize: number;
    endSize: number;
    /**
     * Gets or sets the minimum size of all particles
     */
    minSize: number;
    /**
     * Gets or sets the maximum size of all particles
     */
    maxSize: number;
    /**
     * Gets or sets the beginning color of all particles
     */
    beginColor: Color;
    /**
     * Gets or sets the ending color of all particles
     */
    endColor: Color;
    /**
     * Gets or sets the sprite that a particle should use
     * @warning Performance intensive
     */
    particleSprite: Sprite;
    /**
     * Gets or sets the emitter type for the particle emitter
     */
    emitterType: EmitterType;
    /**
     * Gets or sets the emitter radius, only takes effect when the [[emitterType]] is [[EmitterType.Circle]]
     */
    radius: number;
    /**
     * Gets or sets the particle rotational speed velocity
     */
    particleRotationalVelocity: number;
    /**
     * Indicates whether particles should start with a random rotation
     */
    randomRotation: boolean;
    /**
     * @param x       The x position of the emitter
     * @param y       The y position of the emitter
     * @param width   The width of the emitter
     * @param height  The height of the emitter
     */
    constructor(xOrConfig?: number | ParticleEmitterArgs, y?: number, width?: number, height?: number);
    removeParticle(particle: Particle): void;
    /**
     * Causes the emitter to emit particles
     * @param particleCount  Number of particles to emit right now
     */
    emitParticles(particleCount: number): void;
    clearParticles(): void;
    private _createParticle;
    update(engine: Engine, delta: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
    debugDraw(ctx: CanvasRenderingContext2D): void;
}
/**
 * [[include:Constructors.md]]
 */
export interface ParticleEmitterArgs extends Partial<ParticleEmitterImpl> {
    width?: number;
    height?: number;
    isEmitting?: boolean;
    minVel?: number;
    maxVel?: number;
    acceleration?: Vector;
    minAngle?: number;
    maxAngle?: number;
    emitRate?: number;
    particleLife?: number;
    opacity?: number;
    fadeFlag?: boolean;
    focus?: Vector;
    focusAccel?: number;
    startSize?: number;
    endSize?: number;
    minSize?: number;
    maxSize?: number;
    beginColor?: Color;
    endColor?: Color;
    particleSprite?: Sprite;
    emitterType?: EmitterType;
    radius?: number;
    particleRotationalVelocity?: number;
    randomRotation?: boolean;
    random?: Random;
}
declare const ParticleEmitter_base: typeof ParticleEmitterImpl;
/**
 * Using a particle emitter is a great way to create interesting effects
 * in your game, like smoke, fire, water, explosions, etc. `ParticleEmitter`
 * extend [[Actor]] allowing you to use all of the features that come with.
 *
 * [[include:Particles.md]]
 */
export declare class ParticleEmitter extends ParticleEmitter_base {
    constructor(config?: ParticleEmitterArgs);
    constructor(x?: number | ParticleEmitterArgs, y?: number, width?: number, height?: number);
}
export {};
