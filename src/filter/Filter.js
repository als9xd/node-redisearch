"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Filter = /** @class */ (function () {
    function Filter(keyword, field, args) {
        this.args = [keyword, field].concat(args);
    }
    return Filter;
}());
exports.Filter = Filter;
