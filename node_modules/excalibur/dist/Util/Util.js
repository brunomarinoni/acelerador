import { Vector } from '../Algebra';
import { Random } from '../Math/Random';
import { Side } from '../Collision/Side';
/**
 * Two PI constant
 */
export var TwoPI = Math.PI * 2;
/**
 * Merges one or more objects into a single target object
 *
 * @returns Merged object with properties from other objects
 * @credit https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
 */
export function extend() {
    var extended = {};
    var deep = false;
    var i = 0;
    var length = arguments.length;
    // Check if a deep merge
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
        deep = arguments[0];
        i++;
    }
    // Merge the object into the extended object
    var assignExists = typeof Object.assign === 'function';
    var merge = null;
    if (!assignExists) {
        merge = function (obj) {
            for (var prop in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                    // If deep merge and property is an object, merge properties
                    if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                        extended[prop] = extend(true, extended[prop], obj[prop]);
                    }
                    else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };
    }
    else {
        merge = Object.assign;
    }
    // Loop through each object and conduct a merge
    for (; i < length; i++) {
        var obj = arguments[i];
        if (!assignExists) {
            merge(obj);
        }
        else {
            merge(extended, obj);
        }
    }
    return extended;
}
export function base64Encode(inputStr) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var outputStr = '';
    var i = 0;
    while (i < inputStr.length) {
        //all three "& 0xff" added below are there to fix a known bug
        //with bytes returned by xhr.responseText
        var byte1 = inputStr.charCodeAt(i++) & 0xff;
        var byte2 = inputStr.charCodeAt(i++) & 0xff;
        var byte3 = inputStr.charCodeAt(i++) & 0xff;
        var enc1 = byte1 >> 2;
        var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
        var enc3, enc4;
        if (isNaN(byte2)) {
            enc3 = enc4 = 64;
        }
        else {
            enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
            if (isNaN(byte3)) {
                enc4 = 64;
            }
            else {
                enc4 = byte3 & 63;
            }
        }
        outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
    }
    return outputStr;
}
/**
 * Clamps a value between a min and max inclusive
 */
export function clamp(val, min, max) {
    return Math.min(Math.max(min, val), max);
}
export function randomInRange(min, max, random) {
    if (random === void 0) { random = new Random(); }
    return random ? random.floating(min, max) : min + Math.random() * (max - min);
}
export function randomIntInRange(min, max, random) {
    if (random === void 0) { random = new Random(); }
    return random ? random.integer(min, max) : Math.round(randomInRange(min, max));
}
export function canonicalizeAngle(angle) {
    var tmpAngle = angle;
    if (angle > TwoPI) {
        while (tmpAngle > TwoPI) {
            tmpAngle -= TwoPI;
        }
    }
    if (angle < 0) {
        while (tmpAngle < 0) {
            tmpAngle += TwoPI;
        }
    }
    return tmpAngle;
}
export function toDegrees(radians) {
    return (180 / Math.PI) * radians;
}
export function toRadians(degrees) {
    return (degrees / 180) * Math.PI;
}
export function getPosition(el) {
    var oLeft = 0, oTop = 0;
    var calcOffsetLeft = function (parent) {
        oLeft += parent.offsetLeft;
        if (parent.offsetParent) {
            calcOffsetLeft(parent.offsetParent);
        }
    };
    var calcOffsetTop = function (parent) {
        oTop += parent.offsetTop;
        if (parent.offsetParent) {
            calcOffsetTop(parent.offsetParent);
        }
    };
    calcOffsetLeft(el);
    calcOffsetTop(el);
    return new Vector(oLeft, oTop);
}
export function addItemToArray(item, array) {
    if (array.indexOf(item) === -1) {
        array.push(item);
        return true;
    }
    return false;
}
export function removeItemFromArray(item, array) {
    var index = -1;
    if ((index = array.indexOf(item)) > -1) {
        array.splice(index, 1);
        return true;
    }
    return false;
}
export function contains(array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}
export function getOppositeSide(side) {
    if (side === Side.Top) {
        return Side.Bottom;
    }
    if (side === Side.Bottom) {
        return Side.Top;
    }
    if (side === Side.Left) {
        return Side.Right;
    }
    if (side === Side.Right) {
        return Side.Left;
    }
    return Side.None;
}
export function getSideFromVector(direction) {
    var directions = [Vector.Left, Vector.Right, Vector.Up, Vector.Down];
    var directionEnum = [Side.Left, Side.Right, Side.Top, Side.Bottom];
    var max = -Number.MAX_VALUE;
    var maxIndex = -1;
    for (var i = 0; i < directions.length; i++) {
        if (directions[i].dot(direction) > max) {
            max = directions[i].dot(direction);
            maxIndex = i;
        }
    }
    return directionEnum[maxIndex];
}
/**
 * Excalibur's dynamically resizing collection
 */
