import { Document } from './Document';
import { Field } from './field/Field';
import { Query } from './Query';
import { Result } from './Result';

export type Languages = 'english' | 'chinese';
export type LanguagePhonetics = 'dm:en' | 'dm:fr' | 'dm:pt' | 'dm:es';

export type RedisField = string | number;

import * as redis from 'redis';

/** @type {Client} */
export class Client {
  /*
        A client for the RediSearch module. 
        It abstracts the API of the module and lets you just use the engine 
    */

  public static readonly NUMERIC = 'NUMERIC';

  public static readonly CREATE_CMD = 'FT.CREATE';
  public static readonly SEARCH_CMD = 'FT.SEARCH';
  public static readonly ADD_CMD = 'FT.ADD';
  public static readonly DROP_CMD = 'FT.DROP';
  public static readonly EXPLAIN_CMD = 'FT.EXPLAIN';
  public static readonly DEL_CMD = 'FT.DEL';
  public static readonly AGGREGATE_CMD = 'FT.AGGREGATE';
  public static readonly CURSOR_CMD = 'FT.CURSOR';

  public static readonly NOOFFSETS = 'NOOFFSETS';
  public static readonly NOFIELDS = 'NOFIELDS';
  public static readonly STOPWORDS = 'STOPWORDS';

  // Double Metaphone for English, French, Portuguese, Spanish

  public indexName: RedisField;
  public redis: any;

  constructor(
    indexName: RedisField,
    options?: {
      host: string;
      port: number;
      conn: any;
    },
  ) {
    /*
            Create a new Client for the given index_name, and optional host and port
            If conn is not None, we employ an already existing redis connection
        */
    const { host = 'localhost', port = 6379, conn = null } = options || {};

    if (!indexName) {
      throw new Error('Index name is required');
    }

    this.indexName = indexName;

    if (conn === null) {
      this.redis = redis.createClient(port, host);
    } else {
      this.redis = conn;
    }
  }

  public create(
    fields: Field[] = [],
    options?: {
      noTermOffsets: boolean;
      noFieldFlags: boolean;
      stopWords: RedisField | RedisField[];
    },
  ): Promise<boolean> {
    /*
            Create the search index. The index must not already exist.

            ### Parameters:
                - **fields**: a list of TextField or NumericField objects
                - **noTermOffsets**: If true, we will not save term offsets in the index
                - **noFieldFlags**: If true, we will not save field flags that allow searching in specific fields
                - **stopWords**: If not null, we create the index with this custom stopword list. The list can be empty
        */

    const { noTermOffsets = false, noFieldFlags = false, stopWords = null } = options || {};

    const args: RedisField[] = [this.indexName];

    if (noTermOffsets) {
      args.push(Client.NOOFFSETS);
    }
    if (noFieldFlags) {
      args.push(Client.NOFIELDS);
    }
    if (stopWords) {
      if (Array.isArray(stopWords)) {
        args.push(Client.STOPWORDS, stopWords.length.toString(), ...stopWords);
      } else {
        args.push(Client.STOPWORDS, 1, stopWords);
      }
    }

    args.push('SCHEMA');

    fields.forEach(field => args.push(field.name, ...field.args));

    return new Promise((resolve, reject) => {
      this.redis.send_command(Client.CREATE_CMD, args, (err: Error, response?: string) => {
        if (err) {
          return reject(err);
        }
        resolve(response === 'OK');
      });
    });
  }

  public drop(): Promise<boolean> {
    /*
            Drop the index if it exists
        */

    return new Promise((resolve, reject) => {
      this.redis.send_command(Client.DROP_CMD, [this.indexName], (err: Error, response?: string) => {
        if (err) {
          return reject(err);
        }
        resolve(response === 'OK');
      });
    });
  }

  public add(
    id: string | number,
    fields: { [F in RedisField]: RedisField } = {},
    options?: {
      noSave: boolean;
      replace: boolean;
      score: number;
      payload: string | number;
      partial: boolean;
      language: Languages;
    },
  ): Promise<boolean> {
    const { noSave = false, score = 1.0, payload = null, replace = false, partial = false, language = null } =
      options || {};

    if (partial && !replace) {
      throw new Error("Argument 'partial' requires 'replace' argument is true");
    }

    const args: Array<string | number> = [this.indexName, id, score];

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

    Object.keys(fields).forEach(fieldName => args.push(fieldName, fields[fieldName]));

    return new Promise((resolve, reject) => {
      this.redis.send_command(Client.ADD_CMD, args, (err: Error, response?: string) => {
        if (err) {
          return reject(err);
        }
        resolve(response === 'OK');
      });
    });
  }

  public del(id: string | number, options?: { dd: boolean }): Promise<boolean> {
    /*
            Delete a document from index
            Returns 1 if the document was deleted, 0 if not
        */

    const { dd = false } = options || {};

    const args: Array<string | number> = [this.indexName, id.toString()];

    if (dd) {
      args.push('DD');
    }

    return new Promise((resolve, reject) => {
      this.redis.send_command(Client.DEL_CMD, args, (err: Error, response?: string) => {
        if (err) {
          return reject(err);
        }
        resolve(!!response);
      });
    });
  }

  public get(id: string | number): Promise<Document> {
    /*
            Load a single document by id
        */

    return new Promise((resolve, reject) => {
      this.redis.hgetall(id, (err: Error, fields: any) => {
        if (err) {
          return reject(err);
        }

        return resolve(new Document(id, fields));
      });
    });
  }

  public info(): Promise<string> {
    /*
            Get info an stats about the the current index, including the number of documents, memory consumption, etc
        */

    return new Promise((resolve, reject) => {
      this.redis.send_command('FT.INFO', [this.indexName], (err: Error, response: string) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  public _mkQueryArgs(query: RedisField | Query): { args: RedisField[]; query: Query } {
    const args: RedisField[] = [this.indexName];

    if (!(query instanceof Query)) {
      query = new Query(query);
    }

    args.push(...query.getArgs());

    return { args, query };
  }

  public search(query: RedisField | Query): Promise<Result> {
    /*
        Search the index for a given query, and return a result of documents
            ### Parameters
            - **query**: the search query. Either a text for simple queries with default parameters, or a Query object for complex queries.
                        See RediSearch's documentation on query format
            - **snippet_sizes**: A dictionary of {field: snippet_size} used to trim and format the result. e.g.e {'body': 500}
        */

    const queryArgs = this._mkQueryArgs(query);

    const builtQuery = queryArgs.query;
    const args: RedisField[] = queryArgs.args;

    const st = new Date().getTime();

    return new Promise((resolve, reject) => {
      this.redis.send_command(Client.SEARCH_CMD, args, (err: Error, response: any) => {
        if (err) {
          return reject(err);
        }
        resolve(
          new Result(response, !builtQuery._noContent, {
            duration: (new Date().getTime() - st),
            hasPayload: builtQuery._withPayloads,
          }),
        );
      });
    });
  }

  public explain(query: RedisField | Query): Promise<string> {
    const queryArgs = this._mkQueryArgs(query);

    query = queryArgs.query;
    const args: RedisField[] = queryArgs.args;

    return new Promise((resolve, reject) => {
      this.redis.send_command(
        Client.EXPLAIN_CMD,
        [args[0], args.slice(1, args.length).join(' ')],
        (err: Error, response: string) => {
          if (err) {
            reject(err);
          }
          resolve(response);
        },
      );
    });
  }
}
