"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis = require('redis');
const create_1 = require("./create");
class RediSearch {
    constructor() {
    }
    connect(...clientOptions) {
        this.client = redis.createClient(...clientOptions);
        return Promise.resolve(this.client);
    }
    create(index, options) {
        return create_1.create(this.client, index, options);
    }
}
exports.RediSearch = RediSearch;
//# sourceMappingURL=RedisSearch.js.map