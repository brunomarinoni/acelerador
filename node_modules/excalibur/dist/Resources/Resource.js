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
import { Class } from '../Class';
import { Promise } from '../Promises';
import { Logger } from '../Util/Log';
/**
 * The [[Resource]] type allows games built in Excalibur to load generic resources.
 * For any type of remote resource it is recommended to use [[Resource]] for preloading.
 *
 * [[include:Resources.md]]
 */
var Resource = /** @class */ (function (_super) {
    __extends(Resource, _super);
    /**
     * @param path          Path to the remote resource
     * @param responseType  The type to expect as a response: "" | "arraybuffer" | "blob" | "document" | "json" | "text";
     * @param bustCache     Whether or not to cache-bust requests
     */
    function Resource(path, responseType, bustCache) {
        if (bustCache === void 0) { bustCache = true; }
        var _this = _super.call(this) || this;
        _this.path = path;
        _this.responseType = responseType;
        _this.bustCache = bustCache;
        _this.data = null;
        _this.logger = Logger.getInstance();
        _this.arrayBuffer = null;
        _this.onprogress = function () {
            return;
        };
        _this.oncomplete = function () {
            return;
        };
        _this.onerror = function () {
            return;
        };
        return _this;
    }
    /**
     * Returns true if the Resource is completely loaded and is ready
     * to be drawn.
     */
    Resource.prototype.isLoaded = function () {
        return this.data !== null;
    };
    Resource.prototype.wireEngine = function (_engine) {
        // override me
    };
    Resource.prototype._cacheBust = function (uri) {
        var query = /\?\w*=\w*/;
        if (query.test(uri)) {
            uri += '&__=' + Date.now();
        }
        else {
            uri += '?__=' + Date.now();
        }
        return uri;
    };
    Resource.prototype._start = function () {
        this.logger.debug('Started loading resource ' + this.path);
    };
    /**
     * Begin loading the resource and returns a promise to be resolved on completion
     */
    Resource.prototype.load = function () {
        var _this = this;
        var complete = new Promise();
        // Exit early if we already have data
        if (this.data !== null) {
            this.logger.debug('Already have data for resource', this.path);
            complete.resolve(this.data);
            this.oncomplete();
            return complete;
        }
        var request = new XMLHttpRequest();
        request.open('GET', this.bustCache ? this._cacheBust(this.path) : this.path, true);
        request.responseType = this.responseType;
        request.onloadstart = function () {
            _this._start();
        };
        request.onprogress = this.onprogress;
        request.onerror = this.onerror;
        request.onload = function () {
            // XHR on file:// success status is 0, such as with PhantomJS
            if (request.status !== 0 && request.status !== 200) {
                _this.logger.error('Failed to load resource ', _this.path, ' server responded with error code', request.status);
                _this.onerror(request.response);
                complete.resolve(request.response);
                return;
            }
            _this.data = _this.processData(request.response);
            _this.oncomplete();
            _this.logger.debug('Completed loading resource', _this.path);
            complete.resolve(_this.data);
        };
        request.send();
        return complete;
    };
    /**
     * Returns the loaded data once the resource is loaded
     */
    Resource.prototype.getData = function () {
        return this.data;
    };
    Resource.prototype.getArrayData = function () {
        return this.arrayBuffer;
    };
    /**
     * Sets the data for this resource directly
     */
    Resource.prototype.setData = function (data) {
        this.data = this.processData(data);
    };
    /**
     * This method is meant to be overriden to handle any additional
     * processing. Such as decoding downloaded audio bits.
     */
    Resource.prototype.processData = function (data) {
        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
        // Blob requires an object url
        if (this.responseType === 'blob') {
            return URL.createObjectURL(data);
        }
        return data;
    };
    return Resource;
}(Class));
export { Resource };
//# sourceMappingURL=Resource.js.map