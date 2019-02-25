"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
function create(client, index, options) {
    return new Promise((resolve, reject) => {
        client.send_command('FT.CREATE', [
            index,
            'SCHEMA',
            helpers_1.flattenArr(options.schema.map(field => field.flatten()))
        ], (err, response) => {
            if (err)
                return reject(err);
            resolve(response);
        });
    });
}
exports.create = create;
//# sourceMappingURL=create.js.map