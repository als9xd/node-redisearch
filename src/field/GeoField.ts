import { Field } from './Field';

export class GeoField extends Field {
  /*
        GeoField is used to define a geo-indexing field in a schema defintion
    */

  constructor(
    name: string,
    options?: {
      noIndex?: boolean;
    },
  ) {
    const { noIndex = false } = options || {};

    const args = [Field.GEO];

    if (noIndex) {
      args.push(Field.NOINDEX);
    }
    super(name, args);
  }
}
