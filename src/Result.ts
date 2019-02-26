import { RedisField } from './Client';
import { Document } from './Document';

export class Result {
  /*
        Represents the result of a search query, and has an array of Document objects
    */

  public total: number;
  public duration: number;
  public docs: Document[] = [];

  constructor(
    response: any,
    hasContent: boolean,
    options?: {
      hasPayload: boolean;
      duration: number;
    },
  ) {
    /*
            - **snippets**: An optional dictionary of the form {field: snippet_size} for snippet formatting
        */

    let { hasPayload = false } = options || {};
    const { duration = 0 } = options || {};

    this.total = response[0];
    this.duration = duration;

    let step = 1;
    if (hasContent) {
      step = hasPayload ? 3 : 2;
    } else {
      // we can't have nocontent and payloads in the same response
      hasPayload = false;
    }

    for (let i = 1; i < response.length; i += step) {
      const id = response[i];
      const payload = hasPayload ? response[i + 1] : null;
      const fieldOffsets = hasPayload ? 2 : 1;

      const fields: { [F in RedisField]: RedisField } = {};

      if (hasContent) {
        response[i + fieldOffsets].forEach((field: RedisField, index: number) => {
          if (index % 2 === 0) {
            fields[field] = response[i + fieldOffsets][index + 1];
          }
        });
      }
      const doc = new Document(id, fields, { payload });

      this.docs.push(doc);
    }
  }
}
