import { ParamsDictionary } from 'express-serve-static-core';

export type CityRequestParam = {
  city: string;
} | ParamsDictionary;
