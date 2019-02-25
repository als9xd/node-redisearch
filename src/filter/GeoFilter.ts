import { Filter } from './Filter';

type Unit = 'm' | 'km' | 'ft' | 'mi';

export class GeoFilter extends Filter {
  public static readonly METERS: Unit = 'm';
  public static readonly KILOMETERS: Unit = 'km';
  public static readonly FEET: Unit = 'ft';
  public static readonly MILES: Unit = 'mi';

  constructor(
    field: string,
    lon: number,
    lat: number,
    radius: number,
    options?: {
      unit: Unit;
    },
  ) {
    const { unit = GeoFilter.KILOMETERS } = options || {};

    super('GEOFILTER', field, [lon, lat, radius, unit]);
  }
}
