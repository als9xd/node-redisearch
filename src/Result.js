"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Document_1 = require("./Document");
var Result = /** @class */ (function () {
    function Result(response, hasContent, options) {
        this.docs = [];
        console.log(response);
        /*
                - **snippets**: An optional dictionary of the form {field: snippet_size} for snippet formatting
            */
        var _a = (options || {}).hasPayload, hasPayload = _a === void 0 ? false : _a;
        var _b = (options || {}).duration, duration = _b === void 0 ? 0 : _b;
        this.total = response[0];
        this.duration = duration;
        var step = 1;
        if (hasContent) {
            step = hasPayload ? 3 : 2;
        }
        else {
            // we can't have nocontent and payloads in the same response
            hasPayload = false;
        }
        var _loop_1 = function (i) {
            var id = response[i];
            var payload = hasPayload ? response[i + 1] : null;
            var fieldOffsets = hasPayload ? 2 : 1;
            var fields = {};
            if (hasContent) {
                response[i + fieldOffsets].forEach(function (field, index) {
                    if (index % 2 === 0) {
                        fields[field] = response[i + fieldOffsets][index + 1];
                    }
                });
            }
            Object.keys(fields).forEach(function (fieldName) {
                var field = fields[fieldName];
                if (typeof field.id !== 'undefined') {
                    delete field.id;
                }
            });
            var doc = new Document_1.Document(id, { payload: payload }, fields);
            this_1.docs.push(doc);
        };
        var this_1 = this;
        for (var i = 1; i < response.length; i += step) {
            _loop_1(i);
        }
    }
    return Result;
}());
exports.Result = Result;
