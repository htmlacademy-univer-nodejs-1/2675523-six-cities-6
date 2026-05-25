import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import {MiddlewareInterface} from './models/middleware.interface.js';

export class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor (private readonly _dto: ClassConstructor<object>) {}

  public async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this._dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send(errors);

      return;
    }

    next();
  }
}
