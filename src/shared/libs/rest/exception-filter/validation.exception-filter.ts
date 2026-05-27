import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/index.js';
import { createErrorObject } from '../../../helpers/index.js';
import {ExceptionFilterInterface} from './models/exception-filter.interface.js';
import {Component} from '../../../models/index.js';
import {LoggerInterface} from '../../logger/models/index.js';
import {ApplicationError} from '../models/index.js';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: LoggerInterface
  ) {
    this.logger.info('ValidationExceptionFilter registered');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationException]: ${error.message}`, error);
    error.details.forEach((errorField) => this.logger.debug(`[${errorField.property}] — ${errorField.messages}`));

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ApplicationError.ValidationError, error.message, error.details));
  }
}
