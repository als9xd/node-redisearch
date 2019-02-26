import { Field } from './Field';

export class TagField extends Field {
  /*
        TagField is a tag-indexing field with simpler compression and tokenization. 
        See http://redisearch.io/Tags/
    */

  constructor(
    name: string,
    options?: {
      seperator?: string;
      noIndex?: boolean;
    },
  ) {
    super(name, [Field.TAG]);

    const { seperator = ',', noIndex = false } = options || {};

    if (seperator !== ',') {
      this.args.push(Field.SEPARATOR);
      this.args.push(seperator);
    }

    if (noIndex) {
      this.args.push(Field.NOINDEX);
    }
  }
}