var Collection = /** @class */ (function () {
    /**
     * @param initialSize  Initial size of the internal backing array
     */
    function Collection(initialSize) {
        if (initialSize === void 0) { initialSize = Collection.DefaultSize; }
        this._internalArray = null;
        this._endPointer = 0;
        this._internalArray = new Array(initialSize);
    }
    Collection.prototype._resize = function () {
        var newSize = this._internalArray.length * 2;
        var newArray = new Array(newSize);
        var count = this.count();
        for (var i = 0; i < count; i++) {
            newArray[i] = this._internalArray[i];
        }
        delete this._internalArray;
        this._internalArray = newArray;
    };
    /**
     * Push elements to the end of the collection
     */
    Collection.prototype.push = function (element) {
        if (this._endPointer === this._internalArray.length) {
            this._resize();
        }
        return (this._internalArray[this._endPointer++] = element);
    };
    /**
     * Removes elements from the end of the collection
     */
    Collection.prototype.pop = function () {
        this._endPointer = this._endPointer - 1 < 0 ? 0 : this._endPointer - 1;
        return this._internalArray[this._endPointer];
    };
    /**
     * Returns the count of the collection
     */
    Collection.prototype.count = function () {
        return this._endPointer;
    };
    /**
     * Empties the collection
     */
    Collection.prototype.clear = function () {
        this._endPointer = 0;
    };
    /**
     * Returns the size of the internal backing array
     */
    Collection.prototype.internalSize = function () {
        return this._internalArray.length;
    };
    /**
     * Returns an element at a specific index
     * @param index  Index of element to retrieve
     */
    Collection.prototype.elementAt = function (index) {
        if (index >= this.count()) {
            //Logger.getInstance().error('Invalid parameter: ' + index);
            throw new Error('Invalid index ' + index);
        }
        return this._internalArray[index];
    };
    /**
     * Inserts an element at a specific index
     * @param index  Index to insert the element
     * @param value  Element to insert
     */
    Collection.prototype.insert = function (index, value) {
        if (index >= this.count()) {
            this._resize();
        }
        return (this._internalArray[index] = value);
    };
    /**
     * Removes an element at a specific index
     * @param index  Index of element to remove
     */
    Collection.prototype.remove = function (index) {
        var count = this.count();
        if (count === 0) {
            //Logger.getInstance().error('Invalid parameter: ' + index);
            throw new Error('Invalid parameter ' + index);
        }
        // O(n) Shift
        var removed = this._internalArray[index];
        for (var i = index; i < count; i++) {
            this._internalArray[i] = this._internalArray[i + 1];
        }
        this._endPointer--;
        return removed;
    };
    /**
     * Removes an element by reference
     * @param element  Element to retrieve
     */
    Collection.prototype.removeElement = function (element) {
        var index = this._internalArray.indexOf(element);
        this.remove(index);
    };
    /**
     * Returns a array representing the collection
     */
    Collection.prototype.toArray = function () {
        return this._internalArray.slice(0, this._endPointer);
    };
    /**
     * Iterate over every element in the collection
     * @param func  Callback to call for each element passing a reference to the element and its index, returned values are ignored
     */
    Collection.prototype.forEach = function (func) {
        var i = 0, count = this.count();
        for (i; i < count; i++) {
            func.call(this, this._internalArray[i], i);
        }
    };
    /**
     * Mutate every element in the collection
     * @param func  Callback to call for each element passing a reference to the element and its index, any values returned mutate
     * the collection
     */
    Collection.prototype.map = function (func) {
        var count = this.count();
        for (var i = 0; i < count; i++) {
            this._internalArray[i] = func.call(this, this._internalArray[i], i);
        }
    };
    /**
     * Default collection size
     */
    Collection.DefaultSize = 200;
    return Collection;
}());
export { Collection };
//# sourceMappingURL=Util.js.map