"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Query = /** @class */ (function () {
    function Query(queryString) {
        /*
                Create a new query object.
                The query string is set in the constructor, and other options have setter functions.
            */
        this._offset = 0;
        this._num = 10;
        this._noContent = false;
        this._noStopWords = false;
        this._fields = [];
        this._verbatim = false;
        this._withPayloads = false;
        this._filters = [];
        this._ids = [];
        this._slop = -1;
        this._inOrder = false;
        this._sortByFields = {};
        this._returnFields = [];
        this._summarizeFields = [];
        this._highlightFields = [];
        this._language = 'dm:en';
        this.queryString = queryString;
    }
    Query.prototype.limitIds = function (ids) {
        /*
                Limit the results to a specific set of pre-known document ids of any length
            */
        this._ids = ids;
        return this;
    };
    Query.prototype.hasContent = function () {
        return !this._noContent;
    };
    Query.prototype.returnFields = function (fields) {
        this._returnFields = fields;
        return this;
    };
    Query.prototype._mkFieldList = function (fields) {
        /*
                Only return values from these fields
            */
        if (!fields) {
            return [];
        }
        if (typeof fields === 'string') {
            return [fields];
        }
        return fields;
    };
    Query.prototype.summarize = function (options) {
        /*
                Return an abridged format of the field, containing only the segments of
                the field which contain the matching term(s).
                If `fields` is specified, then only the mentioned fields are
                summarized; otherwise all results are summarized.
                Server side defaults are used for each option (except `fields`) if not specified
                    - **fields** List of fields to summarize. All fields are summarized if not specified
                    - **context_len** Amount of context to include with each fragment
                    - **numFrags** Number of fragments per document
                    - **sep** Separator string to separate fragments
            */
        var _a = (options || {}).fields, fields = _a === void 0 ? [] : _a;
        var _b = options || {}, _c = _b.contextLen, contextLen = _c === void 0 ? null : _c, _d = _b.numFrags, numFrags = _d === void 0 ? null : _d, _e = _b.sep, sep = _e === void 0 ? null : _e;
        var args = ['SUMMARIZE'];
        fields = this._mkFieldList(fields);
        if (fields) {
            args.push.apply(args, ['FIELDS', fields.length].concat(fields));
        }
        if (contextLen !== null) {
            args.push('LEN', contextLen);
        }
        if (numFrags !== null) {
            args.push('FRAG', numFrags);
        }
        if (sep !== null) {
            args.push('SEPARATOR', sep);
        }
        this._summarizeFields = args;
        return this;
    };
    Query.prototype.highlight = function (options) {
        /*
                Apply specified markup to matched term(s) within the returned field(s)
                    - **fields** If specified then only those mentioned fields are highlighted, otherwise all fields are highlighted
                    - **tags** A list of two strings to surround the match.
            */
        var _a = (options || {}).fields, fields = _a === void 0 ? [] : _a;
        var _b = (options || {}).tags, tags = _b === void 0 ? null : _b;
        var args = ['HIGHLIGHT'];
        fields = this._mkFieldList(fields);
        if (fields.length) {
            args.push.apply(args, ['FIELDS', fields.length.toString()].concat(fields));
        }
        if (tags) {
            args.push.apply(args, ['TAGS'].concat(tags));
        }
        this._highlightFields = args;
        return this;
    };
    Query.prototype.language = function (language) {
        /*
                Analyze the query as being in the specified language
                :param language: The language (e.g. `chinese` or `english`)
            */
        this._language = language;
        return this;
    };
    Query.prototype.slop = function (slop) {
        /*
                Allow a maximum of N intervening non matched terms between phrase terms (0 means exact phrase)
            */
        this._slop = slop;
        return this;
    };
    Query.prototype.inOrder = function () {
        /*
                Match only documents where the query terms appear in the same order in the document.
                i.e. for the query 'hello world', we do not match 'world hello'
            */
        this._inOrder = true;
        return this;
    };
    Query.prototype.getArgs = function () {
        /*
                Format the redis arguments for this query and return them
            */
        var _this = this;
        var args = [this.queryString];
        if (this._noContent) {
            args.push('NOCONTENT');
        }
        if (this._fields.length) {
            args.push.apply(args, ['INFIELDS', this._fields.length.toString()].concat(this._fields));
        }
        if (this._verbatim) {
            args.push('VERBATIM');
        }
        if (this._noStopWords) {
            args.push('NOSTOPWORDS');
        }
        if (this._filters) {
            this._filters.forEach(function (flt) {
                args.push.apply(args, flt.args);
            });
        }
        if (this._withPayloads) {
            args.push('WITHPAYLOADS');
        }
        if (this._ids.length) {
            args.push.apply(args, ['INKEYS', this._ids.length.toString()].concat(this._ids.map(function (id) { return id.toString(); })));
        }
        if (this._slop >= 0) {
            args.push('SLOP', this._slop.toString());
        }
        if (this._inOrder) {
            args.push('INORDER');
        }
        if (this._returnFields.length) {
            args.push.apply(args, ['RETURN', this._returnFields.length.toString()].concat(this._returnFields));
        }
        Object.keys(this._sortByFields).forEach(function (fieldName, index) {
            if (index === 0) {
                args.push('SORTBY');
            }
            args.push(fieldName, _this._sortByFields[fieldName]);
        });
        if (this._language) {
            args.push('LANGUAGE', this._language.toString());
        }
        args.push.apply(args, this._summarizeFields.concat(this._highlightFields));
        args.push('LIMIT', this._offset.toString(), this._num.toString());
        return args;
    };
    Query.prototype.paging = function (offset, num) {
        /*
            Set the paging for the query (defaults to 0..10).
                - **offset**: Paging offset for the results. Defaults to 0
                - **num**: How many results do we want
            */
        this._offset = offset;
        this._num = num;
        return this;
    };
    Query.prototype.verbatim = function () {
        /*
                Set the query to be verbatim, i.e. use no query expansion or stemming
            */
        this._verbatim = true;
        return this;
    };
    Query.prototype.noContent = function () {
        /*
                Set the query to only return ids and not the document content
            */
        this._noContent = true;
        return this;
    };
    Query.prototype.noStopWords = function () {
        /*
                Prevent the query from being filtered for stopwords.
                Only useful in very big queries that you are certain contain no stopwords.
            */
        this._noStopWords = true;
        return this;
    };
    Query.prototype.withPayloads = function () {
        /*
                Ask the engine to return document payloads
            */
        this._withPayloads = true;
        return this;
    };
    Query.prototype.limitFields = function (fields) {
        /*
                Limit the search to specific TEXT fields only
                    - **fields**: A list of strings, case sensitive field names from the defined schema
            */
        this._fields = fields;
        return this;
    };
    Query.prototype.addFilter = function (flt) {
        /*
                Add a numeric or geo filter to the query.
                **Currently only one of each filter is supported by the engine**
                    - **flt**: A NumericFilter or GeoFilter object, used on a corresponding field
            */
        this._filters.push(flt);
        return this;
    };
    Query.prototype.sortBy = function (field, direction) {
        if (direction === void 0) { direction = 'DESC'; }
        this._sortByFields[field] = direction;
        return this;
    };
    return Query;
}());
exports.Query = Query;
