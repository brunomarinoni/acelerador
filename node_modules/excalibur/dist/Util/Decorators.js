var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Logger } from './Log';
import * as Util from './Util';
/**
 * Obsolete decorator for marking Excalibur methods obsolete, you can optionally specify a custom message and/or alternate replacement
 * method do the deprecated one. Inspired by https://github.com/jayphelps/core-decorators.js
 */
export function obsolete(options) {
    options = Util.extend({}, { message: 'This feature will be removed in future versions of Excalibur.', alternateMethod: null }, options);
    return function (target, property, descriptor) {
        if (descriptor &&
            !(typeof descriptor.value === 'function' || typeof descriptor.get === 'function' || typeof descriptor.set === 'function')) {
            throw new SyntaxError('Only classes/functions/getters/setters can be marked as obsolete');
        }
        var methodSignature = "" + (target.name || '') + (target.name && property ? '.' : '') + (property ? property : '');
        var message = methodSignature + " is marked obsolete: " + options.message +
            (options.alternateMethod ? " Use " + options.alternateMethod + " instead" : '');
        // If descriptor is null it is a class
        var method = descriptor ? __assign({}, descriptor) : target;
        if (!descriptor) {
            var constructor = function () {
                var args = Array.prototype.slice.call(arguments);
                Logger.getInstance().warn(message);
                return new (method.bind.apply(method, [void 0].concat(args)))();
            };
            constructor.prototype = method.prototype;
            return constructor;
        }
        if (descriptor && descriptor.value) {
            method.value = function () {
                Logger.getInstance().warn(message);
                return descriptor.value.apply(this, arguments);
            };
            return method;
        }
        if (descriptor && descriptor.get) {
            method.get = function () {
                Logger.getInstance().warn(message);
                return descriptor.get.apply(this, arguments);
            };
        }
        if (descriptor && descriptor.set) {
            method.set = function () {
                Logger.getInstance().warn(message);
                return descriptor.set.apply(this, arguments);
            };
        }
        return method;
    };
}
//# sourceMappingURL=Decorators.js.map