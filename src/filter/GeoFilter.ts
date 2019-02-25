import { Filter } from './Filter';

export class GeoFilter extends Filter {
  public static readonly METERS = 'm';
  public static readonly KILOMETERS = 'km';
  public static readonly FEET = 'ft';
  public static readonly MILES = 'mi';

  constructor(
    field: string,
    lon: number,
    lat: number,
    radius: number,
    options?: {
      unit: 'm' | 'km' | 'ft' | 'mi';
    },
  ) {
    const { unit = GeoFilter.KILOMETERS } = options || {};

    super('GEOFILTER', field, [lon, lat, radius, unit]);
  }
}
