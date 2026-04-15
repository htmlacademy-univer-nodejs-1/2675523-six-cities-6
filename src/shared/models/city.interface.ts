export const CITY_NAMES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
] as const;

export type CityName = typeof CITY_NAMES[number];

export const findCityName = (value: string): CityName | undefined =>
  CITY_NAMES.find((city) => city === value);
