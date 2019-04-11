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
import { Color } from './Drawing/Color';
import { Actor, CollisionType } from './Actor';
import { Configurable } from './Configurable';
/**
 * Enum representing the different font size units
 * https://developer.mozilla.org/en-US/docs/Web/CSS/font-size
 */
export var FontUnit;
(function (FontUnit) {
    /**
     * Em is a scalable unit, 1 em is equal to the current font size of the current element, parent elements can effect em values
     */
    FontUnit[FontUnit["Em"] = 0] = "Em";
    /**
     * Rem is similar to the Em, it is a scalable unit. 1 rem is eqaul to the font size of the root element
     */
    FontUnit[FontUnit["Rem"] = 1] = "Rem";
    /**
     * Pixel is a unit of length in screen pixels
     */
    FontUnit[FontUnit["Px"] = 2] = "Px";
    /**
     * Point is a physical unit length (1/72 of an inch)
     */
    FontUnit[FontUnit["Pt"] = 3] = "Pt";
    /**
     * Percent is a scalable unit similar to Em, the only difference is the Em units scale faster when Text-Size stuff
     */
    FontUnit[FontUnit["Percent"] = 4] = "Percent";
})(FontUnit || (FontUnit = {}));
/**
 * Enum representing the different horizontal text alignments
 */
export var TextAlign;
(function (TextAlign) {
    /**
     * The text is left-aligned.
     */
    TextAlign[TextAlign["Left"] = 0] = "Left";
    /**
     * The text is right-aligned.
     */
    TextAlign[TextAlign["Right"] = 1] = "Right";
    /**
     * The text is centered.
     */
    TextAlign[TextAlign["Center"] = 2] = "Center";
    /**
     * The text is aligned at the normal start of the line (left-aligned for left-to-right locales,
     * right-aligned for right-to-left locales).
     */
    TextAlign[TextAlign["Start"] = 3] = "Start";
    /**
     * The text is aligned at the normal end of the line (right-aligned for left-to-right locales,
     * left-aligned for right-to-left locales).
     */
    TextAlign[TextAlign["End"] = 4] = "End";
})(TextAlign || (TextAlign = {}));
/**
 * Enum representing the different baseline text alignments
 */
export var BaseAlign;
(function (BaseAlign) {
    /**
     * The text baseline is the top of the em square.
     */
    BaseAlign[BaseAlign["Top"] = 0] = "Top";
    /**
     * The text baseline is the hanging baseline.  Currently unsupported; this will act like
     * alphabetic.
     */
    BaseAlign[BaseAlign["Hanging"] = 1] = "Hanging";
    /**
     * The text baseline is the middle of the em square.
     */
    BaseAlign[BaseAlign["Middle"] = 2] = "Middle";
    /**
     * The text baseline is the normal alphabetic baseline.
     */
    BaseAlign[BaseAlign["Alphabetic"] = 3] = "Alphabetic";
    /**
     * The text baseline is the ideographic baseline; this is the bottom of
     * the body of the characters, if the main body of characters protrudes
     * beneath the alphabetic baseline.  Currently unsupported; this will
     * act like alphabetic.
     */
    BaseAlign[BaseAlign["Ideographic"] = 4] = "Ideographic";
    /**
     * The text baseline is the bottom of the bounding box.  This differs
     * from the ideographic baseline in that the ideographic baseline
     * doesn't consider descenders.
     */
    BaseAlign[BaseAlign["Bottom"] = 5] = "Bottom";
})(BaseAlign || (BaseAlign = {}));
/**
 * Enum representing the different possible font styles
 */
export var FontStyle;
(function (FontStyle) {
    FontStyle[FontStyle["Normal"] = 0] = "Normal";
    FontStyle[FontStyle["Italic"] = 1] = "Italic";
    FontStyle[FontStyle["Oblique"] = 2] = "Oblique";
})(FontStyle || (FontStyle = {}));
/**
 * @hidden
 */
