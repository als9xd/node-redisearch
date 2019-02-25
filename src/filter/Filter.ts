import { RedisField } from '../Client';

export class Filter {
  public args: RedisField[];

  constructor(keyword: string, field: RedisField, args: RedisField[] = []) {
    this.args = [keyword, field, ...args];
  }
}
