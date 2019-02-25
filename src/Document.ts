import { Field } from './field/Field';
import { FieldsObject } from './RedisSearch';

export class Document {
  /*
        Represents a single document in a result set 
    */

  public id: number | string;
  public payload: any;

  constructor(id: number | string, fields: FieldsObject = {}, options?: { payload?: string }) {
    this.id = id;

    const { payload = null } = options || {};

    this.payload = payload;

    Object.assign(this, fields);
  }
}