var LabelImpl = /** @class */ (function (_super) {
    __extends(LabelImpl, _super);
    /**
     * @param text        The text of the label
     * @param x           The x position of the label
     * @param y           The y position of the label
     * @param fontFamily  Use any valid CSS font string for the label's font. Web fonts are supported. Default is `10px sans-serif`.
     * @param spriteFont  Use an Excalibur sprite font for the label's font, if a SpriteFont is provided it will take precedence
     * over a css font.
     */
    function LabelImpl(textOrConfig, x, y, fontFamily, spriteFont) {
        var _this = _super.call(this, textOrConfig && typeof textOrConfig === 'object'
            ? {
                x: textOrConfig.x,
                y: textOrConfig.y
            }
            : { x: x, y: y }) || this;
        /**
         * Sets or gets the bold property of the label's text, by default it's false
         */
        _this.bold = false;
        /**
         * The font size in the selected units, default is 10 (default units is pixel)
         */
        _this.fontSize = 10;
        /**
         * The font style for this label, the default is [[FontStyle.Normal]]
         */
        _this.fontStyle = FontStyle.Normal;
        /**
         * The css units for a font size such as px, pt, em (SpriteFont only support px), by default is 'px';
         */
        _this.fontUnit = FontUnit.Px;
        /**
         * Gets or sets the horizontal text alignment property for the label.
         */
        _this.textAlign = TextAlign.Left;
        /**
         * Gets or sets the baseline alignment property for the label.
         */
        _this.baseAlign = BaseAlign.Bottom;
        /**
         * Gets or sets the letter spacing on a Label. Only supported with Sprite Fonts.
         */
        _this.letterSpacing = 0; //px
        /**
         * Whether or not the [[SpriteFont]] will be case-sensitive when matching characters.
         */
        _this.caseInsensitive = true;
        var text = '';
        if (textOrConfig && typeof textOrConfig === 'object') {
            fontFamily = textOrConfig.fontFamily;
            spriteFont = textOrConfig.spriteFont;
            text = textOrConfig.text;
        }
        else {
            text = textOrConfig;
        }
        _this.text = text || '';
        _this.color = Color.Black;
        _this.spriteFont = spriteFont;
        _this.collisionType = CollisionType.PreventCollision;
        _this.fontFamily = fontFamily || 'sans-serif'; // coalesce to default canvas font
        _this._textShadowOn = false;
        _this._shadowOffsetX = 0;
        _this._shadowOffsetY = 0;
        if (spriteFont) {
            //this._textSprites = spriteFont.getTextSprites();
        }
        return _this;
    }
    /**
     * Returns the width of the text in the label (in pixels);
     * @param ctx  Rendering context to measure the string with
     */
    LabelImpl.prototype.getTextWidth = function (ctx) {
        var oldFont = ctx.font;
        ctx.font = this._fontString;
        var width = ctx.measureText(this.text).width;
        ctx.font = oldFont;
        return width;
    };
    // TypeScript doesn't support string enums :(
    LabelImpl.prototype._lookupFontUnit = function (fontUnit) {
        switch (fontUnit) {
            case FontUnit.Em:
                return 'em';
            case FontUnit.Rem:
                return 'rem';
            case FontUnit.Pt:
                return 'pt';
            case FontUnit.Px:
                return 'px';
            case FontUnit.Percent:
                return '%';
            default:
                return 'px';
        }
    };
    LabelImpl.prototype._lookupTextAlign = function (textAlign) {
        switch (textAlign) {
            case TextAlign.Left:
                return 'left';
            case TextAlign.Right:
                return 'right';
            case TextAlign.Center:
                return 'center';
            case TextAlign.End:
                return 'end';
            case TextAlign.Start:
                return 'start';
            default:
                return 'start';
        }
    };
    LabelImpl.prototype._lookupBaseAlign = function (baseAlign) {
        switch (baseAlign) {
            case BaseAlign.Alphabetic:
                return 'alphabetic';
            case BaseAlign.Bottom:
                return 'bottom';
            case BaseAlign.Hanging:
                return 'hanging';
            case BaseAlign.Ideographic:
                return 'ideographic';
            case BaseAlign.Middle:
                return 'middle';
            case BaseAlign.Top:
                return 'top';
            default:
                return 'alphabetic';
        }
    };
    LabelImpl.prototype._lookupFontStyle = function (fontStyle) {
        var boldstring = this.bold ? ' bold' : '';
        switch (fontStyle) {
            case FontStyle.Italic:
                return 'italic' + boldstring;
            case FontStyle.Normal:
                return 'normal' + boldstring;
            case FontStyle.Oblique:
                return 'oblique' + boldstring;
            default:
                return 'normal' + boldstring;
        }
    };
    /**
     * Sets the text shadow for sprite fonts
     * @param offsetX      The x offset in pixels to place the shadow
     * @param offsetY      The y offset in pixels to place the shadow
     * @param shadowColor  The color of the text shadow
     */
    LabelImpl.prototype.setTextShadow = function (offsetX, offsetY, shadowColor) {
        this.spriteFont.setTextShadow(offsetX, offsetY, shadowColor);
    };
    /**
     * Toggles text shadows on or off, only applies when using sprite fonts
     */
    LabelImpl.prototype.useTextShadow = function (on) {
        this.spriteFont.useTextShadow(on);
    };
    /**
     * Clears the current text shadow
     */
    LabelImpl.prototype.clearTextShadow = function () {
        this._textShadowOn = false;
        this._shadowOffsetX = 0;
        this._shadowOffsetY = 0;
    };
    LabelImpl.prototype.update = function (engine, delta) {
        _super.prototype.update.call(this, engine, delta);
    };
    LabelImpl.prototype.draw = function (ctx, delta) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.rotate(this.rotation);
        if (this._textShadowOn) {
            ctx.save();
            ctx.translate(this._shadowOffsetX, this._shadowOffsetY);
            this._fontDraw(ctx);
            ctx.restore();
        }
        this._fontDraw(ctx);
        _super.prototype.draw.call(this, ctx, delta);
        ctx.restore();
    };
    LabelImpl.prototype._fontDraw = function (ctx) {
        if (this.spriteFont) {
            this.spriteFont.draw(ctx, this.text, 0, 0, {
                color: this.color.clone(),
                baseAlign: this.baseAlign,
                textAlign: this.textAlign,
                fontSize: this.fontSize,
                letterSpacing: this.letterSpacing,
                opacity: this.opacity
            });
        }
        else {
            var oldAlign = ctx.textAlign;
            var oldTextBaseline = ctx.textBaseline;
            ctx.textAlign = this._lookupTextAlign(this.textAlign);
            ctx.textBaseline = this._lookupBaseAlign(this.baseAlign);
            if (this.color) {
                this.color.a = this.opacity;
            }
            ctx.fillStyle = this.color.toString();
            ctx.font = this._fontString;
            if (this.maxWidth) {
                ctx.fillText(this.text, 0, 0, this.maxWidth);
            }
            else {
                ctx.fillText(this.text, 0, 0);
            }
            ctx.textAlign = oldAlign;
            ctx.textBaseline = oldTextBaseline;
        }
    };
    Object.defineProperty(LabelImpl.prototype, "_fontString", {
        get: function () {
            return this._lookupFontStyle(this.fontStyle) + " " + this.fontSize + this._lookupFontUnit(this.fontUnit) + " " + this.fontFamily;
        },
        enumerable: true,
        configurable: true
    });
    LabelImpl.prototype.debugDraw = function (ctx) {
        _super.prototype.debugDraw.call(this, ctx);
    };
    return LabelImpl;
}(Actor));
export { LabelImpl };
/**
 * Labels are the way to draw small amounts of text to the screen. They are
 * actors and inherit all of the benefits and capabilities.
 *
 * [[include:Labels.md]]
 */
var Label = /** @class */ (function (_super) {
    __extends(Label, _super);
    function Label(textOrConfig, x, y, fontFamily, spriteFont) {
        return _super.call(this, textOrConfig, x, y, fontFamily, spriteFont) || this;
    }
    return Label;
}(Configurable(LabelImpl)));
export { Label };
//# sourceMappingURL=Label.js.map