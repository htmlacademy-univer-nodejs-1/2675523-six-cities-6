import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/index.js';
import {MiddlewareInterface} from './models/middleware.interface.js';

export class ValidateObjectIdMiddleware implements MiddlewareInterface {
  constructor(private readonly _param: string) {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const raw = params[this._param];
    const objectId = Array.isArray(raw) ? raw[0] : raw;

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
