import { Vector } from '../Algebra';
/**
 * Creates a closed polygon drawing given a list of [[Vector]]s.
 *
 * @warning Use sparingly as Polygons are performance intensive
 */
var Polygon = /** @class */ (function () {
    /**
     * @param points  The vectors to use to build the polygon in order
     */
    function Polygon(points) {
        /**
         * The width of the lines of the polygon
         */
        this.lineWidth = 5;
        /**
         * Indicates whether the polygon is filled or not.
         */
        this.filled = false;
        this._points = [];
        this.anchor = new Vector(0, 0);
        this.rotation = 0;
        this.scale = new Vector(1, 1);
        this._points = points;
        var minX = this._points.reduce(function (prev, curr) {
            return Math.min(prev, curr.x);
        }, 0);
        var maxX = this._points.reduce(function (prev, curr) {
            return Math.max(prev, curr.x);
        }, 0);
        this.drawWidth = maxX - minX;
        var minY = this._points.reduce(function (prev, curr) {
            return Math.min(prev, curr.y);
        }, 0);
        var maxY = this._points.reduce(function (prev, curr) {
            return Math.max(prev, curr.y);
        }, 0);
        this.drawHeight = maxY - minY;
        this.height = this.drawHeight;
        this.width = this.drawWidth;
    }
    /**
     * @notimplemented Effects are not supported on `Polygon`
     */
    Polygon.prototype.addEffect = function () {
        // not supported on polygons
    };
    /**
     * @notimplemented Effects are not supported on `Polygon`
     */
    Polygon.prototype.removeEffect = function () {
        // not supported on polygons
    };
    /**
     * @notimplemented Effects are not supported on `Polygon`
     */
    Polygon.prototype.clearEffects = function () {
        // not supported on polygons
    };
    Polygon.prototype.reset = function () {
        //pass
    };
    Polygon.prototype.draw = function (ctx, x, y) {
        ctx.save();
        ctx.translate(x + this.anchor.x, y + this.anchor.y);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        // Iterate through the supplied points and construct a 'polygon'
        var firstPoint = this._points[0];
        ctx.moveTo(firstPoint.x, firstPoint.y);
        var i = 0, len = this._points.length;
        for (i; i < len; i++) {
            ctx.lineTo(this._points[i].x, this._points[i].y);
        }
        ctx.lineTo(firstPoint.x, firstPoint.y);
        ctx.closePath();
        if (this.filled) {
            ctx.fillStyle = this.fillColor.toString();
            ctx.fill();
        }
        ctx.strokeStyle = this.lineColor.toString();
        if (this.flipHorizontal) {
            ctx.translate(this.drawWidth, 0);
            ctx.scale(-1, 1);
        }
        if (this.flipVertical) {
            ctx.translate(0, this.drawHeight);
            ctx.scale(1, -1);
        }
        ctx.stroke();
        ctx.restore();
    };
    return Polygon;
}());
export { Polygon };
//# sourceMappingURL=Polygon.js.map