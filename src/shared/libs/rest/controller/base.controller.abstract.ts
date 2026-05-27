import { injectable } from 'inversify';
import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import {LoggerInterface} from '../../logger/models/index.js';
import {ControllerInterface} from './models/controller.interface.js';
import {RouteInterface} from '../models/index.js';
import {PathTransformer} from '../transform/index.js';

const DEFAULT_CONTENT_TYPE = 'application/json';

@injectable()
export abstract class BaseController implements ControllerInterface {
  private readonly _router: Router;

  protected constructor(protected readonly logger: LoggerInterface, protected readonly pathTransformer: PathTransformer) {
    this._router = Router();
  }

  public get router() {
    return this._router;
  }

  public addRoutes(routes: RouteInterface[]): void {
    routes.forEach((route) => {
      const handlers = [
        ...(route.middlewares?.map((item) => item.execute.bind(item)) ?? []),
        route.handler.bind(this)
      ];

      this._router[route.method](route.path, handlers);
      this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
    });
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    const modifiedData = this.pathTransformer.execute(data as Record<string, unknown>);

    res
      .type(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(modifiedData);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }
}
