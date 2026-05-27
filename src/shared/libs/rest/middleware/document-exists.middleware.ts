import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import {MiddlewareInterface} from './models/middleware.interface.js';
import {DocumentExistsInterface} from '../models/index.js';
import { getRequestParam } from '../helpers/index.js';

export class DocumentExistsMiddleware implements MiddlewareInterface {
  constructor(
    private readonly _service: DocumentExistsInterface,
    private readonly _entityName: string,
    private readonly _paramName: string
  ) {}

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = getRequestParam(params, this._paramName);

    if (!await this._service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this._entityName} with ${documentId} not found`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
