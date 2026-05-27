import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import {MiddlewareInterface} from './models/middleware.interface.js';
import {DocumentExistsInterface} from '../models/index.js';
import { getRequestParam } from '../helpers/index.js';

export class DocumentExistsMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentExistsInterface,
    private readonly entityName: string,
    private readonly paramName: string
  ) {}

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = getRequestParam(params, this.paramName);

    if (!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
