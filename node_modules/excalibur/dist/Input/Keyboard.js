var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Class } from './../Class';
import { GameEvent } from '../Events';
/**
 * Enum representing input key codes
 */
export var Keys;
(function (Keys) {
    Keys[Keys["Num1"] = 97] = "Num1";
    Keys[Keys["Num2"] = 98] = "Num2";
    Keys[Keys["Num3"] = 99] = "Num3";
    Keys[Keys["Num4"] = 100] = "Num4";
    Keys[Keys["Num5"] = 101] = "Num5";
    Keys[Keys["Num6"] = 102] = "Num6";
    Keys[Keys["Num7"] = 103] = "Num7";
    Keys[Keys["Num8"] = 104] = "Num8";
    Keys[Keys["Num9"] = 105] = "Num9";
    Keys[Keys["Num0"] = 96] = "Num0";
    Keys[Keys["Numlock"] = 144] = "Numlock";
    Keys[Keys["Semicolon"] = 186] = "Semicolon";
    Keys[Keys["A"] = 65] = "A";
    Keys[Keys["B"] = 66] = "B";
    Keys[Keys["C"] = 67] = "C";
    Keys[Keys["D"] = 68] = "D";
    Keys[Keys["E"] = 69] = "E";
    Keys[Keys["F"] = 70] = "F";
    Keys[Keys["G"] = 71] = "G";
    Keys[Keys["H"] = 72] = "H";
    Keys[Keys["I"] = 73] = "I";
    Keys[Keys["J"] = 74] = "J";
    Keys[Keys["K"] = 75] = "K";
    Keys[Keys["L"] = 76] = "L";
    Keys[Keys["M"] = 77] = "M";
    Keys[Keys["N"] = 78] = "N";
    Keys[Keys["O"] = 79] = "O";
    Keys[Keys["P"] = 80] = "P";
    Keys[Keys["Q"] = 81] = "Q";
    Keys[Keys["R"] = 82] = "R";
    Keys[Keys["S"] = 83] = "S";
    Keys[Keys["T"] = 84] = "T";
    Keys[Keys["U"] = 85] = "U";
    Keys[Keys["V"] = 86] = "V";
    Keys[Keys["W"] = 87] = "W";
    Keys[Keys["X"] = 88] = "X";
    Keys[Keys["Y"] = 89] = "Y";
    Keys[Keys["Z"] = 90] = "Z";
    Keys[Keys["Shift"] = 16] = "Shift";
    Keys[Keys["Alt"] = 18] = "Alt";
    Keys[Keys["Up"] = 38] = "Up";
    Keys[Keys["Down"] = 40] = "Down";
    Keys[Keys["Left"] = 37] = "Left";
    Keys[Keys["Right"] = 39] = "Right";
    Keys[Keys["Space"] = 32] = "Space";
    Keys[Keys["Esc"] = 27] = "Esc";
})(Keys || (Keys = {}));
/**
 * Event thrown on a game object for a key event
 */
var KeyEvent = /** @class */ (function (_super) {
    __extends(KeyEvent, _super);
    /**
     * @param key  The key responsible for throwing the event
     */
    function KeyEvent(key) {
        var _this = _super.call(this) || this;
        _this.key = key;
        return _this;
    }
    return KeyEvent;
}(GameEvent));
export { KeyEvent };
/**
 * Provides keyboard support for Excalibur.
 *
 * [[include:Keyboard.md]]
 */
var Keyboard = /** @class */ (function (_super) {
    __extends(Keyboard, _super);
    function Keyboard() {
        var _this = _super.call(this) || this;
        _this._keys = [];
        _this._keysUp = [];
        _this._keysDown = [];
        return _this;
    }
    Keyboard.prototype.on = function (eventName, handler) {
        _super.prototype.on.call(this, eventName, handler);
    };
    /**
     * Initialize Keyboard event listeners
     */
    Keyboard.prototype.init = function (global) {
        var _this = this;
        global = global || window;
        global.addEventListener('blur', function () {
            _this._keys.length = 0; // empties array efficiently
        });
        // key up is on window because canvas cannot have focus
        global.addEventListener('keyup', function (ev) {
            var code = _this._normalizeKeyCode(ev.keyCode);
            var key = _this._keys.indexOf(code);
            _this._keys.splice(key, 1);
            _this._keysUp.push(code);
            var keyEvent = new KeyEvent(code);
            // alias the old api, we may want to deprecate this in the future
            _this.eventDispatcher.emit('up', keyEvent);
            _this.eventDispatcher.emit('release', keyEvent);
        });
        // key down is on window because canvas cannot have focus
        global.addEventListener('keydown', function (ev) {
            var code = _this._normalizeKeyCode(ev.keyCode);
            if (_this._keys.indexOf(code) === -1) {
                _this._keys.push(code);
                _this._keysDown.push(code);
                var keyEvent = new KeyEvent(code);
                _this.eventDispatcher.emit('down', keyEvent);
                _this.eventDispatcher.emit('press', keyEvent);
            }
        });
    };
    Keyboard.prototype.update = function () {
        // Reset keysDown and keysUp after update is complete
        this._keysDown.length = 0;
        this._keysUp.length = 0;
        // Emit synthetic "hold" event
        for (var i = 0; i < this._keys.length; i++) {
            this.eventDispatcher.emit('hold', new KeyEvent(this._keys[i]));
        }
    };
    /**
     * Gets list of keys being pressed down
     */
    Keyboard.prototype.getKeys = function () {
        return this._keys;
    };
    /**
     * Tests if a certain key was just pressed this frame. This is cleared at the end of the update frame.
     * @param key Test whether a key was just pressed
     */
    Keyboard.prototype.wasPressed = function (key) {
        return this._keysDown.indexOf(key) > -1;
    };
    /**
     * Tests if a certain key is held down. This is persisted between frames.
     * @param key  Test whether a key is held down
     */
    Keyboard.prototype.isHeld = function (key) {
        return this._keys.indexOf(key) > -1;
    };
    /**
     * Tests if a certain key was just released this frame. This is cleared at the end of the update frame.
     * @param key  Test whether a key was just released
     */
    Keyboard.prototype.wasReleased = function (key) {
        return this._keysUp.indexOf(key) > -1;
    };
    /**
     * Normalizes some browser event key codes to map to standard Excalibur key codes
     * @param code Event keyCode
     * @see http://unixpapa.com/js/key.html
     */
    Keyboard.prototype._normalizeKeyCode = function (code) {
        switch (code) {
            case 59: // : ; in Firefox, Opera
                return Keys.Semicolon;
            default:
                return code;
        }
    };
    return Keyboard;
}(Class));
export { Keyboard };
//# sourceMappingURL=Keyboard.js.map