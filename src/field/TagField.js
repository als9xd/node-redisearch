"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Field_1 = require("./Field");
var TagField = /** @class */ (function (_super) {
    __extends(TagField, _super);
    /*
          TagField is a tag-indexing field with simpler compression and tokenization.
          See http://redisearch.io/Tags/
      */
    function TagField(name, options) {
        var _this = _super.call(this, name, [Field_1.Field.TAG]) || this;
        var _a = options || {}, _b = _a.seperator, seperator = _b === void 0 ? ',' : _b, _c = _a.noIndex, noIndex = _c === void 0 ? false : _c;
        if (seperator !== ',') {
            _this.args.push(Field_1.Field.SEPARATOR);
            _this.args.push(seperator);
        }
        if (noIndex) {
            _this.args.push(Field_1.Field.NOINDEX);
        }
        return _this;
    }
    return TagField;
}(Field_1.Field));
exports.TagField = TagField;
