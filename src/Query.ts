import { Languages, RedisField } from './Client';
import { Filter } from './filter/Filter';

type SortDirection = 'ASC' | 'DESC';

export class Query {
  public _noContent = false;
  public _withPayloads = false;
  /*
        Query is used to build complex queries that have more parameters than just the query string.
        The query string is set in the constructor, and other options have setter functions.
        The setter functions return the query object, so they can be chained, 
        i.e. `Query("foo").verbatim().filter(...)` etc.
    */

  private queryString: RedisField;

  private _offset = 0;
  private _num = 10;
  private _noStopWords = false;
  private _fields: RedisField[] = [];
  private _verbatim = false;
  private _filters: Filter[] = [];
  private _ids: RedisField[] = [];
  private _slop = -1;
  private _inOrder = false;
  private _sortByFields: { [F in RedisField]: SortDirection } = {};
  private _returnFields: RedisField[] = [];
  private _summarizeFields: RedisField[] = [];
  private _highlightFields: RedisField[] = [];
  private _language: Languages = 'english';

  constructor(queryString: RedisField) {
    /*
            Create a new query object. 
            The query string is set in the constructor, and other options have setter functions.
        */

    this.queryString = queryString;
  }

  public limitIds(ids: RedisField[]): Query {
    /*
            Limit the results to a specific set of pre-known document ids of any length
        */

    this._ids = ids;
    return this;
  }

  public hasContent(): boolean {
    return !this._noContent;
  }

  public returnFields(fields: RedisField[]): Query {
    this._returnFields = fields;
    return this;
  }

  public _mkFieldList(fields?: RedisField[] | RedisField): RedisField[] {
    if (!fields) {
      return [];
    }

    return Array.isArray(fields) ? fields : [fields];
  }

  public summarize(options?: { fields: RedisField[]; contextLen: number; numFrags: number; sep: string }): Query {
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

    let { fields = [] } = options || {};
    const { contextLen = null, numFrags = null, sep = null } = options || {};

    const args: RedisField[] = ['SUMMARIZE'];
    fields = this._mkFieldList(fields);

    if (fields) {
      args.push('FIELDS', fields.length, ...fields);
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
  }

  public highlight(options?: { fields: RedisField[]; tags: RedisField[] }): Query {
    /*
            Apply specified markup to matched term(s) within the returned field(s)
                - **fields** If specified then only those mentioned fields are highlighted, otherwise all fields are highlighted
                - **tags** A list of two strings to surround the match.
        */

    let { fields = [] } = options || {};
    const { tags = null } = options || {};

    const args: RedisField[] = ['HIGHLIGHT'];
    fields = this._mkFieldList(fields);

    if (fields.length) {
      args.push('FIELDS', fields.length.toString(), ...fields);
    }
    if (tags) {
      args.push('TAGS', ...tags);
    }

    this._highlightFields = args;
    return this;
  }

  public language(language: Languages): Query {
    /*
            Analyze the query as being in the specified language
            :param language: The language (e.g. `chinese` or `english`)
        */

    this._language = language;
    return this;
  }

  public slop(slop: number): Query {
    /*
            Allow a maximum of N intervening non matched terms between phrase terms (0 means exact phrase)
        */

    this._slop = slop;
    return this;
  }

  public inOrder(): Query {
    /*
            Match only documents where the query terms appear in the same order in the document.
            i.e. for the query 'hello world', we do not match 'world hello'
        */

    this._inOrder = true;
    return this;
  }

  public getArgs(): RedisField[] {
    /*
            Format the redis arguments for this query and return them
        */

    const args: RedisField[] = [this.queryString];

    if (this._noContent) {
      args.push('NOCONTENT');
    }

    if (this._fields.length) {
      args.push('INFIELDS', this._fields.length.toString(), ...this._fields);
    }

    if (this._verbatim) {
      args.push('VERBATIM');
    }

    if (this._noStopWords) {
      args.push('NOSTOPWORDS');
    }

    if (this._filters) {
      this._filters.forEach(flt => {
        args.push(...flt.args);
      });
    }

    if (this._withPayloads) {
      args.push('WITHPAYLOADS');
    }

    if (this._ids.length) {
      args.push('INKEYS', this._ids.length.toString(), ...this._ids.map(id => id.toString()));
    }

    if (this._slop >= 0) {
      args.push('SLOP', this._slop.toString());
    }

    if (this._inOrder) {
      args.push('INORDER');
    }

    if (this._returnFields.length) {
      args.push('RETURN', this._returnFields.length.toString(), ...this._returnFields);
    }

    Object.keys(this._sortByFields).forEach((fieldName, index) => {
      if (index === 0) {
        args.push('SORTBY');
      }
      args.push(fieldName, this._sortByFields[fieldName]);
    });

    if (this._language) {
      args.push('LANGUAGE', this._language.toString());
    }

    args.push(...this._summarizeFields, ...this._highlightFields);

    args.push('LIMIT', this._offset.toString(), this._num.toString());

    return args;
  }

  public paging(offset: number, num: number): Query {
    /*
        Set the paging for the query (defaults to 0..10).
            - **offset**: Paging offset for the results. Defaults to 0
            - **num**: How many results do we want
        */

    this._offset = offset;
    this._num = num;

    return this;
  }

  public verbatim(): Query {
    /*
            Set the query to be verbatim, i.e. use no query expansion or stemming
        */

    this._verbatim = true;
    return this;
  }

  public noContent(): Query {
    /*
            Set the query to only return ids and not the document content
        */

    this._noContent = true;
    return this;
  }

  public noStopWords(): Query {
    /*
            Prevent the query from being filtered for stopwords. 
            Only useful in very big queries that you are certain contain no stopwords.     
        */

    this._noStopWords = true;
    return this;
  }

  public withPayloads(): Query {
    /*
            Ask the engine to return document payloads
        */

    this._withPayloads = true;
    return this;
  }

  public limitFields(fields: RedisField[]): Query {
    /*
            Limit the search to specific TEXT fields only
                - **fields**: A list of strings, case sensitive field names from the defined schema            
        */

    this._fields = fields;
    return this;
  }

  public addFilter(flt: Filter): Query {
    /*
            Add a numeric or geo filter to the query. 
            **Currently only one of each filter is supported by the engine**
                - **flt**: A NumericFilter or GeoFilter object, used on a corresponding field
        */

    this._filters.push(flt);
    return this;
  }

  public sortBy(field: RedisField, direction: SortDirection = 'DESC'): Query {
    this._sortByFields[field] = direction;
    return this;
  }
}
