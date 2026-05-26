import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { BaseAuthException } from './exceptions/index.js';
import {ExceptionFilterInterface} from '../../libs/rest/index.js';
import {LoggerInterface} from '../../libs/logger/models/index.js';
import {Component} from '../../models/index.js';

@injectable()
export class AuthExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: LoggerInterface,
  ) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof BaseAuthException)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);
    res.status(error.httpStatusCode)
      .json({
        type: 'AUTHORIZATION',
        error: error.message
      });
  }
}
