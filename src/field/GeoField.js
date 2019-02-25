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
var GeoField = /** @class */ (function (_super) {
    __extends(GeoField, _super);
    /*
          GeoField is used to define a geo-indexing field in a schema defintion
      */
    function GeoField(name) {
        return _super.call(this, name, [Field_1.Field.GEO]) || this;
    }
    return GeoField;
}(Field_1.Field));
exports.GeoField = GeoField;
