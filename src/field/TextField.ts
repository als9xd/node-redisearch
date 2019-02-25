import { RedisField } from '../Client';
import { Field } from './Field';

export class TextField extends Field {
  /*
        TextField is used to define a text field in a schema definition
    */

  public static readonly NOSTEM = 'NOSTEM';

  constructor(
    name: RedisField,
    options?: {
      weight: number;
      sortable: boolean;
      noStem: boolean;
      noIndex: boolean;
    },
  ) {
    const { weight = 1.0, sortable = false, noStem = false, noIndex = false } = options || {};

    const args: RedisField[] = [Field.TEXT, Field.WEIGHT, weight];

    if (sortable) {
      args.push(Field.SORTABLE);
    }
    if (noStem) {
      args.push(TextField.NOSTEM);
    }
    if (noIndex) {
      args.push(Field.NOINDEX);
    }

    super(name, args);
  }
}
