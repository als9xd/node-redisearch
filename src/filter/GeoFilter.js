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
var GeoFilter = /** @class */ (function (_super) {
    __extends(GeoFilter, _super);
    function GeoFilter(field, lon, lat, radius, options) {
        var _this = this;
        var _a = (options || {}).unit, unit = _a === void 0 ? GeoFilter.KILOMETERS : _a;
        _this = _super.call(this, 'GEOFILTER', field, [lon, lat, radius, unit]) || this;
        return _this;
    }
    GeoFilter.METERS = 'm';
    GeoFilter.KILOMETERS = 'km';
    GeoFilter.FEET = 'ft';
    GeoFilter.MILES = 'mi';
    return GeoFilter;
}(Filter_1.Filter));
exports.GeoFilter = GeoFilter;
