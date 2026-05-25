import { ParamsDictionary } from 'express-serve-static-core';

export type OfferIdRequestParam = {
  offerId: string;
} | ParamsDictionary;
