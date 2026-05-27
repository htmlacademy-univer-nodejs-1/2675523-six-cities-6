import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createErrorObject } from '../../../helpers/index.js';
import { LoggerInterface } from '../../logger/models/index.js';
import {Component} from '../../../models/index.js';
import {ExceptionFilterInterface} from './models/exception-filter.interface.js';
import {ApplicationError} from '../models/index.js';

@injectable()
export class DefaultExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: LoggerInterface
  ) {
    this.logger.info('Register DefaultExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
