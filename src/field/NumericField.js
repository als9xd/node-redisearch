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
var NumericField = /** @class */ (function (_super) {
    __extends(NumericField, _super);
    /*
          NumericField is used to define a numeric field in a schema defintion
      */
    function NumericField(name, options) {
        var _this = this;
        var _a = options || {}, _b = _a.sortable, sortable = _b === void 0 ? false : _b, _c = _a.noIndex, noIndex = _c === void 0 ? false : _c;
        var args = [Field_1.Field.NUMERIC];
        if (sortable) {
            args.push(Field_1.Field.SORTABLE);
        }
        if (noIndex) {
            args.push(Field_1.Field.NOINDEX);
        }
        _this = _super.call(this, name, args) || this;
        return _this;
    }
    return NumericField;
}(Field_1.Field));
exports.NumericField = NumericField;
