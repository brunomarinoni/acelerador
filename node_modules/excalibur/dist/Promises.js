// Promises/A+ Spec http://promises-aplus.github.io/promises-spec/
/**
 * Valid states for a promise to be in
 */
export var PromiseState;
(function (PromiseState) {
    PromiseState[PromiseState["Resolved"] = 0] = "Resolved";
    PromiseState[PromiseState["Rejected"] = 1] = "Rejected";
    PromiseState[PromiseState["Pending"] = 2] = "Pending";
})(PromiseState || (PromiseState = {}));
/**
 * Promises are used to do asynchronous work and they are useful for
 * creating a chain of actions. In Excalibur they are used for loading,
 * sounds, animation, actions, and more.
 *
 * [[include:Promises.md]]
 */
var Promise = /** @class */ (function () {
    function Promise() {
        this._state = PromiseState.Pending;
        this._successCallbacks = [];
        this._rejectCallback = function () {
            return;
        };
    }
    /**
     * Create and resolve a Promise with an optional value
     * @param value  An optional value to wrap in a resolved promise
     */
    Promise.resolve = function (value) {
        var promise = new Promise().resolve(value);
        return promise;
    };
    /**
     * Create and reject a Promise with an optional value
     * @param value  An optional value to wrap in a rejected promise
     */
    Promise.reject = function (value) {
        var promise = new Promise().reject(value);
        return promise;
    };
    Promise.join = function () {
        var promises = [];
        if (arguments.length > 0 && !Array.isArray(arguments[0])) {
            for (var _i = 0; _i < arguments.length; _i++) {
                promises[_i - 0] = arguments[_i];
            }
        }
        else if (arguments.length === 1 && Array.isArray(arguments[0])) {
            promises = arguments[0];
        }
        var joinedPromise = new Promise();
        if (!promises || !promises.length) {
            return joinedPromise.resolve();
        }
        var total = promises.length;
        var successes = 0;
        var rejects = 0;
        var errors = [];
        promises.forEach(function (p) {
            p.then(function () {
                successes += 1;
                if (successes === total) {
                    joinedPromise.resolve();
                }
                else if (successes + rejects + errors.length === total) {
                    joinedPromise.reject(errors);
                }
            }, function () {
                rejects += 1;
                if (successes + rejects + errors.length === total) {
                    joinedPromise.reject(errors);
                }
            }).error(function (e) {
                errors.push(e);
                if (errors.length + successes + rejects === total) {
                    joinedPromise.reject(errors);
                }
            });
        });
        return joinedPromise;
    };
    /**
     * Chain success and reject callbacks after the promise is resolved
     * @param successCallback  Call on resolution of promise
     * @param rejectCallback   Call on rejection of promise
     */
    Promise.prototype.then = function (successCallback, rejectCallback) {
        if (successCallback) {
            this._successCallbacks.push(successCallback);
            // If the promise is already resovled call immediately
            if (this.state() === PromiseState.Resolved) {
                try {
                    successCallback.call(this, this._value);
                }
                catch (e) {
                    this._handleError(e);
                }
            }
        }
        if (rejectCallback) {
            this._rejectCallback = rejectCallback;
            // If the promise is already rejected call immediately
            if (this.state() === PromiseState.Rejected) {
                try {
                    rejectCallback.call(this, this._value);
                }
                catch (e) {
                    this._handleError(e);
                }
            }
        }
        return this;
    };
    /**
     * Add an error callback to the promise
     * @param errorCallback  Call if there was an error in a callback
     */
    Promise.prototype.error = function (errorCallback) {
        if (errorCallback) {
            this._errorCallback = errorCallback;
        }
        return this;
    };
    /**
     * Resolve the promise and pass an option value to the success callbacks
     * @param value  Value to pass to the success callbacks
     */
    Promise.prototype.resolve = function (value) {
        var _this = this;
        if (this._state === PromiseState.Pending) {
            this._value = value;
            try {
                this._state = PromiseState.Resolved;
                this._successCallbacks.forEach(function (cb) {
                    cb.call(_this, _this._value);
                });
            }
            catch (e) {
                this._handleError(e);
            }
        }
        else {
            throw new Error('Cannot resolve a promise that is not in a pending state!');
        }
        return this;
    };
    /**
     * Reject the promise and pass an option value to the reject callbacks
     * @param value  Value to pass to the reject callbacks
     */
    Promise.prototype.reject = function (value) {
        if (this._state === PromiseState.Pending) {
            this._value = value;
            try {
                this._state = PromiseState.Rejected;
                this._rejectCallback.call(this, this._value);
            }
            catch (e) {
                this._handleError(e);
            }
        }
        else {
            throw new Error('Cannot reject a promise that is not in a pending state!');
        }
        return this;
    };
    /**
     * Inspect the current state of a promise
     */
    Promise.prototype.state = function () {
        return this._state;
    };
    Promise.prototype._handleError = function (e) {
        if (this._errorCallback) {
            this._errorCallback.call(this, e);
        }
        else {
            // rethrow error
            throw e;
        }
    };
    return Promise;
}());
export { Promise };
//# sourceMappingURL=Promises.js.map