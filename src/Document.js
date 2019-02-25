"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Document = /** @class */ (function () {
    function Document(id, fields, options) {
        if (fields === void 0) { fields = {}; }
        this.id = id;
        var _a = (options || {}).payload, payload = _a === void 0 ? null : _a;
        this.payload = payload;
        Object.assign(this, fields);
    }
    return Document;
}());
exports.Document = Document;
