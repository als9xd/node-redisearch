"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Field {
    constructor(name, fieldType) {
        this.name = name;
        this.fieldType = fieldType;
    }
    flatten() {
        return [this.name,];
    }
}
exports.Field = Field;
//# sourceMappingURL=Field.js.map