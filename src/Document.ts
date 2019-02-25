import { RedisField } from './Client';

export class Document {
  public id: RedisField;
  public payload: RedisField | null;

  constructor(id: RedisField, fields: { [F in RedisField]: RedisField } = {}, options?: { payload?: RedisField }) {
    this.id = id;

    const { payload = null } = options || {};

    this.payload = payload;

    Object.assign(this, fields);
  }
}
