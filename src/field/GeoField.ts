import { Field } from './Field';

export class GeoField extends Field {
  /*
        GeoField is used to define a geo-indexing field in a schema defintion
    */

  constructor(name: string) {
    super(name, [Field.GEO]);
  }
}
