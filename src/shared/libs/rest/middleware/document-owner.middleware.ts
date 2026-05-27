import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import {MiddlewareInterface} from './models/middleware.interface.js';
import {DocumentOwnerCheckInterface} from '../models/index.js';
import { getRequestParam } from '../helpers/index.js';

export class DocumentOwnerMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentOwnerCheckInterface,
    private readonly entityName: string,
    private readonly paramName: string
  ) {}

  public async execute({ params, tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = getRequestParam(params, this.paramName);
    const ownerId = await this.service.getOwnerId(documentId);

    if (ownerId !== tokenPayload.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `You are not the owner of this ${this.entityName}`,
        'DocumentOwnerMiddleware'
      );
    }

    next();
  }
}
