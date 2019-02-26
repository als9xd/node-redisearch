import { Filter } from './Filter';

export class NumericFilter extends Filter {
  public static readonly INF = '+inf';
  public static readonly NEG_INF = '-inf';

  constructor(
    field: string,
    minval: number,
    maxval: number,
    options?: {
      minExclusive?: boolean;
      maxExclusive?: boolean;
    },
  ) {
    const { minExclusive = false, maxExclusive = false } = options || {};

    const args = [minExclusive ? minval : `(${minval}`, maxExclusive ? maxval : `(${maxval}`];

    super('FILTER', field, args);
  }
}
