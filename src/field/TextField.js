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
var TextField = /** @class */ (function (_super) {
    __extends(TextField, _super);
    function TextField(name, options) {
        var _this = this;
        var _a = options || {}, _b = _a.weight, weight = _b === void 0 ? 1.0 : _b, _c = _a.sortable, sortable = _c === void 0 ? false : _c, _d = _a.noStem, noStem = _d === void 0 ? false : _d, _e = _a.noIndex, noIndex = _e === void 0 ? false : _e;
        var args = [Field_1.Field.TEXT, Field_1.Field.WEIGHT, weight];
        if (sortable) {
            args.push(Field_1.Field.SORTABLE);
        }
        if (noStem) {
            args.push(TextField.NOSTEM);
        }
        if (noIndex) {
            args.push(Field_1.Field.NOINDEX);
        }
        _this = _super.call(this, name, args) || this;
        return _this;
    }
    /*
          TextField is used to define a text field in a schema definition
      */
    TextField.NOSTEM = 'NOSTEM';
    return TextField;
}(Field_1.Field));
exports.TextField = TextField;
