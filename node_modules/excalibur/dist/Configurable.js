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
export function Configurable(base) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, args) || this;
            //get the number of arguments that aren't undefined. TS passes a value to all parameters
            //of whatever ctor is the implementation, so args.length doesn't work here.
            var size = args.filter(function (value) {
                return value !== undefined;
            }).length;
            if (size === 1 && args[0] && typeof args[0] === 'object' && !(args[0] instanceof Array)) {
                _this.assign(args[0]);
            }
            return _this;
        }
        class_1.prototype.assign = function (props) {
            //set the value of every property that was passed in,
            //if the constructor previously set this value, it will be overridden here
            for (var k in props) {
                if (typeof this[k] !== 'function') {
                    this[k] = props[k];
                }
            }
        };
        return class_1;
    }(base));
}
//# sourceMappingURL=Configurable.js.map