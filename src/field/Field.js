"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Field = /** @class */ (function () {
    function Field(name, args) {
        if (args === void 0) { args = []; }
        this.name = name;
        this.args = args;
    }
    Field.NUMERIC = 'NUMERIC';
    Field.TEXT = 'TEXT';
    Field.WEIGHT = 'WEIGHT';
    Field.GEO = 'GEO';
    Field.TAG = 'TAG';
    Field.SORTABLE = 'SORTABLE';
    Field.NOINDEX = 'NOINDEX';
    Field.SEPARATOR = 'SEPARATOR';
    return Field;
}());
exports.Field = Field;
