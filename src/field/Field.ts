import { RedisField } from '../Client';

export class Field {
  protected static readonly NUMERIC = 'NUMERIC';
  protected static readonly TEXT = 'TEXT';
  protected static readonly WEIGHT = 'WEIGHT';
  protected static readonly GEO = 'GEO';
  protected static readonly TAG = 'TAG';
  protected static readonly SORTABLE = 'SORTABLE';
  protected static readonly NOINDEX = 'NOINDEX';
  protected static readonly SEPARATOR = 'SEPARATOR';

  public name: RedisField;
  public args: RedisField[];

  constructor(name: RedisField, args: RedisField[] = []) {
    this.name = name;
    this.args = args;
  }
}
