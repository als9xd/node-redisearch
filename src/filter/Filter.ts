export class Filter {
  public args: Array<string | number>;

  constructor(keyword: string, field: string, args?: Array<string | number>) {
    this.args = [keyword, field, ...args];
  }
}
