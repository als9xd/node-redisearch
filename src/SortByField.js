'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var SortByField = /** @class */ (function() {
  function SortByField(field, options) {
    var _a = (options || {}).asc,
      asc = _a === void 0 ? true : _a;
    this.args = [field, asc ? 'ASC' : 'DESC'];
  }
  return SortByField;
})();
exports.SortByField = SortByField;
