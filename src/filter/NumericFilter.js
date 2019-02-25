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
var Filter_1 = require("./Filter");
var NumericFilter = /** @class */ (function (_super) {
    __extends(NumericFilter, _super);
    function NumericFilter(field, minval, maxval, options) {
        var _this = this;
        var _a = options || {}, _b = _a.minExclusive, minExclusive = _b === void 0 ? false : _b, _c = _a.maxExclusive, maxExclusive = _c === void 0 ? false : _c;
        var args = [minExclusive ? minval : "(" + minval, maxExclusive ? maxval : "(" + maxval];
        _this = _super.call(this, 'FILTER', field, args) || this;
        return _this;
    }
    NumericFilter.INF = '+inf';
    NumericFilter.NEG_INF = '-inf';
    return NumericFilter;
}(Filter_1.Filter));
exports.NumericFilter = NumericFilter;
