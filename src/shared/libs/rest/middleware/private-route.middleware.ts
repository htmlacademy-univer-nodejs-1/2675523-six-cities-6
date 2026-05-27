import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import {MiddlewareInterface} from './models/middleware.interface.js';

export class PrivateRouteMiddleware implements MiddlewareInterface {
  constructor(
    private readonly isForbiddenForAuthorized?: boolean
  ) {}

  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!this.isForbiddenForAuthorized && !tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    if (this.isForbiddenForAuthorized && !!tokenPayload) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'This route is for unauthorized users only',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
