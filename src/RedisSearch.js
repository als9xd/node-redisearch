"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Document_1 = require("./Document");
var Query_1 = require("./Query");
var Result_1 = require("./Result");
var redis = require('redis');
var Client = /** @class */ (function () {
    function Client(indexName, options) {
        /*
                Create a new Client for the given index_name, and optional host and port
                If conn is not None, we employ an already existing redis connection
            */
        var _a = options || {}, _b = _a.host, host = _b === void 0 ? 'localhost' : _b, _c = _a.port, port = _c === void 0 ? 6379 : _c, _d = _a.conn, conn = _d === void 0 ? null : _d;
        if (!indexName) {
            throw new Error('Index name is required');
        }
        this.indexName = indexName;
        if (conn === null) {
            this.redis = redis.createClient(port, host);
        }
        else {
            this.redis = conn;
        }
    }
    Client.prototype.create = function (fields, options) {
        /*
                Create the search index. The index must not already exist.
    
                ### Parameters:
                    - **fields**: a list of TextField or NumericField objects
                    - **noTermOffsets**: If true, we will not save term offsets in the index
                    - **noFieldFlags**: If true, we will not save field flags that allow searching in specific fields
                    - **stopWords**: If not null, we create the index with this custom stopword list. The list can be empty
            */
        var _this = this;
        if (fields === void 0) { fields = []; }
        var _a = options || {}, _b = _a.noTermOffsets, noTermOffsets = _b === void 0 ? false : _b, _c = _a.noFieldFlags, noFieldFlags = _c === void 0 ? false : _c, _d = _a.stopWords, stopWords = _d === void 0 ? null : _d;
        var args = [this.indexName];
        if (noTermOffsets) {
            args.push(Client.NOOFFSETS);
        }
        if (noFieldFlags) {
            args.push(Client.NOFIELDS);
        }
        if (stopWords) {
            if (Array.isArray(stopWords)) {
                args.push.apply(args, [Client.STOPWORDS, stopWords.length.toString()].concat(stopWords));
            }
            else {
                args.push(Client.STOPWORDS, 1, stopWords);
            }
        }
        args.push('SCHEMA');
        console.log(JSON.stringify(fields));
        fields.forEach(function (field) { return args.push.apply(args, [field.name].concat(field.args)); });
        return new Promise(function (resolve, reject) {
            _this.redis.send_command(Client.CREATE_CMD, args, function (err, response) {
                if (err) {
                    return reject(err);
                }
                resolve(response === 'OK');
            });
        });
    };
    Client.prototype.drop = function () {
        /*
                Drop the index if it exists
            */
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.redis.send_command(Client.DROP_CMD, [_this.indexName], function (err, response) {
                if (err) {
                    return reject(err);
                }
                resolve(response === 'OK');
            });
        });
    };
    Client.prototype.add = function (id, fields, options) {
        var _this = this;
        if (fields === void 0) { fields = {}; }
        var _a = options || {}, _b = _a.noSave, noSave = _b === void 0 ? false : _b, _c = _a.score, score = _c === void 0 ? 1.0 : _c, _d = _a.payload, payload = _d === void 0 ? null : _d, _e = _a.replace, replace = _e === void 0 ? false : _e, _f = _a.partial, partial = _f === void 0 ? false : _f, _g = _a.language, language = _g === void 0 ? null : _g;
        if (partial && !replace) {
            throw new Error("Argument 'partial' requires 'replace' argument is true");
        }
        var args = [this.indexName, id, score];
        if (noSave) {
            args.push('NOSAVE');
        }
        if (payload !== null) {
            args.push('PAYLOAD');
            args.push(payload);
        }
        if (replace) {
            args.push('REPLACE');
        }
        if (partial) {
            args.push('PARTIAL');
        }
        if (language) {
            args.push('LANGUAGE', language);
        }
        args.push('FIELDS');
        Object.keys(fields).forEach(function (fieldName) { return args.push(fieldName, fields[fieldName]); });
        return new Promise(function (resolve, reject) {
            _this.redis.send_command(Client.ADD_CMD, args, function (err, response) {
                if (err) {
                    return reject(err);
                }
                resolve(response === 'OK');
            });
        });
    };
    Client.prototype.del = function (id, options) {
        /*
                Delete a document from index
                Returns 1 if the document was deleted, 0 if not
            */
        var _this = this;
        var _a = (options || {}).dd, dd = _a === void 0 ? false : _a;
        var args = [this.indexName, id.toString()];
        if (dd) {
            args.push('DD');
        }
        return new Promise(function (resolve, reject) {
            _this.redis.send_command(Client.DEL_CMD, args, function (err, response) {
                if (err) {
                    return reject(err);
                }
                resolve(!!response);
            });
        });
    };
    Client.prototype.get = function (id) {
        /*
                Load a single document by id
            */
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.redis.hgetall(id, function (err, fields) {
                if (err) {
                    return reject(err);
                }
                if (fields.id) {
                    delete fields.id;
                }
                return resolve(new Document_1.Document(id, fields));
            });
        });
    };
    Client.prototype.info = function () {
        /*
                Get info an stats about the the current index, including the number of documents, memory consumption, etc
            */
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.redis.send_command('FT.INFO', [_this.indexName], function (err, response) {
                if (err) {
                    reject(err);
                }
                resolve(response);
            });
        });
    };
    Client.prototype._mkQueryArgs = function (query) {
        var args = [this.indexName];
        if (typeof query === 'string') {
            query = new Query_1.Query(query);
        }
        args.push.apply(args, query.getArgs());
        return { args: args, query: query };
    };
    Client.prototype.search = function (query) {
        /*
            Search the index for a given query, and return a result of documents
                ### Parameters
                - **query**: the search query. Either a text for simple queries with default parameters, or a Query object for complex queries.
                            See RediSearch's documentation on query format
                - **snippet_sizes**: A dictionary of {field: snippet_size} used to trim and format the result. e.g.e {'body': 500}
            */
        var _this = this;
        var queryArgs = this._mkQueryArgs(query);
        var builtQuery = queryArgs.query;
        var args = queryArgs.args;
        var st = new Date().getTime();
        return new Promise(function (resolve, reject) {
            _this.redis.send_command(Client.SEARCH_CMD, args, function (err, response) {
                if (err) {
                    return reject(err);
                }
                resolve(new Result_1.Result(response, builtQuery.hasContent(), {
                    duration: (new Date().getTime() - st) * 1000.0,
                    hasPayload: builtQuery.withPayloads,
                }));
            });
        });
    };
    Client.prototype.explain = function (query) {
        var _this = this;
        var queryArgs = this._mkQueryArgs(query);
        query = queryArgs.query;
        var args = queryArgs.args;
        return new Promise(function (resolve, reject) {
            _this.redis.send_command(Client.EXPLAIN_CMD, [args[0], args.slice(1, args.length).join(' ')], function (err, response) {
                if (err) {
                    reject(err);
                }
                resolve(response);
            });
        });
    };
    /*
          A client for the RediSearch module.
          It abstracts the API of the module and lets you just use the engine
      */
    Client.NUMERIC = 'NUMERIC';
    Client.CREATE_CMD = 'FT.CREATE';
    Client.SEARCH_CMD = 'FT.SEARCH';
    Client.ADD_CMD = 'FT.ADD';
    Client.DROP_CMD = 'FT.DROP';
    Client.EXPLAIN_CMD = 'FT.EXPLAIN';
    Client.DEL_CMD = 'FT.DEL';
    Client.AGGREGATE_CMD = 'FT.AGGREGATE';
    Client.CURSOR_CMD = 'FT.CURSOR';
    Client.NOOFFSETS = 'NOOFFSETS';
    Client.NOFIELDS = 'NOFIELDS';
    Client.STOPWORDS = 'STOPWORDS';
    return Client;
}());
exports.Client = Client;
