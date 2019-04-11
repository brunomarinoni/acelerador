import { Class } from './../Class';
import { GameEvent } from '../Events';
import * as Events from '../Events';
/**
 * Enum representing input key codes
 */
export declare enum Keys {
    Num1 = 97,
    Num2 = 98,
    Num3 = 99,
    Num4 = 100,
    Num5 = 101,
    Num6 = 102,
    Num7 = 103,
    Num8 = 104,
    Num9 = 105,
    Num0 = 96,
    Numlock = 144,
    Semicolon = 186,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    Shift = 16,
    Alt = 18,
    Up = 38,
    Down = 40,
    Left = 37,
    Right = 39,
    Space = 32,
    Esc = 27
}
/**
 * Event thrown on a game object for a key event
 */
export declare class KeyEvent extends GameEvent<any> {
    key: Keys;
    /**
     * @param key  The key responsible for throwing the event
     */
    constructor(key: Keys);
}
/**
 * Provides keyboard support for Excalibur.
 *
 * [[include:Keyboard.md]]
 */
export declare class Keyboard extends Class {
    private _keys;
    private _keysUp;
    private _keysDown;
    constructor();
    on(eventName: Events.press, handler: (event?: KeyEvent) => void): void;
    on(eventName: Events.release, handler: (event?: KeyEvent) => void): void;
    on(eventName: Events.hold, handler: (event?: KeyEvent) => void): void;
    on(eventName: string, handler: (event?: GameEvent<any>) => void): void;
    /**
     * Initialize Keyboard event listeners
     */
    init(global?: GlobalEventHandlers): void;
    update(): void;
    /**
     * Gets list of keys being pressed down
     */
    getKeys(): Keys[];
    /**
     * Tests if a certain key was just pressed this frame. This is cleared at the end of the update frame.
     * @param key Test whether a key was just pressed
     */
    wasPressed(key: Keys): boolean;
    /**
     * Tests if a certain key is held down. This is persisted between frames.
     * @param key  Test whether a key is held down
     */
    isHeld(key: Keys): boolean;
    /**
     * Tests if a certain key was just released this frame. This is cleared at the end of the update frame.
     * @param key  Test whether a key was just released
     */
    wasReleased(key: Keys): boolean;
    /**
     * Normalizes some browser event key codes to map to standard Excalibur key codes
     * @param code Event keyCode
     * @see http://unixpapa.com/js/key.html
     */
    private _normalizeKeyCode;
}
