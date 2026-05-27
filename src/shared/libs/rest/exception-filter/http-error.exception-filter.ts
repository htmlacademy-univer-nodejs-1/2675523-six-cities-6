import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/index.js';
import { createErrorObject } from '../../../helpers/index.js';
import {ExceptionFilterInterface} from './models/exception-filter.interface.js';
import {Component} from '../../../models/index.js';
import {LoggerInterface} from '../../logger/models/index.js';
import {ApplicationError} from '../models/index.js';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: LoggerInterface
  ) {
    this.logger.info('HttpErrorExceptionFilter registered');
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`, error);
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
