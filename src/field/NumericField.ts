import { Field } from './Field';

export class NumericField extends Field {
  /*
        NumericField is used to define a numeric field in a schema defintion
    */

  constructor(
    name: string,
    options?: {
      sortable?: boolean;
      noIndex?: boolean;
    },
  ) {
    const { sortable = false, noIndex = false } = options || {};

    const args = [Field.NUMERIC];

    if (sortable) {
      args.push(Field.SORTABLE);
    }
    if (noIndex) {
      args.push(Field.NOINDEX);
    }

    super(name, args);
  }
}
