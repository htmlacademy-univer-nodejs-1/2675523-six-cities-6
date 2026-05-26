import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { createSecretKey } from 'node:crypto';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { MiddlewareInterface } from './models/middleware.interface.js';
import {TokenPayloadInterface} from '../../../modules/auth/index.js';

function isTokenPayload(payload: unknown): payload is TokenPayloadInterface {
  return (
    (typeof payload === 'object' && payload !== null) &&
    ('id' in payload && typeof payload.id === 'string') &&
    ('name' in payload && typeof payload.name === 'string') &&
    ('type' in payload && typeof payload.type === 'string')
  );
}

export class ParseTokenMiddleware implements MiddlewareInterface {
  constructor(private readonly _jwtSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeaders: string[] | undefined = req.headers?.authorization?.split(' ');
    if (!authorizationHeaders) {
      return next();
    }

    const [, token] = authorizationHeaders;
    try {
      const { payload } = await jwtVerify(token, createSecretKey(this._jwtSecret, 'utf-8'));

      if (isTokenPayload(payload)) {
        req.tokenPayload = { ...payload };
        return next(

        );
      }
    } catch {
      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token',
        'ParseTokenMiddleware'
      ));
    }
  }
}
