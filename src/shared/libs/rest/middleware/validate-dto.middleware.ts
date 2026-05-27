import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import {validate} from 'class-validator';
import {MiddlewareInterface} from './models/middleware.interface.js';
import {reduceValidationErrors} from '../../../helpers/index.js';
import {ValidationError} from '../errors/index.js';

export class ValidateDtoMiddleware implements MiddlewareInterface {
  constructor (private readonly dto: ClassConstructor<object>) {}

  public async execute({ body, path }: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: ${path}`, reduceValidationErrors(errors));
    }

    next();
  }
}
