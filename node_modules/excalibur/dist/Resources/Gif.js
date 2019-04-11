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
import { Resource } from './Resource';
import { Promise } from '../Promises';
import { Texture } from './Texture';
import { Color } from '../Drawing/Color';
import { SpriteSheet } from '../Drawing/SpriteSheet';
/**
 * The [[Texture]] object allows games built in Excalibur to load image resources.
 * [[Texture]] is an [[ILoadable]] which means it can be passed to a [[Loader]]
 * to pre-load before starting a level or game.
 *
 * [[include:Textures.md]]
 */
var Gif = /** @class */ (function (_super) {
    __extends(Gif, _super);
    /**
     * @param path       Path to the image resource
     * @param color      Optionally set the color to treat as transparent the gif, by default [[Color.Magenta]]
     * @param bustCache  Optionally load texture with cache busting
     */
    function Gif(path, color, bustCache) {
        if (color === void 0) { color = Color.Magenta; }
        if (bustCache === void 0) { bustCache = true; }
        var _this = _super.call(this, path, 'arraybuffer', bustCache) || this;
        _this.path = path;
        _this.color = color;
        _this.bustCache = bustCache;
        /**
         * A [[Promise]] that resolves when the Texture is loaded.
         */
        _this.loaded = new Promise();
        _this._isLoaded = false;
        _this._stream = null;
        _this._gif = null;
        _this._texture = [];
        _this._animation = null;
        _this._transparentColor = null;
        _this._transparentColor = color;
        return _this;
    }
    /**
     * Returns true if the Texture is completely loaded and is ready
     * to be drawn.
     */
    Gif.prototype.isLoaded = function () {
        return this._isLoaded;
    };
    /**
     * Begins loading the texture and returns a promise to be resolved on completion
     */
    Gif.prototype.load = function () {
        var _this = this;
        var complete = new Promise();
        var loaded = _super.prototype.load.call(this);
        loaded.then(function () {
            _this._stream = new Stream(_this.getData());
            _this._gif = new ParseGif(_this._stream, _this._transparentColor);
            var promises = [];
            for (var imageIndex = 0; imageIndex < _this._gif.images.length; imageIndex++) {
                var texture = new Texture(_this._gif.images[imageIndex].src, false);
                _this._texture.push(texture);
                promises.push(texture.load());
            }
            Promise.join(promises).then(function () {
                _this._isLoaded = true;
                complete.resolve(_this._texture);
            });
        }, function () {
            complete.reject('Error loading texture.');
        });
        return complete;
    };
    Gif.prototype.asSprite = function (id) {
        if (id === void 0) { id = 0; }
        var sprite = this._texture[id].asSprite();
        return sprite;
    };
    Gif.prototype.asSpriteSheet = function () {
        var spriteArray = this._texture.map(function (texture) {
            return texture.asSprite();
        });
        return new SpriteSheet(spriteArray);
    };
    Gif.prototype.asAnimation = function (engine, speed) {
        var spriteSheet = this.asSpriteSheet();
        this._animation = spriteSheet.getAnimationForAll(engine, speed);
        return this._animation;
    };
    Object.defineProperty(Gif.prototype, "readCheckBytes", {
        get: function () {
            return this._gif.checkBytes;
        },
        enumerable: true,
        configurable: true
    });
    return Gif;
}(Resource));
export { Gif };
var bitsToNum = function (ba) {
    return ba.reduce(function (s, n) {
        return s * 2 + n;
    }, 0);
};
var byteToBitArr = function (bite) {
    var a = [];
    for (var i = 7; i >= 0; i--) {
        a.push(!!(bite & (1 << i)));
    }
    return a;
};
var Stream = /** @class */ (function () {
    function Stream(dataArray) {
        var _this = this;
        this.data = null;
        this.len = 0;
        this.position = 0;
        this.readByte = function () {
            if (_this.position >= _this.data.byteLength) {
                throw new Error('Attempted to read past end of stream.');
            }
            return _this.data[_this.position++];
        };
        this.readBytes = function (n) {
            var bytes = [];
            for (var i = 0; i < n; i++) {
                bytes.push(_this.readByte());
            }
            return bytes;
        };
        this.read = function (n) {
            var s = '';
            for (var i = 0; i < n; i++) {
                s += String.fromCharCode(_this.readByte());
            }
            return s;
        };
        this.readUnsigned = function () {
            // Little-endian.
            var a = _this.readBytes(2);
            return (a[1] << 8) + a[0];
        };
        this.data = new Uint8Array(dataArray);
        this.len = this.data.byteLength;
        if (this.len === 0) {
            throw new Error('No data loaded from file');
        }
    }
    return Stream;
}());
export { Stream };
var lzwDecode = function (minCodeSize, data) {
    // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
    var pos = 0; // Maybe this streaming thing should be merged with the Stream?
    var readCode = function (size) {
        var code = 0;
        for (var i = 0; i < size; i++) {
            if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
                code |= 1 << i;
            }
            pos++;
        }
        return code;
    };
    var output = [];
    var clearCode = 1 << minCodeSize;
    var eoiCode = clearCode + 1;
    var codeSize = minCodeSize + 1;
    var dict = [];
    var clear = function () {
        dict = [];
        codeSize = minCodeSize + 1;
        for (var i = 0; i < clearCode; i++) {
            dict[i] = [i];
        }
        dict[clearCode] = [];
        dict[eoiCode] = null;
    };
    var code;
    var last;
    while (true) {
        last = code;
        code = readCode(codeSize);
        if (code === clearCode) {
            clear();
            continue;
        }
        if (code === eoiCode) {
            break;
        }
        if (code < dict.length) {
            if (last !== clearCode) {
                dict.push(dict[last].concat(dict[code][0]));
            }
        }
        else {
            if (code !== dict.length) {
                throw new Error('Invalid LZW code.');
            }
            dict.push(dict[last].concat(dict[last][0]));
        }
        output.push.apply(output, dict[code]);
        if (dict.length === 1 << codeSize && codeSize < 12) {
            // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
            codeSize++;
        }
    }
    // I don't know if this is technically an error, but some GIFs do it.
    //if (Math.ceil(pos / 8) !== data.length) throw new Error('Extraneous LZW bytes.');
    return output;
};
// The actual parsing; returns an object with properties.
var ParseGif = /** @class */ (function () {
    function ParseGif(stream, color) {
        if (color === void 0) { color = Color.Magenta; }
        var _this = this;
        this._st = null;
        this._handler = {};
        this._transparentColor = null;
        this.frames = [];
        this.images = [];
        this.globalColorTable = [];
        this.checkBytes = [];
        // LZW (GIF-specific)
        this.parseColorTable = function (entries) {
            // Each entry is 3 bytes, for RGB.
            var ct = [];
            for (var i = 0; i < entries; i++) {
                var rgb = _this._st.readBytes(3);
                var rgba = '#' +
                    rgb
                        .map(function (x) {
                        var hex = x.toString(16);
                        return hex.length === 1 ? '0' + hex : hex;
                    })
                        .join('');
                ct.push(rgba);
            }
            return ct;
        };
        this.readSubBlocks = function () {
            var size, data;
            data = '';
            do {
                size = _this._st.readByte();
                data += _this._st.read(size);
            } while (size !== 0);
            return data;
        };
        this.parseHeader = function () {
            var hdr = {
                sig: null,
                ver: null,
                width: null,
                height: null,
                colorRes: null,
                globalColorTableSize: null,
                gctFlag: null,
                sorted: null,
                globalColorTable: [],
                bgColor: null,
                pixelAspectRatio: null // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
            };
            hdr.sig = _this._st.read(3);
            hdr.ver = _this._st.read(3);
            if (hdr.sig !== 'GIF') {
                throw new Error('Not a GIF file.'); // XXX: This should probably be handled more nicely.
            }
            hdr.width = _this._st.readUnsigned();
            hdr.height = _this._st.readUnsigned();
            var bits = byteToBitArr(_this._st.readByte());
            hdr.gctFlag = bits.shift();
            hdr.colorRes = bitsToNum(bits.splice(0, 3));
            hdr.sorted = bits.shift();
            hdr.globalColorTableSize = bitsToNum(bits.splice(0, 3));
            hdr.bgColor = _this._st.readByte();
            hdr.pixelAspectRatio = _this._st.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
            if (hdr.gctFlag) {
                hdr.globalColorTable = _this.parseColorTable(1 << (hdr.globalColorTableSize + 1));
                _this.globalColorTable = hdr.globalColorTable;
            }
            if (_this._handler.hdr && _this._handler.hdr(hdr)) {
                _this.checkBytes.push(_this._handler.hdr);
            }
        };
        this.parseExt = function (block) {
            var parseGCExt = function (block) {
                _this.checkBytes.push(_this._st.readByte()); // Always 4
                var bits = byteToBitArr(_this._st.readByte());
                block.reserved = bits.splice(0, 3); // Reserved; should be 000.
                block.disposalMethod = bitsToNum(bits.splice(0, 3));
                block.userInput = bits.shift();
                block.transparencyGiven = bits.shift();
                block.delayTime = _this._st.readUnsigned();
                block.transparencyIndex = _this._st.readByte();
                block.terminator = _this._st.readByte();
                if (_this._handler.gce && _this._handler.gce(block)) {
                    _this.checkBytes.push(_this._handler.gce);
                }
            };
            var parseComExt = function (block) {
                block.comment = _this.readSubBlocks();
                if (_this._handler.com && _this._handler.com(block)) {
                    _this.checkBytes.push(_this._handler.com);
                }
            };
            var parsePTExt = function (block) {
                _this.checkBytes.push(_this._st.readByte()); // Always 12
                block.ptHeader = _this._st.readBytes(12);
                block.ptData = _this.readSubBlocks();
                if (_this._handler.pte && _this._handler.pte(block)) {
                    _this.checkBytes.push(_this._handler.pte);
                }
            };
            var parseAppExt = function (block) {
                var parseNetscapeExt = function (block) {
                    _this.checkBytes.push(_this._st.readByte()); // Always 3
                    block.unknown = _this._st.readByte(); // ??? Always 1? What is this?
                    block.iterations = _this._st.readUnsigned();
                    block.terminator = _this._st.readByte();
                    if (_this._handler.app && _this._handler.app.NETSCAPE && _this._handler.app.NETSCAPE(block)) {
                        _this.checkBytes.push(_this._handler.app);
                    }
                };
                var parseUnknownAppExt = function (block) {
                    block.appData = _this.readSubBlocks();
                    // FIXME: This won't work if a handler wants to match on any identifier.
                    if (_this._handler.app && _this._handler.app[block.identifier] && _this._handler.app[block.identifier](block)) {
                        _this.checkBytes.push(_this._handler.app[block.identifier]);
                    }
                };
                _this.checkBytes.push(_this._st.readByte()); // Always 11
                block.identifier = _this._st.read(8);
                block.authCode = _this._st.read(3);
                switch (block.identifier) {
                    case 'NETSCAPE':
                        parseNetscapeExt(block);
                        break;
                    default:
                        parseUnknownAppExt(block);
                        break;
                }
            };
            var parseUnknownExt = function (block) {
                block.data = _this.readSubBlocks();
                if (_this._handler.unknown && _this._handler.unknown(block)) {
                    _this.checkBytes.push(_this._handler.unknown);
                }
            };
            block.label = _this._st.readByte();
            switch (block.label) {
                case 0xf9:
                    block.extType = 'gce';
                    parseGCExt(block);
                    break;
                case 0xfe:
                    block.extType = 'com';
                    parseComExt(block);
                    break;
                case 0x01:
                    block.extType = 'pte';
                    parsePTExt(block);
                    break;
                case 0xff:
                    block.extType = 'app';
                    parseAppExt(block);
                    break;
                default:
                    block.extType = 'unknown';
                    parseUnknownExt(block);
                    break;
            }
        };
        this.parseImg = function (img) {
            var deinterlace = function (pixels, width) {
                // Of course this defeats the purpose of interlacing. And it's *probably*
                // the least efficient way it's ever been implemented. But nevertheless...
                var newPixels = new Array(pixels.length);
                var rows = pixels.length / width;
                var cpRow = function (toRow, fromRow) {
                    var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
                    newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
                };
                var offsets = [0, 4, 2, 1];
                var steps = [8, 8, 4, 2];
                var fromRow = 0;
                for (var pass = 0; pass < 4; pass++) {
                    for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
                        cpRow(toRow, fromRow);
                        fromRow++;
                    }
                }
                return newPixels;
            };
            img.leftPos = _this._st.readUnsigned();
            img.topPos = _this._st.readUnsigned();
            img.width = _this._st.readUnsigned();
            img.height = _this._st.readUnsigned();
            var bits = byteToBitArr(_this._st.readByte());
            img.lctFlag = bits.shift();
            img.interlaced = bits.shift();
            img.sorted = bits.shift();
            img.reserved = bits.splice(0, 2);
            img.lctSize = bitsToNum(bits.splice(0, 3));
            if (img.lctFlag) {
                img.lct = _this.parseColorTable(1 << (img.lctSize + 1));
            }
            img.lzwMinCodeSize = _this._st.readByte();
            var lzwData = _this.readSubBlocks();
            img.pixels = lzwDecode(img.lzwMinCodeSize, lzwData);
            if (img.interlaced) {
                // Move
                img.pixels = deinterlace(img.pixels, img.width);
            }
            _this.frames.push(img);
            _this.arrayToImage(img);
            if (_this._handler.img && _this._handler.img(img)) {
                _this.checkBytes.push(_this._handler);
            }
        };
        this.parseBlock = function () {
            var block = {
                sentinel: _this._st.readByte(),
                type: ''
            };
            var blockChar = String.fromCharCode(block.sentinel);
            switch (blockChar) {
                case '!':
                    block.type = 'ext';
                    _this.parseExt(block);
                    break;
                case ',':
                    block.type = 'img';
                    _this.parseImg(block);
                    break;
                case ';':
                    block.type = 'eof';
                    if (_this._handler.eof && _this._handler.eof(block)) {
                        _this.checkBytes.push(_this._handler.eof);
                    }
                    break;
                default:
                    throw new Error('Unknown block: 0x' + block.sentinel.toString(16));
            }
            if (block.type !== 'eof') {
                _this.parseBlock();
            }
        };
        this.arrayToImage = function (frame) {
            var count = 0;
            var c = document.createElement('canvas');
            c.id = count.toString();
            c.width = frame.width;
            c.height = frame.height;
            count++;
            var context = c.getContext('2d');
            var pixSize = 1;
            var y = 0;
            var x = 0;
            for (var i = 0; i < frame.pixels.length; i++) {
                if (x % frame.width === 0) {
                    y++;
                    x = 0;
                }
                if (_this.globalColorTable[frame.pixels[i]] === _this._transparentColor.toHex()) {
                    context.fillStyle = "rgba(0, 0, 0, 0)";
                }
                else {
                    context.fillStyle = _this.globalColorTable[frame.pixels[i]];
                }
                context.fillRect(x, y, pixSize, pixSize);
                x++;
            }
            var img = new Image();
            img.src = c.toDataURL();
            _this.images.push(img);
        };
        this._st = stream;
        this._handler = {};
        this._transparentColor = color;
        this.parseHeader();
        this.parseBlock();
    }
    return ParseGif;
}());
export { ParseGif };
//# sourceMappingURL=Gif.js.map