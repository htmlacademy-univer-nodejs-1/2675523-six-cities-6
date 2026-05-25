import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod, HttpRequest } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';
import { ConfigInterface, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import { UserRdo } from './rdo/user.rdo.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import {Component} from '../../models/index.js';
import {LoggerInterface} from '../../libs/logger/models/index.js';
import {UserServiceInterface} from './models/user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: LoggerInterface,
    @inject(Component.UserService) private readonly _userService: UserServiceInterface,
    @inject(Component.Config) private readonly _config: ConfigInterface<RestSchema>
  ) {
    super(logger);

    this.logger.info('Registering routes for UserController...');
    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/auth/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/auth/logout', method: HttpMethod.Post, handler: this.logout });
    this.addRoute({ path: '/auth/status', method: HttpMethod.Get, handler: this.getStatus });
  }

  public async create(
    { body }: HttpRequest<CreateUserDto>,
    res: Response
  ): Promise<void> {
    const existsUser = await this._userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${body.email} already exists`,
        'UserController'
      );
    }

    const result = await this._userService.create(body, this._config.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: HttpRequest<LoginUserDto>,
    _res: Response
  ): Promise<void> {
    const existsUser = await this._userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found`,
        'UserController'
      );
    }
    if (!(existsUser.getPassword() === body.password)) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Invalid password',
        'UserController'
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  public async logout(
    _req: Request,
    _res: Response
  ): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  public async getStatus(
    _req: Request,
    _res: Response
  ): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }
}
