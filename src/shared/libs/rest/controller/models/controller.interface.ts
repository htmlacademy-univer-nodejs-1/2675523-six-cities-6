import { Router, Response } from 'express';
import { RouteInterface} from '../../models/index.js';

export interface ControllerInterface {
  readonly router: Router;
  addRoutes(routes: RouteInterface[]): void;
  send<T>(res: Response, statusCode: number, data: T): void;
  ok<T>(res: Response, data: T): void;
  created<T>(res: Response, data: T): void;
  noContent<T>(res: Response, data: T): void;
}
